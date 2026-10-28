import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_JP } from "next/font/google";
import { requestLang } from "@/lib/lang.server";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-jp",
  display: "swap",
});

const title = "VAI MOTION — Videos and Meta ads for Sydney businesses";
// under 160 characters, so search results show the whole sentence
const description =
  "We make short videos from the photos you already have and run them as Instagram and Facebook ads near your shop. No filming. Monthly AUD plans, cancel anytime.";

// set NEXT_PUBLIC_SITE_URL to the production origin (the Vercel URL until a domain is chosen, 2026-10-28)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vai-motion.vercel.app";
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("NEXT_PUBLIC_SITE_URL is not set: canonical, hreflang, og:url and the sitemap use the Vercel URL.");
}

/* the same page serves both languages: "/" is English (and the x-default), "/?lang=ja" Japanese.
   The favicon and Apple icon come from app/icon.png and app/apple-icon.png (file-based metadata). */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "VAI MOTION",
  alternates: {
    canonical: "/",
    languages: { en: "/", ja: "/?lang=ja", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "VAI MOTION",
    locale: "en_AU",
    alternateLocale: ["ja_JP"],
    title,
    description,
    url: "/",
    images: [
      {
        url: "/og-lp.jpg?v=1",
        width: 1200,
        height: 630,
        alt: "VAI MOTION — We make your videos. Then we run the ads.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-lp.jpg?v=1"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // render the right language server-side (the cookie, else the browser's language) so there is
  // no flash. A page whose ?lang= differs corrects lang/.lang-ja before first paint with a tiny
  // inline script (see app/page.tsx), hence suppressHydrationWarning.
  const lang = await requestLang();

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`motion-safe:scroll-smooth ${jakarta.variable} ${notoJp.variable} ${
        lang === "ja" ? "lang-ja" : ""
      }`}
    >
      <body className="text-ink antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
