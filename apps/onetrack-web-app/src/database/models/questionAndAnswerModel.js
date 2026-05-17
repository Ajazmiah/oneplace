import mongoose from "mongoose";

const questionAndAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
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
  mongoose.models?.["application-questions-answers"] ||
  mongoose.model("application-questions-answers", questionAndAnswerSchema);

export default AddApplication;
