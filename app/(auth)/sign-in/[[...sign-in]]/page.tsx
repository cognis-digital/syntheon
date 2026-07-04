/**
 * Sign-in page.
 *
 * Renders Clerk's <SignIn/> when Clerk is configured; otherwise the
 * self-hosted fallback form. The Clerk component is loaded via `next/dynamic`
 * with `ssr: false` and only when configured, so the page never imports the
 * Clerk SDK (and never throws) when keys are absent.
 */
import dynamic from "next/dynamic";
import { isClerkConfigured } from "../../_components/clerk-configured";
import { SelfHostedSignIn } from "../../_components/fallback-forms";

export const metadata = { title: "Sign in · Syntheon" };

const ClerkSignIn = dynamic(
  () => import("@clerk/nextjs").then((m) => m.SignIn),
  { ssr: false },
);

const clerkAppearance = {
  variables: { colorPrimary: "hsl(262 83% 58%)", borderRadius: "0.65rem" },
  elements: { card: "shadow-none border border-border" },
} as const;

export default function SignInPage() {
  if (isClerkConfigured()) {
    return (
      <ClerkSignIn
        appearance={clerkAppearance}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/"
      />
    );
  }
  return <SelfHostedSignIn />;
}
