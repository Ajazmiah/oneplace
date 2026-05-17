"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { addQuestionAndAnswer } from "@/app/lib/DataAccessLayer/getQuestionsAndAnswers";

const emptyEntry = () => ({ question: "", answer: "" });

export default function QuestionAnswerForm() {
  const [entries, setEntries] = useState([emptyEntry()]);
  const [loading, setLoading] = useState(false);

  const updateField = (index, field, value) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    );
  };

  const addEntry = () => setEntries((prev) => [...prev, emptyEntry()]);

  const removeEntry = (index) =>
    setEntries((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalid = entries.some(
      (e) => !e.question.trim() || !e.answer.trim()
    );
    if (invalid) {
      toast.error("All questions and answers must be filled in.");
      return;
    }

    setLoading(true);
    try {
      await addQuestionAndAnswer(entries);
      toast.success(
        entries.length === 1
          ? "Question & answer saved."
          : `${entries.length} questions & answers saved.`
      );
      setEntries([emptyEntry()]);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {entries.map((entry, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold flex-shrink-0">
              {index + 1}
            </span>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove question"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Question
            </label>
            <input
              type="text"
              value={entry.question}
              onChange={(e) => updateField(index, "question", e.target.value)}
              placeholder="e.g. Tell me about yourself."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Answer
            </label>
            <textarea
              value={entry.answer}
              onChange={(e) => updateField(index, "answer", e.target.value)}
              placeholder="Write your polished answer here..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
              required
            />
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center justify-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <Plus size={15} />
          Add another question
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors sm:ml-auto"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>Save {entries.length > 1 ? `all ${entries.length}` : ""}</>
          )}
        </button>
      </div>
    </form>
  );
}
