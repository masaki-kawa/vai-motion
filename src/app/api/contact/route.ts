import { NextResponse } from "next/server";
import { I18N_JP } from "@/lib/i18n.jp";
import { DERIVED, PRICING, money } from "@/lib/pricing";

export const runtime = "nodejs";

/** Everything arrives as untrusted JSON; only strings are read (see `str`). */
type Payload = {
  name?: unknown;
  business?: unknown;
  plan?: unknown;
  industry?: unknown;
  email?: unknown;
  /** "/" sends one free-text field; the old /jp form also sends a platform picker */
  social_platform?: unknown;
  social?: unknown;
  /** "/" only, and only while the fields are shown: under500 | 500to1000 | over1000 | unsure */
  ad_budget?: unknown;
  /** "/" only, and only while the field is shown: yes | no */
  ads_before?: unknown;
  /** legacy /jp "post for you" toggle: yes | no */
  post?: unknown;
  message?: unknown;
  /** language the form was filled in: en | ja */
  lang?: unknown;
};

/** Plan names for Slack, built from the one pricing source so they never drift from the page. */
const PLAN_LABEL: Record<string, string> = {
  lightAds: `Light + Ads (${money(DERIVED.lightAds, "en")}/mo + ad spend)`,
  growthAds: `Growth + Ads (${money(DERIVED.growthAds, "en")}/mo + ad spend)`,
  light: `Videos only, Light (${money(PRICING.videos.light.price, "en")}/mo)`,
  growth: `Videos only, Growth (${money(PRICING.videos.growth.price, "en")}/mo)`,
  promo: `Standalone promo video (from ${money(PRICING.promo.short, "en")})`,
  undecided: "Not sure yet",
};

/** The old /jp page posts light | std | promo | undecided and prices them in yen, tax included:
 *  its labels come from the /jp dictionary, so Slack shows what that page showed. */
const jp = I18N_JP.en;
const JP_PLAN_LABEL: Record<string, string> = {
  light: `/jp ${jp["pr.light.name"]} — ${jp["pr.light.price"]}${jp["pr.light.per"]}`,
  std: `/jp ${jp["pr.std.name"]} — ${jp["pr.std.price"]}${jp["pr.std.per"]}`,
  promo: `/jp one-off promo (from ${jp["promo.1.price"]}, tax incl.)`,
  undecided: "Not sure yet",
};

/** "/" posts stable English keys; /jp posts its translated labels, which pass through as-is. */
const INDUSTRY_LABEL: Record<string, string> = {
  cafe: "Café or restaurant",
  japanese: "Japanese restaurant",
  salon: "Beauty or hair salon",
  retail: "Retail or fashion",
  cosmetics: "Cosmetics or skincare",
  brand: "Brand, app or SaaS",
  other: "Other",
};

const AD_BUDGET_LABEL: Record<string, string> = {
  under500: "Under $500/mo",
  "500to1000": "$500 to $1,000/mo",
  over1000: "Over $1,000/mo",
  unsure: "Not sure yet",
};

const YES_NO: Record<string, string> = { yes: "Yes", no: "No" };
const LANG_LABEL: Record<string, string> = { en: "English", ja: "Japanese" };

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** a trimmed string, or "" for anything that isn't one */
function str(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

/** look a key up in a label table, falling back to the raw value */
function label(table: Record<string, string>, v: string) {
  return v ? (Object.hasOwn(table, v) ? table[v] : v) : "";
}

// Slack mrkdwn requires &, <, > escaped (also stops form input breaking the message).
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** keep a value inside Slack's block text limits (a block over the limit fails the whole post) */
function clip(s: string, max: number) {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!data || typeof data !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = str(data.name);
  const email = str(data.email);
  if (!name || !isEmail(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const fromJp = data.post !== undefined; // only the legacy /jp form sends `post`
  const plan = label(fromJp ? JP_PLAN_LABEL : PLAN_LABEL, str(data.plan)) || "—";
  const field = (title: string, value?: string) => ({
    type: "mrkdwn" as const,
    text: `*${title}:*\n${esc(clip((value ?? "").trim(), 1800) || "—")}`,
  });

  const fields = [
    field("Plan", plan),
    field("Email", email),
    field("Business", str(data.business)),
    field("Industry", label(INDUSTRY_LABEL, str(data.industry))),
    field("Instagram / web", [str(data.social_platform), str(data.social)].filter(Boolean).join(" ")),
  ];
  // Present only when the form showed them (ad plans, or no plan chosen yet).
  if (data.ad_budget !== undefined) fields.push(field("Monthly ad budget", label(AD_BUDGET_LABEL, str(data.ad_budget))));
  if (data.ads_before !== undefined) fields.push(field("Run IG / FB ads before", label(YES_NO, str(data.ads_before))));
  // Legacy /jp field.
  if (data.post !== undefined) fields.push(field("Wants posting", label(YES_NO, str(data.post))));
  const lang = str(data.lang);
  if (lang) fields.push(field("Language", label(LANG_LABEL, lang)));
  fields.push(field("Page", fromJp ? "/jp (JPY, tax incl.)" : "/ (AUD)"));

  const blocks: unknown[] = [
    {
      type: "header",
      text: { type: "plain_text", text: clip(`New enquiry — ${name}`, 150), emoji: true },
    },
    // a section block holds at most 10 fields: "/" sends 9 at most, /jp 7, and even a payload
    // carrying every optional key stops at 10
    { type: "section", fields },
  ];
  const message = str(data.message);
  if (message) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Message:*\n${esc(clip(message, 2800))}` },
    });
  }

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: esc(`New enquiry — ${name} (${email}) · ${plan}`), // notification fallback
          blocks,
        }),
      });
      if (!res.ok) {
        console.error("contact: Slack webhook error", res.status, await res.text());
        return NextResponse.json({ ok: false, error: "provider" }, { status: 502 });
      }
    } catch (e) {
      console.error("contact: Slack send failed", e);
      return NextResponse.json({ ok: false, error: "send" }, { status: 502 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // In production a missing webhook must not look like success: the form shows its
    // "not sent, try again" message instead of thanking someone whose enquiry went nowhere.
    console.error("contact: SLACK_WEBHOOK_URL is not set; enquiry not delivered");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  } else {
    // Development without a webhook: accept and log (without the address) so the form can be tried.
    // To enable Slack delivery, set SLACK_WEBHOOK_URL (an Incoming Webhook URL).
    console.log("contact enquiry (no SLACK_WEBHOOK_URL set):", JSON.stringify({ ...data, email: "[omitted]", name, plan }));
  }

  return NextResponse.json({ ok: true });
}
