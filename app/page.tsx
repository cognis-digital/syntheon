import Link from "next/link";

/**
 * Placeholder home route. The Studio foundation agent replaces this with the
 * full marketing landing page (hero, features, pricing, testimonials, CTA).
 * Kept dependency-light so the base scaffold builds on its own.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="rounded-full border border-border bg-secondary px-4 py-1 text-sm text-muted-foreground">
        Cognis Studio · v0.1
      </span>
      <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
        Build your app. <span className="text-primary">Own every line.</span>
      </h1>
      <p className="text-pretty text-lg text-muted-foreground">
        The open-source, local-AI full-stack builder. Pick your features from a menu — auth,
        waitlist, email, CRM, payments, scheduling, integrations — and the local model generates
        and debugs it until zero errors. No cloud dependency, no lock-in.
      </p>
      <div className="flex gap-3">
        <Link
          href="https://github.com/cognis-digital/cognis-studio"
          className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          href="/docs"
          className="rounded-md border border-border px-5 py-2.5 font-medium transition hover:bg-secondary"
        >
          Read the docs
        </Link>
      </div>
    </main>
  );
}
