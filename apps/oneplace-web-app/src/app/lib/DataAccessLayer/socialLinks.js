"use server";
import userModel from "@/database/models/userModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { revalidatePath, updateTag, cacheTag, cacheLife } from "next/cache";

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
  if (!user) return [];
  return getCachedSocialLinks(user._id.toString());
};

const MAX_SOCIAL_LINKS = 20;

/**
 * Replace the signed-in user's social links with `socialLinks` (the full list from the
 * settings form). Links not in the list are removed, so deletes stick.
 * Blank entries are dropped; a repeated label keeps its last URL.
 */
export const saveSocialLinks = async (socialLinks) => {
  try {
    const session = await getUserSession();

    // Server actions are public endpoints, so don't trust the shape of the argument
    if (!Array.isArray(socialLinks)) {
      return { success: false, message: "Invalid social links." };
    }

    const byLabel = new Map();
    for (const link of socialLinks) {
      const socialLabel = typeof link?.socialLabel === "string" ? link.socialLabel.trim() : "";
      const url = typeof link?.url === "string" ? link.url.trim() : "";
      if (socialLabel && url) byLabel.set(socialLabel, { socialLabel, url });
    }
    const cleaned = [...byLabel.values()];

    if (cleaned.length > MAX_SOCIAL_LINKS) {
      return { success: false, message: `You can save up to ${MAX_SOCIAL_LINKS} links.` };
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const userId = user._id.toString();
    user.socialLinks = cleaned;
    await user.save();

    // Expire now so Settings, the profile page and the extension sync see the new links
    updateTag(`social-links-${userId}`);
    revalidatePath("/dashboard/settings");

    return { success: true, message: "Social links saved" };
  } catch (error) {
    console.error("Error saving social links:", error.message);
    return { success: false, message: "Saving social links failed!" };
  }
};
