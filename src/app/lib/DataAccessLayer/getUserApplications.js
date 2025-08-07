import AddApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "@/app/actions/utilsActions";
import { getUserSession } from "./getSession";

async function getApplications() {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  const applications = await AddApplicationModel.find({
    userId: user._id,
  }).populate({ path: "userId" });

  return applications;
}
export default getApplications;
