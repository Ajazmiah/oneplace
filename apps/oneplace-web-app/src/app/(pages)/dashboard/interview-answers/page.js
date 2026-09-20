import { getQuestionsAndAnswers } from "@/app/lib/DataAccessLayer/getQuestionsAndAnswers";
import QuestionAnswersView from "@/Components/QuestionAnswers/QuestionAnswersView";

export default async function ApplicationAnswersPage() {
  const questions = await getQuestionsAndAnswers();

  return <QuestionAnswersView questions={questions} />;
}
