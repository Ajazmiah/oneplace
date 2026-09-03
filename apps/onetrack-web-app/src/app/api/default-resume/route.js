import { getDefaultResume } from "@/app/lib/DataAccessLayer/defaultResume";
import { NextResponse } from "next/server";

export async function GET() {
  const resumeData = await getDefaultResume();
  return NextResponse.json({ success: true, resumeData }, { status: 200 });
}
