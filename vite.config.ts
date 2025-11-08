// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: false,
    minify: true,
  },
  // Prevent "ReferenceError: process is not defined" in Decky's webview
  define: {
    global: "window",
    "process.env": {},
    "process.browser": true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "window",
        "process.env": "{}",
      },
    },
  },
});
