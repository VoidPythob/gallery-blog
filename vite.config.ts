import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
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
