import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as twilio from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}

describe("twilio adapter", () => {
  beforeEach(() => {
    process.env.TWILIO_ACCOUNT_SID = "ACxxx";
    process.env.TWILIO_AUTH_TOKEN = "tok";
    process.env.TWILIO_FROM_NUMBER = "+15550001111";
    process.env.TWILIO_VERIFY_SERVICE_SID = "VAxxx";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    twilio.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires sid + token", () => {
    expect(twilio.isConfigured()).toBe(true);
    delete process.env.TWILIO_AUTH_TOKEN;
    expect(twilio.isConfigured()).toBe(false);
  });

  it("sends an SMS with basic auth and form body", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ sid: "SM1", status: "queued" }));
    twilio.__setFetch(f as unknown as typeof fetch);
    const res = await twilio.sendSms("+15552223333", "hi");
    expect(res).toEqual({ sid: "SM1", status: "queued" });
    const init = f.mock.calls[0][1];
    expect((init.headers as Record<string, string>).Authorization).toMatch(/^Basic /);
    expect(init.body as string).toContain("To=%2B15552223333");
    expect(init.body as string).toContain("Body=hi");
  });

  it("starts a verification", async () => {
    twilio.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ sid: "VE1", status: "pending" })) as unknown as typeof fetch);
    const res = await twilio.startVerification("+15552223333");
    expect(res.status).toBe("pending");
  });

  it("checks a verification code", async () => {
    twilio.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ status: "approved" })) as unknown as typeof fetch);
    const res = await twilio.checkVerification("+15552223333", "123456");
    expect(res.approved).toBe(true);
  });
});
