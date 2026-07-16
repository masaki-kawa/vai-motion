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

const title = "VAI MOTION — AI video generation";
const description =
  "AI-made promo videos, finished by a human. Fast, affordable videos for local businesses, SaaS products, and online brands.";

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
    images: [{ url: "/og.jpg?v=2", width: 1200, height: 630, alt: "VAI MOTION" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg?v=2"],
  },
  icons: {
    icon: "/assets/vai-mark.png",
    apple: "/assets/vai-mark.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // render the right language server-side (from the cookie) so there is no flash for returning visitors
  const store = await cookies();
  const lang = normalizeLang(store.get(LANG_COOKIE)?.value) ?? "en";

  return (
    <html
      lang={lang}
      className={`scroll-smooth ${jakarta.variable} ${notoJp.variable} ${
        lang === "ja" ? "lang-ja" : ""
      }`}
    >
      <body className="text-ink antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
