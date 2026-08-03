import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );

  const sortedPosts = posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );

  const siteUrl = site?.toString().replace(/\/$/, "") ?? "https://dofixo.ir";

  const items = sortedPosts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.id}`;
      return `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
      ${post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>بلاگ دوفیکسو</title>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>مقالات و راهنماهای مدیریت تعمیرگاه موبایل، لپ‌تاپ و دستگاه‌های الکترونیکی</description>
    <language>fa-ir</language>${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
