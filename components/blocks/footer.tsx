import * as React from "react";

import { cn } from "@/lib/utils";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  description?: React.ReactNode;
  columns?: FooterColumn[];
  /** Social / secondary nodes rendered in the top row. */
  social?: React.ReactNode;
  /** Bottom bar text. Defaults to a Syntheon copyright line. */
  copyright?: React.ReactNode;
}

export function Footer({
  brand = <span className="text-lg font-bold tracking-tight">Syntheon</span>,
  description,
  columns = [],
  social,
  copyright,
  className,
  ...props
}: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className={cn("w-full border-t bg-background", className)} {...props}>
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-3">
            <a href="/" className="flex items-center">
              {brand}
            </a>
            {description && (
              <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
            )}
            {social && <div className="flex items-center gap-3">{social}</div>}
          </div>
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-3">
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          {copyright ?? <span>&copy; {year} Syntheon. You own every line.</span>}
        </div>
      </div>
    </footer>
  );
}
