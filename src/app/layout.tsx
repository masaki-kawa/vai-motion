import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_JP } from "next/font/google";
import { cookies } from "next/headers";
import { LANG_COOKIE, normalizeLang } from "@/lib/lang";
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
const description =
  "We make short videos from the photos you already have, then run them as Instagram and Facebook ads to people near your shop. No filming. Monthly plans in AUD, cancel anytime.";

export const metadata: Metadata = {
  // set NEXT_PUBLIC_SITE_URL to the real domain in production (falls back to the placeholder)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaimotion.com"),
  title,
  description,
  applicationName: "VAI MOTION",
  alternates: {
    canonical: "/",
    languages: { en: "/?lang=en", ja: "/?lang=ja" },
  },
  openGraph: {
    type: "website",
    siteName: "VAI MOTION",
    title,
    description,
    url: "/",
    images: [{ url: "/og-lp.jpg?v=1", width: 1200, height: 630, alt: "VAI MOTION" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-lp.jpg?v=1"],
  },
  icons: {
    icon: "/assets/vai-mark.png",
    apple: "/assets/vai-mark.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // render the right language server-side (from the cookie) so there is no flash for returning visitors.
  // A page whose ?lang= differs from the cookie corrects lang/.lang-ja before first paint with a
  // tiny inline script (see app/page.tsx), hence suppressHydrationWarning.
  const store = await cookies();
  const lang = normalizeLang(store.get(LANG_COOKIE)?.value) ?? "en";

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
