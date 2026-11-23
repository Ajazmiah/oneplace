import { cacheTag, cacheLife } from "next/cache";
import Resume from "@/database/models/resumeModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { publicResume } from "@/app/lib/s3/resumeLibrary";
import { getUserSession } from "./getSession";

// Read-only, called from server components and API routes. Not a "use server" file on
// purpose: that would also expose it to the browser as a callable action. Every change to
// the library (upload, delete, an application using a resume) updates this tag.

export async function getCachedResumes(userId) {
  "use cache";
  cacheLife("hours");
  cacheTag(`resumes-${userId}`);

  const resumes = await Resume.find({ userId, archived: false })
    .sort({ lastUsedAt: -1 })
    .lean();
  // Most recently used first, without S3 keys
  return resumes.map(publicResume);
}

/** The signed-in user's resume library, most recently used first. */
export const getResumes = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  if (!user) return [];
  return getCachedResumes(user._id.toString());
};
