import type { Lang } from "./i18n";

/** cookie that mirrors the chosen language so the server can render it without a flash.
 *  Client-safe module — no server-only imports, so both the provider and Server
 *  Components can use these. Cookie reading lives in the Server Components themselves. */
export const LANG_COOKIE = "vai_lang";

export function normalizeLang(v: string | undefined | null): Lang | null {
  return v === "en" || v === "ja" ? v : null;
}

/** "ja" when Japanese is the first language of an Accept-Language header, otherwise null.
 *  A first visit from a Japanese-language browser opens in Japanese; every other first visit
 *  opens in English. Only the first entry counts, so a bilingual visitor who lists English
 *  first still gets English. */
export function langFromAcceptLanguage(header: string | undefined | null): Lang | null {
  const first = (header ?? "").split(",")[0]?.trim().toLowerCase() ?? "";
  return first === "ja" || first.startsWith("ja-") ? "ja" : null;
}
