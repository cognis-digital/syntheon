import * as React from "react";

/** Shared shell for the plain-text legal pages (privacy, terms). */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-2xl py-16 md:py-20">
      <h1 className="text-balance text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
      <div className="mt-8 flex flex-col gap-5 leading-relaxed [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:text-pretty [&_p]:text-[15px] [&_p]:text-foreground/90">
        {children}
      </div>
    </div>
  );
}
