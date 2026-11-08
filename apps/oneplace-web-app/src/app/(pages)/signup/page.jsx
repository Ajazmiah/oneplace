"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left: brand panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-center pl-16 pr-10 w-1/2 relative overflow-hidden border-r border-gray-100">
        {/* Teal radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, #0bbcaa 0%, transparent 70%)",
            opacity: 0.08,
            top: "50%",
            left: "0%",
            transform: "translate(-35%, -50%)",
          }}
        />

        <div className="relative z-10 max-w-md ml-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-10 px-3.5 py-1.5 rounded-full border border-[#0bbcaa]/25 bg-[#0bbcaa]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] motion-safe:animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-strong">
              Join for free
            </span>
          </div>

          <h1 className="font-bold tracking-tight text-gray-900 text-4xl xl:text-5xl leading-[1.08]">
            Your job search,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              organized.
            </span>
          </h1>

          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            Create your free account and start tracking every application,
            interview, and offer in one place.
          </p>

          {/* Feature callouts */}
          <div className="mt-10 space-y-4">
            {[
              { icon: "◈", label: "Track every application in one dashboard" },
              { icon: "◎", label: "Monitor interview stages and follow-ups" },
              { icon: "◉", label: "Attach resumes and cover letters" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-[#0bbcaa] text-lg leading-none">
                  {item.icon}
                </span>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Stat strip */}
          <div className="mt-12 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-none">
                500+
              </span>
              <span className="text-xs text-gray-500 mt-1">apps tracked</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-none">
                Free
              </span>
              <span className="text-xs text-gray-500 mt-1">forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex items-center justify-center px-6 lg:justify-start lg:pl-10 lg:pr-6 py-16 relative">
        {/* Subtle background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, #0bbcaa 0%, transparent 70%)",
            opacity: 0.06,
            top: "50%",
            right: "-10%",
            transform: "translateY(-50%)",
          }}
        />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile-only badge + heading */}
          <div className="lg:hidden mb-8">
            <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-[#0bbcaa]/25 bg-[#0bbcaa]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] motion-safe:animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-strong">
                Join free
              </span>
            </div>
            <h1 className="font-bold tracking-tight text-gray-900 text-3xl leading-[1.08]">
              Get{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                started.
              </span>
            </h1>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            {/* Desktop card heading */}
            <div className="hidden lg:block mb-7">
              <h2 className="font-bold text-gray-900 text-2xl tracking-tight">
                Get started free
              </h2>
            </div>

            {/* Accounts are created on first Google/GitHub sign-in, on the sign-in page */}
            <div className="space-y-3">
              <Link
                href="/signin"
                className="block w-full bg-brand-strong text-white py-3 rounded-lg text-sm font-semibold hover:bg-brand-strong-hover transition-colors text-center"
              >
                Continue to sign up
              </Link>
            </div>

            {/* Footer link */}
            <p className="text-xs text-gray-500 mt-6 text-center">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-brand-strong font-semibold hover:text-[#085041] transition-colors"
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
