"use server";
import AddApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export const getApplications = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  const applications = await AddApplicationModel.find({
    userId: user._id,
  }).populate({ path: "userId" });

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

export const editApplication = async (id, formData) => {
  try {
    const application = await AddApplicationModel.findOneAndUpdate({ _id: id });
    const jobTitle = formData.get("jobTitle");
    const companyName = formData.get("companyName");
    const status = formData.get("status");
    const description = formData.get("details");
    const location = formData.get("location");
    const salaryRange = formData.get("salaryRange");

    application.jobTitle = jobTitle;
    application.companyName = companyName;
    application.status = status;
    application.description = description;
    application.description = description;
    application.location = location;
    application.salaryRange = salaryRange;

    await application.save();

    revalidatePath("/dashboard/applications");
    return {
      success: true,
      message: 'Successfully edited'
    };
  } catch (error) {
    console.error("Error fetching application:", error.message);
    return {
      success: false,
      message: 'Edit failed! something went wrong'
    };
  }
};

export const deleteApplication = async (id) => {
  try {
    await AddApplicationModel.findByIdAndDelete({
      _id: id,
    });
    revalidatePath("/dashboard/applications");
    return {
      success: true,
      message: "application deleted successfully",
    };
  } catch (error) {
    console.log("ERROR", error.message);
    return {
      success: false,
      message: "deleting application failed!",
    };
  }
};
