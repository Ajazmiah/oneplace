import { useEffect, useRef, useState } from "react";

// One of the user's saved resumes, as synced by ExtensionAuthSync (never the S3 key)
export type LibraryResume = {
  _id: string;
  filename: string;
  mimetype?: string;
  size?: number;
};

/** A saved resume, a file picked now (added to the library on save), or none. */
export type ResumeChoice = { type: "library"; id: string } | { type: "new"; file: File } | null;

// Keep in sync with the web app: MAX_RESUMES in constants.js, validateFile() in utils.js
export const MAX_RESUMES = 3;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Pre-select the most recently used resume (the list arrives in that order). */
export const initialResumeChoice = (resumes: LibraryResume[]): ResumeChoice =>
  resumes.length ? { type: "library", id: resumes[0]._id } : null;

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", gap: 6 },
  row: { display: "flex", alignItems: "stretch", gap: 8 },
  dropdown: { position: "relative", flex: 1, minWidth: 0 },
  trigger: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    fontSize: 13,
    fontFamily: "inherit",
    textAlign: "left",
    color: "#111",
    background: "rgba(11, 188, 170, 0.05)",
    border: "1px solid rgba(11, 188, 170, 0.4)",
    borderRadius: 6,
    cursor: "pointer",
  },
  triggerEmpty: { color: "#666", background: "#fff", border: "1px dashed #ccc" },
  text: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 },
  fileName: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  hint: { fontSize: 11, color: "#888" },
  chevron: { fontSize: 10, color: "#888", flexShrink: 0 },
  menu: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    padding: 4,
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    fontSize: 13,
    fontFamily: "inherit",
    textAlign: "left",
    color: "#111",
    background: "transparent",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  itemActive: { background: "rgba(11, 188, 170, 0.1)" },
  itemDisabled: { color: "#aaa", cursor: "not-allowed" },
  separator: { height: 1, margin: "4px 0", background: "#eee" },
  link: {
    padding: "4px 10px 6px 30px",
    fontSize: 12,
    color: "#0bbcaa",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
  },
  check: { width: 12, color: "#0bbcaa", flexShrink: 0 },
  viewButton: {
    padding: "0 14px",
    fontSize: 12,
    fontWeight: 500,
    color: "#0bbcaa",
    background: "transparent",
    border: "1px solid #0bbcaa",
    borderRadius: 6,
    cursor: "pointer",
    flexShrink: 0,
  },
  error: { margin: 0, fontSize: 12, color: "#dc2626" },
};

/**
 * Resume field for the Save Application form: saved resumes on top, "Upload new" below, and
 * View for whichever is selected. At MAX_RESUMES uploading is disabled and the Resume page is
 * offered instead.
 * Nothing is downloaded until the user clicks View.
 */
export default function ResumePicker({
  resumes,
  value,
  onChange,
  webAppUrl,
}: {
  resumes: LibraryResume[];
  value: ResumeChoice;
  onChange: (choice: ResumeChoice) => void;
  webAppUrl: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const full = resumes.length >= MAX_RESUMES;

  // Close on a click outside the dropdown or on Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (choice: ResumeChoice) => {
    setOpen(false);
    setError("");
    onChange(choice);
  };

  const chooseUpload = () => {
    if (full) return;
    setOpen(false);
    inputRef.current?.click();
  };

  const openResumePage = () => {
    setOpen(false);
    chrome.tabs.create({ url: `${webAppUrl}/dashboard/resume` });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = ""; // so choosing the same file again still fires onChange
    if (!picked) return; // cancelled: keep the current choice

    if (!ALLOWED_TYPES.includes(picked.type)) {
      setError("Please choose a PDF, DOC, or DOCX file");
      return;
    }
    if (picked.size > MAX_SIZE_BYTES) {
      setError("File must be 5MB or smaller");
      return;
    }
    setError("");
    onChange({ type: "new", file: picked });
  };

  // Saved resume: the web app route redirects to a short-lived signed S3 link.
  // New file: opened from memory; nothing is uploaded until the form is saved.
  const view = () => {
    if (value?.type === "library") {
      chrome.tabs.create({ url: `${webAppUrl}/api/resumes/${value.id}/file` });
    } else if (value?.type === "new") {
      const url = URL.createObjectURL(value.file);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
  };

  const selectedLibrary =
    value?.type === "library" ? resumes.find((r) => r._id === value.id) : undefined;
  const selected =
    value?.type === "new"
      ? { name: value.file.name, hint: "New upload" }
      : selectedLibrary
        ? {
            name: selectedLibrary.filename,
            hint: selectedLibrary._id === resumes[0]?._id ? "Last used" : "Saved resume",
          }
        : null;

  const item = (active: boolean): React.CSSProperties =>
    active ? { ...s.item, ...s.itemActive } : s.item;

  return (
    <div style={s.wrap}>
      <div style={s.row}>
        <div ref={wrapRef} style={s.dropdown}>
          <button
            type="button"
            style={selected ? s.trigger : { ...s.trigger, ...s.triggerEmpty }}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span style={s.text}>
              <span style={s.fileName} title={selected?.name}>
                {selected?.name ?? "Choose a resume"}
              </span>
              {selected && <span style={s.hint}>{selected.hint}</span>}
            </span>
            <span style={s.chevron} aria-hidden="true">
              ▼
            </span>
          </button>

          {open && (
            <div style={s.menu} role="menu">
              {resumes.map((resume, index) => {
                const checked = value?.type === "library" && value.id === resume._id;
                return (
                  <button
                    key={resume._id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={checked}
                    style={item(checked)}
                    onClick={() => choose({ type: "library", id: resume._id })}
                  >
                    <span style={s.check} aria-hidden="true">
                      {checked ? "✓" : ""}
                    </span>
                    <span style={s.text}>
                      <span style={s.fileName} title={resume.filename}>
                        {resume.filename}
                      </span>
                      {index === 0 && <span style={s.hint}>Last used</span>}
                    </span>
                  </button>
                );
              })}

              {value?.type === "new" && (
                <button type="button" role="menuitemradio" aria-checked style={item(true)}>
                  <span style={s.check} aria-hidden="true">
                    ✓
                  </span>
                  <span style={s.text}>
                    <span style={s.fileName} title={value.file.name}>
                      {value.file.name}
                    </span>
                    <span style={s.hint}>New upload</span>
                  </span>
                </button>
              )}

              {(resumes.length > 0 || value?.type === "new") && <div style={s.separator} />}

              <button
                type="button"
                role="menuitem"
                aria-disabled={full}
                style={full ? { ...s.item, ...s.itemDisabled } : s.item}
                onClick={chooseUpload}
              >
                <span style={s.check} aria-hidden="true" />
                <span style={s.text}>
                  <span>Upload new</span>
                  <span style={s.hint}>
                    {full
                      ? `${MAX_RESUMES} of ${MAX_RESUMES} saved`
                      : "PDF, DOC, DOCX · max 5MB"}
                  </span>
                </span>
              </button>

              {full && (
                <button type="button" style={s.link} onClick={openResumePage}>
                  Manage resumes →
                </button>
              )}
            </div>
          )}
        </div>

        {selected && (
          <button type="button" style={s.viewButton} onClick={view}>
            View
          </button>
        )}
      </div>

      {error && <p style={s.error}>{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
