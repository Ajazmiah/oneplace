"use server";
import AddApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { revalidateTag } from "next/cache";
import { deleteFiles } from "@/app/lib/s3/s3";
import {
  claimUpload,
  resumeFromDefault,
  UploadError,
} from "@/app/lib/s3/applicationFiles";

export const editApplication = async (id, formData) => {
  try {
    const session = await getUserSession();
    const user = await getUserByEmail(session.user.email);
    const userId = user._id.toString();

    const application = await AddApplicationModel.findOne({ _id: id, userId });
    if (!application) {
      return { success: false, message: "application not found" };
    }

    const jobTitle = formData.get("jobTitle");
    const companyName = formData.get("companyName");
    const status = formData.get("status");
    const description = formData.get("details");
    const location = formData.get("location");
    const salaryRange = formData.get("salaryRange");
    const jobUrl = formData.get("jobUrl");
    const useDefaultResume = formData.get("useDefaultResume");
    // Files were already uploaded straight to S3 (see /api/uploads/presign), which also keeps
    // this server action under Next's 1MB request limit; only keys and filenames arrive here
    const resumeKey = formData.get("resumeKey");
    const resumeName = formData.get("resumeName");
    const coverLetterKey = formData.get("coverLetterKey");
    const coverLetterName = formData.get("coverLetterName");

    // Keys of the files being replaced, deleted only after the save succeeds
    const oldResumeKey = application.resume?.key;
    const oldCoverLetterKey = application.coverLetter?.key;
    const fileParams = { userId, applicationId: application._id.toString() };

    let newResume = null;
    let newCoverLetter = null;

    try {
      if (useDefaultResume === "true") {
        newResume = await resumeFromDefault(fileParams);
      } else if (resumeKey) {
        newResume = await claimUpload({
          ...fileParams,
          kind: "resume",
          key: resumeKey,
          filename: resumeName,
        });
      }
      // Only a new upload replaces the cover letter; no key keeps the existing one
      if (coverLetterKey) {
        newCoverLetter = await claimUpload({
          ...fileParams,
          kind: "coverletter",
          key: coverLetterKey,
          filename: coverLetterName,
        });
      }

      application.jobTitle = jobTitle;
      application.companyName = companyName;
      application.status = status;
      application.description = description;
      application.location = location;
      application.salaryRange = salaryRange;
      application.jobUrl = jobUrl;
      if (newResume) application.resume = newResume;
      if (newCoverLetter) application.coverLetter = newCoverLetter;

      await application.save();
    } catch (error) {
      // The application still points at its old files, so drop the new ones
      await deleteFiles([newResume?.key, newCoverLetter?.key]).catch((cleanupError) =>
        console.error("Failed to clean up S3 files after a failed edit:", cleanupError)
      );
      throw error;
    }

    // Saved; removing the replaced files can only leave an orphan, so it doesn't fail the edit
    try {
      await deleteFiles([
        newResume && oldResumeKey,
        newCoverLetter && oldCoverLetterKey,
      ]);
    } catch (error) {
      console.error("Failed to delete replaced S3 files:", error);
    }

    revalidateTag(`applications-${userId}`);
    revalidateTag(`application-${id}`);
    return {
      success: true,
      message: "Successfully edited",
    };
  } catch (error) {
    if (error instanceof UploadError) {
      return { success: false, message: error.message };
    }
    console.error("Error fetching application:", error.message);
    return {
      success: false,
      message: "Edit failed! something went wrong",
    };
  }
};

export const deleteApplication = async (id) => {
  try {
    const session = await getUserSession();
    const user = await getUserByEmail(session.user.email);
    const userId = user._id.toString();

    // Only the S3 keys are needed back
    const deleted = await AddApplicationModel.findOneAndDelete({
      _id: id,
      userId,
    }).select("resume.key coverLetter.key");

    if (!deleted) {
      return {
        success: false,
        message: "application not found",
      };
    }

    // The application is gone; failing to remove its files only leaves orphans
    try {
      await deleteFiles([deleted.resume?.key, deleted.coverLetter?.key]);
    } catch (error) {
      console.error("Failed to delete S3 files for application:", error);
    }

    revalidateTag(`applications-${userId}`);
    revalidateTag(`application-${id}`);

    return {
      success: true,
      message: "application deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting application:", error.message);
    return {
      success: false,
      message: "deleting application failed!",
    };
  }
};
