import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as zapier from "./index";

const OLD_ENV = { ...process.env };

describe("zapier adapter", () => {
  beforeEach(() => {
    process.env.ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/1/abc";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    zapier.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the webhook url", () => {
    expect(zapier.isConfigured()).toBe(true);
    delete process.env.ZAPIER_WEBHOOK_URL;
    expect(zapier.isConfigured()).toBe(false);
  });

  it("triggers a zap with a JSON body", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
    zapier.__setFetch(f as unknown as typeof fetch);
    const res = await zapier.trigger({ event: "signup", email: "a@b.c" });
    expect(res).toEqual({ ok: true, status: 200 });
    const [url, init] = f.mock.calls[0];
    expect(url).toContain("hooks.zapier.com");
    expect(JSON.parse(init.body as string)).toEqual({ event: "signup", email: "a@b.c" });
  });

  it("parses an inbound action", () => {
    const parsed = zapier.parseInboundAction('{"action":"create_contact","email":"x@y.z"}');
    expect(parsed).toEqual({ action: "create_contact", data: { email: "x@y.z" } });
  });

  it("verifies an inbound shared token", () => {
    process.env.ZAPIER_INBOUND_TOKEN = "s3cret";
    expect(zapier.verifyInboundToken("s3cret")).toBe(true);
    expect(zapier.verifyInboundToken("nope")).toBe(false);
    delete process.env.ZAPIER_INBOUND_TOKEN;
    expect(zapier.verifyInboundToken("s3cret")).toBe(false);
  });
});
