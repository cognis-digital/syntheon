import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as identity from "./index";
import { __setStripe } from "../stripe/index";

const OLD_ENV = { ...process.env };

function mockStripe() {
  return {
    identity: {
      verificationSessions: {
        create: vi.fn().mockResolvedValue({
          id: "vs_1",
          client_secret: "vs_1_secret",
          url: "https://verify/vs_1",
          status: "requires_input",
        }),
        retrieve: vi.fn().mockResolvedValue({
          id: "vs_1",
          status: "verified",
          verified_outputs: { first_name: "A" },
        }),
      },
    },
    webhooks: {
      constructEvent: vi.fn().mockReturnValue({
        type: "identity.verification_session.verified",
        data: { object: { id: "vs_1", status: "verified" } },
      }),
    },
  } as unknown as import("stripe").default;
}

describe("stripe-identity adapter", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    __setStripe(mockStripe());
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    __setStripe(null);
    vi.restoreAllMocks();
  });

  it("isConfigured tracks stripe secret", () => {
    expect(identity.isConfigured()).toBe(true);
    delete process.env.STRIPE_SECRET_KEY;
    expect(identity.isConfigured()).toBe(false);
  });

  it("creates a verification session", async () => {
    const res = await identity.createVerificationSession({ returnUrl: "https://back" });
    expect(res.id).toBe("vs_1");
    expect(res.clientSecret).toBe("vs_1_secret");
  });

  it("retrieves a verification session", async () => {
    const res = await identity.getVerificationSession("vs_1");
    expect(res.status).toBe("verified");
  });

  it("verifies + interprets an identity webhook", () => {
    const res = identity.handleIdentityWebhook("{}", "sig");
    expect(res).toEqual({
      type: "identity.verification_session.verified",
      sessionId: "vs_1",
      status: "verified",
      handled: true,
    });
  });
});
