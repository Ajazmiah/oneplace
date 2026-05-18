import Services from "@/Components/Services/Services";
import landingpageImage from "../../public/landingpageImage.svg";
import Image from "next/image";
import { getUserSession } from "./lib/DataAccessLayer/getSession";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Example() {
  const session = await auth();

  
  let authContent = (
    <>
      {/* Left: text content */}
      <div className="flex flex-col items-start max-w-lg">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-[#0bbcaa]/25 bg-[#0bbcaa]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#0bbcaa]">
            Now in beta — join free
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-bold tracking-tight text-gray-900 text-4xl sm:text-5xl md:text-6xl leading-[1.08]">
          Track every{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            application.
          </span>
          <br />
          Land your next role.
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg leading-relaxed text-gray-500 max-w-md">
          The smart way to log, track, and organize your entire job search —
          all from one clean dashboard.
        </p>

        {/* Stats strip */}
        <div className="mt-8 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 leading-none">500+</span>
            <span className="text-xs text-gray-400 mt-1">apps tracked</span>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 leading-none">3 min</span>
            <span className="text-xs text-gray-400 mt-1">to get started</span>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 leading-none">Free</span>
            <span className="text-xs text-gray-400 mt-1">forever</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex gap-4 items-center">
          <a
            href={`${process.env.BASE_URL}/api/auth/signin`}
            className="rounded-lg bg-main px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-main-light transition-colors"
          >
            Get started free →
          </a>
          <a
            href="#services"
            className="text-sm font-semibold text-gray-500 hover:text-[#0bbcaa] transition-colors"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Right: image with soft teal glow */}
      <div className="hidden lg:flex items-center justify-center w-[50%] relative">
        <div
          className="absolute w-96 h-96 rounded-full opacity-[0.12] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #0bbcaa 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <Image
          src={landingpageImage}
          alt="open working on laptop"
          className="relative z-10 drop-shadow-xl"
        />
      </div>
    </>
  );

  if (session) {
    authContent = (
      <div className="flex flex-col items-start max-w-lg">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-[#0bbcaa]/25 bg-[#0bbcaa]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#0bbcaa]">
            Welcome back
          </span>
        </div>

        {/* Greeting */}
        <h1 className="font-bold tracking-tight text-gray-900 text-4xl sm:text-5xl md:text-6xl leading-[1.08]">
          Hey,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {session?.user?.name?.split(" ")[0]}.
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg leading-relaxed text-gray-500 max-w-md">
          Ready to pick up where you left off? Your applications are waiting.
        </p>

        {/* Action cards */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full">
          <Link
            href="/dashboard/applications"
            className="group flex flex-col gap-1 flex-1 rounded-xl border border-gray-100 bg-white px-6 py-5 shadow-sm hover:border-[#0bbcaa]/40 hover:shadow-md transition-all"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#0bbcaa]">
              View
            </span>
            <span className="text-base font-semibold text-gray-900 group-hover:text-[#0bbcaa] transition-colors">
              My Applications →
            </span>
            <span className="text-xs text-gray-400">
              See all tracked roles
            </span>
          </Link>

          <Link
            href="/dashboard/add-application"
            className="group flex flex-col gap-1 flex-1 rounded-xl border border-[#0bbcaa]/20 bg-[#0bbcaa]/5 px-6 py-5 shadow-sm hover:bg-[#0bbcaa]/10 hover:border-[#0bbcaa]/40 transition-all"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#0bbcaa]">
              New
            </span>
            <span className="text-base font-semibold text-gray-900 group-hover:text-[#0bbcaa] transition-colors">
              Add Application →
            </span>
            <span className="text-xs text-gray-400">
              Log a new job application
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white wrapper">
      <div className="px-10 pt-10">
        <div className="relative isolate   max-w-[1460px] mx-auto">
          {/* Main content */}
          <div className="block md:flex gap-[4em] justify-around  items-center mx-auto  py-30 sm:py-48 lg:py-30">
            {authContent}
          </div>
        </div>
      </div>

      {session ? null : (
        <div id="services">
          <Services />
        </div>
      )}
    </div>
  );
}
