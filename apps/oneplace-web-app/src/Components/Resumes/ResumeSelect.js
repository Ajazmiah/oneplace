"use client";

import { useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ChevronDown, FileText, Settings, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { MAX_RESUMES } from "@/app/lib/constants";
import { openDocument, validateFile } from "@/app/lib/utils/utils";
import { appendUpload } from "@/app/lib/utils/uploadToS3";

export const RESUMES_PAGE_URL = "/dashboard/resume";

/**
 * The resume choice a form holds:
 *   { type: "library", id }  one of the user's saved resumes
 *   { type: "new", file }    a file picked now; added to the library on save
 *   { type: "keep" }         edit form only: leave the application's resume as it is
 *   null                     no resume
 */

/** Initial choice for a new application: the most recently used resume, if any. */
export const initialResumeChoice = (resumes) =>
  resumes?.length ? { type: "library", id: resumes[0]._id } : null;

/**
 * Add the choice to the form: `resumeId`, or upload the new file straight to S3 and add
 * `resumeKey` / `resumeName`. "keep" and null add nothing.
 */
export async function appendResumeChoice(formData, choice) {
  if (choice?.type === "library") formData.append("resumeId", choice.id);
  if (choice?.type === "new") await appendUpload(formData, "resume", choice.file);
}

/**
 * Resume dropdown for the application forms: saved resumes on top, "Upload new" below, and
 * View for whichever is selected. At MAX_RESUMES, uploading is disabled and the Resume page
 * is offered instead.
 * @param {{ resumes: Array<{ _id: string, filename: string }>, value: object | null,
 *           onChange: (choice: object | null) => void,
 *           keep?: { filename: string, viewUrl: string } }} props
 *        keep: the application's current resume when it isn't one of `resumes`
 *        (made before the library, or deleted from it since)
 */
export default function ResumeSelect({ resumes, value, onChange, keep }) {
  const inputRef = useRef(null);
  const libraryFull = resumes.length >= MAX_RESUMES;

  const selectedLibrary =
    value?.type === "library" ? resumes.find((r) => r._id === value.id) : null;
  const selected =
    value?.type === "new"
      ? { name: value.file.name, hint: "New upload" }
      : value?.type === "keep" && keep
        ? { name: keep.filename, hint: "Current resume" }
        : selectedLibrary
          ? {
              name: selectedLibrary.filename,
              hint: selectedLibrary._id === resumes[0]?._id ? "Last used" : "Saved resume",
            }
          : null;

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // so picking the same file again still fires onChange
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    onChange({ type: "new", file });
  }

  function view() {
    if (value?.type === "library") {
      openDocument(`/api/resumes/${value.id}/file`);
    } else if (value?.type === "keep" && keep) {
      openDocument(keep.viewUrl);
    } else if (value?.type === "new") {
      // Opened from memory: nothing is uploaded until the form is saved
      const url = URL.createObjectURL(value.file);
      openDocument(url);
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* A real button so the menu opens with Tab + Enter/Space */}
          <button
            type="button"
            className={`w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0bbcaa]/40 ${
              selected
                ? "border-[#0bbcaa]/50 bg-[#0bbcaa]/5"
                : "border-gray-200 hover:border-[#0bbcaa]/40 hover:bg-[#0bbcaa]/5"
            }`}
          >
            <FileText
              aria-hidden="true"
              className={`w-6 h-6 ${selected ? "text-[#0bbcaa]" : "text-gray-400"}`}
            />
            <span className="block max-w-full">
              <span className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                <span className="truncate">{selected?.name ?? "Choose a resume"}</span>
                <ChevronDown aria-hidden="true" className="w-3.5 h-3.5 shrink-0 text-gray-400" />
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {selected?.hint ?? "PDF, DOC, DOCX"}
              </span>
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-64">
          {keep && (
            <ResumeItem
              name={keep.filename}
              hint="Current resume"
              checked={value?.type === "keep"}
              onSelect={() => onChange({ type: "keep" })}
            />
          )}
          {resumes.map((resume, index) => (
            <ResumeItem
              key={resume._id}
              name={resume.filename}
              hint={index === 0 ? "Last used" : null}
              checked={value?.type === "library" && value.id === resume._id}
              onSelect={() => onChange({ type: "library", id: resume._id })}
            />
          ))}
          {value?.type === "new" && (
            <ResumeItem name={value.file.name} hint="New upload" checked onSelect={() => {}} />
          )}

          {(keep || resumes.length > 0 || value?.type === "new") && <DropdownMenuSeparator />}

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            disabled={libraryFull}
            onSelect={() => inputRef.current?.click()}
          >
            <Upload className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="flex flex-col">
              <span>Upload new</span>
              <span className="text-xs text-gray-500">
                {libraryFull
                  ? `${MAX_RESUMES} of ${MAX_RESUMES} saved`
                  : "PDF, DOC, DOCX · max 5MB"}
              </span>
            </span>
          </DropdownMenuItem>

          {libraryFull && (
            <DropdownMenuItem asChild className="cursor-pointer gap-2">
              <Link href={RESUMES_PAGE_URL}>
                <Settings className="w-4 h-4 text-gray-500" aria-hidden="true" />
                Manage resumes
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selected && (
        <button
          type="button"
          onClick={view}
          className="absolute top-2 right-2 rounded-md border border-[#0bbcaa]/40 bg-white px-2 py-0.5 text-xs font-medium text-brand-strong hover:bg-[#0bbcaa]/10 transition-colors"
        >
          View
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

function ResumeItem({ name, hint, checked, onSelect }) {
  return (
    <DropdownMenuItem
      className="cursor-pointer gap-2"
      onSelect={onSelect}
      aria-checked={checked}
      role="menuitemradio"
    >
      <Check
        aria-hidden="true"
        className={`w-4 h-4 shrink-0 text-[#0bbcaa] ${checked ? "" : "invisible"}`}
      />
      <span className="flex min-w-0 flex-col">
        <span className="truncate" title={name}>
          {name}
        </span>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </span>
    </DropdownMenuItem>
  );
}
