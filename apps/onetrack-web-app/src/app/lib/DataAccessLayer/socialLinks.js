"use server";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { revalidatePath } from "next/cache";

export const getSocialLinks = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  return JSON.parse(JSON.stringify(user?.socialLinks ?? []));
};

export const saveSocialLinks = async (socialLinks) => {
  try {
    const session = await getUserSession();
    const user = await getUserByEmail(session.user.email);
    const savedSocialLinks = JSON.parse(JSON.stringify(user?.socialLinks ?? []));

    if (!user) {
      return { success: false, message: "User not found" };
    }

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

    revalidatePath("/dashboard/settings");

    return { success: true, message: "Social links saved" };
  } catch (error) {
    console.error("Error saving social links:", error.message);
    return { success: false, message: "Saving social links failed!" };
  }
};
