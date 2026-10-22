"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useT } from "../LangProvider";
import { DERIVED, PRICING, money } from "@/lib/pricing";
import type { Lang } from "@/lib/i18n";
import Html from "./Html";
import { useReveal } from "./useReveal";
import s from "./Budget.module.css";

/* ---- motion timing (ms) ---- */
const FILL_MS = 900; // each bar fill wipes in over 900ms
const SEG2_LAG = 200; // Row B segment 2 starts 200ms after segment 1
const LABEL_LAG = FILL_MS + 250; // labels fade in 250ms after their fill lands
const COUNT_MS = 900; // the big number counts up 0 → exSpend

/* ---- bar geometry, straight from the pricing constants ---- */
const BUDGET = PRICING.example.budget;
const FEE = DERIVED.lightAds;
const SPEND = DERIVED.exSpend;
/** minmax(0, …) so a label can never push a segment wider than its share of the money */
const COLS_A = `minmax(0,${BUDGET}fr)`;
const COLS_B = `minmax(0,${FEE}fr) minmax(0,${SPEND}fr)`;

/** stagger delay as a CSS custom property */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** JA line breaking inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja */
const JA_BREAK: CSSProperties = { wordBreak: "keep-all", lineBreak: "strict", overflowWrap: "anywhere" };
/** JA prose: wrap at phrase boundaries where the browser can (Chrome), normal breaking elsewhere */
const JA_PHRASE: CSSProperties = { wordBreak: "auto-phrase", overflowWrap: "anywhere" };

/** The H2 split into masks: words (EN) or <wbr> phrases (JA), keeping the separators.
 *  Returns null when the copy holds other markup, which then rises as a single block. */
type TitlePart = { word: string } | { sep: "wbr" | "space" };

function splitTitle(html: string): TitlePart[] | null {
  if (/<(?!wbr\b)[a-z]/i.test(html)) return null;
  // EN: a one- or two-letter word ("a", "of") never ends a line; it travels with the next word
  const bound = html.replace(/(^|\s)([A-Za-z]{1,2}) +(?=\S)/g, "$1$2\u00a0");
  return bound
    .split(/(<wbr\s*\/?>|[^\S\u00a0]+)/i) // whitespace, but not the no-break space just added
    .filter(Boolean)
    .map((p): TitlePart =>
      /^<wbr/i.test(p) ? { sep: "wbr" } : /^[^\S\u00a0]+$/.test(p) ? { sep: "space" } : { word: p },
    );
}

/** "VAI MOTION fee $700 · 4 videos and ad management" → main line + quieter detail line */
function splitSeg(label: string) {
  const m = /\s*[·・]\s*/.exec(label);
  return m ? { main: label.slice(0, m.index), sub: label.slice(m.index + m[0].length) } : { main: label };
}

type Fill = "shoot" | "fee" | "ads";
const FILL_CLS: Record<Fill, string> = { shoot: s.fShoot, fee: s.fFee, ads: s.fAds };
const KEY_CLS: Record<Fill, string> = { shoot: s.kShoot, fee: s.kFee, ads: s.kAds };

type Seg = {
  fill: Fill;
  /** in-bar label (desktop) */
  main: string;
  sub?: string;
  /** legend label and value (phones) */
  legend: string;
  value: number;
  /** fill start delay */
  d: number;
};

export default function Budget() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const head = useReveal<HTMLDivElement>();
  const big = useReveal<HTMLParagraphElement>();

  /* Progressive motion: the server (and a no-JS reader) gets the finished chart and the real
     number. Only once JS runs, motion is allowed and the slab is still below the fold do the
     start states arm, so nothing ever visibly un-draws. Never armed under reduced motion. */
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, []);

  const titleHtml = t("bud.title");
  const parts = splitTitle(titleHtml);
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

  const segA: Seg[] = [
    { fill: "shoot", main: t("bud.a.seg"), legend: t("bud.legend.shoot"), value: BUDGET, d: 0 },
  ];
  const segB: Seg[] = [
    { fill: "fee", ...splitSeg(t("bud.b.seg1")), legend: t("bud.legend.vai"), value: FEE, d: 0 },
    { fill: "ads", ...splitSeg(t("bud.b.seg2")), legend: t("bud.legend.ads"), value: SPEND, d: SEG2_LAG },
  ];

  return (
    <section
      ref={sectionRef}
      id="budget"
      data-theme="dark"
      aria-labelledby="budget-title"
      className={`m-rim-dark relative m-2 rounded-[28px] text-white min-[900px]:m-3 min-[900px]:rounded-[40px] ${s.slab} ${
        armed ? s.armed : ""
      }`}
    >
      <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-[88px] sm:px-8 min-[900px]:pb-[120px] min-[900px]:pt-[140px]">
        {/* ---- header: columns 1–9 ---- */}
        <div ref={head.ref} className={`min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8 ${head.cls}`}>
          <div className="min-[900px]:col-span-9">
            <p
              className={`m-kicker ${s.rise}`}
              // JA metrics inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja
              style={ja ? { ...delay(0), fontSize: 13, letterSpacing: "0.06em", textTransform: "none" } : delay(0)}
            >
              {t("bud.kicker")}
            </p>

            <h2
              ref={titleRef}
              id="budget-title"
              className="m-display m-jp-break mt-5 text-white min-[900px]:mt-6"
              style={{
                fontSize: ja ? "clamp(28px,3.8vw,56px)" : "clamp(34px,4.6vw,68px)",
                lineHeight: ja ? 1.3 : 1.04,
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
                        <span key={i} data-w="" className={s.mask}>
                          {/* optical kerning: pull a heading-final full stop in (EN; JA ends in 「。」) */}
                          {i === parts.length - 1 && /[^.]\.$/.test(p.word) ? (
                            <span>
                              {p.word.slice(0, -1)}
                              <span className={s.stop}>.</span>
                            </span>
                          ) : (
                            <span>{p.word}</span>
                          )}
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
                <span className={s.mask}>
                  <Html html={titleHtml} style={delay(80)} />
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* ---- the big number and its caption: one <p>, so they can never separate ---- */}
        <p ref={big.ref} className={`mt-12 min-[900px]:mt-20 ${s.bigRow}`}>
          <BigNumber to={SPEND} run={big.inView} armed={armed} cur={cur} />
          <span className="sr-only">{`${t("bud.big")} `}</span>
          <span
            className={`max-w-[18em] text-[18px] text-[#C4C8CC] [text-wrap:pretty] min-[900px]:text-[20px] ${s.caption}`}
            style={{ lineHeight: ja ? 1.75 : 1.5, ...(ja ? JA_PHRASE : {}) }}
          >
            {t("bud.big.caption")}
          </span>
        </p>

        {/* ---- the two budget rows, then the shared axis ---- */}
        <div className="mt-16 min-[900px]:mt-24">
          <Row
            label={t("bud.a.label")}
            aria={t("bud.a.aria")}
            cols={COLS_A}
            segs={segA}
            outcome={t("bud.a.outcome")}
            ads={t("bud.a.ads")}
          />
          <div className="mt-12 min-[900px]:mt-16">
            <Row label={t("bud.b.label")} aria={t("bud.b.aria")} cols={COLS_B} segs={segB} outcome={t("bud.b.outcome")} />
          </div>

          <div aria-hidden="true" className="mt-12 min-[900px]:mt-14">
            <div className="h-px bg-[rgba(255,255,255,0.14)]" />
            <div className="tabular mt-3 flex justify-between gap-4 text-[12px] leading-[1.4] text-[#A7ADB3]">
              <span>{t("bud.axis.min")}</span>
              <span>{t("bud.axis.max")}</span>
            </div>
          </div>
        </div>

        {/* always visible, right beside the example */}
        <p
          className="mt-10 max-w-[60em] text-[14px] text-[#A7ADB3] [text-wrap:pretty] min-[900px]:mt-12"
          style={{ lineHeight: ja ? 1.9 : 1.7 }}
        >
          {t("bud.note")}
        </p>
      </div>
    </section>
  );
}

/** The ad-spend number: counts 0 → `to` in rAF once revealed (armed only); otherwise final. */
function BigNumber({ to, run, armed, cur }: { to: number; run: boolean; armed: boolean; cur: Lang }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!armed || !run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = Math.min(1, (now - t0) / COUNT_MS);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, run, to]);

  const shown = armed ? (run ? n : 0) : to;

  return (
    // the final value sits underneath, invisible, so the count never reflows the row
    <span aria-hidden="true" className={`tabular font-extrabold text-white ${s.num}`}>
      <span className={s.ghost}>
        <Amount value={to} cur={cur} />
      </span>
      <span>
        <Amount value={shown} cur={cur} />
      </span>
    </span>
  );
}

/** money() split so the currency sign can sit as a small superior figure beside the digits */
function Amount({ value, cur }: { value: number; cur: Lang }) {
  const str = money(value, cur);
  const i = Math.max(0, str.search(/\d/));
  return (
    <>
      <span className={`${s.cur} ${i > 1 ? s.curWide : ""}`}>{str.slice(0, i)}</span>
      {str.slice(i)}
    </>
  );
}

/** One budget row: label, the split bar (role="img"), the phone legend, and the outcome. */
function Row({
  label,
  aria,
  cols,
  segs,
  outcome,
  ads,
}: {
  label: string;
  aria: string;
  cols: string;
  segs: Seg[];
  outcome: string;
  /** Row A only: "Ad spend: $0", right-aligned under the bar */
  ads?: string;
}) {
  const { cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>();
  const lastLabel = Math.max(...segs.map((g) => g.d)) + LABEL_LAG;

  return (
    <div ref={ref} className={cls}>
      {/* the bar's aria-label already starts with this label */}
      <p
        aria-hidden="true"
        className={`mb-3 font-semibold text-[#A7ADB3] min-[900px]:mb-4 ${
          ja ? "text-[13px] tracking-[0.06em]" : "text-[12px] uppercase tracking-[0.14em]"
        }`}
        style={{ lineHeight: 1.5 }}
      >
        {label}
      </p>

      <div role="img" aria-label={aria} className={s.track} style={{ gridTemplateColumns: cols }}>
        {segs.map((g) => (
          <div key={g.fill} aria-hidden="true" className={s.seg}>
            {/* fill layer: wipes in with clip-path */}
            <span className={`${s.fill} ${FILL_CLS[g.fill]}`} style={delay(g.d)} />
            {/* label layer: never scaled, fades in after the fill lands (desktop) */}
            <span className={`${s.lab} ${s.later} ${g.fill === "ads" ? s.onLight : ""}`} style={delay(g.d + LABEL_LAG)}>
              <span className={s.main}>{g.main}</span>
              {g.sub ? <span className={s.sub}>{g.sub}</span> : null}
            </span>
          </div>
        ))}
      </div>

      {/* phones: labels move out of the bar into a legend under it */}
      <div
        aria-hidden="true"
        className={`${s.legend} ${ads ? s.legendSplit : ""}`}
        style={ads ? undefined : { gridTemplateColumns: cols }}
      >
        {segs.map((g) => (
          <span key={g.fill} className={`${s.item} ${s.later}`} style={delay(g.d + LABEL_LAG)}>
            <span className={`${s.key} ${KEY_CLS[g.fill]}`} />
            <span className="min-w-0">
              <span className="block">{g.legend}</span>
              <span className={`tabular ${s.value}`}>{money(g.value, cur)}</span>
            </span>
          </span>
        ))}
        {ads ? (
          <span className={`tabular ${s.item} ${s.later}`} style={delay(lastLabel)}>
            {ads}
          </span>
        ) : null}
      </div>

      <div className={`mt-4 min-[900px]:mt-5 ${ads ? s.meta : ""}`}>
        <p
          className="max-w-[46em] text-[16px] text-[#C4C8CC] [text-wrap:pretty] min-[900px]:[text-wrap:balance]"
          style={{ lineHeight: ja ? 1.9 : 1.7, ...(ja ? JA_PHRASE : {}) }}
        >
          {outcome}
        </p>
        {ads ? (
          <span aria-hidden="true" className={`tabular ${s.adsDesk} ${s.later}`} style={delay(lastLabel)}>
            {ads}
          </span>
        ) : null}
      </div>
    </div>
  );
}
