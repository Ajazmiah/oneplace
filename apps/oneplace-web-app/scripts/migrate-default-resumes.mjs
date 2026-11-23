// One-time migration: turn each user's saved "default resume" into the first resume of their
// resume library (see src/database/models/resumeModel.js).
//
// Run from apps/oneplace-web-app:
//
//   1. Dry run (default). Reads only, prints what would happen:
//        node --env-file=.env scripts/migrate-default-resumes.mjs
//
//   2. Apply:
//        node --env-file=.env scripts/migrate-default-resumes.mjs --apply
//
// For each user, the newest defaultresumes doc becomes a `resumes` doc that reuses the same
// S3 key (no copy). Older duplicate default docs are dropped and their files deleted from S3:
// applications never point at them, they kept their own copies. Then every defaultresumes
// doc is deleted. Safe to re-run: a user whose key is already in the library is skipped.
//
// Existing applications are untouched; their own resume copies keep working.
// Run it locally, then against production right after deploying the resume library.
//
// Uses raw collections: the app's models import through the "@/" alias, which plain node
// can't resolve.

import mongoose from "mongoose";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const APPLY = process.argv.includes("--apply");
const MAX_RESUMES = 3; // same as MAX_RESUMES in src/app/lib/constants.js

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

const stats = { users: 0, created: 0, alreadyMigrated: 0, libraryFull: 0, noFile: 0, duplicateFiles: 0 };

async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const defaults = db.collection("defaultresumes");
  const resumes = db.collection("resumes");

  console.log(APPLY ? "Applying migration\n" : "Dry run (pass --apply to write)\n");

  // Newest first, so the first doc seen per user is the one to keep
  const byUser = new Map();
  for await (const doc of defaults.find({}).sort({ updatedAt: -1 })) {
    const userId = doc.userId?.toString();
    if (!userId) continue;
    if (!byUser.has(userId)) byUser.set(userId, []);
    byUser.get(userId).push(doc);
  }

  const filesToDelete = [];

  for (const [userId, docs] of byUser) {
    stats.users++;
    const [newest, ...older] = docs;
    const file = newest.resume;
    const userObjectId = newest.userId;

    if (!file?.key) {
      console.warn(`  user ${userId}: newest default resume has no S3 key, skipped`);
      stats.noFile++;
    } else if (await resumes.findOne({ key: file.key })) {
      console.log(`  user ${userId}: already in the library`);
      stats.alreadyMigrated++;
    } else if ((await resumes.countDocuments({ userId: userObjectId, archived: false })) >= MAX_RESUMES) {
      console.warn(`  user ${userId}: library already full, default resume not added`);
      stats.libraryFull++;
    } else {
      console.log(`  user ${userId}: add "${file.filename}" (${file.key})`);
      stats.created++;
      if (APPLY) {
        const now = new Date();
        await resumes.insertOne({
          userId: userObjectId,
          filename: file.filename || "resume",
          mimetype: file.mimetype,
          size: file.size,
          key: file.key,
          lastUsedAt: newest.updatedAt ?? now,
          archived: false,
          createdAt: newest.createdAt ?? now,
          updatedAt: now,
          __v: 0,
        });
      }
    }

    // Older duplicates: their files aren't used by anything (unless a library doc reuses one)
    for (const doc of older) {
      const key = doc.resume?.key;
      if (!key || key === file?.key) continue;
      if (await resumes.findOne({ key })) continue;
      console.log(`  user ${userId}: delete duplicate default file ${key}`);
      filesToDelete.push(key);
      stats.duplicateFiles++;
    }
  }

  if (APPLY) {
    for (let i = 0; i < filesToDelete.length; i += 1000) {
      const batch = filesToDelete.slice(i, i + 1000);
      const { Errors } = await s3.send(
        new DeleteObjectsCommand({
          Bucket: S3_BUCKET,
          Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
        })
      );
      if (Errors?.length) console.error("  failed to delete:", Errors);
    }

    // Keep any doc whose file couldn't be moved over (no key, or library full) so it isn't lost
    const keepUsers = [];
    for (const [userId, [newest]] of byUser) {
      const migrated = newest.resume?.key && (await resumes.findOne({ key: newest.resume.key }));
      if (!migrated) keepUsers.push(newest.userId);
    }
    const { deletedCount } = await defaults.deleteMany({ userId: { $nin: keepUsers } });
    console.log(`\nDeleted ${deletedCount} defaultresumes docs (${keepUsers.length} users kept for review)`);
  }

  console.log("\nSummary:", stats);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
