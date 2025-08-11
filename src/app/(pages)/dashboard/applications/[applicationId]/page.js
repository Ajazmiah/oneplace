import { getSingleApplication } from "@/app/lib/DataAccessLayer/applications";
import JobDetails from "@/components/JobDetails/JobDetails";

export default async function JobDetailsPage({ params }) {
  const jobApplication = await JSON.parse(
    JSON.stringify(await getSingleApplication(params.applicationId))
  );

  const job = {
    ...jobApplication,

    resume: "https://example.com/resume.pdf",
    coverLetter: "https://example.com/coverletter.pdf",
  };

  return <JobDetails job={job} />;
}
