import ApplicationTable from "@/components/(applicationsClientComponent)/ApplicationTable";
import getApplications from "@/app/lib/DataAccessLayer/getUserApplications";

export default async function JobApplicationsPage() {
  const applications = JSON.parse(JSON.stringify(await getApplications()));

  return <ApplicationTable applications={applications} />;
}
