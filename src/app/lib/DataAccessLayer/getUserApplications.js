import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddApplicationModel from "@/database/models/addApplicationModel";
import { connectDb } from "@/database/dbConnection";

async function getApplications() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  await connectDb();

  const applications = await AddApplicationModel.find();

  return applications;
}
export default getApplications;



// function getSingleApplication(id) {

// }