"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

import { GenerationPreview } from "./generation-preview";

/**
 * The above-the-fold hero, upgraded to lead with the playground. One
 * orchestrated entrance (eyebrow → headline → subcopy → CTAs → preview),
 * staggered and gated on prefers-reduced-motion. On-brand violet, tasteful —
 * the preview does the talking.
 */
export function HeroShowcase({ githubUrl }: { githubUrl: string }) {
  const reduce = useReducedMotion();

  const container = reduce
    ? {}
    : {
        initial: "hidden",
        animate: "show",
        variants: {
          hidden: {},
          show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
        },
      };

  const item = reduce
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 16 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        },
      };

  return (
    <motion.div
      {...container}
      className="container flex flex-col items-center gap-6 pb-8 pt-20 text-center md:pt-28"
    >
      <motion.span
        {...item}
        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Open source · local-first · try it in your browser
      </motion.span>

      <motion.h1
        {...item}
        className="max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl"
      >
        Build your app.{" "}
        <span className="text-primary">Own every line.</span>
      </motion.h1>

      <motion.p
        {...item}
        className="max-w-2xl text-pretty text-muted-foreground md:text-lg"
      >
        The open-source, local-AI full-stack builder. Pick your features from a
        menu — auth, waitlist, email, CRM, payments, scheduling, integrations —
        and the local model generates and debugs it until zero errors. No cloud
        dependency, no lock-in.
      </motion.p>

      <motion.div
        {...item}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        <Button asChild size="lg" className="group">
          <Link href="/playground">
            Try it live
            <ArrowRight
              className={cn(
                "transition-transform",
                !reduce && "group-hover:translate-x-0.5",
              )}
            />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={githubUrl} target="_blank" rel="noreferrer">
            <Github /> Star on GitHub
          </a>
        </Button>
      </motion.div>

      <motion.div
        {...(reduce
          ? {}
          : {
              variants: {
                hidden: { opacity: 0, y: 24, scale: 0.98 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              },
            })}
        className="mt-4 w-full"
      >
        <Link
          href="/playground"
          aria-label="Open the interactive playground"
          className="group relative mx-auto block max-w-4xl rounded-2xl outline-none ring-offset-4 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        >
          <GenerationPreview />
          <span className="pointer-events-none absolute inset-x-0 -bottom-3 mx-auto flex w-fit items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-colors group-hover:border-primary/50 group-hover:text-primary">
            Open the interactive playground
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
