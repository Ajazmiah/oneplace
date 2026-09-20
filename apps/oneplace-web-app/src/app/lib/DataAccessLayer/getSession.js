"use server";
import { redirect } from "next/navigation";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";

export async function getUserSession() {
  const session = await getCachedAuthSession();

  if (!session) {
    redirect("/signin");
  }

  return session;
}
