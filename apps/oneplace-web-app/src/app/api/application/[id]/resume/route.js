import Application from "@/database/models/addApplicationModel";
import { Types } from "mongoose";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { fileResponseHeaders } from "@/app/lib/utils/utils";

export async function GET(req, context) {
  const session = await getCachedAuthSession();
  const params = await context.params;

  if (!session) return new Response("Unauthorized", { status: 401 });

  if (!Types.ObjectId.isValid(params.id)) {
    return new Response("Invalid application id", { status: 400 });
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // findById expects just the id
  const application = await Application.findById(params.id);

  if (!application || application.userId.toString() !== user._id.toString()) {
    return new Response("Resume not found", { status: 404 });
  }

  if (!application.resume?.data) {
    return new Response("No resume uploaded", { status: 404 });
  }

  return new Response(application.resume.data, {
    headers: fileResponseHeaders(application.resume)
  });
}
