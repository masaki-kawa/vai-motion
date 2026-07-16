import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 — VAI MOTION",
  description: "VAI MOTION（日本向けサービス）の特定商取引法に基づく表記。",
  robots: { index: false },
};

/* Finalised from the founder's details (2026-06). 通信販売（特商法11条）に該当。 */
const ROWS: { label: string; value: string }[] = [
  { label: "販売事業者名", value: "川上勝基（屋号：VAI MOTION）" },
  { label: "運営統括責任者", value: "川上勝基" },
  { label: "所在地", value: "Level 1, 477 Pitt St, Haymarket NSW 2000, Australia" },
  { label: "電話番号", value: "+61 431 107 699（お問い合わせはメールを推奨いたします）" },
  { label: "メールアドレス", value: "masaki.kawakami@cubic-innov8.com" },
  {
    label: "販売価格",
    value:
      "月額プラン：ライト ¥30,000／グロース ¥60,000（いずれも税込・総額）。単発プロモ：¥55,000〜¥165,000（税込）。各プランの内容はサービスページに記載。",
  },
  {
    label: "商品代金以外の必要料金",
    value:
      "現在なし。英語以外の字幕・広告運用・LINE公式アカウント運用などのオプションは別途お見積り（事前に金額を提示します）。",
  },
  {
    label: "消費税・適格請求書（インボイス）",
    value:
      "表示価格はすべて税込（総額）です。当社は適格請求書発行事業者ではないため、適格請求書（インボイス）の発行には対応しておりません。",
  },
  { label: "お支払い方法", value: "銀行振込（請求書払い）" },
  {
    label: "お支払い時期",
    value: "請求書発行後14日以内。月額プランは当月分を毎月所定の締め日に請求いたします。",
  },
  {
    label: "サービスの提供時期",
    value:
      "お写真のご提供後、5〜7営業日で初回動画を納品いたします。月額プランは契約開始日より運用を開始します。",
  },
  {
    label: "解約・キャンセル",
    value:
      "月額プランはいつでも解約できます。解約は次回更新日の7日前までにご連絡ください。提供済み（当月分）の役務については返金いたしかねます。",
  },
  {
    label: "返品・返金について",
    value: "サービスの性質上、提供（制作・納品）後の返金には応じられません。",
  },
  {
    label: "継続課金（サブスクリプション）について",
    value:
      "月額プランは毎月自動で継続します。解約のお申し出があるまで請求が継続します（上記「解約・キャンセル」参照）。",
  },
  {
    label: "表現および提供サービスに関する注記",
    value:
      "動画はAIを用いて制作し、公開前に必ず人が確認・仕上げを行います。集客・売上などの成果を保証するものではありません。",
  },
];

export default function TokushohoPage() {
  return (
    <main className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Link href="/jp" className="text-[14px] font-semibold text-accent-deep hover:underline">
          ← VAI MOTION 日本版にもどる
        </Link>
        <h1
          className="tight mt-6 font-extrabold tracking-tight"
          style={{ fontSize: "clamp(26px,4vw,38px)" }}
        >
          特定商取引法に基づく表記
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          本ページは、日本国内のお客様向けに提供する VAI MOTION のサービスに関する表記です。
        </p>

        <dl className="mt-10 divide-y divide-line overflow-hidden rounded-3xl border border-line">
          {ROWS.map((r) => (
            <div key={r.label} className="grid sm:grid-cols-[200px_1fr] gap-1 sm:gap-5 px-6 py-5">
              <dt className="text-[14px] font-bold text-ink">{r.label}</dt>
              <dd className="text-[14.5px] leading-relaxed text-ink-soft">{r.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-[13px] leading-relaxed text-ink-mute">
          本表記は予告なく改定する場合があります。最終更新：2026年6月。
        </p>
      </div>
    </main>
  );
}
