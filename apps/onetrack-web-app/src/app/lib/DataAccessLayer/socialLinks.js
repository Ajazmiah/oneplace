"use server";
import userModel from "@/database/models/userModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { revalidatePath, revalidateTag, cacheTag, cacheLife } from "next/cache";

async function getCachedSocialLinks(userId) {
  "use cache";
  cacheLife("hours");
  cacheTag(`social-links-${userId}`);

  const user = await userModel.findById(userId).select("socialLinks").lean();
  return JSON.parse(JSON.stringify(user?.socialLinks ?? []));
}

export const getSocialLinks = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  return getCachedSocialLinks(user._id.toString());
};

export const saveSocialLinks = async (socialLinks) => {
  try {
    const session = await getUserSession();
    const user = await getUserByEmail(session.user.email);
    const savedSocialLinks = JSON.parse(JSON.stringify(user?.socialLinks ?? []));

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const userId = user._id.toString();
    const updated = [...savedSocialLinks];

    socialLinks.forEach(link => {
      const index = updated.findIndex(
        savedLink => savedLink.socialLabel === link.socialLabel
      );

      if (index !== -1) {
        updated[index] = link;
      } else {
        updated.push(link);
      }
    });

    user.socialLinks = updated;

    await user.save();

    revalidateTag(`social-links-${userId}`);
    revalidatePath("/dashboard/settings");

    return { success: true, message: "Social links saved" };
  } catch (error) {
    console.error("Error saving social links:", error.message);
    return { success: false, message: "Saving social links failed!" };
  }
};
