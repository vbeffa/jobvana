import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "jobvana",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        skills: resolve(__dirname, "skills/index.html"),
        jobs: resolve(__dirname, "jobs/index.html"),
        companies: resolve(__dirname, "companies/index.html")
      }
    }
  }
});
