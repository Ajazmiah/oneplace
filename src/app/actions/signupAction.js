// app/signup/actions.ts
"use server";

import { connectDb } from "@/database/dbConnection";
import userModel from "../../database/models/userModel";

export async function signup({ name, email, password, authUser = null } = {}) {
  await connectDb();

  if (!authUser) {
    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }
  }

   const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return { error: "User already exists with this email" };
    }

  //   const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullname: authUser.name,
    email: authUser.email,
    _id: authUser.id
  });

  return { success: true, user };
}
