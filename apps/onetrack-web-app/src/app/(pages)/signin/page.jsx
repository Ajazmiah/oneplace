"use client";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function AuthPage() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const providerIcons = {
    Google: <FcGoogle className="w-5 h-5" />,
    GitHub: <FaGithub className="w-5 h-5" />,
  };

  return (
    <main className="min-h-screen bg-white flex">
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#0bbcaa]">
              Your search hub
            </span>
          </div>

          <h2 className="font-bold tracking-tight text-gray-900 text-4xl xl:text-5xl leading-[1.08]">
            Every application,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              one place.
            </span>
          </h2>

          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            Sign in to pick up exactly where you left off. Your tracked
            applications are waiting.
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
              <span className="text-xs text-gray-400 mt-1">apps tracked</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-none">
                Free
              </span>
              <span className="text-xs text-gray-400 mt-1">forever</span>
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#0bbcaa]">
                OnePlace
              </span>
            </div>
            <h1 className="font-bold tracking-tight text-gray-900 text-3xl leading-[1.08]">
              Welcome{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                back.
              </span>
            </h1>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            {/* Desktop card heading */}
            <div className="hidden lg:block mb-7">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
                Sign in
              </p>
              <h3 className="font-bold text-gray-900 text-2xl tracking-tight">
                Welcome back
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Continue your job search journey
              </p>
            </div>

            {/* Credentials form */}
            <form
              method="post"
              action="/api/auth/callback/credentials"
              className="space-y-3"
            >
              <input
                name="username"
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]/40 focus:border-[#0bbcaa] transition-colors"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]/40 focus:border-[#0bbcaa] transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-main text-white py-3 rounded-lg text-sm font-semibold hover:bg-main-light transition-colors"
              >
                Sign in
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium tracking-wide">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* OAuth providers */}
            <div className="space-y-2.5">
              {providers &&
                Object.values(providers).map((provider) => {
                  if (provider.id === "credentials") return null;
                  return (
                    <button
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                      className="flex justify-center items-center gap-2.5 w-full py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 text-sm font-medium text-gray-700 cursor-pointer transition-colors"
                    >
                      {providerIcons[provider.name]}
                      Sign in with {provider.name}
                    </button>
                  );
                })}
            </div>

            {/* Footer link */}
            <p className="text-xs text-gray-400 mt-6 text-center">
              No account?{" "}
              <Link
                href="/signup"
                className="text-[#0bbcaa] font-semibold hover:text-[#085041] transition-colors"
              >
                Sign up free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
