"use server";
import AddApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { revalidateTag, updateTag } from "next/cache";
import { deleteFiles } from "@/app/lib/s3/s3";
import { claimUpload, UploadError } from "@/app/lib/s3/applicationFiles";
import {
  resolveResumeChoice,
  releaseResume,
  discardNewResume,
} from "@/app/lib/s3/resumeLibrary";

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
    // Resume: `resumeId` switches to a library resume, `resumeKey` adds a new upload to the
    // library and uses it; neither keeps the current one.
    // Files were already uploaded straight to S3 (see /api/uploads/presign), which also keeps
    // this server action under Next's 1MB request limit; only keys and filenames arrive here
    const resumeId = formData.get("resumeId");
    const resumeKey = formData.get("resumeKey");
    const resumeName = formData.get("resumeName");
    const coverLetterKey = formData.get("coverLetterKey");
    const coverLetterName = formData.get("coverLetterName");

    // What's being replaced, released only after the save succeeds
    const oldResumeId = application.resumeId;
    const oldEmbeddedResumeKey = application.resume?.key; // pre-library applications
    const oldCoverLetterKey = application.coverLetter?.key;
    const fileParams = { userId, applicationId: application._id.toString() };

    let resumeChoice = { resume: null, created: false };
    let newCoverLetter = null;

    try {
      if (resumeId || resumeKey) {
        resumeChoice = await resolveResumeChoice({ userId, resumeId, resumeKey, resumeName });
      }
      const newResume = resumeChoice.resume;
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
      if (newResume) {
        application.resumeId = newResume._id;
        application.resume = undefined; // drops a pre-library embedded copy
      }
      if (newCoverLetter) application.coverLetter = newCoverLetter;

      await application.save();
    } catch (error) {
      // The application still points at its old files, so drop the new ones
      await Promise.all([
        resumeChoice.created && discardNewResume(resumeChoice.resume),
        deleteFiles([newCoverLetter?.key]),
      ]).catch((cleanupError) =>
        console.error("Failed to clean up files after a failed edit:", cleanupError)
      );
      throw error;
    }

    // Saved; cleaning up what was replaced can only leave an orphan, so it doesn't fail the edit
    const switchedResume =
      resumeChoice.resume && String(resumeChoice.resume._id) !== String(oldResumeId);
    try {
      await deleteFiles([
        resumeChoice.resume && oldEmbeddedResumeKey,
        newCoverLetter && oldCoverLetterKey,
      ]);
      if (switchedResume) await releaseResume({ userId, resumeId: oldResumeId });
    } catch (error) {
      console.error("Failed to clean up replaced files:", error);
    }

    revalidateTag(`applications-${userId}`);
    revalidateTag(`application-${id}`);
    if (resumeChoice.resume) updateTag(`resumes-${userId}`);
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

    // Only the files are needed back
    const deleted = await AddApplicationModel.findOneAndDelete({
      _id: id,
      userId,
    }).select("resumeId resume.key coverLetter.key");

    if (!deleted) {
      return {
        success: false,
        message: "application not found",
      };
    }

    // The application is gone; failing to remove its files only leaves orphans.
    // A library resume is shared, so it's only deleted if it was archived and this was the
    // last application using it.
    try {
      await deleteFiles([deleted.resume?.key, deleted.coverLetter?.key]);
      await releaseResume({ userId, resumeId: deleted.resumeId });
    } catch (error) {
      console.error("Failed to delete files for application:", error);
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
