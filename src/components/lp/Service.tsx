"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useT } from "../LangProvider";
import Html from "./Html";
import Plate from "./Plate";
import { bindShortWords, kernHtml, kernWord, splitHeading } from "./typeset";
import { useReveal } from "./useReveal";
import s from "./Service.module.css";

/** plate alt text (spec › Images › photos.jpg, area.jpg) */
const ALT = {
  photos: {
    en: "Printed photos of food, drinks and products laid out on a table",
    ja: "料理や飲み物、商品の写真のプリントが机に並んでいる様子",
  },
  area: {
    en: "A white scale model of a neighbourhood with one shop and its nearby streets lit",
    ja: "1軒のお店とその周りの通りだけが照らされた、白い街の模型",
  },
} as const;

/** five of twelve columns on desktop (472px at the 1240px container), full width on phones */
const PLATE_SIZES =
  "(min-width: 1240px) 472px, (min-width: 900px) 38vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 32px)";

/** Loop timing: each pill fills for STEP ms, one after another; the return line draws after pill 4. */
const LEAD = 150;
const STEP = 600;
const LINE_AT = LEAD + 4 * STEP;

/** stagger delay as a CSS custom property */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
/** a delay counted from the heading's last line (Rise sets --after on the heading's parent) */
const after = (ms: number) => ({ "--d": `calc(var(--after, 320ms) + ${ms}ms)` }) as CSSProperties;

/** JA line breaking inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja */
const JA_BREAK: CSSProperties = { wordBreak: "keep-all", lineBreak: "strict", overflowWrap: "anywhere" };
const JA_KICKER: CSSProperties = { fontSize: 13, letterSpacing: "0.06em", textTransform: "none" };

/* JA sizes keep the spec's desktop clamps but shrink on narrow phones until the longest
   <wbr> phrase fits the column (H2: 13 characters in 328px at 360px; H3: 11 in the 288px card). */
const H2_SIZE = { en: "clamp(36px,5vw,76px)", ja: "clamp(24px,max(min(6.9vw,30px),4.2vw),64px)" };
const H3_SIZE = { en: "clamp(26px,3vw,44px)", ja: "clamp(22px,max(min(6.6vw,26px),3vw),44px)" };

export default function Service() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const head = useReveal<HTMLDivElement>();

  return (
    <section id="service" aria-labelledby="service-title" className="relative bg-white">
      <div className="mx-auto max-w-[1240px] px-4 pb-24 pt-24 sm:px-8 min-[900px]:pb-[160px] min-[900px]:pt-[160px]">
        {/* ---- header: columns 1–10 ---- */}
        <div ref={head.ref} className="min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8">
          <div className="min-[900px]:col-span-10">
            <p className={`m-kicker m-reveal ${head.cls}`} style={ja ? { ...delay(0), ...JA_KICKER } : delay(0)}>
              {t("svc.kicker")}
            </p>
            <Rise
              as="h2"
              id="service-title"
              html={t("svc.title")}
              cls={head.cls}
              className="m-display m-jp-break mt-5 text-[color:var(--m-ink)] min-[900px]:mt-6"
              style={{
                fontSize: H2_SIZE[cur],
                lineHeight: ja ? 1.25 : 1.02,
                letterSpacing: ja ? "-0.02em" : "-0.04em",
                ...(ja ? JA_BREAK : {}),
              }}
            />
          </div>
        </div>

        {/* ---- Make: plate 1–5, text 7–12 ---- */}
        <Row kind="make" className="mt-14 min-[900px]:mt-24" />

        {/* ---- Ads: text 1–6, plate 8–12 (the plate leads on phones) ---- */}
        <Row kind="ads" className="mt-20 min-[900px]:mt-[120px]" />

        {/* ---- Improve: the loop and an example report ---- */}
        <Improve />

        {/* ---- pull quote ---- */}
        <Quote />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */

/** label, H3, body and four hairline lines beside a plate */
function Row({ kind, className }: { kind: "make" | "ads"; className: string }) {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>();
  const make = kind === "make";
  const img = make ? "photos" : "area";

  return (
    <div
      className={`${className} min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:items-center min-[900px]:gap-x-8`}
    >
      <div
        className={
          make
            ? "min-[900px]:col-span-5 min-[900px]:col-start-1 min-[900px]:row-start-1"
            : "min-[900px]:col-span-5 min-[900px]:col-start-8 min-[900px]:row-start-1"
        }
      >
        <Plate
          img={img}
          alt={ALT[img][cur]}
          l1={t(`svc.${kind}.plate.l1`)}
          l2={t(`svc.${kind}.plate.l2`)}
          ratio="4 / 5"
          mobileRatio="4 / 3"
          sizes={PLATE_SIZES}
          drift={-24}
        />
      </div>

      <div
        ref={ref}
        className={`mt-8 min-[900px]:row-start-1 min-[900px]:mt-0 ${
          make ? "min-[900px]:col-span-6 min-[900px]:col-start-7" : "min-[900px]:col-span-6 min-[900px]:col-start-1"
        }`}
      >
        <Label text={t(`svc.${kind}.label`)} cls={cls} />
        <Rise
          as="h3"
          html={t(`svc.${kind}.title`)}
          cls={cls}
          className="m-jp-break mt-4 font-bold text-[color:var(--m-ink)] [text-wrap:balance] min-[900px]:mt-5"
          style={{
            fontSize: H3_SIZE[cur],
            lineHeight: ja ? 1.45 : 1.1,
            letterSpacing: ja ? "-0.01em" : "-0.03em",
            ...(ja ? JA_BREAK : {}),
          }}
        />
        <p
          className={`m-body m-reveal ${cls} mt-5 max-w-[34em] text-[17px] text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:mt-6`}
          style={{ ...after(0), lineHeight: ja ? 1.9 : 1.7 }}
        >
          {t(`svc.${kind}.body`)}
        </p>
        <ul className={`m-reveal ${cls} mt-8 max-w-[34em] min-[900px]:mt-10`} style={after(110)}>
          {[1, 2, 3, 4].map((n) => (
            <li
              key={n}
              className="border-t border-[color:var(--m-line)] py-[14px] text-[16px] font-medium text-[color:var(--m-ink)] [text-wrap:pretty]"
              style={{ lineHeight: ja ? 1.7 : 1.5 }}
            >
              {t(`svc.${kind}.li${n}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** The Improve card: text 1–6 and the loop 8–12 from 1100px (stacked below that), then the report. */
function Improve() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>();

  return (
    <div className="m-glass mt-20 rounded-[32px] px-5 py-8 sm:p-8 min-[900px]:mt-[120px] min-[900px]:p-14">
      <div className="min-[1100px]:grid min-[1100px]:grid-cols-12 min-[1100px]:items-center min-[1100px]:gap-x-8">
        <div ref={ref} className="min-[1100px]:col-span-6">
          <Label text={t("svc.imp.label")} cls={cls} />
          <Rise
            as="h3"
            html={t("svc.imp.title")}
            cls={cls}
            className="m-jp-break mt-4 font-bold text-[color:var(--m-ink)] [text-wrap:balance] min-[900px]:mt-5"
            style={{
              fontSize: H3_SIZE[cur],
              lineHeight: ja ? 1.45 : 1.1,
              letterSpacing: ja ? "-0.01em" : "-0.03em",
              ...(ja ? JA_BREAK : {}),
            }}
          />
          <p
            className={`m-body m-reveal ${cls} mt-5 max-w-[34em] text-[17px] text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:mt-6`}
            style={{ ...after(0), lineHeight: ja ? 1.9 : 1.7 }}
          >
            {t("svc.imp.body")}
          </p>
        </div>

        <div className="mt-10 min-[900px]:mt-14 min-[1100px]:col-span-5 min-[1100px]:col-start-8 min-[1100px]:mt-0">
          <Loop />
        </div>
      </div>

      <Report />
    </div>
  );
}

/**
 * Four pills joined by down arrows. On reveal each pill fills with ink in order (a clip-path
 * wipe over a duplicate ink layer, so the text turns white exactly at the edge), then the
 * "every month" line draws from pill 4 back up to pill 1. Phones get a text line instead.
 */
function Loop() {
  const { t } = useT();
  const { ref, cls } = useReveal<HTMLDivElement>(0.5);

  return (
    <div ref={ref} className={`${s.loop} ${cls}`}>
      <ol role="list" className={s.stack}>
        {([1, 2, 3, 4] as const).map((n, i) => (
          <li key={n}>
            <div className={s.pill}>
              <span>{t(`svc.loop.${n}`)}</span>
              <span aria-hidden="true" className={s.ink} style={delay(LEAD + i * STEP)}>
                {t(`svc.loop.${n}`)}
              </span>
            </div>
            {n < 4 && (
              <span aria-hidden="true" className={s.down}>
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" focusable="false">
                  <path
                    d="M6 2v15M2 13l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* desktop: the return line. Pill centres sit at y 24 and 264 (4 × 48px pills, 3 × 32px arrows). */}
      <svg
        className={s.ret}
        width="34"
        height="288"
        viewBox="0 0 34 288"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M8 264H20A12 12 0 0 0 32 252V36A12 12 0 0 0 20 24H8L14 18L8 24L14 30"
          pathLength={1}
          stroke="#8A9098"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transitionDelay: `${LINE_AT}ms` }}
        />
      </svg>
      <p className={s.every} style={delay(LINE_AT + 450)}>
        {t("svc.loop.repeat")}
      </p>

      {/* phones: a plain text line under pill 4 */}
      <p className={s.again} style={delay(LINE_AT)}>
        {t("svc.loop.repeat.mobile")}
      </p>
    </div>
  );
}

/** Example report: typeset text only, with the "Example only" note right beside the tag. */
function Report() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLElement>();

  return (
    <figure
      ref={ref}
      className="mt-12 border-t border-[color:var(--m-line)] pt-8 min-[900px]:mt-14 min-[900px]:pt-10"
    >
      <figcaption
        className={`m-reveal ${cls} flex flex-wrap items-baseline gap-x-4 gap-y-1.5`}
        style={delay(0)}
      >
        <span className="m-kicker" style={ja ? JA_KICKER : undefined}>
          {t("svc.report.tag")}
        </span>
        <span className="text-[13px] leading-[1.5] text-[color:var(--m-soft)]">{t("svc.report.note")}</span>
      </figcaption>

      <dl className="mt-6 grid gap-y-7 min-[900px]:mt-8 min-[900px]:grid-cols-3 min-[900px]:gap-x-8">
        {([1, 2, 3] as const).map((n, i) => (
          <div key={n} className={`m-reveal ${cls}`} style={delay(120 + i * 90)}>
            <dt className="text-[13px] font-bold leading-[1.4] text-[color:var(--m-ink)]">
              {t(`svc.report.${n}.k`)}
            </dt>
            <dd
              className="mt-2 max-w-[30em] text-[16px] text-[color:var(--m-soft)] [text-wrap:pretty]"
              style={{ lineHeight: ja ? 1.85 : 1.6 }}
            >
              {t(`svc.report.${n}.v`)}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

/** Pull quote: hairline, label, the quote centred across 2–11 (left-aligned at 22px on phones). */
function Quote() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${s.quote} ${cls} relative mt-20 pt-8 min-[900px]:mt-[120px] min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8 min-[900px]:pt-10`}
    >
      <span aria-hidden="true" className={s.rule} />
      <div className="min-[900px]:col-span-10 min-[900px]:col-start-2 min-[900px]:text-center">
        <p className={`m-kicker m-reveal ${cls}`} style={ja ? { ...delay(100), ...JA_KICKER } : delay(100)}>
          {t("svc.team.label")}
        </p>
        {/* JA breaks only at the copy's <wbr> phrase hints; the brand name stays on one line */}
        <Html
          as="p"
          html={t("svc.team.quote").replace(/VAI MOTION/g, "VAI MOTION")}
          className={`${s.quoteText} ${ja ? `${s.quoteJa} m-jp-break` : ""} m-reveal ${cls} mt-6 font-semibold text-[color:var(--m-ink)] min-[900px]:mt-8`}
          style={{
            ...delay(200),
            lineHeight: ja ? 1.65 : 1.35,
            letterSpacing: ja ? "0" : "-0.015em",
            ...(ja ? JA_BREAK : {}),
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */

/** 12px row label in ink (13px, no caps in JA) */
function Label({ text, cls }: { text: string; cls: string }) {
  const { cur } = useT();
  return (
    <p
      className={`m-reveal ${cls} font-bold text-[color:var(--m-ink)] ${
        cur === "ja" ? "text-[13px] tracking-[0.06em]" : "text-[12px] uppercase tracking-[0.14em]"
      }`}
      style={delay(0)}
    >
      {text}
    </p>
  );
}

/**
 * A heading whose rendered lines rise from behind a mask, 80ms apart. Each word (EN, with
 * one/two-letter words bound to the next and a final "." or "?" kerned) or phrase (JA) is its
 * own mask, so the heading keeps its natural, balanced wrapping; the effect finds the line each
 * mask landed on and sets its delay, and publishes the end of the last line as --after on the
 * parent so the copy below can follow it.
 */
function Rise({
  as: Tag,
  html,
  id,
  cls,
  className,
  style,
}: {
  as: "h2" | "h3";
  html: string;
  id?: string;
  cls: string;
  className: string;
  style: CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const parts = splitHeading(html);
  const text = html.replace(/<[^>]+>/g, "");

  useEffect(() => {
    const h = ref.current;
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
      h.parentElement?.style.setProperty("--after", `${240 + line * 80}ms`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(h);
    document.fonts?.ready.then(measure);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [html]);

  if (!parts) {
    return (
      <Tag ref={ref} id={id} className={`${className} ${cls}`} style={style}>
        <span className="m-line">
          <Html html={kernHtml(bindShortWords(html))} style={delay(80)} />
        </span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} id={id} className={`${s.rise} ${className} ${cls}`} style={style}>
      <span className="sr-only">{text}</span>
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
    </Tag>
  );
}
