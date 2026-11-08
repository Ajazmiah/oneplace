import { getSocialLinks } from "@/app/lib/DataAccessLayer/socialLinks";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getCachedAuthSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const socialLinks = await getSocialLinks();
  return NextResponse.json({ success: true, socialLinks }, { status: 200 });
}
