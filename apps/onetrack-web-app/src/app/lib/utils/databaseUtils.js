import { cache } from "react";
import { connectDb } from "@/database/dbConnection";
import userModel from "@/database/models/userModel";

export const getUserByEmail = cache(async (email) => {
  await connectDb();
  return await userModel.findOne({ email });
});
