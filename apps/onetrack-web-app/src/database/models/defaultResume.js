import mongoose from "mongoose";

const defaultResumeSchema = new mongoose.Schema(
  {
    resume: {
      filename: { type: String }, // Original filename
      mimetype: { type: String }, // e.g. "application/pdf"
      data: { type: Buffer }, // The file itself (BLOB)
      // userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
      // jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true }
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Avoid OverwriteModelError in dev (especially with Next.js)
const defaultResume =
  mongoose.models?.defaultResume ||
  mongoose.model("defaultResume", defaultResumeSchema);

export default defaultResume;
