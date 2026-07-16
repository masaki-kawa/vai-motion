import type { Lang } from "./i18n";

/** cookie that mirrors the chosen language so the server can render it without a flash.
 *  Client-safe module — no server-only imports, so both the provider and Server
 *  Components can use these. Cookie reading lives in the Server Components themselves. */
export const LANG_COOKIE = "vai_lang";

export function normalizeLang(v: string | undefined | null): Lang | null {
  return v === "en" || v === "ja" ? v : null;
}
