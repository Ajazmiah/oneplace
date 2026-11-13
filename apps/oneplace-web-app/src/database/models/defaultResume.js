import mongoose from "mongoose";

const defaultResumeSchema = new mongoose.Schema(
  {
    // File lives in S3; `key` points at the object. `data` is the old in-Mongo copy,
    // kept only until existing files are migrated to S3.
    resume: {
      filename: { type: String }, // Original filename
      mimetype: { type: String }, // e.g. "application/pdf"
      key: { type: String }, // S3 object key
      size: { type: Number }, // Bytes
      data: { type: Buffer }, // Legacy: file bytes stored in Mongo
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // ✅ Correct type for ObjectId
        ref: "users", // ✅ Make sure this matches your user model name (see note below)
        required: true,
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
