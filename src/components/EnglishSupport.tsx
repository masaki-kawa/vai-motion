"use client";

import { useT } from "./LangProvider";

/** "英語にも強い、の中身" — concretises the English claim so it doesn't over-promise
 *  full overseas marketing (Japan-market /jp only). */
export default function EnglishSupport() {
  const { t } = useT();
  const items = ["1", "2", "3", "4", "5"] as const;
  return (
    <section className="px-5 py-24 sm:py-32 bg-[#FAFAFA]">
      <div className="mx-auto max-w-3xl">
        <h2
          className="tight text-center font-extrabold tracking-tight"
          style={{ fontSize: "clamp(26px,4vw,40px)" }}
        >
          {t("eng.title")}
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-center text-[16px] leading-relaxed text-ink-soft">
          {t("eng.sub")}
        </p>
        <ul className="mt-10 grid sm:grid-cols-2 gap-3">
          {items.map((n) => (
            <li
              key={n}
              className="card rounded-2xl px-5 py-4 flex items-center gap-3 text-[15px] font-semibold"
            >
              <span className="grid place-items-center h-7 w-7 shrink-0 rounded-full bg-accent-soft text-accent-deep">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {t(`eng.${n}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
