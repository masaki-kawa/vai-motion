"use client";

import { useT } from "./LangProvider";

export default function HowItWorks() {
  const { t } = useT();
  const steps = [1, 2, 3, 4, 5, 6] as const;

  return (
    <section id="how" className="px-5 py-24 sm:py-32 bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl">
        <h2
          className="tight text-center font-extrabold tracking-tight"
          style={{ fontSize: "clamp(28px,4.4vw,44px)" }}
        >
          {t("how.title")}
        </h2>
        <p className="mt-4 mx-auto max-w-xl text-center text-[17px] leading-relaxed text-ink-soft">
          {t("how.sub")}
        </p>

        <div className="mt-14 flex gap-4 overflow-x-auto pb-4 snap-x lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
          {steps.map((i) => (
            <div
              key={i}
              className="card rounded-4xl p-5 min-w-[200px] lg:min-w-0 snap-start shrink-0 lg:shrink"
            >
              <span className="grid place-items-center h-9 w-9 rounded-full bg-accent-soft text-accent-deep text-[14px] font-extrabold">
                {i}
              </span>
              <h3 className="mt-5 text-[16px] font-bold leading-snug">{t(`how.${i}`)}</h3>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p
            className="tight font-extrabold tracking-tight"
            style={{ fontSize: "clamp(24px,3.4vw,34px)" }}
          >
            {t("how.close")}
          </p>
          <a
            href="#contact"
            className="lg-btn lg-btn--light mt-6 inline-flex items-center px-7 py-3.5 text-[16px] font-semibold"
          >
            {t("hero.cta2")}
          </a>
        </div>
      </div>
    </section>
  );
}
