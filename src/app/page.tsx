import { LangProvider } from "@/components/LangProvider";
import SkipLink from "@/components/SkipLink";
import SmoothScroll from "@/components/SmoothScroll";
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
import { I18N_LP } from "@/lib/i18n.lp";
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
    <LangProvider initialLang={initialLang} dict={I18N_LP}>
      <div className="lp">
        <SkipLink />
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
  );
}
