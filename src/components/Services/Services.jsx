import React from "react";
import Heading from "../UI/Heading";

function Services() {
  return (
    <section className="bg-gray">
      <div className="lg:px-20 px-10 py-10">
        <div className="flex gap-4 justify-center py-12">
          {/* <!-- Left Column --> */}
          <div className="">
            <Heading
              classes="text-[2em] pb-3 font-extrabold"
              text="How we support our
              partner all over the world"
              size={2}
            />
            <p className="text-gray-dark sm:w-[90%] lg:w-[60%] ">
              Tailoring your resume for each job helps you stand out — but it’s
              hard to remember what you sent when interviews come weeks later.
              Resumind keeps a record of every resume and cover letter
              you’ve used, so you can prep with confidence
            </p>
          </div>

          {/* <!-- Right Column --> */}
          <div className="">
            <div className="">
              <div className=" text-main p-3">
                <Heading
                  size={3}
                  text={"Upload Resume"}
                  classes="text-[1em] pb-3 font-extrabold"
                />
                <p className="text-gray-dark">
                  Plan, collaborate, and publishing your content that drives
                  meaningful engagement and growth for your brand
                </p>
              </div>
            </div>

            <div className=" text-main p-3 ">
              <div>
                <Heading
                  text={"Upload Cover letter"}
                  classes="text-[1em] pb-3 font-extrabold"
                  size={3}
                />
                <p className="text-gray-dark">
                  Analyze your performance and create gorgeous report
                </p>
              </div>
            </div>

            <div className="text-main p-3">
              <div>
                <Heading
                  text={"Review"}
                  classes="text-[1em] pb-3 font-extrabold"
                  size={3}
                />
                <p className="text-gray-dark">
                  Engage your users and partners with your product
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
