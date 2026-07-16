"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useT } from "./LangProvider";
import { INDUSTRY_OPTIONS, type Lang } from "@/lib/i18n";

const inputClass =
  "rounded-2xl bg-white border border-line px-4 py-3 text-[16px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition";

type Status = "idle" | "sending" | "ok" | "err";

export default function Contact({
  industries,
  showPromo = true,
}: {
  /** per-language industry dropdown options; defaults to the global INDUSTRY_OPTIONS. /jp passes its own. */
  industries?: Record<Lang, string[]>;
  /** whether the one-off promo plan appears in the plan dropdown (hidden on /jp). */
  showPromo?: boolean;
} = {}) {
  const { t, cur } = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [plan, setPlan] = useState(""); // selected plan key: "" | light | std | promo | undecided

  // A plan card (or the promo CTA) was clicked: pre-select it in the plan dropdown.
  // (The anchor href="#contact" + SmoothScroll handle scrolling to the form.)
  useEffect(() => {
    const onPlan = (e: Event) => {
      const which = (e as CustomEvent).detail as string;
      if (["light", "std", "promo", "undecided"].includes(which)) setPlan(which);
    };
    window.addEventListener("vai:plan", onPlan);
    return () => window.removeEventListener("vai:plan", onPlan);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      business: String(fd.get("business") ?? ""),
      plan: String(fd.get("plan") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      email: String(fd.get("email") ?? ""),
      social_platform: String(fd.get("social_platform") ?? ""),
      social: String(fd.get("social") ?? ""),
      post: String(fd.get("post") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      form.reset();
      setPlan("");
    } catch {
      setStatus("err");
    }
  }

  const planLabel = {
    light: `${t("pr.light.name")} — ${t("pr.light.price")}${t("pr.light.per")}`,
    std: `${t("pr.std.name")} — ${t("pr.std.price")}${t("pr.std.per")}`,
    promo: t("ct.plan.promo"),
    undecided: t("ct.plan.undecided"),
  };

  const sending = status === "sending";

  return (
    <section id="contact" className="px-5 py-24 sm:py-32 bg-[#FAFAFA]">
      <div className="mx-auto max-w-2xl">
        <h2
          className="tight text-center font-extrabold tracking-tight"
          style={{ fontSize: "clamp(28px,4.4vw,44px)" }}
        >
          {t("ct.title")}
        </h2>
        <p className="mt-4 text-center text-[17px] text-ink-soft">{t("ct.sub")}</p>

        <form
          onSubmit={onSubmit}
          className="mt-12 card rounded-5xl p-6 sm:p-9 grid sm:grid-cols-2 gap-4 shadow-soft"
        >
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-[13px] font-semibold text-ink-soft">{t("ct.plan")}</span>
            <select
              name="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled hidden>
                {t("ct.plan.ph")}
              </option>
              <option value="light">{planLabel.light}</option>
              <option value="std">{planLabel.std}</option>
              {showPromo && <option value="promo">{planLabel.promo}</option>}
              <option value="undecided">{planLabel.undecided}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink-soft">{t("ct.name")}</span>
            <input type="text" name="name" required autoComplete="name" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink-soft">{t("ct.biz")}</span>
            <input type="text" name="business" autoComplete="organization" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink-soft">{t("ct.ind")}</span>
            <select name="industry" className={inputClass} defaultValue="">
              <option value="" disabled hidden>
                {t("ct.ind.ph")}
              </option>
              {(industries?.[cur] ?? INDUSTRY_OPTIONS[cur]).map((label, idx) => (
                <option key={idx} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink-soft">{t("ct.email")}</span>
            <input type="email" name="email" required autoComplete="email" className={inputClass} />
          </label>
          {/* social handle + posting are monthly-service concerns — irrelevant for a one-off promo */}
          {plan !== "promo" && (
            <>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[13px] font-semibold text-ink-soft">{t("ct.handle")}</span>
                <div className="grid grid-cols-1 sm:grid-cols-[210px_1fr] gap-3">
                  <select
                    name="social_platform"
                    defaultValue=""
                    aria-label={t("ct.handle")}
                    className={inputClass}
                  >
                    <option value="" disabled hidden>
                      {t("ct.social.choose")}
                    </option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="X (Twitter)">X (Twitter)</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Website">{t("ct.social.website")}</option>
                    <option value="Other">{t("ct.social.other")}</option>
                  </select>
                  <input
                    type="text"
                    name="social"
                    placeholder={t("ct.handle.ph")}
                    className={inputClass}
                  />
                </div>
              </div>

              <div
                role="radiogroup"
                aria-label={t("ct.post.q")}
                className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3.5"
              >
                <span className="text-[15px] font-semibold">{t("ct.post.q")}</span>
                <div className="inline-flex rounded-full bg-black/[0.04] p-1 text-[14px] font-semibold">
                  <label className="cursor-pointer">
                    <input type="radio" name="post" value="yes" className="peer sr-only" defaultChecked />
                    <span className="block rounded-full px-4 py-1.5 peer-checked:bg-ink peer-checked:text-white transition">
                      {t("ct.post.yes")}
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="post" value="no" className="peer sr-only" />
                    <span className="block rounded-full px-4 py-1.5 peer-checked:bg-ink peer-checked:text-white transition">
                      {t("ct.post.no")}
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-[13px] font-semibold text-ink-soft">{t("ct.msg")}</span>
            <textarea
              name="message"
              rows={4}
              placeholder={t("ct.msg.ph")}
              className={`${inputClass} resize-none`}
            />
          </label>

          <p className="sm:col-span-2 text-[13px] text-ink-mute leading-relaxed">{t("ct.photos")}</p>

          <button
            type="submit"
            disabled={sending}
            className="lg-btn lg-btn--dark sm:col-span-2 inline-flex justify-center px-6 py-4 text-[16px] font-semibold text-white disabled:opacity-70"
          >
            {sending ? t("ct.sending") : t("ct.send")}
          </button>

          <p
            aria-live="polite"
            className={`sm:col-span-2 text-center text-[15px] font-semibold ${
              status === "err" ? "text-red-500" : "text-accent-deep"
            } ${status === "ok" || status === "err" ? "" : "sr-only"}`}
          >
            {status === "ok" ? t("ct.ok") : status === "err" ? t("ct.err") : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
