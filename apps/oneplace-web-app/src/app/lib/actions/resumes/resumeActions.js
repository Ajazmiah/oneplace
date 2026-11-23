"use server";
import { updateTag } from "next/cache";
import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { UploadError } from "@/app/lib/s3/applicationFiles";
import { addResumeFromUpload, removeResume, publicResume } from "@/app/lib/s3/resumeLibrary";

// Manage the resume library from the Resume page. Server actions always answer with HTTP 200, so the
// outcome travels in the returned object; `status` uses HTTP meanings:
//   200 done · 400 invalid input / library full · 404 not found · 500 unexpected
// A signed-out caller never gets here: getUserSession() redirects to /signin.

async function currentUserId() {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  return user?._id.toString() ?? null;
}

/**
 * Add an uploaded file to the library. The browser uploads to S3 first (uploadToS3) and
 * sends only the key and filename.
 * @param {FormData} formData  resumeKey, resumeName
 */
export async function uploadResume(formData) {
  try {
    const userId = await currentUserId();
    if (!userId) return { success: false, status: 404, message: "User not found." };

    const key = formData.get("resumeKey");
    const filename = formData.get("resumeName");
    if (typeof key !== "string" || !key) {
      return { success: false, status: 400, message: "Choose a file to upload." };
    }

    const resume = await addResumeFromUpload({ userId, key, filename });
    updateTag(`resumes-${userId}`);
    return {
      success: true,
      status: 200,
      message: "Resume added.",
      resume: publicResume(resume),
    };
  } catch (error) {
    if (error instanceof UploadError) {
      return { success: false, status: 400, message: error.message };
    }
    console.error("Error adding resume:", error);
    return { success: false, status: 500, message: "Couldn't add the resume. Please try again." };
  }
}

/**
 * Remove a resume from the library. Applications already sent with it keep showing it.
 * @param {string} resumeId
 */
export async function deleteResume(resumeId) {
  try {
    const userId = await currentUserId();
    if (!userId) return { success: false, status: 404, message: "User not found." };

    const removed = await removeResume({ userId, resumeId: String(resumeId ?? "") });
    if (!removed) return { success: false, status: 404, message: "Resume not found." };

    updateTag(`resumes-${userId}`);
    return { success: true, status: 200, message: "Resume deleted." };
  } catch (error) {
    console.error("Error deleting resume:", error);
    return { success: false, status: 500, message: "Couldn't delete the resume. Please try again." };
  }
}
