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
    description: {
      type: String,
      trim: true,
    },
    salaryRange: {
      type: String,
      trim: true,
    },
    userId: {
      type: "ObjectId",
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Avoid OverwriteModelError in dev
const AddApplication =
  mongoose.models?.application ||
  mongoose.model("application", addApplicationSchema);

export default AddApplication;
