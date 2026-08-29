"use client";

import { toast } from "sonner";
import { QuestionAnswersView as SharedQuestionAnswersView } from "@repo/ui/QuestionAnswersView";
import {
  editQuestionAndAnswer,
  deleteQuestionAndAnswer,
} from "@/app/lib/DataAccessLayer/getQuestionsAndAnswers";

export default function QuestionAnswersView({ questions }) {
  return (
    <SharedQuestionAnswersView
      questions={questions}
      title="Interview Prep"
      subtitle="Polished responses to common interview and application questions"
      allowEdit
      allowDelete
      onEdit={editQuestionAndAnswer}
      onDelete={deleteQuestionAndAnswer}
      emptyStateHref="/dashboard/add-interview-answer"
      onNotify={(message, type) => toast[type](message)}
    />
  );
}
