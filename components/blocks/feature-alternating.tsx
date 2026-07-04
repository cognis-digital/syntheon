'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type ReactNode, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

interface FeatureItem {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface FeatureAlternatingProps {
  items: FeatureItem[];
  reversed?: boolean;
  delay?: number;
  hoverEffect?: boolean;
  className?: string;
  containerClassName?: string;
  itemClassName?: string;
}

const defaultItems: FeatureItem[] = [
  {
    title: 'AI-Powered Code Generation',
    description:
      'Transform natural language into production-ready code with our advanced LLM models trained specifically for modern web frameworks.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Smart Component Architecture',
    description:
      'Auto-generate component hierarchies with proper TypeScript types, accessibility attributes, and reusable patterns built-in.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3zM6 9a3 3 0 00-3 3v6a3 3 0 003 3 3 3 0 003-3V12a3 3 0 00-3-3zM18 9a3 3 0 013 3v3a3 3 0 01-3 3h-6a3 3 0 01-3-3V12a3 3 0 013-3h6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Instant Preview & Debug',
    description:
      'Real-time browser-based preview with hot-reload, component tree inspection, and state debugging without any build step.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M15 3L9 3l-3 3v12a3 3 0 003 3h6a3 3 0 003-3V6l-6-3zM9 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.15,
      ease: 'easeOut',
    },
  }),
};

export function FeatureAlternating({
  items = defaultItems,
  reversed = false,
  delay = 200,
  hoverEffect = true,
  className,
  containerClassName,
  itemClassName,
}: FeatureAlternatingProps) {
  const ref = useInView(null, { once: true });

  return (
    <motion.section
      ref={ref}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delayChildren: 0.2, staggerChildren: 0.1 }}
      className={cn(
        'relative overflow-hidden py-24 lg:py-32',
        containerClassName,
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-transparent dark:from-violet-950/10 dark:to-transparent pointer-events-none" />

      <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', containerClassName)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              className={cn(
                'flex flex-col',
                reversed ? 'md:flex-row-reverse' : '',
                itemClassName,
                hoverEffect && 'hover:scale-[1.02] cursor-default'
              )}
            >
              <div className="flex-1">
                <h3 className={cn(
                  'text-xl sm:text-2xl font-semibold tracking-tight mb-4',
                  'bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-300'
                )}>
                  {item.title}
                </h3>
                <p className={cn(
                  'text-base sm:text-lg leading-relaxed',
                  'text-muted-foreground/80 dark:text-muted-foreground/70'
                )}>
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start">
                <motion.div
                  whileHover={hoverEffect ? { scale: 1.1, rotate: [0, -3, 3, -3, 3, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center',
                    'bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-border/50',
                    'dark:from-violet-500/30 dark:to-indigo-500/20 dark:border-violet-500/30'
                  )}
                >
                  <div className="text-violet-600 dark:text-violet-400">
                    {item.icon || (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={cn(
          'mt-16 md:mt-24',
          reversed && 'md:flex-row-reverse'
        )}>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={items.length - 1}
            className="flex items-center gap-3 text-sm text-muted-foreground/60 dark:text-muted-foreground/50"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <span>Powered by Syntheon AI Engine</span>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent dark:from-background/90 pointer-events-none" />
    </motion.section>
  );
}
