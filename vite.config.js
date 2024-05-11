import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";
import { config } from "dotenv";
import postcss from "./postcss.config.js";

config();

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    outDir: path.resolve(dirname, "dist"),
    assetsDir: "",
    rollupOptions: {
      plugins: [
        {
          name: "minify",
          renderChunk: async (code) => {
            const result = await minify(code);
            return { code: result.code, map: null };
          },
        },
      ],
    },
    emptyOutDir: true,
    sourcemap: true,
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    proxy: {
      "/api": `http://localhost:${process.env.PORT}`,
      "/auth": `http://localhost:${process.env.PORT}`,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/client/shadcn"),
    },
  },
  css: {
    postcss,
    modules: {
      localsConvention: "camelCaseOnly",
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/variables.scss";`,
      },
    },
  },
});
