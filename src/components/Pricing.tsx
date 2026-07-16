"use client";

import { useState } from "react";
import { useT } from "./LangProvider";

function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 grid place-items-center h-5 w-5 shrink-0 rounded-full bg-accent-soft text-accent-deep">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.2 5 8.5 9.5 3.5" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}

function RatioTag({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#335FB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="10" rx="2" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

/* comparison marks: accent ✓ for the recommended row, muted ✗ for the alternatives */
function Mark({ good }: { good?: boolean }) {
  return good ? (
    <span className="grid place-items-center h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-full bg-accent text-white">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  ) : (
    <span className="grid place-items-center h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-full bg-black/[0.06] text-ink-mute">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </span>
  );
}

export default function Pricing({
  showPromo = true,
  showComparison = true,
}: {
  /** one-off promo tab. AU shows it; the Japan-market route hides it (monthly only). */
  showPromo?: boolean;
  /** agency / DIY price comparison. Hidden on /jp so the page doesn't read as a price war. */
  showComparison?: boolean;
} = {}) {
  const { t } = useT();
  const [tab, setTab] = useState<"monthly" | "promo">("monthly");

  return (
    <section id="pricing" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <h2
          className="tight text-center font-extrabold tracking-tight"
          style={{ fontSize: "clamp(28px,4.4vw,44px)" }}
        >
          {t("pr.title")}
        </h2>

        {/* tabs */}
        {showPromo && (
        <div className="mt-8 flex justify-center">
          <div role="tablist" className="glass inline-flex gap-1 rounded-full p-1.5">
            <button
              onClick={() => setTab("monthly")}
              className={`ptab rounded-full px-5 py-2.5 text-[14px] font-semibold transition ${
                tab === "monthly" ? "ptab-on" : ""
              }`}
            >
              {t("pr.tab.monthly")}
            </button>
            <button
              onClick={() => setTab("promo")}
              className={`ptab rounded-full px-5 py-2.5 text-[14px] font-semibold transition ${
                tab === "promo" ? "ptab-on" : ""
              }`}
            >
              {t("pr.tab.promo")}
            </button>
          </div>
        </div>
        )}

        {/* ---- monthly panel ---- */}
        {tab === "monthly" && (
          <div>
            {/* price cards first */}
            <div className="mt-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[12.5px] font-bold text-accent-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t("pr.main.badge")}
              </span>
            </div>
            <p className="mt-4 text-center text-[17px] text-ink-soft">{t("pr.sub")}</p>

            <div className="mt-8 grid md:grid-cols-2 gap-5 items-stretch">
              {/* Light */}
              <div className="card rounded-5xl p-8 sm:p-9 flex flex-col">
                <div className="text-[14px] font-bold uppercase tracking-wide text-ink-mute">
                  {t("pr.light.name")}
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-[46px] font-extrabold tracking-tight leading-none tight">
                    {t("pr.light.price")}
                  </span>
                  <span className="text-[16px] font-semibold text-ink-mute mb-1.5">
                    {t("pr.light.per")}
                  </span>
                </div>
                <p className="mt-3 text-[15px] text-ink-soft">{t("pr.light.tag")}</p>
                <p className="mt-1.5 text-[13px] text-ink-mute">{t("pr.light.unit")}</p>
                <div className="flex-1 min-h-[12px]" />
                <a
                  href="#contact"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("vai:plan", { detail: "light" }))
                  }
                  className="lg-btn lg-btn--light mt-8 inline-flex justify-center px-6 py-3.5 font-semibold"
                >
                  {t("pr.cta.light")}
                </a>
              </div>

              {/* Growth */}
              <div className="card card--rec relative rounded-5xl p-8 sm:p-9 flex flex-col">
                <span className="absolute -top-3 left-8 z-10 rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-bold text-white whitespace-nowrap">
                  {t("pr.rec")}
                </span>
                <div className="text-[14px] font-bold uppercase tracking-wide text-accent-deep">
                  {t("pr.std.name")}
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-[46px] font-extrabold tracking-tight leading-none tight">
                    {t("pr.std.price")}
                  </span>
                  <span className="text-[16px] font-semibold text-ink-mute mb-1.5">
                    {t("pr.std.per")}
                  </span>
                </div>
                <p className="mt-3 text-[15px] text-ink-soft">{t("pr.std.tag")}</p>
                <p className="mt-2 inline-flex rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-semibold text-accent-deep">
                  {t("pr.std.unit")}
                </p>
                <div className="flex-1 min-h-[12px]" />
                <a
                  href="#contact"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("vai:plan", { detail: "std" }))
                  }
                  className="lg-btn lg-btn--dark mt-8 inline-flex justify-center px-6 py-3.5 font-semibold text-white"
                >
                  {t("pr.cta.std")}
                </a>
              </div>
            </div>

            <div className="mt-6 card rounded-4xl px-7 py-6 sm:px-8">
              <div className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-ink-mute">
                {t("pr.incl.title")}
              </div>
              <ul className="mt-4 grid sm:grid-cols-2 gap-x-10 gap-y-3 text-[15px]">
                <CheckRow>{t("pr.row.1")}</CheckRow>
                <CheckRow>{t("pr.row.2")}</CheckRow>
                <CheckRow>{t("pr.row.3")}</CheckRow>
                <CheckRow>{t("pr.row.4")}</CheckRow>
              </ul>
            </div>
            <p className="mt-6 mx-auto max-w-2xl text-center text-[13.5px] leading-relaxed text-ink-mute">
              {t("pr.note")}
            </p>

            {/* comparison / positioning — below the price cards (hidden on /jp) */}
            {showComparison && (
              <div className="mt-20 sm:mt-24">
              <p className="mx-auto max-w-2xl text-center text-[17px] leading-relaxed text-ink-soft">
                {t("pos.sub")}
              </p>

              {/* positioning parallelogram stack */}
              <div className="mt-12 mx-auto max-w-3xl flex flex-col gap-5">
                <div className="pcard card rounded-3xl overflow-hidden w-[90%] sm:w-[80%] ml-0">
                  <div className="pcard-in px-6 py-6 sm:px-8 flex items-center gap-4 sm:gap-6">
                    <Mark />
                    <div className="shrink-0 min-w-[100px] sm:min-w-[140px]">
                      <div className="text-[11.5px] font-bold uppercase tracking-wide text-ink-mute">
                        {t("pos.agency.name")}
                      </div>
                      <div className="mt-1.5 text-[22px] sm:text-[24px] font-extrabold tracking-tight leading-none tight text-ink-mute">
                        {t("pos.agency.price")}
                      </div>
                    </div>
                    <p className="text-[14px] leading-relaxed text-ink-soft flex-1">
                      {t("pos.agency.desc")}
                    </p>
                  </div>
                </div>

                <div className="pcard pcard--hl card card--rec relative z-10 rounded-3xl overflow-hidden w-[96%] sm:w-[88%] ml-[4%] sm:ml-[9%]">
                  <div className="pcard-in px-6 py-6 sm:px-8 flex items-center gap-4 sm:gap-6">
                    <Mark good />
                    <div className="shrink-0 min-w-[100px] sm:min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="text-[11.5px] font-bold uppercase tracking-wide text-accent-deep">
                          {t("pos.us.name")}
                        </div>
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[9.5px] font-bold text-white whitespace-nowrap">
                          {t("pos.us.tag")}
                        </span>
                      </div>
                      <div className="mt-1.5 text-[24px] sm:text-[28px] font-extrabold tracking-tight leading-none tight text-accent-deep">
                        {t("pos.us.price")}
                      </div>
                    </div>
                    <p className="text-[14px] leading-relaxed text-ink-soft flex-1">{t("pos.us.desc")}</p>
                  </div>
                </div>

                <div className="pcard card rounded-3xl overflow-hidden w-[90%] sm:w-[80%] ml-[12%] sm:ml-[22%]">
                  <div className="pcard-in px-6 py-6 sm:px-8 flex items-center gap-4 sm:gap-6">
                    <Mark />
                    <div className="shrink-0 min-w-[100px] sm:min-w-[140px]">
                      <div className="text-[11.5px] font-bold uppercase tracking-wide text-ink-mute">
                        {t("pos.diy.name")}
                      </div>
                      <div className="mt-1.5 text-[22px] sm:text-[24px] font-extrabold tracking-tight leading-none tight text-ink-mute">
                        {t("pos.diy.price")}
                      </div>
                    </div>
                    <p className="text-[14px] leading-relaxed text-ink-soft flex-1">{t("pos.diy.desc")}</p>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* ---- promo panel ---- */}
        {tab === "promo" && (
          <div className="mt-10">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[12.5px] font-bold text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
                {t("promo.kicker")}
              </span>
              <h3
                className="tight mt-5 font-extrabold tracking-tight"
                style={{ fontSize: "clamp(24px,3.6vw,34px)" }}
              >
                {t("promo.title")}
              </h3>
              <p className="mt-4 mx-auto max-w-xl text-[16px] leading-relaxed text-ink-soft">
                {t("promo.sub")}
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-5 items-stretch">
              {([1, 2, 3] as const).map((i) => (
                <div key={i} className="card rounded-4xl p-7 sm:p-8 flex flex-col">
                  <RatioTag label={t("promo.ratio")} />
                  <h4 className="mt-5 text-[20px] font-bold">{t(`promo.${i}.name`)}</h4>
                  <div className="mt-2 text-[28px] font-extrabold tracking-tight leading-none tight">
                    {t(`promo.${i}.price`)}
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft flex-1">
                    {t(`promo.${i}.desc`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-5">
              <p className="mx-auto max-w-2xl text-center text-[13.5px] leading-relaxed text-ink-mute">
                {t("promo.note")}
              </p>
              <a
                href="#contact"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("vai:plan", { detail: "promo" }))
                }
                className="lg-btn lg-btn--light inline-flex items-center px-6 py-3.5 text-[15px] font-semibold"
              >
                {t("promo.cta")}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
