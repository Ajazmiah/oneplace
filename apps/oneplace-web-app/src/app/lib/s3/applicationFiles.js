// File handling shared by the add-application route, editApplication and the resume library.
// Every function returns the metadata to store in Mongo ({ filename, mimetype, key, size }).
import { validateFile } from "@/app/lib/utils/utils";
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
 * Response that shows a stored resume or cover letter: a 302 to a short-lived signed S3 URL,
 * so S3 serves the bytes. Call it only after checking that the signed-in user owns the
 * application.
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

  return new Response(`No ${label.toLowerCase()} uploaded`, { status: 404 });
}

/**
 * Turn a browser upload (tmp/<userId>/...) into a stored file: check it belongs to this user,
 * check what actually arrived in S3, then move it into place (an application's folder, or the
 * resume library). Type and size come from S3, never from the client.
 * @param {{ userId: string, applicationId?: string,
 *           kind: "coverletter" | "library-resume", key: string, filename: string }} params
 *        applicationId is required for "coverletter"
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

