'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Globe2 } from 'lucide-react';

interface CtaCardProps {
  variant?: 'primary' | 'secondary' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  href?: string;
  highlight?: boolean;
}

export interface CtaCardVariants {
  container: {
    initial: { opacity: 0; y: 40 };
    animate: { opacity: 1; y: 0 };
    exit: { opacity: 0, scale: 0.95 };
  };
  icon: {
    initial: { rotate: -180, scale: 0.5 };
    animate: { rotate: 0, scale: 1 };
  };
}

export const CtaCardVariants = {
  container: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
  },
  icon: {
    initial: { rotate: -180, scale: 0.5 },
    animate: { rotate: 0, scale: 1 },
  },
};

export const CtaCard = ({
  variant = 'primary',
  size = 'md',
  icon,
  title,
  description,
  ctaText,
  href,
  highlight = false,
}: CtaCardProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: containerRef });

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: 'bg-background',
          border: 'border-border/50',
          gradient: '',
        };
      case 'gradient':
        return {
          bg: 'bg-gradient-to-br from-violet-100/30 via-background to-violet-100/20',
          border: 'border-violet-400/30',
          gradient: 'bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-fuchsia-500/20',
        };
      default:
        return {
          bg: 'bg-background',
          border: 'border-border/40',
          gradient: '',
        };
    }
  };

  const getBorderRadius = () => {
    switch (size) {
      case 'sm':
        return 'rounded-xl';
      case 'lg':
        return 'rounded-2xl';
      default:
        return 'rounded-lg';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'text-lg';
      case 'lg':
        return 'text-3xl';
      default:
        return 'text-xl';
    }
  };

  const getBorderWidth = () => {
    if (variant === 'gradient') return 'border border-violet-400/25';
    return '';
  };

  const baseClasses = cn(
    'relative overflow-hidden group',
    getBorderRadius(),
    getPadding(),
    getBorderWidth()
  );

  const contentClasses = cn('space-y-3', highlight ? 'animate-pulse/slow' : '');

  return (
    <motion.div
      ref={containerRef}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={CtaCardVariants.container}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={baseClasses}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute inset-0 bg-gradient-to-br from-violet-200/10 via-transparent to-violet-200/5"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          'relative z-10 flex items-start gap-4',
          size === 'lg' ? 'flex-row' : 'flex-col sm:flex-row'
        )}
      >
        <motion.div
          variants={CtaCardVariants.icon}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="shrink-0 p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-400/20 group-hover:scale-110 transition-transform duration-300"
        >
          {icon || <Sparkles className={cn('w-6 h-6 text-violet-500', getIconSize())} />}
        </motion.div>

        <div className="flex-1">
          <h3 className={cn('font-semibold tracking-tight', size === 'lg' ? 'text-xl' : '')}>
            {title}
          </h3>
          <p className="text-muted-foreground/80 text-sm leading-relaxed">{description}</p>

          <AnimatePresence mode='wait'>
            {href && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4"
              >
                <Button variant="outline" size={size === 'lg' ? 'lg' : 'sm'} asChild>
                  <a href={href} className="gap-2 group-hover:bg-violet-500/10 transition-colors">
                    {ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!href && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-2 text-sm"
            >
              <Badge variant="secondary" className="bg-violet-500/10 border-violet-500/20">
                {ctaText}
              </Badge>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Hover glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 0.3, scale: 1.2 }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -inset-2 bg-gradient-to-br from-violet-500/0 via-violet-500/10 to-violet-500/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Sparkle particles on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: highlight ? 0.6 : 0.3, scale: 1.1 }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -inset-4 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />
    </motion.div>
  );
};

export default CtaCard;
