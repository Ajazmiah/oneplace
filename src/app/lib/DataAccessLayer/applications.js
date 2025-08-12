import AddApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { notFound } from "next/navigation";

export const getApplications = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  const applications = await AddApplicationModel.find({
    userId: user._id,
  }).populate({ path: "userId" });
  console.log("APPLI", applications);

  return applications;
};

export const getSingleApplication = async (id) => {
  try {
    await getUserSession();

    const application = await AddApplicationModel.findById({ _id: id });

    if (!application) {
      notFound();
    }

    return application;
  } catch (error) {
    console.error("Error fetching application:", error.message);
    throw error; // rethrow so the caller can handle it
  }
};

export const editApplication = async (id) => {};

export const deleteApplication = async (id) => {};
