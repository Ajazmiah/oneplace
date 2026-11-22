import { getQuestionsAndAnswers } from "@/app/lib/DataAccessLayer/getQuestionsAndAnswers";
import QuestionAnswersPanel from "@/Components/QuestionAnswers/QuestionAnswersPanel";

export default async function ApplicationAnswersPage() {
  const questions = await getQuestionsAndAnswers();

  return <QuestionAnswersPanel questions={questions} />;
}
