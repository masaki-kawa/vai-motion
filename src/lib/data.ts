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

/** hero showreel: VAI MOTION's own 20s brand film (silent, seamless loop) */
export const HERO_REEL: VideoSrc = {
  src: "/assets/vai-motion-showreel.mp4",
  poster: "/assets/vai-motion-showreel-poster.jpg",
};

/** vertical reels drifting beside the hero showreel (first two left, last two right) */
export const HERO_SIDE: Category[] = ["beauty", "gym", "rest", "jp"];
