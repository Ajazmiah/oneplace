import Application from "@/database/models/addApplicationModel";
import { Types } from "mongoose";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { fileViewResponse } from "@/app/lib/s3/applicationFiles";

export async function GET(req, context) {
  const session = await getCachedAuthSession();
  const params = await context.params;

  if (!session) return new Response("Unauthorized", { status: 401 });

  if (!Types.ObjectId.isValid(params.id)) {
    return new Response("Invalid application id", { status: 400 });
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Filtering by userId means another user's id is simply "not found"
  const application = await Application.findOne({
    _id: params.id,
    userId: user._id,
  })
    .select("coverLetter")
    .lean();

  if (!application) {
    return new Response("Cover letter not found", { status: 404 });
  }

  return fileViewResponse(application.coverLetter, "Cover letter");
}
