import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

/** Shared Vite configuration for every landing page package. */
export function pageViteConfig(overrides = {}) {
  return defineConfig({
    plugins: [vue()],
    build: {
      sourcemap: false,
      outDir: "dist",
      emptyOutDir: true,
      assetsInlineLimit: 0,
    },
    server: {
      proxy: {
        "/api": process.env.BACKEND_URL || "http://127.0.0.1:4000",
      },
    },
    ...overrides,
  });
}
