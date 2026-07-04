import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  subheading?: string;
  items: FaqItem[];
}

export function Faq({ heading, subheading, items, className, ...props }: FaqProps) {
  return (
    <section className={cn("w-full py-16 md:py-24", className)} {...props}>
      <div className="container max-w-3xl">
        {(heading || subheading) && (
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            {heading && (
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {heading}
              </h2>
            )}
            {subheading && <p className="text-pretty text-muted-foreground">{subheading}</p>}
          </div>
        )}
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
