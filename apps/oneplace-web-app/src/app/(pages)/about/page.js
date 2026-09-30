import React from "react";

function About() {
  return (
    // -mt-6 cancels the layout's space-y-6 so the hero sits flush under the header
    <div className="min-h-screen -mt-6">
      {/* Shadow + clip-path bleed the background to the left and right edges */}
      <section className="bg-[#085041] text-white shadow-[0_0_0_100vmax_#085041] [clip-path:inset(0_-100vmax)]">
        <div className="max-w-3xl mx-auto px-6 py-24 sm:py-32">
          {/* Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-brand">
                Our story
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-bold tracking-tight text-center text-4xl sm:text-5xl leading-[1.08] mb-6">
            Why we built <span className="text-brand">OnePlace.</span>
          </h1>

          {/* Subtext */}
          <p className="text-center text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
            A tool born from the frustration of applying, tailoring, and then
            completely forgetting what you sent.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* Divider */}
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[#0bbcaa] text-lg">◈</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Body copy */}
        <div className="space-y-6 text-gray-600 text-[17px] leading-[1.85]">
          <p>
            Crafting the perfect resume for every job application is both an art
            and a strategy. It&apos;s nearly impossible to include everything
            you&apos;ve ever done on a single resume — and you shouldn&apos;t.
            Tailoring your resume to highlight the most relevant skills and
            experiences for each role is key to standing out.
          </p>

          {/* Problem callout */}
          <div className="border-l-2 border-[#0bbcaa] pl-6 py-1 my-8">
            <p className="text-gray-700 font-medium">
              But here&apos;s the problem: once you&apos;ve applied, it&apos;s
              easy to forget what version of your resume or cover letter you
              submitted — especially if you&apos;re applying to multiple
              positions over time. And when the interview finally comes —
              sometimes weeks later — you&apos;re left scrambling to remember
              what you sent.
            </p>
          </div>

          <p>
            OnePlace solves this. We give you a simple, centralized hub to
            automatically save and organize the exact resume and cover letter
            you used for each job application. So when it&apos;s time to
            prepare for the interview, you can confidently revisit the materials
            that got you through the door.
          </p>

          <p>
            No more guessing. No more digging through folders. Just clarity and
            confidence when you need it most.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-14">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[#0bbcaa] text-lg">◉</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Founder quote */}
        <blockquote className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0bbcaa] to-transparent" />
          <p className="text-gray-500 text-base italic leading-relaxed">
            Built by someone who&apos;s been there — applying, tailoring, and
            forgetting. OnePlace is the tool I wish I had when job hunting.
          </p>
          <footer className="mt-3 text-sm font-semibold text-[#0bbcaa]">
            — The OnePlace Team
          </footer>
        </blockquote>

      </div>
    </div>
  );
}

export default About;
