"use client";

import { useT } from "./LangProvider";
import type { Lang } from "@/lib/i18n";

const OPTS: { lang: Lang; label: string }[] = [
  { lang: "en", label: "EN" },
  { lang: "ja", label: "日本語" },
];

export default function LangToggle() {
  const { cur, setLang } = useT();
  return (
    <div
      role="group"
      aria-label="Language / 言語"
      className="flex items-center rounded-full bg-black/[0.04] p-0.5 text-[13px] font-semibold"
    >
      {OPTS.map(({ lang, label }) => {
        const on = cur === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLang(lang)}
            aria-pressed={on}
            lang={lang}
            className={`rounded-full px-3 py-1.5 transition ${
              on ? "bg-white shadow-sm text-ink" : "text-ink-mute"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
