import { LangProvider } from "@/components/LangProvider";
import SkipLink from "@/components/SkipLink";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ribbon from "@/components/Ribbon";
import Pain from "@/components/Pain";
import RecentWork from "@/components/RecentWork";
import Hybrid from "@/components/Hybrid";
import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";
import { LANG_COOKIE, normalizeLang } from "@/lib/lang";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const store = await cookies();
  // URL ?lang= wins, then the cookie, then EN
  const initialLang =
    normalizeLang(sp.lang) ?? normalizeLang(store.get(LANG_COOKIE)?.value) ?? "en";

  return (
    <LangProvider initialLang={initialLang}>
      <SkipLink />
      <SmoothScroll />
      <Nav />
      <main id="top">
        <Hero />
        <Ribbon />
        <Pain />
        <RecentWork />
        <Hybrid />
        <Pricing />
        <HowItWorks />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  );
}
