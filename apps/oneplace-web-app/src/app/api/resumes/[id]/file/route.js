import { Types } from "mongoose";
import Resume from "@/database/models/resumeModel";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { fileViewResponse } from "@/app/lib/s3/applicationFiles";

// Opens one of the signed-in user's library resumes: a 302 to a short-lived signed S3 URL.
// Used by View in the web forms, Settings and the extension.
export async function GET(_req, context) {
  const session = await getCachedAuthSession();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return new Response("Invalid resume id", { status: 400 });
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Filtering by userId means another user's id is simply "not found"
  const resume = await Resume.findOne({ _id: id, userId: user._id }).lean();
  return fileViewResponse(resume, "Resume");
}
