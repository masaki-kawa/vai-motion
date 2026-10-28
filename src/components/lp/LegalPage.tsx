"use client";

import { Fragment } from "react";
import { useT } from "../LangProvider";
import { BUSINESS, LEGAL, type LegalKind } from "@/lib/legal";

/** the {email} token as a mailto link */
function withEmail(text: string) {
  const parts = text.split("{email}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? (
        <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-[color:var(--m-ink)] underline decoration-[rgba(20,24,28,0.32)] decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-300 hover:decoration-[color:var(--m-ink)]">
          {BUSINESS.email}
        </a>
      ) : null}
    </Fragment>
  ));
}

/** Privacy policy / terms in the LP's type and tokens. The language comes from LangProvider
 *  (server: cookie or Accept-Language; on the client ?lang= wins, so a link from the Japanese
 *  page opens Japanese even before a cookie exists). */
export default function LegalPage({ kind }: { kind: LegalKind }) {
  const { cur } = useT();
  const ja = cur === "ja";
  const doc = LEGAL[kind][cur];

  const body = ja ? "text-[16px]" : "text-base";
  const lh = { lineHeight: ja ? 1.9 : 1.65 };

  return (
    <main id="top" className="bg-white px-4 pb-24 pt-28 sm:px-8 min-[900px]:pt-36">
      <div className="mx-auto w-full max-w-[1240px]">
        <a
          href="/#top"
          className="inline-block py-1 text-sm font-semibold text-[color:var(--m-soft)] underline decoration-[color:var(--m-line)] decoration-1 underline-offset-[5px] transition-colors duration-200 hover:text-[color:var(--m-ink)] hover:decoration-[color:var(--m-ink)] active:translate-y-px"
        >
          ← {doc.back}
        </a>
        <header className="mt-10 max-w-[44em]">
          <p className="m-kicker text-[color:var(--m-mute)]">{doc.kicker}</p>
          <h1
            className="m-display m-jp-break mt-6 text-[color:var(--m-ink)]"
            style={{
              fontSize: ja ? "clamp(24px,max(min(6.9vw,30px),4.2vw),56px)" : "clamp(32px,4.5vw,64px)",
              lineHeight: ja ? 1.3 : 1.05,
            }}
          >
            {doc.title}
          </h1>
          <p className={`m-body mt-6 ${ja ? "text-[17px]" : "text-lg"} text-[color:var(--m-soft)] [text-wrap:pretty]`} style={{ lineHeight: ja ? 1.9 : 1.6 }}>
            {withEmail(doc.intro)}
          </p>
          <p className="mt-4 text-sm text-[color:var(--m-mute)]">{doc.updated}</p>
        </header>

        <div className="mt-12 max-w-[44em] border-t border-[color:var(--m-line)]">
          {doc.sections.map((sec) => (
            <section key={sec.h} className="border-b border-[color:var(--m-line)] py-8 min-[900px]:py-10">
              <h2 className={`font-bold text-[color:var(--m-ink)] ${ja ? "text-[19px]" : "text-xl"}`} style={{ lineHeight: 1.4 }}>
                {sec.h}
              </h2>
              {sec.p.map((para, i) =>
                para.startsWith("- ") ? (
                  <ul key={i} className={`m-body mt-4 list-disc space-y-2 pl-5 ${body} text-[color:var(--m-soft)] [text-wrap:pretty]`} style={lh}>
                    {para.split("\n").map((item, j) => (
                      <li key={j}>{withEmail(item.replace(/^- /, ""))}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className={`m-body mt-4 ${body} text-[color:var(--m-soft)] [text-wrap:pretty]`} style={lh}>
                    {withEmail(para)}
                  </p>
                ),
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
