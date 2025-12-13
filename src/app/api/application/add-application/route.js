import { NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";

// Assuming these imports are correctly configured with path aliases in your project
import addApplicationModel from "@/database/models/addApplicationModel";
import { getUserByEmail } from "../../../lib/utils/databaseUtils";
import { getUserSession } from "../../../lib/DataAccessLayer/getSession";
import { getBuffer } from "../../../lib/utils/utils";

/**
 * Handles POST requests to create a new application.
 * Expected URL: /api/applications
 * @param {Request} request The incoming Next.js Request object.
 */
export async function POST(request) {

  console.log("___REQ____", request)
  // 1. Get Session & Authenticate
  const session = await getUserSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 } // Unauthorized
    );
  }

  // 2. Find User
  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User Not Found!" },
      { status: 404 } // Not Found
    );
  }

  try {
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
    
    // File fields (will be File objects or null)
    const coverLetter = formData.get("coverLetter");
    const resume = formData.get("resume");

    // 4. Basic Validation
    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { success: false, message: "Job title and company are required." },
        { status: 400 } // Bad Request
      );
    }
    
    // 5. Process File Uploads
    let resumeData = null;
    let coverLetterData = null;

    // Check if the file fields are non-null and an actual File object (not an empty string)
    if (resume && typeof resume === "object" && resume.size > 0) {
      resumeData = {
        filename: resume.name,
        mimetype: resume.type,
        data: await getBuffer(resume), // Convert File object to a Buffer
      };
    }
    if (coverLetter  && typeof resume === "object" && coverLetter.size > 0) {
      coverLetterData = {
        filename: coverLetter.name,
        mimetype: coverLetter.type,
        data: await getBuffer(coverLetter), // Convert File object to a Buffer
      };
    }

    // 6. Create Database Entry
    const application = await addApplicationModel.create({
      jobTitle,
      companyName,
      status: status === "" ? "applied" : status,
      description,
      location,
      salaryRange,
      resume: resumeData,
      coverLetter: coverLetterData,
      userId: user._id,
    });

    // 7. Revalidate Cache
    revalidatePath("/dashboard/applications");

    // 8. Prepare and Send Response
    // Remove binary data before sending the JSON response
    const responseData = application.toObject();
    delete responseData.resume?.data;
    delete responseData.coverLetter?.data;

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 } // Internal Server Error
    );
  }
}