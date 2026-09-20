import { QuestionAnswersView as SharedQuestionAnswersView } from "@repo/ui/QuestionAnswersView";

export type QAItem = {
  _id: string;
  question: string;
  answer: string;
};

export default function QuestionAnswersView({ questions }: { questions: QAItem[] }) {
  return <SharedQuestionAnswersView questions={questions} title="Interview Q&A" pageSize={5} />;
}
