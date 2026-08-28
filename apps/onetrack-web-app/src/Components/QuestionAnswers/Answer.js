"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit, Trash2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import AlertDialogBox from "@/Components/AlertDialog/AlertDialog";
import {
  editQuestionAndAnswer,
  deleteQuestionAndAnswer,
} from "@/app/lib/DataAccessLayer/getQuestionsAndAnswers";

export default function Answer({ questions, onUpdated, onDeleted }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ question: "", answer: "" });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const startEdit = (item) => {
    setEditingId(item._id);
    setDraft({ question: item.question, answer: item.answer });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ question: "", answer: "" });
  };

  const handleSave = async (id) => {
    if (!draft.question.trim() || !draft.answer.trim()) {
      toast.error("Question and answer can't be empty.");
      return;
    }

    setSaving(true);
    try {
      const updated = await editQuestionAndAnswer(id, draft);
      onUpdated?.(updated);
      toast.success("Question updated.");
      cancelEdit();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteQuestionAndAnswer(deleteTarget._id);
      onDeleted?.(deleteTarget._id);
      toast.success("Question deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid gap-5">
      <AlertDialogBox
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this question?"
        description="This action cannot be undone. This will permanently delete the question and its answer."
      />

      {questions.map((item) => {
        const isEditing = editingId === item._id;

        return (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow duration-200"
          >
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <input
                    type="text"
                    value={draft.question}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, question: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <textarea
                    value={draft.answer}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, answer: e.target.value }))
                    }
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-y"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSave(item._id)}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-800 leading-snug">
                    {item.question}
                  </h2>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-indigo-600"
                      onClick={() => startEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed pl-10">
                  {item.answer}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
