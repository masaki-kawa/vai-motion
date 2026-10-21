/* =========================================================================
   data.ts — static content maps for the VAI MOTION landing page
   Ported from the prototype's app.js data section.
   ========================================================================= */

import type { Lang } from "./i18n";

export type Category =
  | "bornlucky"
  | "r365promo"
  | "ykpromo"
  | "ykspring"
  | "yksake"
  | "r365film"
  | "unjumble"
  | "r365reviews"
  | "r365replies";

/** card base tint [from, to] used behind / before a video loads */
export const TINTS: Record<Category, [string, string]> = {
  bornlucky: ["#1A1430", "#3A2458"],
  r365promo: ["#121A44", "#24307A"],
  ykpromo: ["#EFE8DC", "#F8F4EC"],
  ykspring: ["#F2DCCF", "#FAF0E8"],
  yksake: ["#E9C9B8", "#F5E6DC"],
  r365film: ["#121A44", "#24307A"],
  unjumble: ["#17122A", "#2A2044"],
  r365reviews: ["#E3ECFA", "#F4F8FE"],
  r365replies: ["#E3ECFA", "#F4F8FE"],
};

export const LABELS: Record<Category, Record<Lang, string>> = {
  bornlucky: { en: "Born Lucky · app", ja: "Born Lucky・アプリ" },
  r365promo: { en: "Review 365 · SaaS", ja: "Review 365・SaaS" },
  ykpromo: { en: "Yukoala · concierge", ja: "Yukoala・コンシェルジュ" },
  ykspring: { en: "Yukoala · spring", ja: "Yukoala・春の旅" },
  yksake: { en: "Yukoala · sake festival", ja: "Yukoala・酒フェス" },
  r365film: { en: "Review 365 · promo", ja: "Review 365・プロモ" },
  unjumble: { en: "unjumble · launch", ja: "unjumble・ローンチ" },
  r365reviews: { en: "Review 365 · reel", ja: "Review 365・リール" },
  r365replies: { en: "Review 365 · reel", ja: "Review 365・リール" },
};

export type VideoSrc = { src: string; poster?: string };

/** real client work (H.264/AAC mp4, 720p — universally playable with audio).
 *  Categories without an entry render a tinted placeholder. */
export const VIDEOS: Partial<Record<Category, VideoSrc>> = {
  bornlucky: { src: "/assets/work/born-lucky.mp4", poster: "/assets/work/born-lucky-poster.jpg" },
  r365promo: { src: "/assets/work/review365-promo.mp4", poster: "/assets/work/review365-promo-poster.jpg" },
  ykpromo: { src: "/assets/work/yukoala-promo.mp4", poster: "/assets/work/yukoala-promo-poster.jpg" },
  ykspring: { src: "/assets/work/yukoala-spring.mp4", poster: "/assets/work/yukoala-spring-poster.jpg" },
  yksake: { src: "/assets/work/yukoala-sake.mp4", poster: "/assets/work/yukoala-sake-poster.jpg" },
  r365film: { src: "/assets/work/review365-film.mp4", poster: "/assets/work/review365-film-poster.jpg" },
  unjumble: { src: "/assets/work/unjumble.mp4", poster: "/assets/work/unjumble-poster.jpg" },
  // silent, hero-only ambient loops
  r365reviews: { src: "/assets/work/review365-reviews.mp4", poster: "/assets/work/review365-reviews-poster.jpg" },
  r365replies: { src: "/assets/work/review365-replies.mp4", poster: "/assets/work/review365-replies-poster.jpg" },
};

export type WorkItem = { cat: Category; wide?: boolean };

export const WORK: WorkItem[] = [
  { cat: "bornlucky" },
  { cat: "r365promo" },
  { cat: "ykpromo" },
  { cat: "ykspring" },
  { cat: "yksake" },
  { cat: "r365film", wide: true },
  { cat: "unjumble", wide: true },
];

/** hero showreel: VAI MOTION's own 19s brand film (silent, seamless loop) */
export const HERO_REEL: VideoSrc = {
  src: "/assets/vai-motion-showreel.mp4",
  poster: "/assets/vai-motion-showreel-poster.jpg",
};

/** vertical reels drifting beside the hero showreel (first two left, last two right) */
export const HERO_SIDE: Category[] = ["ykpromo", "r365reviews", "yksake", "r365replies"];
