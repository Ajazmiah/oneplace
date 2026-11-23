import { QuestionAnswersView as SharedQuestionAnswersView } from "@repo/ui/QuestionAnswersView";

export type QAItem = {
  _id: string;
  question: string;
  answer: string;
};

// The side panel draws its own "Saved answers" header, so no title here
export default function QuestionAnswersView({ questions }: { questions: QAItem[] }) {
  return <SharedQuestionAnswersView questions={questions} pageSize={5} />;
}
