"use client";

import { useEffect, useState } from "react";
import { useT } from "../LangProvider";
import s from "./MobileBar.module.css";

/**
 * Phones only (<900px): a fixed dark-glass pill with the starting price and the consultation CTA.
 * Slides up once the hero CTAs (#hero-ctas) have scrolled above the viewport, and slides away
 * while #contact or #footer is on screen. Under reduced motion it simply appears and disappears.
 */
export default function MobileBar() {
  const { t } = useT();
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(false);

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

  const show = past && !blocked;

  return (
    <div className={s.bar} data-show={show ? "true" : "false"}>
      <p className={s.text}>{t("mb.text")}</p>
      <a href="#contact" className={`m-btn m-btn--white ${s.cta}`}>
        {t("mb.cta")}
      </a>
    </div>
  );
}
