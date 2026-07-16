import type { Metadata } from "next";

const title = "VAI MOTION — 撮影なしの店舗動画 × 訪日インバウンド";
const description =
  "写真を送るだけ。オーストラリア拠点の日本人チームが、AIと人の手で、訪日客にも届くSNS動画を制作・運用します。撮影なし、月¥30,000〜（税込）。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/jp",
    languages: { ja: "/jp?lang=ja", en: "/jp?lang=en" },
  },
  openGraph: {
    type: "website",
    siteName: "VAI MOTION",
    title,
    description,
    url: "/jp",
    images: [{ url: "/og.jpg?v=2", width: 1200, height: 630, alt: "VAI MOTION" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg?v=2"],
  },
};

// Nested layout: the root layout already owns <html>/<body>. This just scopes /jp metadata.
export default function JpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
