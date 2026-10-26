/* =========================================================================
   typeset.tsx — shared heading helpers for the LP.
   - bindShortWords: EN one/two-letter words ("a", "of") travel with the next word
   - splitHeading:   split a heading into words (EN) or <wbr> phrases (JA) for mask-rise
   - kernWord / kernHtml: pull a word-final "." or "?" in, because Plus Jakarta's
     stop and question mark carry wide side bearings at tight display tracking
   ========================================================================= */

import type { ReactNode } from "react";

const NBSP = " ";

/** EN body copy: the last two words travel together, so no single word sits alone on the last line */
export function bindLastWords(text: string) {
  return text.replace(/ (?=\S+$)/, NBSP);
}

export function bindShortWords(html: string) {
  return html.replace(/(^|\s)([A-Za-z]{1,2}) +(?=\S)/g, `$1$2${NBSP}`);
}

export type HeadingPart = { word: string } | { sep: "wbr" | "space" };

/** Returns null when the copy holds markup other than <wbr> (render it as one block then). */
export function splitHeading(html: string): HeadingPart[] | null {
  if (/<(?!wbr\b)[a-z]/i.test(html)) return null;
  return bindShortWords(html)
    .split(/(<wbr\s*\/?>|[^\S ]+)/i) // whitespace, but not the no-break spaces just added
    .filter(Boolean)
    .map((p): HeadingPart =>
      /^<wbr/i.test(p) ? { sep: "wbr" } : /^[^\S ]+$/.test(p) ? { sep: "space" } : { word: p },
    );
}

/** One word of a split heading, with a final "." or "?" kerned in. */
export function kernWord(word: string): ReactNode {
  const m = /^(.*[A-Za-z0-9)])([.?])$/.exec(word);
  if (!m) return word;
  return (
    <>
      {m[1]}
      <span className={m[2] === "." ? "m-stop" : "m-q"}>{m[2]}</span>
    </>
  );
}

/** The same for an HTML string rendered through <Html>: every word-final "." or "?". */
export function kernHtml(html: string) {
  return html
    .replace(/([A-Za-z0-9)])\.(?=\s|<|$)/g, '$1<span class="m-stop">.</span>')
    .replace(/([A-Za-z0-9)])\?(?=\s|<|$)/g, '$1<span class="m-q">?</span>');
}
