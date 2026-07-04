import { describe, expect, it } from "vitest";
import { protect, isPublicPath } from "./middleware";

describe("middleware helpers", () => {
  it("marks default public paths public", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/sign-in")).toBe(true);
    expect(isPublicPath("/sign-in/factor-one")).toBe(true);
    expect(isPublicPath("/waitlist")).toBe(true);
    expect(isPublicPath("/api/webhooks/stripe")).toBe(true);
  });

  it("marks app paths private", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/settings/billing")).toBe(false);
  });

  it("allows public paths regardless of auth", () => {
    expect(protect("/", false).action).toBe("allow");
    expect(protect("/sign-in", false).action).toBe("allow");
  });

  it("allows private paths when authenticated", () => {
    expect(protect("/dashboard", true).action).toBe("allow");
  });

  it("redirects unauthenticated page requests to sign-in with return url", () => {
    const d = protect("/dashboard", false);
    expect(d.action).toBe("redirect");
    if (d.action === "redirect") {
      expect(d.to).toContain("/sign-in?redirect_url=");
      expect(d.to).toContain(encodeURIComponent("/dashboard"));
    }
  });

  it("returns 401 for unauthenticated API requests", () => {
    expect(protect("/api/private", false).action).toBe("unauthorized");
  });

  it("honors custom public paths", () => {
    expect(protect("/beta", false, { publicPaths: ["/beta"] }).action).toBe("allow");
  });
});
