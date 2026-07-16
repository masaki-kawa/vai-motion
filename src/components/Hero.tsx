"use client";

import { useT } from "./LangProvider";
import ScatterField from "./ScatterField";

export default function Hero() {
  const { t } = useT();
  const lead = t("hero.lead");
  const hasLead = Boolean(lead) && lead !== "hero.lead";
  return (
    <section className="relative overflow-hidden px-5 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
      <div className="hero-cloud cloud-bl" />

      <div className="relative z-10 mx-auto max-w-7xl grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center gap-12 lg:gap-10">
        {/* left: text, neatly stacked and left-aligned */}
        <div className="text-left max-w-xl">
          <span className="card inline-flex items-center gap-2 rounded-full overflow-hidden px-4 py-1.5 text-[13px] font-semibold text-accent-deep whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t("hero.badge")}
          </span>
          <h1
            data-i18n-html=""
            className="tight mt-6 tracking-tight text-balance"
            style={{
              fontSize: "clamp(30px,4.6vw,48px)",
              lineHeight: 1.14,
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
            dangerouslySetInnerHTML={{ __html: t("hero.title") }}
          />
          {hasLead && (
            <p
              data-i18n-html=""
              className="tight mt-4 font-bold leading-snug text-ink text-balance"
              style={{ fontSize: "clamp(18px,2.5vw,24px)" }}
              dangerouslySetInnerHTML={{ __html: lead }}
            />
          )}
          <p
            data-i18n-html=""
            className="mt-5 max-w-lg text-[15.5px] sm:text-[17px] leading-relaxed text-ink-soft text-pretty"
            dangerouslySetInnerHTML={{ __html: t("hero.sub") }}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="lg-btn lg-btn--light inline-flex items-center justify-center px-7 py-3.5 text-[16px] font-semibold"
            >
              {t("hero.cta2")}
            </a>
          </div>
        </div>

        {/* right: floating sample-video cards */}
        <div className="relative">
          <ScatterField />
        </div>
      </div>
    </section>
  );
}
