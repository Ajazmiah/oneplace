import ApplicationForm from "@/Components/Applications/ApplicationForm";
import { getResumes } from "@/app/lib/DataAccessLayer/resumes";

// Server component so the resume list arrives with the page (cached, no client fetch)
export default async function AddApplicationPage() {
  const resumes = await getResumes();
  return <ApplicationForm resumes={resumes} />;
}
