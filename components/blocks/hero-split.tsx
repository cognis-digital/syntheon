'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HeroSplitProps {
  className?: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

export interface HeroSplitPropsInterface extends HeroSplitProps {
  variant?: 'default' | 'minimal';
}

const defaultFeatures = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'AI-Powered Builder',
    description: 'Generate production-ready React components with intelligent scaffolding.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'Optimized rendering with Next.js 15 App Router and edge-ready patterns.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h7a3 3 0 003-3V6a3 3 0 00-3-3h-7m-7 12H5a3 3 0 01-3-3v-4a3 3 0 013-3h1.5" />
      </svg>
    ),
    title: 'Type-Safe by Default',
    description: 'Full TypeScript support with inferred types and zero-runtime overhead.',
  },
];

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  return reduced;
}

export const HeroSplit = ({
  className,
  title,
  subtitle,
  primaryCtaLabel,
  secondaryCtaLabel = 'Learn More',
  primaryHref = '#get-started',
  secondaryHref = '#docs',
  features = defaultFeatures,
}: HeroSplitProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <section className={cn('relative overflow-hidden py-24 lg:py-32', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-primary/5 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <Badge variant="outline" className="inline-flex items-center gap-2 rounded-full border-border/50 bg-background/50 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary/40 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              v1.0.0 — Now in Public Beta
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className={cn('max-w-xl text-lg leading-relaxed', reducedMotion ? 'opacity-80' : '')}>
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <a href={primaryHref}>{primaryCtaLabel}</a>
              </Button>
              
              {secondaryCtaLabel && (
                <Button variant="outline" size="lg" asChild>
                  <a href={secondaryHref}>{secondaryCtaLabel}</a>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by developers at top companies
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className={cn(
              'aspect-square overflow-hidden rounded-2xl border border-border/50 shadow-2xl',
              reducedMotion ? '' : 'shadow-primary/10'
            )}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full bg-gradient-to-br from-background via-muted/50 to-primary/10 p-8"
              >
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 25 }}
                    className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                  >
                    <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Ready to Build?</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Start your free 14-day trial. No credit card required.
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3"
                  >
                    <Button size="sm">Start Free Trial</Button>
                    <Button variant="ghost" size="sm">Watch Demo</Button>
                  </motion.div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      98% satisfaction rate
                    </Badge>
                    <span>•</span>
                    <span>50,000+ active users</span>
                  </div>
                </div>
              </motion.div>

              {reducedMotion ? null : (
                <>
                  <motion.div
                    className="absolute -left-4 top-1/2 h-8 w-8 rounded-full bg-primary/20 blur-xl"
                    animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute -right-4 bottom-8 h-6 w-6 rounded-full bg-primary/20 blur-xl"
                    animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="mt-6 flex items-center justify-between overflow-hidden rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"
                >
                  <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-xs text-muted-foreground">All services operational</p>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 400, damping: 25 }}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'rounded-xl border border-border/50 bg-background/50 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg',
                  reducedMotion ? '' : 'hover:-translate-y-1'
                )}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {!reducedMotion && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 flex items-center justify-between overflow-hidden rounded-full border border-border/50 bg-background/50 px-6 py-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-2 border-primary/50"
                />
                <span className="text-sm text-muted-foreground">Syncing latest changes...</span>
              </div>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 25 }}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-primary/5 pointer-events-none" />
    </section>
  );
};

export default HeroSplit;
