"use server";
import AddApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

export const getApplications = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  const userId = user._id.toString();

  const getCachedApplications = unstable_cache(
    async (uid) => {
      const applications = await AddApplicationModel.find({ userId: uid })
        .select("-resume.data -coverLetter.data")
        .populate({ path: "userId" })
        .sort({ createdAt: -1 })
        .lean();

      return JSON.parse(JSON.stringify(applications));
    },
    ["applications", userId],
    { tags: [`applications-${userId}`] }
  );

  return getCachedApplications(userId);
};

export const getSingleApplication = async (id) => {
  try {
    await getUserSession();

    const application = await AddApplicationModel.findById({ _id: id });

    if (!application) {
      notFound();
    }

    return application;
  } catch (error) {
    console.error("Error fetching application:", error.message);
    throw error; // rethrow so the caller can handle it
  }
};
