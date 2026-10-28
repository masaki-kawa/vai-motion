"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { I18N, type Lang } from "@/lib/i18n";
import { LANG_COOKIE } from "@/lib/lang";

type LangCtx = {
  cur: Lang;
  setLang: (l: Lang) => void;
  /** plain text translation */
  t: (key: string) => string;
};

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = "reelmate_lang"; // legacy key name, kept for continuity

export function LangProvider({
  children,
  initialLang = "en",
  dict = I18N,
}: {
  children: ReactNode;
  /** resolved server-side (cookie / ?lang=) so SSR renders the right language with no flash */
  initialLang?: Lang;
  /** copy dictionary; defaults to the AU/global I18N. The Japan-market route (/jp) passes its own. */
  dict?: Record<Lang, Record<string, string>>;
}) {
  const [cur, setCur] = useState<Lang>(initialLang);

  const setLang = useCallback((lang: Lang) => {
    setCur(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
    // persist to a cookie so the next server render starts in the right language (no flash)
    try {
      document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
    applyHtml(lang);
    // reflect in the URL without a navigation
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("lang", lang);
      window.history.replaceState(window.history.state, "", u);
    } catch {}
  }, []);

  // The server already rendered `initialLang` (and layout set the <html> class from the cookie).
  // On mount, reconcile the class with what we hold and migrate older localStorage-only prefs.
  useEffect(() => {
    applyHtml(cur);
    // storage and cookies can throw (blocked site data, sandboxed frames); the page works without them
    try {
      // ?lang= wins: pages that cannot read it on the server (privacy, terms) still open in the linked language
      const q = new URLSearchParams(window.location.search).get("lang");
      if ((q === "en" || q === "ja") && q !== cur) {
        setLang(q);
        return;
      }
      const hasCookie = document.cookie.includes(`${LANG_COOKIE}=`);
      if (!hasCookie) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if ((saved === "en" || saved === "ja") && saved !== cur) setLang(saved);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = useCallback((key: string) => dict[cur][key] ?? key, [cur, dict]);

  const value = useMemo<LangCtx>(() => ({ cur, setLang, t }), [cur, setLang, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function applyHtml(lang: Lang) {
  document.documentElement.lang = lang;
  document.documentElement.classList.toggle("lang-ja", lang === "ja");
}

export function useT() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useT must be used within <LangProvider>");
  return ctx;
}
