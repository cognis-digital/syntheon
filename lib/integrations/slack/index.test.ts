import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as slack from "./index";

const OLD_ENV = { ...process.env };

describe("slack adapter", () => {
  beforeEach(() => {
    process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/T/B/X";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    slack.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the webhook url", () => {
    expect(slack.isConfigured()).toBe(true);
    delete process.env.SLACK_WEBHOOK_URL;
    expect(slack.isConfigured()).toBe(false);
  });

  it("sends a plain-text message", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
    slack.__setFetch(f as unknown as typeof fetch);
    const res = await slack.sendMessage("hello");
    expect(res.ok).toBe(true);
    expect(JSON.parse(f.mock.calls[0][1].body as string)).toEqual({ text: "hello" });
  });

  it("sends a structured message with blocks", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 } as Response);
    slack.__setFetch(f as unknown as typeof fetch);
    await slack.sendMessage({ text: "hi", iconEmoji: ":wave:", blocks: [{ type: "section" }] });
    const body = JSON.parse(f.mock.calls[0][1].body as string);
    expect(body.icon_emoji).toBe(":wave:");
    expect(body.blocks).toEqual([{ type: "section" }]);
  });
});
