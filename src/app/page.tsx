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
import { cookies } from "next/headers";
import { LANG_COOKIE, normalizeLang } from "@/lib/lang";

/** Chromium only (navigator.userAgentData brands): turns on the url(#lp-refract) backdrop
 *  refraction. Safari / iOS (Chrome on iOS included) and Firefox never get the class, so they
 *  never see a url() filter. ?webkit forces the WebKit path in Chromium, for screenshots. */
const REFRACT = `(function(d){try{var b=navigator.userAgentData&&navigator.userAgentData.brands;if(b&&b.some(function(x){return x.brand==="Chromium"})&&!/[?&]webkit\\b/.test(location.search))d.classList.add("lg-refract")}catch(e){}})(document.documentElement)`;

type Props = { searchParams: Promise<{ lang?: string }> };

const TITLES: Record<Lang, string> = {
  en: `VAI MOTION — ${I18N_LP.en["hero.eyebrow"]}`,
  ja: `VAI MOTION — ${I18N_LP.ja["hero.eyebrow"]}`,
};
const JA_DESCRIPTION =
  "お手持ちの写真から短い動画を作り、InstagramとFacebookの広告として、お店の近くにいる人に表示します。撮影は必要ありません。料金は豪ドル（A$）の月額制で、いつでも解約できます。";
const OG_IMAGE = "/og-lp.jpg?v=1";

/** URL ?lang= wins, then the cookie, then EN */
async function resolveLang(searchParams: Props["searchParams"]): Promise<Lang> {
  const sp = await searchParams;
  const store = await cookies();
  return normalizeLang(sp.lang) ?? normalizeLang(store.get(LANG_COOKIE)?.value) ?? "en";
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
      languages: { en: "/?lang=en", ja: "/?lang=ja" },
    },
    openGraph: {
      type: "website",
      siteName: "VAI MOTION",
      locale: "ja_JP",
      title,
      description,
      url: "/?lang=ja",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "VAI MOTION" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function Home({ searchParams }: Props) {
  const initialLang = await resolveLang(searchParams);
  // the root layout renders <html lang> / .lang-ja from the cookie only; when ?lang= says
  // otherwise, correct it before first paint (JA fonts, line-heights and line breaking)
  const store = await cookies();
  const htmlLang = normalizeLang(store.get(LANG_COOKIE)?.value) ?? "en";
  const fixHtml =
    initialLang !== htmlLang
      ? `(function(d){d.lang="${initialLang}";d.classList.toggle("lang-ja",${initialLang === "ja"})})(document.documentElement)`
      : null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REFRACT }} />
      {fixHtml && <script dangerouslySetInnerHTML={{ __html: fixHtml }} />}
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
