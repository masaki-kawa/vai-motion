"use client";

import Image from "next/image";
import { useT } from "./LangProvider";
import LangToggle from "./LangToggle";

export default function Footer({
  legalLinks = [],
}: {
  /** extra legal links (e.g. 特商法に基づく表記 / 会社情報) shown in the footer. Required for the /jp market. */
  legalLinks?: { href: string; label: string }[];
} = {}) {
  const { t } = useT();
  return (
    <footer className="px-5 pt-16 pb-12 border-t border-line">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
        <div>
          <div className="flex items-center">
            <Image
              src="/assets/vai-motion-logo-h.png"
              alt="VAI MOTION — AI video generation"
              width={280}
              height={56}
              style={{ width: "auto" }}
              className="h-12 sm:h-14 w-auto"
            />
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-soft max-w-xs">{t("ft.tag")}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-4">
          <LangToggle />
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14.5px] text-ink-soft">
            <a href="#work" className="hover:text-ink">
              {t("nav.work")}
            </a>
            <a href="#pricing" className="hover:text-ink">
              {t("nav.pricing")}
            </a>
            {legalLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl mt-10 pt-6 border-t border-line text-[13px] text-ink-mute">
        © 2026 VAI MOTION
      </div>
    </footer>
  );
}
