"use server";
import DefaultResumeModel from "@/database/models/defaultResume";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedDefaultResume(userId) {
  "use cache";
  cacheLife("hours");
  cacheTag(`default-resume-${userId}`);

  const resumeData = await DefaultResumeModel.findOne({ userId })
    .select("-resume.data")
    .lean();

  return JSON.parse(JSON.stringify(resumeData));
}

export const getDefaultResume = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  return getCachedDefaultResume(user._id.toString());
};
