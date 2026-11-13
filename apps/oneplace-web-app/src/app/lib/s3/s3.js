// S3 storage for resumes and cover letters. Server-side only: it uses the AWS secret key.
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getBuffer, fileResponseHeaders } from "@/app/lib/utils/utils";

const BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

// How long a view link works. Long enough that refreshing the PDF tab during a normal
// read still works, short enough that a copied link is useless soon after.
const VIEW_URL_EXPIRES_SECONDS = 5 * 60;

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
