import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as gmail from "./index";
import type { gmail_v1 } from "googleapis";

const OLD_ENV = { ...process.env };

function mockGmail() {
  return {
    users: {
      messages: {
        send: vi.fn().mockResolvedValue({ data: { id: "msg_1" } }),
        list: vi.fn().mockResolvedValue({ data: { messages: [{ id: "m1" }] } }),
        get: vi.fn().mockResolvedValue({ data: { threadId: "t1", snippet: "hello" } }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe("gmail adapter", () => {
  beforeEach(() => {
    process.env.GMAIL_CLIENT_ID = "cid";
    process.env.GMAIL_CLIENT_SECRET = "csec";
    process.env.GMAIL_REFRESH_TOKEN = "rtok";
    gmail.__setGmail(mockGmail());
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    gmail.__setGmail(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires all three oauth vars", () => {
    expect(gmail.isConfigured()).toBe(true);
    delete process.env.GMAIL_REFRESH_TOKEN;
    expect(gmail.isConfigured()).toBe(false);
  });

  it("builds a base64url raw message with headers", () => {
    const raw = gmail.buildRawMessage({ to: "a@b.c", subject: "Hi", body: "yo" });
    expect(raw).not.toMatch(/[+/=]/); // base64url-safe
    const decoded = Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
    expect(decoded).toMatch(/To: a@b.c/);
    expect(decoded).toMatch(/Subject: Hi/);
    expect(decoded).toMatch(/yo$/);
  });

  it("sends an email and returns the id", async () => {
    const res = await gmail.sendEmail({ to: "a@b.c", subject: "Hi", body: "yo" });
    expect(res.id).toBe("msg_1");
  });

  it("rejects a send with no recipient", async () => {
    await expect(gmail.sendEmail({ to: [], subject: "x", body: "y" })).rejects.toThrow(/recipient/);
  });

  it("lists message summaries", async () => {
    const res = await gmail.listMessages("is:unread", 5);
    expect(res).toEqual([{ id: "m1", threadId: "t1", snippet: "hello" }]);
  });
});
