import type { Metadata } from "next";
import { LangProvider } from "@/components/LangProvider";
import DocTitle from "@/components/DocTitle";
import LegalPage from "@/components/lp/LegalPage";
import Footer from "@/components/lp/Footer";
import { I18N_LP } from "@/lib/i18n.lp";
import { LEGAL } from "@/lib/legal";
import { requestLang } from "@/lib/lang.server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const doc = LEGAL.terms[lang];
  return {
    title: `${doc.kicker} — VAI MOTION`,
    description: doc.description,
    alternates: { canonical: "/terms" },
    // not the homepage's share card
    openGraph: null,
    twitter: null,
  };
}

const TITLES = {
  en: `${LEGAL.terms.en.kicker} — VAI MOTION`,
  ja: `${LEGAL.terms.ja.kicker} — VAI MOTION`,
};

export default async function Page() {
  const lang = await requestLang();
  return (
    <LangProvider initialLang={lang} dict={I18N_LP}>
      <DocTitle titles={TITLES} />
      <div className="lp">
        <LegalPage kind="terms" />
        <Footer base="/" />
      </div>
    </LangProvider>
  );
}
