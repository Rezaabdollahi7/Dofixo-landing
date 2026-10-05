import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { SITE, absoluteUrl } from "../data/site";

export type Article = CollectionEntry<"academy">;
export type Author = CollectionEntry<"authors">;

/**
 * سه بخش مرکز آموزش. ترتیب این آرایه ترتیب نمایش در صفحه‌ی اصلی مرکز است.
 * نیت هر بخش در docs/academy/keyword-map.md آمده؛ مرزشان را همان‌جا نگه دارید.
 */
export const SECTIONS = [
  {
    key: "guide",
    name: "راهنمای مدیریت تعمیرگاه",
    short: "راهنما",
    description:
      "اصول اداره‌ی یک تعمیرگاه موبایل: از رسید پذیرش و انبار قطعات تا حساب و کتاب و مدیریت تعمیرکارها.",
  },
  {
    key: "tutorials",
    name: "آموزش دوفیکسو",
    short: "آموزش",
    description:
      "قدم‌به‌قدم، با تصویر و ویدیوی کوتاه: هر کاری که در دوفیکسو انجام می‌دهید، از ثبت‌نام تا گزارش سود و زیان.",
  },
  {
    key: "experience",
    name: "تجربه‌های تعمیرگاه",
    short: "تجربه",
    description:
      "نکته‌هایی که از پشت میز تعمیر می‌آیند: مشتری‌ای که گوشی‌اش را نمی‌برد، قیمت قطعه با دلار متغیر، گارانتی و رضایت مشتری.",
  },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];

export function sectionOf(article: Article): SectionKey {
  const key = article.id.split("/")[0];
  const section = SECTIONS.find((s) => s.key === key);
  if (!section || article.id.split("/").length !== 2) {
    throw new Error(
      `«${article.id}»: مقاله‌های مرکز آموزش باید در یکی از پوشه‌های ${SECTIONS.map((s) => s.key).join("، ")} و یک سطح پایین‌تر باشند.`,
    );
  }
  return section.key;
}

export function sectionMeta(key: SectionKey) {
  return SECTIONS.find((s) => s.key === key)!;
}

export function slugOf(article: Article): string {
  return article.id.split("/")[1];
}

export const articlePath = (article: Article) => `/academy/${article.id}/`;
export const sectionPath = (key: SectionKey) => `/academy/${key}/`;
export const authorPath = (id: string) => `/academy/authors/${id}/`;
export const personId = (id: string) => `${SITE.url}/academy/authors/${id}/#person`;

/**
 * مقاله‌های منتشرشده، تازه‌ترین اول. در حالت توسعه پیش‌نویس‌ها هم دیده می‌شوند
 * (همان رفتار بلاگ)، ولی در build نهایی هرگز.
 *
 * آموزش‌ها بدون `order` رد می‌شوند: مسیر قبلی/بعدی بدون ترتیب معنی ندارد.
 */
let cached: Promise<Article[]> | undefined;

export function getArticles(): Promise<Article[]> {
  // هر صفحه (و منو و فوتر در هر صفحه) این را صدا می‌زند؛ یک بار خواندن کافی است،
  // و تا وقتی مجموعه خالی است Astro هم فقط یک بار هشدار می‌دهد.
  cached ??= loadArticles();
  return cached;
}

async function loadArticles(): Promise<Article[]> {
  const articles = await getCollection("academy", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  for (const article of articles) {
    if (sectionOf(article) === "tutorials" && article.data.order === undefined) {
      throw new Error(`«${article.id}»: آموزش‌ها باید فیلد order داشته باشند.`);
    }
  }
  return articles.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export async function getSectionArticles(key: SectionKey): Promise<Article[]> {
  const all = (await getArticles()).filter((a) => sectionOf(a) === key);
  if (key === "tutorials") return all.sort((a, b) => a.data.order! - b.data.order!);
  // ستون اول، بقیه تازه‌ترین اول
  return all.sort((a, b) => Number(b.data.pillar) - Number(a.data.pillar));
}

/** مرکز آموزش فقط وقتی در منو و sitemap می‌آید که دست‌کم یک مقاله‌ی منتشرشده داشته باشد. */
export async function hasAcademy(): Promise<boolean> {
  return (await getArticles()).length > 0;
}

export async function getAuthor(article: Article): Promise<Author> {
  const author = await getEntry(article.data.author);
  if (!author) throw new Error(`«${article.id}»: نویسنده‌ی «${article.data.author.id}» پیدا نشد.`);
  return author;
}

/** فارسی را حدود ۱۸۰ کلمه در دقیقه می‌خوانند؛ همان عددی که بلاگ هم استفاده می‌کرد. */
export function readingMinutes(article: Article): number {
  const words = article.body?.split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.round(words / 180));
}

export function wordCount(article: Article): number {
  return article.body?.split(/\s+/).filter(Boolean).length ?? 0;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

/** «PT2M10S» ← «۲:۱۰» برای نمایش کنار ویدیو */
export function formatDuration(iso: string): string {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return "";
  const [h, min, s] = [Number(m[1] ?? 0), Number(m[2] ?? 0), Number(m[3] ?? 0)];
  const total = h * 60 + min;
  return `${total.toLocaleString("fa-IR")}:${String(s).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d])}`;
}

export function aparatEmbedUrl(hash: string): string {
  return `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame`;
}

export function aparatPageUrl(hash: string): string {
  return `https://www.aparat.com/v/${hash}`;
}

/** schema.org/Person برای یک نویسنده؛ آواتار موقت در schema نمی‌آید. */
export function personSchema(author: Author, imageUrl?: string) {
  return {
    "@type": "Person",
    "@id": personId(author.id),
    name: author.data.name,
    jobTitle: author.data.jobTitle,
    description: author.data.bioShort,
    url: absoluteUrl(authorPath(author.id)),
    ...(imageUrl && !author.data.avatarIsPlaceholder ? { image: absoluteUrl(imageUrl) } : {}),
    ...(author.data.worksFor
      ? {
          worksFor: {
            "@type": "Organization",
            name: author.data.worksFor.name,
            ...(author.data.worksFor.url ? { url: author.data.worksFor.url } : {}),
          },
        }
      : {}),
    ...(author.data.sameAs.length ? { sameAs: author.data.sameAs } : {}),
  };
}
