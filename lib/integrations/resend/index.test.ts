import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as resend from "./index";
import type { Resend } from "resend";

const OLD_ENV = { ...process.env };

function mockResend(overrides: Record<string, unknown> = {}) {
  return {
    emails: { send: vi.fn().mockResolvedValue({ data: { id: "em_1" }, error: null }) },
    broadcasts: {
      create: vi.fn().mockResolvedValue({ data: { id: "bc_1" }, error: null }),
      send: vi.fn().mockResolvedValue({ data: { id: "bc_1" }, error: null }),
    },
    contacts: { create: vi.fn().mockResolvedValue({ data: { id: "ct_1" }, error: null }) },
    ...overrides,
  } as unknown as Resend;
}

describe("resend adapter", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_FROM = "hi@acme.dev";
    resend.__setResend(mockResend());
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    resend.__setResend(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the api key", () => {
    expect(resend.isConfigured()).toBe(true);
    delete process.env.RESEND_API_KEY;
    expect(resend.isConfigured()).toBe(false);
  });

  it("sends a transactional email", async () => {
    const res = await resend.sendEmail({ to: "a@b.c", subject: "Hi", html: "<p>yo</p>" });
    expect(res.id).toBe("em_1");
  });

  it("requires a body", async () => {
    await expect(resend.sendEmail({ to: "a@b.c", subject: "Hi" })).rejects.toThrow(/html\/text\/react/);
  });

  it("surfaces provider errors as IntegrationError", async () => {
    resend.__setResend(
      mockResend({ emails: { send: vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } }) } }),
    );
    await expect(resend.sendEmail({ to: "a@b.c", subject: "x", text: "y" })).rejects.toThrow(/boom/);
  });

  it("creates + sends a broadcast", async () => {
    const c = await resend.createBroadcast({ audienceId: "aud_1", subject: "News", html: "<p>hi</p>" });
    expect(c.id).toBe("bc_1");
    const s = await resend.sendBroadcast("bc_1");
    expect(s.id).toBe("bc_1");
  });

  it("adds a contact to an audience", async () => {
    const res = await resend.addContact("aud_1", "a@b.c", { firstName: "A" });
    expect(res.id).toBe("ct_1");
  });
});
