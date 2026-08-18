import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getUserSession();

  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await getUserByEmail(session.user.email);

  return NextResponse.json(
    { success: true, socialLinks: user?.socialLinks ?? [] },
    { status: 200 }
  );
}
