import { auth } from "@/auth";
export async function session() {
  return await auth();
}
