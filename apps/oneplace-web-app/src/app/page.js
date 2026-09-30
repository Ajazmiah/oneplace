import Services from "@/Components/Services/Services";
import dashboardImage from "../../assets/dashboard.png";
import glanceImage from "../../assets/glance.png";
import Image from "next/image";
import { APP_NAME } from "@/app/lib/constants";

export default function Example() {
  return (
    // -mt-6 cancels the layout's space-y-6 so the hero sits flush under the header
    <div className="wrapper -mt-6">
      {/* Shadow + clip-path bleed the background to the left and right edges */}
      <section className="relative overflow-hidden bg-[#085041] text-white shadow-[0_0_0_100vmax_#085041] [clip-path:inset(0_-100vmax)]">
        {/* Curved lines, bottom right */}
        <svg
          className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] text-white/10"
          viewBox="0 0 520 520"
          fill="none"
          aria-hidden="true"
        >
          {[140, 190, 240, 290].map((r) => (
            <circle key={r} cx="520" cy="520" r={r} stroke="currentColor" />
          ))}
        </svg>

        <div className="relative max-w-[1460px] mx-auto px-6 sm:px-10 py-20 lg:py-32 grid gap-16 lg:grid-cols-2 items-center">
          {/* Copy */}
          <div className="max-w-xl">
            <p className="text-base text-white/80 mb-6">
              Your job search, all in one place
            </p>

            <h1 className="font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl leading-[1.08]">
              Track every <span className="text-brand">application.</span>
              <br />
              Land your next role.
            </h1>

            <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/80">
              The smart way to log, track, and organize your entire job search —
              all from one clean dashboard.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold leading-none">500+</span>
                <span className="text-xs text-white/60 mt-1">apps tracked</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold leading-none">1 min</span>
                <span className="text-xs text-white/60 mt-1">to get started</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-12 flex gap-6 items-center">
              <a
                href={`${process.env.BASE_URL}/api/auth/signin`}
                className="rounded-full bg-[#ccf3ee] px-8 py-4 text-base font-semibold text-[#085041] hover:bg-white transition-colors"
              >
                Get started free
              </a>
              <a
                href="#services"
                className="text-sm font-semibold text-white/80 hover:text-brand transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Product visuals */}
          <div className="relative pb-20 sm:pb-28">
            <div className="relative ml-auto w-[92%] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
              <Image
                src={dashboardImage}
                alt={`${APP_NAME} dashboard showing tracked applications`}
                className="w-full h-auto -mt-[1.5%]"
                sizes="(min-width: 1024px) 45vw, 92vw"
                priority
              />
            </div>

            <Image
              src={glanceImage}
              alt="At a glance summary of applications, interviews and offers"
              className="absolute bottom-0 left-0 w-[38%] min-w-[160px] h-auto drop-shadow-2xl"
              sizes="(min-width: 1024px) 18vw, 38vw"
            />
          </div>
        </div>
      </section>

      <div id="services">
        <Services />
      </div>
    </div>
  );
}
