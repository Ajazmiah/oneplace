// Browser-side upload straight to S3, so file bytes never pass through our server.
// The Chrome extension has its own copy of this flow in SidePanel.tsx.

/**
 * Upload one file and return what the form submits in its place.
 * 1. Ask our server for a signed upload form (it checks the session, type and size).
 * 2. POST the file to S3 with that form; S3 enforces the same type and size limits.
 * @param {File} file
 * @returns {Promise<{ key: string, filename: string }>}
 * @throws {Error} with a message that's safe to show the user
 */
export async function uploadToS3(file) {
  const res = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mimetype: file.type, size: file.size }),
  });
  const presign = await res.json().catch(() => null);
  if (!res.ok || !presign?.success) {
    throw new Error(presign?.message || "Could not start the upload.");
  }

  const form = new FormData();
  Object.entries(presign.fields).forEach(([name, value]) => form.append(name, value));
  form.append("file", file); // S3 requires the file to be the last field

  const upload = await fetch(presign.url, { method: "POST", body: form });
  if (!upload.ok) {
    throw new Error("Upload failed. Please try again.");
  }

  return { key: presign.key, filename: file.name };
}

/**
 * Upload `file` if there is one and add its key and filename to `formData`
 * as `<field>Key` and `<field>Name` (e.g. resumeKey / resumeName).
 * @param {FormData} formData
 * @param {"resume" | "coverLetter"} field
 * @param {File | null | undefined} file
 */
export async function appendUpload(formData, field, file) {
  if (!(file instanceof File) || file.size === 0) return;
  const { key, filename } = await uploadToS3(file);
  formData.append(`${field}Key`, key);
  formData.append(`${field}Name`, filename);
}
