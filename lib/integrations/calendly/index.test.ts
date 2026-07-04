import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as calendly from "./index";

const OLD_ENV = { ...process.env };

function sign(payload: string, key: string, t = "1700000000"): string {
  const v1 = createHmac("sha256", key).update(`${t}.${payload}`).digest("hex");
  return `t=${t},v1=${v1}`;
}

describe("calendly adapter", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CALENDLY_URL = "https://calendly.com/acme/intro";
    process.env.CALENDLY_WEBHOOK_SIGNING_KEY = "whsk_test";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("isConfigured requires the public url", () => {
    expect(calendly.isConfigured()).toBe(true);
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
    expect(calendly.isConfigured()).toBe(false);
  });

  it("builds an embed url with prefill + utm", () => {
    const url = calendly.buildEmbedUrl({
      prefill: { name: "Jane", email: "j@x.co" },
      utm: { utm_source: "site" },
      hideGdprBanner: true,
    });
    const u = new URL(url);
    expect(u.searchParams.get("name")).toBe("Jane");
    expect(u.searchParams.get("email")).toBe("j@x.co");
    expect(u.searchParams.get("utm_source")).toBe("site");
    expect(u.searchParams.get("hide_gdpr_banner")).toBe("1");
  });

  it("verifies a valid signature and rejects a bad one", () => {
    const payload = JSON.stringify({ event: "invitee.created" });
    expect(calendly.verifyWebhookSignature(payload, sign(payload, "whsk_test"))).toBe(true);
    expect(calendly.verifyWebhookSignature(payload, sign(payload, "wrong"))).toBe(false);
  });

  it("handles a scheduled_event webhook", () => {
    const payload = JSON.stringify({
      event: "invitee.created",
      payload: { email: "j@x.co", scheduled_event: { uri: "https://api/ev/1" } },
    });
    const res = calendly.handleWebhook(payload, sign(payload, "whsk_test"));
    expect(res.handled).toBe(true);
    expect(res.inviteeEmail).toBe("j@x.co");
    expect(res.eventUri).toBe("https://api/ev/1");
  });

  it("throws on an invalid webhook signature", () => {
    const payload = JSON.stringify({ event: "invitee.created" });
    expect(() => calendly.handleWebhook(payload, "t=1,v1=deadbeef")).toThrow(/invalid/);
  });
});
