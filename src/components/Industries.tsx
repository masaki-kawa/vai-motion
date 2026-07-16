"use client";

import { useT } from "./LangProvider";

/** Inbound-leaning lead industries (Japan-market /jp only). Reads ind.* from the JP dict. */
export default function Industries() {
  const { t } = useT();
  const items = ["1", "2", "3", "4"] as const;
  return (
    <section id="industries" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2
          className="tight text-center font-extrabold tracking-tight"
          style={{ fontSize: "clamp(26px,4vw,40px)" }}
        >
          {t("ind.title")}
        </h2>
        <p className="mt-3 text-center text-[16px] text-ink-soft">{t("ind.sub")}</p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((n) => (
            <div key={n} className="card rounded-4xl p-7">
              <h3 className="text-[18px] font-bold">{t(`ind.${n}`)}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{t(`ind.${n}d`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
