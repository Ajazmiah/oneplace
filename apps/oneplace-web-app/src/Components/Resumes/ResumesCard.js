// Resume library card on the Resume page. Server component: loads the saved resumes;
// ResumesList (client) handles View, upload and delete.
import { FileText } from "lucide-react";
import { getResumes } from "@/app/lib/DataAccessLayer/resumes";
import { MAX_RESUMES } from "@/app/lib/constants";
import ProfileSection from "@/Components/Settings/ProfileForm/ProfileSection";
import ResumesList from "./ResumesList";

export default async function ResumesCard() {
  const resumes = await getResumes();

  return (
    <ProfileSection
      icon={FileText}
      accent="brand"
      title="Your resumes"
      description={`Most recently used first. You can keep up to ${MAX_RESUMES}.`}
    >
      <ResumesList resumes={resumes} />
    </ProfileSection>
  );
}
