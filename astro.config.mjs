// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

import stripHtmlComments from "./src/integrations/strip-html-comments.mjs";

// Form POST destinations and other pages that must not be submitted to search engines.
// Each also carries its own noindex tag (see BaseHead.astro). Keep the two in step.
const EXCLUDED_FROM_SITEMAP = ["/submit-contact"];

export default defineConfig({
  site: "https://christophernervegna.com",
  trailingSlash: "always",
  integrations: [
    mdx(),
    sitemap({
      filter: page => !EXCLUDED_FROM_SITEMAP.some(path => page.includes(path)),
    }),
    icon({
      iconDir: "src/icons",
    }),
    // Source comments stay in the .astro files; they just do not ship.
    stripHtmlComments(),
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
