"use client";

import { useEffect, type RefObject } from "react";

/** never copied: they would run, load or style twice */
const SKIP = new Set(["SCRIPT", "NOSCRIPT", "TEMPLATE", "STYLE", "LINK", "IFRAME", "VIDEO", "AUDIO", "CANVAS"]);
/** never mirrored from the original: the copy keeps its own (ids would hijack anchors and labels) */
const KEEP_OWN = new Set(["id", "name", "for", "form", "src", "srcset", "sizes", "loading", "autofocus", "alt"]);

/**
 * The nav's warp for browsers without url() backdrop filters (Safari, iOS, Firefox).
 *
 * A live copy of the page (main + footer) sits in the pill's lens, lined up with the real page
 * and moved with the scroll, under a plain CSS filter (#lp-mirror, GlassDefs) that bends it the
 * way #lp-refract bends the backdrop in Chromium. Chromium keeps the real backdrop refraction
 * (html.lg-refract) and never builds the copy; ?nomirror keeps the frosted blur everywhere.
 *
 * The copy is inert and aria-hidden, has no ids or form names, and only shows pictures the page
 * has already loaded. It follows the real page: attribute and text changes are copied as they
 * happen (reveals, parallax, data-paused, the language switch) and a changed list of children
 * re-copies that branch. It is moved once per frame from scroll events, never by a CSS
 * animation or a 3D transform: WebKit drops the lens's filter the moment anything inside it
 * gets a compositing layer (globals.css keeps the copy's own content flat for the same reason:
 * no animations, transitions or backdrop filters). Sticky blocks can't stick inside the lens,
 * so their copies are pinned to wherever the originals are. html.lg-mirror goes on once the
 * copy is in place and the pill has landed.
 */
export function useMirror(pillRef: RefObject<HTMLElement | null>, lensRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = document.documentElement;
    const pill = pillRef.current;
    const lens = lensRef.current;
    if (!pill || !lens) return;
    if (root.classList.contains("lg-refract") || /[?&]nomirror\b/.test(location.search)) return;
    const page = pill.closest(".lp");
    if (!page) return;
    const sources = Array.from(page.children).filter((el) => el.tagName === "MAIN" || el.tagName === "FOOTER");
    if (!sources.length) return;

    const copies = new WeakMap<Node, Node>();
    let alive = true;

    // ---- copying ----
    const scrub = (src: Element, dst: Element) => {
      dst.removeAttribute("id");
      dst.removeAttribute("name");
      dst.removeAttribute("for");
      dst.removeAttribute("form");
      dst.removeAttribute("autofocus");
      if (src instanceof HTMLImageElement) {
        dst.removeAttribute("srcset");
        dst.removeAttribute("sizes");
        dst.removeAttribute("loading");
        dst.setAttribute("alt", "");
        if (src.complete && src.naturalWidth && src.currentSrc) dst.setAttribute("src", src.currentSrc);
        else dst.removeAttribute("src");
      } else if (src.tagName === "SOURCE") {
        dst.removeAttribute("srcset");
        dst.removeAttribute("src");
      } else if (src instanceof HTMLInputElement || src instanceof HTMLTextAreaElement || src instanceof HTMLSelectElement) {
        dst.setAttribute("autocomplete", "off");
      }
    };
    const copy = (src: Node): Node => {
      const dst = src.cloneNode(false);
      copies.set(src, dst);
      if (src instanceof Element) scrub(src, dst as Element);
      for (let c = src.firstChild; c; c = c.nextSibling) {
        if (c instanceof Element && SKIP.has(c.tagName)) continue;
        dst.appendChild(copy(c));
      }
      return dst;
    };

    const mirror = document.createElement("div");
    mirror.className = `${page.className} lp-mirror`;
    mirror.setAttribute("inert", "");
    const pageBg = getComputedStyle(page).backgroundColor;
    Object.assign(mirror.style, {
      position: "absolute",
      left: "0",
      top: "0",
      margin: "0",
      backgroundColor:
        pageBg && pageBg !== "rgba(0, 0, 0, 0)" ? pageBg : getComputedStyle(document.body).backgroundColor || "#fff",
    });
    for (const s of sources) mirror.appendChild(copy(s));

    // ---- sticky blocks: pinned to the originals' place, once per frame. Only layout numbers:
    // the copy's translate may still be last frame's, so its rects can't be trusted mid-scroll.
    // `y` is the copy's unstuck top in page coordinates. ----
    type Sticky = { real: HTMLElement; twin: HTMLElement; y: number };
    let stickies: Sticky[] = [];
    const pageY = (el: HTMLElement) => {
      let y = 0;
      for (let e: HTMLElement | null = el; e && e !== mirror; e = e.offsetParent as HTMLElement | null)
        y += e.offsetTop + (e === el ? 0 : e.clientTop);
      return y;
    };
    /** unstick the copy in place: relative, and top 0 over the class's sticky top (e.g. 120px) */
    const pinTwin = (twin: HTMLElement) => {
      twin.style.setProperty("position", "relative", "important");
      twin.style.setProperty("top", "0px");
    };
    const findStickies = () => {
      for (const { twin } of stickies) {
        twin.style.removeProperty("top");
        twin.style.removeProperty("position");
      }
      stickies = [];
      for (const s of sources)
        for (const el of s.querySelectorAll<HTMLElement>('[class*="sticky"]')) {
          const twin = copies.get(el);
          if (!(twin instanceof HTMLElement) || getComputedStyle(el).position !== "sticky") continue;
          pinTwin(twin);
          stickies.push({ real: el, twin, y: pageY(twin) });
        }
    };
    const pinStickies = () => {
      for (const s of stickies) {
        const top = s.real.getBoundingClientRect().top + window.scrollY - s.y;
        if (Math.abs(top - (parseFloat(s.twin.style.top) || 0)) > 0.25) s.twin.style.top = `${top}px`;
      }
    };

    // ---- following the real page ----
    const dirty = new Set<Node>();
    const recopy = () => {
      for (const p of dirty) {
        // a parent inside another dirty branch is re-copied with that branch
        let up = p.parentNode;
        while (up && !dirty.has(up)) up = up.parentNode;
        if (up) continue;
        const d = copies.get(p);
        if (!d) continue;
        while (d.firstChild) d.removeChild(d.firstChild);
        for (let c = p.firstChild; c; c = c.nextSibling) {
          if (c instanceof Element && SKIP.has(c.tagName)) continue;
          d.appendChild(copy(c));
        }
      }
      dirty.clear();
      findStickies();
      scheduleFrame();
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "attributes") {
          const name = r.attributeName;
          const d = copies.get(r.target);
          if (!(d instanceof Element) || !name || KEEP_OWN.has(name)) continue;
          const v = (r.target as Element).getAttribute(name);
          if (v === null) d.removeAttribute(name);
          else d.setAttribute(name, v);
          if (name === "style" && d instanceof HTMLElement && stickies.some((st) => st.twin === d)) {
            // the original's style replaced the pin: put it back
            pinTwin(d);
            scheduleFrame();
          }
        } else if (r.type === "characterData") {
          const d = copies.get(r.target);
          if (d) d.nodeValue = r.target.nodeValue;
        } else {
          dirty.add(r.target);
        }
      }
      if (dirty.size) recopy();
    });
    for (const s of sources) mo.observe(s, { subtree: true, attributes: true, characterData: true, childList: true });

    // pictures appear in the copy once the page has them
    const onLoad = (e: Event) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      const d = copies.get(img);
      if (d instanceof HTMLImageElement && img.currentSrc) d.setAttribute("src", img.currentSrc);
    };
    page.addEventListener("load", onLoad, true);

    // ---- position: the copy's (0,0) at the viewport's (0,0), whatever the lens's place. Layout
    // offsets only: the nav is fixed, and the pill's entrance transform is over by the switch ----
    let ox = 0;
    let oy = 0;
    const place = () => {
      mirror.style.width = `${root.clientWidth}px`;
      ox = 0;
      oy = 0;
      for (let e: HTMLElement | null = lens; e; e = e.offsetParent as HTMLElement | null) {
        ox += e.offsetLeft + (e === lens ? 0 : e.clientLeft);
        oy += e.offsetTop + (e === lens ? 0 : e.clientTop);
      }
    };
    let frameRaf = 0;
    const frame = () => {
      frameRaf = 0;
      if (!alive) return;
      mirror.style.transform = `translate(${-ox}px, ${-oy - window.scrollY}px)`;
      pinStickies();
    };
    function scheduleFrame() {
      if (!frameRaf) frameRaf = requestAnimationFrame(frame);
    }
    window.addEventListener("scroll", scheduleFrame, { passive: true });

    let placeRaf = 0;
    const schedulePlace = () => {
      if (!placeRaf)
        placeRaf = requestAnimationFrame(() => {
          placeRaf = 0;
          if (!alive) return;
          place();
          findStickies();
          frame();
        });
    };
    const ro = new ResizeObserver(schedulePlace);
    ro.observe(document.body);
    ro.observe(pill);
    window.addEventListener("resize", schedulePlace);

    lens.appendChild(mirror);
    place();
    frame();

    // switch over once the pill's entrance has landed, so the copy never slides with it
    const landed = Promise.all(pill.getAnimations().map((a) => a.finished.catch(() => undefined)));
    const fallback = new Promise((r) => setTimeout(r, 1500));
    Promise.race([landed, fallback]).then(() => {
      if (!alive) return;
      root.classList.add("lg-mirror");
      // the lens was display:none until now: its offsets and the copy's layout (sticky tops)
      // only start existing here
      place();
      findStickies();
      frame();
    });

    return () => {
      alive = false;
      root.classList.remove("lg-mirror");
      mo.disconnect();
      ro.disconnect();
      page.removeEventListener("load", onLoad, true);
      window.removeEventListener("scroll", scheduleFrame);
      window.removeEventListener("resize", schedulePlace);
      if (placeRaf) cancelAnimationFrame(placeRaf);
      if (frameRaf) cancelAnimationFrame(frameRaf);
      mirror.remove();
    };
  }, [pillRef, lensRef]);
}
