import { APP_NAME } from "@/app/lib/constants";

// Shown while Header waits for the session. Mirrors Navigation's colors and
// spacing so the swap to the real header doesn't flash.
function HeaderSkeleton() {
  return (
    <header className="sticky inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between py-4 px-5 bg-[#085041] shadow-[0_0_0_100vmax_#085041] [clip-path:inset(-100vmax_-100vmax_0)]"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <img
            src="/oneplace-logo-full-light.svg"
            alt={APP_NAME}
            className="h-10 w-auto"
          />
        </div>
      </nav>
      <div className="bg-[#085041] shadow-[0_0_0_100vmax_#085041] [clip-path:inset(0_-100vmax)]">
        <div className="divider-brand" />
      </div>
    </header>
  );
}

export default HeaderSkeleton;
