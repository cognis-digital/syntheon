import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as clerk from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response;
}

describe("clerk adapter", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test";
    process.env.CLERK_SECRET_KEY = "sk_test";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    clerk.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires both keys", () => {
    expect(clerk.isConfigured()).toBe(true);
    delete process.env.CLERK_SECRET_KEY;
    expect(clerk.isConfigured()).toBe(false);
  });

  it("authUrls falls back to defaults", () => {
    expect(clerk.authUrls()).toEqual({
      signIn: "/sign-in",
      signUp: "/sign-up",
      waitlist: "/waitlist",
    });
  });

  it("adds an email to the waitlist with auth header", async () => {
    const f = vi.fn().mockResolvedValue(
      jsonResponse({ id: "wl_1", email_address: "a@b.c", status: "pending" }),
    );
    clerk.__setFetch(f as unknown as typeof fetch);
    const entry = await clerk.addToWaitlist("a@b.c");
    expect(entry.id).toBe("wl_1");
    const [, init] = f.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer sk_test");
  });

  it("lists waitlist entries handling the data envelope", async () => {
    clerk.__setFetch(
      vi.fn().mockResolvedValue(jsonResponse({ data: [{ id: "wl_2" }] })) as unknown as typeof fetch,
    );
    const res = await clerk.listWaitlist({ limit: 10 });
    expect(res[0].id).toBe("wl_2");
  });

  it("throws a typed error on non-ok responses", async () => {
    clerk.__setFetch(
      vi.fn().mockResolvedValue(jsonResponse({ error: "nope" }, false, 422)) as unknown as typeof fetch,
    );
    await expect(clerk.addToWaitlist("x")).rejects.toThrow(/clerk.*422/);
  });
});
