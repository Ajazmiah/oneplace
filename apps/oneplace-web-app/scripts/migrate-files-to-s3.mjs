// One-time migration: move resume / cover letter bytes from Mongo into S3.
//
// Run from apps/oneplace-web-app, in this order:
//
//   1. Dry run (default). Reads only, prints what would happen:
//        node --env-file=.env scripts/migrate-files-to-s3.mjs
//
//   2. Upload. Copies each file to S3 and saves its key. The bytes stay in Mongo, so this is
//      safe to stop and re-run; files that already have a key are skipped:
//        node --env-file=.env scripts/migrate-files-to-s3.mjs --upload
//
//   3. Check the app: old applications' files should now open from S3.
//
//   4. Remove the bytes from Mongo. Each file is checked in S3 first (exists, same size);
//      anything that doesn't match is skipped and reported, and keeps its bytes:
//        node --env-file=.env scripts/migrate-files-to-s3.mjs --remove-data
//
// Back up the database before step 4. It is the only step that deletes anything.
//
// The app no longer reads bytes from Mongo. If a database's old files are worth keeping,
// run --upload and --remove-data against it right before deploying, then deploy straight
// away (until then the old code can't open migrated files). If they aren't worth keeping,
// use scripts/remove-legacy-files.mjs instead.

import crypto from "node:crypto";
import mongoose from "mongoose";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import Application from "../src/database/models/addApplicationModel.js";
import DefaultResume from "../src/database/models/defaultResume.js";

const MODE = process.argv.includes("--remove-data")
  ? "remove-data"
  : process.argv.includes("--upload")
    ? "upload"
    : "dry-run";

const { MONGO_URI, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } =
  process.env;
if (!MONGO_URI || !S3_REGION || !S3_BUCKET || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
  console.error(
    "MONGO_URI, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be set (run with --env-file=.env)"
  );
  process.exit(1);
}

// Same S3_* names and explicit credentials as src/app/lib/s3/s3.js
const s3 = new S3Client({
  region: S3_REGION,
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
});

// Same key format and extensions as buildFileKey() in src/app/lib/s3/s3.js.
// Copied rather than imported: that module uses the "@/" alias, which plain node can't resolve.
const EXTENSIONS = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

function buildKey({ userId, applicationId, kind, mimetype }) {
  const ext = EXTENSIONS[mimetype] ?? "bin";
  const id = crypto.randomUUID();
  return kind === "default-resume"
    ? `users/${userId}/default-resume/${id}.${ext}`
    : `users/${userId}/applications/${applicationId}/${kind}-${id}.${ext}`;
}

// Raw collection reads return BSON Binary, not Buffer
function toBuffer(data) {
  if (Buffer.isBuffer(data)) return data;
  // A Binary's backing buffer can be longer than its data; `position` is the real length
  if (data?.buffer) return Buffer.from(data.buffer.subarray(0, data.position ?? data.buffer.length));
  return null;
}

// Every file field that may still hold bytes
const TARGETS = [
  { name: "application resume", model: Application, field: "resume", kind: "resume" },
  { name: "application cover letter", model: Application, field: "coverLetter", kind: "coverletter" },
  { name: "default resume", model: DefaultResume, field: "resume", kind: "default-resume" },
];

const stats = { found: 0, uploaded: 0, removed: 0, skipped: 0, failed: 0 };

async function uploadTarget({ name, model, field, kind }) {
  const cursor = model.collection.find(
    { [`${field}.data`]: { $exists: true }, [`${field}.key`]: { $exists: false } },
    { projection: { userId: 1, [field]: 1 } }
  );

  for await (const doc of cursor) {
    stats.found++;
    const file = doc[field];
    const bytes = toBuffer(file.data);
    const label = `${name} ${doc._id}`;

    if (!bytes?.length || !doc.userId) {
      console.warn(`  skip ${label}: ${!doc.userId ? "no userId" : "empty data"}`);
      stats.skipped++;
      continue;
    }

    const key = buildKey({
      userId: doc.userId.toString(),
      applicationId: doc._id.toString(),
      kind,
      mimetype: file.mimetype,
    });

    if (MODE === "dry-run") {
      console.log(`  would upload ${label} (${bytes.length} bytes) -> ${key}`);
      continue;
    }

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          Body: bytes,
          ContentType: file.mimetype || "application/octet-stream",
          ContentLength: bytes.length,
        })
      );

      // Only set the key if nothing else set one meanwhile (e.g. the user edited the file)
      const result = await model.collection.updateOne(
        { _id: doc._id, [`${field}.key`]: { $exists: false } },
        { $set: { [`${field}.key`]: key, [`${field}.size`]: bytes.length } }
      );

      if (result.modifiedCount === 0) {
        await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
        console.warn(`  skip ${label}: changed during migration`);
        stats.skipped++;
        continue;
      }

      console.log(`  uploaded ${label} -> ${key}`);
      stats.uploaded++;
    } catch (error) {
      console.error(`  FAILED ${label}: ${error.message}`);
      stats.failed++;
    }
  }
}

async function removeDataTarget({ name, model, field }) {
  const cursor = model.collection.find(
    { [`${field}.data`]: { $exists: true }, [`${field}.key`]: { $exists: true } },
    { projection: { [field]: 1 } }
  );

  for await (const doc of cursor) {
    stats.found++;
    const file = doc[field];
    const bytes = toBuffer(file.data);
    const label = `${name} ${doc._id}`;

    try {
      const head = await s3.send(
        new HeadObjectCommand({ Bucket: S3_BUCKET, Key: file.key })
      );

      if (bytes && head.ContentLength !== bytes.length) {
        console.warn(
          `  skip ${label}: S3 size ${head.ContentLength} != Mongo size ${bytes.length}, keeping bytes`
        );
        stats.skipped++;
        continue;
      }

      await model.collection.updateOne(
        { _id: doc._id, [`${field}.key`]: file.key },
        { $unset: { [`${field}.data`]: "" } }
      );
      console.log(`  removed bytes from ${label}`);
      stats.removed++;
    } catch (error) {
      // HeadObject throws NotFound when the object is missing; keep the bytes then
      console.error(`  FAILED ${label}: ${error.name === "NotFound" ? "not in S3" : error.message}, keeping bytes`);
      stats.failed++;
    }
  }
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log(`Mode: ${MODE}   DB: ${mongoose.connection.name}   Bucket: ${S3_BUCKET} (${S3_REGION})\n`);

  for (const target of TARGETS) {
    console.log(`${target.name}s (collection "${target.model.collection.collectionName}")`);
    if (MODE === "remove-data") await removeDataTarget(target);
    else await uploadTarget(target);
  }

  console.log("\nSummary:", stats);
  if (MODE === "dry-run") console.log("Nothing was changed. Re-run with --upload to migrate.");
  if (stats.failed) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
