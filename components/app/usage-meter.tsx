'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface UsageMeterProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
  thresholds?: Array<{ threshold: number; color: string; message: string }>;
  icon?: React.ReactNode;
}

export interface UsageMeterPropsInterface extends UsageMeterProps {}

const defaultThresholds = [
  { threshold: 0.7, color: 'text-yellow-500', message: 'Approaching limit' },
  { threshold: 0.9, color: 'text-orange-500', message: 'Near capacity' },
  { threshold: 1.0, color: 'text-red-500', message: 'At maximum' },
];

export default function UsageMeter({
  label = 'Usage',
  current = 0,
  max = 100,
  unit = '%',
  thresholds = defaultThresholds,
  icon,
}: UsageMeterProps) {
  const progress = Math.min(Math.max((current / max) * 100, 0), 100);
  const activeThreshold = thresholds.find(t => t.threshold > progress && t.threshold < (thresholds[thresholds.length - 1]?.threshold || 100)) || thresholds[thresholds.length - 1];

  return (
    <Card className="border-border bg-background shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary">{icon}</span>}
          <CardTitle>{label}</CardTitle>
          <Badge variant={activeThreshold?.color === 'text-red-500' ? 'destructive' : activeThreshold?.color || 'secondary'} className="ml-auto">
            {Math.round(progress)}{unit}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-24 w-full flex items-center justify-center">
          {/* Circular Progress Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4"
            style={{
              '--ring-size': '196px',
              '--ring-gap': '8px',
              '--ring-color': 'hsl(var(--border))',
              '--progress-color': `hsl(${275 - (progress / 100) * 40}, 85%, 65%)`,
            } as React.CSSProperties}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-[--ring-size]"
              style={{
                '--ring-gap': '8px',
                '--ring-color': 'hsl(var(--border))',
              } as React.CSSProperties}
              initial={{ rotate: 0 }}
              animate={{ rotate: -90 + (progress / 100) * 270 }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Animated Fill */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                '--ring-size': '196px',
                '--ring-gap': '8px',
                '--progress-color': `hsl(${275 - (progress / 100) * 40}, 85%, 65%)`,
              } as React.CSSProperties}
              initial={{ rotate: 0 }}
              animate={{ rotate: -90 + (progress / 100) * 270 }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Center Content */}
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-muted-foreground text-sm mb-1">
                  {current.toLocaleString()} / {max.toLocaleString()}
                </p>
                <p className={cn('font-medium', activeThreshold?.color)}>
                  {activeThreshold ? activeThreshold.message : 'Normal'}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Background Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl opacity-20"
            style={{ background: `conic-gradient(from 270deg, hsl(${275 - (progress / 100) * 40}, 85%, 65%), transparent)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 30 ? 0.2 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        </div>

        {/* Progress Bar Alternative (for accessibility) */}
        <motion.div
          className="mt-4 h-2 bg-muted rounded-full overflow-hidden"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, hsl(${275 - (progress / 100) * 40}, 85%, 65%), hsl(${275 - (progress / 100) * 40}, 70%, 50%))` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>

        {/* Threshold Indicators */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          {thresholds.map((t, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: progress >= t.threshold ? 1 : 0.5 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <div className={cn('w-2 h-2 rounded-full', t.color.replace('text-', 'bg-'))} />
              <span>{t.threshold * 100}%</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
