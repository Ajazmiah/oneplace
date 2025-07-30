"use server";

import addApplicationModel from "@/database/models/addApplicationModel";

export async function createApplication(formData) {
  try {
    const jobTitle = formData.get("jobTitle");
    const companyName = formData.get("company");
    const status = formData.get("status");
    const description = formData.get("notes");
    const location = formData.get("location");
    const salaryRange = formData.get("salaryRange");

    if (!jobTitle || !companyName) {
      return {
        success: false,
        message: "Job title and company are required.",
      };
    }

    const application = await addApplicationModel.create({
      jobTitle,
      companyName,
      status,
      description,
      location,
      salaryRange,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(application)),
    };
  } catch (error) {
    console.error("Error creating application:", error);
    return {
      success: false,
      message: "Failed to create application.",
    };
  }
}
