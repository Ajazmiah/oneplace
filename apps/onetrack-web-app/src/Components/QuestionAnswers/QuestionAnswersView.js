"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import Answer from "@/Components/QuestionAnswers/Answer";
import usePagination from "@/hook/usePagination";
import Pagination from "../Pagination/Pagination";
import { useEffect, useState } from "react";

export default function QuestionAnswersView({ questions }) {
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [filterQuery, setFilterQuery] = useState("");

  const {
    paginated,
    currentPage,
    totalPages,
    setCurrentPage,
    nextPage,
    prevPage,
  } = usePagination(filteredQuestions, 5);

  // filter
  useEffect(() => {
    const queryExists = (searchField) =>
      searchField?.toLowerCase().includes(filterQuery.toLowerCase());

    let filtered;

    if (filterQuery === "" || filterQuery === "all") {
      filtered = questions;
    } else {
      filtered = questions.filter(({ question }) => {
        if (queryExists(question)) {
          return true;
        }
      });
    }

    setFilteredQuestions(filtered);
  }, [filterQuery]);

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
        <Select onValueChange={(value) => setFilterQuery(value)}>
          <SelectTrigger className="w-full max-w-sm rounded-xl border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-400 focus:ring-indigo-100">
            <SelectValue placeholder="Choose a question" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {questions.map((q) => (
              <>
                <SelectItem
                  key={q._id}
                  value={q.question}
                  className="focus:bg-indigo-100 focus:text-indigo-700"
                >
                  {q.question}
                </SelectItem>
              </>
            ))}
          </SelectContent>
        </Select>
      )}

      {paginated.length === 0 ? (
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
        <Answer questions={paginated} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </div>
  );
}
