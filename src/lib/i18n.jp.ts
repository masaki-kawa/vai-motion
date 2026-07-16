/* =========================================================================
   i18n.jp.ts — Japan-market copy for the /jp route.
   We inherit the global dictionary (i18n.ts) and override ONLY the keys that
   differ for the Japanese market: hero, ¥ pricing, industries, footer/nav,
   plus new cross-border sections (segments, English support). Everything else
   (hy.* value section, how.* steps, work.*, pain.*, ct.* form labels) is
   inherited as-is. Both languages are provided: ja = Japanese owners targeting
   inbound; en = non-Japanese owners in Japan (segment 2) who prefer English.

   Positioning (locked with the founder): the wedge is NOT price — it is the
   cross-border, bilingual operator (Japan-born, Australia-based). Lead practical
   benefit = "no filming"; differentiator = bilingual / inbound / English-ready.
   Prices are tax-included totals (税込総額表示, required in Japan).
   ========================================================================= */

import { I18N, type Lang } from "./i18n";

const EN: Record<string, string> = {
  // nav
  "nav.cta": "Get in touch",

  // hero — practical benefit first ("no filming"), bilingual/inbound as the edge
  "hero.badge": "AI video + Instagram management",
  "hero.title": "Just send your shop's photos.",
  "hero.lead": "No filming — start reaching foreign visitors on social.",
  "hero.sub":
    "Our Japan-born, Australia-based team does it all — Japanese and English video, made and posted, with AI and a human touch.",
  "hero.cta1": "Get in touch",
  "hero.cta2": "Get in touch",

  // value section — override the agency price-comparison out (/jp does not fight on price)
  "hy.sub":
    "A shoot costs a fortune and still runs dry in a few clips. VAI starts from a single photo — finished by a human, and it doesn't stop.",
  "hy.1.c2": "No shoot costs",

  // segments (new section)
  "seg.title": "Made for shops like yours.",
  "seg.sub": "No filming — and videos that reach your foreign customers too.",
  "seg.1.t": "Want more inbound visitors",
  "seg.1.d": "Framed to land with overseas guests. English subtitles available.",
  "seg.2.t": "Owners who prefer English",
  "seg.2.d": "For non-Japanese owners in Japan. Talk to us in English or Japanese.",
  "seg.3.t": "Eyeing English-speaking markets",
  "seg.3.d": "Based in Australia, we can produce videos for English-speaking markets too.",

  // english support (new section — concrete, no over-promise)
  "eng.title": "What “strong in English” actually means",
  "eng.sub": "We don't run your whole overseas marketing. But for the videos themselves, here's exactly what we handle.",
  "eng.1": "English subtitles",
  "eng.2": "English captions",
  "eng.3": "Framing that lands with foreign customers",
  "eng.4": "Enquiries and support in English",
  "eng.5": "English communication for non-Japanese owners",

  // industries (override — inbound-leaning)
  "ind.title": "Industries we're great at",
  "ind.sub": "Food, stays and experiences are a perfect fit for AI video.",
  "ind.1": "Restaurants & cafés",
  "ind.1d": "Dishes, drinks, the room — with the sizzle kept in.",
  "ind.2": "Stays, tours & experiences",
  "ind.2d": "Rooms, activities, the neighbourhood — made to reach visitors.",
  "ind.3": "Retail & souvenirs",
  "ind.3d": "New arrivals, bestsellers, gifts — made to want.",
  "ind.4": "Beauty & wellness",
  "ind.4d": "Treatments, before-and-after, the calm — done with care.",

  // pricing (¥, tax included)
  "pr.title": "Simple monthly plans",
  "pr.sub": "Two plans, tax included. Cancel anytime.",
  "pr.main.badge": "Monthly plans",
  "pr.light.name": "Light",
  "pr.light.price": "¥30,000",
  "pr.light.per": "/mo (tax incl.)",
  "pr.light.tag": "4 videos a month",
  "pr.light.unit": "¥7,500 per video — for cafés, izakaya and individual shops.",
  "pr.std.name": "Growth",
  "pr.std.price": "¥60,000",
  "pr.std.per": "/mo (tax incl.)",
  "pr.std.tag": "12 videos a month",
  "pr.std.unit": "Just ¥5,000 per video. 3× the videos, only 2× the price.",
  "pr.std.save": "Easiest to keep up",
  "pr.rec": "Recommended",
  "pr.cta.light": "Ask about Light",
  "pr.cta.std": "Ask about Growth",
  "pr.incl.title": "Every plan includes",
  "pr.row.1": "10–20s vertical video",
  "pr.row.2": "Captions & hashtags",
  "pr.row.3": "Posted at the best time",
  "pr.row.4": "Shared to Stories",
  "pr.note": "Ask us about: subtitles in other languages, paid ads, a LINE official account.",

  // one-off promo tab (SaaS / landscape 16:9) — matches the AU version
  "promo.kicker": "Separate option",
  "promo.title": "One-off promo videos",
  "promo.sub": "One-off production for SaaS, products and events — separate from the monthly plans.",
  "promo.ratio": "16:9 landscape",
  "promo.1.name": "Short Promo",
  "promo.1.price": "¥55,000",
  "promo.1.desc": "One 15–30s short promo video.",
  "promo.2.name": "Launch Pack",
  "promo.2.price": "¥110,000",
  "promo.2.desc": "One 30–60s video, plus 2–3 short cuts.",
  "promo.3.name": "SaaS Demo Video",
  "promo.3.price": "¥165,000",
  "promo.3.desc": "A 60–90s product or demo video.",
  "promo.note": "All in 16:9 landscape, prices tax included. Talk to us about timeline and number of cuts.",
  "promo.cta": "Ask about a promo video",

  // positioning comparison (agency / VAI / DIY) — matches the AU version
  "pos.sub": "More affordable than an agency, more sustainable than doing it yourself — the sweet spot in between.",
  "pos.agency.name": "Agency / production",
  "pos.agency.price": "¥200,000+/mo",
  "pos.agency.desc": "Strategy and filming, done properly — but pricey, and a shoot to organise.",
  "pos.us.name": "VAI MOTION",
  "pos.us.tag": "The sweet spot",
  "pos.us.price": "¥30,000+/mo",
  "pos.us.desc": "No shoot. AI-made, human-finished, at a price you can keep up.",
  "pos.diy.name": "DIY AI tools",
  "pos.diy.price": "Cheap, but…",
  "pos.diy.desc": "Tools are cheap, but you make and post everything yourself — so it stalls.",

  // contact
  "ct.title": "Let's talk",
  "ct.sub": "Tell us about your shop. A free, no-obligation chat and quote.",
  "ct.ok": "Sent. We'll be in touch shortly.",

  // footer
  "ft.tag": "Store videos without a shoot — for inbound and English too. Finished by a human.",
};

const JA: Record<string, string> = {
  // nav
  "nav.cta": "無料問い合わせ",

  // hero — 「撮影不要」を先に、越境バイリンガルを差別化として
  "hero.badge": "AI動画制作 ＋ Instagram運用代行",
  "hero.title": "お店の写真を送るだけ。",
  "hero.lead": "撮影不要で、<wbr>外国人観光客に<wbr>届く<wbr>SNS集客を<wbr>始めませんか？",
  "hero.sub":
    "オーストラリア拠点の<wbr>日本人チームが、<wbr>AIと人の手で<wbr>日本語・英語の<wbr>動画制作から<wbr>運用まで対応します。",
  "hero.cta1": "無料問い合わせ",
  "hero.cta2": "無料問い合わせ",

  // 価値セクション — 価格比較を撤去（/jpは価格で戦わない）
  "hy.sub":
    "お金も手間もかかる撮影は、数本でおしまい。VAIは写真1枚から、人が仕上げて出し続けます。",
  "hy.1.c2": "撮影コストはゼロ",

  // セグメント（新セクション）
  "seg.title": "こんなお店に。",
  "seg.sub": "撮影の手間をなくして、訪日のお客様にも届く動画を。",
  "seg.1.t": "訪日インバウンドを増やしたい",
  "seg.1.d": "海外のお客様に刺さる見せ方で。英語字幕にも対応します。",
  "seg.2.t": "英語でやりとりしたいオーナー",
  "seg.2.d": "日本でお店をする外国人オーナーへ。連絡は英語でも日本語でも。",
  "seg.3.t": "英語圏への展開も視野に",
  "seg.3.d": "オーストラリア拠点だから、英語圏向けの動画もご相談いただけます。",

  // 英語対応の具体（新セクション・過剰約束を避ける）
  "eng.title": "「英語にも強い」って、具体的には。",
  "eng.sub": "海外マーケティングを丸ごと、ではありません。動画まわりで、こういうことができます。",
  "eng.1": "英語字幕への対応",
  "eng.2": "英語キャプションの作成",
  "eng.3": "外国人客に伝わる見せ方の提案",
  "eng.4": "英語でのお問い合わせ・やりとり",
  "eng.5": "外国人オーナーとの英語コミュニケーション",

  // 業種（上書き・インバウンド寄り）
  "ind.title": "動画にしやすい、得意な業種",
  "ind.sub": "とくに飲食・宿泊・観光体験は、AI動画と相性ばつぐんです。",
  "ind.1": "飲食・カフェ",
  "ind.1d": "料理・ドリンク・店内の空気を、シズル感そのままに。",
  "ind.2": "宿泊・観光・体験",
  "ind.2d": "客室・体験・街歩き・季節感を、訪日客に届く形で。",
  "ind.3": "小売・お土産",
  "ind.3d": "新商品・人気商品・ギフトを、手に取りたくなる動画に。",
  "ind.4": "美容・ウェルネス",
  "ind.4d": "施術・癒やしの雰囲気を、丁寧に。",

  // 料金（¥・税込総額表示）
  "pr.title": "わかりやすい月額プラン",
  "pr.sub": "2つのプラン。いつでも解約できます。",
  "pr.main.badge": "月額プラン",
  "pr.light.name": "ライトプラン",
  "pr.light.price": "¥30,000",
  "pr.light.per": "/月（税込）",
  "pr.light.tag": "月4本・週1本ペース",
  "pr.light.unit": "1本あたり¥7,500。まず試したいお店に。",
  "pr.std.name": "グロースプラン",
  "pr.std.price": "¥60,000",
  "pr.std.per": "/月（税込）",
  "pr.std.tag": "月12本・週3本ペース",
  "pr.std.unit": "1本あたり¥5,000。本数は3倍、料金は2倍だけ。",
  "pr.std.save": "いちばん続けやすい",
  "pr.rec": "おすすめ",
  "pr.cta.light": "ライトで相談する",
  "pr.cta.std": "グロースで相談する",
  "pr.incl.title": "全プラン共通",
  "pr.row.1": "10〜20秒の縦型動画",
  "pr.row.2": "キャプション・ハッシュタグ",
  "pr.row.3": "最適な時間に投稿",
  "pr.row.4": "ストーリーズにも展開",
  "pr.note": "別途ご相談：英語以外の字幕、広告運用、LINE公式アカウント運用 など。",

  // 単発タブ（SaaS・16:9 横型）— AU版に合わせて
  "promo.kicker": "単発オプション",
  "promo.title": "単発のプロモ動画",
  "promo.sub": "SaaS・商品・イベント向けの単発制作。月額プランとは別のオプションです。",
  "promo.ratio": "16:9 横型",
  "promo.1.name": "ショート単発",
  "promo.1.price": "¥55,000",
  "promo.1.desc": "15〜30秒の単発プロモ動画を1本。",
  "promo.2.name": "ローンチパック",
  "promo.2.price": "¥110,000",
  "promo.2.desc": "30〜60秒の動画1本＋ショート2〜3カット。",
  "promo.3.name": "SaaSデモ動画",
  "promo.3.price": "¥165,000",
  "promo.3.desc": "60〜90秒の製品・デモ動画。",
  "promo.note": "すべて16:9横型、価格は税込です。納期やカット数はご相談ください。",
  "promo.cta": "単発プロモを相談する",

  // 比較（制作会社 / VAI / 自分でAI）— AU版に合わせて
  "pos.sub": "制作会社に頼むより手頃に、自分でやるより続く。ちょうどいい真ん中をねらいました。",
  "pos.agency.name": "制作会社・代理店",
  "pos.agency.price": "月20万円〜",
  "pos.agency.desc": "撮影・戦略まで本格的。ただし高価で、撮影の手間もかかります。",
  "pos.us.name": "VAI MOTION",
  "pos.us.tag": "ちょうどいい",
  "pos.us.price": "月3万円〜（税込）",
  "pos.us.desc": "撮影なし。AIで作り、人が仕上げる。続けやすい価格で。",
  "pos.diy.name": "自分でAIツール",
  "pos.diy.price": "安いけれど…",
  "pos.diy.desc": "ツール代は安い。でも作るのも投稿も全部自分。だから続かない。",

  // お問い合わせ
  "ct.title": "まずは、お気軽にご相談を。",
  "ct.sub": "お店のことを少し教えてください。無料でご相談・お見積りします。",
  "ct.ok": "送信しました。担当者より折り返しご連絡します。",

  // フッター
  "ft.tag": "撮影なしのお店の動画。訪日にも、英語にも。仕上げは人の手で。",
};

/** Japan-market dictionary: global base + market overrides. */
export const I18N_JP: Record<Lang, Record<string, string>> = {
  en: { ...I18N.en, ...EN },
  ja: { ...I18N.ja, ...JA },
};

/** Industry dropdown options for the /jp contact form (inbound-leaning). */
export const INDUSTRY_OPTIONS_JP: Record<Lang, string[]> = {
  en: [
    "Restaurant & café",
    "Izakaya & bar",
    "Stay, tour & experience",
    "Retail & souvenir",
    "Beauty & wellness",
    "Other",
  ],
  ja: [
    "飲食・カフェ",
    "居酒屋・バー",
    "宿泊・観光・体験",
    "小売・お土産",
    "美容・ウェルネス",
    "その他",
  ],
};

/** Inbound-leaning store types for the /jp hero ribbon (no clinic — matches the JP industry focus). */
export const RIBBON_WORDS_JP: Record<Lang, string[]> = {
  ja: ["飲食店", "カフェ", "居酒屋", "和食店", "旅館・ホテル", "観光・体験", "お土産", "美容室", "ネイル", "エステ"],
  en: ["restaurant", "café", "izakaya", "ramen bar", "ryokan", "tours", "souvenir", "hair salon", "nail studio", "spa"],
};
