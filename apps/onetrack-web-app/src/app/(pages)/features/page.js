import Link from "next/link";

export const metadata = {
  title: "Features – OnePlace",
  description:
    "Everything OnePlace gives you to run your job search: application tracking, resume and cover letter storage, status analytics, an interview answer library, secure sign-in, and more — all in one place.",
  keywords: [
    "job application tracker features",
    "resume manager",
    "cover letter storage",
    "interview answer library",
    "job search dashboard",
    "OnePlace features",
  ],
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "Features – OnePlace",
    description:
      "Application tracking, document storage, status analytics, an interview answer library, and secure sign-in — everything to stay interview-ready.",
    url: "/features",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features – OnePlace",
    description:
      "Everything OnePlace gives you to run your job search — all in one place.",
  },
};

const features = [
  {
    name: "Application tracking",
    description:
      "Create, edit, and organize every job application in one place. Capture the job title, company, location, salary range, job URL, and a full description.",
    icon: "clipboard",
  },
  {
    name: "Resume & cover letter storage",
    description:
      "Attach a resume and cover letter to each application. Your documents are stored securely and stay linked to the role you applied for.",
    icon: "document",
  },
  {
    name: "View & download documents",
    description:
      "Open any saved resume or cover letter right in the browser, or download it whenever you need it for a follow-up.",
    icon: "download",
  },
  {
    name: "Status tracking",
    description:
      "Move applications through stages — applied, interviewing, offer, rejected — so you always know exactly where each one stands.",
    icon: "flag",
  },
  {
    name: "Status analytics",
    description:
      "See live counts for every stage of your search at a glance, so you can spot momentum and follow up on what matters.",
    icon: "chart",
  },
  {
    name: "Search & filter",
    description:
      "Instantly find any application by keyword or narrow your list by status. No more scrolling through spreadsheets.",
    icon: "search",
  },
  {
    name: "Interview answer library",
    description:
      "Save and reuse your best answers to common interview questions, so you walk into every interview prepared and confident.",
    icon: "chat",
  },
  {
    name: "Secure sign-in",
    description:
      "Sign in with GitHub or Google. No passwords to remember, and your data stays tied to your account.",
    icon: "shield",
  },
  {
    name: "One central dashboard",
    description:
      "Every application, document, and interview note lives in a single, focused dashboard — the whole job search in one place.",
    icon: "grid",
  },
];

const icons = {
  clipboard:
    "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
  document:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  download:
    "M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4",
  flag: "M3 21v-4m0 0V5a2 2 0 0 1 2-2h6.5l1 2H21l-3 6 3 6h-8.5l-1-2H5a2 2 0 0 0-2 2z",
  chart: "M9 19v-6m4 6V9m4 10V5M4 21h16",
  search: "M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0z",
  chat: "M8 12h.01M12 12h.01M16 12h.01M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  grid: "M4 5a1 1 0 0 1 1-1h5v6H4V5zm10-1h5a1 1 0 0 1 1 1v5h-6V4zM4 14h6v6H5a1 1 0 0 1-1-1v-5zm10 0h6v5a1 1 0 0 1-1 1h-5v-6z",
};

function FeatureIcon({ name }) {
  return (
    <svg
      className="size-6 text-brand"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  );
}

export default function FeaturesPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background teal glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, #0bbcaa 0%, transparent 70%)",
          opacity: 0.06,
          top: "-10%",
          right: "-15%",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-32">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand">
                Features
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to run your job search
          </h1>
          <p className="mt-6 text-lg text-gray-500">
            From the first application to the final offer, OnePlace keeps every
            detail organized so you can stay focused and interview-ready.
          </p>
        </header>

        {/* Feature grid */}
        <section className="mt-16" aria-label="Features">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col rounded-3xl bg-white/60 p-8 ring-1 ring-gray-200 transition-shadow hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10">
                  <FeatureIcon name={feature.icon} />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-gray-900">
                  {feature.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 text-center" aria-label="Get started">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Ready to get organized?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-gray-500">
            Start free — no credit card required. Upgrade whenever you&apos;re
            ready.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl bg-brand/10 px-5 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand/20"
            >
              See pricing
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
