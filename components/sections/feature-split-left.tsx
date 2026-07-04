'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureSplitLeftProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  href?: string;
  imageSrc: string;
  imageAlt: string;
  accentColor?: 'violet' | 'indigo' | 'purple';
  showBadge?: boolean;
  badgeLabel?: string;
}

export interface FeatureSplitLeftPropsInterface extends FeatureSplitLeftProps {
  className?: string;
}

const variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.2,
      ease: 'easeOut',
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export default function FeatureSplitLeft({
  title,
  subtitle,
  description,
  ctaText,
  href = '#',
  imageSrc,
  imageAlt,
  accentColor = 'violet',
  showBadge = false,
  badgeLabel,
  className,
}: FeatureSplitLeftPropsInterface) {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const accentRing = {
    violet: 'ring-violet-500/20',
    indigo: 'ring-indigo-500/20',
    purple: 'ring-purple-500/20',
  }[accentColor];

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-background to-muted/50',
        accentRing,
        className
      )}
      aria-labelledby="feature-split-title"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {showBadge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Badge variant="secondary" className="gap-2 px-3 py-1 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  {badgeLabel || 'New'}
                </Badge>
              </motion.div>
            )}

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              id="feature-split-title"
              className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              {title}
            </motion.h2>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg text-muted-foreground"
              >
                {subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="prose prose-lg max-w-none text-foreground/80"
            >
              <p>{description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg">
                <a href={href}>{ctaText}</a>
              </Button>

              {href && (
                <Button variant="outline" asChild>
                  <a href={href} className="text-muted-foreground hover:text-foreground">
                    Learn more
                  </a>
                </Button>
              )}
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <motion.div
                className={cn(
                  'absolute inset-0 rounded-3xl overflow-hidden shadow-2xl',
                  accentRing,
                  'transition-all duration-500'
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  sizes="(max-width: 1024px) 50vw, 38rem"
                />
              </motion.div>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/5 pointer-events-none" />

              {/* Floating badge elements */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-24 h-24 bg-gradient-to-br from-violet-500/20 to-purple-500/10 rounded-full blur-xl"
                  initial={{ scale: 0, x: Math.random() * 60 - 30 }}
                  animate={isInView ? { scale: 1, opacity: 0.7 } : {}}
                  transition={{ delay: i * 0.2 + 0.5, duration: 0.8, ease: 'easeOut' }}
                  style={{
                    top: `${30 + i * 15}%`,
                    left: `${20 + (i % 2) * 40}%`,
                  }}
                />
              ))}
            </div>

            {/* Parallax container */}
            <motion.div
              className="absolute -inset-8 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent rounded-[2.5rem] blur-3xl"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.6 } : {}}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </motion.div>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
      </div>
    </section>
  );
}

// Hook to detect reduced motion preference
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// Wrapper to disable motion when user prefers it
function ReducedMotionWrapper({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  
  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
