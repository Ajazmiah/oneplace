"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import Answer from "@/Components/QuestionAnswers/Answer";

export default function QuestionAnswersView({ questions }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Application Answers
        </h1>
        <p className="text-gray-500 mt-1">
          Polished responses to common interview and application questions
        </p>
      </div>

      {questions.length !== 0 && (
        <Select>
          <SelectTrigger className="w-full max-w-sm rounded-xl border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-400 focus:ring-indigo-100">
            <SelectValue placeholder="Choose a question" />
          </SelectTrigger>
          <SelectContent>
            {questions.map((q) => (
              <SelectItem
                key={q._id}
                value={q._id}
                className="focus:bg-indigo-100 focus:text-indigo-700"
              >
                {q.question}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500 text-sm">No answers saved yet.</p>
          <a
            href="/dashboard/add-interview-answer"
            className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
          >
            Add your first question &rarr;
          </a>
        </div>
      ) : (
        <Answer questions={questions} />
      )}
    </div>
  );
}
