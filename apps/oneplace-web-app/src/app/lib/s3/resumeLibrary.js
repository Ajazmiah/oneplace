// The resume library: each user keeps up to MAX_RESUMES resumes, and applications point at
// one by `resumeId` instead of keeping their own copy. Server-side only; deliberately not a
// "use server" file, so none of this is callable from the browser.
import { Types } from "mongoose";
import Resume, { MAX_RESUMES } from "@/database/models/resumeModel";
import Application from "@/database/models/addApplicationModel";
import { claimUpload, UploadError } from "./applicationFiles";
import { deleteFiles } from "./s3";

export const LIBRARY_FULL_MESSAGE = `You can keep ${MAX_RESUMES} resumes. Delete one on the Resume page to upload another.`;

/** What the browser and extension may see of a resume: never the S3 key. */
export const publicResume = (resume) =>
  resume
    ? {
        _id: resume._id.toString(),
        filename: resume.filename,
        mimetype: resume.mimetype,
        size: resume.size,
      }
    : null;

/**
 * Add a browser upload (tmp/ key from /api/uploads/presign) to the user's library.
 * The count check and the insert aren't atomic, so two uploads at the very same moment could
 * both pass; acceptable for a soft per-user limit.
 * @returns {Promise<object>} the new resume doc (lean)
 * @throws {UploadError} when the library is full or the upload is invalid
 */
export async function addResumeFromUpload({ userId, key, filename }) {
  const count = await Resume.countDocuments({ userId, archived: false });
  if (count >= MAX_RESUMES) throw new UploadError(LIBRARY_FULL_MESSAGE);

  const file = await claimUpload({ userId, kind: "library-resume", key, filename });

  try {
    const resume = await Resume.create({ userId, ...file, lastUsedAt: new Date() });
    return resume.toObject();
  } catch (error) {
    await deleteFiles([file.key]).catch(() => {});
    throw error;
  }
}

/**
 * Work out which library resume an application should use from what the form sent:
 *   resumeId          → an existing (non-archived) resume of this user
 *   resumeKey (+Name) → a new upload, added to the library
 *   useDefaultResume  → the most recently used resume (sent by older extension builds)
 * Marks the chosen resume as used now.
 * @returns {Promise<{ resume: object | null, created: boolean }>}
 *          `created` is true when a new upload was added, so callers can undo it on failure
 * @throws {UploadError} for an unknown id, a full library or a bad upload
 */
export async function resolveResumeChoice({ userId, resumeId, resumeKey, resumeName, useDefault }) {
  let resume = null;
  let created = false;

  if (resumeId) {
    if (!Types.ObjectId.isValid(resumeId)) throw new UploadError("Resume not found.");
    resume = await Resume.findOne({ _id: resumeId, userId, archived: false }).lean();
    if (!resume) throw new UploadError("Resume not found. Please choose it again.");
  } else if (resumeKey) {
    resume = await addResumeFromUpload({ userId, key: resumeKey, filename: resumeName });
    created = true;
  } else if (useDefault) {
    resume = await Resume.findOne({ userId, archived: false }).sort({ lastUsedAt: -1 }).lean();
  }

  if (resume && !created) {
    await Resume.updateOne({ _id: resume._id }, { lastUsedAt: new Date() });
  }
  return { resume, created };
}

/** Delete a resume doc and its file. A failed file delete only leaves an orphan. */
async function destroyResume(resume) {
  await Resume.deleteOne({ _id: resume._id });
  await deleteFiles([resume.key]).catch((error) =>
    console.error("Failed to delete resume file:", error)
  );
}

/**
 * Remove a resume from the user's library. If applications still use it, it's only archived:
 * it leaves the list (freeing a slot) but those applications can still open it.
 * @returns {Promise<boolean>} false when the user has no such resume
 */
export async function removeResume({ userId, resumeId }) {
  if (!Types.ObjectId.isValid(resumeId)) return false;
  const resume = await Resume.findOne({ _id: resumeId, userId, archived: false }).lean();
  if (!resume) return false;

  const inUse = await Application.exists({ userId, resumeId: resume._id });
  if (inUse) {
    await Resume.updateOne({ _id: resume._id }, { archived: true });
  } else {
    await destroyResume(resume);
  }
  return true;
}

/**
 * Call after an application stops using a resume (deleted, or switched to another).
 * An archived resume that no application uses anymore is deleted for good.
 */
export async function releaseResume({ userId, resumeId }) {
  if (!resumeId) return;
  const resume = await Resume.findOne({ _id: resumeId, userId, archived: true }).lean();
  if (!resume) return;

  const inUse = await Application.exists({ userId, resumeId: resume._id });
  if (!inUse) await destroyResume(resume);
}

/** Undo a resume added by resolveResumeChoice when the application it was for didn't save. */
export async function discardNewResume(resume) {
  if (resume) await destroyResume(resume);
}
