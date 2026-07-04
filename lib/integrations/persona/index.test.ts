import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as persona from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}
function sign(payload: string, secret: string, t = "1700000000"): string {
  const v1 = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return `t=${t},v1=${v1}`;
}

describe("persona adapter", () => {
  beforeEach(() => {
    process.env.PERSONA_API_KEY = "persona_test";
    process.env.PERSONA_TEMPLATE_ID = "itmpl_1";
    process.env.PERSONA_WEBHOOK_SECRET = "wbhsec_1";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    persona.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the api key", () => {
    expect(persona.isConfigured()).toBe(true);
    delete process.env.PERSONA_API_KEY;
    expect(persona.isConfigured()).toBe(false);
  });

  it("creates an inquiry with bearer auth", async () => {
    const f = vi.fn().mockResolvedValue(
      jsonResponse({ data: { id: "inq_1", attributes: { status: "created" } } }),
    );
    persona.__setFetch(f as unknown as typeof fetch);
    const inq = await persona.createInquiry({ referenceId: "user_9" });
    expect(inq).toEqual({ id: "inq_1", status: "created" });
    expect((f.mock.calls[0][1].headers as Record<string, string>).Authorization).toBe(
      "Bearer persona_test",
    );
  });

  it("verifies + handles an inquiry webhook", () => {
    const payload = JSON.stringify({
      data: {
        attributes: {
          name: "inquiry.completed",
          payload: { data: { id: "inq_1", attributes: { status: "completed" } } },
        },
      },
    });
    const res = persona.handleWebhook(payload, sign(payload, "wbhsec_1"));
    expect(res.handled).toBe(true);
    expect(res.inquiryId).toBe("inq_1");
    expect(res.status).toBe("completed");
  });

  it("rejects a bad webhook signature", () => {
    const payload = JSON.stringify({ data: {} });
    expect(() => persona.handleWebhook(payload, "t=1,v1=bad")).toThrow(/invalid/);
  });
});
