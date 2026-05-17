import Application from "@/database/models/addApplicationModel";
import { Types } from "mongoose";
import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";

export async function GET(req, context) {
  const user = await getUserSession();
  const params = await context.params;

  if (!user) return new Response("Unauthorized", { status: 401 });

  if (!Types.ObjectId.isValid(params.id)) {
    return new Response("Invalid application id", { status: 400 });
  }

  // findById expects just the id
  const application = await Application.findById(params.id);

  //   console.log("APPLICATION FROM ROUTE NEWW---", application.userId + "USER" + user)

  //   if (!application || application.userId !== user._id) {
  //     return new Response("Resume not found", { status: 404 });
  //   }

  if (!application.resume?.data) {
    return new Response("No resume uploaded", { status: 404 });
  }

  return new Response(application.resume.data, {
    headers: {
      "Content-Type": application.resume.mimetype,
      "Content-Disposition": `inline; filename="${application.resume.filename}"`,
    },
  });
}
