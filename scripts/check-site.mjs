// بعد از هر build اجرا می‌شود (pnpm build) و اگر چیزی از این‌ها پیدا کند،
// build را شکست می‌دهد — روی Vercel یعنی نسخه‌ی خراب منتشر نمی‌شود:
//
//   - لینک داخلی بدون `/` در انتها (هر صفحه فقط یک آدرس دارد)
//   - لینک داخلی به صفحه یا فایلی که وجود ندارد
//   - متن جانگهدار مثل «[تصویر: …]» در صفحه‌ی منتشرشده
//   - vercel.json که با src/data/blog-redirects.json هم‌خوان نیست (pnpm redirects)
//   - ریدایرکتی که مقصدش ساخته نشده، یا مبدأش هنوز صفحه دارد
//
// هر کدام در docs/academy/writing-guide.md دلیل دارد؛ بیشترشان قبلاً یک بار
// در سایت اتفاق افتاده بودند.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT, computeRedirects, readVercelJson } from "./lib/redirects.mjs";

const DIST = join(ROOT, "dist");
const SITE = "https://www.dofixo.ir";
const problems = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const pages = walk(DIST).filter((p) => p.endsWith(".html"));

for (const file of pages) {
  const page = "/" + relative(DIST, file).replace(/index\.html$/, "");
  // صفحه‌ی 404 خودش noindex است و canonical آن به /404/ اشاره می‌کند؛ بررسی‌اش بی‌معنی است.
  if (page === "/404.html") continue;
  const html = readFileSync(file, "utf8");

  if (/\[تصویر[:：]/.test(html)) problems.push(`${page}: متن جانگهدار «[تصویر: …]»`);

  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let href = raw.replaceAll("&amp;", "&");
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || "/";
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const path = decodeURI(href.split("#")[0].split("?")[0]);
    if (!path) continue;

    const isFile = /\.[a-z0-9]+$/i.test(path);
    if (isFile) {
      if (!existsSync(join(DIST, path))) problems.push(`${page}: فایل پیدا نشد ${path}`);
      continue;
    }
    if (!path.endsWith("/")) problems.push(`${page}: لینک بدون / در انتها ${path}`);
    else if (!existsSync(join(DIST, path, "index.html"))) problems.push(`${page}: صفحه پیدا نشد ${path}`);
  }
}

// ریدایرکت‌ها
const expected = computeRedirects().redirects;
const actual = readVercelJson().redirects ?? [];
if (JSON.stringify(expected) !== JSON.stringify(actual)) {
  problems.push("vercel.json با مقاله‌های منتشرشده هم‌خوان نیست؛ pnpm redirects را اجرا کنید");
}
for (const r of actual) {
  if (!existsSync(join(DIST, r.destination, "index.html"))) problems.push(`ریدایرکت به صفحه‌ای که ساخته نشده: ${r.destination}`);
  if (r.source.endsWith("/") && existsSync(join(DIST, r.source, "index.html"))) {
    problems.push(`${r.source} هم ریدایرکت شده و هم هنوز صفحه دارد؛ pnpm redirects را اجرا کنید`);
  }
}

if (problems.length) {
  console.error(`\n✗ بررسی سایت: ${problems.length} مشکل\n`);
  for (const p of [...new Set(problems)]) console.error(`  - ${p}`);
  console.error("");
  process.exit(1);
}
console.log(`✓ بررسی سایت: ${pages.length} صفحه، بدون مشکل`);
