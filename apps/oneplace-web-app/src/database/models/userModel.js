import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    // optional social/profile links — user can add these later or leave blank
    socialLinks: [
      {
        _id: false,
        socialLabel: { type: String, trim: true, required: true },
        url: { type: String, trim: true, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create and export the model
// This is the key change to prevent the "override" error.
// It checks if the "User" model already exists in the Mongoose registry.
const user = mongoose.models?.users || mongoose.model("users", userSchema);

export default user;
