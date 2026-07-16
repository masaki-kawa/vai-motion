/* =========================================================================
   data.ts — static content maps for the VAI MOTION landing page
   Ported from the prototype's app.js data section.
   ========================================================================= */

import type { Lang } from "./i18n";

export type Category =
  | "rest"
  | "beauty"
  | "retail"
  | "clinic"
  | "jp"
  | "saas"
  | "gym"
  | "language"
  | "brand"
  | "saasad";

/** card base tint [from, to] used behind / before a video loads */
export const TINTS: Record<Category, [string, string]> = {
  rest: ["#EBD8BE", "#F6ECDD"],
  beauty: ["#EBCEd6", "#F7E6EB"],
  retail: ["#CFD8EC", "#E9EEF7"],
  clinic: ["#C4DCCE", "#E7F1EB"],
  jp: ["#E6C2B8", "#F4E0DA"],
  saas: ["#CBCEEC", "#E8E9F8"],
  gym: ["#3A4252", "#5A6478"],
  language: ["#C9D3E8", "#E8EEF8"],
  brand: ["#D5D8DF", "#EBEDF1"],
  saasad: ["#CBCEEC", "#E8E9F8"],
};

export const LABELS: Record<Category, Record<Lang, string>> = {
  rest: { en: "café", ja: "カフェ" },
  beauty: { en: "salon", ja: "サロン" },
  retail: { en: "product", ja: "物販" },
  clinic: { en: "clinic", ja: "クリニック" },
  jp: { en: "izakaya", ja: "居酒屋" },
  saas: { en: "SaaS promo", ja: "SaaSプロモ" },
  gym: { en: "Gym", ja: "ジム" },
  language: { en: "language school", ja: "語学学校" },
  brand: { en: "Brand Video", ja: "ブランド動画" },
  saasad: { en: "Saas Ad", ja: "Saas Ad" },
};

export type VideoSrc = { src: string; poster?: string };

/** real videos by category (optimized H.264/AAC mp4 — universally playable with audio).
 *  Categories without an entry render a tinted placeholder. */
export const VIDEOS: Partial<Record<Category, VideoSrc>> = {
  rest: { src: "/assets/cafe.mp4", poster: "/assets/cafe-poster.jpg" },
  gym: { src: "/assets/reel-1.mp4", poster: "/assets/reel-1-poster.jpg" },
  language: { src: "/assets/language-school.mp4", poster: "/assets/language-school-poster.jpg" },
  jp: { src: "/assets/izakaya.mp4", poster: "/assets/izakaya-poster.jpg" },
  beauty: { src: "/assets/salon.mp4", poster: "/assets/salon-poster.jpg" },
  brand: { src: "/assets/brand-video.mp4", poster: "/assets/brand-poster.jpg" },
  saasad: { src: "/assets/saas-ad.mp4", poster: "/assets/saas-ad-poster.jpg" },
  saas: { src: "/assets/saas-promo.mp4", poster: "/assets/saas-promo-poster.jpg" },
};

export type WorkItem = { cat: Category; wide?: boolean };

export const WORK: WorkItem[] = [
  { cat: "gym" },
  { cat: "language" },
  { cat: "rest" },
  { cat: "beauty" },
  { cat: "jp" },
  { cat: "saas", wide: true },
  { cat: "brand", wide: true },
  { cat: "saasad", wide: true },
];

/** off-screen launch vectors for the hero scatter fly-in [fx, fy] */
export const FROM: Record<string, [string, string]> = {
  L: ["-65vw", "-4vh"],
  R: ["65vw", "6vh"],
  T: ["3vw", "-60vh"],
  B: ["-5vw", "60vh"],
  TL: ["-55vw", "-45vh"],
  TR: ["52vw", "-48vh"],
  BL: ["-50vw", "50vh"],
  BR: ["55vw", "46vh"],
};

export type ScatterCard = {
  cat: Category;
  left: number;
  top: number;
  w: number;
  rot: number;
  from: keyof typeof FROM | string;
  d: number;
  spin: number;
  bdur: number;
  wide?: boolean;
};

/* positions are % within the hero's right-column stage, spread across ≈10–90% in three
   loose rows so the cards breathe horizontally instead of clustering — see Hero.tsx */
export const HERO_SCATTER: ScatterCard[] = [
  { cat: "jp", left: 31, top: 15, w: 144, rot: 7, from: "T", d: 0.13, spin: 24, bdur: 8.0 },
  { cat: "saas", left: 74, top: 16, w: 204, rot: -6, from: "TR", d: 0.16, spin: -22, bdur: 7.1, wide: true },
  { cat: "beauty", left: 10, top: 47, w: 150, rot: -8, from: "TL", d: 0.06, spin: -28, bdur: 6.6 },
  { cat: "gym", left: 47, top: 46, w: 168, rot: -3, from: "B", d: 0, spin: -12, bdur: 6.0 },
  { cat: "language", left: 90, top: 51, w: 124, rot: -11, from: "TR", d: 0.32, spin: -30, bdur: 7.3 },
  { cat: "brand", left: 22, top: 83, w: 210, rot: 5, from: "BL", d: 0.2, spin: 18, bdur: 7.6, wide: true },
  { cat: "rest", left: 64, top: 84, w: 142, rot: 9, from: "R", d: 0.27, spin: 30, bdur: 6.9 },
];
