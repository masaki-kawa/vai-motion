"use client";

import type { ReactNode } from "react";
import { useT } from "./LangProvider";

function ArrowRight() {
  return (
    <svg className="hidden sm:block shrink-0 mx-0.5" width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="#4F84D6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7h20M17 2l5 5-5 5" />
    </svg>
  );
}
function ArrowDown() {
  return (
    <svg className="sm:hidden self-center shrink-0" width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="#4F84D6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2v16M2 13l5 5 5-5" />
    </svg>
  );
}

/* pillar icons */
function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#335FB0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M19 14l.7 1.9L21.5 17l-1.8.7L19 19.5l-.7-1.8L16.5 17l1.8-.7L19 14Z" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#335FB0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* one of the two value pillars: AI engine / human finish */
function Pillar({ icon, t, d, chips }: { icon: ReactNode; t: string; d: string; chips: string[] }) {
  return (
    <div className="card rounded-4xl p-8 flex flex-col overflow-hidden">
      <span className="grid place-items-center h-12 w-12 rounded-2xl bg-accent-soft shrink-0">{icon}</span>
      <h3 className="mt-5 text-[21px] sm:text-[23px] font-bold leading-snug">{t}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft flex-1">{d}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-bold text-accent-deep">
            <CheckIcon />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hybrid() {
  const { t } = useT();
  return (
    <section className="px-5 py-24 sm:py-32 bg-[#FAFAFA]">
      <div className="mx-auto max-w-5xl">
        <h2
          className="tight text-center font-extrabold tracking-tight max-w-2xl mx-auto"
          style={{ fontSize: "clamp(28px,4.4vw,44px)" }}
        >
          {t("hy.title")}
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-center text-[17px] leading-relaxed text-ink-soft">
          {t("hy.sub")}
        </p>

        {/* AI → human flow diagram (glass chips) */}
        <div className="mt-12 mx-auto max-w-3xl">
          <div className="text-center text-[12px] font-bold uppercase tracking-[0.16em] text-ink-mute">
            {t("hy.flow.cap")}
          </div>
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-center gap-2.5 sm:gap-2">
            <div className="card flex items-center gap-3 rounded-2xl px-5 py-3.5 flex-1 justify-center">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-accent-soft text-accent-deep shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#335FB0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
                  <path d="M19 14l.7 1.9L21.5 17l-1.8.7L19 19.5l-.7-1.8L16.5 17l1.8-.7L19 14Z" />
                </svg>
              </span>
              <span className="text-[15px] font-bold whitespace-nowrap">{t("hy.flow.ai")}</span>
            </div>
            <ArrowRight />
            <ArrowDown />
            <div className="card flex items-center gap-3 rounded-2xl px-5 py-3.5 flex-1 justify-center">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-accent-soft text-accent-deep shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#335FB0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3.4" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
              </span>
              <span className="text-[15px] font-bold whitespace-nowrap">{t("hy.flow.human")}</span>
            </div>
            <ArrowRight />
            <ArrowDown />
            <div className="card flex items-center gap-3 rounded-2xl px-5 py-3.5 flex-1 justify-center">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-accent text-white shrink-0">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 3 11 13M21 3l-6.5 18-3.5-8-8-3.5L21 3Z" />
                </svg>
              </span>
              <span className="text-[15px] font-bold whitespace-nowrap">{t("hy.flow.done")}</span>
            </div>
          </div>
        </div>

        {/* two value pillars: AI does the heavy lifting · a human finishes */}
        <div className="mt-16 grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <Pillar icon={<SparkleIcon />} t={t("hy.1.t")} d={t("hy.1.d")} chips={[t("hy.1.c1"), t("hy.1.c2"), t("hy.1.c3")]} />
          <Pillar icon={<PersonIcon />} t={t("hy.2.t")} d={t("hy.2.d")} chips={[t("hy.2.c1"), t("hy.2.c2")]} />
        </div>

        {/* scope strip: not just a video — the whole Instagram operation */}
        <div className="mt-5 max-w-4xl mx-auto card rounded-4xl px-7 py-6 flex flex-col sm:flex-row sm:items-center gap-x-7 gap-y-4 overflow-hidden">
          <span className="text-[15px] font-extrabold tracking-tight shrink-0">{t("hy.scope.label")}</span>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4"].map((n) => (
              <span key={n} className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                {t(`hy.scope.${n}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
