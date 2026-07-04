'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export interface NewsletterInlineProps {
  emailPlaceholder?: string;
  buttonText?: string;
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

const defaultCopy = {
  placeholder: 'Enter your work email',
  button: 'Get early access',
  subtext: 'Join 12,000+ builders. Free forever for individuals.',
};

export const NewsletterInline = ({
  emailPlaceholder = defaultCopy.placeholder,
  buttonText = defaultCopy.button,
  subtext = defaultCopy.subtext,
  icon,
  className,
}: NewsletterInlineProps) => {
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-background/50 backdrop-blur-sm',
        focused && 'ring-2 ring-primary/30 shadow-lg shadow-primary/10',
        className
      )}
    >
      <CardContent className="flex items-center gap-4 p-4 sm:p-6">
        {/* Icon container */}
        {icon ? (
          <div className="shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {subtext}
          </p>
        </div>

        {/* Input + Button container */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Input
            type="email"
            placeholder={emailPlaceholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              'h-10 px-4 text-sm bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/50',
              focused && 'shadow-inner'
            )}
          />

          <Button
            size="sm"
            variant="primary"
            className={cn(
              'h-10 px-4 text-sm font-medium transition-all duration-200',
              focused ? 'scale-[0.98]' : ''
            )}
          >
            {buttonText}
          </Button>
        </div>

        {/* Focus indicator - subtle glow */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={false}
          animate={{
            boxShadow: focused ? '0 0 40px rgba(139, 92, 246, 0.15)' : 'none',
          }}
          transition={{ duration: 0.3 }}
        />
      </CardContent>

      {/* Decorative gradient accent */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-3xl" />
    </motion.div>
  );
};
