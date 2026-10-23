/* =========================================================================
   pricing.ts — the one source of every price on the landing page (AUD).
   Copy in i18n.lp.ts references these through {tokens}; change a number here
   and every price, total, the budget example and the form options follow.
   ========================================================================= */

import type { Lang } from "./i18n";

export const PRICING = {
  videos: {
    light: { price: 300, count: 4 }, // confirmed
    growth: { price: 600, count: 8 }, // confirmed
  },
  adsFee: 400, // PROVISIONAL — ad management fee per month, not yet confirmed by Masaki
  adSpend: { recommendedMin: 500 }, // recommended monthly ad spend, paid to Meta
  promo: { short: 400, launch: 800, demo: 1200 }, // confirmed one-off 16:9 promos
  example: { budget: 1500 }, // the budget-section worked example
} as const;

const lightAds = PRICING.videos.light.price + PRICING.adsFee;
const growthAds = PRICING.videos.growth.price + PRICING.adsFee;

export const DERIVED = {
  lightAds,
  growthAds,
  perVideo: PRICING.videos.light.price / PRICING.videos.light.count,
  /** budget example: what is left for ads after Light + Ads */
  exSpend: PRICING.example.budget - lightAds,
  /** plan-card totals with the recommended ad spend */
  laTotal: lightAds + PRICING.adSpend.recommendedMin,
  gaTotal: growthAds + PRICING.adSpend.recommendedMin,
};

/** amounts the copy can reference as {token} */
const AMOUNTS: Record<string, number> = {
  light: PRICING.videos.light.price,
  growth: PRICING.videos.growth.price,
  adsFee: PRICING.adsFee,
  minSpend: PRICING.adSpend.recommendedMin,
  promoShort: PRICING.promo.short,
  promoLaunch: PRICING.promo.launch,
  promoDemo: PRICING.promo.demo,
  exBudget: PRICING.example.budget,
  ...DERIVED,
};

/** EN shows "$" (Australian readers), JA shows "A$" */
export function money(n: number, lang: Lang) {
  const s = n.toLocaleString("en-AU");
  return lang === "ja" ? `A$${s}` : `$${s}`;
}

/** resolve {token} placeholders in a copy string */
export function fillPrices(s: string, lang: Lang) {
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (k in AMOUNTS ? money(AMOUNTS[k], lang) : m));
}
