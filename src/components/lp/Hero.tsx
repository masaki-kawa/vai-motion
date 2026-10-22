"use client";

import type { CSSProperties } from "react";
import { useT } from "../LangProvider";
import Html from "./Html";
import Plate from "./Plate";
import s from "./Hero.module.css";

/** plate alt text (spec › Images › hero.jpg) */
const ALT = {
  en: "An espresso cup, a piece of nigiri on a slate, a perfume bottle and a sneaker on a long stone plinth",
  ja: "長い石の台に並んだエスプレッソカップ、スレートに載せた握り寿司、香水瓶、スニーカー",
} as const;

const FACTS = ["fact1", "fact2", "fact3", "fact4"] as const;

/** stagger delay as a CSS custom property */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Optical kerning: Jakarta's full stop carries ~.12em of side bearing, which reads as a gap
 *  after tight display tracking. Pull a line-final "." in (EN only; JA ends in 「。」). */
const kernStop = (html: string) => html.replace(/\.$/, `<span class="${s.stop}">.</span>`);

export default function Hero() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const lines = t("hero.title")
    .split(/<br\s*\/?>/i)
    .map((l) => l.trim())
    .filter(Boolean)
    .map(kernStop);

  return (
    // no id: <main id="top"> wraps the page
    <section aria-labelledby="hero-title" className="relative bg-white">
      <div className="mx-auto max-w-[1240px] px-4 pb-6 pt-[112px] sm:px-8 min-[900px]:pb-8 min-[900px]:pt-[168px]">
        <p
          className={`m-kicker [text-wrap:balance] ${s.fade}`}
          // JA metrics inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja
          style={ja ? { ...delay(0), fontSize: 13, letterSpacing: "0.06em", textTransform: "none" } : delay(0)}
        >
          {t("hero.eyebrow")}
        </p>

        <h1
          id="hero-title"
          className={`m-display m-jp-break mt-5 text-[color:var(--m-ink)] min-[900px]:mt-7 ${s.title}`}
          style={{
            fontSize: ja ? "clamp(34px,6vw,92px)" : "clamp(40px,7.2vw,112px)",
            lineHeight: ja ? 1.12 : 0.96,
            letterSpacing: ja ? "-0.02em" : "-0.04em",
          }}
        >
          {lines.map((line, i) => (
            <span key={i} className="m-line">
              <Html html={line} style={delay(90 + i * 80)} />
            </span>
          ))}
        </h1>

        <div className="mt-8 min-[900px]:mt-14 min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:items-start min-[900px]:gap-x-8">
          {/* 1–5 / 6–12 from 1100px; an even split on narrow desktops keeps both pills on one line */}
          <div className={`min-[900px]:col-span-6 min-[1100px]:col-span-5 ${s.fade}`} style={delay(380)}>
            <p className="m-body max-w-[30em] text-[17px] text-[color:var(--m-soft)] min-[900px]:text-[19px]">
              {t("hero.sub")}
            </p>

            {/* MobileBar observes #hero-ctas */}
            <div id="hero-ctas" className="mt-8 flex flex-col gap-3 min-[560px]:flex-row min-[560px]:flex-wrap">
              <a
                href="#contact"
                className="m-btn m-btn--dark m-rim-dark h-[54px] px-7 text-[15px] focus-visible:!rounded-full"
              >
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
              <a
                href="#pricing"
                className="m-btn m-btn--light h-[54px] px-7 text-[15px] focus-visible:!rounded-full"
              >
                {t("hero.cta2")}
              </a>
            </div>

            <ul className="mt-10 min-[900px]:mt-12">
              {FACTS.map((f) => (
                <li
                  key={f}
                  className={`border-t border-[color:var(--m-line)] py-[14px] text-[15px] [text-wrap:pretty] ${
                    ja ? "leading-[1.75]" : "leading-[1.55]"
                  }`}
                >
                  {/* k and v share one line: no break between them in the markup */}
                  <span className="font-semibold text-[color:var(--m-ink)]">{t(`hero.${f}.k`)}</span>
                  {ja ? "" : " "}
                  <span className="text-[color:var(--m-soft)]">{t(`hero.${f}.v`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 min-[900px]:col-span-6 min-[900px]:col-start-7 min-[900px]:mt-0 min-[1100px]:col-span-7 min-[1100px]:col-start-6">
            <Plate
              img="hero"
              alt={ALT[cur]}
              l1={t("hero.plate.l1")}
              l2={t("hero.plate.l2")}
              ratio="3 / 2"
              sizes="(min-width: 1240px) 680px, (min-width: 1100px) 54vw, (min-width: 900px) 46vw, calc(100vw - 32px)"
              priority
              drift={-24}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
