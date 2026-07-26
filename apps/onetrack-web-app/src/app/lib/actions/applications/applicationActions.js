"use server";
import AddApplicationModel from "@/database/models/addApplicationModel";
import defaultResumeModel from "@/database/models/defaultResume";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { revalidateTag,revalidatePath } from "next/cache";
import { getBuffer } from "@/app/lib/utils/utils";

export const editApplication = async (id, formData) => {
  try {
    const application = await AddApplicationModel.findOneAndUpdate({ _id: id });
    const jobTitle = formData.get("jobTitle");
    const companyName = formData.get("companyName");
    const status = formData.get("status");
    const description = formData.get("details");
    const location = formData.get("location");
    const salaryRange = formData.get("salaryRange");
    const resume = formData.get("resume");
    const coverLetter = formData.get("coverLetter");
    const jobUrl = formData.get("jobUrl");
    const useDefaultResume = formData.get("useDefaultResume");

    let resumeData = null;
    let coverLetterData = null;

    if (useDefaultResume === "true") {
      const session = await getUserSession();
      const user = await getUserByEmail(session.user.email);
      const saved = await defaultResumeModel.findOne({ userId: user._id });
      if (saved?.resume) resumeData = saved.resume;
    } else if (resume && resume instanceof File && resume.size > 0) {
      resumeData = {
        filename: resume.name,
        mimetype: resume.type,
        data: await getBuffer(resume),
      };
    }
    if (coverLetter) {
      coverLetterData = {
        filename: coverLetter?.name,
        mimetype: coverLetter?.type,
        data: await getBuffer(coverLetter),
      };
    }

    application.jobTitle = jobTitle;
    application.companyName = companyName;
    application.status = status;
    application.description = description;
    application.location = location;
    application.salaryRange = salaryRange;
    application.jobUrl = jobUrl;
    application.resume = resume ? resumeData : application.resume;
    application.coverLetter = coverLetter
      ? coverLetterData
      : application?.coverLetter;

    await application.save();
    revalidateTag(`application-${id}`);
    return {
      success: true,
      message: "Successfully edited",
    };
  } catch (error) {
    console.error("Error fetching application:", error.message);
    return {
      success: false,
      message: "Edit failed! something went wrong",
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
