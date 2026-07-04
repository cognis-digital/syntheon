"use client";

/**
 * Client-only Clerk auth widgets.
 *
 * `next/dynamic` with `ssr: false` is only permitted inside a Client Component
 * (Next 15), so the lazy Clerk imports live here. Server pages import these and
 * render them conditionally (only when Clerk is configured), which keeps the
 * Clerk SDK out of the bundle path when it's unused.
 */
import dynamic from "next/dynamic";

export const ClerkSignIn = dynamic(
  () => import("@clerk/nextjs").then((m) => m.SignIn),
  { ssr: false },
);

export const ClerkSignUp = dynamic(
  () => import("@clerk/nextjs").then((m) => m.SignUp),
  { ssr: false },
);

export const ClerkWaitlist = dynamic(
  () => import("@clerk/nextjs").then((m) => m.Waitlist),
  { ssr: false },
);
