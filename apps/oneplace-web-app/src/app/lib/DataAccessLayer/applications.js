"use server";
import AddApplicationModel from "@/database/models/addApplicationModel";
import "@/database/models/resumeModel"; // registers the model for .populate("resumeId")
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { notFound } from "next/navigation";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedApplications(userId) {
  "use cache";
  cacheLife("hours");
  cacheTag(`applications-${userId}`);

  const applications = await AddApplicationModel.find({ userId })
    .populate({ path: "userId" })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(applications));
}

async function getCachedApplication(id, userId) {
  "use cache";
  cacheLife("hours");
  cacheTag(`application-${id}`, `applications-${userId}`);

  // resumeId → { _id, filename, archived } so the detail and edit pages can name the file
  const application = await AddApplicationModel.findOne({
    _id: id,
    userId,
  })
    .populate({ path: "resumeId", select: "filename archived" })
    .lean();

  return JSON.parse(JSON.stringify(application));
}

export const getApplications = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  const userId = user._id.toString();

  return getCachedApplications(userId);
};

export const getSingleApplication = async (id) => {
  try {
    const session = await getUserSession();
    const user = await getUserByEmail(session.user.email);
    const userId = user._id.toString();

    const application = await getCachedApplication(id, userId);

    if (!application) {
      notFound();
    }

    return application
  } catch (error) {
    console.error("Error fetching application:", error.message);
    throw error;
  }
};