import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-bold text-brand sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base text-gray-500">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
        have been moved or no longer exists.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
      >
        Back to home
      </Link>
    </div>
  );
}
