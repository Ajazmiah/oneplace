import { getApplications } from "@/app/lib/DataAccessLayer/applications";
import ApplicationTable from "@/Components/Applications/ApplicationTable";

export default async function JobApplicationsPage() {
  const applications = JSON.parse(JSON.stringify(await getApplications()));

  // const sorted = applications.sort(
  //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  // );

  return <ApplicationTable applications={applications} />;
}
