"use client";

import { Button } from "@/Components/ui/button";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-300 p-6">
      <h2 className="text-4xl font-bold text-gray-700 mb-3">
        Something went wrong!
      </h2>
      <p className="text-lg text-gray-400 mb-6">
        Please try again later or refresh the page.
      </p>
      <Button
        onClick={() => reset()} // Attempts to re-render the segment
        className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-colors"
      >
        Try again
      </Button>
    </div>
  );
}
