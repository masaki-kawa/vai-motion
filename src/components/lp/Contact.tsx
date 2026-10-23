"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode, type Ref } from "react";
import { useT } from "../LangProvider";
import { bindShortWords, kernHtml, kernWord, splitHeading } from "./typeset";
import { useReveal } from "./useReveal";
import s from "./Contact.module.css";

/* ---- form vocabulary: stable English values, translated labels ---- */

/** the plan keys the form posts, and the `vai:plan` event details it accepts */
const PLAN_KEYS = ["lightAds", "growthAds", "light", "growth", "promo", "undecided"] as const;
type PlanKey = (typeof PLAN_KEYS)[number];
const isPlan = (v: unknown): v is PlanKey => typeof v === "string" && (PLAN_KEYS as readonly string[]).includes(v);

/** industry values (Slack stays readable); labels are ct.ind.1 … ct.ind.7 in this order */
const INDUSTRIES = ["cafe", "japanese", "salon", "retail", "cosmetics", "brand", "other"] as const;

/** ad budget values; labels are ct.budget.1 … ct.budget.4 in this order */
const BUDGETS = ["under500", "500to1000", "over1000", "unsure"] as const;

type Values = {
  plan: "" | PlanKey;
  name: string;
  business: string;
  industry: string;
  email: string;
  social: string;
  ad_budget: string;
  ads_before: "" | "yes" | "no";
  message: string;
};
const EMPTY: Values = {
  plan: "",
  name: "",
  business: "",
  industry: "",
  email: "",
  social: "",
  ad_budget: "",
  ads_before: "",
  message: "",
};

type Status = "idle" | "sending" | "ok" | "err";

/** strings this section needs that the dictionary may not hold yet (the lead adds them to i18n.lp.ts) */
const PENDING: Record<string, { en: string; ja: string }> = {
  "ct.err.name": { en: "Please enter your name.", ja: "お名前をご入力ください。" },
};

/** the same check the API runs */
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** "Instagram or website" is a monthly-service question: not asked for a one-off promo */
const asksHandle = (p: Values["plan"]) => p !== "promo";
/** the ad questions show for the ad plans, "not sure yet" and no choice yet */
const asksAds = (p: Values["plan"]) => p === "" || p === "lightAds" || p === "growthAds" || p === "undecided";

/** JA line breaking inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja */
const JA_BREAK: CSSProperties = { wordBreak: "keep-all", lineBreak: "strict", overflowWrap: "anywhere" };
const JA_KICKER: CSSProperties = { fontSize: 13, letterSpacing: "0.06em", textTransform: "none" };

/* H2 sizes. JA keeps the spec's clamp but caps at 56px instead of 68px: the head column (1–5 of
   a 1240px grid) is 471px at most, and the 8-character phrase 「教えてください。」 must fit it
   whole, or the full stop drops onto a line of its own. */
const H2_SIZE = { en: "clamp(40px,5.6vw,88px)", ja: "clamp(32px,4.4vw,56px)" };

/** stagger delay as a CSS custom property */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
/** a delay counted from the heading's last line (Title sets --title-end on the heading's parent) */
const after = (ms: number) => ({ "--d": `calc(var(--title-end, 160ms) + ${ms}ms)` }) as CSSProperties;

/** bring an element comfortably into view (below the fixed nav) when it is off screen */
function bringIntoView(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  if (r.top >= 96 && r.bottom <= window.innerHeight - 24) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: window.scrollY + r.top - window.innerHeight * 0.3, behavior: reduced ? "instant" : "smooth" });
}

export default function Contact() {
  const { t: tr, cur } = useT();
  const t = (k: string) => {
    const val = tr(k);
    return val === k && PENDING[k] ? PENDING[k][cur] : val;
  };
  const ja = cur === "ja";
  const head = useReveal<HTMLDivElement>();
  /* threshold 0: the card is taller than a phone screen, and a CTA landing on #contact can leave
     only its top edge in view; any fraction must reveal it, or the form stays invisible there */
  const cardIn = useReveal<HTMLDivElement>(0);
  const next = useReveal<HTMLDivElement>();

  const [v, setV] = useState<Values>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errs, setErrs] = useState<{ name?: boolean; email?: boolean }>({});
  /** bumps each time a pricing card pre-selects the plan, replaying the select's ink ring */
  const [flash, setFlash] = useState(0);
  /** the form's height when it was sent: the success panel keeps it, so the card doesn't jump */
  const [stageH, setStageH] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const planRef = useRef<HTMLSelectElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const okTitleRef = useRef<HTMLHeadingElement>(null);
  /** the vai:plan listener reads the current status without re-subscribing */
  const statusRef = useRef<Status>("idle");
  /** set the moment a send starts, so a double click can never post twice */
  const busyRef = useRef(false);
  const focusPlanNext = useRef(false);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((p) => ({ ...p, [k]: val }));

  // A pricing CTA was clicked: pre-select its plan (SmoothScroll scrolls to #contact).
  useEffect(() => {
    const onPlan = (e: Event) => {
      const plan = (e as CustomEvent<unknown>).detail;
      if (!isPlan(plan)) return;
      if (statusRef.current === "ok") {
        // already sent once: open a fresh form for the new choice
        setV({ ...EMPTY, plan });
        setErrs({});
        setStatus("idle");
      } else {
        setV((p) => ({ ...p, plan }));
      }
      setFlash((n) => n + 1);
    };
    window.addEventListener("vai:plan", onPlan);
    return () => window.removeEventListener("vai:plan", onPlan);
  }, []);

  // Focus: the success title once sent; the plan select again after "Send another message".
  useEffect(() => {
    if (status === "ok") {
      const h = okTitleRef.current;
      if (!h) return;
      h.focus({ preventScroll: true });
      bringIntoView(h);
    } else if (status === "idle" && focusPlanNext.current) {
      focusPlanNext.current = false;
      const p = planRef.current;
      if (!p) return;
      p.focus({ preventScroll: true });
      bringIntoView(p);
    }
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busyRef.current) return;

    const bad = { name: !v.name.trim(), email: !isEmail(v.email) };
    setErrs(bad);
    if (bad.name || bad.email) {
      setStatus("idle");
      (bad.name ? nameRef : emailRef).current?.focus();
      return;
    }

    const payload: Record<string, string> = {
      plan: v.plan,
      name: v.name.trim(),
      business: v.business.trim(),
      industry: v.industry,
      email: v.email.trim(),
      message: v.message.trim(),
      lang: cur,
    };
    // fields the form didn't show are not sent at all
    if (asksHandle(v.plan)) payload.social = v.social.trim();
    if (asksAds(v.plan)) {
      payload.ad_budget = v.ad_budget;
      payload.ads_before = v.ads_before;
    }

    busyRef.current = true;
    setStatus("sending");
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !json?.ok) throw new Error(String(res.status));
      setStageH(formRef.current?.offsetHeight ?? 0);
      setStatus("ok");
    } catch {
      setStatus("err");
    } finally {
      window.clearTimeout(timer);
      busyRef.current = false;
    }
  }

  function again() {
    setV(EMPTY);
    setErrs({});
    focusPlanNext.current = true;
    setStatus("idle");
  }

  const done = status === "ok";
  const sending = status === "sending";

  /** "Required" is already conveyed by the input's `required`, so only "Optional" is read out.
      The hidden ", " keeps the accessible name apart ("Plan, Optional"): a plain space between the
      label text and this span gets dropped from the name, and the .tag margin draws the gap. */
  const tag = (required: boolean) => (
    <span className={s.tag} aria-hidden={required || undefined}>
      <span className="sr-only">, </span>
      {t(required ? "ct.required" : "ct.optional")}
    </span>
  );
  const lh = { lineHeight: ja ? 1.9 : 1.7 };
  const jaPhrase = ja ? s.jaPhrase : "";

  return (
    <section id="contact" data-theme="dark" aria-labelledby="contact-title" className={s.section}>
      <div className={`mx-auto max-w-[1240px] px-4 sm:px-8 ${s.inner}`}>
        <div className={s.layout}>
          {/* ---- head: columns 1–5 ---- */}
          <div ref={head.ref} className={s.head}>
            <p className={`m-kicker m-reveal ${head.cls}`} style={ja ? { ...delay(0), ...JA_KICKER } : delay(0)}>
              {t("ct.kicker")}
            </p>
            <Title
              id="contact-title"
              html={t("ct.title")}
              cls={head.cls}
              className="m-display m-jp-break mt-5 text-white min-[900px]:mt-6"
              style={{
                fontSize: H2_SIZE[cur],
                lineHeight: ja ? 1.2 : 1,
                letterSpacing: ja ? "-0.02em" : "-0.04em",
                ...(ja ? JA_BREAK : {}),
              }}
            />
            <p
              className={`m-reveal mt-6 max-w-[27em] text-[17px] text-[#C4C8CC] [text-wrap:pretty] min-[900px]:mt-7 ${jaPhrase} ${head.cls}`}
              style={{ ...lh, ...after(120) }}
            >
              {t("ct.sub")}
            </p>
            <ul role="list" className="mt-8 max-w-[34em] min-[900px]:mt-10">
              {[1, 2, 3].map((n, i) => (
                <li
                  key={n}
                  className={`m-reveal border-t border-[rgba(255,255,255,0.12)] py-[14px] text-[15px] text-white [text-wrap:pretty] ${jaPhrase} ${head.cls}`}
                  style={{ lineHeight: ja ? 1.75 : 1.55, ...after(200 + i * 70) }}
                >
                  {t(`ct.point${n}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* ---- the form card: columns 7–12 ---- */}
          <div ref={cardIn.ref} className={`${s.cardWrap} m-reveal ${cardIn.cls}`} style={delay(120)}>
            <div className={`m-rim ${s.formCard}`}>
              <div
                className={`${s.stage} ${done ? s.stageDone : ""}`}
                style={done && stageH ? ({ "--h": `${stageH}px` } as CSSProperties) : undefined}
              >
                <form
                  ref={formRef}
                  noValidate
                  onSubmit={onSubmit}
                  inert={done}
                  aria-busy={sending || undefined}
                  className={`${s.form} ${done ? s.formOut : ""}`}
                >
                  <div className={s.fields}>
                    {/* plan */}
                    <div className={`${s.field} ${s.full}`}>
                      <label htmlFor="ct-plan" className={s.label}>
                        {t("ct.plan")}
                        {tag(false)}
                      </label>
                      <Select
                        key={flash}
                        id="ct-plan"
                        name="plan"
                        value={v.plan}
                        selRef={planRef}
                        className={flash ? s.flash : ""}
                        onChange={(val) => set("plan", isPlan(val) ? val : "")}
                      >
                        <option value="" disabled hidden>
                          {t("ct.plan.ph")}
                        </option>
                        <optgroup label={t("ct.plan.group.ads")}>
                          <option value="lightAds">{t("ct.plan.lightAds")}</option>
                          <option value="growthAds">{t("ct.plan.growthAds")}</option>
                        </optgroup>
                        <optgroup label={t("ct.plan.group.other")}>
                          <option value="light">{t("ct.plan.light")}</option>
                          <option value="growth">{t("ct.plan.growth")}</option>
                          <option value="promo">{t("ct.plan.promo")}</option>
                        </optgroup>
                        <option value="undecided">{t("ct.plan.undecided")}</option>
                      </Select>
                    </div>

                    {/* name */}
                    <div className={s.field}>
                      <label htmlFor="ct-name" className={s.label}>
                        {t("ct.name")}
                        {tag(true)}
                      </label>
                      <input
                        ref={nameRef}
                        id="ct-name"
                        name="name"
                        type="text"
                        required
                        maxLength={120}
                        autoComplete="name"
                        value={v.name}
                        onChange={(e) => {
                          set("name", e.target.value);
                          if (errs.name && e.target.value.trim()) setErrs((p) => ({ ...p, name: false }));
                        }}
                        aria-invalid={errs.name || undefined}
                        aria-describedby={errs.name ? "ct-name-err" : undefined}
                        className={s.control}
                      />
                      {errs.name ? (
                        <p id="ct-name-err" className={s.fieldErr}>
                          {t("ct.err.name")}
                        </p>
                      ) : null}
                    </div>

                    {/* email */}
                    <div className={s.field}>
                      <label htmlFor="ct-email" className={s.label}>
                        {t("ct.email")}
                        {tag(true)}
                      </label>
                      <input
                        ref={emailRef}
                        id="ct-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={v.email}
                        onChange={(e) => {
                          set("email", e.target.value);
                          if (errs.email && isEmail(e.target.value)) setErrs((p) => ({ ...p, email: false }));
                        }}
                        onBlur={() => {
                          if (v.email.trim() && !isEmail(v.email)) setErrs((p) => ({ ...p, email: true }));
                        }}
                        aria-invalid={errs.email || undefined}
                        aria-describedby={errs.email ? "ct-email-err" : undefined}
                        className={s.control}
                      />
                      {errs.email ? (
                        <p id="ct-email-err" className={s.fieldErr}>
                          {t("ct.err.email")}
                        </p>
                      ) : null}
                    </div>

                    {/* business */}
                    <div className={s.field}>
                      <label htmlFor="ct-business" className={s.label}>
                        {t("ct.biz")}
                        {tag(false)}
                      </label>
                      <input
                        id="ct-business"
                        name="business"
                        type="text"
                        maxLength={160}
                        autoComplete="organization"
                        value={v.business}
                        onChange={(e) => set("business", e.target.value)}
                        className={s.control}
                      />
                    </div>

                    {/* type of business */}
                    <div className={s.field}>
                      <label htmlFor="ct-industry" className={s.label}>
                        {t("ct.ind")}
                        {tag(false)}
                      </label>
                      <Select id="ct-industry" name="industry" value={v.industry} onChange={(val) => set("industry", val)}>
                        <option value="" disabled hidden>
                          {t("ct.ind.ph")}
                        </option>
                        {INDUSTRIES.map((k, i) => (
                          <option key={k} value={k}>
                            {t(`ct.ind.${i + 1}`)}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {/* Instagram or website: not for a one-off promo */}
                    {asksHandle(v.plan) ? (
                      <div className={`${s.field} ${s.full} ${s.enter}`}>
                        <label htmlFor="ct-social" className={s.label}>
                          {t("ct.handle")}
                          {tag(false)}
                        </label>
                        <input
                          id="ct-social"
                          name="social"
                          type="text"
                          maxLength={300}
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          placeholder={t("ct.handle.ph")}
                          value={v.social}
                          onChange={(e) => set("social", e.target.value)}
                          className={s.control}
                        />
                      </div>
                    ) : null}

                    {/* the ad questions: ad plans, "not sure yet" or no plan chosen */}
                    {asksAds(v.plan) ? (
                      <>
                        <div className={`${s.field} ${s.full} ${s.enter}`}>
                          <label htmlFor="ct-budget" className={s.label}>
                            {t("ct.budget")}
                            {tag(false)}
                          </label>
                          <Select
                            id="ct-budget"
                            name="ad_budget"
                            value={v.ad_budget}
                            describedBy="ct-budget-help"
                            onChange={(val) => set("ad_budget", val)}
                          >
                            <option value="" disabled hidden>
                              {t("ct.budget.ph")}
                            </option>
                            {BUDGETS.map((k, i) => (
                              <option key={k} value={k}>
                                {t(`ct.budget.${i + 1}`)}
                              </option>
                            ))}
                          </Select>
                          <p id="ct-budget-help" className={`${s.help} ${jaPhrase}`} style={{ lineHeight: ja ? 1.8 : 1.6 }}>
                            {t("ct.budget.help")}
                          </p>
                        </div>

                        <fieldset className={`${s.field} ${s.full} ${s.enter}`}>
                          <legend className={`${s.label} ${s.legend}`}>
                            {t("ct.adsBefore")}
                            {tag(false)}
                          </legend>
                          <div className={s.seg} data-v={v.ads_before || undefined}>
                            <span className={s.thumb} aria-hidden="true" />
                            {(["yes", "no"] as const).map((k) => (
                              <label key={k} className={s.segOpt}>
                                <input
                                  type="radio"
                                  name="ads_before"
                                  value={k}
                                  checked={v.ads_before === k}
                                  onChange={() => set("ads_before", k)}
                                  className={s.segInput}
                                />
                                <span className={s.segText}>{t(`ct.adsBefore.${k}`)}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </>
                    ) : null}

                    {/* message */}
                    <div className={`${s.field} ${s.full}`}>
                      <label htmlFor="ct-message" className={s.label}>
                        {t("ct.msg")}
                        {tag(false)}
                      </label>
                      <textarea
                        id="ct-message"
                        name="message"
                        rows={5}
                        placeholder={t("ct.msg.ph")}
                        value={v.message}
                        onChange={(e) => set("message", e.target.value)}
                        className={`${s.control} ${s.textarea}`}
                      />
                    </div>

                    <p className={`${s.note} ${s.full} ${jaPhrase}`} style={{ lineHeight: ja ? 1.8 : 1.6 }}>
                      {t("ct.photos")}
                    </p>

                    {status === "err" ? (
                      <p role="alert" className={`${s.alert} ${s.full} ${jaPhrase}`}>
                        {t("ct.err")}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      aria-disabled={sending || undefined}
                      className={`m-btn m-btn--dark ${s.submit} ${s.full}`}
                    >
                      {sending ? t("ct.sending") : t("ct.send")}
                    </button>
                  </div>
                </form>

                {done ? (
                  <div className={s.ok}>
                    <h3 ref={okTitleRef} tabIndex={-1} aria-describedby="ct-ok-body" className={s.okTitle}>
                      {t("ct.ok.title")}
                    </h3>
                    <p id="ct-ok-body" className={`${s.okBody} ${jaPhrase}`} style={lh}>
                      {t("ct.ok.body")}
                    </p>
                    <button type="button" onClick={again} className={s.textBtn}>
                      {t("ct.ok.again")}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* ---- what happens next: under the head on desktop, after the card on phones ---- */}
          <div ref={next.ref} className={s.next}>
            <h3
              className={`m-reveal text-[13px] font-semibold text-[#A7ADB3] ${next.cls}`}
              style={{ lineHeight: 1.5, letterSpacing: ja ? "0.04em" : "0.01em", ...delay(0) }}
            >
              {t("ct.next.title")}
            </h3>
            <ol role="list" className="mt-4 max-w-[34em]">
              {[1, 2, 3].map((n, i) => (
                <li key={n} className={`${s.step} m-reveal ${next.cls}`} style={delay(80 + i * 70)}>
                  <span className={`${s.stepLabel} ${ja ? s.stepLabelJa : ""}`}>{t(`ct.next.${n}.label`)}</span>
                  <span
                    className={`text-[15px] text-[#C4C8CC] [text-wrap:pretty] ${jaPhrase}`}
                    style={{ lineHeight: ja ? 1.85 : 1.65 }}
                  >
                    {t(`ct.next.${n}`)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- H2: one mask per word (EN) or <wbr> phrase (JA), so the heading keeps its natural,
   balanced wrapping; each rendered line rises 80ms after the one above ---- */

function Title({
  id,
  html,
  cls,
  className = "",
  style,
}: {
  id: string;
  html: string;
  /** "is-in" once the head is in view */
  cls: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  /* null when the copy holds markup other than <wbr>; it then rises as one block */
  const parts = splitHeading(html);
  const text = html.replace(/<[^>]+>/g, "");

  // Find the line each mask landed on and stagger by it; re-measured on resize and once the
  // web fonts are in, since both move the breaks. --title-end lets the copy below follow on.
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
      h.parentElement?.style.setProperty("--title-end", `${80 + line * 80}ms`);
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

  return (
    <h2 ref={ref} id={id} className={`${className} ${s.title} ${cls}`} style={style}>
      {parts ? (
        <>
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
        </>
      ) : (
        <span className="m-line">
          <span dangerouslySetInnerHTML={{ __html: kernHtml(bindShortWords(html)) }} style={delay(80)} />
        </span>
      )}
    </h2>
  );
}

/** A native select with the thin SVG chevron; muted text while the placeholder shows. */
function Select({
  id,
  name,
  value,
  onChange,
  children,
  selRef,
  describedBy,
  className = "",
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  selRef?: Ref<HTMLSelectElement>;
  describedBy?: string;
  className?: string;
}) {
  return (
    <div className={`${s.selWrap} ${className}`}>
      <select
        ref={selRef}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        data-empty={value === "" ? "" : undefined}
        className={`${s.control} ${s.select}`}
      >
        {children}
      </select>
      <svg className={s.chev} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
