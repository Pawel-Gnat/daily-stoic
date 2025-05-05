// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: import.meta.env.PROD ? { "react-dom/server": "react-dom/server.edge" } : undefined,
    },
  },
  integrations: [react()],
  adapter: import.meta.env.PROD
    ? cloudflare()
    : node({
        mode: "middleware",
      }),
});
