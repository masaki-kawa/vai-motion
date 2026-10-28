"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { useT } from "./LangProvider";

/** Keeps document.title in the current language after a toggle (the server title covers first load). */
export default function DocTitle({ titles }: { titles: Record<Lang, string> }) {
  const { cur } = useT();
  useEffect(() => {
    const want = titles[cur];
    document.title = want;
    // A language switch during hydration (?lang= on a page the server rendered in the other
    // language) races React's own <title> hydration, which writes the server title back a tick
    // later. Watch the element briefly and put ours back.
    const el = document.querySelector("title");
    if (!el) return;
    const mo = new MutationObserver(() => {
      if (document.title !== want) document.title = want;
    });
    mo.observe(el, { childList: true, characterData: true, subtree: true });
    const stop = window.setTimeout(() => mo.disconnect(), 3000);
    return () => {
      window.clearTimeout(stop);
      mo.disconnect();
    };
  }, [cur, titles]);
  return null;
}
