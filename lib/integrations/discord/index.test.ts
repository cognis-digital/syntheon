import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as discord from "./index";

const OLD_ENV = { ...process.env };

describe("discord adapter", () => {
  beforeEach(() => {
    process.env.DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1/abc";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    discord.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the webhook url", () => {
    expect(discord.isConfigured()).toBe(true);
    delete process.env.DISCORD_WEBHOOK_URL;
    expect(discord.isConfigured()).toBe(false);
  });

  it("sends a plain-text message", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 204 } as Response);
    discord.__setFetch(f as unknown as typeof fetch);
    const res = await discord.sendMessage("gm");
    expect(res.status).toBe(204);
    expect(JSON.parse(f.mock.calls[0][1].body as string)).toEqual({ content: "gm" });
  });

  it("sends embeds with a custom username", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 204 } as Response);
    discord.__setFetch(f as unknown as typeof fetch);
    await discord.sendMessage({ content: "hi", username: "bot", embeds: [{ title: "T" }] });
    const body = JSON.parse(f.mock.calls[0][1].body as string);
    expect(body.username).toBe("bot");
    expect(body.embeds).toEqual([{ title: "T" }]);
  });
});
