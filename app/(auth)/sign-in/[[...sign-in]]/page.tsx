/**
 * Sign-in page.
 *
 * Renders Clerk's <SignIn/> when Clerk is configured; otherwise the
 * self-hosted fallback form. The Clerk component is loaded via `next/dynamic`
 * with `ssr: false` and only when configured, so the page never imports the
 * Clerk SDK (and never throws) when keys are absent.
 */
import { isClerkConfigured } from "../../_components/clerk-configured";
import { SelfHostedSignIn } from "../../_components/fallback-forms";
import { ClerkSignIn } from "../../_components/clerk-widgets";

export const metadata = { title: "Sign in · Syntheon" };

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
