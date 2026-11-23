import mongoose from "mongoose";
import { MAX_RESUMES } from "@/app/lib/constants";

// A user's resume library (at most MAX_RESUMES). Applications point at one of these by
// `resumeId`, so two applications sent with the same resume share one file.
export { MAX_RESUMES };

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    filename: { type: String, required: true, trim: true, maxlength: 255 }, // Original filename
    mimetype: { type: String, required: true }, // e.g. "application/pdf"
    size: { type: Number, required: true }, // Bytes
    key: { type: String, required: true, unique: true }, // S3 object key
    // Pickers pre-select the most recently used resume
    lastUsedAt: { type: Date, default: Date.now },
    // Removed from the library (frees a slot) but still used by applications. The doc and
    // file are deleted once no application points at it (see releaseResume).
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError on dev hot reloads
const Resume = mongoose.models?.resume || mongoose.model("resume", resumeSchema);

export default Resume;
