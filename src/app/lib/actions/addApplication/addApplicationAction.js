"use server";

import addApplicationModel from "@/database/models/addApplicationModel";
import { revalidatePath } from "next/cache";
import { getUserByEmail } from "../../utils/databaseUtils";
import { getUserSession } from "../../DataAccessLayer/getSession";
import { getBuffer } from "../../utils/utils";

export async function createApplication(formData) {
  const session = await getUserSession();

  if (!session?.user?.email) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return {
      success: false,
      message: "User Not Found!",
    };
  }

  try {
    const jobTitle = formData.get("jobTitle");
    const companyName = formData.get("companyName");
    const status = formData.get("status");
    const description = formData.get("details");
    const location = formData.get("location");
    const salaryRange = formData.get("salaryRange");
    const coverLetter = formData.get("coverLetter");
    const resume = formData.get("resume");

    if (!jobTitle || !companyName) {
      return {
        success: false,
        message: "Job title and company are required.",
      };
    }

    let resumeData = null;
    let coverLetterData = null;

    if (resume) {
      resumeData = {
        filename: resume.name,
        mimetype: resume.type,
        data: await getBuffer(resume),
      };
    }
    if (coverLetter) {
      coverLetterData = {
        filename: coverLetter.name,
        mimetype: coverLetter.type,
        data: await getBuffer(coverLetter),
      };
    }

    const application = await addApplicationModel.create({
      jobTitle,
      companyName,
      status: status === "" ? "applied" : status,
      description,
      location,
      salaryRange,
      resume: resumeData,
      coverLetter: coverLetterData,

      userId: user._id, // ✅ this is now safe
    });

    revalidatePath("/dashboard/applications");

    // remove binary data from response
    const responseData = application.toObject();
    delete responseData.resume?.data;
    delete responseData.coverLetter?.data;

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Error creating application:", error.errors.message);
    return {
      success: false,
      message: "Failed to create application.",
    };
  }
}
