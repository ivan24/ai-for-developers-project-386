import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:8080";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      allowedHosts: ["frontend"],
      host: true,
      port: 5173,
      proxy: {
        "/owner": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
        "/public": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
