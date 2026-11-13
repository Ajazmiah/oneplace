// S3 storage for resumes and cover letters. Server-side only: it uses the AWS secret key.
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getBuffer } from "@/app/lib/utils/utils";

const BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

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
