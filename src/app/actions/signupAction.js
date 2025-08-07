// app/signup/actions.ts

import { connectDb } from "@/database/dbConnection";
import userModel from "../../database/models/userModel";

export async function signup({ name, email, password, authUser = null } = {}) {
  await connectDb();

  if (!authUser) {
    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }
  }

  const user = await userModel.create({
    fullname: authUser.name,
    email: authUser.email,
  });

  return { success: true, user };
}
