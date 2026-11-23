"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import AlertDialogBox from "@/Components/AlertDialog/AlertDialog";
import { MAX_RESUMES } from "@/app/lib/constants";
import { openDocument, validateFile } from "@/app/lib/utils/utils";
import { uploadToS3 } from "@/app/lib/utils/uploadToS3";
import { deleteResume, uploadResume } from "@/app/lib/actions/resumes/resumeActions";

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * @param {{ resumes: Array<{ _id: string, filename: string, size: number }> }} props
 *        most recently used first; the actions refresh it after each change (updateTag)
 */
export default function ResumesList({ resumes }) {
  const inputRef = useRef(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [, startTransition] = useTransition();

  const full = resumes.length >= MAX_RESUMES;

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // so picking the same file again still fires onChange
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setIsUploading(true);
    try {
      // The bytes go straight to S3; the action gets only the key
      const { key, filename } = await uploadToS3(file);
      const formData = new FormData();
      formData.append("resumeKey", key);
      formData.append("resumeName", filename);

      const result = await uploadResume(formData);
      if (result?.success) toast.success(result.message);
      else toast.error(result?.message || "Couldn't add the resume.");
    } catch (err) {
      toast.error(err instanceof TypeError ? "Network error — please try again" : err.message);
    } finally {
      setIsUploading(false);
    }
  }

  function confirmDelete() {
    const resume = pendingDelete;
    setPendingDelete(null);
    if (!resume) return;

    setDeletingId(resume._id);
    startTransition(async () => {
      const result = await deleteResume(resume._id);
      setDeletingId(null);
      if (result?.success) toast.success(result.message);
      else toast.error(result?.message || "Couldn't delete the resume.");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <AlertDialogBox
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete "${pendingDelete?.filename ?? ""}"?`}
        description="It's removed from your list. Applications already sent with it will still show it."
      />

      {resumes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          No resumes yet. Upload one here, or add one when you save an application.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {resumes.map((resume, index) => (
            <li
              key={resume._id}
              className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3"
            >
              <FileText className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900" title={resume.filename}>
                  {resume.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {formatSize(resume.size)}
                  {index === 0 && " · Last used"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openDocument(`/api/resumes/${resume._id}/file`)}
                className="rounded-md border border-brand/40 px-2.5 py-1 text-xs font-medium text-brand-strong transition-colors hover:bg-brand/10"
              >
                View
              </button>
              <button
                type="button"
                aria-label={`Delete ${resume.filename}`}
                disabled={deletingId === resume._id}
                onClick={() => setPendingDelete(resume)}
                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                {deletingId === resume._id ? (
                  <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-gray-500">
          {resumes.length} of {MAX_RESUMES} used
          {full && " · delete one to upload another"}
        </p>
        <button
          type="button"
          disabled={full || isUploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-brand/50 hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="h-4 w-4" aria-hidden="true" />
          )}
          {isUploading ? "Uploading..." : "Upload resume"}
        </button>
      </div>

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
