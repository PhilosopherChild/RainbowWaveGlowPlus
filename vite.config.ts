// vite.config.ts  — FINAL
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
  // Fix Decky webview crashes by removing Node-only globals
  define: {
    global: "window",
    "process.env": {},        // prevents "process is not defined"
    "process.browser": true,  // some libs probe this flag
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
