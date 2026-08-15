import Link from "next/link";
import CopyButton from "@/Components/CopyButton/CopyButton";

const MOCK_RESUMES = [
  {
    id: 1,
    name: "Ajaz_Miah_Resume_2025.pdf",
    size: "142 KB",
    uploaded: "May 12, 2025",
  },
  {
    id: 2,
    name: "Ajaz_Miah_SWE_Resume.pdf",
    size: "98 KB",
    uploaded: "Apr 3, 2025",
  },
  {
    id: 3,
    name: "Ajaz_Miah_Frontend_Engineer.pdf",
    size: "115 KB",
    uploaded: "Mar 18, 2025",
  },
];

export default function ProfilePage({ name, email, image, socialLinks }) {
  const initials = name?.[0]?.toUpperCase() ?? "?";

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Background teal glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, #0bbcaa 0%, transparent 70%)",
          opacity: 0.05,
          top: "-20%",
          right: "-15%",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#0bbcaa] transition-colors mb-8"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to dashboard
        </Link>

        {/* Profile header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar + name group */}
            <div className="flex items-center gap-6 flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
                    }}
                  >
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0bbcaa] border-2 border-white" />
              </div>

              {/* Name / email */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {name}
                  </h1>
                </div>
                <p className="text-sm text-gray-400">{email}</p>
              </div>
            </div>

            {/* Settings link — far right on desktop, below on mobile */}
            <Link
              href="/dashboard/settings"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-[#0bbcaa] hover:text-[#0bbcaa] hover:bg-[#0bbcaa]/5 transition-colors"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </Link>
          </div>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Social links card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5">
              Social links
            </p>

            <div className="space-y-3">
              {/* LinkedIn */}
              {socialLinks.map((social) => {
                return (
                  <div key={social.url} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-md text-gray-400 mb-0.5">{social.socialLabel}</p>
                      <p className="text-sm font-medium text-gray-700 truncate">
                       {social.url}
                      </p>
                    </div>
                    <CopyButton value={social.url} />
                  </div>
                );
              })}
            </div>

            <Link
              href="/dashboard/settings"
              className="mt-3 flex w-full items-center justify-center py-2.5 rounded-xl text-xs font-medium border border-dashed border-gray-200 text-gray-400 hover:border-[#0bbcaa] hover:text-[#0bbcaa] hover:bg-[#0bbcaa]/5 transition-all duration-200"
            >
              + Add another link
            </Link>
          </div>

          {/* Stats card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 flex flex-col justify-between">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5">
              At a glance
            </p>
            <div className="grid grid-cols-2 gap-4 flex-1">
              {[
                { label: "Applications", value: "24" },
                { label: "Interviews", value: "6" },
                { label: "Offers", value: "1" },
                { label: "Resumes", value: `${MOCK_RESUMES.length}` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col justify-center p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <span
                    className="text-2xl font-bold leading-none"
                    style={{
                      background:
                        "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
