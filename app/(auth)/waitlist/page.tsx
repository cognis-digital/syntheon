/**
 * Waitlist page.
 *
 * Renders Clerk's <Waitlist/> when Clerk is configured (and waitlist mode is
 * enabled on the Clerk instance); otherwise the self-hosted waitlist form,
 * which posts to `/api/auth/waitlist` and records via `lib/auth`'s
 * `joinWaitlist`. Never throws when Clerk env is absent.
 */
import dynamic from "next/dynamic";
import { isClerkConfigured } from "../_components/clerk-configured";
import { SelfHostedWaitlist } from "../_components/fallback-forms";

export const metadata = { title: "Join the waitlist · Syntheon" };

const ClerkWaitlist = dynamic(
  () => import("@clerk/nextjs").then((m) => m.Waitlist),
  { ssr: false },
);

const clerkAppearance = {
  variables: { colorPrimary: "hsl(262 83% 58%)", borderRadius: "0.65rem" },
  elements: { card: "shadow-none border border-border" },
} as const;

export default function WaitlistPage() {
  if (isClerkConfigured()) {
    return <ClerkWaitlist appearance={clerkAppearance} signInUrl="/sign-in" />;
  }
  return <SelfHostedWaitlist />;
}
