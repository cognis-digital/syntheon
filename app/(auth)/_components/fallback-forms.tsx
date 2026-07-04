/**
 * Self-hosted auth fallback forms.
 *
 * Rendered when Clerk is not configured, so sign-in / sign-up / waitlist all
 * work out of the box against Syntheon's self-hosted auth. These are styled
 * with semantic tokens and use the cross-lane `@/components/ui/*` primitives
 * (button, input, label) that resolve at final integration. They post to the
 * app's auth route handlers (owned by the app/api lane); until those exist the
 * forms degrade to a plain, accessible HTML form that simply navigates.
 */
import Link from "next/link";
import type { ReactNode } from "react";

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 space-y-1">
      <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground text-pretty">{subtitle}</p>
    </div>
  );
}

export function SelfHostedSignIn() {
  return (
    <div>
      <Header title="Sign in to Syntheon" subtitle="Welcome back — pick up where you left off." />
      <form method="post" action="/api/auth/sign-in" className="space-y-4">
        <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@company.com" />
        <Field id="password" label="Password" type="password" autoComplete="current-password" />
        <SubmitButton>Sign in</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Syntheon?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export function SelfHostedSignUp() {
  return (
    <div>
      <Header title="Create your Syntheon account" subtitle="Start building — own every line." />
      <form method="post" action="/api/auth/sign-up" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field id="firstName" label="First name" required={false} autoComplete="given-name" />
          <Field id="lastName" label="Last name" required={false} autoComplete="family-name" />
        </div>
        <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@company.com" />
        <Field id="password" label="Password" type="password" autoComplete="new-password" />
        <SubmitButton>Create account</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export function SelfHostedWaitlist() {
  return (
    <div>
      <Header
        title="Join the Syntheon waitlist"
        subtitle="We'll email you the moment your spot opens up."
      />
      <form method="post" action="/api/auth/waitlist" className="space-y-4">
        <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@company.com" />
        <SubmitButton>Join the waitlist</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have access?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
