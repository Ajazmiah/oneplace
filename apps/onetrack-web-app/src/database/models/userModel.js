import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    password: {
      type: String,
      trim: true,
    },
    // ... other fields
  },
  {
    timestamps: true,
  }
);

// Hashing password pre-save hook
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password") || !this.password) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// Create and export the model
// This is the key change to prevent the "override" error.
// It checks if the "User" model already exists in the Mongoose registry.
const user = mongoose.models?.users || mongoose.model("users", userSchema);

export default user;
