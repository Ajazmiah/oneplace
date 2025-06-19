import Services from "@/components/Services/Services";
import landingpageImage from "../../public/landingpageImage.svg";
import Image from "next/image";

export default function Example() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-10 lg:px-6">
        {/* Main content */}
        <div className="block md:flex gap-[4em] justify-around  items-center mx-auto md:w-[80%] md:min-w-[800px] py-30 sm:py-48 lg:py-30">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Track your job applications
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              The Smart Way to Log and Track Job Applications
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="http://localhost:3000/api/auth/signin"
                className="rounded-md bg-main px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-main-light"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 hover:text-main font-semibold text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <Image src={landingpageImage} alt="open working on laptop" />
          </div>
        </div>
       
      </div>

      <Services/>
    </div>
  );
}
