import * as React from "react";

import { cn } from "@/lib/utils";

export interface LogoCloudProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  /** Each logo is a node (an <img>, inline SVG, or text). */
  logos: React.ReactNode[];
}

export function LogoCloud({ heading, logos, className, ...props }: LogoCloudProps) {
  return (
    <section className={cn("w-full py-12", className)} {...props}>
      <div className="container flex flex-col items-center gap-8">
        {heading && (
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {heading}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70 grayscale transition-opacity [&_img]:h-8 [&_svg]:h-8">
          {logos.map((logo, i) => (
            <div key={i} className="flex items-center justify-center">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
