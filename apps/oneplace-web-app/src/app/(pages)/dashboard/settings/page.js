import SocialLinksSetting from "@/Components/Settings/SocialLinksSetting";
import DangerZone from "@/Components/Settings/DangerZone";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1.5">
          <span className="size-1.5 motion-safe:animate-pulse rounded-full bg-brand" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-strong">
            Settings
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Account settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your connected profiles and account preferences.
        </p>
      </div>

      <SocialLinksSetting />

      <div className="mt-8">
        <DangerZone />
      </div>
    </div>
  );
}
