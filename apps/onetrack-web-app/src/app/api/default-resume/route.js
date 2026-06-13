import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import defaultResumeModel from "@/database/models/defaultResume";
export async function GET() {
  const session = await getUserSession();
  const params = await context.params;

  if (!session) return new Response("Unauthorized", { status: 401 });

  // 2. Find User
  const user = await getUserByEmail(session.user.email);

  const resumeData = await defaultResumeModel.findOne({ userId: user._id });

  return NextResponse.json(
    { success: true, data: resumeData },
    { status: 201 } // Created
  );


}
