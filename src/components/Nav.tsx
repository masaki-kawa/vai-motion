"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useT } from "./LangProvider";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { t, cur, setLang } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Become glass as soon as the page leaves the very top. Tiny hysteresis (8/2px) only to avoid
  // flicker right at the edge. CSS then eases --p over one slow, symmetric ease-in-out, so the
  // glass fades in gently (no pop) and opens back out just as gently when you return to the top.
  useEffect(() => {
    let on = false;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      if (!on && y > 8) {
        on = true;
        setScrolled(true);
      } else if (on && y < 2) {
        on = false;
        setScrolled(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="siteNav"
      className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? "is-scrolled" : ""}`}
    >
      {/* liquid-glass displacement filter — distorts only the .glass-filter layer */}
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
        focusable="false"
      >
        <filter
          id="lg-dist"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves={2}
            seed={92}
            stitchTiles="stitch"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={2} result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale={70}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacement"
          />
        </filter>
      </svg>

      <div className="nav-wrap">
        <div className="voiceos-nav-glass nav-bar relative overflow-hidden">
          {/* refraction layer (z-0): backdrop-filter warps the live page content behind the nav */}
          <div className="glass-filter" aria-hidden="true" />
          <div
            className="nav-hairline pointer-events-none absolute left-5 right-5 top-0 z-[2] h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)",
            }}
          />
          <div
            className="nav-hairline pointer-events-none absolute bottom-0 left-6 right-6 z-[2] h-px"
            style={{
              background: "linear-gradient(90deg,transparent,rgba(15,23,42,0.06),transparent)",
            }}
          />

          <div className="relative z-10 flex items-center gap-3 px-3 py-4 sm:px-5 sm:py-5">
            <a href="#top" className="relative flex items-center shrink-0">
              <Image
                src="/assets/vai-motion-logo-h.png"
                alt="VAI MOTION"
                width={260}
                height={52}
                priority
                style={{ width: "auto" }}
                className="logo-full h-11 sm:h-[52px] w-auto"
              />
              <Image
                src="/assets/vai-mark.png"
                alt="VAI MOTION"
                width={52}
                height={52}
                priority
                style={{ width: "auto" }}
                className="logo-mark h-12 sm:h-[52px] w-auto"
              />
            </a>

            <div className="nav-links hidden lg:flex items-center gap-0.5 mx-auto text-[15px] font-medium text-ink-soft">
              <a href="#work" className="px-3.5 py-2 rounded-full hover:bg-black/5 transition">
                {t("nav.work")}
              </a>
              <a href="#pricing" className="px-3.5 py-2 rounded-full hover:bg-black/5 transition">
                {t("nav.pricing")}
              </a>
              <a href="#how" className="px-3.5 py-2 rounded-full hover:bg-black/5 transition">
                {t("nav.how")}
              </a>
            </div>

            <div className="flex items-center gap-2 ml-auto lg:ml-0">
              <div className="hidden md:flex">
                <LangToggle />
              </div>
              <a
                href="#contact"
                className="lg-btn lg-btn--light hidden md:inline-flex items-center px-5 py-2.5 text-[14px] font-semibold whitespace-nowrap"
              >
                {t("nav.cta")}
              </a>
              <button
                type="button"
                onClick={() => setLang(cur === "en" ? "ja" : "en")}
                aria-label={cur === "ja" ? "言語を英語に切り替え" : "Switch language to Japanese"}
                className="md:hidden rounded-full bg-black/[0.04] px-3 py-2 text-[13px] font-bold"
              >
                {cur === "ja" ? "日本語" : "EN"}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="lg:hidden grid place-items-center h-9 w-9 rounded-full hover:bg-black/5 transition"
                aria-label="Menu"
                aria-expanded={menuOpen}
                aria-controls="mobileMenu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M2 5h14M2 9h14M2 13h14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* mobile dropdown */}
        <div
          id="mobileMenu"
          className={`lg:hidden ${menuOpen ? "" : "hidden"} mt-2 voiceos-nav-glass p-2.5`}
        >
          <div className="flex flex-col text-[16px] font-medium text-ink-soft">
            <a
              href="#work"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-black/5"
            >
              {t("nav.work")}
            </a>
            <a
              href="#pricing"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-black/5"
            >
              {t("nav.pricing")}
            </a>
            <a
              href="#how"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-black/5"
            >
              {t("nav.how")}
            </a>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="lg-btn lg-btn--light mt-1 px-4 py-3 text-center font-semibold"
            >
              {t("nav.cta")}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
