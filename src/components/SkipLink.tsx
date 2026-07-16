"use client";

import { useT } from "./LangProvider";

export default function SkipLink() {
  const { t } = useT();
  return (
    <a
      href="#top"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-[14px] focus:font-semibold focus:text-white focus:shadow-lift"
    >
      {t("a11y.skip")}
    </a>
  );
}
