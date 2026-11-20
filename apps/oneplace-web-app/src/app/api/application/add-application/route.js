import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from "next/cache";
import { Types } from "mongoose";
import addApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "../../../lib/utils/databaseUtils";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";
import { deleteFiles } from "@/app/lib/s3/s3";
import {
  claimUpload,
  resumeFromDefault,
  saveDefaultResume,
  UploadError,
} from "@/app/lib/s3/applicationFiles";

/**
 * Handles POST requests to create a new application.
 * Expected URL: /api/application/add-application
 * @param {Request} request The incoming Next.js Request object.
 */
export async function POST(request) {
  try {
    // 1. Get Session & Authenticate
    const session = await getCachedAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 } // Unauthorized
      );
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Not Found!" },
        { status: 404 } // Not Found
      );
    }

    // 3. Extract Form Data
    // For file uploads and multipart/form-data, use request.formData()
    const formData = await request.formData();

    // Use .get() to retrieve the fields
    const jobTitle = formData.get("jobTitle");
    const companyName = formData.get("companyName");
    const status = formData.get("status");
    const description = formData.get("details");
    const location = formData.get("location");
    const salaryRange = formData.get("salaryRange");
    const jobUrl = formData.get("jobUrl");

    // Files were already uploaded straight to S3 (see /api/uploads/presign);
    // the client sends each upload's key and original filename instead of the bytes
    const resumeKey = formData.get("resumeKey");
    const resumeName = formData.get("resumeName");
    const coverLetterKey = formData.get("coverLetterKey");
    const coverLetterName = formData.get("coverLetterName");
    const useDefaultResume = formData.get("useDefaultResume");

    // 4. Basic Validation
    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { success: false, message: "Job title and company are required." },
        { status: 400 } // Bad Request
      );
    }

    // 5. Move uploads into the application's folder, then create the database entry.
    // The _id is created up front so file keys can include it. claimUpload checks each
    // key belongs to this user and validates the stored file's type and size.
    const userId = user._id.toString();
    const applicationId = new Types.ObjectId();
    const fileParams = { userId, applicationId: applicationId.toString() };
    const isUploadedResume = useDefaultResume !== "true" && Boolean(resumeKey);

    let resumeData = null;
    let coverLetterData = null;
    let application;

    try {
      if (useDefaultResume === "true") {
        resumeData = await resumeFromDefault(fileParams);
      } else if (isUploadedResume) {
        resumeData = await claimUpload({
          ...fileParams,
          kind: "resume",
          key: resumeKey,
          filename: resumeName,
        });
      }
      if (coverLetterKey) {
        coverLetterData = await claimUpload({
          ...fileParams,
          kind: "coverletter",
          key: coverLetterKey,
          filename: coverLetterName,
        });
      }

      // 7. Create Database Entry
      application = await addApplicationModel.create({
        _id: applicationId,
        jobTitle,
        companyName,
        status: status === "" ? "applied" : status,
        description,
        location,
        salaryRange,
        jobUrl,
        resume: resumeData,
        coverLetter: coverLetterData,
        userId: user._id,
      });
    } catch (error) {
      // Nothing points at the files uploaded or copied above, so remove them
      await deleteFiles([resumeData?.key, coverLetterData?.key]).catch((cleanupError) =>
        console.error("Failed to clean up S3 files after a failed save:", cleanupError)
      );
      throw error;
    }

    // A newly uploaded resume becomes the default. The application is already saved, so a
    // failure here is logged rather than returned: a 500 would make the user submit it twice.
    if (isUploadedResume) {
      try {
        await saveDefaultResume({ userId, resume: resumeData });
        revalidateTag(`default-resume-${userId}`);
      } catch (error) {
        console.error("Failed to update default resume:", error);
      }
    }


    // 8. Revalidate Cache
    revalidateTag(`applications-${userId}`);
    revalidatePath("/dashboard/applications");

    // 9. Send Response
    return NextResponse.json(
      { success: true, data: application.toObject() },
      { status: 201 } // Created
    );
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    console.error("Error creating application:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while saving the application." },
      { status: 500 } // Internal Server Error
    );
  }
}