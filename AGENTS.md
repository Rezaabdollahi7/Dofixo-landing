## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Academy (مرکز آموزش دوفیکسو)

The blog is being rebuilt into a content hub under `/academy/`: a guide
section, product tutorials with two-minute videos, an experience section,
and a full video course. The plan, the sprints and the 301 map for the old
`/blog/` posts are phase 13 of `Roadmap.md` in the app repository
(`Rezaabdollahi7/repair-system`).

Read these before writing or editing any article, page or feature list:

- `docs/academy/product-facts.md` — what the app actually does, and a list
  of what it does not. Every claim about Dofixo anywhere on this site must
  be backed there. The old posts promised features that never existed
  (multi-branch, QR labels, an activity log, editable SMS text).
- `docs/academy/keyword-map.md` — one primary keyword per page, owned by no
  other page.
- `docs/academy/writing-guide.md` — tone, article structures, internal
  links, CTA, images, and the pre-publish checklist.
- `docs/academy/authors.md` — the four authors. A post goes out under a real
  name only after that person has read and approved it.

Conventions that are easy to break:

- **One address per page, with a trailing slash.** `trailingSlash: "always"`
  in Astro and `vercel.json`; every internal link ends in `/`.
- **The primary CTA is «شروع ۳۰ روز رایگان»** and points at
  `https://app.dofixo.ir/register`. There is no demo; there is a 30-day trial
  with every feature.
- **Host is `www.dofixo.ir`.** The bare domain 308s to it in Vercel.
- **No placeholder text is ever published** — no `[تصویر: …]`, no link to an
  article that does not exist yet.
- **`pnpm build` runs `scripts/check-site.mjs` after Astro**, and fails on a
  slashless or broken internal link, placeholder text, or a `vercel.json` out
  of step with the published articles. Fix the cause; don't bypass the check.
- **Academy code:** articles in `src/content/academy/{guide,tutorials,experience}`
  (MDX), authors in `src/content/authors`, helpers in `src/lib/academy.ts`,
  routes in `src/pages/academy/`. Empty sections, author pages and the course
  page are not built at all. Publishing steps are section ۱۰ of
  `docs/academy/writing-guide.md`; old-post 301s come from
  `src/data/blog-redirects.json` via `pnpm redirects`.
