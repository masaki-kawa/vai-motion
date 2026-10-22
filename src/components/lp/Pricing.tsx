"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useT } from "../LangProvider";
import Html from "./Html";
import Plate from "./Plate";
import { useReveal } from "./useReveal";
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
  const toneCls = tone === "dark" ? "m-btn--dark m-rim-dark" : tone === "white" ? "m-btn--white" : "m-btn--light";
  return (
    <a
      href="#contact"
      onClick={() => window.dispatchEvent(new CustomEvent("vai:plan", { detail: plan }))}
      className={`m-btn ${toneCls} min-h-[54px] px-5 py-3 text-center sm:px-7 text-[15px] leading-[1.3] !whitespace-normal focus-visible:!rounded-full ${className}`}
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

/** JA panel title: 「Metaへ直接お支払いいただきます。」 is wider than a phone column, so it needs a
 *  second break hint after 「直接」 (requested for the dictionary; a no-op once it is there). */
function spendTitleJa(html: string) {
  return html.replace(/直接(?!<wbr)お/, "直接<wbr>お");
}

export default function Pricing() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const head = useReveal<HTMLDivElement>();

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative bg-[#F4F5F6]">
      <div className="mx-auto max-w-[1240px] px-4 py-24 sm:px-8 min-[900px]:py-[160px]">
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
            className="m-display m-jp-break mt-5 text-[color:var(--m-ink)] min-[900px]:mt-6"
            style={{
              fontSize: H2_SIZE[cur],
              lineHeight: ja ? 1.25 : 1.0,
              letterSpacing: ja ? "-0.02em" : "-0.04em",
              ...(ja ? JA_BREAK : {}),
            }}
          />
          <p
            className={`m-body m-reveal ${head.cls} mt-6 max-w-[40em] text-[17px] text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:mt-8`}
            style={{ ...after(0), lineHeight: ja ? 1.9 : 1.7 }}
          >
            {t("pr.sub")}
          </p>
        </div>

        {/* ---- main group: Videos + Meta ads ---- */}
        <div className="mt-16 min-[900px]:mt-24">
          <GroupLabel />

          {/* Light | Growth on desktop; Growth + Ads leads on phones. The dark card stands 48px
              taller (its Recommended row), so names, prices and CTAs line up across the pair. */}
          <div className="mt-6 grid gap-5 min-[900px]:mt-8 min-[900px]:grid-cols-2 min-[900px]:gap-8">
            <PlanCard kind="la" />
            <PlanCard kind="ga" />
          </div>

          <Included />
          <Spend />
        </div>

        {/* ---- secondary: videos only (1–5) and one-off promos (6–12) ---- */}
        <div className="mt-20 grid gap-5 min-[900px]:mt-[120px] min-[900px]:grid-cols-12 min-[900px]:items-start min-[900px]:gap-8">
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
        className={`text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-[color:var(--m-ink)] ${ja ? s.jaLabel : ""}`}
      >
        {t("pr.main.label")}
      </h3>
      <span
        className={`inline-flex h-6 items-center rounded-full border border-[color:var(--m-ink)] px-2.5 font-semibold leading-none text-[color:var(--m-ink)] ${
          ja ? "text-[12px] tracking-[0.04em]" : "text-[11px] uppercase tracking-[0.12em]"
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
      // dark tokens (white focus ring, light kicker) inside this card only; the nav reads sections
      data-theme={dark ? "dark" : undefined}
      className={`m-reveal ${cls} flex flex-col rounded-[32px] px-5 py-8 sm:p-8 min-[900px]:p-10 ${
        dark
          ? `m-glass-dark m-rim-dark ${s.dark} ${s.lag} order-first min-[900px]:order-none`
          : "m-glass m-rim min-[900px]:mt-12"
      }`}
    >
      <h4
        id={nameId}
        className={`text-[15px] font-semibold leading-[1.4] ${dark ? "text-white" : "text-[color:var(--m-ink)]"}`}
      >
        {t(`pr.${kind}.name`)}
      </h4>

      {/* after the name in the DOM (the heading stays first), shown above it: 28px + 20px = the 48px step */}
      {dark && (
        <p
          className={`order-first mb-5 inline-flex h-7 items-center self-start rounded-full bg-white px-3 font-bold leading-none text-[color:var(--m-ink)] shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)] ${
            ja ? "text-[12px] tracking-[0.04em]" : "text-[11px] uppercase tracking-[0.12em]"
          }`}
        >
          {t("pr.ga.badge")}
        </p>
      )}

      <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 min-[900px]:mt-4">
        <Money
          str={t(`pr.${kind}.price`)}
          className={`font-extrabold ${dark ? "text-white" : "text-[color:var(--m-ink)]"}`}
          style={{ fontSize: PRICE_SIZE, lineHeight: 0.95, letterSpacing: "-0.045em" }}
        />
        <span className={`text-[18px] font-semibold ${mute}`}>{t("pr.per")}</span>
      </p>

      <p
        className={`mt-5 text-[17px] font-medium [text-wrap:pretty] ${dark ? "text-white" : "text-[color:var(--m-ink)]"}`}
        style={{ lineHeight: ja ? 1.7 : 1.45 }}
      >
        {t(`pr.${kind}.tag`)}
      </p>
      <p className={`tabular mt-1.5 text-[14px] ${mute}`} style={{ lineHeight: ja ? 1.7 : 1.5 }}>
        {t(`pr.${kind}.split`)}
      </p>

      <p
        className={`mt-7 border-t pt-6 text-[15px] [text-wrap:pretty] ${
          dark ? "border-white/[0.12] text-[color:var(--m-dark-body)]" : "border-[color:var(--m-line)] text-[color:var(--m-soft)]"
        }`}
        style={{ lineHeight: ja ? 1.9 : 1.65 }}
      >
        {t(dark ? "pr.ga.why" : "pr.la.fit")}
      </p>

      {/* total + CTA sit on the card's floor, so both pairs align whatever the copy above runs to */}
      <div className="mt-auto pt-8">
        <p
          className={`tabular rounded-[14px] px-4 py-3.5 text-[15px] font-semibold [text-wrap:pretty] ${
            dark ? "bg-white/[0.08] text-white" : "bg-[#F4F5F6] text-[color:var(--m-ink)]"
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

/** "Both plans include": Videos and Ads, side by side from 640px */
function Included() {
  const { t, cur } = useT();
  const { ref, cls } = useReveal<HTMLDivElement>();
  const videos = ["v1", "v2", "v3", "v4"].map((k) => t(`pr.incl.${k}`));
  const ads = ["a1", "a2", "a3", "a4", "a5"].map((k) => t(`pr.incl.${k}`));

  return (
    <div
      ref={ref}
      className={`m-glass m-rim m-reveal ${cls} mt-5 rounded-[32px] px-5 py-8 sm:p-8 min-[900px]:mt-8 min-[900px]:p-10`}
    >
      <h4
        className={`text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-[color:var(--m-ink)] ${
          cur === "ja" ? s.jaLabel : ""
        }`}
      >
        {t("pr.incl.title")}
      </h4>
      <div className="mt-7 grid gap-y-9 min-[640px]:grid-cols-2 min-[640px]:gap-x-10 min-[900px]:mt-8 min-[1100px]:gap-x-14">
        <IncludedList title={t("pr.incl.videos")} items={videos} lead={150} />
        <IncludedList title={t("pr.incl.ads")} items={ads} lead={270} />
      </div>
    </div>
  );
}

function IncludedList({ title, items, lead }: { title: string; items: string[]; lead: number }) {
  const { cur } = useT();
  const ja = cur === "ja";
  return (
    <div>
      <h5
        className={`font-bold text-[color:var(--m-ink)] ${
          ja ? "text-[13px] tracking-[0.06em]" : "text-[12px] uppercase tracking-[0.14em]"
        }`}
      >
        {title}
      </h5>
      <ul className={`${s.rows} mt-4`}>
        {items.map((item, i) => (
          <li
            key={i}
            className="py-[14px] text-[16px] font-medium text-[color:var(--m-ink)] [text-wrap:pretty]"
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
      className={`m-glass m-rim m-reveal ${cls} mt-5 rounded-[32px] px-6 py-8 sm:p-8 min-[900px]:mt-8 min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8 min-[900px]:p-10 min-[1100px]:px-12`}
    >
      <span aria-hidden="true" className={s.rule} />

      <div className="min-[900px]:col-span-7">
        {/* Html renders the <wbr> hint (it has no h4 option, so it fills the heading as a span) */}
        <h4
          className={`font-bold text-[color:var(--m-ink)] [text-wrap:balance] text-[22px] sm:text-[24px] min-[900px]:text-[26px] ${
            ja ? s.jaHead : ""
          }`}
          style={{ lineHeight: ja ? 1.5 : 1.2, letterSpacing: ja ? "-0.01em" : "-0.02em" }}
        >
          <Html html={ja ? spendTitleJa(t("pr.spend.title")) : t("pr.spend.title")} />
        </h4>
        <p
          className="mt-5 max-w-[38em] text-[16px] text-[color:var(--m-soft)] [text-wrap:pretty]"
          style={{ lineHeight: ja ? 1.9 : 1.7 }}
        >
          {t("pr.spend.body1")}
        </p>
        <p
          className="mt-4 max-w-[38em] text-[16px] text-[color:var(--m-soft)] [text-wrap:pretty]"
          style={{ lineHeight: ja ? 1.9 : 1.7 }}
        >
          {t("pr.spend.body2")}
        </p>
      </div>

      <div className="mt-8 border-t border-[color:var(--m-line)] pt-7 min-[900px]:col-span-4 min-[900px]:col-start-9 min-[900px]:mt-0 min-[900px]:border-t-0 min-[900px]:pt-1.5">
        <p className="m-kicker" style={ja ? JA_KICKER : undefined}>
          {t("pr.spend.rec.label")}
        </p>
        <p className="mt-3 text-[color:var(--m-ink)]">
          {v.before && (
            <span className={`text-[18px] font-semibold text-[color:var(--m-soft)] ${ja ? "mr-1" : "mr-2"}`}>{v.before}</span>
          )}
          <Money
            str={v.amount}
            className="font-extrabold"
            style={{ fontSize: SPEND_SIZE, lineHeight: 1, letterSpacing: "-0.04em" }}
          />
          {v.rest && (
            <span
              className={`text-[18px] font-semibold text-[color:var(--m-mute)] ${v.rest.startsWith("/") ? "ml-1" : "ml-1.5"}`}
            >
              {v.rest}
            </span>
          )}
        </p>
        <p className="mt-3 max-w-[24em] text-[14px] text-[color:var(--m-mute)]" style={{ lineHeight: ja ? 1.8 : 1.6 }}>
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
      className={`m-glass m-rim m-reveal ${cls} flex flex-col rounded-[32px] px-5 py-8 sm:p-8 min-[900px]:sticky min-[900px]:top-28 min-[900px]:col-span-6 min-[1100px]:col-span-5 min-[1100px]:p-10`}
    >
      <h3
        className={`text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-[color:var(--m-ink)] ${ja ? s.jaLabel : ""}`}
      >
        {t("pr.vo.label")}
      </h3>
      <p
        className="mt-3 text-[15px] text-[color:var(--m-soft)] [text-wrap:pretty]"
        style={{ lineHeight: ja ? 1.9 : 1.65 }}
      >
        {t("pr.vo.sub")}
      </p>

      <ul className={`${s.rows} ${s.closed} mt-6`}>
        {(["light", "growth"] as const).map((k, i) => (
          <li
            key={k}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-5"
            style={delay(150 + i * 60)}
          >
            <div>
              <p className="text-[17px] font-semibold leading-[1.35] text-[color:var(--m-ink)]">{t(`pr.vo.${k}.name`)}</p>
              <p
                className="mt-1 text-[15px] text-[color:var(--m-soft)] [text-wrap:pretty]"
                style={{ lineHeight: ja ? 1.75 : 1.5 }}
              >
                {t(`pr.vo.${k}.tag`)}
              </p>
            </div>
            <p className="whitespace-nowrap text-[color:var(--m-ink)]">
              <Money
                str={t(`pr.vo.${k}.price`)}
                className="text-[32px] font-extrabold leading-none tracking-[-0.035em]"
              />
              <span className="ml-1 text-[14px] font-semibold text-[color:var(--m-mute)]">{t("pr.per")}</span>
            </p>
          </li>
        ))}
      </ul>

      <p className="tabular mt-4 text-[14px] text-[color:var(--m-mute)]" style={{ lineHeight: ja ? 1.8 : 1.6 }}>
        {t("pr.vo.unit")}
      </p>
      {/* one CTA for the pair: it pre-selects Light, and the form lets them switch to Growth */}
      <PlanCta
        plan="light"
        label={t("pr.vo.cta")}
        tone="light"
        className="mt-7 w-full min-[560px]:w-auto min-[560px]:self-start"
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
      className={`m-glass m-rim m-reveal ${cls} ${s.lag} rounded-[32px] min-[900px]:col-span-6 min-[1100px]:col-span-7`}
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

      <div className="flex flex-col px-5 py-8 sm:p-8 min-[1100px]:p-10">
        <h3
          className={`text-[20px] font-bold leading-[1.3] tracking-[-0.01em] text-[color:var(--m-ink)] ${
            ja ? s.jaLabel : ""
          }`}
        >
          {t("pr.promo.label")}
        </h3>
        <p
          className="mt-3 max-w-[36em] text-[15px] text-[color:var(--m-soft)] [text-wrap:pretty]"
          style={{ lineHeight: ja ? 1.9 : 1.65 }}
        >
          {t("pr.promo.sub")}
        </p>

        <ul className={`${s.rows} ${s.closed} mt-6`}>
          {([1, 2, 3] as const).map((n, i) => (
            <li
              key={n}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-5 py-[18px]"
              style={delay(150 + i * 60)}
            >
              <div>
                <p className="text-[17px] font-semibold leading-[1.35] text-[color:var(--m-ink)]">
                  {t(`pr.promo.${n}.name`)}
                </p>
                <p
                  className="mt-1 text-[15px] text-[color:var(--m-soft)] [text-wrap:pretty]"
                  style={{ lineHeight: ja ? 1.75 : 1.5 }}
                >
                  {t(`pr.promo.${n}.desc`)}
                </p>
              </div>
              <Money
                str={t(`pr.promo.${n}.price`)}
                className="text-right text-[28px] font-extrabold leading-none tracking-[-0.035em] text-[color:var(--m-ink)]"
              />
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[14px] text-[color:var(--m-mute)]" style={{ lineHeight: ja ? 1.8 : 1.6 }}>
          {t("pr.promo.note")}
        </p>
        <PlanCta
          plan="promo"
          label={t("pr.promo.cta")}
          tone="light"
          className="mt-7 w-full min-[560px]:w-auto min-[560px]:self-start"
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
      className={`m-reveal ${cls} mx-auto mt-12 max-w-[44em] text-center text-[13px] text-[color:var(--m-mute)] [text-wrap:balance] min-[900px]:mt-16`}
      style={{ lineHeight: cur === "ja" ? 1.8 : 1.6 }}
    >
      {t("pr.foot")}
    </p>
  );
}

/* ------------------------------------------------------------------------- */

type Part = { word: string } | { sep: "wbr" | "space" };

/** Split a heading into masks: words (EN) or <wbr> phrases (JA), keeping the separators.
 *  A one- or two-letter EN word travels with the next one. Returns null when the copy holds
 *  other markup or entities; it then rises as one block. */
function splitHeading(html: string): Part[] | null {
  if (/<(?!wbr\b)[a-z]/i.test(html) || /&[#a-z0-9]+;/i.test(html)) return null;
  const bound = html.replace(/(^|\s)([A-Za-z]{1,2}) +(?=\S)/g, "$1$2 ");
  return bound
    .split(/(<wbr\s*\/?>|[^\S ]+)/i)
    .filter(Boolean)
    .map((p): Part =>
      /^<wbr/i.test(p) ? { sep: "wbr" } : /^[^\S ]+$/.test(p) ? { sep: "space" } : { word: p },
    );
}

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
          <Html html={html} style={delay(80)} />
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
              <span>
                {/* optical kerning: pull a word-final full stop in (EN; JA ends in 「。」) */}
                {p.word.endsWith(".") ? (
                  <>
                    {p.word.slice(0, -1)}
                    <span className={s.stop}>.</span>
                  </>
                ) : (
                  p.word
                )}
              </span>
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
