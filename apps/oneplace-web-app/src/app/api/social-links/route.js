import { getSocialLinks } from "@/app/lib/DataAccessLayer/socialLinks";
import { NextResponse } from "next/server";

export async function GET() {
  const socialLinks = await getSocialLinks();
  return NextResponse.json({ success: true, socialLinks }, { status: 200 });
}
