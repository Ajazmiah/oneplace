import { connectDb } from "@/database/dbConnection";
import userModel from "@/database/models/userModel";

// Creates the user record on first Google/GitHub sign-in (called from auth.js).
// Server-only: never import this from a client component or mark it "use server",
// or it becomes a public endpoint that creates accounts for any email.
export async function createOAuthUser({ name, email }) {
  await connectDb();
  return userModel.create({ fullname: name, email });
}
