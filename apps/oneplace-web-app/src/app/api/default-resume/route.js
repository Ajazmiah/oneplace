import { getDefaultResume } from "@/app/lib/DataAccessLayer/defaultResume";
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

  const resumeData = await getDefaultResume();
  return NextResponse.json({ success: true, resumeData }, { status: 200 });
}
