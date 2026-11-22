import { NextResponse } from "next/server";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { validateFile } from "@/app/lib/utils/utils";
import { buildFileKey, createUploadPost } from "@/app/lib/s3/s3";

/**
 * Step 1 of an upload: the client says what it wants to upload, gets back a signed form,
 * and POSTs the file straight to S3. It then submits the returned `key` with the
 * application instead of the file. Used by the web forms and the extension.
 * Body: { mimetype: string, size: number }
 */
export async function POST(request) {
  try {
    const session = await getCachedAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Not Found!" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => null);
    const mimetype = typeof body?.mimetype === "string" ? body.mimetype : "";
    const size = Number(body?.size);

    // Rejects a bad type or size up front; S3 enforces both again during the upload
    const fileError = validateFile({ type: mimetype, size });
    if (fileError || !(size > 0)) {
      return NextResponse.json(
        { success: false, message: fileError || "File is empty." },
        { status: 400 }
      );
    }

    const key = buildFileKey({
      userId: user._id.toString(),
      kind: "upload",
      mimetype,
    });
    const { url, fields } = await createUploadPost({ key, mimetype });

    return NextResponse.json({ success: true, url, fields, key }, { status: 200 });
  } catch (error) {
    console.error("Error creating upload URL:", error);
    return NextResponse.json(
      { success: false, message: "Could not start the upload. Please try again." },
      { status: 500 }
    );
  }
}
