"use client";

import { useT } from "./LangProvider";
import { WORK } from "@/lib/data";
import ReelCard from "./ReelCard";

function GroupLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-mute">{label}</span>
      <span className="text-[12px] font-semibold text-ink-mute/70">{count}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default function RecentWork() {
  const { t } = useT();
  const verticals = WORK.filter((w) => !w.wide);
  const wides = WORK.filter((w) => w.wide);

  return (
    <section id="work" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <h2
            className="tight font-extrabold tracking-tight"
            style={{ fontSize: "clamp(28px,4.4vw,44px)" }}
          >
            {t("work.title")}
          </h2>
        </div>

        <div className="mt-12">
          {verticals.length > 0 && (
            <>
              <GroupLabel label={t("work.grp.reels")} count={verticals.length} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {verticals.map((w, i) => (
                  <ReelCard key={`v-${i}`} cat={w.cat} hover controls />
                ))}
              </div>
            </>
          )}

          {wides.length > 0 && (
            <div className="mt-12">
              <GroupLabel label={t("work.grp.promo")} count={wides.length} />
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {wides.map((w, i) => (
                  <ReelCard key={`w-${i}`} cat={w.cat} hover wide controls />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
