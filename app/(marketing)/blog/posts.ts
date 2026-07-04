/** Minimal in-repo blog data. No CMS, no MDX — plain typed records so the blog
 * renders independently and stays testable. */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: string;
  author: string;
  /** Rendered as sequential paragraphs / headings on the post page. */
  body: { type: "p" | "h2" | "code"; text: string }[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "zero-errors-or-it-doesnt-ship",
    title: "Zero errors, or it doesn't ship",
    description:
      "Why Syntheon runs typecheck, lint, tests, and a production build on every single generated unit — and how the repair loop keeps the build green.",
    date: "2026-01-15",
    readingTime: "5 min read",
    author: "The Syntheon team",
    body: [
      {
        type: "p",
        text: "Most AI code tools generate a wall of plausible-looking code and hand it to you to debug. Syntheon takes the opposite stance: nothing is accepted until it passes four gates. This post explains why, and how the mechanism actually works.",
      },
      { type: "h2", text: "The problem with one heroic prompt" },
      {
        type: "p",
        text: "A 9-billion-parameter model cannot one-shot a hundred-thousand-line application. Ask it to, and you get output that compiles in spirit but not in fact — subtly wrong imports, drifting types, tests that were never run. The failure mode isn't laziness; it's that the task is simply too large for the model's competence window.",
      },
      { type: "h2", text: "Decomposition plus verification" },
      {
        type: "p",
        text: "Syntheon breaks the app into thousands of small units — one component, one route, one API handler, one integration adapter, one test file. Each is generated against an explicit TypeScript contract and a natural-language spec from the registry, so the output shape is constrained before a token is written.",
      },
      {
        type: "p",
        text: "Then the harness runs, in order: tsc --noEmit, eslint, vitest run, and next build. If any gate fails, the coder receives the failing code plus structured diagnostics — file, line, message — and regenerates. This repeats up to six times.",
      },
      { type: "code", text: "typecheck → lint → test → build   # green, or the unit is rejected" },
      { type: "h2", text: "The build never stays red" },
      {
        type: "p",
        text: "If a unit exhausts its repair budget, it falls back to its curated, already-tested template and is flagged for review. You always end with a project that builds. That's the honest version of \"free-generate hundreds of thousands of lines\": decomposition, verification, and iteration — not a single lucky prompt.",
      },
      {
        type: "p",
        text: "CI runs the same four gates on every push. The zero-errors guarantee is enforced, not aspirational.",
      },
    ],
  },
  {
    slug: "own-every-line",
    title: "You own every line",
    description:
      "Components are copied into your project, shadcn-style — not hidden behind a dependency. Here's why that matters for a generated app.",
    date: "2026-01-08",
    readingTime: "3 min read",
    author: "The Syntheon team",
    body: [
      {
        type: "p",
        text: "A Syntheon-generated app has zero runtime dependency on Syntheon. The components live in your repo, in your source tree, editable like any other file you wrote. This is the shadcn/ui philosophy applied to a whole application.",
      },
      { type: "h2", text: "Local-first by default" },
      {
        type: "p",
        text: "The generation engine runs on your machine against a local Ollama fleet. No code leaves the box. Cloud models are optional accelerators for the rare unit that fails local repair — off by default.",
      },
      { type: "h2", text: "No lock-in" },
      {
        type: "p",
        text: "Because you own the code and the theme is a single token contract, you can re-brand, re-theme, or walk away entirely without untangling a proprietary framework. That's the whole point.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
