import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getSession,
  requireUser,
  signOut,
  setAuthAdapter,
  activeProvider,
  UnauthenticatedError,
} from "./index";
import type { AuthAdapter, Session } from "./types";
import { ANONYMOUS } from "./types";

const OLD_ENV = { ...process.env };

function stubAdapter(session: Session): AuthAdapter & { signedOut: boolean } {
  const a = {
    id: "self-hosted" as const,
    signedOut: false,
    isConfigured: () => true,
    getSession: async () => session,
    signOut: async () => {
      a.signedOut = true;
    },
  };
  return a;
}

describe("auth interface", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;
    setAuthAdapter(null);
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    setAuthAdapter(null);
  });

  it("defaults to the self-hosted provider when Clerk env is absent", () => {
    expect(activeProvider()).toBe("self-hosted");
  });

  it("selects Clerk when its keys are present", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test";
    process.env.CLERK_SECRET_KEY = "sk_test";
    expect(activeProvider()).toBe("clerk");
  });

  it("getSession returns anonymous by default (no throw)", async () => {
    const s = await getSession();
    expect(s.isAuthenticated).toBe(false);
    expect(s.user).toBeNull();
  });

  it("getSession never throws even if the adapter throws", async () => {
    setAuthAdapter({
      id: "self-hosted",
      isConfigured: () => true,
      getSession: async () => {
        throw new Error("boom");
      },
      signOut: async () => {},
    });
    await expect(getSession()).resolves.toEqual(ANONYMOUS);
  });

  it("requireUser returns the user when authenticated", async () => {
    setAuthAdapter(
      stubAdapter({
        isAuthenticated: true,
        user: { id: "usr_1", email: "a@b.c" },
      }),
    );
    const user = await requireUser();
    expect(user.id).toBe("usr_1");
  });

  it("requireUser throws UnauthenticatedError when anonymous", async () => {
    setAuthAdapter(stubAdapter(ANONYMOUS));
    await expect(requireUser()).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("signOut delegates to the active adapter", async () => {
    const a = stubAdapter(ANONYMOUS);
    setAuthAdapter(a);
    await signOut();
    expect(a.signedOut).toBe(true);
  });

  it("signOut never throws", async () => {
    setAuthAdapter({
      id: "self-hosted",
      isConfigured: () => true,
      getSession: async () => ANONYMOUS,
      signOut: async () => {
        throw new Error("nope");
      },
    });
    await expect(signOut()).resolves.toBeUndefined();
  });
});
