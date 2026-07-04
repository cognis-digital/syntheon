'use client';

import { useState, type ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronDown, Info } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  highlight?: boolean;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  onOpenChange?: (openId: string | null) => void;
  defaultValue?: string[];
  className?: string;
  children?: ReactNode;
}

const DEFAULT_ITEMS: FaqItem[] = [
  {
    id: 'pricing',
    question: 'How does pricing work for Syntheon?',
    answer: 'We offer tiered plans starting at $49/month. Enterprise solutions are custom-priced based on your requirements.',
    highlight: true,
  },
  {
    id: 'integration',
    question: 'What integrations are supported out of the box?',
    answer: 'Native integration with Stripe, SendGrid, Intercom, and 50+ other tools via our API marketplace.',
  },
  {
    id: 'security',
    question: 'How is data security handled?',
    answer: 'SOC-2 Type II certified infrastructure with end-to-end encryption. Daily backups stored across three geographic regions.',
    highlight: true,
  },
  {
    id: 'migration',
    question: 'Can I migrate from my current platform?',
    answer: 'Yes, our migration tool handles CSV exports and API-based data transfers automatically.',
  },
  {
    id: 'support',
    question: 'What support channels are available?',
    answer: '24/7 email support, Slack workspace access for Enterprise, and dedicated account managers.',
  },
];

export default function FaqAccordion({
  items = DEFAULT_ITEMS,
  onOpenChange,
  defaultValue,
  className,
  children,
}: FaqAccordionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}

      <Accordion type="single" collapsible defaultValue={defaultValue}>
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger
              className={cn(
                'w-full px-4 py-3 text-left transition-colors',
                item.highlight ? 'font-semibold' : '',
                '[&[data-state=open]>svg]:rotate-180'
              )}
            >
              {item.question}
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-2 text-muted-foreground">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className={cn('flex items-center gap-1.5 px-3 py-2 text-sm', 'text-muted-foreground')}>
        <Info size={14} />
        <span>Click questions to expand answers</span>
      </div>
    </div>
  );
}
