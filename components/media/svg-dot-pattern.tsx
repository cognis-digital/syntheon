'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SvgDotPatternProps {
  /**
   * Density of the dot pattern. Lower = more dots.
   */
  density?: 'fine' | 'medium' | 'coarse';
  
  /**
   * Size of individual dots in pixels.
   */
  size?: number;
  
  /**
   * Color of the dots. Defaults to violet-500.
   */
  color?: string;
  
  /**
   * Opacity of the dots (0-1).
   */
  opacity?: number;
  
  /**
   * Offset in pixels for staggering animation.
   */
  offset?: number;
  
  /**
   * Whether to enable hover pulse effect.
   */
  pulseOnHover?: boolean;
  
  /**
   * Custom SVG filter URL for depth effects.
   */
  filterUrl?: string;
}

export interface SvgDotPatternVariant {
  fine: {
    density: 12;
    size: 3;
    offset: 8;
  };
  medium: {
    density: 9;
    size: 4;
    offset: 6;
  };
  coarse: {
    density: 6;
    size: 5;
    offset: 4;
  };
}

const DEFAULTS: SvgDotPatternVariant = {
  fine: { density: 12, size: 3, offset: 8 },
  medium: { density: 9, size: 4, offset: 6 },
  coarse: { density: 6, size: 5, offset: 4 },
};

const DEFAULT_COLOR = 'var(--color-violet-500)';
const DEFAULT_OPACITY = 0.3;

export const SvgDotPattern = ({
  density = 'medium',
  size = DEFAULTS.medium.size,
  color = DEFAULT_COLOR,
  opacity = DEFAULT_OPACITY,
  offset = DEFAULTS.medium.offset,
  pulseOnHover = true,
  filterUrl,
}: SvgDotPatternProps) => {
  const isReducedMotion = useReducedMotion();

  const variant = DEFAULTS[density];
  const totalDots = 12; // Keep it performant

  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      className={cn(
        'pointer-events-none absolute inset-0 z-0',
        filterUrl ? `filter: url('${filterUrl}')` : ''
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id={`dot-gradient-${density}`}>
          <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.6} />
          <stop offset="50%" stopColor={color} stopOpacity={opacity * 0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.05} />
        </radialGradient>

        {pulseOnHover && (
          <filter id={`pulse-filter-${density}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {Array.from({ length: totalDots }).map((_, i) => {
        const x = (i % 4) * variant.density;
        const y = Math.floor(i / 4) * variant.density;
        
        return (
          <motion.circle
            key={i}
            cx={x + offset}
            cy={y + offset}
            r={variant.size / 2}
            fill={`url(#dot-gradient-${density})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: isReducedMotion ? 1 : 0.8 + (i % 3) * 0.15 
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.02,
              ease: 'easeOut',
              type: isReducedMotion ? 'spring' : 'tween'
            }}
          />
        );
      })}

      {pulseOnHover && (
        <motion.circle
          cx="50%"
          cy="50%"
          r={variant.size * 3}
          fill={`url(#dot-gradient-${density})`}
          opacity={opacity * 0.1}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [opacity * 0.1, opacity * 0.15, opacity * 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.svg>
  );
};

export default SvgDotPattern;
