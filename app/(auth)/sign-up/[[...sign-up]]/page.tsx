/**
 * Sign-up page.
 *
 * Renders Clerk's <SignUp/> when configured; otherwise the self-hosted
 * fallback form. Clerk is dynamically imported only when configured so the
 * page renders without throwing when keys are absent.
 */
import dynamic from "next/dynamic";
import { isClerkConfigured } from "../../_components/clerk-configured";
import { SelfHostedSignUp } from "../../_components/fallback-forms";

export const metadata = { title: "Create account · Syntheon" };

const ClerkSignUp = dynamic(
  () => import("@clerk/nextjs").then((m) => m.SignUp),
  { ssr: false },
);

const clerkAppearance = {
  variables: { colorPrimary: "hsl(262 83% 58%)", borderRadius: "0.65rem" },
  elements: { card: "shadow-none border border-border" },
} as const;

export default function SignUpPage() {
  if (isClerkConfigured()) {
    return (
      <ClerkSignUp
        appearance={clerkAppearance}
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    );
  }
  return <SelfHostedSignUp />;
}
