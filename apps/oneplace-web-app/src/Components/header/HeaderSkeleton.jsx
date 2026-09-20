function HeaderSkeleton() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav
        className="flex items-center justify-between py-4 px-6 lg:px-10"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <img
            src="/oneplace-logo-full.svg"
            alt="OnePlace"
            className="h-10 w-auto"
          />
        </div>
      </nav>
      <div className="divider-brand" />
    </header>
  );
}

export default HeaderSkeleton;
