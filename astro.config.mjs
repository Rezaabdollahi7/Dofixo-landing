// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.dofixo.ir",
  // هر صفحه فقط یک آدرس دارد: با `/` در انتها. canonical، sitemap و لینک‌های
  // داخلی همه همین شکل را دارند، و vercel.json نسخه‌ی بدون `/` را با 308 به
  // این شکل برمی‌گرداند. پیش از این، /about و /about/ هر دو 200 می‌دادند.
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon(), sitemap()],
});
