"use client";

import { useEffect } from "react";

/**
 * Smooth-scroll all in-page anchor clicks (CTAs, nav links) to their target — and crucially,
 * scroll even when the URL hash already matches (a plain <a href="#contact"> is a no-op on a
 * repeat click). scrollIntoView honors the root's `scroll-padding-top`, so targets land clear
 * of the fixed nav. Under reduced motion the jump is instant. Focus then moves to the target
 * (as the browser's own fragment navigation would), so the skip link works and the next Tab
 * continues from there instead of jumping back up.
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
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
      history.replaceState(null, "", href);
      // a non-focusable target (<main>/<section>) becomes programmatically focusable only;
      // a native control keeps its place in the tab order
      if (el.tabIndex < 0 && !el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
