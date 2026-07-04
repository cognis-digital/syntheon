'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Eye, Globe, Zap, Cloud, CheckCircle2, Star, Award, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export interface SecurityBadgeProps {
  children: ReactNode;
  className?: string;
}

const badgeVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

export function SecurityBadge({ children, className }: SecurityBadgeProps) {
  return (
    <div
      role="region"
      aria-label="Security badges for Syntheon AI App Builder"
      className={cn(
        'relative w-full px-6 py-10 overflow-hidden',
        'bg-gradient-to-b from-background/50 via-background to-background/80',
        'border border-border/40 rounded-xl md:rounded-2xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(139,92,246,0.15)]',
        className
      )}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-wrap gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-6"
      >
        {children}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

interface BadgeItemProps {
  icon: ReactNode;
  label: string;
  description?: string;
  variant?: 'default' | 'premium' | 'verified';
  delayOffset?: number;
}

function createBadgeVariant(
  variant: BadgeItemProps['variant'] = 'default',
  index: number
): { iconColor: string; border: string; shadow: string; glow: boolean } {
  const baseColors = {
    default: { iconColor: '#8B5CF6', border: 'border-border/30', shadow: '', glow: false },
    premium: { iconColor: '#A78BFA', border: 'border-primary/40', shadow: 'shadow-[0_2px_12px_rgba(167,139,250,0.3)]', glow: true },
    verified: { iconColor: '#22C55E', border: 'border-green-500/40', shadow: 'shadow-[0_2px_12px_rgba(34,197,94,0.25)]', glow: true },
  };

  return baseColors[variant];
}

function BadgeItem({ icon, label, description, variant = 'default', delayOffset = 0 }: BadgeItemProps) {
  const colors = createBadgeVariant(variant, delayOffset);

  return (
    <motion.div
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      custom={delayOffset}
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg md:p-5',
        'bg-background/60 backdrop-blur-sm border',
        colors.border,
        'transition-all duration-300 ease-out',
        'hover:bg-background/80 hover:scale-[1.02] cursor-default',
        'focus-within:ring-2 focus-within:ring-primary/50 outline-none',
        'group'
      )}
      role="listitem"
      aria-label={`${label}${description ? ` — ${description}` : ''}`}
    >
      <div className={cn(
        'w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full',
        'bg-background/40 border border-border/30',
        colors.shadow,
        'transition-all duration-300 group-hover:border-primary/50',
        colors.glow ? 'group-hover:shadow-[0_0_20px_rgba(167,139,250,0.4)]' : ''
      )}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 + delayOffset * 0.05 }}
          className={cn('w-full h-full', colors.iconColor)}
        >
          {icon}
        </motion.div>
      </div>

      <div className="flex flex-col min-w-0">
        <span className={cn(
          'font-semibold text-sm md:text-base tracking-tight',
          'text-foreground dark:text-foreground/95',
          'group-hover:text-primary transition-colors duration-200'
        )}>
          {label}
        </span>

        {description && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + delayOffset * 0.05, duration: 0.3 }}
            className={cn(
              'text-xs md:text-sm',
              'text-muted-foreground dark:text-muted-foreground/70'
            )}
          >
            {description}
          </motion.span>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 + delayOffset * 0.05, duration: 0.3 }}
        className={cn(
          'absolute -right-2 -top-2 w-6 h-6 rounded-full',
          'bg-background border border-border/30 flex items-center justify-center',
          colors.shadow,
          variant === 'verified' ? 'border-green-500/40' : ''
        )}
      >
        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}

const defaultBadges: BadgeItemProps[] = [
  {
    icon: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />,
    label: 'Enterprise Security',
    description: 'SOC 2 Type II certified infrastructure with end-to-end encryption.',
    variant: 'verified',
  },
  {
    icon: <Lock className="w-5.5 h-5.5 md:w-6 md:h-6" />,
    label: 'Zero Trust Architecture',
    description: 'Identity-first access control with adaptive authentication.',
    variant: 'premium',
  },
  {
    icon: <Eye className="w-5.5 h-5.5 md:w-6 md:h-6" />,
    label: 'Real-time Monitoring',
    description: '24/7 threat detection with automated incident response.',
    variant: 'default',
  },
  {
    icon: <Globe className="w-5.5 h-5.5 md:w-6 md:h-6" />,
    label: 'Global Compliance',
    description: 'GDPR, CCPA, HIPAA-ready with automated audit trails.',
    variant: 'default',
  },
  {
    icon: <Zap className="w-5.5 h-5.5 md:w-6 md:h-6" />,
    label: 'Instant Rollbacks',
    description: 'Sub-second deployment rollback with immutable snapshots.',
    variant: 'premium',
  },
  {
    icon: <Cloud className="w-5.5 h-5.5 md:w-6 md:h-6" />,
    label: 'Edge Distribution',
    description: 'Multi-region redundancy with automatic failover.',
    variant: 'default',
  },
];

export const SecurityBadges = Object.assign(SecurityBadge, { defaultBadges });

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(mediaQuery.matches);

      const handler = () => setReduced(mediaQuery.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  return reduced;
}

const motionWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default SecurityBadge;
