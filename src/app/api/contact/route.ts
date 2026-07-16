import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  business?: string;
  plan?: string;
  industry?: string;
  email?: string;
  social_platform?: string;
  social?: string;
  post?: string;
  message?: string;
};

const PLAN_LABEL: Record<string, string> = {
  light: "Light ($300/mo)",
  std: "Growth ($600/mo)",
  promo: "Promo video (one-off)",
  undecided: "Not sure yet",
};

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Slack mrkdwn requires &, <, > escaped (also stops form input breaking the message).
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  if (!name || !isEmail(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const plan = data.plan ? PLAN_LABEL[data.plan] ?? data.plan : "—";
  const field = (label: string, value?: string) => ({
    type: "mrkdwn" as const,
    text: `*${label}:*\n${esc((value ?? "").trim() || "—")}`,
  });

  const blocks: unknown[] = [
    { type: "header", text: { type: "plain_text", text: `New enquiry — ${name}`, emoji: true } },
    {
      type: "section",
      fields: [
        field("Plan", plan),
        field("Email", email),
        field("Business", data.business),
        field("Industry", data.industry),
        field("Social / web", [data.social_platform, data.social].filter(Boolean).join(" ")),
        field("Wants posting", data.post),
      ],
    },
  ];
  if ((data.message ?? "").trim()) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Message:*\n${esc(data.message!.trim())}` },
    });
  }

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New enquiry — ${name} (${email}) · ${plan}`, // notification fallback
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
  } else {
    // No webhook configured yet — accept and log so enquiries aren't lost during setup.
    // To enable Slack delivery, set SLACK_WEBHOOK_URL (an Incoming Webhook URL).
    console.log("contact enquiry (no SLACK_WEBHOOK_URL set):", JSON.stringify({ name, email, plan, ...data }));
  }

  return NextResponse.json({ ok: true });
}
