'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, ShieldCheck, Sparkles, Star } from 'lucide-react';

export interface CtaBannerProps {
  title: string;
  subtitle?: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'minimal';
  showBadge?: boolean;
  badgeText?: string;
}

const variants = {
  default: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  },
  gradient: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    hover: { 
      scale: 1.03,
      boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
      transition: { duration: 0.3 }
    },
  },
  minimal: {
    initial: { opacity: 0, x: '-100%' },
    animate: { 
      opacity: 1, 
      x: '0%',
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    },
    hover: { scale: 1.01, transition: { duration: 0.15 } },
  },
};

const staggerChildren = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  },
};

export function CtaBanner({
  title = 'Ready to get started?',
  subtitle = 'Join thousands of developers building with Syntheon.',
  primaryCtaLabel = 'Start Free Trial',
  secondaryCtaLabel = 'View Demo',
  secondaryCtaUrl = '#demo',
  icon,
  variant = 'gradient',
  showBadge = false,
  badgeText = 'NEW',
}: CtaBannerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      initial="initial"
      animate="animate"
      variants={variants[variant]}
      transition={{ duration: 0.6 }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-background border border-border/50',
        variant === 'gradient' && 'bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-950 border-transparent shadow-2xl',
        variant === 'minimal' && 'border-none bg-white dark:bg-zinc-900/80 backdrop-blur-xl',
        'p-6 md:p-10'
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {variant === 'gradient' && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 0.3, x: 200 }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[-50%] top-[-50%] w-[150%] h-[150%] bg-gradient-to-br from-violet-400/20 via-transparent to-purple-600/10 blur-3xl rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1.2 }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[-30%] bottom-[-40%] w-[60%] h-[60%] bg-gradient-to-tl from-indigo-500/20 to-violet-400/10 blur-3xl rounded-full"
            />
          </>
        )}

        {/* Floating particles - only for gradient variant */}
        {variant === 'gradient' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute inset-0"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  x: Math.random() * 400 - 200, 
                  y: Math.random() * 400 - 200,
                  scale: 0.3 + Math.random() * 0.5,
                }}
                animate={{ 
                  opacity: [0.1, 0.4, 0.1],
                  x: Math.sin(Date.now() / 1000 + i) * 20,
                  y: Math.cos(Date.now() / 800 + i) * 15,
                }}
                transition={{ 
                  duration: 3 + Math.random() * 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute w-2 h-2 bg-violet-300/60 rounded-full blur-sm"
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Content wrapper */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="relative z-10 max-w-lg mx-auto text-center md:text-left"
      >
        {showBadge && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={cn(
              'inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full mb-4',
              variant === 'gradient' 
                ? 'bg-violet-500/20 text-violet-200 border border-violet-400/30' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
              'backdrop-blur-sm'
            )}
          >
            <Sparkles className="w-3 h-3 mr-2" />
            {badgeText}
          </motion.div>
        )}

        {/* Icon */}
        <div className={cn(
          'mb-4 flex items-center justify-center md:justify-start gap-3',
          variant === 'minimal' ? 'text-zinc-900 dark:text-white' : 'text-violet-200/80'
        )}>
          {icon || <Zap className="w-8 h-8" />}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={cn(
            'text-3xl md:text-4xl font-bold tracking-tight mb-3',
            variant === 'gradient' 
              ? 'text-white drop-shadow-sm' 
              : 'text-zinc-900 dark:text-white',
            'leading-[1.2]'
          )}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={cn(
            'text-lg md:text-xl mb-8',
            variant === 'gradient' 
              ? 'text-violet-100/90' 
              : 'text-zinc-600 dark:text-zinc-400',
            'leading-relaxed max-w-md mx-auto md:mx-0'
          )}
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className={cn(
            'flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-stretch',
            variant === 'minimal' ? '' : 'gap-2'
          )}
        >
          <Button 
            size="lg" 
            className={cn(
              'h-14 px-8 text-base font-semibold rounded-xl transition-all duration-300',
              variant === 'gradient'
                ? 'bg-white text-violet-900 hover:bg-zinc-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-transparent'
                : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5',
              variant === 'minimal' && 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-transparent'
            )}
          >
            <span className="flex items-center gap-2">
              {primaryCtaLabel}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>

          {(secondaryCtaLabel && secondaryCtaUrl) && (
            <motion.a
              href={secondaryCtaUrl}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className={cn(
                'h-14 px-8 text-base font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300',
                variant === 'gradient'
                  ? 'bg-white/10 text-violet-100 hover:bg-white/20 border border-white/20 backdrop-blur-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white',
                variant === 'minimal' && 'bg-transparent text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent'
              )}
            >
              <span className="flex items-center gap-2">
                {secondaryCtaLabel}
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.a>
          )}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className={cn(
            'mt-8 flex items-center justify-center md:justify-start gap-4 text-sm',
            variant === 'gradient' ? 'text-violet-200/70' : 'text-zinc-500 dark:text-zinc-500'
          )}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure & encrypted</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-current" />
            <span>4.9/5 rating</span>
          </div>
        </motion.div>

        {/* Reduced motion preference */}
        {useReducedMotion() && (
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              .cta-banner-animations {
                animation-duration: 0.2s !important;
                transition-duration: 0.1s !important;
              }
            }
          `}</style>
        )}
      </motion.div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
    </motion.div>
  );
}

// Hook for reduced motion preference (moved outside component)
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  return reduced;
}
