import Services from "@/components/Services/Services";
import landingpageImage from "../../public/landingpageImage.svg";
import Image from "next/image";
import { connectDb } from "@/database/dbConnection";
import getUserApplications from './DataAccessLayer/getUserApplications'

export default async function Example() {

  console.log("USER_APP", await getUserApplications())

  await connectDb()
  return (
    <div className="bg-white">
      <div className="px-10 pt-10">
        <div className="relative isolate   max-w-[1460px] mx-auto">
          {/* Main content */}
          <div className="block md:flex gap-[4em] justify-around  items-center mx-auto  py-30 sm:py-48 lg:py-30">
            <div className="lg:w-[100%] flex flex-col items-center display flex">
              <h1 className="font-semibold text-center tracking-tight text-balance text-gray-900 text-[3em] sm:text-[4em] md:text-[6em]">
                Track your job applications
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 ">
                The Smart Way to Log and Track Job Applications
              </p>

              <div className="mt-5 flex gap-3 items-center">
                <a
                  href="http://localhost:3000/api/auth/signin"
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
          </div>
        </div>
      </div>

      <div id="services">
        <Services />
      </div>
    </div>
  );
}
