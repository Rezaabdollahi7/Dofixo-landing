// تصویرهای واقعی اپ برای صفحه‌ی اول: گالری «اسکرین‌شات‌ها» و بخش ماژول‌ها.
//
// همه از اجرای واقعی اپ روی داده‌ی تعمیرگاه ساختگی «موبایل‌کده نگین» گرفته
// شده‌اند — docs/academy/shots/tutorials/site.mjs در ریپوی اپ (repair-system)،
// خروجی out/shots/site/ که این‌جا در src/assets/site/ کپی می‌شود. وقتی UI اپ
// عوض شد، همان اسکریپت را دوباره اجرا کنید و فایل‌ها را جایگزین کنید.
//
// هر توضیح باید در docs/academy/product-facts.md پشتوانه داشته باشد.

import type { ImageMetadata } from "astro";
import dashboard from "../assets/site/dashboard.webp";
import devices from "../assets/site/devices.webp";
import newDevice from "../assets/site/new-device.webp";
import customerPage from "../assets/site/customer-page.webp";
import repairInvoice from "../assets/site/repair-invoice.webp";
import items from "../assets/site/items.webp";
import profitReport from "../assets/site/profit-report.webp";
import technician from "../assets/site/technician.webp";
import smsWallet from "../assets/site/sms-wallet.webp";

export interface AppScreen {
  image: ImageMetadata;
  title: string;
  caption: string;
}

export const screens = {
  dashboard: {
    image: dashboard,
    title: "داشبورد",
    caption: "وضعیت دستگاه‌ها، بار کاری تعمیرکارها، درآمد و فاکتورهای در انتظار پرداخت در یک نگاه.",
  },
  devices: {
    image: devices,
    title: "فهرست دستگاه‌ها",
    caption: "هر دستگاه با شماره‌ی پذیرش، وضعیت تعمیر، تعمیرکار و وضعیت پرداخت؛ جستجو با نام، شماره تماس، سریال یا مدل.",
  },
  newDevice: {
    image: newDevice,
    title: "پذیرش دستگاه",
    caption: "ثبت مشتری، مشخصات دستگاه و تعمیرکار مسئول — و پیامک پذیرش به مشتری با یک کلیک.",
  },
  customerPage: {
    image: customerPage,
    title: "پرونده‌ی مشتری",
    caption: "همه‌ی دستگاه‌های یک مشتری، تاریخچه‌ی تعمیرها، فاکتورها و یادداشت خصوصی که فقط کارکنان می‌بینند.",
  },
  repairInvoice: {
    image: repairInvoice,
    title: "فاکتور تعمیر",
    caption: "قطعه و اجرت در یک فاکتور، با گارانتی و پرداخت در یک یا چند نوبت.",
  },
  items: {
    image: items,
    title: "انبار و کالاها",
    caption: "موجودی، حداقل موجودی و قیمت تمام‌شده‌ی هر قطعه، که با هر فاکتور خودکار به‌روز می‌شود.",
  },
  profitReport: {
    image: profitReport,
    title: "گزارش سود و زیان",
    caption: "فروش، بهای تمام‌شده و سود خالص در هر بازه‌ی تاریخ، به تفکیک کالا.",
  },
  technician: {
    image: technician,
    title: "صفحه‌ی تعمیرکار",
    caption: "دستگاه‌های فعال، تعمیرهای موفق، میانگین زمان تعمیر و عملکرد ماهانه‌ی هر تعمیرکار.",
  },
  smsWallet: {
    image: smsWallet,
    title: "کیف پول پیامکی",
    caption: "شارژ آنلاین و تاریخچه‌ی پیامک‌هایی که برای پذیرش، آماده‌بودن و تحویل دستگاه به مشتری رفته.",
  },
} satisfies Record<string, AppScreen>;

/** ترتیب گالری: از پذیرش تا گزارش، همان مسیری که یک دستگاه در مغازه طی می‌کند. */
export const gallery: AppScreen[] = [
  screens.dashboard,
  screens.devices,
  screens.newDevice,
  screens.customerPage,
  screens.repairInvoice,
  screens.items,
  screens.profitReport,
  screens.technician,
  screens.smsWallet,
];
