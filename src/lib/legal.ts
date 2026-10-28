/* =========================================================================
   legal.ts — the business details shown on the site, and the privacy policy
   and terms of service in both languages. Drafted 2026-10-28 from the founder's
   details on /jp/legal/tokushoho; a {email} token is filled at render time.
   ========================================================================= */

import type { Lang } from "./i18n";

export const BUSINESS = {
  name: "VAI MOTION",
  owner: { en: "Masaki Kawakami", ja: "川上勝基" },
  address: "Level 1, 477 Pitt St, Haymarket NSW 2000, Australia",
  email: "masaki.kawakami@cubic-innov8.com",
  /** ISO date of the last change to either document */
  updated: "2026-10-28",
} as const;

export type LegalSection = { h: string; p: string[] };
export type LegalDoc = {
  kicker: string;
  title: string;
  description: string;
  intro: string;
  updated: string;
  back: string;
  sections: LegalSection[];
};

/* a paragraph that starts with "- " on every line is rendered as a list */
const L = (...items: string[]) => items.map((i) => `- ${i}`).join("\n");

const privacy: Record<Lang, LegalDoc> = {
  ja: {
    kicker: "プライバシーポリシー",
    title: "お預かりする情報の取り扱いについて",
    description: "VAI MOTIONがお問い合わせやサービスの提供にあたってお預かりする情報と、その取り扱いについて。",
    intro:
      "VAI MOTION（運営者：川上勝基。以下「当方」）は、お客様からお預かりする個人情報を、次のとおり取り扱います。",
    updated: "最終更新：2026年10月28日",
    back: "VAI MOTIONのトップへ",
    sections: [
      {
        h: "1. 運営者",
        p: [L("名称：VAI MOTION（個人事業・運営者 川上勝基）", "所在地：Level 1, 477 Pitt St, Haymarket NSW 2000, Australia", "連絡先：{email}")],
      },
      {
        h: "2. お預かりする情報",
        p: [
          L(
            "お問い合わせフォームにご入力いただく情報：お名前、メールアドレス、お店や会社の名前、業種、ご希望のプラン、メッセージ（任意の項目を含みます）",
            "サービスのご利用にあたりご提供いただく素材：写真、ロゴ、商品画像、文章など",
            "広告運用をご依頼いただく場合：Meta Business Suiteでパートナーとして付与されるアクセス権を通じて閲覧できる、広告アカウントとInstagram・Facebookアカウントの情報。パスワードをお預かりすることはありません。",
            "ご請求に必要な情報：請求先のお名前、ご住所、メールアドレス",
            "当サイトの閲覧に関する情報：言語の設定を保存するためのCookie（vai_lang）と、サーバーのアクセス記録（IPアドレス、ブラウザの種類など）。アクセス解析ツールや広告用のCookieは、現在使用していません。",
          ),
        ],
      },
      {
        h: "3. 利用目的",
        p: [
          L(
            "お問い合わせへの返信とご提案",
            "動画の制作、広告の運用、レポートの作成など、サービスの提供",
            "ご請求とお支払いの確認",
            "サービスに関するご連絡（納品、ご確認のお願い、料金や規約の変更のお知らせ）",
            "不正なアクセスの防止と、当サイトの改善",
          ),
          "これ以外の目的に使うことはありません。ご同意なく、営業目的のメールをお送りすることもありません。",
        ],
      },
      {
        h: "4. 第三者への提供と委託",
        p: [
          "お客様の情報を第三者に販売することはありません。サービスの提供に必要な範囲で、次の事業者の仕組みを通じて情報を預けたり、処理したりします。",
          L(
            "Meta Platforms（InstagramとFacebookの広告配信）",
            "Slack（お問い合わせの内容を当方に通知するため）",
            "Vercel（当サイトのホスティング）",
            "メールサービスとオンラインストレージ（ご連絡と素材のやり取り）",
          ),
          "これらの事業者のサーバーは、オーストラリア国外（アメリカなど）にあることがあります。法令に基づく開示の求めがある場合を除き、上記以外に情報を提供することはありません。",
        ],
      },
      {
        h: "5. 保管期間",
        p: [
          "お問い合わせの内容は、ご返信のあとも、ご相談の続きやご依頼に備えて保管することがあります。サービスの提供のためにお預かりした素材とアカウントの情報は、契約の終了後、合理的な期間のうちに削除します。ご請求に関する記録は、法令で定められた期間保管します。削除をご希望の場合は、下記までご連絡ください。",
        ],
      },
      {
        h: "6. 安全管理",
        p: [
          "情報へのアクセスは、業務に必要な範囲に限っています。パスワードをお預かりしない運用（Meta Business Suiteのパートナー機能）を基本とし、当方のアクセス権はお客様がいつでも外すことができます。",
        ],
      },
      {
        h: "7. お客様の権利",
        p: [
          "ご自身の情報の開示、訂正、削除は、いつでもご請求いただけます。下記のメールアドレスまでご連絡ください。ご本人であることを確認したうえで、速やかに対応します。",
        ],
      },
      {
        h: "8. 準拠する法令",
        p: [
          "当方はオーストラリアのニューサウスウェールズ州を拠点とし、Privacy Act 1988 (Cth) に定めるオーストラリア・プライバシー原則（APPs）に沿って個人情報を取り扱います。日本のお客様の情報についても、同じ基準で取り扱います。",
        ],
      },
      {
        h: "9. 本ポリシーの変更",
        p: ["内容を変更する場合は、本ページで公開します。重要な変更がある場合は、ご契約中のお客様にメールでお知らせします。"],
      },
      { h: "10. お問い合わせ", p: ["本ポリシーに関するご質問は、{email} までお寄せください。"] },
    ],
  },
  en: {
    kicker: "Privacy policy",
    title: "How we handle your information",
    description: "What VAI MOTION collects when you enquire or use our services, and how it is used, shared and kept.",
    intro:
      "VAI MOTION (operated by Masaki Kawakami, “we”) handles the personal information you give us as set out below.",
    updated: "Last updated 28 October 2026",
    back: "Back to VAI MOTION",
    sections: [
      {
        h: "1. Who we are",
        p: [L("Business: VAI MOTION, a sole trader business operated by Masaki Kawakami", "Address: Level 1, 477 Pitt St, Haymarket NSW 2000, Australia", "Contact: {email}")],
      },
      {
        h: "2. What we collect",
        p: [
          L(
            "What you type into the contact form: your name, email address, business name, type of business, the plan you are interested in and your message (including optional fields)",
            "Material you give us for the work: photos, logos, product images and text",
            "If we run your ads: the ad account and Instagram and Facebook account information we can see through the partner access you grant in Meta Business Suite. We never hold a password.",
            "Billing details: the name, address and email address on your invoices",
            "Site usage: a cookie that remembers your language (vai_lang) and the hosting provider's server logs (IP address, browser type). We currently use no analytics or advertising cookies.",
          ),
        ],
      },
      {
        h: "3. How we use it",
        p: [
          L(
            "Replying to your enquiry and preparing a proposal",
            "Delivering the service: making videos, running ads, preparing reports",
            "Invoicing and confirming payment",
            "Service messages: deliveries, review requests, notice of changes to prices or terms",
            "Preventing abuse and improving this site",
          ),
          "We use it for nothing else, and we don't send marketing email without your consent.",
        ],
      },
      {
        h: "4. Who we share it with",
        p: [
          "We never sell your information. To deliver the service, it passes through or is stored by these providers:",
          L(
            "Meta Platforms (running the Instagram and Facebook ads)",
            "Slack (notifying us of your enquiry)",
            "Vercel (hosting this site)",
            "Email and online storage services (correspondence and exchanging material)",
          ),
          "Their servers may be outside Australia, for example in the United States. Beyond this, we disclose information only where the law requires it.",
        ],
      },
      {
        h: "5. How long we keep it",
        p: [
          "We may keep enquiries after replying, in case the conversation continues or turns into a job. Material and account information held for the work is deleted within a reasonable time after the engagement ends. Billing records are kept for as long as the law requires. If you want something deleted, write to us at the address below.",
        ],
      },
      {
        h: "6. Security",
        p: [
          "Access to your information is limited to what the work needs. We work without holding passwords (partner access in Meta Business Suite), and you can remove our access at any time.",
        ],
      },
      {
        h: "7. Your rights",
        p: [
          "You can ask to see, correct or delete your information at any time. Write to the email address below. We'll confirm it's you and act promptly.",
        ],
      },
      {
        h: "8. Which law applies",
        p: [
          "We are based in New South Wales, Australia, and handle personal information in line with the Australian Privacy Principles in the Privacy Act 1988 (Cth). Information about customers in Japan is handled to the same standard.",
        ],
      },
      {
        h: "9. Changes to this policy",
        p: ["Changes are published on this page. If a change matters, current customers are told by email."],
      },
      { h: "10. Contact", p: ["Questions about this policy: {email}."] },
    ],
  },
};

const terms: Record<Lang, LegalDoc> = {
  ja: {
    kicker: "利用規約",
    title: "サービスをご利用いただく際の条件",
    description: "VAI MOTIONの動画制作とMeta広告運用のサービスをご利用いただく際の条件。料金、お支払い、解約、動画の権利、広告アカウントについて。",
    intro:
      "本規約は、VAI MOTION（運営者：川上勝基。以下「当方」）が提供する動画制作とMeta広告運用のサービスを、お客様にご利用いただく際の条件を定めるものです。お申し込みをもって、本規約にご同意いただいたものとします。",
    updated: "最終更新：2026年10月28日",
    back: "VAI MOTIONのトップへ",
    sections: [
      {
        h: "1. サービスの内容",
        p: [
          L(
            "月額プラン：お手持ちの写真やロゴなどをもとに、毎月決まった本数の短い動画を制作します。広告運用つきのプランでは、InstagramとFacebookの広告の設定、毎週の確認と調整、月に一度のレポートを行います。",
            "単発のプロモ動画：16:9の横型動画を、ご依頼ごとに制作します。",
          ),
          "各プランの本数と料金は、当サイトの料金の項に表示しているとおりです。",
        ],
      },
      {
        h: "2. 料金とお支払い",
        p: [
          L(
            "料金はオーストラリアドル（AUD）で表示しています。GSTが適用される場合は、請求書に明記します。",
            "月額プランは、毎月前払いで請求書をお送りします。お支払いの期限は、請求書の発行日から14日以内です。単発のプロモ動画は、制作を始める前に全額をお支払いいただきます。",
            "広告費は料金に含まれません。広告費は、お客様名義の広告アカウントを通じて、お客様のお支払い方法からMetaへ直接支払われます。当方が広告費をお預かりしたり、上乗せしたりすることはありません。",
          ),
        ],
      },
      {
        h: "3. ご契約の期間と解約",
        p: [
          "月額プランは、1か月ごとに自動で更新されます。契約期間の縛りはなく、いつでも解約できます。解約は、次の請求日の前日までにメールでお知らせください。すでにお支払いいただいた当月分の返金はいたしかねますが、当月の末日までサービスは続きます。",
        ],
      },
      {
        h: "4. 素材とご確認",
        p: [
          L(
            "動画の制作には、お客様からご提供いただく写真、ロゴ、商品画像、文章などを使います。ご提供いただく素材について、お客様が使用する権利をお持ちであることをご確認ください。",
            "制作した動画は、投稿や広告に使う前にお客様にご確認いただきます。小さな修正（文字の訂正、順番の入れ替えなど）は料金の範囲内で対応します。構成を変えるような大きな作り直しは、事前にご相談のうえ対応します。",
            "動画の制作にはAIツールを使います。公開の前には、必ず人が編集と確認を行います。",
          ),
        ],
      },
      {
        h: "5. 動画の権利",
        p: [
          "お支払いの完了をもって、納品した動画をお客様のお店や事業の宣伝のために自由にお使いいただけます（SNSへの投稿、広告、ウェブサイト、店頭など）。当方は、実績の紹介として動画を掲載することがあります。ご希望に添わない場合は、お知らせいただければ掲載しません。",
        ],
      },
      {
        h: "6. Meta広告のアカウント",
        p: [
          L(
            "広告は、お客様名義のMeta広告アカウントと、InstagramとFacebookのアカウントで配信します。当方はMeta Business Suiteのパートナーとしてアクセス権をいただき、パスワードはお預かりしません。アクセス権はいつでも外していただけます。",
            "広告アカウントの開設、本人確認、お支払い方法の登録は、お客様ご自身に行っていただきます。設定はお手伝いします。",
            "広告の内容は、Metaの広告ポリシーに従います。Metaの審査や判断により、広告が配信されないことや、アカウントが制限されることがあります。こうしたMeta側の判断について、当方は責任を負いかねます。",
          ),
        ],
      },
      {
        h: "7. 成果について",
        p: [
          "広告や動画による集客や売上などの成果は、保証できません。当方がお約束するのは、毎月の動画の制作、毎週の広告の確認と調整、月に一度のレポートといった作業を続けることです。",
        ],
      },
      {
        h: "8. 責任の範囲",
        p: [
          "当方の責任は、法律で認められる範囲で、問題が生じた月にお客様からいただいた料金の額を上限とします。お客様の事業の売上の減少や機会の損失など、間接的な損害については責任を負いかねます。オーストラリア消費者法など、法律で排除できない保証や責任は、本条によって制限されません。",
        ],
      },
      {
        h: "9. サービスの停止",
        p: [
          "お支払いの遅れが続く場合や、法令またはMetaのポリシーに反する内容のご依頼があった場合、当方はサービスの提供を止めることがあります。その場合も、すでに納品した動画の権利は第5条のとおりです。",
        ],
      },
      { h: "10. 準拠法", p: ["本規約は、オーストラリアのニューサウスウェールズ州の法律に従って解釈されます。"] },
      {
        h: "11. 規約の変更",
        p: [
          "内容を変更する場合は、本ページで公開します。料金や解約の条件など重要な変更は、適用の少なくとも30日前に、ご契約中のお客様へメールでお知らせします。",
        ],
      },
      { h: "12. お問い合わせ", p: ["本規約に関するご質問は、{email} までお寄せください。"] },
    ],
  },
  en: {
    kicker: "Terms of service",
    title: "The terms we work on",
    description: "The terms for VAI MOTION's video production and Meta ads management: prices, payment, cancellation, rights to the videos and your ad account.",
    intro:
      "These terms apply to the video production and Meta ads management services provided by VAI MOTION (operated by Masaki Kawakami, “we”). By signing up you agree to them.",
    updated: "Last updated 28 October 2026",
    back: "Back to VAI MOTION",
    sections: [
      {
        h: "1. What we provide",
        p: [
          L(
            "Monthly plans: a set number of short videos each month, made from the photos, logo and other material you give us. On a plan with ads, we also set up Instagram and Facebook ads, check and adjust them every week, and send a report every month.",
            "Standalone promo videos: 16:9 landscape videos made to order.",
          ),
          "The number of videos and the price of each plan are as shown in the pricing section of this site.",
        ],
      },
      {
        h: "2. Prices and payment",
        p: [
          L(
            "Prices are in Australian dollars. Where GST applies, it is shown on the invoice.",
            "Monthly plans are invoiced in advance each month, payable within 14 days of the invoice date. Standalone promo videos are paid in full before work starts.",
            "Ad spend is not included. It is charged by Meta to your own payment method, in your own ad account. We never hold it or add a markup.",
          ),
        ],
      },
      {
        h: "3. Term and cancellation",
        p: [
          "Monthly plans renew every month. There is no minimum term and you can cancel at any time by email, up to the day before your next billing date. The current month, once paid, is not refunded, and the service continues to the end of that month.",
        ],
      },
      {
        h: "4. Your material and approval",
        p: [
          L(
            "We make the videos from the photos, logos, product images and text you give us. Please make sure you have the right to use whatever you send us.",
            "You review every video before it is posted or used in an ad. Small changes (fixing text, reordering shots) are included. A rework that changes the structure of a video is discussed and agreed first.",
            "We use AI tools in production. A person edits and checks every video before it is published.",
          ),
        ],
      },
      {
        h: "5. Rights to the videos",
        p: [
          "Once paid for, the videos we deliver are yours to use freely to promote your business: social media, ads, your website, in store. We may show the work as an example of what we do. If you would rather we didn't, tell us and we won't.",
        ],
      },
      {
        h: "6. Your Meta ad account",
        p: [
          L(
            "Ads run in your own Meta ad account and your own Instagram and Facebook accounts. We work through partner access in Meta Business Suite and never hold a password. You can remove our access at any time.",
            "Opening the ad account, verifying it and adding a payment method are done by you. We help with the setup.",
            "Ads must follow Meta's advertising policies. Meta's review and decisions can stop an ad from running or restrict an account, and we are not responsible for those decisions.",
          ),
        ],
      },
      {
        h: "7. Results",
        p: [
          "We cannot guarantee customers, sales or any other result from the videos or the ads. What we promise is the work: new videos every month, ads checked and adjusted every week, and a report every month.",
        ],
      },
      {
        h: "8. Liability",
        p: [
          "To the extent the law allows, our liability is limited to the fees you paid us for the month in which the problem arose, and we are not liable for indirect loss such as lost sales or lost opportunity. Nothing in these terms limits a guarantee or liability that cannot be excluded by law, including under the Australian Consumer Law.",
        ],
      },
      {
        h: "9. Suspension",
        p: [
          "We may stop providing the service if payment is repeatedly late, or if a request would breach the law or Meta's policies. Rights to videos already delivered remain as set out in section 5.",
        ],
      },
      { h: "10. Governing law", p: ["These terms are governed by the law of New South Wales, Australia."] },
      {
        h: "11. Changes to these terms",
        p: [
          "Changes are published on this page. Important changes, such as to prices or cancellation, are sent to current customers by email at least 30 days before they apply.",
        ],
      },
      { h: "12. Contact", p: ["Questions about these terms: {email}."] },
    ],
  },
};

export const LEGAL = { privacy, terms } as const;
export type LegalKind = keyof typeof LEGAL;
