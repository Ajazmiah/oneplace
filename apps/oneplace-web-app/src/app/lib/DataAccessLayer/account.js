"use server";
import { getUserSession } from "./getSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { signOut } from "@/auth";
import userModel from "@/database/models/userModel";
import ApplicationModel from "@/database/models/addApplicationModel";
import QuestionAndAnswerModel from "@/database/models/questionAndAnswerModel";
import DefaultResumeModel from "@/database/models/defaultResume";
import ProfileModel from "@/database/models/profileModel";
import { deleteUserFiles } from "@/app/lib/s3/s3";

export const deleteAccount = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return { success: false, message: "User not found." };
  }

  try {
    // Files first: if this fails nothing has been deleted yet and the user can retry,
    // instead of ending up with a deleted account whose resumes are still in S3
    await deleteUserFiles(user._id);

    await Promise.all([
      ApplicationModel.deleteMany({ userId: user._id }),
      QuestionAndAnswerModel.deleteMany({ userId: user._id }),
      DefaultResumeModel.deleteMany({ userId: user._id }),
      ProfileModel.deleteMany({ userId: user._id }),
    ]);

    await userModel.findByIdAndDelete(user._id);
  } catch (error) {
    console.error("Error deleting account:", error.message);
    return { success: false, message: "Failed to delete account." };
  }

  await signOut({ redirectTo: "/signin" });
};
