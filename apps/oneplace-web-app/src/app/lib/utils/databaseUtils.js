import { cache } from "react";
import { connectDb } from "@/database/dbConnection";
import userModel from "@/database/models/userModel";

export const getUserByEmail = cache(async (email) => {
  if (!email) return null;
  await connectDb();
  // New users are stored lowercased (schema); the case-insensitive collation
  // also matches older records saved with mixed-case emails.
  return await userModel
    .findOne({ email: email.trim().toLowerCase() })
    .collation({ locale: "en", strength: 2 });
});
