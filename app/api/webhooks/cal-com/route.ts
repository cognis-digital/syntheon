/**
 * Cal.com webhook endpoint. Verifies the X-Cal-Signature-256 HMAC and
 * interprets BOOKING_CREATED / CANCELLED / RESCHEDULED events.
 */
import { NextResponse } from "next/server";
import { handleWebhook, isConfigured } from "@/lib/integrations/cal-com/index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return NextResponse.json({ error: "cal.com not configured" }, { status: 503 });
  }
  const signature = req.headers.get("x-cal-signature-256");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }
  const payload = await req.text();
  try {
    const result = handleWebhook(payload, signature);
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "invalid signature" },
      { status: 400 },
    );
  }
}
