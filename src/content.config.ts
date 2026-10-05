import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      author: z.string().default("تیم دوفیکسو"),
      tags: z.array(z.string()).default([]),
      icon: z.enum(["repair", "inventory", "pricing", "customer", "general"]).default("general"),
      draft: z.boolean().default(false),
    }),
});

/**
 * نویسنده‌های مرکز آموزش — یک فایل JSON برای هر نفر در src/content/authors.
 * فقط واقعیت: جمله‌ای که هنوز تأیید نشده در بیو نمی‌آید (docs/academy/authors.md).
 */
const authors = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/authors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /** نقشی که زیر نام نمایش داده می‌شود */
      role: z.string(),
      /** همان نقش برای schema.org/Person */
      jobTitle: z.string(),
      bioShort: z.string(),
      bioLong: z.string(),
      avatar: image(),
      /** موقت: تا عکس واقعی نرسیده آواتار ساده نمایش داده می‌شود، و در schema نمی‌آید */
      avatarIsPlaceholder: z.boolean().default(false),
      worksFor: z.object({ name: z.string(), url: z.string().url().optional() }).optional(),
      sameAs: z.array(z.string().url()).default([]),
    }),
});

/**
 * مقاله‌های مرکز آموزش.
 *
 * مسیر فایل آدرس مقاله را می‌سازد: `guide/phone-intake-form.mdx` و
 * `guide/phone-intake-form/index.mdx` (وقتی تصویرها کنار مقاله‌اند) هر دو
 * /academy/guide/phone-intake-form/ می‌شوند. پوشه‌ی اول بخش مقاله است و فقط
 * سه مقدار مجاز دارد؛ src/lib/academy.ts در build بررسی‌اش می‌کند.
 */
const academy = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/academy",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, "").replace(/\.mdx?$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      // حدود طول از docs/academy/writing-guide.md؛ build با عنوان بلندتر شکست می‌خورد
      title: z.string().max(70),
      description: z.string().min(80).max(170),
      /**
       * «در این مقاله چه یاد می‌گیرید» — سه تا شش جمله‌ی کوتاه، هر کدام یک
       * نتیجه که خواننده با خودش می‌برد، نه فهرست سرتیترها.
       */
      learn: z.array(z.string()).min(3).max(6),
      /** کلمه‌ی کلیدی اصلی از docs/academy/keyword-map.md؛ در صفحه نمایش داده نمی‌شود */
      keyword: z.string(),
      author: reference("authors"),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** مقاله‌ی ستون (Pillar) بخش خودش */
      pillar: z.boolean().default(false),
      /** ترتیب در مسیر آموزش‌ها؛ برای بخش tutorials الزامی است */
      order: z.number().int().min(0).optional(),
      cover: image(),
      coverAlt: z.string(),
      video: z
        .object({
          /** شناسه‌ی ویدیو در آپارات: همان بخش آخر https://www.aparat.com/v/<hash> */
          aparat: z.string(),
          youtube: z.string().optional(),
          title: z.string(),
          /** ISO 8601، مثلاً PT2M10S */
          duration: z.string().regex(/^PT(\d+H)?(\d+M)?(\d+S)?$/),
          uploadDate: z.coerce.date(),
          poster: image(),
        })
        .optional(),
      /** شماره‌ی فصل مربوط در دوره‌ی کامل (src/data/course.ts) */
      courseChapter: z.number().int().min(1).optional(),
      related: z.array(reference("academy")).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog, authors, academy };
