import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../Components/header/Header";
import HeaderSkeleton from "../Components/header/HeaderSkeleton";
import Footer from "@/Components/footer/Footer";
import { Toaster } from "@/Components/ui/sonner";
import { APP_NAME } from "@/app/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: `${APP_NAME} – Track Job Applications Effortlessly`,
  description:
    "Easily track your job applications, save resumes, cover letters, and important details—all in one place to stay organized and interview-ready.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Lets keyboard users jump past the header; visible only when focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#085041] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-strong"
        >
          Skip to content
        </a>

        <div className="flex-1 p-3 md:p-8 space-y-6  max-w-[1460px] mx-auto">
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>
          {/* The one <main> landmark: page content only, not the header.
              tabIndex lets the skip link move focus here. */}
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </div>

        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
