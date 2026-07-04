import { NextResponse } from "next/server";
import { joinWaitlist } from "@/lib/auth";

/**
 * Waitlist join endpoint the fallback waitlist form POSTs to. Works with zero
 * external services (records locally) and forwards to Clerk's hosted waitlist
 * when configured. Never throws — returns a structured JoinResult.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const source = body.source ? String(body.source) : "web";
  const result = await joinWaitlist(email, { source });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
