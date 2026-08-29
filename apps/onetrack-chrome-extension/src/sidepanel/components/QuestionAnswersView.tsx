import { QuestionAnswersView as SharedQuestionAnswersView, type QAItem } from "@repo/ui/QuestionAnswersView";

export default function QuestionAnswersView({ questions }: { questions: QAItem[] }) {
  return <SharedQuestionAnswersView questions={questions} title="Interview Q&A" pageSize={5} />;
}
