/**
 * Branded split-screen auth layout for Syntheon.
 *
 * Left: a violet gradient brand panel (hidden on small screens). Right: the
 * auth surface (sign-in / sign-up / waitlist). Uses only semantic Tailwind
 * tokens from DESIGN.md §2, so a theme swap is one file. Renders with or
 * without any auth provider configured.
 */
import Link from "next/link";
import type { ReactNode } from "react";

const HIGHLIGHTS = [
  "Pick features from a menu — generate a full-stack app.",
  "Local AI writes and debugs the code until it's green.",
  "You own every line. No lock-in, no runtime dependency.",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-accent lg:flex lg:flex-col lg:justify-between lg:p-12 text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60rem_60rem_at_120%_-10%,white,transparent)]"
        />
        <Link
          href="/"
          className="relative z-10 text-2xl font-extrabold tracking-tight"
        >
          Syntheon
        </Link>
        <div className="relative z-10 max-w-md">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Build your app. Own every line.
          </h1>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-start gap-3 text-pretty">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/20 text-sm"
                >
                  ✓
                </span>
                <span className="text-sm/6 text-primary-foreground/90">{h}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-primary-foreground/70">
          The open-source, local-AI full-stack web app builder.
        </p>
      </div>

      {/* Auth surface */}
      <div className="flex flex-col items-center justify-center bg-background px-6 py-12">
        <Link
          href="/"
          className="mb-8 text-xl font-extrabold tracking-tight text-primary lg:hidden"
        >
          Syntheon
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
