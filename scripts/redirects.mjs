// pnpm redirects
//
// بعد از انتشار هر مقاله‌ی مرکز آموزش اجرا شود. ریدایرکت مقاله‌های قدیمی بلاگ
// را که مقصدشان حالا منتشر شده به vercel.json اضافه می‌کند و فایل آن مقاله‌های
// قدیمی را پاک می‌کند — محتوایشان در مقاله‌ی جدید ادغام شده و نگه داشتنشان
// یعنی دو صفحه برای یک موضوع.
//
// لینک‌های داخلی به آن مقاله‌ها هم مستقیم به مقصد جدید عوض می‌شوند: لینکی که از
// ریدایرکت رد شود کار می‌کند ولی یک رفت‌وبرگشت اضافه دارد، و check-site لینک
// به صفحه‌ی پاک‌شده را شکسته حساب می‌کند.
//
// نقشه: src/data/blog-redirects.json. فاز ۱۳ رودمپ.

import { readFileSync, writeFileSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT, computeRedirects, readVercelJson, remainingBlogSlugs } from "./lib/redirects.mjs";

const { redirects, moved, movedAll } = computeRedirects();
const vercel = readVercelJson();
vercel.redirects = redirects;
if (redirects.length === 0) delete vercel.redirects;
writeFileSync(join(ROOT, "vercel.json"), JSON.stringify(vercel, null, 2) + "\n");

const remaining = new Set(remainingBlogSlugs());
const removed = moved.filter((slug) => remaining.has(slug));
for (const slug of removed) rmSync(join(ROOT, "src/content/blog", `${slug}.md`));

// لینک‌های داخلی به مقاله‌های منتقل‌شده ← مقصد جدید
const target = new Map(
  redirects.filter((r) => r.source.startsWith("/blog/") && !r.source.endsWith("/")).map((r) => [r.source, r.destination]),
);
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const rewritten = [];
for (const file of walk(join(ROOT, "src")).filter((p) => /\.(md|mdx|astro|ts)$/.test(p))) {
  const before = readFileSync(file, "utf8");
  const after = before.replace(/\/blog\/[a-z0-9-]+\/?(?=[)"'#\s])/g, (link) => target.get(link.replace(/\/$/, "")) ?? link);
  if (after !== before) {
    writeFileSync(file, after);
    rewritten.push(relative(ROOT, file));
  }
}

console.log(`ریدایرکت فعال: ${moved.length} مقاله‌ی قدیمی${movedAll ? " (و خود /blog/)" : ""}`);
if (removed.length) console.log(`پاک شد، چون در مقاله‌ی جدید ادغام شده:\n  ${removed.join("\n  ")}`);
if (rewritten.length) console.log(`لینک‌ها به مقصد جدید عوض شد در:\n  ${rewritten.join("\n  ")}`);
