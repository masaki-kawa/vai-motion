import type { Metadata } from "next";
import { LangProvider } from "@/components/LangProvider";
import SkipLink from "@/components/SkipLink";
import SmoothScroll from "@/components/SmoothScroll";
import DocTitle from "@/components/DocTitle";
import Nav from "@/components/lp/Nav";
import Hero from "@/components/lp/Hero";
import Idea from "@/components/lp/Idea";
import Budget from "@/components/lp/Budget";
import Service from "@/components/lp/Service";
import Pricing from "@/components/lp/Pricing";
import How from "@/components/lp/How";
import Faq from "@/components/lp/Faq";
import Contact from "@/components/lp/Contact";
import Footer from "@/components/lp/Footer";
import MobileBar from "@/components/lp/MobileBar";
import GlassDefs from "@/components/lp/GlassDefs";
import { I18N_LP } from "@/lib/i18n.lp";
import type { Lang } from "@/lib/i18n";
import { normalizeLang } from "@/lib/lang";
import { requestLang } from "@/lib/lang.server";

/** Chromium only, desktop and Android: turns on the url(#lp-refract) backdrop refraction (the
 *  old /jp nav's warp). A "Chromium" userAgentData brand, or (no client hints: an insecure
 *  context, a fork without the brand) a Google vendor plus a Chrome/ UA that is not an iOS
 *  wrapper. The vendor check keeps out WebKit sending a spoofed Chrome UA. Safari, every iOS
 *  browser and Firefox never get the class, so they never see a url() backdrop filter (WebKit
 *  drops the whole backdrop filter when it has one); the nav's lens copy (useMirror) gives them
 *  the same warp. ?webkit forces that path in Chromium (?webkit&nomirror: the plain blur). */
const REFRACT = `(function(d){try{var n=navigator,b=n.userAgentData&&n.userAgentData.brands,u=n.userAgent||"",c=(b&&b.some&&b.some(function(x){return x.brand==="Chromium"}))||(n.vendor==="Google Inc."&&/\\b(Headless)?Chrome\\/\\d/.test(u)&&!/\\b(CriOS|EdgiOS|FxiOS|OPiOS)\\b/.test(u));if(c&&!/[?&]webkit\\b/.test(location.search))d.classList.add("lg-refract")}catch(e){}})(document.documentElement)`;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaimotion.com";

/** the FAQ copy without its inline markup, for structured data */
function plain(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Organization + the page's FAQ as JSON-LD, in the language being served */
function jsonLd(lang: Lang) {
  const d = I18N_LP[lang];
  const faq = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((n) => ({ q: d[`faq.${n}.q`], a: d[`faq.${n}.a`] }))
    .filter((x) => x.q && x.a);
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "VAI MOTION",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/assets/vai-logo-full.png`,
      areaServed: { "@type": "City", name: "Sydney" },
      address: { "@type": "PostalAddress", addressLocality: "Sydney", addressRegion: "NSW", addressCountry: "AU" },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/${lang === "ja" ? "?lang=ja" : ""}#faq`,
      inLanguage: lang === "ja" ? "ja" : "en-AU",
      mainEntity: faq.map((x) => ({
        "@type": "Question",
        name: plain(x.q),
        acceptedAnswer: { "@type": "Answer", text: plain(x.a) },
      })),
    },
  ];
  // "<" escaped so no FAQ text can close the script element
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

type Props = { searchParams: Promise<{ lang?: string }> };

const TITLES: Record<Lang, string> = {
  en: `VAI MOTION — ${I18N_LP.en["hero.eyebrow"]}`,
  ja: `VAI MOTION — ${I18N_LP.ja["hero.eyebrow"]}`,
};
const JA_DESCRIPTION =
  "お手持ちの写真から短い動画を作り、InstagramとFacebookの広告として、お店の近くにいる人に表示します。撮影は必要ありません。料金は豪ドル（A$）の月額制で、いつでも解約できます。";
const OG_IMAGE_JA = "/og-lp-ja.jpg?v=1";
/** URL ?lang= wins, then the cookie, then the browser's language, then EN */
async function resolveLang(searchParams: Props["searchParams"]): Promise<Lang> {
  const sp = await searchParams;
  return normalizeLang(sp.lang) ?? (await requestLang());
}

// EN keeps the root layout's metadata; JA gets its own title, description and canonical
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  if ((await resolveLang(searchParams)) !== "ja") return {};
  const title = TITLES.ja;
  const description = JA_DESCRIPTION;
  return {
    title,
    description,
    alternates: {
      canonical: "/?lang=ja",
      languages: { en: "/", ja: "/?lang=ja", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: "VAI MOTION",
      locale: "ja_JP",
      alternateLocale: ["en_AU"],
      title,
      description,
      url: "/?lang=ja",
      images: [{ url: OG_IMAGE_JA, width: 1200, height: 630, alt: "VAI MOTION — 動画を作って、広告まで出します。" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_JA],
    },
  };
}

export default async function Home({ searchParams }: Props) {
  const initialLang = await resolveLang(searchParams);
  // the root layout renders <html lang> / .lang-ja without seeing ?lang=; when the URL says
  // otherwise, correct it before first paint (JA fonts, line-heights and line breaking)
  const htmlLang = await requestLang();
  const fixHtml =
    initialLang !== htmlLang
      ? `(function(d){d.lang="${initialLang}";d.classList.toggle("lang-ja",${initialLang === "ja"})})(document.documentElement)`
      : null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REFRACT }} />
      {fixHtml && <script dangerouslySetInnerHTML={{ __html: fixHtml }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(initialLang) }} />
      <LangProvider initialLang={initialLang} dict={I18N_LP}>
        <DocTitle titles={TITLES} />
        <div className="lp">
          <SkipLink />
          <GlassDefs />
          <SmoothScroll />
          <Nav />
          <main id="top">
            <Hero />
            <Idea />
            <Budget />
            <Service />
            <Pricing />
            <How />
            <Faq />
            <Contact />
          </main>
          <Footer />
          <MobileBar />
        </div>
      </LangProvider>
    </>
  );
}
