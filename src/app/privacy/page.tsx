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
  const doc = LEGAL.privacy[lang];
  return {
    title: `${doc.kicker} — VAI MOTION`,
    description: doc.description,
    alternates: { canonical: "/privacy" },
    // not the homepage's share card
    openGraph: null,
    twitter: null,
  };
}

const TITLES = {
  en: `${LEGAL.privacy.en.kicker} — VAI MOTION`,
  ja: `${LEGAL.privacy.ja.kicker} — VAI MOTION`,
};

export default async function Page() {
  const lang = await requestLang();
  return (
    <LangProvider initialLang={lang} dict={I18N_LP}>
      <DocTitle titles={TITLES} />
      <div className="lp">
        <LegalPage kind="privacy" />
        <Footer base="/" />
      </div>
    </LangProvider>
  );
}
