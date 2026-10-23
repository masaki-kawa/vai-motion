"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useT } from "../LangProvider";
import type { Lang } from "@/lib/i18n";
import s from "./Nav.module.css";

const LINKS = [
  { id: "idea", key: "nav.idea" },
  { id: "service", key: "nav.service" },
  { id: "pricing", key: "nav.pricing" },
  { id: "how", key: "nav.how" },
  { id: "faq", key: "nav.faq" },
] as const;

const LANGS: Lang[] = ["en", "ja"];
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Floating monochrome glass pill. Milk glass by default; switches to smoke glass while its
 * centre line is over any [data-theme="dark"] surface (a dark section, the Growth + Ads card,
 * the pricing stage). Below 900px the links move into a
 * full-screen frosted sheet (focus trapped, Esc closes) and the CTA hands over to MobileBar.
 */
export default function Nav() {
  const { t, cur, setLang } = useT();
  const [dark, setDark] = useState(false);
  const [overPlate, setOverPlate] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const releaseRef = useRef<(() => void) | null>(null);
  const restoreFocus = useRef(false);

  /** dictionary value, or a built-in fallback while the key is not in the dictionary yet */
  const tx = (key: string, en: string, ja: string) => {
    const v = t(key);
    return v === key ? (cur === "ja" ? ja : en) : v;
  };

  // ---- tone: smoke glass while the pill's centre line is over a [data-theme="dark"] surface
  // (Budget slab, Growth card, pricing stage, Contact). The hero plate is deliberately NOT
  // data-theme="dark": milk glass over it turns silver, which is the hero's whole point.
  // Milk over dark keeps ink ≥ 9:1 and the toggle ≥ 5.8:1 (Nav.module.css), so a half
  // overlap no longer has to force the dark tone, and the glass shows what is under it.
  // A second observer, over the pill's whole height, reports image plates (data-over="plate"):
  // the Chromium refraction thins the milk, and it thickens back over pictures.
  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const hits = new Set<Element>();
    const plates = new Set<Element>();
    let io: IntersectionObserver | null = null;
    let plateIo: IntersectionObserver | null = null;
    let raf = 0;

    const build = () => {
      raf = 0;
      io?.disconnect();
      plateIo?.disconnect();
      hits.clear();
      plates.clear();
      // a 2px band on the pill's centre line (rootMargin can't take calc(), so px). Layout
      // offsets, not getBoundingClientRect, so the entrance transform can't skew it.
      const mid = Math.round(pill.offsetTop + pill.offsetHeight / 2);
      const top = Math.max(0, mid - 1);
      const bottom = Math.max(0, window.innerHeight - top - 2);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.add(e.target);
            else hits.delete(e.target);
          }
          setDark(hits.size > 0);
        },
        { rootMargin: `-${top}px 0px -${bottom}px 0px` },
      );
      document.querySelectorAll('[data-theme="dark"]').forEach((el) => io!.observe(el));

      // plates: the pill's whole height, so the thicker milk is already on when a picture's
      // edge first slides under the links (over white page it is invisible anyway)
      const pTop = pill.offsetTop;
      const pBottom = Math.max(0, window.innerHeight - pTop - pill.offsetHeight);
      plateIo = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) plates.add(e.target);
            else plates.delete(e.target);
          }
          setOverPlate(plates.size > 0);
          if (plates.size) {
            // the plates' horizontal span on the pill: the thicker milk covers only that.
            // Horizontal geometry doesn't change on scroll, so measuring here is enough.
            const pr = pill.getBoundingClientRect();
            let l = Infinity;
            let r = -Infinity;
            plates.forEach((el) => {
              const b = el.getBoundingClientRect();
              l = Math.min(l, b.left);
              r = Math.max(r, b.right);
            });
            pill.style.setProperty("--plate-l", `${Math.max(0, Math.round(l - pr.left))}px`);
            pill.style.setProperty("--plate-r", `${Math.min(pr.width, Math.round(r - pr.left))}px`);
          }
        },
        { rootMargin: `-${pTop}px 0px -${pBottom}px 0px` },
      );
      document.querySelectorAll(".m-plate").forEach((el) => plateIo!.observe(el));
    };
    const onResize = () => {
      if (!raf) raf = requestAnimationFrame(build);
    };

    build();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
      plateIo?.disconnect();
    };
  }, []);

  // ---- active link: the section crossing a thin band at 40% of the viewport ----
  useEffect(() => {
    const on = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) on.add(e.target.id);
          else on.delete(e.target.id);
        }
        setActive(LINKS.find((l) => on.has(l.id))?.id ?? null);
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    for (const l of LINKS) {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // ---- menu sheet: lock scroll, make the page behind inert, trap focus, Esc closes ----
  const close = useCallback((returnFocus: boolean) => {
    releaseRef.current?.();
    restoreFocus.current = returnFocus;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      if (restoreFocus.current) {
        restoreFocus.current = false;
        menuBtnRef.current?.focus({ preventScroll: true });
      }
      return;
    }
    const header = headerRef.current;
    const sheet = sheetRef.current;
    if (!header || !sheet) return;

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const siblings = Array.from(header.parentElement?.children ?? []).filter(
      (el) => el !== header && !el.hasAttribute("inert"),
    );
    root.style.overflow = "hidden";
    siblings.forEach((el) => el.setAttribute("inert", ""));
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      root.style.overflow = prevOverflow;
      siblings.forEach((el) => el.removeAttribute("inert"));
    };
    releaseRef.current = release;

    const raf = requestAnimationFrame(() => {
      sheet.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const a = document.activeElement;
      if (e.shiftKey && (a === first || !sheet.contains(a))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (a === last || !sheet.contains(a))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // the sheet only exists on phones: widening past 900px closes it
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => {
      if (mq.matches) close(false);
    };
    mq.addEventListener("change", onMq);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      release();
      releaseRef.current = null;
    };
  }, [open, close]);

  /** a link inside the sheet: close first (page un-inerted), then hand focus to the target.
   *  The global SmoothScroll handler does the scrolling. */
  const onSheetLink = (e: MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.getAttribute("href")?.slice(1);
    close(false);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  const toggle = (
    <div role="group" aria-label={tx("nav.lang.label", "Language", "言語")} className={s.seg}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-label={l === "en" ? "English" : undefined}
          aria-pressed={cur === l}
          onClick={() => {
            if (cur !== l) setLang(l);
          }}
        >
          {l === "en" ? tx("nav.lang.en", "EN", "EN") : tx("nav.lang.ja", "日本語", "日本語")}
        </button>
      ))}
    </div>
  );

  const logo = (
    <>
      <span className={s.lockup}>
        <Image
          src="/assets/vai-motion-logo-h.png"
          alt="VAI MOTION"
          width={1920}
          height={819}
          sizes="(min-width: 900px) 176px, 156px"
          loading="eager"
          className={s.lockupImg}
        />
      </span>
      <Image
        src="/assets/vai-mark.png"
        alt="VAI MOTION"
        width={413}
        height={389}
        sizes="30px"
        className={s.markImg}
      />
    </>
  );

  return (
    <header ref={headerRef} className={s.header}>
      <nav
        ref={pillRef}
        aria-label={tx("nav.label", "Main", "メイン")}
        data-tone={dark ? "dark" : "light"}
        data-over={overPlate ? "plate" : undefined}
        className={`${s.pill} ${s.enter} m-pill-rim`}
        inert={open}
      >
        <a href="#top" className={s.brand}>
          {logo}
        </a>

        <ul className={s.links}>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={s.link}
                aria-current={active === l.id ? "true" : undefined}
              >
                {t(l.key)}
              </a>
            </li>
          ))}
        </ul>

        <div className={s.actions}>
          {toggle}
          <a href="#contact" className={`m-btn m-btn--dark ${s.btn} ${s.cta}`}>
            {t("nav.cta")}
          </a>
          <button
            ref={menuBtnRef}
            type="button"
            className={s.menuBtn}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="lp-menu"
            onClick={() => setOpen(true)}
          >
            {t("nav.menu")}
          </button>
        </div>
      </nav>

      <div
        ref={sheetRef}
        id="lp-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu")}
        data-open={open ? "true" : "false"}
        className={s.sheet}
      >
        <div className={s.sheetTop}>
          <div className={`${s.pill} m-pill-rim`} data-tone="light">
            <a href="#top" className={s.brand} onClick={onSheetLink}>
              {logo}
            </a>
            <div className={s.actions}>
              {toggle}
              <button
                type="button"
                className={s.menuBtn}
                onClick={() => close(true)}
              >
                {t("nav.close")}
              </button>
            </div>
          </div>
        </div>

        <nav aria-label={tx("nav.label", "Main", "メイン")} className={s.sheetNav}>
          <ul className={s.sheetList}>
            {LINKS.map((l, i) => (
              <li key={l.id} className={`${s.sheetItem} ${s.rise}`} style={{ ["--i" as string]: i }}>
                <a
                  href={`#${l.id}`}
                  className={`${s.sheetLink} m-jp-break`}
                  aria-current={active === l.id ? "true" : undefined}
                  data-autofocus={i === 0 ? "" : undefined}
                  onClick={onSheetLink}
                >
                  <span>{t(l.key)}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contact"
          className={`m-btn m-btn--dark ${s.sheetCta} ${s.rise}`}
          style={{ ["--i" as string]: LINKS.length }}
          onClick={onSheetLink}
        >
          {t("nav.cta")}
        </a>
      </div>
    </header>
  );
}
