import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddApplicationModel from "@/database/models/addApplicationModel";

async function getApplications() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const applications = await AddApplicationModel.find();

  return applications;
}
export default getApplications;
