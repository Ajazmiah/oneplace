"use server";
import QuestionAndAnswerModel from "@/database/models/questionAndAnswerModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";
import { revalidatePath, revalidateTag, cacheTag, cacheLife } from "next/cache";

async function getCachedQuestionsAndAnswers(userId) {
  "use cache";
  cacheLife("hours");
  cacheTag(`questions-and-answers-${userId}`);

  const questions = await QuestionAndAnswerModel.find({ userId })
    .lean()
    .sort({ createdAt: -1 });

  return questions.map((q) => ({
    _id: q._id.toString(),
    question: q.question,
    answer: q.answer,
  }));
}

export const getQuestionsAndAnswers = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  return getCachedQuestionsAndAnswers(user._id.toString());
};

// accepts a single { question, answer } or an array of them
export const addQuestionAndAnswer = async (entries) => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  const userId = user._id.toString();

  const docs = (Array.isArray(entries) ? entries : [entries]).map((e) => ({
    question: e.question,
    answer: e.answer,
    userId: user._id,
  }));

  await QuestionAndAnswerModel.insertMany(docs);

  revalidateTag(`questions-and-answers-${userId}`);
  revalidatePath("/dashboard/interview-answers");
};

export const editQuestionAndAnswer = async (id, { question, answer }) => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  const userId = user._id.toString();

  const updated = await QuestionAndAnswerModel.findOneAndUpdate(
    { _id: id, userId },
    { question, answer },
    { new: true }
  ).lean();

  if (!updated) {
    throw new Error("Question not found.");
  }

  revalidateTag(`questions-and-answers-${userId}`);
  revalidatePath("/dashboard/interview-answers");

  return {
    _id: updated._id.toString(),
    question: updated.question,
    answer: updated.answer,
  };
};

export const deleteQuestionAndAnswer = async (id) => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  const userId = user._id.toString();

  const deleted = await QuestionAndAnswerModel.findOneAndDelete({
    _id: id,
    userId,
  }).lean();

  if (!deleted) {
    throw new Error("Question not found.");
  }

  revalidateTag(`questions-and-answers-${userId}`);
  revalidatePath("/dashboard/interview-answers");

  return { _id: deleted._id.toString() };
};