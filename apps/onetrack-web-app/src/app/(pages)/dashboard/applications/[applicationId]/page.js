import { getSingleApplication } from "@/app/lib/DataAccessLayer/applications";
import JobDetails from "../../../../../Components/JobDetails/JobDetails";

export default async function JobDetailsPage({ params }) {

  const {applicationId} = await params
  const jobApplication = await JSON.parse(
    JSON.stringify(await getSingleApplication(applicationId))
  );

  const job = {
    ...jobApplication,
  };

  return <JobDetails job={job} />;
}
