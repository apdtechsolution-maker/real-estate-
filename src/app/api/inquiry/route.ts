import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { inquirySchema } from "@/lib/inquiry-schema";

export const dynamic = "force-dynamic";

// Lightweight in-memory rate limiting (per server instance).
const hits = new Map<string, { count: number; at: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX = 8;

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.at > WINDOW) {
    hits.set(ip, { count: 1, at: now });
    return false;
  }
  h.count += 1;
  return h.count > MAX;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const d = parsed.data;
  // Honeypot: silently accept bots without storing.
  if (d.company) return NextResponse.json({ ok: true, reference: "AE-000000" });

  try {
    const [row] = await db
      .insert(inquiries)
      .values({
        fullName: d.fullName,
        email: d.email.toLowerCase(),
        countryCode: d.countryCode,
        phone: d.phone.replace(/[^\d+]/g, ""),
        market: d.market,
        propertyInterest: d.propertyInterest,
        preferredContact: d.preferredContact,
        message: d.message || null,
        source: d.source ?? null,
      })
      .returning({ id: inquiries.id });

    const reference = `AE-${String(row.id).padStart(6, "0")}`;

    // Optional CRM / automation hand-off. Configure LEAD_WEBHOOK_URL (+ LEAD_WEBHOOK_SECRET) in env.
    const hook = process.env.LEAD_WEBHOOK_URL;
    if (hook) {
      fetch(hook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` } : {}),
        },
        body: JSON.stringify({ reference, ...d, consent: undefined, company: undefined }),
      }).catch((err) => console.error("Lead webhook failed", err));
    }

    return NextResponse.json({ ok: true, reference });
  } catch (err) {
    console.error("Inquiry insert failed", err);
    return NextResponse.json({ ok: false, error: "We couldn't submit your request right now. Please try again." }, { status: 500 });
  }
}
