// S3 storage for resumes and cover letters. Server-side only: it uses the AWS secret key.
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectsCommand,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getBuffer, fileResponseHeaders } from "@/app/lib/utils/utils";

const BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

// How long a view link works. Long enough that refreshing the PDF tab during a normal
// read still works, short enough that a copied link is useless soon after.
const VIEW_URL_EXPIRES_SECONDS = 5 * 60;

// S3 accepts at most 1000 keys per DeleteObjects request
const DELETE_BATCH_SIZE = 1000;

if (!BUCKET || !REGION) {
  throw new Error("AWS_S3_BUCKET and AWS_REGION must be set");
}

// Credentials come from AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY, which the SDK reads automatically.
// Cached on global so dev hot reloads reuse one client (same pattern as dbConnection.js).
const s3 =
  global._s3Client ?? (global._s3Client = new S3Client({ region: REGION }));

/**
 * Upload a file to the bucket under `key`.
 * @param {string} key  Object key, e.g. "users/<userId>/applications/<appId>/resume-<uuid>.pdf"
 * @param {File} file   File from request.formData(); validate it with validateFile() first
 * @returns {Promise<{ key: string, filename: string, mimetype: string, size: number }>}
 *          Metadata to store in Mongo in place of the file bytes
 */
export async function uploadFile(key, file) {
  const body = await getBuffer(file);

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: file.type,
      ContentLength: body.length,
    })
  );

  return {
    key,
    filename: file.name,
    mimetype: file.type,
    size: body.length,
  };
}

/**
 * Short-lived signed URL for viewing a private file. Only call it after checking that
 * the signed-in user owns the file; anyone holding the URL can open it until it expires.
 * @param {string} key  Object key saved by uploadFile()
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
 * Delete every file a user has (everything under "users/<userId>/"). Used on account deletion.
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

  const pages = paginateListObjectsV2(
    { client: s3, pageSize: DELETE_BATCH_SIZE },
    { Bucket: BUCKET, Prefix: `users/${id}/` }
  );

  // Delete page by page so large accounts never hold every key in memory
  for await (const page of pages) {
    const keys = (page.Contents ?? []).map((obj) => obj.Key);
    if (keys.length) await deleteFiles(keys);
  }
}
