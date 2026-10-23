"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useT } from "../LangProvider";
import Html from "./Html";
import Plate from "./Plate";
import { bindShortWords, kernHtml, kernWord, splitHeading } from "./typeset";
import { useReveal } from "./useReveal";
import s from "./Idea.module.css";

/** plate alt text (spec › Images › shoot.jpg) */
const ALT = {
  en: "An empty film studio with a cinema camera and switched-off lights",
  ja: "照明が消えた、誰もいない撮影スタジオとシネマカメラ",
} as const;

const CLAIMS = [1, 2, 3] as const;
type ClaimNo = (typeof CLAIMS)[number];

/** desktop grid rows: claims stack in column 1–7, the plate spans all three rows on the right.
 *  In the DOM the plate sits after claim 1, which is exactly where phones show it. */
const ROW: Record<ClaimNo, string> = {
  1: "min-[900px]:row-start-1",
  2: "min-[900px]:row-start-2",
  3: "min-[900px]:row-start-3",
};

/** stagger delay as a CSS custom property */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** JA line breaking inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja */
const JA_BREAK: CSSProperties = { wordBreak: "keep-all", lineBreak: "strict", overflowWrap: "anywhere" };

export default function Idea() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const head = useReveal<HTMLDivElement>();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  const titleHtml = t("idea.title");
  // masks per word (EN) or <wbr> phrase (JA); null when the copy holds other markup
  const parts = splitHeading(titleHtml);
  const titleText = titleHtml.replace(/<[^>]+>/g, "");

  // Heading lines rise 80ms apart: find the line each mask landed on and stagger by it.
  // Re-measured on resize and once the web fonts are in, since both can move the breaks.
  useEffect(() => {
    const h = titleRef.current;
    if (!h) return;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const masks = Array.from(h.querySelectorAll<HTMLElement>("[data-w]"));
      let line = 0;
      let top = masks[0]?.offsetTop ?? 0;
      for (const m of masks) {
        if (m.offsetTop > top + 2) {
          line++;
          top = m.offsetTop;
        }
        (m.firstElementChild as HTMLElement | null)?.style.setProperty("--d", `${80 + line * 80}ms`);
      }
      leadRef.current?.style.setProperty("--d", `${240 + line * 80}ms`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(h);
    document.fonts?.ready.then(measure);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [titleHtml]);

  return (
    <section id="idea" aria-labelledby="idea-title" className="relative bg-white">
      <div className="mx-auto max-w-[1240px] px-4 pb-24 pt-24 sm:px-8 min-[900px]:pb-[120px] min-[900px]:pt-[160px]">
        {/* ---- header: columns 1–9 ---- */}
        <div ref={head.ref} className="min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8">
          <div className="min-[900px]:col-span-9">
            <p
              className={`m-kicker m-reveal ${head.cls}`}
              style={ja ? { ...delay(0), fontSize: 13, letterSpacing: "0.06em", textTransform: "none" } : delay(0)}
            >
              {t("idea.kicker")}
            </p>

            <h2
              ref={titleRef}
              id="idea-title"
              className={`m-display m-jp-break mt-5 text-[color:var(--m-ink)] min-[900px]:mt-6 ${s.title} ${head.cls}`}
              style={{
                fontSize: ja ? "clamp(30px,4.4vw,68px)" : "clamp(36px,5.2vw,80px)",
                lineHeight: ja ? 1.25 : 1.02,
                letterSpacing: ja ? "-0.02em" : "-0.04em",
                ...(ja ? JA_BREAK : {}),
              }}
            >
              {parts ? (
                <>
                  <span className="sr-only">{titleText}</span>
                  <span aria-hidden="true">
                    {parts.map((p, i) =>
                      "word" in p ? (
                        <span key={i} data-w="" className={`m-line ${s.word}`}>
                          <span>{kernWord(p.word)}</span>
                        </span>
                      ) : p.sep === "wbr" ? (
                        <wbr key={i} />
                      ) : (
                        <Fragment key={i}> </Fragment>
                      ),
                    )}
                  </span>
                </>
              ) : (
                <span className="m-line">
                  <Html html={kernHtml(bindShortWords(titleHtml))} style={delay(80)} />
                </span>
              )}
            </h2>

            <p
              ref={leadRef}
              className={`m-body m-reveal mt-6 max-w-[34em] text-[17px] text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:text-[19px] ${head.cls}`}
              style={delay(320)}
            >
              {t("idea.lead")}
            </p>
          </div>
        </div>

        {/* ---- claims (1–7) and the sticky plate (9–12) ---- */}
        <div className="mt-14 min-[900px]:mt-24 min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8">
          <Claim n={1} />

          <div className="mb-10 min-[900px]:sticky min-[900px]:top-[120px] min-[900px]:col-span-4 min-[900px]:col-start-9 min-[900px]:row-span-3 min-[900px]:row-start-1 min-[900px]:mb-0 min-[900px]:self-start">
            <Plate
              img="shoot"
              alt={ALT[cur]}
              l1={t("idea.plate.l1")}
              l2={t("idea.plate.l2")}
              ratio="4 / 5"
              mobileRatio="4 / 3"
              objectPosition="50% 55%"
              sizes="(min-width: 1240px) 372px, (min-width: 900px) 30vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 32px)"
              drift={-24}
            />
          </div>

          <Claim n={2} />
          <Claim n={3} />
        </div>
      </div>
    </section>
  );
}

/** One claim: label (h3), the claim sentence, and the body. */
function Claim({ n }: { n: ClaimNo }) {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${s.block} ${cls} py-10 min-[900px]:col-span-7 min-[900px]:col-start-1 min-[900px]:py-12 ${ROW[n]}`}
    >
      <span aria-hidden="true" className={s.rule} />

      <h3
        className={`m-reveal ${cls} flex items-baseline gap-3 font-semibold text-[color:var(--m-mute)] ${
          ja ? "text-[13px] tracking-[0.06em]" : "text-[12px] uppercase tracking-[0.14em]"
        }`}
        style={delay(0)}
      >
        <span>{t(`idea.${n}.label`)}</span>
      </h3>

      <div className={`m-reveal ${cls} mt-4 min-[900px]:mt-5`} style={delay(90)}>
        {/* EN: one- and two-letter words travel with the next word, so none dangles at a line end */}
        <Html
          as="p"
          html={ja ? t(`idea.${n}.claim`) : bindShortWords(t(`idea.${n}.claim`))}
          className="m-jp-break font-bold text-[color:var(--m-ink)] [text-wrap:balance]"
          style={{
            fontSize: ja ? "clamp(22px,2.4vw,34px)" : "clamp(24px,2.6vw,38px)",
            lineHeight: ja ? 1.55 : 1.25,
            letterSpacing: ja ? "0" : "-0.02em",
            ...(ja ? JA_BREAK : {}),
          }}
        />
      </div>

      <p
        className={`m-reveal ${cls} mt-5 max-w-[34em] text-[17px] text-[color:var(--m-soft)] [text-wrap:pretty]`}
        style={{ ...delay(180), lineHeight: ja ? 1.9 : 1.75 }}
      >
        {t(`idea.${n}.body`)}
      </p>
    </div>
  );
}
