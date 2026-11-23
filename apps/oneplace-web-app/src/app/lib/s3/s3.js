// S3 storage for resumes and cover letters. Server-side only: it uses the AWS secret key.
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
  DeleteObjectsCommand,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { fileResponseHeaders, MAX_FILE_SIZE_BYTES } from "@/app/lib/utils/utils";

// Not named AWS_*: Vercel runs functions on AWS Lambda, which reserves AWS_REGION,
// AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for its own values.
const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.S3_REGION;
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

// How long a view link works. Long enough that refreshing the PDF tab during a normal
// read still works, short enough that a copied link is useless soon after.
const VIEW_URL_EXPIRES_SECONDS = 5 * 60;

// How long the browser has to start an upload after asking for permission
const UPLOAD_EXPIRES_SECONDS = 5 * 60;

// S3 accepts at most 1000 keys per DeleteObjects request
const DELETE_BATCH_SIZE = 1000;

const EXTENSIONS = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

/**
 * Build the S3 key for a file. Every key lives under users/<userId>/ so a user's files can be
 * found (and deleted) by prefix. A random UUID per upload means a replacement never
 * overwrites the old file before Mongo points at the new one, and keys can't be guessed.
 *
 *   application file: users/<userId>/applications/<applicationId>/<kind>-<uuid>.<ext>
 *   library resume:   users/<userId>/resumes/<uuid>.<ext>
 *   browser upload:   tmp/<userId>/<uuid>.<ext>   (moved into place on submit)
 *
 * Uploads sit under a top-level tmp/ because an S3 lifecycle rule can only match a key's
 * start, so "expire tmp/ after 1 day" cleans up uploads that were never submitted.
 *
 * @param {{ userId: string, kind: "resume" | "coverletter" | "library-resume" | "upload",
 *           applicationId?: string, mimetype: string }} params
 * @returns {string}
 */
export function buildFileKey({ userId, kind, applicationId, mimetype }) {
  const ext = EXTENSIONS[mimetype] ?? "bin";
  const id = crypto.randomUUID();

  if (kind === "upload") {
    return `tmp/${userId}/${id}.${ext}`;
  }
  if (kind === "library-resume") {
    return `users/${userId}/resumes/${id}.${ext}`;
  }
  if (!applicationId) {
    throw new Error("buildFileKey: applicationId is required for application files");
  }
  return `users/${userId}/applications/${applicationId}/${kind}-${id}.${ext}`;
}

/**
 * True when `key` is a browser upload made by this user, exactly as buildFileKey() shapes it.
 * The client sends the key back on submit, so this stops a user claiming someone else's
 * upload or pointing at any other object in the bucket.
 * @param {string} userId
 * @param {unknown} key
 */
export function isUploadKeyOf(userId, key) {
  const exts = Object.values(EXTENSIONS).join("|");
  const pattern = new RegExp(`^tmp/${userId}/[0-9a-f-]{36}\\.(${exts})$`);
  return typeof key === "string" && pattern.test(key);
}

if (!BUCKET || !REGION || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error(
    "S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be set"
  );
}

// Credentials are passed in explicitly: the SDK only finds them on its own under the
// AWS_* names, and on Vercel those hold Lambda's credentials, not ours.
// Cached on global so dev hot reloads reuse one client (same pattern as dbConnection.js).
const s3 =
  global._s3Client ??
  (global._s3Client = new S3Client({
    region: REGION,
    credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
  }));

/**
 * Signed form that lets the browser upload one file straight to S3, so the bytes never pass
 * through our server (Vercel rejects request bodies over 4.5MB). S3 itself enforces the
 * conditions: this exact key, this content type, and 1 byte to MAX_FILE_SIZE_BYTES.
 * Validate the type and size with validateFile() before calling it.
 * @param {{ key: string, mimetype: string }} params
 * @returns {Promise<{ url: string, fields: Record<string, string> }>}
 *          POST multipart to `url` with every field, then the file last, as "file"
 */
export async function createUploadPost({ key, mimetype }) {
  return createPresignedPost(s3, {
    Bucket: BUCKET,
    Key: key,
    Fields: { "Content-Type": mimetype },
    Conditions: [
      ["content-length-range", 1, MAX_FILE_SIZE_BYTES],
      ["eq", "$Content-Type", mimetype],
    ],
    Expires: UPLOAD_EXPIRES_SECONDS,
  });
}

/**
 * Size and type of a stored file, read from S3 rather than trusted from the client.
 * @param {string} key
 * @returns {Promise<{ size: number, mimetype: string } | null>} null when there's no such file
 */
export async function getFileInfo(key) {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return { size: head.ContentLength, mimetype: head.ContentType };
  } catch (error) {
    if (error.name === "NotFound") return null;
    throw error;
  }
}

/**
 * Short-lived signed URL for viewing a private file. Only call it after checking that
 * the signed-in user owns the file; anyone holding the URL can open it until it expires.
 * @param {string} key  Object key stored in Mongo
 * @param {{ filename: string, mimetype: string }} meta  Original name and type, from Mongo
 * @returns {Promise<string>} URL to redirect the browser to
 */
export async function getViewUrl(key, { filename, mimetype }) {
  // Same type allow-list and filename escaping the old Buffer route used
  const headers = fileResponseHeaders({ filename, mimetype });

  // Browsers can only display PDFs; DOC/DOCX download instead of opening a blank tab
  const disposition =
    headers["Content-Type"] === "application/pdf"
      ? headers["Content-Disposition"]
      : headers["Content-Disposition"].replace(/^inline/, "attachment");

  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ResponseContentType: headers["Content-Type"],
      ResponseContentDisposition: disposition,
    }),
    { expiresIn: VIEW_URL_EXPIRES_SECONDS }
  );
}

/**
 * Copy a file inside the bucket, e.g. the default resume into an application's folder,
 * so each application owns its files and deleting one never breaks another.
 * Content type is copied along with the bytes.
 * @param {string} from  Existing object key
 * @param {string} to    New object key
 * @returns {Promise<string>} The new key
 */
export async function copyFile(from, to) {
  // CopySource is "<bucket>/<key>" and must be URL-encoded; keep the "/" separators
  const encodedFrom = from.split("/").map(encodeURIComponent).join("/");

  await s3.send(
    new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${encodedFrom}`,
      Key: to,
    })
  );

  return to;
}

/**
 * Delete files by key. Empty, null and duplicate keys are skipped, so callers can pass
 * e.g. [application.resume?.key, application.coverLetter?.key] directly.
 * Deleting a key that doesn't exist is not an error in S3.
 * @param {Array<string | null | undefined>} keys
 * @returns {Promise<void>}
 */
export async function deleteFiles(keys) {
  const unique = [...new Set(keys.filter(Boolean))];

  for (let i = 0; i < unique.length; i += DELETE_BATCH_SIZE) {
    const batch = unique.slice(i, i + DELETE_BATCH_SIZE);

    const { Errors } = await s3.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
      })
    );

    // DeleteObjects reports per-key failures in the response instead of throwing
    if (Errors?.length) {
      const failed = Errors.map((e) => `${e.Key} (${e.Code})`).join(", ");
      throw new Error(`Failed to delete S3 objects: ${failed}`);
    }
  }
}

/**
 * Delete every file a user has: everything under "users/<userId>/" plus any unsubmitted
 * uploads under "tmp/<userId>/". Used on account deletion.
 * Needs s3:ListBucket on the bucket in addition to s3:DeleteObject.
 * @param {string | import("mongoose").Types.ObjectId} userId
 * @returns {Promise<void>}
 */
export async function deleteUserFiles(userId) {
  const id = String(userId ?? "");

  // Guard against an empty or malformed id turning the prefix into "users/" and
  // wiping every user's files
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    throw new Error("deleteUserFiles: userId must be a valid ObjectId");
  }

  for (const prefix of [`users/${id}/`, `tmp/${id}/`]) {
    const pages = paginateListObjectsV2(
      { client: s3, pageSize: DELETE_BATCH_SIZE },
      { Bucket: BUCKET, Prefix: prefix }
    );

    // Delete page by page so large accounts never hold every key in memory
    for await (const page of pages) {
      const keys = (page.Contents ?? []).map((obj) => obj.Key);
      if (keys.length) await deleteFiles(keys);
    }
  }
}
