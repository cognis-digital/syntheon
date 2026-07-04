import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as cal from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}
function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

describe("cal-com adapter", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CALCOM_LINK = "https://cal.com/acme/30min";
    process.env.CALCOM_API_KEY = "cal_test";
    process.env.CALCOM_WEBHOOK_SECRET = "sec_test";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    cal.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the public link", () => {
    expect(cal.isConfigured()).toBe(true);
    delete process.env.NEXT_PUBLIC_CALCOM_LINK;
    expect(cal.isConfigured()).toBe(false);
  });

  it("builds a booking link with prefill", () => {
    const u = new URL(cal.buildBookingLink({ name: "Jo", email: "j@x.co" }));
    expect(u.searchParams.get("name")).toBe("Jo");
    expect(u.searchParams.get("email")).toBe("j@x.co");
  });

  it("lists bookings via the API with auth", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ data: [{ id: 1, uid: "abc", status: "accepted" }] }));
    cal.__setFetch(f as unknown as typeof fetch);
    const res = await cal.listBookings({ status: "upcoming" });
    expect(res[0].uid).toBe("abc");
    const [, init] = f.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer cal_test");
  });

  it("cancels a booking", async () => {
    cal.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ data: { id: 1, uid: "abc", status: "cancelled" } })) as unknown as typeof fetch);
    const res = await cal.cancelBooking("abc", "changed plans");
    expect(res.status).toBe("cancelled");
  });

  it("verifies signature and handles webhook", () => {
    const payload = JSON.stringify({ triggerEvent: "BOOKING_CREATED", payload: { uid: "abc" } });
    const res = cal.handleWebhook(payload, sign(payload, "sec_test"));
    expect(res.handled).toBe(true);
    expect(res.bookingUid).toBe("abc");
  });

  it("rejects a bad webhook signature", () => {
    const payload = JSON.stringify({ triggerEvent: "BOOKING_CREATED" });
    expect(() => cal.handleWebhook(payload, "deadbeef")).toThrow(/invalid/);
  });
});
