import { describe, expect, it } from "vitest";
import {
  welcomeEmail,
  verifyEmail,
  resetPasswordEmail,
  waitlistApprovedEmail,
  escapeHtml,
  templates,
} from "./templates";

describe("email templates", () => {
  it("escapes html to prevent injection", () => {
    expect(escapeHtml("<script>&\"'")).toBe(
      "&lt;script&gt;&amp;&quot;&#39;",
    );
  });

  it("welcome renders subject, html, text and personalizes", () => {
    const t = welcomeEmail({ firstName: "Ada", dashboardUrl: "https://x.co/app" });
    expect(t.subject).toMatch(/Welcome to Syntheon/);
    expect(t.html).toContain("Ada");
    expect(t.html).toContain("https://x.co/app");
    expect(t.text).toContain("Syntheon");
  });

  it("welcome works with no props (no throw, no CTA)", () => {
    const t = welcomeEmail();
    expect(t.html).toContain("Syntheon");
    expect(t.text.length).toBeGreaterThan(0);
  });

  it("verify includes the verify url and optional code", () => {
    const t = verifyEmail({ verifyUrl: "https://x.co/v?t=1", code: "482913" });
    expect(t.html).toContain("https://x.co/v?t=1");
    expect(t.html).toContain("482913");
    expect(t.subject).toMatch(/Verify/);
  });

  it("reset includes the reset url and safety footer", () => {
    const t = resetPasswordEmail({ resetUrl: "https://x.co/r" });
    expect(t.html).toContain("https://x.co/r");
    expect(t.html).toMatch(/didn't request/i);
  });

  it("waitlist-approved personalizes and optionally links", () => {
    const t = waitlistApprovedEmail({ firstName: "Sam", activateUrl: "https://x.co/a" });
    expect(t.html).toContain("Sam");
    expect(t.html).toContain("https://x.co/a");
    expect(t.subject).toMatch(/waitlist/i);
  });

  it("exposes a registry keyed by template name", () => {
    expect(Object.keys(templates).sort()).toEqual(
      ["reset", "verify", "waitlist-approved", "welcome"].sort(),
    );
  });
});
