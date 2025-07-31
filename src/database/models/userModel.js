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
      required: true,
    },
    // profilePicture: {
    //   type: Object,
    //   required: false,
    // },
    //     bio: {
    //       type: String,
    //       required:false
    //     },
    //     verificationToken: String,
    //     verificationTokenExpiresAt:Date,
    //     isVerified: {
    //       type: Boolean,
    //       default: false
    //     }
  },
  {
    timestamps: true,
  }
);

//hashing password
userSchema.pre("save", async function (next) {
  //if password isn't changed
  if (!this.isModified("password")) {
    next();
  }
  //genSalt is to ensure a unique salt for each password, providing better security.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// userSchema.methods.toJSON = function () {
//   const user = this;
//   //  const userData = user.toObject();

//   delete user.confirmPassword

//   return user

// };

const User = mongoose.model("User", userSchema);

export default User;

//==NOTES ABOUT Mongooose==//
/*
-
In Mongoose, when you create a new document, 
there are two common ways to do it: using new with the model constructor or 
using the create method provided by the model. The 
main difference between these two approaches lies in the way you create and save 
the document.

--When you use the create method, Mongoose automatically 
creates a new document with the provided data and 
saves it to the database in a single step

--So, the primary difference is in the approach to creating and 
saving the document. Using new with the constructor gives you more control 
over the document before saving, while create is a shorter and 
more straightforward way to create and save the document in a single step. 
You can choose the one that best suits your needs in a given situation.



*/
