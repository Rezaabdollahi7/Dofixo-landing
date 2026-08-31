// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.dofixo.ir",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon(), sitemap()],
});
