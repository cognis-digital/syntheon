'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface EmptyStateCTAProps {
  title: string;
  description?: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'minimal';
}

export default function EmptyStateCTA({
  title,
  description = 'Start building your AI-powered applications today.',
  primaryActionLabel: primaryLabel = 'Get Started',
  secondaryActionLabel: secondaryLabel = 'Learn More',
  primaryHref: primaryHrefValue = '#',
  secondaryHref: secondaryHrefValue = '#',
  icon,
  variant = 'default',
}: EmptyStateCTAProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn(
        'relative overflow-hidden border-border bg-background/95 backdrop-blur-sm',
        variant === 'minimal' ? 'rounded-2xl shadow-none border-0' : 'rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300',
      )}>
        <CardContent className="p-8 md:p-12 flex items-center gap-6">
          {/* Animated icon container */}
          <motion.div
            className={cn(
              'flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center',
              variant === 'minimal' ? 'bg-background/50' : 'bg-primary/10 text-primary',
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {icon || (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M18.5 2L2 22l16-19z"
                  stroke="currentColor"
                  strokeWidth={variant === 'minimal' ? 1.5 : 1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </svg>
            )}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-xl font-semibold tracking-tight mb-2',
              variant === 'minimal' ? 'text-foreground' : 'text-primary',
            )}>
              {title || 'Welcome to Syntheon'}
            </h3>

            <p className={cn(
              'text-sm leading-relaxed max-w-xl',
              variant === 'minimal' ? 'text-muted-foreground' : 'text-muted-foreground/80',
            )}>
              {description}
            </p>
          </div>

          {/* Actions */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Button asChild variant="outline">
              <a href={secondaryHrefValue} className="gap-2">
                {secondaryLabel ? (
                  <>
                    <span>{secondaryLabel}</span>
                  </>
                ) : null}
              </a>
            </Button>

            <Button asChild variant="default" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href={primaryHrefValue}>
                {primaryLabel ? (
                  <>
                    <span>{primaryLabel}</span>
                  </>
                ) : null}
              </a>
            </Button>
          </motion.div>

          {/* Decorative gradient element */}
          <motion.div
            className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-20"
            style={{ background: 'var(--primary)' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </CardContent>

        {/* Subtle border glow on hover */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl pointer-events-none',
            variant === 'minimal' ? '' : 'border-border/50',
          )}
          style={{ background: 'linear-gradient(to right, transparent 49%, var(--primary) 50%, transparent 51%)' }}
          animate={{ opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </Card>
    </motion.div>
  );
}
