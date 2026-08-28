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
    .lean()
    .sort({ createdAt: -1 });

  return questions.map((q) => ({
    _id: q._id.toString(),
    question: q.question,
    answer: q.answer,
  }));
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

  revalidatePath("/dashboard/interview-answers");
};

export const editQuestionAndAnswer = async (id, { question, answer }) => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);

  const updated = await QuestionAndAnswerModel.findOneAndUpdate(
    { _id: id, userId: user._id },
    { question, answer },
    { new: true }
  ).lean();

  if (!updated) {
    throw new Error("Question not found.");
  }

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

  const deleted = await QuestionAndAnswerModel.findOneAndDelete({
    _id: id,
    userId: user._id,
  }).lean();

  if (!deleted) {
    throw new Error("Question not found.");
  }

  revalidatePath("/dashboard/interview-answers");

  return { _id: deleted._id.toString() };
};