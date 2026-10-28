import type { MetadataRoute } from "next";

// both files are the same for every request, so they can also be written out by a static export
export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vai-motion.vercel.app";

/** one page in two languages; /jp (the older Japanese site) is listed as is */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: `${BASE}/`, ja: `${BASE}/?lang=ja`, "x-default": `${BASE}/` };
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${BASE}/?lang=ja`, changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/jp`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
