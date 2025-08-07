import { connectDb } from "@/database/dbConnection";
import userModel from "@/database/models/userModel";
export const getUserByEmail = async (email) => {
  await connectDb();

  return await userModel.findOne({ email });
};
