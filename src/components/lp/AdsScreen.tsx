"use client";

import { useT } from "../LangProvider";

/**
 * The picture on the Mac's screen in the Ads row: VAI's own monthly report for a sample shop,
 * drawn as one SVG (1280 × 800, a 16:10 screen) so it scales with the photo and needs no images.
 * Deliberately not Meta's Ads Manager: Meta's brand terms need approval for its logo and don't
 * allow edited screenshots of its UI. Every number is made up and the screen says so.
 */

const W = 1280;
const H = 800;
const INK = "#14181c";
const SOFT = "#5b616a";
const MUTED = "#8a9098";
const LINE = "#e3e5e8";
const FILL = "#f4f5f6";

/** the four videos posted that month: day posted, impressions, reach, watched to the end, spend (A$) */
const VIDEOS = [
  { day: 1, imp: 18940, reach: 9820, end: 2910, spend: 185 },
  { day: 8, imp: 21730, reach: 11350, end: 3540, spend: 205 },
  { day: 15, imp: 31280, reach: 14020, end: 4890, spend: 260 },
  { day: 22, imp: 14470, reach: 7610, end: 2050, spend: 150 },
] as const;
const TOTAL_IMP = VIDEOS.reduce((a, v) => a + v.imp, 0); // 86,420

/** daily impressions for 30 days: a lift after each new video that fades over the week, scaled
    so the month adds up to the videos' total */
const DAILY = (() => {
  const raw = Array.from({ length: 30 }, (_, i) => {
    const d = i + 1;
    const last = [...VIDEOS].reverse().find((v) => v.day <= d)!;
    const lift = (last.imp / 20000) * 1500 * Math.exp(-(d - last.day) / 2.6);
    const wave = 160 * Math.sin(d * 1.7) + 90 * Math.cos(d * 0.9);
    return 1900 + lift + wave;
  });
  const k = TOTAL_IMP / raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => Math.round(v * k));
})();

const COPY = {
  ja: {
    label: "月次レポートの画面イメージ。サンプルのカフェの1か月分の広告の結果で、数字はすべて仮のものです。",
    app: "月次レポート",
    month: "2026年9月",
    sample: "イメージ",
    shop: "サンプル・カフェ（シドニー）",
    sub: "Instagram・Facebook広告　／　お店から3km以内の人に表示",
    kpi: [
      ["広告費", "A$800", "予算どおり"],
      ["表示回数", "86,420", "先月比 +21%"],
      ["見た人の数", "34,910", "先月比 +16%"],
      ["プロフィールへのアクセス", "1,264", "先月比 +28%"],
    ],
    chart: "日別の表示回数",
    posted: "新しい動画を公開",
    best: "いちばん見られた動画",
    next: "来月は、この雰囲気の動画を増やします。",
    cols: ["動画", "公開日", "表示回数", "見た人の数", "最後まで再生", "広告費"],
    names: ["動画1　朝のコーヒー", "動画2　焼きたてのパン", "動画3　ランチの盛り付け", "動画4　週末のブランチ"],
    date: (d: number) => `9月${d}日`,
    tick: (d: number) => `9/${d}`,
    stats: ["表示回数", "見た人の数", "最後まで再生"],
    note: "※数字はすべてイメージです",
  },
  en: {
    label: "A sample monthly report on screen: one month of ads for a sample café. All numbers are made up.",
    app: "Monthly report",
    month: "September 2026",
    sample: "Sample",
    shop: "Sample Café (Sydney)",
    sub: "Instagram & Facebook ads  ·  shown to people within 3 km of the shop",
    kpi: [
      ["Ad spend", "A$800", "On budget"],
      ["Impressions", "86,420", "+21% on last month"],
      ["People reached", "34,910", "+16% on last month"],
      ["Profile visits", "1,264", "+28% on last month"],
    ],
    chart: "Impressions per day",
    posted: "New video posted",
    best: "Most-watched video",
    next: "Next month: more videos like this one.",
    cols: ["Video", "Posted", "Impressions", "Reach", "Watched to end", "Spend"],
    names: ["Video 1 · Morning coffee", "Video 2 · Fresh bread", "Video 3 · Lunch plating", "Video 4 · Weekend brunch"],
    date: (d: number) => `${d} Sep`,
    tick: (d: number) => `${d} Sep`,
    stats: ["Impressions", "Reach", "Watched to end"],
    note: "All figures are samples.",
  },
} as const;

const n = (v: number) => v.toLocaleString("en-AU");

/* chart geometry */
const CX0 = 96;
const CX1 = 792;
const CY0 = 356;
const CY1 = 516;
const YMAX = 5000;
const px = (i: number) => CX0 + (i / 29) * (CX1 - CX0);
const py = (v: number) => CY1 - (v / YMAX) * (CY1 - CY0);

export default function AdsScreen({ className }: { className?: string }) {
  const { cur } = useT();
  const c = COPY[cur];
  const line = DAILY.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join("");
  const area = `${line}L${CX1} ${CY1}L${CX0} ${CY1}Z`;
  const best = VIDEOS[2];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={c.label}
      className={className}
      style={{ display: "block", width: "100%", height: "auto", fontVariantNumeric: "tabular-nums" }}
    >
      <rect width={W} height={H} fill="#fff" />

      {/* ---- top bar ---- */}
      <rect width={W} height={56} fill="#fff" />
      <line x1={0} x2={W} y1={56.5} y2={56.5} stroke={LINE} />
      {/* the real lockup (1920 × 819), never a redrawn mark */}
      <image href="/assets/vai-motion-logo-h.png" x={22} y={3} width={118} height={50} />
      <line x1={150.5} x2={150.5} y1={18} y2={38} stroke={LINE} />
      <text x={166} y={33} fontSize={15} fill={SOFT}>
        {c.app}
      </text>
      <rect x={1044} y={14} width={124} height={28} rx={14} fill="#fff" stroke={LINE} />
      <text x={1106} y={33} fontSize={13} fill={INK} textAnchor="middle">
        {c.month}
      </text>
      <rect x={1176} y={14} width={72} height={28} rx={14} fill={INK} />
      <text x={1212} y={33} fontSize={13} fontWeight={700} fill="#fff" textAnchor="middle">
        {c.sample}
      </text>

      {/* ---- shop ---- */}
      <text x={32} y={100} fontSize={26} fontWeight={700} fill={INK}>
        {c.shop}
      </text>
      <text x={32} y={127} fontSize={14} fill={SOFT}>
        {c.sub}
      </text>

      {/* ---- four numbers ---- */}
      {c.kpi.map(([k, v, d], i) => {
        const x = 32 + i * 308;
        return (
          <g key={k}>
            <rect x={x} y={148} width={292} height={104} rx={14} fill={FILL} />
            <text x={x + 20} y={176} fontSize={13} fill={SOFT}>
              {k}
            </text>
            <text x={x + 20} y={218} fontSize={32} fontWeight={700} fill={INK}>
              {v}
            </text>
            <text x={x + 20} y={240} fontSize={12} fill={i ? INK : SOFT} fontWeight={i ? 600 : 400}>
              {d}
            </text>
          </g>
        );
      })}

      {/* ---- impressions per day ---- */}
      <rect x={32} y={272} width={784} height={272} rx={14} fill="#fff" stroke={LINE} />
      <text x={56} y={306} fontSize={15} fontWeight={700} fill={INK}>
        {c.chart}
      </text>
      <circle cx={CX1 - 150} cy={301} r={5} fill={INK} stroke="#fff" strokeWidth={2} />
      <text x={CX1 - 138} y={306} fontSize={12} fill={SOFT}>
        {c.posted}
      </text>
      {[0, 2500, 5000].map((v) => (
        <g key={v}>
          <line x1={CX0} x2={CX1} y1={py(v)} y2={py(v)} stroke={v ? LINE : "#c9cdd2"} />
          <text x={CX0 - 10} y={py(v) + 4} fontSize={11} fill={MUTED} textAnchor="end">
            {n(v)}
          </text>
        </g>
      ))}
      {[1, 8, 15, 22, 29].map((d) => (
        <text key={d} x={px(d - 1)} y={CY1 + 20} fontSize={11} fill={MUTED} textAnchor="middle">
          {c.tick(d)}
        </text>
      ))}
      <path d={area} fill={INK} fillOpacity={0.06} />
      <path d={line} fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {VIDEOS.map((v) => (
        <circle key={v.day} cx={px(v.day - 1)} cy={py(DAILY[v.day - 1])} r={5} fill={INK} stroke="#fff" strokeWidth={2} />
      ))}

      {/* ---- most-watched video ---- */}
      <rect x={832} y={272} width={416} height={272} rx={14} fill="#fff" stroke={LINE} />
      <text x={856} y={306} fontSize={15} fontWeight={700} fill={INK}>
        {c.best}
      </text>
      <defs>
        <linearGradient id="ads-thumb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3d41" />
          <stop offset="1" stopColor="#141619" />
        </linearGradient>
      </defs>
      <rect x={856} y={324} width={128} height={160} rx={10} fill="url(#ads-thumb)" />
      <path d="M911 393l18 11-18 11z" fill="#fff" fillOpacity={0.9} />
      <text x={1004} y={346} fontSize={14} fontWeight={700} fill={INK}>
        {c.names[2]}
      </text>
      {[best.imp, best.reach, best.end].map((v, i) => (
        <g key={i}>
          <text x={1004} y={382 + i * 34} fontSize={12} fill={SOFT}>
            {c.stats[i]}
          </text>
          <text x={1224} y={382 + i * 34} fontSize={15} fontWeight={700} fill={INK} textAnchor="end">
            {n(v)}
          </text>
          <line x1={1004} x2={1224} y1={392.5 + i * 34} y2={392.5 + i * 34} stroke={LINE} />
        </g>
      ))}
      <rect x={856} y={500} width={368} height={28} rx={8} fill={FILL} />
      <text x={868} y={519} fontSize={12} fontWeight={600} fill={INK}>
        {c.next}
      </text>

      {/* ---- the four videos ---- */}
      <rect x={32} y={564} width={1216} height={204} rx={14} fill="#fff" stroke={LINE} />
      {c.cols.map((h, i) => (
        <text
          key={h}
          x={i ? [0, 560, 736, 888, 1048, 1224][i] : 56}
          y={596}
          fontSize={12}
          fill={MUTED}
          textAnchor={i > 1 ? "end" : "start"}
        >
          {h}
        </text>
      ))}
      {VIDEOS.map((v, r) => {
        const y = 632 + r * 36;
        return (
          <g key={v.day}>
            <line x1={56} x2={1224} y1={y - 22.5} y2={y - 22.5} stroke={LINE} />
            <rect x={56} y={y - 16} width={18} height={22} rx={4} fill="url(#ads-thumb)" />
            <text x={86} y={y} fontSize={14} fontWeight={600} fill={INK}>
              {c.names[r]}
            </text>
            <text x={560} y={y} fontSize={14} fill={SOFT}>
              {c.date(v.day)}
            </text>
            <text x={736} y={y} fontSize={14} fill={INK} textAnchor="end">
              {n(v.imp)}
            </text>
            <text x={888} y={y} fontSize={14} fill={INK} textAnchor="end">
              {n(v.reach)}
            </text>
            <text x={1048} y={y} fontSize={14} fill={INK} textAnchor="end">
              {n(v.end)}
            </text>
            <text x={1224} y={y} fontSize={14} fill={INK} textAnchor="end">
              A${v.spend}
            </text>
          </g>
        );
      })}
      <text x={1248} y={788} fontSize={11} fill={MUTED} textAnchor="end">
        {c.note}
      </text>
    </svg>
  );
}
