// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://www.dofixo.ir",
  // هر صفحه فقط یک آدرس دارد: با `/` در انتها. canonical، sitemap و لینک‌های
  // داخلی همه همین شکل را دارند، و vercel.json نسخه‌ی بدون `/` را با 308 به
  // این شکل برمی‌گرداند. پیش از این، /about و /about/ هر دو 200 می‌دادند.
  trailingSlash: "always",
  // output همچنان "static" است (پیش‌فرض): همه‌ی صفحات از قبل build می‌شوند.
  // فقط src/pages/api/contact.ts با `export const prerender = false` خودش
  // را از این قاعده خارج می‌کند و به‌صورت on-demand (Serverless Function)
  // اجرا می‌شود. آداپتور Vercel برای همین یک مسیر لازم است.
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon(), mdx(), sitemap()],
});
