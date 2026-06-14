import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createReadStream, existsSync, statSync } from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";

const storageRoot = path.resolve(__dirname, "backend/storage/app/public");
const mimeTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function serveBackendStorage() {
  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url?.startsWith("/storage/")) return next();

    const relativePath = decodeURIComponent(req.url.split("?")[0].slice("/storage/".length));
    const filePath = path.resolve(storageRoot, relativePath);
    if (!filePath.startsWith(storageRoot + path.sep) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      res.statusCode = 404;
      return res.end();
    }

    res.setHeader("Content-Type", mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    createReadStream(filePath).pipe(res);
  };

  return {
    name: "serve-backend-storage",
    configureServer(server: { middlewares: { use: (handler: typeof middleware) => void } }) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server: { middlewares: { use: (handler: typeof middleware) => void } }) {
      server.middlewares.use(middleware);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxy = {
    "/api": {
      target: env.VITE_BACKEND_URL || "http://127.0.0.1:8002",
      changeOrigin: true,
    },
  };

  return {
    server: {
      host: "::1",
      port: 8080,
      strictPort: true,
      proxy,
      hmr: {
        overlay: false,
      },
    },
    preview: {
      host: "::1",
      port: 8080,
      strictPort: true,
      proxy,
    },
    plugins: [react(), serveBackendStorage()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
