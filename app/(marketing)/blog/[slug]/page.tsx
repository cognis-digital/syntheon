import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { POSTS, getPost, formatDate } from "../posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found — Syntheon" };
  return {
    title: `${post.title} — Syntheon`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="container max-w-2xl py-16 md:py-20">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All posts
      </Link>

      <header className="mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
          <span aria-hidden>·</span>
          <span>{post.author}</span>
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-pretty text-lg text-muted-foreground">{post.description}</p>
      </header>

      <div className="flex flex-col gap-5 leading-relaxed">
        {post.body.map((block, i) => {
          if (block.type === "h2") {
            return (
              <h2 key={i} className="mt-4 text-2xl font-semibold tracking-tight">
                {block.text}
              </h2>
            );
          }
          if (block.type === "code") {
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg border bg-[hsl(260_30%_8%)] p-4 font-mono text-xs text-violet-100/90"
              >
                <code>{block.text}</code>
              </pre>
            );
          }
          return (
            <p key={i} className="text-pretty text-[15px] text-foreground/90">
              {block.text}
            </p>
          );
        })}
      </div>
    </article>
  );
}
