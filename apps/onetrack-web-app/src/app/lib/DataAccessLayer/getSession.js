"use server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDb } from "@/database/dbConnection";

export async function getUserSession() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  await connectDb();

  return session;
}
