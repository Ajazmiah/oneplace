"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./QuestionAnswersView.module.css";

// Inline icons (lucide paths) so the shared package needs no icon dependency.
const Icon = ({ children }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const CopyIcon = () => (
  <Icon>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Icon>
);

const CheckIcon = () => (
  <Icon>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const PencilIcon = () => (
  <Icon>
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </Icon>
);

const TrashIcon = () => (
  <Icon>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Icon>
);

export function QuestionAnswersView({
  questions,
  pageSize = 5,
  title,
  subtitle,
  allowEdit = false,
  allowDelete = false,
  allowCopy = true,
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
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const copyTimer = useRef(null);

  useEffect(() => {
    setAllQuestions(questions);
  }, [questions]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const filteredQuestions = useMemo(() => {
    if (filterQuery === "" || filterQuery === "all") return allQuestions;
    return allQuestions.filter((q) => q.question === filterQuery);
  }, [filterQuery, allQuestions]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paginated = filteredQuestions.slice((page - 1) * pageSize, page * pageSize);

  const startEdit = (item) => {
    setConfirmDeleteId(null);
    setEditingId(item._id);
    setDraft({ question: item.question, answer: item.answer });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ question: "", answer: "" });
  };

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.answer);
      setCopiedId(item._id);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedId(null), 1500);
      onNotify?.("Answer copied.", "success");
    } catch {
      onNotify?.("Couldn't copy the answer.", "error");
    }
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

    setDeletingId(item._id);
    try {
      await onDelete(item._id);
      setAllQuestions((prev) => prev.filter((q) => q._id !== item._id));
      onNotify?.("Question deleted.", "success");
    } catch {
      onNotify?.("Something went wrong. Please try again.", "error");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
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
          aria-label="Filter questions"
          value={filterQuery}
          onChange={(e) => {
            setFilterQuery(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All questions</option>
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
            const isConfirmingDelete = confirmDeleteId === item._id;
            const isDeleting = deletingId === item._id;
            const isCopied = copiedId === item._id;

            return (
              <div
                key={item._id}
                className={isEditing ? `${styles.card} ${styles.cardEditing}` : styles.card}
              >
                {isEditing ? (
                  <div className={styles.editForm}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={`q-${item._id}`}>
                        Question
                      </label>
                      <input
                        id={`q-${item._id}`}
                        className={styles.input}
                        value={draft.question}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, question: e.target.value }))
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={`a-${item._id}`}>
                        Answer
                      </label>
                      <textarea
                        id={`a-${item._id}`}
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
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.cardHeader}>
                      <div className={styles.questionRow}>
                        <span className={styles.badge} aria-hidden="true">
                          Q
                        </span>
                        <h2 className={styles.question}>{item.question}</h2>
                      </div>

                      <div className={styles.cardActions}>
                        {allowCopy && (
                          <button
                            type="button"
                            className={isCopied ? `${styles.iconButton} ${styles.iconButtonCopied}` : styles.iconButton}
                            onClick={() => handleCopy(item)}
                            aria-label={isCopied ? "Answer copied" : "Copy answer"}
                            title={isCopied ? "Copied" : "Copy answer"}
                          >
                            {isCopied ? <CheckIcon /> : <CopyIcon />}
                          </button>
                        )}
                        {allowEdit && (
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => startEdit(item)}
                            aria-label="Edit question"
                            title="Edit"
                          >
                            <PencilIcon />
                          </button>
                        )}
                        {allowDelete && (
                          <button
                            type="button"
                            className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                            onClick={() => setConfirmDeleteId(item._id)}
                            disabled={isDeleting}
                            aria-label="Delete question"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className={styles.answer}>{item.answer}</p>

                    {isConfirmingDelete && (
                      <div className={styles.confirmBar} role="alert">
                        <span>Delete this question? This can&apos;t be undone.</span>
                        <div className={styles.confirmActions}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isDeleting}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={() => handleDelete(item)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
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
            aria-label="Previous page"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={n === page ? styles.pageButtonActive : styles.pageButton}
              onClick={() => setCurrentPage(n)}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionAnswersView;
