import Heading from "@/components/ui/Heading";
import React from "react";

function about() {
  const aboutText =
    "Crafting the perfect resume for every job application is both an art and a strategy. It\u2019s nearly impossible to include everything you\u2019ve ever done on a single resume \u2014 and you shouldn\u2019t. Tailoring your resume to highlight the most relevant skills and experiences for each role is key to standing out.\n\nBut here\u2019s the problem: once you\u2019ve applied, it\u2019s easy to forget what version of your resume or cover letter you submitted \u2014 especially if you\u2019re applying to multiple positions over time. And when the interview finally comes \u2014 sometimes weeks later \u2014 you\u2019re left scrambling to remember what you sent.\n\nResumeRecall solves this.\n\nWe give you a simple, centralized hub to automatically save and organize the exact resume and cover letter you used for each job application. So when it\u2019s time to prepare for the interview, you can confidently revisit the materials that got you through the door.\n\nNo more guessing. No more digging through folders. Just clarity and confidence when you need it most.";

  return (
    <div className="px-30  py-[4em] pageContainer">
      <div className="pt-30 text-center">
      <Heading text={'Why We Built Resumind?'} size={1} classes='text-[3em] pb-[1em] text-main'noTrim />
      <p className="text-[20px] md:w-[720px] mx-auto text-gray-800">{aboutText}</p> <br/>

      <em className="container">--Built by someone who’s been there—applying, tailoring, and forgetting. Resumind is the tool I wish I had when job hunting.</em>

      </div>
    </div>
  );
}

export default about;
