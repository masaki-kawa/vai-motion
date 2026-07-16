"use client";

import { useEffect } from "react";

/**
 * Smooth-scroll all in-page anchor clicks (CTAs, nav links) to their target — and crucially,
 * scroll even when the URL hash already matches (a plain <a href="#contact"> is a no-op on a
 * repeat click). scrollIntoView honors each section's `scroll-margin-top`, so targets land
 * clear of the fixed nav.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
