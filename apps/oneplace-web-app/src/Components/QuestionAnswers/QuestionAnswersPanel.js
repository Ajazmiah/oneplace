"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import QuestionAnswersView from "./QuestionAnswersView";
import QuestionAnswerForm from "./QuestionAnswerForm";

export default function QuestionAnswersPanel({ questions }) {
  const [formOpen, setFormOpen] = useState(false);
  // set when the form submits valid data, cleared once the save lands
  const pending = useRef(false);

  const openForm = () => setFormOpen(true);

  const cancelForm = () => {
    pending.current = false;
    setFormOpen(false);
  };

  // A successful save revalidates this page, so `questions` changes.
  // Close the form if it was waiting on a save.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    setFormOpen(false);
  }, [questions]);

  const handleSubmit = (e) => {
    const fields = e.target.querySelectorAll("input, textarea");
    const allFilled = Array.from(fields).every((f) => f.value.trim());
    if (allFilled) pending.current = true;
  };

  return (
    <div className="space-y-6">
      <QuestionAnswersView questions={questions} />

      {formOpen ? (
        // Cancel sits on the same row as the form's Save button (sm and up):
        // it's pinned to the bottom-left of this wrapper, where the form's
        // button row ends. On mobile it stacks under the full-width Save.
        <div className="relative flex flex-col gap-3">
          {/* Hide the form's own "Add another question" button (the only
              type="button" without an aria-label) so the panel buttons are the only ones. */}
          <div
            onSubmit={handleSubmit}
            className="[&_button[type=button]:not([aria-label])]:hidden"
          >
            <QuestionAnswerForm />
          </div>

          <button
            type="button"
            onClick={cancelForm}
            className="sm:absolute sm:bottom-0 sm:left-0 flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={15} />
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openForm}
          className="flex items-center justify-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-4 py-2 text-sm font-medium text-brand-strong hover:bg-brand/10 transition-colors"
        >
          <Plus size={15} />
          Add another question
        </button>
      )}
    </div>
  );
}
