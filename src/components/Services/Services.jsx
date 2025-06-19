import React from "react";
import Heading from "../UI/Heading";

function Services() {
  return (
    <section className="bg-gray">
      <div className="lg:px-15 px-6">
        <div className="flex gap-4 justify-center">
          {/* <!-- Left Column --> */}
          <div className="">
            <Heading text='How we support our
              partner all over the world' size={2} />
            <p className="">
              SaaS become a common delivery model for many business application,
              including office software, messaging software, payroll processing
              software, DBMS software, management software
            </p>
          </div>

          {/* <!-- Right Column --> */}
          <div className="">
            <div className="">
              <div className="">📈</div>
              <div>
                <h3 className="">Publishing</h3>
                <p className="">
                  Plan, collaborate, and publishing your content that drives
                  meaningful engagement and growth for your brand
                </p>
              </div>
            </div>

            <div className="">
              <div className="">📊</div>
              <div>
                <h3 className="">Analytics</h3>
                <p className="">
                  Analyze your performance and create gorgeous report
                </p>
              </div>
            </div>

            <div className="">
              <div className="">🤝</div>
              <div>
                <h3 className="">Engagement</h3>
                <p className="">
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
