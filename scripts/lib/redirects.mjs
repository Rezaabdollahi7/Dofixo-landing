// منطق مشترک ریدایرکت‌های بلاگ قدیمی، برای scripts/redirects.mjs و scripts/check-site.mjs.
//
// چرا vercel.json و نه redirects خود Astro: خروجی این سایت static است و Astro
// بدون adapter برای ریدایرکت فقط یک صفحه‌ی meta-refresh می‌سازد، که گوگل آن را
// 301 حساب نمی‌کند. Vercel قاعده‌های vercel.json را پیش از فایل‌ها اجرا می‌کند و
// 308 واقعی برمی‌گرداند.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

export const ROOT = new URL("../../", import.meta.url).pathname;
const ACADEMY = join(ROOT, "src/content/academy");
const BLOG = join(ROOT, "src/content/blog");

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function frontmatter(path) {
  const match = readFileSync(path, "utf8").match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : "";
}

/** شناسه‌ی مقاله‌های منتشرشده‌ی مرکز آموزش، همان‌طور که content.config.ts می‌سازد. */
export function publishedAcademyIds() {
  return walk(ACADEMY)
    .filter((p) => /\.mdx?$/.test(p))
    .filter((p) => !/^draft:\s*true\s*$/m.test(frontmatter(p)))
    .map((p) => relative(ACADEMY, p).replace(/\/index\.mdx?$/, "").replace(/\.mdx?$/, ""));
}

export function remainingBlogSlugs() {
  return walk(BLOG)
    .filter((p) => p.endsWith(".md"))
    .map((p) => relative(BLOG, p).replace(/\.md$/, ""));
}

export function blogRedirectMap() {
  return JSON.parse(readFileSync(join(ROOT, "src/data/blog-redirects.json"), "utf8")).redirects;
}

/**
 * ریدایرکت‌هایی که الان باید در vercel.json باشند: هر مقاله‌ی قدیمی که مقصدش
 * منتشر شده. هر دو شکل آدرس (با و بی `/`) می‌آیند تا بازدیدکننده دو بار
 * ریدایرکت نشود. وقتی هیچ مقاله‌ی قدیمی نماند، خود /blog/ هم به /academy/ می‌رود.
 */
export function computeRedirects() {
  const published = new Set(publishedAcademyIds());
  const map = blogRedirectMap();
  const active = Object.entries(map).filter(([, target]) => published.has(target));
  const redirects = active.flatMap(([old, target]) =>
    [`/blog/${old}`, `/blog/${old}/`].map((source) => ({
      source,
      destination: `/academy/${target}/`,
      permanent: true,
    })),
  );
  const movedAll = active.length === Object.keys(map).length;
  if (movedAll) {
    for (const source of ["/blog", "/blog/"]) {
      redirects.push({ source, destination: "/academy/", permanent: true });
    }
  }
  return { redirects, moved: active.map(([old]) => old), movedAll };
}

export function readVercelJson() {
  return JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
}
