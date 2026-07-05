'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Mail, CheckCircle2, Zap } from 'lucide-react';

export interface NewsletterCardProps {
  title: string;
  description?: string;
  ctaText: string;
  placeholder?: string;
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  compact?: boolean;
  autoFocusInput?: boolean;
  hoverEffect?: 'lift' | 'glow' | 'none';
}

export const NewsletterCard = ({
  title,
  description,
  ctaText,
  placeholder = 'Enter your email',
  badgeVariant = 'default',
  icon: Icon,
  compact = false,
  autoFocusInput = false,
  hoverEffect = 'lift',
}: NewsletterCardProps) => {
  const isReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-background/50 backdrop-blur-sm transition-all duration-300',
        hoverEffect === 'lift' && !isReducedMotion ? 'hover:shadow-lg hover:-translate-y-1' : '',
        hoverEffect === 'glow' && !isReducedMotion ? 'hover:shadow-violet-500/20 hover:shadow-xl' : '',
        compact ? 'p-4 sm:p-6' : 'p-6 sm:p-8',
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="relative z-10">
        <CardHeader className={cn('pb-4', compact ? 'space-y-3' : 'space-y-6')}>
          {Icon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-2"
            >
              <div className={cn('inline-flex items-center justify-center rounded-lg p-2', badgeVariant === 'success' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary')}>
                {Icon}
              </div>
            </motion.div>
          )}

          <h3 className={cn('text-xl font-semibold tracking-tight', compact ? 'text-lg' : 'text-2xl')}>
            {title}
          </h3>

          {description && (
            <p className="text-muted-foreground/80 leading-relaxed">
              {description}
            </p>
          )}
        </CardHeader>

        <CardContent className={cn('space-y-4', compact ? 'pb-2' : '')}>
          <motion.form
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            <div className="relative">
              <Input
                type="email"
                placeholder={placeholder}
                autoFocus={autoFocusInput && !compact}
                aria-label="Email address for newsletter subscription"
                autoComplete="email"
                className={cn(
                  'pr-12',
                  compact ? 'h-10 px-3' : 'h-12 px-4',
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Mail className={cn('h-4 w-4', compact ? '' : 'text-muted-foreground')} />
              </div>
            </div>

            {!compact && (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full h-12 px-6 rounded-lg font-medium transition-all duration-200',
                  hoverEffect === 'glow' ? 'bg-primary text-primary-foreground shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:shadow-xl' : 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90',
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  {ctaText}
                  {!isReducedMotion && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
                </span>
              </motion.button>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={cn('flex items-center justify-between text-sm', compact ? 'pt-2' : '')}
          >
            <div className="flex items-center gap-2">
              {badgeVariant === 'success' && (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              )}
              <span className={cn('font-medium', compact ? '' : 'text-muted-foreground')}>
                Join {compact ? '' : 'our'} newsletter today
              </span>
            </div>

            {!isReducedMotion && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="h-2 w-2 rounded-full bg-primary"
              />
            )}
          </motion.div>
        </CardContent>

        <CardFooter className={cn('justify-between', compact ? '' : 'pt-4')}>
          {badgeVariant === 'success' && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Verified</span>
            </Badge>
          )}

          {!compact && (
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-primary transition-colors"
            >
              Unsubscribe at any time
            </motion.a>
          )}
        </CardFooter>

        {/* Decorative gradient background */}
        {!isReducedMotion && (
          <motion.div
            className="absolute -inset-px opacity-0 transition-opacity duration-500 hover:opacity-10"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
          >
            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-xl" />
          </motion.div>
        )}

        {/* Subtle animated background pattern */}
        {!isReducedMotion && (
          <motion.div
            className="absolute -inset-px opacity-0 transition-opacity duration-700 hover:opacity-5"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.05 }}
          >
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-2xl" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default NewsletterCard;
