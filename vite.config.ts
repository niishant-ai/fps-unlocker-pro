import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { FALLBACK_PLAY_STATS, fetchPlayStoreStats } from "./lib/playstore.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIRTUAL_ID = "virtual:playstore-stats";
const RESOLVED_VIRTUAL_ID = "\0" + VIRTUAL_ID;

function playStoreStatsPlugin(): Plugin {
  let latestStats = FALLBACK_PLAY_STATS;

  const attachApiMiddleware = (middlewares: {
    use: (
      path: string,
      handler: (_req: unknown, res: { setHeader: (k: string, v: string) => void; end: (b: string) => void }) => void
    ) => void;
  }) => {
    middlewares.use("/api/playstore-stats", async (_req, res) => {
      const stats = await fetchPlayStoreStats();
      latestStats = stats;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(JSON.stringify(stats));
    });
  };

  return {
    name: "playstore-live-stats",
    async buildStart() {
      latestStats = await fetchPlayStoreStats();
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
      return null;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_ID) {
        return `export const INITIAL_PLAY_STATS = ${JSON.stringify(latestStats)};`;
      }
      return null;
    },
    transformIndexHtml(html) {
      return html
        .replace(/"softwareVersion":\s*"[^"]+"/, `"softwareVersion": "${latestStats.version}"`)
        .replace(/"ratingValue":\s*"[^"]+"/, `"ratingValue": "${latestStats.ratingText}"`)
        .replace(/"ratingCount":\s*"[^"]+"/, `"ratingCount": "${latestStats.reviewCount}"`);
    },
    configureServer(server) {
      attachApiMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachApiMiddleware(server.middlewares);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [playStoreStatsPlugin(), react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
