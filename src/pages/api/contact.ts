// src/pages/api/contact.ts
//
// تنها مسیر on-demand کل سایت. بقیه‌ی صفحات استاتیک build می‌شوند؛ این
// فایل با prerender=false از آن قاعده خارج و روی Vercel به یک Serverless
// Function تبدیل می‌شود (نیازمند آداپتور @astrojs/vercel در astro.config.mjs).
//
// ایمیل برای این کسب‌وکار یک کانال فرعی است: مشتری هرجا که باشد می‌تواند
// مستقیم از app.dofixo.ir/register ثبت‌نام و استفاده را شروع کند. اگر کسی
// از فرم تماس بپرسد، فقط باید به ایمیل شخصی صاحب سایت برسد — بدون نیاز به
// زیرساخت دائمی سنگین (Redis/KV) که آن را بیش از نیاز واقعی بزرگ می‌کند.
import type { APIRoute } from "astro";

export const prerender = false;

const RECIPIENT = import.meta.env.CONTACT_FORM_RECIPIENT || "srezaabdollahi7@gmail.com";
// onboarding@resend.dev نیاز به تأیید دامنه ندارد، اما فقط به آدرسی که خود
// حساب Resend با آن ساخته شده تحویل می‌دهد. پس حساب Resend باید دقیقاً با
// همین Gmail (RECIPIENT) ساخته شود؛ در غیر این صورت Resend خطا می‌دهد.
const FROM = "دوفیکسو (فرم تماس) <onboarding@resend.dev>";

const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "درخواست نامعتبر است." }, 400);
  }

  // honeypot: فیلدی که فقط ربات‌ها پر می‌کنند؛ برای آن‌ها موفق به نظر
  // می‌رسد اما هیچ ایمیلی ارسال نمی‌شود.
  if (String(form.get("company") || "").trim() !== "") {
    return json({ ok: true }, 200);
  }

  const fullName = String(form.get("fullName") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();

  if (!fullName || fullName.length > 120) {
    return json({ ok: false, error: "نام و نام خانوادگی را درست وارد کنید." }, 400);
  }
  if (!phone || !PHONE_RE.test(phone)) {
    return json({ ok: false, error: "شماره تماس را درست وارد کنید." }, 400);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "آدرس ایمیل درست نیست." }, 400);
  }
  if (message.length > 2000) {
    return json({ ok: false, error: "توضیحات خیلی طولانی است." }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    // کلید روی Vercel تنظیم نشده؛ این را به کاربر نسبت نمی‌دهیم.
    console.error("CONTACT_FORM: RESEND_API_KEY تنظیم نشده است.");
    return json(
      { ok: false, error: "ارسال پیام موقتاً ممکن نیست؛ لطفاً با شماره تماس سایت تماس بگیرید." },
      500,
    );
  }

  const lines = [
    `نام: ${fullName}`,
    `تلفن: ${phone}`,
    email ? `ایمیل: ${email}` : null,
    message ? `توضیحات:\n${message}` : null,
  ].filter(Boolean);

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [RECIPIENT],
        reply_to: email || undefined,
        subject: `پیام جدید از فرم تماس دوفیکسو — ${fullName}`,
        text: lines.join("\n\n"),
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text().catch(() => "");
      console.error("CONTACT_FORM: ارسال با Resend ناموفق بود.", resendRes.status, detail);
      return json(
        { ok: false, error: "ارسال پیام ناموفق بود؛ لطفاً با شماره تماس سایت تماس بگیرید." },
        502,
      );
    }
  } catch (err) {
    console.error("CONTACT_FORM: خطای شبکه هنگام ارسال ایمیل.", err);
    return json(
      { ok: false, error: "ارسال پیام ناموفق بود؛ لطفاً با شماره تماس سایت تماس بگیرید." },
      502,
    );
  }

  return json({ ok: true }, 200);
};

// درخواست‌های غیر از POST باید 405 بدهند، نه 404 عمومی Vercel — تا رفتار
// مسیر قابل تشخیص از «این مسیر اصلاً وجود ندارد» باشد.
const methodNotAllowed: APIRoute = () =>
  new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });

export const GET: APIRoute = methodNotAllowed;
export const OPTIONS: APIRoute = methodNotAllowed;
