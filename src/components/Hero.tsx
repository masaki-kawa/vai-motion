"use client";

import { useEffect, useRef } from "react";
import { useT } from "./LangProvider";
import ReelCard from "./ReelCard";
import { HERO_REEL, HERO_SIDE } from "@/lib/data";

export default function Hero() {
  const { t, cur } = useT();
  const reel = HERO_REEL[cur];
  const sectionRef = useRef<HTMLElement>(null);

  const lead = t("hero.lead");
  const hasLead = Boolean(lead) && lead !== "hero.lead";

  // scroll progress (0 at top → 1 once the showreel is fully in view) drives the
  // showreel grow + side-reel parallax through a single CSS var, one write per frame
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
      el.style.setProperty("--hp", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const tags = [t("hero.tag1"), t("hero.tag2"), t("hero.tag3")];

  return (
    <section ref={sectionRef} className="hero relative overflow-hidden px-5 pt-32 sm:pt-40 pb-16 sm:pb-24">
      <div className="hero-glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <span className="hero-in card inline-flex items-center gap-2 rounded-full overflow-hidden px-4 py-1.5 text-[13px] font-semibold text-accent-deep whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t("hero.badge")}
        </span>
        <h1
          data-i18n-html=""
          className="hero-title hero-in tight mt-7 font-extrabold tracking-tight text-balance text-ink"
          style={{ animationDelay: "0.08s" }}
          dangerouslySetInnerHTML={{ __html: t("hero.title") }}
        />
        {hasLead && (
          <p
            data-i18n-html=""
            className="hero-in tight mx-auto mt-5 max-w-2xl font-bold leading-snug text-ink text-balance"
            style={{ fontSize: "clamp(18px,2.5vw,24px)", animationDelay: "0.16s" }}
            dangerouslySetInnerHTML={{ __html: lead }}
          />
        )}
        <p
          data-i18n-html=""
          className="hero-in mx-auto mt-6 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-ink-soft text-pretty"
          style={{ animationDelay: "0.2s" }}
          dangerouslySetInnerHTML={{ __html: t("hero.sub") }}
        />
        <div className="hero-in mt-9 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.3s" }}>
          <a
            href="#contact"
            className="lg-btn lg-btn--dark inline-flex items-center justify-center px-7 py-3.5 text-[16px] font-semibold"
          >
            {t("hero.cta2")}
          </a>
          <a
            href="#work"
            className="lg-btn lg-btn--light inline-flex items-center justify-center px-7 py-3.5 text-[16px] font-semibold"
          >
            {t("hero.cta.work")}
          </a>
        </div>
      </div>

      {/* showreel: grows to full size as you scroll, flanked by drifting vertical reels */}
      <div className="hero-in relative z-10 mx-auto mt-14 sm:mt-20 max-w-6xl" style={{ animationDelay: "0.42s" }}>
        <div className="hero-side hero-side--l hidden lg:flex" aria-hidden="true">
          {HERO_SIDE.slice(0, 2).map((cat) => (
            <ReelCard key={cat} cat={cat} fixed w="w-[150px]" ambient />
          ))}
        </div>
        <div className="hero-side hero-side--r hidden lg:flex" aria-hidden="true">
          {HERO_SIDE.slice(2, 4).map((cat) => (
            <ReelCard key={cat} cat={cat} fixed w="w-[150px]" ambient />
          ))}
        </div>

        <div className="hero-reel relative overflow-hidden bg-accent-soft">
          <video
            key={reel.src}
            className="absolute inset-0 h-full w-full object-cover"
            src={reel.src}
            poster={reel.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={t("hero.reel")}
          />
        </div>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] sm:text-[14px] font-semibold text-ink-soft">
          {tags.map((tag) => (
            <li key={tag} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
