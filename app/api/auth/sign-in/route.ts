import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/auth/store";
import { writeSessionToken, type CookieStore } from "@/lib/auth/cookies";

/**
 * Self-hosted sign-in endpoint the fallback auth form POSTs to (used when Clerk
 * is not configured). Verifies credentials, mints a session, sets the cookie.
 */
export const runtime = "nodejs";

const WEEK_SEC = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid request body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }

  const user = store.authenticate(email, password);
  if (!user) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const session = store.createSession(user.id);
  writeSessionToken((await cookies()) as unknown as CookieStore, session.token, WEEK_SEC);
  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email },
  });
}
