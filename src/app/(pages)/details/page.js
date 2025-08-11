import JobDetails from "@/components/JobDetails/JobDetails";


export default function JobDetailsPage() {
  const job = {
    job_title: "Frontend Engineer",
    company: "TechNova Solutions",
    status: "interviewing", // applied | interviewing | offer | rejected | withdrawn
    job_description: `We are looking for a talented Frontend Engineer to join our dynamic team.
  You will work on building responsive and scalable UI components.
  Experience with React, Next.js, and TailwindCSS is required.
  Knowledge of accessibility and performance optimization is a plus.`,

    position: "Full-time",
    location: "New York, NY (Hybrid)",
    application_date: "2025-07-15",
    salary_range: "$90,000 - $110,000",

    resume_url: "https://example.com/resume.pdf",
    cover_letter_url: "https://example.com/coverletter.pdf",
  };
  return <JobDetails job={job} />;
}
