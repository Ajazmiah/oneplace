// File handling shared by the add-application route and editApplication.
// Every function returns the metadata to store in Mongo ({ filename, mimetype, key, size }).
import defaultResumeModel from "@/database/models/defaultResume";
import { fileResponseHeaders, validateFile } from "@/app/lib/utils/utils";
import {
  buildFileKey,
  isUploadKeyOf,
  getFileInfo,
  copyFile,
  deleteFiles,
  getViewUrl,
} from "./s3";

/** A problem with what the client sent; its message is safe to show the user (HTTP 400). */
export class UploadError extends Error {}

/**
 * Response that shows a stored resume or cover letter. Call it only after checking that
 * the signed-in user owns the application.
 * - S3 files (have a key): 302 to a short-lived signed URL, so S3 serves the bytes.
 * - Legacy files (bytes still in Mongo): streamed as before, until they're migrated.
 * @param {object | undefined} file  application.resume or application.coverLetter
 * @param {string} label             "Resume" or "Cover letter", for the 404 message
 * @returns {Promise<Response>}
 */
export async function fileViewResponse(file, label) {
  if (file?.key) {
    const url = await getViewUrl(file.key, file);
    // Built by hand: Response.redirect() returns immutable headers, so Cache-Control can't be set.
    // no-store keeps the expiring URL out of browser and shared caches.
    return new Response(null, {
      status: 302,
      headers: { Location: url, "Cache-Control": "private, no-store" },
    });
  }

  if (file?.data) {
    return new Response(file.data, {
      headers: { ...fileResponseHeaders(file), "Cache-Control": "private, no-store" },
    });
  }

  return new Response(`No ${label.toLowerCase()} uploaded`, { status: 404 });
}

/**
 * Turn a browser upload (tmp/<userId>/...) into an application's resume or cover letter:
 * check it belongs to this user, check what actually arrived in S3, then move it into the
 * application's folder. Type and size come from S3, never from the client.
 * @param {{ userId: string, applicationId: string, kind: "resume" | "coverletter",
 *           key: string, filename: string }} params
 * @returns {Promise<{ filename: string, mimetype: string, size: number, key: string }>}
 * @throws {UploadError} when the key isn't this user's upload, or the file is missing or invalid
 */
export async function claimUpload({ userId, applicationId, kind, key, filename }) {
  if (!isUploadKeyOf(userId, key)) {
    throw new UploadError("Invalid upload.");
  }

  const info = await getFileInfo(key);
  if (!info) {
    throw new UploadError("Upload not found or expired. Please choose the file again.");
  }

  // S3 already enforced these via the upload policy; checked again in case it ever changes
  const fileError = validateFile({ type: info.mimetype, size: info.size });
  if (fileError) {
    await deleteFiles([key]).catch(() => {});
    throw new UploadError(fileError);
  }

  const finalKey = buildFileKey({ userId, applicationId, kind, mimetype: info.mimetype });
  await copyFile(key, finalKey);

  // The tmp/ lifecycle rule removes it anyway, so a failure here is harmless
  await deleteFiles([key]).catch((error) =>
    console.error("Failed to delete claimed upload:", error)
  );

  return {
    filename: String(filename || "file").slice(0, 255),
    mimetype: info.mimetype,
    size: info.size,
    key: finalKey,
  };
}

/**
 * Resume metadata for an application that uses the saved default resume.
 * S3 defaults are copied into the application's folder so the application owns its copy.
 * Legacy defaults (bytes still in Mongo, no key) are returned as-is until they're migrated.
 * @param {{ userId: string, applicationId: string }} params
 * @returns {Promise<object | null>} null when the user has no default resume
 */
export async function resumeFromDefault({ userId, applicationId }) {
  const saved = await defaultResumeModel.findOne({ userId }).lean();
  const resume = saved?.resume;

  if (resume?.key) {
    const key = buildFileKey({
      userId,
      applicationId,
      kind: "resume",
      mimetype: resume.mimetype,
    });
    await copyFile(resume.key, key);
    return {
      filename: resume.filename,
      mimetype: resume.mimetype,
      size: resume.size,
      key,
    };
  }

  if (resume?.data) {
    return {
      filename: resume.filename,
      mimetype: resume.mimetype,
      data: resume.data,
    };
  }

  return null;
}

/**
 * Make an uploaded application resume the user's default: copy it into default-resume/,
 * point the defaultResume doc at the copy, then delete the previous default's file.
 * @param {{ userId: string, resume: { key: string, filename: string, mimetype: string, size: number } }} params
 */
export async function saveDefaultResume({ userId, resume }) {
  const key = buildFileKey({
    userId,
    kind: "default-resume",
    mimetype: resume.mimetype,
  });
  await copyFile(resume.key, key);

  let previous;
  try {
    // Replacing the whole `resume` subdocument also drops any legacy `data` bytes.
    // `new: false` returns the doc as it was, so the old file can be cleaned up.
    previous = await defaultResumeModel
      .findOneAndUpdate(
        { userId },
        {
          resume: {
            filename: resume.filename,
            mimetype: resume.mimetype,
            size: resume.size,
            key,
          },
        },
        { upsert: true, new: false }
      )
      .lean();
  } catch (error) {
    await deleteFiles([key]).catch(() => {});
    throw error;
  }

  // The new default is saved; failing to remove the old file only leaves an orphan
  try {
    await deleteFiles([previous?.resume?.key]);
  } catch (error) {
    console.error("Failed to delete previous default resume:", error);
  }
}
