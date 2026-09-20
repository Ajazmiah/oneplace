"use server";
import { getUserSession } from "./getSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { signOut } from "@/auth";
import userModel from "@/database/models/userModel";
import ApplicationModel from "@/database/models/addApplicationModel";
import QuestionAndAnswerModel from "@/database/models/questionAndAnswerModel";
import DefaultResumeModel from "@/database/models/defaultResume";

export const deleteAccount = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return { success: false, message: "User not found." };
  }

  try {
    await Promise.all([
      ApplicationModel.deleteMany({ userId: user._id }),
      QuestionAndAnswerModel.deleteMany({ userId: user._id }),
      DefaultResumeModel.deleteMany({ userId: user._id }),
    ]);

    await userModel.findByIdAndDelete(user._id);
  } catch (error) {
    console.error("Error deleting account:", error.message);
    return { success: false, message: "Failed to delete account." };
  }

  await signOut({ redirectTo: "/signin" });
};
