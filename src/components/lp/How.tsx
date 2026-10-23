"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useT } from "../LangProvider";
import Html from "./Html";
import { bindShortWords, kernHtml, kernWord, splitHeading } from "./typeset";
import { useReveal } from "./useReveal";
import s from "./How.module.css";

const STEPS = [1, 2, 3, 4, 5] as const;

/** stagger delay as a CSS custom property */
const delay = (ms: number | string) => ({ "--d": typeof ms === "number" ? `${ms}ms` : ms }) as CSSProperties;

/** JA line breaking inline as well, so a ?lang=ja first render is right before <html> gets .lang-ja */
export const JA_BREAK: CSSProperties = { wordBreak: "keep-all", lineBreak: "strict", overflowWrap: "anywhere" };
export const JA_KICKER: CSSProperties = { fontSize: 13, letterSpacing: "0.06em", textTransform: "none" };

/** Where each step counts as "reached": the line (fraction of the viewport height from the top)
 *  its top edge has to cross. Phones: the centre, step by step down the list. Desktop: the five
 *  columns share one row, so their lines straddle the centre and the fill runs left to right
 *  over the stretch of scroll in which the row passes the middle of the screen. */
const lineFor = (i: number, desktop: boolean) => (desktop ? 0.64 - i * 0.07 : 0.5);

/** ms between chained stretches when one scroll passes several steps at once */
const CHAIN = 140;

/** px the observer root reaches above the viewport: more than any page height */
const ABOVE = 100000;

export default function How() {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const head = useReveal<HTMLDivElement>();
  const close = useReveal<HTMLDivElement>();
  const listRef = useRef<HTMLOListElement>(null);
  // n steps reached (0–5); `from` is the previous n, so newly passed stretches fill in order
  const [prog, setProg] = useState({ n: 0, from: 0 });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
    const desktop = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const passed = items.map(() => false);
    let ios: IntersectionObserver[] = [];

    const commit = () => {
      // the lines are ordered, so the passed steps always form a run from step 1
      let n = 0;
      while (n < passed.length && passed[n]) n++;
      setProg((p) => (p.n === n ? p : { n, from: p.n }));
    };

    const build = () => {
      ios.forEach((io) => io.disconnect());
      ios = [];
      if (reduced.matches) {
        passed.fill(true);
        commit();
        return;
      }
      items.forEach((el, i) => {
        const line = lineFor(i, desktop.matches);
        // The root is everything above the line, the page above the viewport included, so a
        // step "intersects" exactly while its top is above the line. Any crossing of the line
        // flips that, even a jump straight past the viewport (a nav link, a fling, Home/End).
        const io = new IntersectionObserver(
          (entries) => {
            const e = entries[entries.length - 1];
            if (!e) return;
            passed[i] = e.isIntersecting;
            commit();
          },
          { rootMargin: `${ABOVE}px 0px -${((1 - line) * 100).toFixed(2)}% 0px` },
        );
        io.observe(el);
        ios.push(io);
      });
    };

    build();
    desktop.addEventListener("change", build);
    reduced.addEventListener("change", build);
    return () => {
      desktop.removeEventListener("change", build);
      reduced.removeEventListener("change", build);
      ios.forEach((io) => io.disconnect());
    };
  }, []);

  /** delay of a step's stretch: chained forwards when filling, backwards when emptying */
  const chain = (i: number) => {
    const { n, from } = prog;
    if (n > from && i >= from && i < n) return (i - from) * CHAIN;
    if (n < from && i >= n && i < from) return (from - 1 - i) * CHAIN;
    return 0;
  };

  return (
    <section id="how" aria-labelledby="how-title" className="relative bg-white">
      <div className="mx-auto max-w-[1240px] px-4 pb-24 pt-24 sm:px-8 min-[900px]:pb-[160px] min-[900px]:pt-[160px]">
        {/* ---- header: columns 1–9 ---- */}
        <div ref={head.ref} className="min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:gap-x-8">
          <div className="min-[900px]:col-span-9">
            <p className={`m-kicker m-reveal ${head.cls}`} style={ja ? { ...delay(0), ...JA_KICKER } : delay(0)}>
              {t("how.kicker")}
            </p>
            <SplitTitle
              id="how-title"
              html={t("how.title")}
              cls={head.cls}
              className="m-display m-jp-break mt-5 text-[color:var(--m-ink)] min-[900px]:mt-6"
              style={{
                fontSize: ja ? "clamp(30px,4.2vw,64px)" : "clamp(36px,5vw,76px)",
                lineHeight: ja ? 1.25 : 1.02,
                letterSpacing: ja ? "-0.02em" : "-0.04em",
                ...(ja ? JA_BREAK : {}),
              }}
            />
            <p
              className={`m-body m-reveal mt-6 max-w-[36em] text-[17px] text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:mt-8 ${head.cls}`}
              style={delay("calc(var(--title-end, 240ms) + 120ms)")}
            >
              {t("how.sub")}
            </p>
          </div>
        </div>

        {/* ---- the five steps under one track ---- */}
        <ol
          ref={listRef}
          className={`${s.steps} mt-14 min-[900px]:mt-24 min-[900px]:grid min-[900px]:grid-cols-5`}
          style={{ "--progress": prog.n / STEPS.length } as CSSProperties}
        >
          {STEPS.map((n, i) => (
            <Step key={n} n={n} index={i} on={i < prog.n} fd={chain(i)} />
          ))}
        </ol>

        {/* ---- the owner's part, and the way in ---- */}
        <div
          ref={close.ref}
          className="mt-16 min-[900px]:mt-24 min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:items-end min-[900px]:gap-x-8"
        >
          <div className={`m-reveal ${close.cls} min-[900px]:col-span-8`} style={delay(0)}>
            <Html
              as="p"
              html={t("how.close")}
              className={`${s.close} m-jp-break max-w-[30em] font-semibold text-[color:var(--m-ink)] [text-wrap:pretty]`}
              style={{
                lineHeight: ja ? 1.7 : 1.45,
                letterSpacing: ja ? "0" : "-0.015em",
                ...(ja ? JA_BREAK : {}),
              }}
            />
          </div>
          <div
            className={`m-reveal ${close.cls} mt-8 min-[900px]:col-span-4 min-[900px]:col-start-9 min-[900px]:mt-0 min-[900px]:justify-self-end`}
            style={delay(120)}
          >
            <a
              href="#contact"
              className="m-btn m-btn--dark h-[54px] w-full px-7 text-[15px] focus-visible:!rounded-full sm:w-auto"
            >
              <span>{t("how.cta")}</span>
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One step: its stretch of the track, then label, title and body. */
function Step({ n, index, on, fd }: { n: number; index: number; on: boolean; fd: number }) {
  const { t, cur } = useT();
  const ja = cur === "ja";
  const { ref, cls } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      data-step=""
      data-on={on ? "" : undefined}
      className={`${s.step} pb-10 pl-[26px] last:pb-0 min-[900px]:pb-0 min-[900px]:pl-0 min-[900px]:pr-6 min-[900px]:pt-8 min-[1100px]:pr-8`}
      style={{ "--fd": `${fd}ms` } as CSSProperties}
    >
      <span aria-hidden="true" className={s.fill} />

      <div className={`${s.content} m-reveal ${cls}`} style={{ "--sd": `${index * 90}ms` } as CSSProperties}>
        <p
          className={`${s.label} tabular font-semibold text-[color:var(--m-mute)] ${
            ja ? "text-[13px] tracking-[0.06em]" : "text-[12px] uppercase tracking-[0.14em]"
          }`}
          style={{ lineHeight: 1.4 }}
        >
          {t(`how.${n}.label`)}
        </p>
        {/* JA: keep-all, refined to phrase boundaries where the browser can (auto-phrase); 17px
            in the narrow 900–1099 columns so 「広告アカウントに」 stays whole */}
        <Html
          as="h3"
          html={ja ? t(`how.${n}.title`) : bindShortWords(t(`how.${n}.title`))}
          className={`mt-2.5 font-bold text-[color:var(--m-ink)] [text-wrap:balance] min-[900px]:mt-3.5 min-[1100px]:text-[21px] ${
            ja ? `${s.jaPhrase} text-[18px] min-[900px]:text-[17px]` : "text-[19px]"
          }`}
          style={{ lineHeight: ja ? 1.5 : 1.3, letterSpacing: ja ? "0" : "-0.015em" }}
        />
        <p className="m-body mt-2.5 max-w-[34em] text-[15px] text-[color:var(--m-soft)] [text-wrap:pretty] min-[900px]:mt-3">
          {t(`how.${n}.body`)}
        </p>
      </div>
    </li>
  );
}

function Arrow() {
  return (
    <svg className="m-arrow shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------------------------------
   SplitTitle — a section H2 whose lines rise from behind a mask, 80ms apart (shared with Faq).
   Masks are words (EN) or <wbr> phrases (JA), so the heading keeps its natural, balanced
   wrapping; the line each mask landed on is measured (again on resize and once the web fonts
   are in) to set its delay. It also writes `--title-end` on its parent, so the copy after it
   can follow the last line: `--d: calc(var(--title-end, 240ms) + 120ms)`.
   ------------------------------------------------------------------------------------------ */

export function SplitTitle({
  id,
  html,
  cls,
  className = "",
  style,
}: {
  id: string;
  html: string;
  /** "is-in" once the header is in view */
  cls: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  // null when the copy holds markup other than <wbr>; it then rises as one block
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
          <Html html={kernHtml(bindShortWords(html))} style={delay(80)} />
        </span>
      )}
    </h2>
  );
}
