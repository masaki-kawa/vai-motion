# VAI MOTION — Marketing Landing Page

Production rebuild of the Claude Design handoff (`design_handoff_vai_motion`) in **Next.js (App Router) + TypeScript + Tailwind CSS**. A bilingual (EN / JA) single-page marketing site for VAI MOTION, an AI-assisted, human-finished promo-video service.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19
- TypeScript (strict)
- Tailwind CSS 3.4 — design tokens ported from the prototype's inline config into `tailwind.config.ts`
- `next/font` for Plus Jakarta Sans (EN) + Noto Sans JP (JA)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

`?lang=ja` (or the EN/日本語 toggle) switches language. The choice persists to a `vai_lang` cookie (+ `localStorage` + the URL); the cookie lets the **server render the right language with no flash** and makes each language crawlable. A first visit with no cookie opens in Japanese when the browser's first language is Japanese (`Accept-Language`), otherwise in English.

### Environment (contact form)

The contact form posts to `/api/contact`, which sends each enquiry to a Slack channel through an Incoming Webhook:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...   # Slack → Apps → Incoming Webhooks
NEXT_PUBLIC_SITE_URL=https://www.example.com             # the production domain (canonical, hreflang, og:url, sitemap)
```

Without `SLACK_WEBHOOK_URL`, development validates and logs the enquiry; **production returns an error** so the form never thanks someone whose message went nowhere. After deploying, send one test enquiry through the live form and check that it arrives.

## Structure

```
src/
  app/
    layout.tsx            fonts, root metadata (EN), <html lang> + .lang-ja from the vai_lang cookie / Accept-Language
    page.tsx              the LP: language (?lang → cookie → browser), JA metadata, JSON-LD, the sections under <LangProvider>
    not-found.tsx         404 in the visitor's language
    sitemap.ts, robots.ts
    icon.png, apple-icon.png   favicon + Apple icon (file-based metadata)
    globals.css           tokens, liquid-glass materials, reveal/motion primitives, keyframes
    api/contact/route.ts  validates the form and posts it to Slack (SLACK_WEBHOOK_URL)
    jp/                   the older Japanese site (components at the top of src/components/, i18n.jp.ts) + legal/tokushoho
  components/
    LangProvider.tsx      EN/JA context, useT() hook, cookie + localStorage + ?lang
    LangToggle.tsx, SkipLink.tsx, SmoothScroll.tsx, DocTitle.tsx
    lp/                   the LP sections: Nav, Hero, Idea, Budget, Service, Pricing, How, Faq, Contact, Footer, MobileBar
                          (+ GlassDefs, Plate, Html, typeset, useReveal, useMirror and their *.module.css)
    (the rest)            sections of the older /jp page
  lib/
    i18n.lp.ts            EN / JA copy of the LP ({tokens} filled from pricing.ts)
    pricing.ts            every price in one place + fillPrices()
    lang.ts, lang.server.ts   cookie name, Accept-Language parsing, requestLang() for Server Components
    lpImages.ts           the five image slots (ready flags)
    i18n.ts, i18n.jp.ts, data.ts   dictionaries and data of the older /jp page
public/assets/            logos; assets/lp/ holds the LP images. og-lp.jpg / og-lp-ja.jpg are the share images (og.jpg for /jp)
```

## Fidelity notes / deviations from the prototype

- **Accent token renamed `sage` → `accent`** (the prototype kept the legacy green name on a blue value, as the handoff README instructed). Values unchanged: `#4F84D6` / deep `#335FB0` / soft `#EAF1FB`.
- **Nav refraction = live `backdrop-filter` displacement** (not the prototype's DOM-clone). The `.glass-filter` layer applies `backdrop-filter: blur(4px) url(#lg-dist)` so the SVG displacement warps the **real** page content behind the nav — genuinely see-through and auto-tracking scroll with zero JS (the original clone approach looked like a snapshot "stuck" to the nav and had to be re-synced every frame). Its opacity rides `--p` so it fades in with the glass. Falls back to a plain frosted blur where backdrop `url()` filters are unsupported (e.g. Safari) — still real and transparent, just no water warp. The conic-gradient rim, scroll-to-pill morph, and logo cross-fade are preserved.
- **Tailwind Play CDN replaced** with a real build + `tailwind.config.ts`.
- `localStorage` key kept as `reelmate_lang` (legacy) for continuity.
- **Copy is sourced from the i18n dictionary, not the HTML pre-JS fallback.** In the prototype, `data-i18n` swaps `textContent` from `i18n.js` at load, so the dictionary value is what actually renders. `i18n.ts` matches that dictionary (five strings whose HTML markup differed from the dict — `pr.title`, `pos.sub`, `pr.light.tag`, `pr.std.tag`, `ft.tag` — render the dict value). Dead dict keys for removed sections (the `mx.*` comparison matrix, `ft.col*` footer columns) are omitted. Intentional content changes requested after handoff: pricing's "Every plan includes" first row is **"10 to 20s video"** (was "Vertical 15 to 30s video"), and the monthly panel shows the **price cards first, the agency/VAI/DIY comparison below**.
- **Badge accent dots kept (design intent).** The hero / "Main offering" / promo-kicker badges have a decorative leading dot in the markup, but the prototype's `textContent` i18n swap strips it at runtime. These dots are preserved here rather than reproducing that side-effect.

## Open content question (prototype is internally inconsistent)

- The pricing heading renders **"Simple monthly plans"** (dict value) but the section is tabbed (Monthly **+** Promo). The HTML markup said **"Pricing"**, which reads better for a tabbed section. Pick one for the live site.

## Production hardening (done)

- **Performance** — assets compressed (78 MB → 14 MB): posters → optimized JPEG (≤104 KB), videos → 720p/1080p **H.264 / AAC mp4**, `preload` none (hero) / metadata (work). (WebM/VP9 was dropped: for these short clips it was *larger* than the mp4 and Safari couldn't play its Opus audio.)
- **Recent Work player** — native `<video controls>` is replaced with a custom minimal bar (play/pause · seek · mute toggle) because the native controls exposed an unwanted fullscreen button + overflow (⋮) menu and a flaky/disabled volume control. Sound is **on by default** (`muted=false`, set imperatively to dodge React's unreliable `muted` prop); audio confirmed decoding (AAC-LC 48 kHz stereo).
- **Accessibility** — skip link, keyboard-operable hero video cards (`role="button"` + Enter/Space), `aria-pressed` language toggle, `aria-expanded` menu, `role="radiogroup"`, `aria-label`ed videos.
- **SEO** — Open Graph + Twitter card (`/og-lp.jpg`, `/og-lp-ja.jpg`; `/og.jpg` for /jp), `hreflang` en/ja/x-default alternates, canonical, `sitemap.xml` + `robots.txt`, Organization + FAQ JSON-LD, favicon + Apple icon (`app/icon.png`, `app/apple-icon.png`), a 404 page in both languages.
- **No locale flash** — language resolved server-side from the `vai_lang` cookie (see Run).
- **Smooth nav morph** — the full-width bar → floating pill transition rides a single progress var `--p` (0→1). `--p` is a *registered* `@property`, so flipping it via a scroll threshold (`.is-scrolled`, with hysteresis) eases it over one `cubic-bezier` curve, and every nav property (width, radius, top margin, background, blur, shadow, rim/link/logo opacity) interpolates from it with `calc()` — one silky eased motion. (The original snapped because `max-width: none → 960px` isn't interpolatable; a first rewrite was scroll-linked per-frame, which janked from layout reflow on every scroll event. This eased-threshold version avoids both.)
- **Contact endpoint** — `/api/contact` (validates, delivers to Slack via `SLACK_WEBHOOK_URL`).

## TODO before launch

- Set `SLACK_WEBHOOK_URL` so contact enquiries are delivered, then send one test enquiry through the live form.
- Set `NEXT_PUBLIC_SITE_URL` to the production domain (`vaimotion.com` is a placeholder) and confirm the public contact address.
