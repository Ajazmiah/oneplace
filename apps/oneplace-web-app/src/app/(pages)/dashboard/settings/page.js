import ProfileForm from "@/Components/Settings/ProfileForm/ProfileForm";
import SocialLinksSetting from "@/Components/Settings/SocialLinksSetting";
import DangerZone from "@/Components/Settings/DangerZone";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Page header */}
      <header className="mb-10 flex flex-col items-start gap-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3 py-1">
          <span className="size-1.5 motion-safe:animate-pulse rounded-full bg-brand" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-strong">
            Settings
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <p className="max-w-xl text-base leading-relaxed text-gray-500">
            Complete your profile once and we&apos;ll use it to autofill job applications
            for you, so you spend less time retyping the same details.
          </p>
        </div>
      </header>

      {/* Profile + social links scroll inside this box; the danger zone stays below it */}
      <div
        role="region"
        aria-label="Profile and social links"
        tabIndex={0}
        className="max-h-[65vh] overflow-y-auto overscroll-contain p-1 outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40 [scrollbar-gutter:stable] [scrollbar-width:thin]"
      >
        <ProfileForm />

        <div className="mt-6">
          <SocialLinksSetting />
        </div>
      </div>

      <div className="mt-8">
        <DangerZone />
      </div>
    </div>
  );
}
