"use client";

import type { CSSProperties } from "react";
import { useT } from "../LangProvider";
import Html from "./Html";
import Plate from "./Plate";
import { kernHtml } from "./typeset";
import s from "./Hero.module.css";

/** plate alt text (spec › Images › hero.jpg) */
const ALT = {
  en: "An espresso cup, a piece of nigiri on a slate, a perfume bottle and a sneaker on a long stone plinth",
  ja: "長い石の台に並んだエスプレッソカップ、スレートに載せた握り寿司、香水瓶、スニーカー",
} as const;

const FACTS = ["fact1", "fact2", "fact3", "fact4"] as const;

/** stagger delay as a CSS custom property */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Hero() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const lines = t("hero.title")
    .split(/<br\s*\/?>/i)
    .map((l) => l.trim())
    .filter(Boolean)
    .map(kernHtml); // pull a final "." in (EN only; JA ends in 「。」)

  const titleStyle = {
    // phone and desktop sizes, inline so a ?lang=ja first render is right (Hero.module.css .title)
    "--h1-m": ja ? "clamp(30px,9.2vw,44px)" : "clamp(28px,8.9vw,112px)",
    "--h1-d": ja ? "clamp(32px,3.9vw,56px)" : "clamp(34px,3.5vw,52px)",
    lineHeight: ja ? 1.12 : 0.98,
    letterSpacing: ja ? "-0.02em" : "-0.04em",
  } as CSSProperties;

  return (
    // no id: <main id="top"> wraps the page
    <section aria-labelledby="hero-title" className={`relative ${s.hero}`}>
      <div className={s.grid}>
        <div className={s.copy}>
          <p
            className={`m-kicker [text-wrap:balance] ${s.fade}`}
            // JA metrics inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja
            style={ja ? { ...delay(0), fontSize: 13, letterSpacing: "0.06em", textTransform: "none" } : delay(0)}
          >
            {t("hero.eyebrow")}
          </p>

          <h1
            id="hero-title"
            className={`m-display m-jp-break mt-6 text-[color:var(--m-ink)] ${s.title}`}
            style={titleStyle}
          >
            {lines.map((line, i) => (
              <span key={i} className="m-line">
                <Html html={line} style={delay(90 + i * 80)} />
              </span>
            ))}
          </h1>

          {/* .fade (opacity) may wrap these: the buttons are solid beads, nothing here has a backdrop-filter */}
          <div className={s.fade} style={delay(380)}>
            <p
              className={`m-body mt-6 max-w-[30em] text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:mt-8 ${
                ja ? "text-[17px] min-[900px]:text-[18px]" : "text-base min-[900px]:text-lg"
              }`}
            >
              {t("hero.sub")}
            </p>

            {/* MobileBar observes #hero-ctas */}
            <div id="hero-ctas" className="mt-8 flex flex-col gap-3 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:items-center min-[560px]:gap-x-6">
              <a href="#contact" className="m-btn m-btn--dark min-h-12 px-6 py-3 text-base focus-visible:!rounded-full">
                <span>{t("hero.cta1")}</span>
                <svg
                  className="m-arrow shrink-0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              {/* one primary action above the fold: pricing is a text link (on phones the nav's
                  Pricing link is inside the menu sheet, so this stays the visible route) */}
              <a
                href="#pricing"
                className="self-center py-2 text-base font-semibold text-[color:var(--m-ink)] underline decoration-[rgba(20,24,28,0.32)] decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-[color:var(--m-ink)] active:translate-y-px min-[560px]:self-auto min-[560px]:py-0"
                style={{ lineHeight: ja ? 1.9 : 1.5 }}
              >
                {t("hero.cta2")}
              </a>
            </div>
          </div>
        </div>

        <div className={s.plate}>
          <Plate
            img="hero"
            alt={ALT[cur]}
            l1={t("hero.plate.l1")}
            l2={t("hero.plate.l2")}
            ratio="3 / 2"
            mobileRatio="4 / 3"
            scene="studio"
            chip="light"
            lens
            sizes="(min-width: 1640px) 820px, (min-width: 900px) 50vw, calc(100vw - 16px)"
            priority
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 pb-6 sm:px-8 min-[900px]:pb-8">
        <ul className={`${s.facts} ${s.fade}`} style={delay(520)}>
          {FACTS.map((f) => (
            <li key={f} className={`[text-wrap:pretty] ${ja ? "leading-[1.75]" : "leading-[1.55]"}`}>
              {/* k and v share one line: no break between them in the markup */}
              <span className="font-semibold text-[color:var(--m-ink)]">{t(`hero.${f}.k`)}</span>
              {ja ? "" : " "}
              <span className="text-[color:var(--m-soft)]">{t(`hero.${f}.v`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
