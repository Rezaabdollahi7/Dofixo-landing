// اطلاعات پایه‌ی سایت — تنها منبع حقیقت برای متادیتا و structured data.
// هر مقداری که اینجا اضافه می‌شود باید با محتوای واقعی سایت هم‌خوان باشد.

export const SITE = {
  /** دامنه‌ی canonical سایت (باید با `site` در astro.config.mjs یکی باشد) */
  url: "https://www.dofixo.ir",
  name: "دوفیکسو",
  nameEn: "DoFixo",
  legalName: "دوفیکسو",
  /** توضیح کوتاه برند — در schema و fallbackها استفاده می‌شود */
  description:
    "دوفیکسو نرم‌افزار مدیریت تعمیرگاه است؛ از پذیرش دستگاه و پیگیری تعمیرات تا انبار قطعات، صدور فاکتور و گزارش‌های مالی.",
  locale: "fa_IR",
  lang: "fa",
  /** تصویر پیش‌فرض اشتراک‌گذاری در شبکه‌های اجتماعی (۱۲۰۰×۶۳۰) */
  ogImage: "/images/og-default.jpg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  logo: "/images/logo-512.png",
  appUrl: "https://app.dofixo.ir",
  email: "info@dofixo.ir",
  phone: "+989219811980",
  phoneDisplay: "۰۹۲۱۹۸۱۱۹۸۰",
  telegram: "https://t.me/dofixo",
  instagram: "https://instagram.com/dofixo",
  address: {
    street: "شهر صنعتی البرز، بلوار سهروردی، بین حکمت اول و سوم، ساختمان چمران",
    city: "قزوین",
    country: "IR",
  },
} as const;

/** URL مطلق می‌سازد؛ مسیرهای نسبی را به دامنه‌ی canonical می‌چسباند. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

/**
 * مسیر را به شکل canonical نرمال می‌کند.
 * خروجی build از نوع `directory` است، پس همه‌ی URLها باید با `/` تمام شوند
 * تا canonical، sitemap و URL واقعی سرو‌شده دقیقاً یکی باشند.
 */
export function canonicalPathname(pathname: string): string {
  const [pathOnly] = pathname.split(/[?#]/);
  const clean = (pathOnly || "/").replace(/\/+$/, "");
  return clean === "" ? "/" : `${clean}/`;
}

/** schema پایه‌ی سازمان — فقط با اطلاعات واقعی و قابل‌مشاهده در سایت پر شده است. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.nameEn,
  url: `${SITE.url}/`,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl(SITE.logo),
    width: 512,
    height: 512,
  },
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressCountry: SITE.address.country,
  },
  sameAs: [SITE.telegram, SITE.instagram],
};

/** schema سایت — به موتور جستجو می‌گوید نام سایت و زبان اصلی آن چیست. */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: `${SITE.name} | ${SITE.nameEn}`,
  url: `${SITE.url}/`,
  inLanguage: "fa-IR",
  description: SITE.description,
  publisher: { "@id": `${SITE.url}/#organization` },
};

/** آیتم‌های breadcrumb را به schema معتبر تبدیل می‌کند. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(canonicalPathname(item.path)),
    })),
  };
}
