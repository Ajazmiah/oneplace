import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, EyeIcon, FileIcon, SettingsIcon, UploadIcon } from "./Icons";

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

/**
 * Resume field for the Save Application form: saved resumes on top, "Upload new" below, and
 * View for whichever is selected. At MAX_RESUMES uploading is disabled and the Resume page is
 * offered instead. Nothing is downloaded until the user clicks View.
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

  return (
    <div className="field">
      <div className="picker">
        <div ref={wrapRef} className="picker-dropdown">
          <button
            type="button"
            className={selected ? "picker-trigger" : "picker-trigger is-empty"}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <FileIcon size={18} className="picker-file-icon" />
            <span className="picker-text">
              <span className="file-name" title={selected?.name}>
                {selected?.name ?? "Choose a resume"}
              </span>
              <span className="picker-hint">
                {selected?.hint ?? "PDF, DOC, DOCX · max 5MB"}
              </span>
            </span>
            <ChevronDownIcon size={16} className="picker-chevron" />
          </button>

          {open && (
            <div className="menu" role="menu">
              {resumes.map((resume, index) => {
                const checked = value?.type === "library" && value.id === resume._id;
                return (
                  <button
                    key={resume._id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={checked}
                    className="menu-item"
                    onClick={() => choose({ type: "library", id: resume._id })}
                  >
                    <span className="menu-check">{checked && <CheckIcon size={16} />}</span>
                    <span className="picker-text">
                      <span className="file-name" title={resume.filename}>
                        {resume.filename}
                      </span>
                      {index === 0 && <span className="picker-hint">Last used</span>}
                    </span>
                  </button>
                );
              })}

              {value?.type === "new" && (
                <button type="button" role="menuitemradio" aria-checked className="menu-item">
                  <span className="menu-check">
                    <CheckIcon size={16} />
                  </span>
                  <span className="picker-text">
                    <span className="file-name" title={value.file.name}>
                      {value.file.name}
                    </span>
                    <span className="picker-hint">New upload</span>
                  </span>
                </button>
              )}

              {(resumes.length > 0 || value?.type === "new") && (
                <div className="menu-separator" />
              )}

              <button
                type="button"
                role="menuitem"
                aria-disabled={full}
                className="menu-item"
                onClick={chooseUpload}
              >
                <span className="menu-check">
                  <UploadIcon size={16} />
                </span>
                <span className="picker-text">
                  <span>Upload new</span>
                  <span className="picker-hint">
                    {full ? `${MAX_RESUMES} of ${MAX_RESUMES} saved` : "PDF, DOC, DOCX · max 5MB"}
                  </span>
                </span>
              </button>

              {full && (
                <button type="button" className="menu-link" onClick={openResumePage}>
                  <SettingsIcon size={12} /> Manage resumes
                </button>
              )}
            </div>
          )}
        </div>

        {selected && (
          <button type="button" className="btn btn-secondary" onClick={view}>
            <EyeIcon size={15} />
            View
          </button>
        )}
      </div>

      {error && <p className="field-error">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        hidden
        onChange={handleFile}
      />
    </div>
  );
}
