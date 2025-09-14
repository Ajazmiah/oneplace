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
    resume: {
      filename: { type: String, required: true }, // Original filename
      mimetype: { type: String, required: true }, // e.g. "application/pdf"
      data: { type: Buffer, required: true }, // The file itself (BLOB)
      // userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
      // jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true }
    },
    // coverLetter: {
    //   filename: { type: String, required: true }, // Original filename
    //   mimeType: { type: String, required: true }, // e.g. "application/pdf"
    //   data: { type: Buffer, required: true }, // The file itself (BLOB)
    // },
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
