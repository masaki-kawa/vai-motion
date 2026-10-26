import type { MetadataRoute } from "next";

// both files are the same for every request, so they can also be written out by a static export
export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaimotion.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
