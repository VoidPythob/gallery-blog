import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    {
      name: "github-pages-spa-fallback",
      closeBundle() {
        const distDir = resolve(__dirname, "dist");
        const indexPath = resolve(distDir, "index.html");
        const fallbackPath = resolve(distDir, "404.html");

        if (existsSync(indexPath)) {
          copyFileSync(indexPath, fallbackPath);
        }
      },
    },
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("tdesign-vue-next/es/")) {
            const match = id.match(/tdesign-vue-next\/es\/([^/]+)/);
            const name = match?.[1] ?? "core";
            return `vendor-tdesign-${name}`;
          }
          if (id.includes("tdesign-vue-next")) return "vendor-tdesign";
          if (id.includes("vue")) return "vendor-vue";
          if (id.includes("pinia") || id.includes("vue-router"))
            return "vendor-core";
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
