import ResumesCard from "@/Components/Resumes/ResumesCard";
import { MAX_RESUMES } from "@/app/lib/constants";

export default function ResumePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Page header, same style as Settings */}
      <header className="mb-10 flex flex-col items-start gap-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3 py-1">
          <span className="size-1.5 motion-safe:animate-pulse rounded-full bg-brand" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-strong">
            Resume
          </span>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-gray-500">
          Keep up to {MAX_RESUMES} resumes and pick one for each application. Applications
          sent with the same resume share it, so there&apos;s nothing to re-upload.
        </p>
      </header>

      <ResumesCard />
    </div>
  );
}
