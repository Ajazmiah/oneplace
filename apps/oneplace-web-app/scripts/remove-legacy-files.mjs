// One-time cleanup: drop resumes / cover letters that aren't in S3 (bytes still stored in
// Mongo from before the S3 move, or a filename with nothing behind it). Use this instead of
// migrating when the old files don't need keeping. Afterwards the app shows "No resume
// uploaded" for those applications instead of a link that can't open.
//
//   - application resume / coverLetter without an S3 key -> field removed
//   - defaultResume records without an S3 key           -> record deleted
//   - anything with an S3 key                           -> left alone
//
// Run from apps/oneplace-web-app. Dry run first (reads only):
//   MONGO_URI="<uri>" node --env-file=.env scripts/remove-legacy-files.mjs
// Then apply:
//   MONGO_URI="<uri>" node --env-file=.env scripts/remove-legacy-files.mjs --apply
// MONGO_URI set on the command line wins over the one in .env.

import mongoose from "mongoose";

const APPLY = process.argv.includes("--apply");
const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  console.error("MONGO_URI must be set");
  process.exit(1);
}

// Has a file entry (even an empty {}) but no S3 key, so there is nothing the app can serve
const withoutKey = (field) => ({
  [field]: { $exists: true, $ne: null },
  [`${field}.key`]: { $exists: false },
});

async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const applications = db.collection("applications");
  const defaultResumes = db.collection("defaultresumes");

  console.log(`Mode: ${APPLY ? "APPLY" : "dry run"}   DB: ${mongoose.connection.name}\n`);

  for (const field of ["resume", "coverLetter"]) {
    const filter = withoutKey(field);
    const docs = await applications
      .find(filter, { projection: { jobTitle: 1, companyName: 1, [`${field}.filename`]: 1 } })
      .toArray();

    console.log(`application ${field}: ${docs.length} without an S3 file`);
    for (const d of docs) {
      console.log(`  ${d._id}  ${d.jobTitle ?? ""} @ ${d.companyName ?? ""}  (${d[field]?.filename ?? "no filename"})`);
    }

    if (APPLY && docs.length) {
      const result = await applications.updateMany(filter, { $unset: { [field]: "" } });
      console.log(`  -> removed ${field} from ${result.modifiedCount}`);
    }
  }

  const filter = { "resume.key": { $exists: false } };
  const defaults = await defaultResumes
    .find(filter, { projection: { userId: 1, "resume.filename": 1 } })
    .toArray();

  console.log(`\ndefault resumes: ${defaults.length} without an S3 file`);
  for (const d of defaults) {
    console.log(`  ${d._id}  user ${d.userId}  (${d.resume?.filename ?? "no filename"})`);
  }

  if (APPLY && defaults.length) {
    const result = await defaultResumes.deleteMany(filter);
    console.log(`  -> deleted ${result.deletedCount}`);
  }

  console.log(APPLY ? "\nDone." : "\nNothing was changed. Re-run with --apply to remove these.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
