import React from "react";
import Heading from "../ui/Heading";


function Services() {
  return (
    <section className="bg-gray">
      <div className="px-10 py-10 max-w-[960px] mx-auto">
        <div className="py-12">
          <div className="">
            <Heading
              classes="text-[2em] md:text-[4em] text-main pb-10 font-extrabold md:w-[60%]"
              text="Watch how it works"
              noTrim
              size={2}
            />
            <p className="text-gray-dark">
              Tailoring your resume for each job helps you stand out — but it’s
              hard to remember what you sent when interviews come weeks later.
              Resumind keeps a record of every resume and cover letter you’ve
              used, so you can prep with confidence
            </p>
          </div>

          <div className="mt-10 max-w[720px] h-[500px]">
            <div className="border-[7px] border-[#43c59e] h-full rounded-[10px] w-full mt-[10em] flex flex-col items-center justify-center gap-3 bg-white">
              <span className="text-2xl font-bold text-main">
                How it works video
              </span>
              <span className="text-gray-dark">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
