import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddApplicationModel from "@/database/models/addApplicationModel";
import { connectDb } from "@/database/dbConnection";
import { getUserByEmail } from "@/app/actions/utilsActions";

async function getApplications() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  await connectDb();

  const user = await getUserByEmail(session.user.email)

  console.log("AMAZING USER___", user)

  const applications = await AddApplicationModel.find({userId:user._id}).populate({path: 'userId'})

  console.log("APPLICATINSSS___", applications)

  return applications;
}
export default getApplications;



// function getSingleApplication(id) {

// }