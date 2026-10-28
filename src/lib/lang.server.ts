import { cookies, headers } from "next/headers";
import type { Lang } from "./i18n";
import { LANG_COOKIE, langFromAcceptLanguage, normalizeLang } from "./lang";

/** The language a request should render in, before any ?lang= override:
 *  the vai_lang cookie (a choice the visitor made), then the browser's first language
 *  (Japanese opens in Japanese), then English. Server Components only. */
export async function requestLang(): Promise<Lang> {
  const store = await cookies();
  const fromCookie = normalizeLang(store.get(LANG_COOKIE)?.value);
  if (fromCookie) return fromCookie;
  const h = await headers();
  return langFromAcceptLanguage(h.get("accept-language")) ?? "en";
}
