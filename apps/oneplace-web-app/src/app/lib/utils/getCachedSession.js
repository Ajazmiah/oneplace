import { cache } from "react";
import { auth } from "@/auth";
import { connectDb } from "@/database/dbConnection";

export const getCachedAuthSession = cache(async () => {
  const session = await auth();
  if (session) {
    await connectDb();
  }
  return session;
});
