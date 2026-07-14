import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import defaultResumeModel from "@/database/models/defaultResume";
import { NextResponse } from "next/server";
export async function GET() {
  const session = await getUserSession();


  if (!session) return new Response("Unauthorized", { status: 401 });

  // 2. Find User
  const user = await getUserByEmail(session.user.email);

  const resumeData = await defaultResumeModel.findOne({ userId: user._id });

  console.log("DEFAULT_RES", resumeData)

  return NextResponse.json(
    { success: true, resumeData },
    { status: 201 } // Created
  );


}
