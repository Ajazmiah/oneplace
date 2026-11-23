import mongoose from "mongoose";

const addApplicationSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
    },
    // The resume from the user's library (resumeModel) this application was sent with
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resume",
    },
    // Files live in S3; `key` points at the object.
    // `resume` is only on applications created before the resume library: each kept its
    // own copy. Read-only now; new and edited applications use resumeId.
    resume: {
      filename: { type: String }, // Original filename
      mimetype: { type: String }, // e.g. "application/pdf"
      key: { type: String }, // S3 object key
      size: { type: Number }, // Bytes
    },
    coverLetter: {
      filename: { type: String }, // Original filename
      mimetype: { type: String }, // e.g. "application/pdf"
      key: { type: String }, // S3 object key
      size: { type: Number }, // Bytes
    },
    jobUrl: {
      type: String,
      required: false
    },
    description: {
      type: String,
      trim: true,
    },
    salaryRange: {
      type: String,
      trim: true,
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
const AddApplication =
  mongoose.models?.application ||
  mongoose.model("application", addApplicationSchema);

export default AddApplication;
