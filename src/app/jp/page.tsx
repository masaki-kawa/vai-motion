import { cookies } from "next/headers";
import { LangProvider } from "@/components/LangProvider";
import SkipLink from "@/components/SkipLink";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ribbon from "@/components/Ribbon";
import Segments from "@/components/Segments";
import Hybrid from "@/components/Hybrid";
import EnglishSupport from "@/components/EnglishSupport";
import RecentWork from "@/components/RecentWork";
import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { I18N_JP, INDUSTRY_OPTIONS_JP, RIBBON_WORDS_JP } from "@/lib/i18n.jp";
import { LANG_COOKIE, normalizeLang } from "@/lib/lang";

export default async function JpHome({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const store = await cookies();
  // Japan market defaults to Japanese; ?lang=en (or the cookie) gives the English
  // rendering for non-Japanese owners in Japan (segment 2).
  const initialLang =
    normalizeLang(sp.lang) ?? normalizeLang(store.get(LANG_COOKIE)?.value) ?? "ja";

  const legalLinks = [
    {
      href: "/jp/legal/tokushoho",
      label: initialLang === "en" ? "Legal notice (特商法)" : "特定商取引法に基づく表記",
    },
  ];

  return (
    <LangProvider initialLang={initialLang} dict={I18N_JP}>
      <SkipLink />
      <SmoothScroll />
      <Nav />
      <main id="top">
        <Hero />
        <Ribbon words={RIBBON_WORDS_JP} />
        <Segments />
        <Hybrid />
        <EnglishSupport />
        <RecentWork />
        <Pricing />
        <HowItWorks />
        <Contact industries={INDUSTRY_OPTIONS_JP} />
      </main>
      <Footer legalLinks={legalLinks} />
    </LangProvider>
  );
}
