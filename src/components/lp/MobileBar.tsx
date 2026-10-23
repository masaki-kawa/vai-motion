"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "../LangProvider";
import s from "./MobileBar.module.css";

/**
 * Phones only (<900px): a fixed glass pill with the starting price and the consultation CTA.
 * Slides up once the hero CTAs (#hero-ctas) have scrolled above the viewport, and slides away
 * while #contact or #footer is on screen. Smoke glass over light content; milk glass while its
 * centre line is over a [data-theme="dark"] surface (pricing stage, Growth card, Budget slab).
 * Under reduced motion it simply appears and disappears.
 */
export default function MobileBar() {
  const { t } = useT();
  const barRef = useRef<HTMLDivElement>(null);
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // 1) the hero CTAs have left the viewport upwards
    const hero =
      document.getElementById("hero-ctas") ?? document.querySelector<HTMLElement>("#top > section");
    if (hero) {
      const io = new IntersectionObserver(([e]) => {
        setPast(!e.isIntersecting && e.boundingClientRect.top < 0);
      });
      io.observe(hero);
      observers.push(io);
    }

    // 2) the contact section or the footer is on screen
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setBlocked(seen.size > 0);
    });
    for (const id of ["contact", "footer"]) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    observers.push(io);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // 3) material: a 2px band on the bar's centre line. offsetTop ignores the parking transform.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const hits = new Set<Element>();
    let io: IntersectionObserver | null = null;
    let raf = 0;
    const build = () => {
      raf = 0;
      io?.disconnect();
      hits.clear();
      const mid = Math.round(bar.offsetTop + bar.offsetHeight / 2);
      const top = Math.max(0, mid - 1);
      const bottom = Math.max(0, window.innerHeight - top - 2);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.add(e.target);
            else hits.delete(e.target);
          }
          setOnDark(hits.size > 0);
        },
        { rootMargin: `-${top}px 0px -${bottom}px 0px` },
      );
      document.querySelectorAll('[data-theme="dark"]:not(.lp-mirror *)').forEach((el) => io!.observe(el));
    };
    const onResize = () => {
      if (!raf) raf = requestAnimationFrame(build);
    };
    build();
    window.addEventListener("resize", onResize); // iOS toolbar collapse fires resize too
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  const show = past && !blocked;

  return (
    <div
      ref={barRef}
      className={`${s.bar} m-pill-rim`}
      data-show={show ? "true" : "false"}
      data-tone={onDark ? "light" : "dark"}
    >
      <p className={s.text}>{t("mb.text")}</p>
      <a href="#contact" className={`m-btn ${onDark ? "m-btn--dark" : "m-btn--white"} ${s.cta}`}>
        {t("mb.cta")}
      </a>
    </div>
  );
}
