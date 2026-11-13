"use server";
import AddApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { revalidateTag } from "next/cache";
import { validateFile } from "@/app/lib/utils/utils";
import { deleteFiles } from "@/app/lib/s3/s3";
import {
  uploadApplicationFile,
  resumeFromDefault,
} from "@/app/lib/s3/applicationFiles";

const isUploadedFile = (value) => value instanceof File && value.size > 0;

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
    const resume = formData.get("resume");
    const coverLetter = formData.get("coverLetter");
    const jobUrl = formData.get("jobUrl");
    const useDefaultResume = formData.get("useDefaultResume");

    if (isUploadedFile(resume)) {
      const resumeError = validateFile(resume);
      if (resumeError) {
        return { success: false, message: `Resume: ${resumeError}` };
      }
    }
    if (isUploadedFile(coverLetter)) {
      const coverLetterError = validateFile(coverLetter);
      if (coverLetterError) {
        return { success: false, message: `Cover letter: ${coverLetterError}` };
      }
    }

    // Keys of the files being replaced, deleted only after the save succeeds
    const oldResumeKey = application.resume?.key;
    const oldCoverLetterKey = application.coverLetter?.key;
    const fileParams = { userId, applicationId: application._id.toString() };

    let newResume = null;
    let newCoverLetter = null;

    try {
      if (useDefaultResume === "true") {
        newResume = await resumeFromDefault(fileParams);
      } else if (isUploadedFile(resume)) {
        newResume = await uploadApplicationFile({ ...fileParams, kind: "resume", file: resume });
      }
      // Only a real file replaces the cover letter; an empty string or empty File keeps it
      if (isUploadedFile(coverLetter)) {
        newCoverLetter = await uploadApplicationFile({
          ...fileParams,
          kind: "coverletter",
          file: coverLetter,
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

    // Only the S3 keys are needed back, not the (legacy) file bytes
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
