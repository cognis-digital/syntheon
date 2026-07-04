'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMemo, useRef, useEffect } from 'react';

export interface CountUpStatsProps {
  value: number;
  targetValue?: number;
  duration?: number;
  prefix?: string | null;
  suffix?: string | null;
  decimals?: number;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_DURATION = 1.5;

export function CountUpStats({
  value,
  targetValue = value,
  duration = DEFAULT_DURATION,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  children,
}: CountUpStatsProps) {
  const [isInView, ref] = useInView(null, { once: true });

  const reducedMotion = useReducedMotion();

  const formattedValue = useMemo(() => {
    if (decimals > 0) {
      return Number.isInteger(value) ? value : parseFloat(value.toFixed(decimals));
    }
    return Number.isInteger(value) ? value : Math.round(value);
  }, [value, decimals]);

  const displayValue = prefix + formattedValue.toString() + suffix;

  if (!isInView || reducedMotion) {
    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        {children}
        {displayValue}
      </span>
    );
  }

  const animationVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex items-center gap-1', className)}
      variants={animationVariants}
      initial="initial"
      animate="animate"
    >
      {children}
      <span className="font-semibold tracking-tight">
        {displayValue}
      </span>
    </motion.span>
  );
}

export default CountUpStats;
