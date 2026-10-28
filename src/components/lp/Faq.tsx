"use client";

import type { CSSProperties } from "react";
import { useT } from "../LangProvider";
import { JA_BREAK, JA_KICKER, SplitTitle } from "./How";
import { useReveal } from "./useReveal";
import s from "./Faq.module.css";

const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/** stagger delay as a CSS custom property */
const delay = (ms: number | string) => ({ "--d": typeof ms === "number" ? `${ms}ms` : ms }) as CSSProperties;

export default function Faq() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const head = useReveal<HTMLDivElement>();
  const list = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-white">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="border-t border-[color:var(--m-line)] pb-24 pt-20 min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8 min-[900px]:py-24">
          {/* ---- title block: columns 1–4, sticky on desktop ---- */}
          <div
            ref={head.ref}
            className="min-[900px]:sticky min-[900px]:top-[120px] min-[900px]:col-span-4 min-[900px]:self-start"
          >
            <p className={`m-kicker m-reveal ${head.cls}`} style={ja ? { ...delay(0), ...JA_KICKER } : delay(0)}>
              {t("faq.kicker")}
            </p>
            <SplitTitle
              id="faq-title"
              html={t("faq.title")}
              cls={head.cls}
              className="m-display m-jp-break mt-6 text-[color:var(--m-ink)]"
              style={{
                fontSize: ja ? "clamp(30px,3.6vw,56px)" : "clamp(36px,4.4vw,68px)",
                lineHeight: ja ? 1.25 : 1.02,
                letterSpacing: ja ? "-0.02em" : "-0.04em",
                ...(ja ? JA_BREAK : {}),
              }}
            />
            <p
              className={`m-body m-reveal mt-6 max-w-[24em] text-base text-[color:var(--m-soft)] [text-wrap:pretty] ${head.cls}`}
              style={delay("calc(var(--title-end, 160ms) + 120ms)")}
            >
              {t("faq.sub")}
            </p>
            <p className={`m-reveal mt-6 min-[900px]:mt-8 ${head.cls}`} style={delay("calc(var(--title-end, 160ms) + 200ms)")}>
              <a
                href="#contact"
                className={`${ja ? s.jaPhrase : ""} text-base font-semibold text-[color:var(--m-ink)] underline decoration-[rgba(20,24,28,0.32)] decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-[color:var(--m-ink)]`}
                style={{ lineHeight: ja ? 1.9 : 1.6 }}
              >
                {t("faq.more")}
              </a>
            </p>
          </div>

          {/* ---- questions: columns 6–12 ---- */}
          <div ref={list.ref} className="mt-12 min-[900px]:col-span-7 min-[900px]:col-start-6 min-[900px]:mt-0">
            <div className="border-t border-[color:var(--m-line)]">
              {ITEMS.map((n, i) => (
                <details key={n} className={`${s.item} m-reveal ${list.cls}`} style={delay(i * 50)}>
                  <summary
                    className={`${s.q} flex items-start justify-between gap-6 py-6 ${
                      ja ? "text-[17px] min-[900px]:text-[19px]" : "text-base min-[900px]:text-lg"
                    } font-semibold text-[color:var(--m-ink)] min-[900px]:gap-8`}
                    style={{ lineHeight: ja ? 1.6 : 1.4, letterSpacing: ja ? "0" : "-0.01em" }}
                  >
                    <span className={`min-w-0 [text-wrap:pretty] ${ja ? s.jaPhrase : ""}`}>{t(`faq.${n}.q`)}</span>
                    <span aria-hidden="true" className={s.icon} />
                  </summary>
                  <div className={s.a}>
                    <p
                      className="max-w-[40em] pb-6 text-base text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:pb-8 min-[900px]:pr-12"
                      style={{ lineHeight: ja ? 1.9 : 1.8 }}
                    >
                      {t(`faq.${n}.a`)}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
