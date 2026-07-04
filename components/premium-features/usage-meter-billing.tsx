'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface UsageMeterBillingProps {
  planName: string;
  currentUsage: number;
  limit: number;
  usageType: 'api' | 'storage' | 'bandwidth' | 'seats';
  unit: string;
  overageRate?: number;
  resetDate?: Date;
  onResetNotification: (amount: number) => void;
}

export interface UsageMeterBillingState {
  isHovered: boolean;
  scrollProgress: number;
  thresholdWarning: number;
}

const VIOLET_ACCENTS = {
  primary: 'hsl(265, 80%, 50%)',
  secondary: 'hsl(265, 70%, 40%)',
  warning: 'hsl(35, 90%, 50%)',
};

const ANIMATION_CONFIG = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
  staggerDelay: 80,
};

export function UsageMeterBilling({
  planName,
  currentUsage,
  limit,
  usageType,
  unit = 'requests',
  overageRate = 2.5,
  resetDate,
  onResetNotification,
}: UsageMeterBillingProps) {
  const state: UsageMeterBillingState = {
    isHovered: false,
    scrollProgress: 0,
    thresholdWarning: 80,
  };

  const { scrollYProgress } = useScroll();
  const scrolled = useTransform(
    scrollYProgress,
    [0, 1],
    [0, ANIMATION_CONFIG.duration]
  );

  const percentage = Math.min((currentUsage / limit) * 100, 100);
  const isOverLimit = currentUsage > limit;
  const remaining = Math.max(limit - currentUsage, 0);

  const getProgressColor = () => {
    if (isOverLimit) return VIOLET_ACCENTS.warning;
    if (percentage >= state.thresholdWarning) return VIOLET_ACCENTS.secondary;
    return VIOLET_ACCENTS.primary;
  };

  const handleResetClick = () => {
    onResetNotification(remaining);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getUsageColor = () => {
    if (isOverLimit) return 'text-warning';
    if (percentage >= state.thresholdWarning) return 'text-secondary-foreground';
    return 'text-primary';
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: ANIMATION_CONFIG.duration,
        ease: 'easeOut',
        staggerChildren: ANIMATION_CONFIG.staggerDelay,
      },
    },
    exit: { opacity: 0, scale: 0.95 },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: ANIMATION_CONFIG.duration / 2, ease: 'easeOut' },
    },
  };

  return (
    <Card className="relative overflow-hidden border-border bg-card shadow-lg">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${VIOLET_ACCENTS.primary}, transparent)`,
        }}
        animate={{ x: ['0%', '-100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={cn('text-xl font-semibold', getUsageColor())}>
              {planName} Plan
            </CardTitle>
            <CardDescription className="mt-1">
              Usage tracking for {usageType.toUpperCase()}
            </CardDescription>
          </div>

          <Badge variant="outline" className="border-border bg-background">
            {formatNumber(currentUsage)} / {formatNumber(limit)} {unit}
          </Badge>
        </div>

        {/* Progress bar with smooth animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.min(percentage, 1) }}
          transition={{ duration: ANIMATION_CONFIG.duration, ease: 'easeInOut' }}
          className="mt-4 h-2 bg-muted rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: getProgressColor(),
            }}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          />
        </motion.div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mt-3">
          {isOverLimit ? (
            <Badge variant="destructive" className="bg-warning text-white">
              Over Limit
            </Badge>
          ) : percentage >= state.thresholdWarning ? (
            <Badge variant="secondary" className="bg-secondary">
              Approaching Limit
            </Badge>
          ) : (
            <Badge variant="outline" className="border-border bg-background">
              On Track
            </Badge>
          )}

          {resetDate && (
            <span className="text-sm text-muted-foreground ml-auto">
              Resets: {resetDate.toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Usage details */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50 border-border">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Usage breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-background border-border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className={cn('font-semibold', getUsageColor())}>
                        {formatNumber(remaining)} {unit}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background border-border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Utilization</span>
                      <span className={cn('font-semibold', getUsageColor())}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Overage info if applicable */}
              {isOverLimit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ANIMATION_CONFIG.staggerDelay * 2 }}
                  className="bg-warning/10 border-warning/30 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                    <span className="text-sm text-warning">
                      Current overage: {formatNumber(currentUsage - limit)} {unit} at ${overageRate}/unit
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Animated counter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: ANIMATION_CONFIG.staggerDelay * 3 }}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-border"
              >
                <span className="text-sm text-muted-foreground">Monthly limit</span>
                <span className={cn('font-bold', getUsageColor())}>
                  {formatNumber(limit)} {unit}
                </span>
              </motion.div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-border bg-background hover:bg-muted/50">
                  Download Report
                </Button>

                <Button variant="secondary" className="bg-secondary text-primary-foreground hover:bg-secondary/90">
                  Upgrade Plan
                </Button>
              </div>

              {/* Reset notification */}
              {resetDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ANIMATION_CONFIG.staggerDelay * 4 }}
                  className="flex items-center justify-between p-3 bg-background border-border rounded-lg"
                >
                  <div>
                    <span className="text-sm">Next reset in:</span>{' '}
                    <span className={cn('font-semibold', getUsageColor())}>
                      {Math.ceil((resetDate.getTime() - Date.now()) / (1000 * 60 * 60))} hours
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleResetClick}
                    className="border-border hover:bg-muted/50"
                  >
                    Notify Me
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>

          {/* Scroll-triggered reveal for additional info */}
          <AnimatePresence>
            {scrolled > 0.3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: ANIMATION_CONFIG.duration / 2 }}
                className="mt-6 pt-4 border-t border-border"
              >
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Pro tip:</span> Set up email notifications to stay ahead of your limit.{' '}
                  <Button size="sm" variant="link" className="p-0 h-auto bg-transparent hover:underline">
                    Configure alerts
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: state.isHovered ? 0.1 : 0 }}
        animate={{ background: `radial-gradient(circle at center, ${VIOLET_ACCENTS.primary}, transparent)` }}
        transition={{ duration: ANIMATION_CONFIG.duration / 2 }}
      />
    </Card>
  );
}

// Default export for convenience
export default UsageMeterBilling;
