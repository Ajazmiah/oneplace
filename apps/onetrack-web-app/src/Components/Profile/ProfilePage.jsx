"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_RESUMES = [
  { id: 1, name: "Ajaz_Miah_Resume_2025.pdf", size: "142 KB", uploaded: "May 12, 2025" },
  { id: 2, name: "Ajaz_Miah_SWE_Resume.pdf", size: "98 KB", uploaded: "Apr 3, 2025" },
  { id: 3, name: "Ajaz_Miah_Frontend_Engineer.pdf", size: "115 KB", uploaded: "Mar 18, 2025" },
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 border-gray-200 text-gray-500 hover:border-[#0bbcaa] hover:text-[#0bbcaa] hover:bg-[#0bbcaa]/5"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-[#0bbcaa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function ProfilePage({ name, email, image }) {
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
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>

        {/* Profile header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 mb-6">
          <div className="flex items-start gap-6">
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
                  style={{ background: "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)" }}
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#0bbcaa]/25 bg-[#0bbcaa]/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide text-[#0bbcaa]">Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{email}</p>
          
            </div>
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
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">LinkedIn</p>
                  <p className="text-sm font-medium text-gray-700 truncate">linkedin.com/in/ajaz-miah</p>
                </div>
                <CopyButton value="https://linkedin.com/in/ajaz-miah" />
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">GitHub</p>
                  <p className="text-sm font-medium text-gray-700 truncate">github.com/ajaz-miah</p>
                </div>
                <CopyButton value="https://github.com/ajaz-miah" />
              </div>
            </div>

            <button className="mt-3 w-full py-2.5 rounded-xl text-xs font-medium border border-dashed border-gray-200 text-gray-400 hover:border-[#0bbcaa] hover:text-[#0bbcaa] hover:bg-[#0bbcaa]/5 transition-all duration-200">
              + Add another link
            </button>
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
                <div key={stat.label} className="flex flex-col justify-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span
                    className="text-2xl font-bold leading-none"
                    style={{
                      background: "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumes card */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              Uploaded Resumes
            </p>
            <span className="text-xs font-medium text-gray-400">
              {MOCK_RESUMES.length} file{MOCK_RESUMES.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2.5">
            {MOCK_RESUMES.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#0bbcaa]/30 hover:bg-[#0bbcaa]/5 transition-all duration-200 group"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-[#0bbcaa]/30 transition-colors">
                  <svg style={{ width: "18px", height: "18px" }} className="text-[#0bbcaa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{resume.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{resume.size} · Uploaded {resume.uploaded}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-[#0bbcaa] hover:bg-[#0bbcaa]/10 transition-all duration-200" title="View">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-[#0bbcaa] hover:bg-[#0bbcaa]/10 transition-all duration-200" title="Download">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-3 w-full py-2.5 rounded-xl text-xs font-medium border border-dashed border-gray-200 text-gray-400 hover:border-[#0bbcaa] hover:text-[#0bbcaa] hover:bg-[#0bbcaa]/5 transition-all duration-200">
            + Upload new resume
          </button>
        </div>
      </div>
    </main>
  );
}
