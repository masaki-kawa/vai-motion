"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { Lang } from "@/lib/i18n";
import { useT } from "../LangProvider";
import Html from "./Html";
import { kernHtml } from "./typeset";
import { useReveal } from "./useReveal";
import s from "./Footer.module.css";

const LINKS = [
  { href: "#idea", key: "nav.idea" },
  { href: "#service", key: "nav.service" },
  { href: "#pricing", key: "nav.pricing" },
  { href: "#how", key: "nav.how" },
  { href: "#faq", key: "nav.faq" },
  { href: "#contact", key: "ft.contact" },
] as const;

const LANGS: { lang: Lang; key: string }[] = [
  { lang: "en", key: "nav.lang.en" },
  { lang: "ja", key: "nav.lang.ja" },
];

/** Keys requested from the lead. Used only until they exist in i18n.lp.ts, so a raw key never shows. */
const PENDING: Record<string, Record<Lang, string>> = {
  "nav.lang.en": { en: "EN", ja: "EN" },
  "nav.lang.ja": { en: "日本語", ja: "日本語" },
  "ft.lang": { en: "Language", ja: "言語" },
  "ft.nav": { en: "Footer", ja: "フッター" },
};

export default function Footer() {
  const { t, cur, setLang } = useT();
  const ja = cur === "ja";
  const tx = (k: string) => {
    const v = t(k);
    return v === k && PENDING[k] ? PENDING[k][cur] : v;
  };
  const { ref, cls } = useReveal<HTMLParagraphElement>();
  const lines = t("ft.line")
    .split(/<br\s*\/?>/i)
    .map((l) => l.trim())
    .filter(Boolean)
    .map(kernHtml); // pull a final "." in (EN only; JA ends in 「。」)

  return (
    <footer id="footer" className={`bg-white pt-[88px] min-[900px]:pt-[120px] ${s.footer}`}>
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        {/* brand line: the editorial sign-off */}
        <p
          ref={ref}
          className={`m-display m-jp-break text-[color:var(--m-ink)] ${s.brand} ${ja ? s.ja : s.en} ${cls}`}
          style={{ letterSpacing: ja ? "-0.02em" : "-0.04em" }}
        >
          {lines.map((line, i) => (
            <span key={i} className="m-line">
              <Html html={line} style={{ "--d": `${i * 80}ms` } as CSSProperties} />
            </span>
          ))}
        </p>

        <div className="mt-14 border-t border-[color:var(--m-line)] pt-10 min-[900px]:mt-[72px] min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8 min-[900px]:pt-12">
          {/* logo + description */}
          <div className="min-[900px]:col-span-6">
            {/* the PNG carries wide transparent margins: crop to the mark so it sits on the text edge */}
            <div className="relative aspect-[1524/374] w-[156px] overflow-hidden min-[900px]:w-[176px]">
              <Image
                src="/assets/vai-motion-logo-h.png"
                alt="VAI MOTION"
                width={1920}
                height={819}
                sizes="224px"
                className="absolute max-w-none"
                style={{ width: "125.98%", height: "auto", left: "-12.34%", top: "-59.09%" }}
              />
            </div>
            <p className="m-body mt-5 max-w-[26em] text-[15px] text-[color:var(--m-soft)]">{t("ft.desc")}</p>
          </div>

          {/* links: one column on desktop, a two-column grid on phones */}
          <nav
            aria-label={tx("ft.nav")}
            className="mt-10 min-[900px]:col-span-3 min-[900px]:col-start-7 min-[900px]:mt-0"
          >
            <ul className="grid max-w-[420px] grid-flow-col grid-cols-2 grid-rows-3 gap-x-6 gap-y-3 min-[900px]:grid-cols-1 min-[900px]:grid-rows-6">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-block py-0.5 text-[14px] font-medium text-[color:var(--m-soft)] decoration-1 underline-offset-[5px] transition-colors duration-200 hover:text-[color:var(--m-ink)] hover:underline"
                  >
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* language + back to top */}
          <div className="mt-10 flex items-center justify-between gap-6 min-[900px]:col-span-3 min-[900px]:col-start-10 min-[900px]:mt-0 min-[900px]:flex-col min-[900px]:items-end min-[900px]:justify-start min-[900px]:gap-5">
            <div
              role="group"
              aria-label={tx("ft.lang")}
              className="inline-flex h-10 shrink-0 items-center rounded-full bg-[color:var(--m-paper2)] p-1 shadow-[inset_0_0_0_1px_rgba(20,24,28,0.08)]"
            >
              {LANGS.map(({ lang, key }) => {
                const on = cur === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    lang={lang}
                    aria-pressed={on}
                    onClick={() => {
                      if (!on) setLang(lang);
                    }}
                    className={`h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-300 focus-visible:!rounded-full ${
                      on
                        ? "bg-[color:var(--m-ink)] text-white"
                        : "text-[color:var(--m-soft)] hover:text-[color:var(--m-ink)]"
                    }`}
                  >
                    {tx(key)}
                  </button>
                );
              })}
            </div>
            <a
              href="#top"
              className="text-[14px] font-semibold text-[color:var(--m-ink)] underline decoration-[color:var(--m-line)] decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-[color:var(--m-ink)]"
            >
              {t("ft.top")}
            </a>
          </div>
        </div>

        {/* bottom row: © left, trademark + independence line right (stacked on phones, © last) */}
        <div className="mt-14 flex flex-col-reverse gap-4 text-[12px] text-[color:var(--m-mute)] min-[900px]:mt-20 min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8">
          <p className="min-[900px]:col-span-6">{t("ft.copy")}</p>
          <p className="m-body max-w-[46em] min-[900px]:col-span-6 min-[900px]:col-start-7">{t("ft.tm")}</p>
        </div>
      </div>
    </footer>
  );
}
