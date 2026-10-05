/**
 * دوره‌ی کامل ویدیویی دوفیکسو — دوازده فصل، هر فصل ۴ تا ۷ دقیقه.
 *
 * صفحه‌ی /academy/course/ فقط وقتی ساخته می‌شود که دست‌کم یک فصل ویدیو
 * داشته باشد، و فصلی که ویدیو ندارد در آن نمایش داده نمی‌شود: صفحه‌ای پر از
 * «به‌زودی» همان متن جانگهداری است که راهنمای نگارش منع کرده.
 *
 * `tutorials` شناسه‌ی آموزش‌های مرتبط است (مثل "tutorials/device-intake")؛
 * فقط آن‌هایی که منتشر شده‌اند لینک می‌شوند.
 */
export interface CourseVideo {
  /** شناسه‌ی ویدیو در آپارات */
  aparat: string;
  youtube?: string;
  /** ISO 8601، مثلاً PT5M40S */
  duration: string;
  uploadDate: string;
}

export interface CourseChapter {
  number: number;
  title: string;
  description: string;
  tutorials: string[];
  video?: CourseVideo;
}

export const COURSE = {
  title: "دوره‌ی کامل دوفیکسو",
  description:
    "همه‌ی دوفیکسو در دوازده فصل کوتاه: از ثبت‌نام و تنظیمات تا پذیرش دستگاه، انبار، سه نوع فاکتور، پیامک به مشتری و گزارش‌ها.",
  /** نسخه‌ی کامل یک‌ساعته در یوتیوب، با تایم‌استمپ فصل‌ها */
  fullLengthYoutube: undefined as string | undefined,
};

export const CHAPTERS: CourseChapter[] = [
  {
    number: 1,
    title: "شروع کار و داشبورد",
    description: "ثبت‌نام، آشنایی با منو و داشبورد، و اینکه هر عدد آن از کجا می‌آید.",
    tutorials: ["tutorials/getting-started", "tutorials/sign-up"],
  },
  {
    number: 2,
    title: "تنظیمات",
    description: "اطلاعات شرکت، تصاویر، تنظیمات پیش‌فرض فاکتور و قالب فاکتور فروش.",
    tutorials: ["tutorials/settings"],
  },
  {
    number: 3,
    title: "پرسنل و نقش‌ها",
    description: "افزودن مدیر و تعمیرکار، و اینکه هر نقش چه چیزی را می‌بیند.",
    tutorials: ["tutorials/personnel"],
  },
  {
    number: 4,
    title: "مشتری‌ها",
    description: "ثبت و جستجوی مشتری، صفحه‌ی مشتری و یادداشت خصوصی.",
    tutorials: ["tutorials/customers"],
  },
  {
    number: 5,
    title: "پذیرش و پیگیری دستگاه",
    description: "ثبت دستگاه با عکس، شماره پذیرش، سپردن به تعمیرکار و وضعیت‌های تعمیر.",
    tutorials: ["tutorials/device-intake", "tutorials/device-statuses"],
  },
  {
    number: 6,
    title: "انبار و کالاها",
    description: "تعریف کالا و دسته‌بندی، حداقل موجودی و قیمت تمام‌شده.",
    tutorials: ["tutorials/inventory"],
  },
  {
    number: 7,
    title: "فاکتور خرید",
    description: "ورود قطعه به انبار و اثرش روی موجودی و قیمت تمام‌شده.",
    tutorials: ["tutorials/purchase-invoice"],
  },
  {
    number: 8,
    title: "فاکتور تعمیر",
    description: "قطعه و اجرت، تخفیف، پرداخت در چند نوبت و گارانتی.",
    tutorials: ["tutorials/repair-invoice"],
  },
  {
    number: 9,
    title: "فاکتور فروش و چاپ",
    description: "فروش لوازم و قطعه، و چاپ فاکتور با لوگوی تعمیرگاه.",
    tutorials: ["tutorials/sale-invoice"],
  },
  {
    number: 10,
    title: "پیامک به مشتری",
    description: "سه پیامک خودکار، کیف پول پیامکی و شارژ آن.",
    tutorials: ["tutorials/customer-sms"],
  },
  {
    number: 11,
    title: "گزارش‌ها",
    description: "گزارش موجودی، سود و زیان و گردش کالا.",
    tutorials: ["tutorials/reports"],
  },
  {
    number: 12,
    title: "خروجی اطلاعات، اشتراک و دعوت از دوستان",
    description: "خروجی اکسل، تمدید اشتراک و یک ماه هدیه برای هر دعوت موفق.",
    tutorials: ["tutorials/exports-and-subscription"],
  },
];

export function publishedChapters(): (CourseChapter & { video: CourseVideo })[] {
  return CHAPTERS.filter((c): c is CourseChapter & { video: CourseVideo } => !!c.video);
}
