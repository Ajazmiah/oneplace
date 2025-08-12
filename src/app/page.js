import Services from "@/components/Services/Services";
import landingpageImage from "../../public/landingpageImage.svg";
import Image from "next/image";
import { getUserSession } from "./lib/DataAccessLayer/getSession";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Example() {
  const session = await auth();

  
  let authContent = (
    <>
      <div className="lg:w-[100%] flex flex-col items-center display flex">
        <h1 className="font-semibold text-center tracking-tight text-balance text-gray-900 text-[3em] sm:text-[4em] md:text-[6em]">
          Track your job applications
        </h1>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 ">
          The Smart Way to Log and Track Job Applications
        </p>

        <div className="mt-5 flex gap-3 items-center">
          <a
            href={`${process.env.BASE_URL}/api/auth/signin`}
            className="rounded-md bg-main px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-main-light"
          >
            Get started
          </a>
          
          <a
            href="#services"
            className="text-sm/6 hover:text-main font-semibold text-gray-900"
          >
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <div className="hidden lg:block w-[50%]">
        <Image src={landingpageImage} alt="open working on laptop" />
      </div>
    </>
  );

  if (session) {
    authContent = (
      <div>
        <h1 className="text-5xl font-semibold">
          Hey {session.user.name}, welcome back!
        </h1>
        <p className="mt-2 text-gray-600">
          Ready to continue where you left off?
        </p>
        <div className="mt-[20px] flex gap-3">
          <Link
            href="/dashboard/applications"
            className="rounded-md bg-main px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-black"
          >
            View Applications
          </Link>
          <Link
            href="/dashboard/add-application"
            className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-main-light"
          >
            Add Applications
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
