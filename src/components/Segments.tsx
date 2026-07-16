"use client";

import { useT } from "./LangProvider";

/** "こんなお店に" — the three cross-border customer segments (Japan-market /jp only).
 *  Segment 3 (expansion abroad) is intentionally lightest: the near-term sell is 1 and 2. */
export default function Segments() {
  const { t } = useT();
  const items = ["1", "2", "3"] as const;
  return (
    <section id="segments" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2
          className="tight text-center font-extrabold tracking-tight max-w-2xl mx-auto"
          style={{ fontSize: "clamp(28px,4.4vw,44px)" }}
        >
          {t("seg.title")}
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-center text-[17px] leading-relaxed text-ink-soft">
          {t("seg.sub")}
        </p>
        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {items.map((n) => (
            <div key={n} className="card rounded-4xl p-7 flex flex-col">
              <span className="grid place-items-center h-11 w-11 rounded-2xl bg-accent-soft text-accent-deep text-[18px] font-extrabold">
                {n}
              </span>
              <h3 className="mt-5 text-[19px] font-bold leading-snug">{t(`seg.${n}.t`)}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{t(`seg.${n}.d`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
