import { NextResponse } from "next/server";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getCachedResumes } from "@/app/lib/DataAccessLayer/resumes";

// The signed-in user's resume library, most recently used first, without S3 keys.
// For client components that can't receive it as a prop (the edit application page).
export async function GET() {
  const session = await getCachedAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  const resumes = await getCachedResumes(user._id.toString());
  return NextResponse.json({ success: true, resumes }, { status: 200 });
}
