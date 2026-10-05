// pnpm redirects
//
// بعد از انتشار هر مقاله‌ی مرکز آموزش اجرا شود. ریدایرکت مقاله‌های قدیمی بلاگ
// را که مقصدشان حالا منتشر شده به vercel.json اضافه می‌کند و فایل آن مقاله‌های
// قدیمی را پاک می‌کند — محتوایشان در مقاله‌ی جدید ادغام شده و نگه داشتنشان
// یعنی دو صفحه برای یک موضوع.
//
// نقشه: src/data/blog-redirects.json. فاز ۱۳ رودمپ.

import { writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ROOT, computeRedirects, readVercelJson, remainingBlogSlugs } from "./lib/redirects.mjs";

const { redirects, moved, movedAll } = computeRedirects();
const vercel = readVercelJson();
vercel.redirects = redirects;
if (redirects.length === 0) delete vercel.redirects;
writeFileSync(join(ROOT, "vercel.json"), JSON.stringify(vercel, null, 2) + "\n");

const remaining = new Set(remainingBlogSlugs());
const removed = moved.filter((slug) => remaining.has(slug));
for (const slug of removed) rmSync(join(ROOT, "src/content/blog", `${slug}.md`));

console.log(`ریدایرکت فعال: ${moved.length} مقاله‌ی قدیمی${movedAll ? " (و خود /blog/)" : ""}`);
if (removed.length) console.log(`پاک شد، چون در مقاله‌ی جدید ادغام شده:\n  ${removed.join("\n  ")}`);
