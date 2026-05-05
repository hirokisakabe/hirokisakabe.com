import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import rehypeImageGrid from "./src/plugins/rehype-image-grid.mjs";
import rehypeLinkCard from "./src/plugins/rehype-link-card.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://hirokisakabe.com",
  integrations: [react(), sitemap()],
  output: "static",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  markdown: {
    rehypePlugins: [rehypeLinkCard, rehypeImageGrid],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
