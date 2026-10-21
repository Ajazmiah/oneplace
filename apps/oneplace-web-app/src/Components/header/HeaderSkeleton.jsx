"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/app/lib/constants";
import { GREEN_HEADER_PATHS } from "./greenHeaderPaths";

// Shown while Header waits for the session. Mirrors Navigation's colors and
// spacing so the swap to the real header doesn't flash white on green pages.
function HeaderSkeleton() {
  // usePathname needs its own Suspense on dynamic routes (cacheComponents).
  // Those are all white-header dashboard pages, so the white bar is the right fallback.
  return (
    <Suspense fallback={<SkeletonBar isGreenHeader={false} />}>
      <PathAwareSkeleton />
    </Suspense>
  );
}

function PathAwareSkeleton() {
  return <SkeletonBar isGreenHeader={GREEN_HEADER_PATHS.includes(usePathname())} />;
}

function SkeletonBar({ isGreenHeader }) {
  return (
    <header className="sticky inset-x-0 top-0 z-50">
      <nav
        className={`flex items-center justify-between py-4 px-5 ${
          isGreenHeader
            ? "bg-[#085041] shadow-[0_0_0_100vmax_#085041] [clip-path:inset(-100vmax_-100vmax_0)]"
            : "bg-white border-b border-gray-100"
        }`}
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <img
            src={isGreenHeader ? "/oneplace-logo-full-light.svg" : "/oneplace-logo-full.svg"}
            alt={APP_NAME}
            className="h-10 w-auto"
          />
        </div>
      </nav>
      <div
        className={
          isGreenHeader
            ? "bg-[#085041] shadow-[0_0_0_100vmax_#085041] [clip-path:inset(0_-100vmax)]"
            : "bg-white"
        }
      >
        <div className="divider-brand" />
      </div>
    </header>
  );
}

export default HeaderSkeleton;
