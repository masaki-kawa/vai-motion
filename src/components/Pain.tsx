"use client";

import type { ReactNode } from "react";
import { useT } from "./LangProvider";

function IconCamera() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#335FB0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="14" height="12" rx="2.5" />
      <circle cx="10" cy="13" r="3" />
      <path d="M7 7l1.4-2h3.2L13 7" />
      <path d="M17 10.5l4-2v8l-4-2" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#335FB0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 3.5H6a2.5 2.5 0 0 0-2.5 2.5v6.5L13 22l8-8L12.5 3.5Z" />
      <circle cx="8" cy="8" r="1.4" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#335FB0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </svg>
  );
}

function PainCard({ n, icon, t, d }: { n: string; icon: ReactNode; t: string; d: string }) {
  return (
    <div className="card rounded-4xl p-8 sm:p-9 hover:-translate-y-1 transition duration-300">
      <div className="flex items-center justify-between">
        <span className="text-accent font-extrabold text-[15px] tracking-[0.18em]">{n}</span>
        <span className="grid place-items-center h-10 w-10 rounded-full bg-accent-soft text-accent-deep">
          {icon}
        </span>
      </div>
      <h3 className="mt-6 text-[20px] sm:text-[22px] font-bold leading-snug">{t}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{d}</p>
    </div>
  );
}

export default function Pain() {
  const { t } = useT();
  return (
    <section className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2
          className="tight text-center font-extrabold tracking-tight"
          style={{ fontSize: "clamp(28px,4.4vw,44px)" }}
        >
          {t("pain.title")}
        </h2>
        <p className="mt-4 mx-auto max-w-xl text-center text-[17px] leading-relaxed text-ink-soft">
          {t("pain.sub")}
        </p>
        <div className="mt-14 grid sm:grid-cols-3 gap-4 sm:gap-5">
          <PainCard n="01" icon={<IconCamera />} t={t("pain.1.t")} d={t("pain.1.d")} />
          <PainCard n="02" icon={<IconTag />} t={t("pain.2.t")} d={t("pain.2.d")} />
          <PainCard n="03" icon={<IconCalendar />} t={t("pain.3.t")} d={t("pain.3.d")} />
        </div>
      </div>
    </section>
  );
}
