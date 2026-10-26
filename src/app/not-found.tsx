import type { Metadata } from "next";
import { requestLang } from "@/lib/lang.server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  return {
    title: lang === "ja" ? "ページが見つかりません — VAI MOTION" : "Page not found — VAI MOTION",
    robots: { index: false },
    // not the homepage's: a 404 must not declare "/" as its canonical or carry the LP's share card
    description: null,
    alternates: null,
    openGraph: null,
    twitter: null,
  };
}

const COPY = {
  en: {
    title: "This page doesn\u2019t exist.",
    body: "The link may be out of date or mistyped.",
    home: "Back to the homepage",
    contact: "Get a free consultation",
  },
  ja: {
    title: "ページが見つかりません。",
    body: "URLが変わったか、入力に誤りがある可能性があります。",
    home: "トップページへ戻る",
    contact: "無料で相談する",
  },
};

/** 404 in the LP's own type and tokens, in the visitor's language (cookie, else browser).
 *  The JA metrics and font come from <html class="lang-ja">, which the root layout sets
 *  from the same requestLang(). */
export default async function NotFound() {
  const lang = await requestLang();
  const ja = lang === "ja";
  const c = COPY[lang];
  return (
    <div className="lp" lang={lang}>
      <main id="top" className="flex min-h-svh flex-col justify-center bg-white px-4 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-[1240px]">
          <p className="m-kicker tabular text-[color:var(--m-mute)]">404</p>
          <h1
            className="m-display m-jp-break mt-6 text-[color:var(--m-ink)]"
            style={{
              /* the sections' H2 sizes (Service.tsx), since .m-display sets weight and tracking only */
              fontSize: ja ? "clamp(24px,max(min(6.9vw,30px),4.2vw),64px)" : "clamp(36px,5vw,76px)",
              lineHeight: ja ? 1.3 : 1.05,
            }}
          >
            {c.title}
          </h1>
          <p
            className={`m-body mt-6 max-w-[30em] ${ja ? "text-[17px]" : "text-base"} text-[color:var(--m-soft)] [text-wrap:pretty]`}
          >
            {c.body}
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[560px]:flex-row min-[560px]:items-center min-[560px]:gap-x-6">
            <a href="/" className="m-btn m-btn--dark min-h-12 px-6 py-3 text-base focus-visible:!rounded-full">
              <span>{c.home}</span>
            </a>
            <a
              href="/#contact"
              className="self-center py-2 text-base font-semibold text-[color:var(--m-ink)] underline decoration-[rgba(20,24,28,0.32)] decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-[color:var(--m-ink)] active:translate-y-px min-[560px]:self-auto min-[560px]:py-0"
            >
              {c.contact}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
