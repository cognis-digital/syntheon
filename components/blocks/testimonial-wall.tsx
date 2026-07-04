import * as React from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  avatarUrl?: string;
}

export interface TestimonialWallProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  subheading?: string;
  testimonials: Testimonial[];
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialWall({
  heading,
  subheading,
  testimonials,
  className,
  ...props
}: TestimonialWallProps) {
  return (
    <section className={cn("w-full py-16 md:py-24", className)} {...props}>
      <div className="container">
        {(heading || subheading) && (
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
            {heading && (
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {heading}
              </h2>
            )}
            {subheading && <p className="text-pretty text-muted-foreground">{subheading}</p>}
          </div>
        )}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="break-inside-avoid">
              <CardContent className="flex flex-col gap-4 p-6">
                <blockquote className="text-pretty text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {t.avatarUrl && <AvatarImage src={t.avatarUrl} alt={t.name} />}
                    <AvatarFallback>{initials(t.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
