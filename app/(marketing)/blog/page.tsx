import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { POSTS, formatDate } from "./posts";

export const metadata: Metadata = {
  title: "Blog — Syntheon",
  description:
    "Notes on local-AI code generation, the zero-errors verification harness, and building software you fully own.",
};

export default function BlogIndex() {
  return (
    <div className="container max-w-4xl py-16 md:py-20">
      <header className="mb-10 flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Blog</p>
        <h1 className="text-balance text-4xl font-bold tracking-tight">
          Notes from the build engine
        </h1>
        <p className="max-w-[65ch] text-pretty text-muted-foreground">
          How Syntheon generates large, correct apps with small local models — and the principles
          behind owning every line.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {POSTS.map((post) => (
          <Card key={post.slug} className="group transition-colors hover:border-primary/50">
            <Link href={`/blog/${post.slug}`} className="block focus:outline-none">
              <CardHeader>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read post
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
