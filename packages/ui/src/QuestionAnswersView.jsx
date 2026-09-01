"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./QuestionAnswersView.module.css";

export function QuestionAnswersView({
  questions,
  pageSize = 5,
  title,
  subtitle,
  allowEdit = false,
  allowDelete = false,
  onEdit,
  onDelete,
  emptyStateHref,
  emptyStateLabel = "Add your first question →",
  onNotify,
}) {
  const [allQuestions, setAllQuestions] = useState(questions);
  const [filterQuery, setFilterQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ question: "", answer: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setAllQuestions(questions);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (filterQuery === "" || filterQuery === "all") return allQuestions;
    return allQuestions.filter((q) => q.question === filterQuery);
  }, [filterQuery, allQuestions]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paginated = filteredQuestions.slice((page - 1) * pageSize, page * pageSize);

  const startEdit = (item) => {
    setEditingId(item._id);
    setDraft({ question: item.question, answer: item.answer });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ question: "", answer: "" });
  };

  const handleSave = async (id) => {
    if (!onEdit) return;
    if (!draft.question.trim() || !draft.answer.trim()) {
      onNotify?.("Question and answer can't be empty.", "error");
      return;
    }

    setSaving(true);
    try {
      const updated = await onEdit(id, draft);
      setAllQuestions((prev) =>
        prev.map((q) => (q._id === id ? { ...q, ...updated } : q))
      );
      onNotify?.("Question updated.", "success");
      cancelEdit();
    } catch {
      onNotify?.("Something went wrong. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!onDelete) return;
    if (!window.confirm("Delete this question? This action cannot be undone.")) return;

    setDeletingId(item._id);
    try {
      await onDelete(item._id);
      setAllQuestions((prev) => prev.filter((q) => q._id !== item._id));
      onNotify?.("Question deleted.", "success");
    } catch {
      onNotify?.("Something went wrong. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.wrap}>
      {(title || subtitle) && (
        <div>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {allQuestions.length !== 0 && (
        <select
          className={styles.filterSelect}
          value={filterQuery}
          onChange={(e) => {
            setFilterQuery(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All</option>
          {allQuestions.map((q) => (
            <option key={q._id} value={q.question}>
              {q.question}
            </option>
          ))}
        </select>
      )}

      {paginated.length === 0 ? (
        <div className={styles.empty}>
          <p>No answers saved yet.</p>
          {emptyStateHref && (
            <a className={styles.emptyLink} href={emptyStateHref}>
              {emptyStateLabel}
            </a>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {paginated.map((item) => {
            const isEditing = editingId === item._id;

            return (
              <div key={item._id} className={styles.card}>
                {isEditing ? (
                  <div className={styles.editForm}>
                    <div className={styles.field}>
                      <label className={styles.label}>Question</label>
                      <input
                        className={styles.input}
                        value={draft.question}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, question: e.target.value }))
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Answer</label>
                      <textarea
                        className={styles.textarea}
                        value={draft.answer}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, answer: e.target.value }))
                        }
                        rows={4}
                      />
                    </div>
                    <div className={styles.editActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => handleSave(item._id)}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.question}>{item.question}</h2>
                      {(allowEdit || allowDelete) && (
                        <div className={styles.cardActions}>
                          {allowEdit && (
                            <button
                              type="button"
                              className={styles.iconButton}
                              onClick={() => startEdit(item)}
                            >
                              Edit
                            </button>
                          )}
                          {allowDelete && (
                            <button
                              type="button"
                              className={styles.iconButtonDanger}
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item._id}
                            >
                              {deletingId === item._id ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className={styles.answer}>{item.answer}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={n === page ? styles.pageButtonActive : styles.pageButton}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionAnswersView;
