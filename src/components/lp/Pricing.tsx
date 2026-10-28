"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useT } from "../LangProvider";
import Html from "./Html";
import Plate from "./Plate";
import { bindShortWords, kernHtml, kernWord, splitHeading } from "./typeset";
import { useReveal, usePauseOffscreen } from "./useReveal";
import s from "./Pricing.module.css";

/** the `vai:plan` keys the contact form pre-selects from */
type PlanKey = "lightAds" | "growthAds" | "light" | "growth" | "promo";

/** plate alt text (spec › Images › promo.jpg) */
const PROMO_ALT = {
  en: "A plain white product box with its lid lifted, on a turntable under a spotlight",
  ja: "スポットライトを浴びた回転台の上の、ふたを少し開けた白い箱",
} as const;

/** the promo card is 6/12 columns from 900px and 7/12 from 1100px; the plate sits 8px in from its edges */
const PROMO_SIZES =
  "(min-width: 1240px) 660px, (min-width: 1100px) 54vw, (min-width: 900px) 46vw, calc(100vw - 80px)";

/** stagger delay as a CSS custom property */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
/** a delay counted from the heading's last line (Rise sets --after on the heading's parent) */
const after = (ms: number) => ({ "--d": `calc(var(--after, 320ms) + ${ms}ms)` }) as CSSProperties;

/** JA line breaking inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja */
const JA_BREAK: CSSProperties = { wordBreak: "keep-all", lineBreak: "strict", overflowWrap: "anywhere" };
const JA_KICKER: CSSProperties = { fontSize: 13, letterSpacing: "0.06em", textTransform: "none" };

/* JA H2 keeps the spec's clamp(30px,4.4vw,68px) but steps down on narrow phones until its
   longest <wbr> phrase (「いつでも解約できます。」, 11 characters) fits a 328px column. */
const H2_SIZE = { en: "clamp(40px,5.6vw,88px)", ja: "clamp(26px,max(min(8.2vw,30px),4.4vw),68px)" };
const PRICE_SIZE = "clamp(52px,5.6vw,84px)";
const SPEND_SIZE = "clamp(40px,4.4vw,56px)";

/** Plan CTA: scrolls to the form (SmoothScroll handles the anchor) and pre-selects the plan. */
function PlanCta({
  plan,
  label,
  tone,
  className = "",
}: {
  plan: PlanKey;
  label: string;
  tone: "dark" | "white" | "light";
  className?: string;
}) {
  const { cur } = useT();
  const toneCls = tone === "dark" ? "m-btn--dark" : tone === "white" ? "m-btn--white" : "m-btn--light";
  return (
    <a
      href="#contact"
      onClick={() => window.dispatchEvent(new CustomEvent("vai:plan", { detail: plan }))}
      className={`m-btn ${toneCls} min-h-12 px-4 py-3 text-center sm:px-6 text-base leading-[1.3] !whitespace-normal focus-visible:!rounded-full ${className}`}
    >
      <span className={cur === "ja" ? s.jaLabel : undefined}>{label}</span>
      <svg
        className="m-arrow shrink-0"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/** A price string from the dictionary ("$700", "A$1,000") with the sign as a small superior figure. */
function Money({ str, className = "", style }: { str: string; className?: string; style?: CSSProperties }) {
  const i = Math.max(0, str.search(/\d/));
  return (
    <span className={`tabular ${s.money} ${className}`} style={style}>
      {i > 0 && <span className={`${s.cur} ${i > 1 ? s.curWide : ""}`}>{str.slice(0, i)}</span>}
      {str.slice(i)}
    </span>
  );
}

/** "From $500/mo" / "月A$500から" → the words around the amount, and the amount */
function splitAmount(str: string) {
  const m = /A?\$[\d,]+/.exec(str);
  if (!m) return { before: "", amount: str, rest: "" };
  return { before: str.slice(0, m.index).trim(), amount: m[0], rest: str.slice(m.index + m[0].length).trim() };
}

/** "With $500 ad spend: $1,200 a month in total (…)" → lead (with its colon) and the total */
function splitLead(str: string) {
  const m = /[:：]\s*/.exec(str);
  return m ? { lead: str.slice(0, m.index + 1), total: str.slice(m.index + m[0].length) } : { lead: "", total: str };
}

export default function Pricing() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const head = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  usePauseOffscreen(stageRef);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative bg-[#F4F5F6]">
      <div className="mx-auto max-w-[1240px] px-4 pt-24 sm:px-8">
        {/* ---- header ---- */}
        <div ref={head.ref}>
          <p className={`m-kicker m-reveal ${head.cls}`} style={ja ? { ...delay(0), ...JA_KICKER } : delay(0)}>
            {t("pr.kicker")}
          </p>
          <Rise
            as="h2"
            id="pricing-title"
            html={t("pr.title")}
            cls={head.cls}
            className="m-display m-jp-break mt-6 text-[color:var(--m-ink)]"
            style={{
              fontSize: H2_SIZE[cur],
              lineHeight: ja ? 1.25 : 1.0,
              letterSpacing: ja ? "-0.02em" : "-0.04em",
              ...(ja ? JA_BREAK : {}),
            }}
          />
          <p
            className={`m-body m-reveal ${head.cls} mt-6 max-w-[40em] ${ja ? "text-[17px]" : "text-base"} text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:mt-8`}
            style={{ ...after(0), lineHeight: ja ? 1.9 : 1.7 }}
          >
            {t("pr.sub")}
          </p>
        </div>

        {/* ---- main group: Videos + Meta ads. The cards sit above the stage (z-2); the stage slides
            up under their lower halves, so each card shows the white→black edge through its body ---- */}
        <div className="mt-16 min-[900px]:mt-24">
          <GroupLabel />

          {/* Growth + Ads leads in the DOM, so phones read and tab it first as they show it; from
              900px both cards are placed in row 1, Light | Growth. The dark card stands 48px
              taller (its Recommended row), so names, prices and CTAs line up across the pair. */}
          <div className="relative z-[2] mt-6 grid gap-5 min-[900px]:mt-8 min-[900px]:grid-cols-2 min-[900px]:gap-8">
            <PlanCard kind="ga" />
            <PlanCard kind="la" />
          </div>
        </div>
      </div>

      {/* ---- the stage: near-black, under the plans' lower halves and behind "Both plans include".
          data-theme="dark": the Nav turns smoke and the MobileBar milk over it ---- */}
      <div ref={stageRef} data-theme="dark" className="m-stage">
        <div className="m-stage-bg" aria-hidden="true">
          <div className="m-stage-spill" />
          <div className="m-stage-beams" />
        </div>
        {/* inner gutters = page gutters minus the stage's 8/12px inset, so Included lines up with the plans */}
        <div className="relative mx-auto max-w-[1216px] px-2 sm:px-6 min-[900px]:px-6">
          <Included />
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 pb-24 pt-12 sm:px-8 min-[900px]:pt-16">
        <Spend />

        {/* ---- secondary: videos only (1–5) and one-off promos (6–12) ---- */}
        <div className="mt-20 grid gap-6 min-[900px]:mt-24 min-[900px]:grid-cols-12 min-[900px]:items-start min-[900px]:gap-8">
          <VideosOnly />
          <Promo />
        </div>

        <FootNote />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */

/** "Videos + Meta ads" with its small ink-outline badge */
function GroupLabel() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`m-reveal ${cls} flex flex-wrap items-center gap-x-3 gap-y-2`}>
      <h3
        className={`text-xl font-bold leading-[1.3] tracking-[-0.01em] text-[color:var(--m-ink)] ${ja ? s.jaLabel : ""}`}
      >
        {t("pr.main.label")}
      </h3>
      <span
        className={`inline-flex h-6 items-center rounded-full border border-[color:var(--m-ink)] px-2 font-semibold leading-none text-[color:var(--m-ink)] ${
          ja ? "text-xs tracking-[0.04em]" : "text-xs uppercase tracking-[0.12em]"
        }`}
      >
        {t("pr.main.badge")}
      </span>
    </div>
  );
}

/** One main plan card: Light + Ads (light glass) or Growth + Ads (dark glass, Recommended). */
function PlanCard({ kind }: { kind: "la" | "ga" }) {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLElement>(0.15);
  const dark = kind === "ga";
  const nameId = `pr-${kind}-name`;
  const { lead, total } = splitLead(t(`pr.${kind}.total`));

  const mute = dark ? "text-[color:var(--m-dark-mute)]" : "text-[color:var(--m-mute)]";

  return (
    <article
      ref={ref}
      aria-labelledby={nameId}
      // dark tokens (white focus ring, light kicker) inside this card; the nav also turns dark over it
      data-theme={dark ? "dark" : undefined}
      className={`m-reveal ${cls} flex flex-col rounded-4xl px-6 py-8 sm:p-8 min-[900px]:p-10 ${
        dark
          ? `m-glass-dark ${s.lag} min-[900px]:col-start-2 min-[900px]:row-start-1`
          : "m-glass m-glass--thick min-[900px]:col-start-1 min-[900px]:row-start-1 min-[900px]:mt-12"
      }`}
    >
      <h4
        id={nameId}
        className={`${ja ? "text-[15px]" : "text-sm"} font-semibold leading-[1.4] ${dark ? "text-white" : "text-[color:var(--m-ink)]"}`}
      >
        {t(`pr.${kind}.name`)}
      </h4>

      {/* after the name in the DOM (the heading stays first), shown above it: 28px + 20px = the 48px step */}
      {dark && (
        <p
          className={`order-first mb-4 inline-flex h-7 items-center self-start rounded-full bg-white px-3 font-bold leading-none text-[color:var(--m-ink)] shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)] ${
            ja ? "text-xs tracking-[0.04em]" : "text-xs uppercase tracking-[0.12em]"
          }`}
        >
          {t("pr.ga.badge")}
        </p>
      )}

      <p className="mt-3 flex flex-wrap items-baseline gap-x-2 min-[900px]:mt-4">
        <Money
          str={t(`pr.${kind}.price`)}
          className={`font-bold ${dark ? "text-white" : "text-[color:var(--m-ink)]"}`}
          style={{ fontSize: PRICE_SIZE, lineHeight: 0.95, letterSpacing: "-0.045em" }}
        />
        <span className={`text-lg font-semibold ${mute}`}>{t("pr.per")}</span>
      </p>

      <p
        className={`mt-4 ${ja ? "text-[17px]" : "text-base"} font-medium [text-wrap:pretty] ${dark ? "text-white" : "text-[color:var(--m-ink)]"}`}
        style={{ lineHeight: ja ? 1.7 : 1.45 }}
      >
        {t(`pr.${kind}.tag`)}
      </p>
      <p className={`tabular mt-2 text-sm ${mute}`} style={{ lineHeight: ja ? 1.7 : 1.5 }}>
        {t(`pr.${kind}.split`)}
      </p>

      <p
        className={`mt-6 border-t pt-6 ${ja ? "text-[15px]" : "text-sm"} [text-wrap:pretty] ${
          dark ? "border-white/[0.12] text-[color:var(--m-dark-body)]" : "border-[color:var(--m-line)] text-[color:var(--m-soft)]"
        }`}
        style={{ lineHeight: ja ? 1.9 : 1.65 }}
      >
        {t(dark ? "pr.ga.why" : "pr.la.fit")}
      </p>

      {/* total + CTA sit on the card's floor, so both pairs align whatever the copy above runs to */}
      <div className="mt-auto pt-8">
        <p
          className={`tabular rounded-xl px-4 py-3 ${ja ? "text-[15px]" : "text-sm"} font-semibold [text-wrap:pretty] ${
            dark
              ? "bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-[rgba(20,24,28,0.05)] text-[color:var(--m-ink)] shadow-[inset_0_1px_2px_rgba(20,24,28,0.08)]"
          }`}
          style={{ lineHeight: ja ? 1.75 : 1.5 }}
        >
          {lead && <span className={`block font-medium ${dark ? "text-[color:var(--m-dark-body)]" : "text-[color:var(--m-soft)]"}`}>{lead}</span>}
          <span className="block">{total}</span>
        </p>
        <PlanCta
          plan={dark ? "growthAds" : "lightAds"}
          label={t(`pr.${kind}.cta`)}
          tone={dark ? "white" : "dark"}
          className="mt-4 w-full"
        />
      </div>
    </article>
  );
}

/** "Both plans include": Videos and Ads, side by side from 640px, then what is not included */
function Included() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>();
  const videos = ["v1", "v2", "v3", "v4"].map((k) => t(`pr.incl.${k}`));
  const ads = ["a1", "a2", "a3", "a4", "a5"].map((k) => t(`pr.incl.${k}`));

  return (
    <>
      <div
        ref={ref}
        className={`m-glass-clear m-reveal ${cls} rounded-4xl px-6 py-8 sm:p-8 min-[900px]:p-10`}
      >
        <h4
          className={`text-xl font-bold leading-[1.3] tracking-[-0.01em] text-white ${
            ja ? s.jaLabel : ""
          }`}
        >
          {t("pr.incl.title")}
        </h4>
        <div className="mt-8 grid gap-y-8 min-[640px]:grid-cols-2 min-[640px]:gap-x-10 min-[1100px]:gap-x-12">
          <IncludedList title={t("pr.incl.videos")} items={videos} lead={150} />
          <IncludedList title={t("pr.incl.ads")} items={ads} lead={270} />
        </div>
        {/* the one promise the plans can make, right where the price is weighed (FAQ 3 says the rest) */}
        <p
          className={`mt-8 max-w-[40em] border-t border-white/[0.12] pt-6 ${
            ja ? "text-[15px]" : "text-sm"
          } text-[color:var(--m-dark-body)] [text-wrap:pretty]`}
          style={{ ...delay(420), lineHeight: ja ? 1.9 : 1.65 }}
        >
          {t("pr.incl.promise")}
        </p>
      </div>
      {/* under the card, inset to its text column; revealed with it */}
      <p
        className={`m-reveal ${cls} mt-4 max-w-[48em] px-6 text-sm text-[color:var(--m-dark-mute)] [text-wrap:pretty] sm:px-8 min-[900px]:px-10`}
        style={{ ...delay(200), lineHeight: ja ? 1.8 : 1.6 }}
      >
        {t("pr.incl.not")}
      </p>
    </>
  );
}

function IncludedList({ title, items, lead }: { title: string; items: string[]; lead: number }) {
  const { cur } = useT();
  const ja = cur === "ja";
  return (
    <div>
      <h5
        className={`font-bold text-[color:var(--m-dark-mute)] ${
          ja ? "text-[13px] tracking-[0.06em]" : "text-xs uppercase tracking-[0.14em]"
        }`}
      >
        {title}
      </h5>
      <ul className={`${s.rows} mt-4`}>
        {items.map((item, i) => (
          <li
            key={i}
            className="py-3 text-base font-medium text-white [text-wrap:pretty]"
            style={{ ...delay(lead + i * 60), lineHeight: ja ? 1.7 : 1.5 }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Ad spend is separate: the argument (1–7) and the recommended amount (9–12), ink rule on the left. */
function Spend() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>();
  const v = splitAmount(t("pr.spend.rec.value"));

  return (
    <div
      ref={ref}
      className={`m-glass m-reveal ${cls} rounded-4xl px-6 py-8 sm:p-8 min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8 min-[900px]:p-10 min-[1100px]:px-12`}
    >

      <div className="min-[900px]:col-span-7">
        {/* Html renders the <wbr> hints and the kerned stops (it has no h4 option, so it fills the heading as a span) */}
        <h4
          className={`font-bold text-[color:var(--m-ink)] [text-wrap:balance] ${ja ? "text-[22px] sm:text-[24px] min-[900px]:text-[26px]" : "text-xl sm:text-2xl"} ${
            ja ? s.jaHead : ""
          }`}
          style={{ lineHeight: ja ? 1.5 : 1.2, letterSpacing: ja ? "-0.01em" : "-0.02em" }}
        >
          <Html html={kernHtml(bindShortWords(t("pr.spend.title")))} />
        </h4>
        <p
          className="mt-4 max-w-[38em] text-base text-[color:var(--m-soft)] [text-wrap:pretty]"
          style={{ lineHeight: ja ? 1.9 : 1.7 }}
        >
          {t("pr.spend.body1")}
        </p>
        <p
          className="mt-4 max-w-[38em] text-base text-[color:var(--m-soft)] [text-wrap:pretty]"
          style={{ lineHeight: ja ? 1.9 : 1.7 }}
        >
          {t("pr.spend.body2")}
        </p>
      </div>

      <div className="mt-8 border-t border-[color:var(--m-line)] pt-6 min-[900px]:col-span-4 min-[900px]:col-start-9 min-[900px]:mt-0 min-[900px]:border-t-0 min-[900px]:pt-2">
        <p className="m-kicker" style={ja ? JA_KICKER : undefined}>
          {t("pr.spend.rec.label")}
        </p>
        <p className="mt-3 text-[color:var(--m-ink)]">
          {v.before && (
            <span className={`text-lg font-semibold text-[color:var(--m-soft)] ${ja ? "mr-1" : "mr-2"}`}>{v.before}</span>
          )}
          <Money
            str={v.amount}
            className="font-bold"
            style={{ fontSize: SPEND_SIZE, lineHeight: 1, letterSpacing: "-0.04em" }}
          />
          {v.rest && (
            <span
              className={`text-lg font-semibold text-[color:var(--m-mute)] ${v.rest.startsWith("/") ? "ml-1" : "ml-2"}`}
            >
              {v.rest}
            </span>
          )}
        </p>
        <p className="mt-3 max-w-[24em] text-sm text-[color:var(--m-mute)] [text-wrap:pretty]" style={{ lineHeight: ja ? 1.8 : 1.6 }}>
          {t("pr.spend.rec.note")}
        </p>
      </div>
    </div>
  );
}

/** Videos only: two plan rows, the per-video note, one light CTA. Sticks beside the taller promo card. */
function VideosOnly() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      className={`m-glass m-reveal ${cls} flex flex-col rounded-4xl px-6 py-8 sm:p-8 min-[900px]:sticky min-[900px]:top-28 min-[900px]:col-span-6 min-[1100px]:col-span-5 min-[1100px]:p-10`}
    >
      <h3
        className={`text-xl font-bold leading-[1.3] tracking-[-0.01em] text-[color:var(--m-ink)] ${ja ? s.jaLabel : ""}`}
      >
        {t("pr.vo.label")}
      </h3>
      <p
        className={`mt-3 ${ja ? "text-[15px]" : "text-sm"} text-[color:var(--m-soft)] [text-wrap:pretty]`}
        style={{ lineHeight: ja ? 1.9 : 1.65 }}
      >
        {t("pr.vo.sub")}
      </p>

      <ul className={`${s.rows} ${s.closed} mt-6`}>
        {(["light", "growth"] as const).map((k, i) => (
          <li
            key={k}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-4"
            style={delay(150 + i * 60)}
          >
            <div>
              <p className={`${ja ? "text-[17px]" : "text-base"} font-semibold leading-[1.35] text-[color:var(--m-ink)]`}>{t(`pr.vo.${k}.name`)}</p>
              <p
                className={`mt-1 ${ja ? "text-[15px]" : "text-sm"} text-[color:var(--m-soft)] [text-wrap:pretty]`}
                style={{ lineHeight: ja ? 1.75 : 1.5 }}
              >
                {t(`pr.vo.${k}.tag`)}
              </p>
            </div>
            <p className="whitespace-nowrap text-[color:var(--m-ink)]">
              <Money
                str={t(`pr.vo.${k}.price`)}
                className="text-3xl font-bold leading-none tracking-[-0.035em]"
              />
              <span className="ml-1 text-sm font-semibold text-[color:var(--m-mute)]">{t("pr.per")}</span>
            </p>
          </li>
        ))}
      </ul>

      <p className="tabular mt-4 text-sm text-[color:var(--m-mute)]" style={{ lineHeight: ja ? 1.8 : 1.6 }}>
        {t("pr.vo.unit")}
      </p>
      {/* one CTA for the pair: it pre-selects Light, and the form lets them switch to Growth */}
      <PlanCta
        plan="light"
        label={t("pr.vo.cta")}
        tone="light"
        className="mt-6 w-full min-[560px]:w-auto min-[560px]:self-start"
      />
    </div>
  );
}

/** One-off promo videos: the plate (from 768px), three priced rows, the note, one light CTA. */
function Promo() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLDivElement>(0.1);

  return (
    <div
      ref={ref}
      className={`m-glass m-reveal ${cls} ${s.lag} rounded-4xl min-[900px]:col-span-6 min-[1100px]:col-span-7`}
    >
      {/* below 768px the plate is not shown, so this card stays lighter than the main plans */}
      <div className={`${s.promoPlate} hidden p-2 pb-0 min-[768px]:block`}>
        <Plate
          img="promo"
          alt={PROMO_ALT[cur]}
          l1={t("pr.promo.plate.l1")}
          l2={t("pr.promo.plate.l2")}
          ratio="16 / 9"
          sizes={PROMO_SIZES}
        />
      </div>

      <div className="flex flex-col px-6 py-8 sm:p-8 min-[1100px]:p-10">
        <h3
          className={`text-xl font-bold leading-[1.3] tracking-[-0.01em] text-[color:var(--m-ink)] ${
            ja ? s.jaLabel : ""
          }`}
        >
          {t("pr.promo.label")}
        </h3>
        <p
          className={`mt-3 max-w-[36em] ${ja ? "text-[15px]" : "text-sm"} text-[color:var(--m-soft)] [text-wrap:pretty]`}
          style={{ lineHeight: ja ? 1.9 : 1.65 }}
        >
          {t("pr.promo.sub")}
        </p>

        <ul className={`${s.rows} ${s.closed} mt-6`}>
          {([1, 2, 3] as const).map((n, i) => (
            <li
              key={n}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-4"
              style={delay(150 + i * 60)}
            >
              <div>
                <p className={`${ja ? "text-[17px]" : "text-base"} font-semibold leading-[1.35] text-[color:var(--m-ink)]`}>
                  {t(`pr.promo.${n}.name`)}
                </p>
                <p
                  className={`mt-1 ${ja ? "text-[15px]" : "text-sm"} text-[color:var(--m-soft)] [text-wrap:pretty]`}
                  style={{ lineHeight: ja ? 1.75 : 1.5 }}
                >
                  {t(`pr.promo.${n}.desc`)}
                </p>
              </div>
              <Money
                str={t(`pr.promo.${n}.price`)}
                className="text-right text-2xl font-bold leading-none tracking-[-0.035em] text-[color:var(--m-ink)]"
              />
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-[color:var(--m-mute)] [text-wrap:pretty]" style={{ lineHeight: ja ? 1.8 : 1.6 }}>
          {t("pr.promo.note")}
        </p>
        <PlanCta
          plan="promo"
          label={t("pr.promo.cta")}
          tone="light"
          className="mt-6 w-full min-[560px]:w-auto min-[560px]:self-start"
        />
      </div>
    </div>
  );
}

function FootNote() {
  const { t, cur } = useT();
  const { ref, cls } = useReveal<HTMLParagraphElement>();
  return (
    <p
      ref={ref}
      className={`m-reveal ${cls} mx-auto mt-12 max-w-[44em] text-center ${cur === "ja" ? "text-[13px]" : "text-xs"} text-[color:var(--m-mute)] [text-wrap:balance] min-[900px]:mt-16`}
      style={{ lineHeight: cur === "ja" ? 1.8 : 1.6 }}
    >
      {t("pr.foot")}
    </p>
  );
}

/* ------------------------------------------------------------------------- */

/**
 * A heading whose rendered lines rise from behind a mask, 80ms apart. Each word (EN) or
 * phrase (JA) is its own mask, so the heading keeps its natural, balanced wrapping; the
 * effect finds the line each mask landed on and sets its delay, and publishes the end of
 * the last line as --after on the parent so the copy below can follow it.
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
