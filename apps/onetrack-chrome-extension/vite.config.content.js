import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/content-scripts/job-scraper.tsx"),
      name: "OneTrackScraper",
      formats: ["iife"],
      fileName: () => "content-scripts/job-scraper.js",
    },
  },
});
