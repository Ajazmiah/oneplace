import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "src",
  publicDir: resolve(__dirname, "public"),
  resolve: {
    alias: {
      // Point straight at the shared package's source so Vite processes its
      // TSX/CSS-modules like local files, instead of treating a workspace-
      // linked node_modules package as an opaque pre-bundled dependency.
      "@repo/ui": resolve(__dirname, "../../packages/ui/src"),
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, "src/sidepanel/index.html"),
      },
      output: {
        entryFileNames: "[name]/[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
