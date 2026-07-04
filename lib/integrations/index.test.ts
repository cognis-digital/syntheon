import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  integrations,
  getIntegration,
  integrationsByCategory,
  configuredIntegrations,
} from "./index";

const OLD_ENV = { ...process.env };

describe("integration registry", () => {
  beforeEach(() => {
    // Strip all integration env so nothing is "configured" by default.
    for (const key of Object.keys(process.env)) {
      if (
        /^(NEXT_PUBLIC_CLERK|CLERK|STRIPE|CALENDLY|CALCOM|NEXT_PUBLIC_CAL|RESEND|EMAIL_FROM|GMAIL|ANTHROPIC|OPENAI|PERSONA|HUBSPOT|ZAPIER|N8N|SLACK|DISCORD|TWILIO|SEGMENT|NEXT_PUBLIC_POSTHOG|NOTION|AIRTABLE|PLAID)/.test(
          key,
        )
      ) {
        delete process.env[key];
      }
    }
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("registers all 22 adapters", () => {
    expect(integrations).toHaveLength(22);
  });

  it("has unique ids", () => {
    const ids = integrations.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry declares env vars, a label, and a config guard", () => {
    for (const i of integrations) {
      expect(i.id).toBeTruthy();
      expect(i.label).toBeTruthy();
      expect(i.category).toBeTruthy();
      expect(Array.isArray(i.env)).toBe(true);
      expect(i.env.length).toBeGreaterThan(0);
      expect(typeof i.isConfigured).toBe("function");
    }
  });

  it("isConfigured never throws with no env set", () => {
    for (const i of integrations) {
      expect(() => i.isConfigured()).not.toThrow();
      expect(i.isConfigured()).toBe(false);
    }
  });

  it("looks up an integration by id", () => {
    expect(getIntegration("stripe")?.label).toBe("Stripe");
    expect(getIntegration("nope")).toBeUndefined();
  });

  it("filters by category", () => {
    const messaging = integrationsByCategory("messaging").map((i) => i.id);
    expect(messaging).toEqual(expect.arrayContaining(["slack", "discord", "twilio"]));
    const ai = integrationsByCategory("ai").map((i) => i.id);
    expect(ai).toEqual(expect.arrayContaining(["claude", "openai"]));
  });

  it("reports configured integrations from env", () => {
    expect(configuredIntegrations()).toEqual([]);
    process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/x";
    process.env.ANTHROPIC_API_KEY = "sk-ant";
    expect(configuredIntegrations().sort()).toEqual(["claude", "slack"]);
  });
});
