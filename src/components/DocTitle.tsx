"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { useT } from "./LangProvider";

/** Keeps document.title in the current language after a toggle (the server title covers first load). */
export default function DocTitle({ titles }: { titles: Record<Lang, string> }) {
  const { cur } = useT();
  useEffect(() => {
    document.title = titles[cur];
  }, [cur, titles]);
  return null;
}
