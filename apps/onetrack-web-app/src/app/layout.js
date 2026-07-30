import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../Components/header/Header";
import HeaderSkeleton from "../Components/header/HeaderSkeleton";
import Footer from "@/Components/footer/Footer";
import { Toaster } from "@/Components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Resumind – Track Job Applications Effortlessly",
  description:
    "Easily track your job applications, save resumes, cover letters, and important details—all in one place to stay organized and interview-ready.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>
        {children}

        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
