"use server";
import QuestionAndAnswerModel from "@/database/models/questionAndAnswerModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { revalidatePath } from "next/cache";

export const getQuestionsAndAnswers = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  const questions = await QuestionAndAnswerModel.find({
    userId: user._id,
  })
    .populate({ path: "userId" })
    .sort({ createdAt: -1 });

  return questions;
};

// accepts a single { question, answer } or an array of them
export const addQuestionAndAnswer = async (entries) => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  const docs = (Array.isArray(entries) ? entries : [entries]).map((e) => ({
    question: e.question,
    answer: e.answer,
    userId: user._id,
  }));

  await QuestionAndAnswerModel.insertMany(docs);

  revalidatePath("/dashboard/application-answers");
};