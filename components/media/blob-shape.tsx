'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { HTMLAttributes, CSSProperties } from 'react';

export interface BlobShapeProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the blob (small | medium | large) */
  size?: 'sm' | 'md' | 'lg';
  
  /** Color theme - uses violet tokens by default */
  color?: 
    | 'violet' 
    | 'indigo' 
    | 'purple' 
    | 'fuchsia' 
    | 'pink' 
    | 'rose' 
    | string;
  
  /** Opacity of the blob (0-1) */
  opacity?: number;
  
  /** Blur amount for softer edges (px) */
  blur?: number;
  
  /** Animation duration in ms */
  animateDuration?: number;
  
  /** Whether to enable parallax effect on hover */
  parallax?: boolean;
  
  /** Custom SVG filter URL for unique shapes */
  customFilterUrl?: string;
}

const sizeConfig: Record<string, { scale: number; blur: number }> = {
  sm: { scale: 0.8, blur: 4 },
  md: { scale: 1, blur: 6 },
  lg: { scale: 1.2, blur: 8 },
};

const colorMap: Record<string, string> = {
  violet: 'hsl(259, 70%, 60%)',
  indigo: 'hsl(245, 70%, 60%)',
  purple: 'hsl(268, 70%, 60%)',
  fuchsia: 'hsl(283, 70%, 60%)',
  pink: 'hsl(314, 70%, 60%)',
  rose: 'hsl(350, 70%, 60%)',
};

function getBlobVariants(size: BlobShapeProps['size']) {
  const config = sizeConfig[size] || sizeConfig.md;
  
  return {
    hover: {
      scale: [1, config.scale + 0.15, 1],
      filter: ['blur(4px)', `blur(${config.blur}px)`, 'blur(4px)'],
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };
}

function getBlobFilter(color: BlobShapeProps['color']) {
  const baseColor = colorMap[color] || colorMap.violet;
  
  return `url(#blob-filter-${Math.random().toString(36).slice(2, 8)})`;
}

export function BlobShape({
  className,
  size = 'md',
  color = 'violet',
  opacity = 0.15,
  blur = 6,
  animateDuration = 400,
  parallax = false,
  customFilterUrl,
  children,
  style,
  ...props
}: BlobShapeProps) {
  const reducedMotion = useReducedMotion();
  const config = sizeConfig[size] || sizeConfig.md;
  
  return (
    <motion.div
      className={cn(
        'relative rounded-full overflow-hidden pointer-events-none select-none',
        className,
      )}
      style={{
        width: '100%',
        height: '100%',
        opacity,
        filter: `blur(${config.blur}px)`,
        ...style,
      }}
      initial={{ scale: 0.85, rotate: -15 }}
      animate={{ 
        scale: [0.9, config.scale], 
        rotate: [-20, 20] 
      }}
      transition={{
        duration: reducedMotion ? 0 : animateDuration / 1000,
        ease: 'easeInOut',
        repeat: Infinity,
        delay: 0.5,
      }}
      whileHover={parallax && !reducedMotion ? {
        scale: [config.scale, config.scale + 0.2, config.scale],
        rotate: [-10, 10, -10],
        transition: { duration: 0.4, ease: 'easeInOut' },
      } : undefined}
      {...props}
    >
      <svg className="absolute inset-0 w-full h-full" style={{ filter: getBlobFilter(color) }}>
        <defs>
          <motion.filter
            id={customFilterUrl || `blob-filter-${Math.random().toString(36).slice(2, 8)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={config.blur} />
            <feColorMatrix type="matrix">
              {[
                0.8, 0.2, 0.1, 0, 0,
                0.1, 0.9, 0.2, 0, 0,
                0.1, 0.1, 0.8, 0, 0,
                0, 0, 0, 1, 0,
              ]}
            </feColorMatrix>
          </motion.filter>
        </defs>
        
        <motion.circle
          cx="50%"
          cy="50%"
          r={reducedMotion ? 40 : 60}
          fill={colorMap[color] || colorMap.violet}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, config.scale + 0.2, 1],
          }}
          transition={{
            duration: reducedMotion ? 0 : animateDuration / 1000 * 4,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 0.3,
          }}
        />
        
        <motion.circle
          cx="52%"
          cy="48%"
          r={reducedMotion ? 25 : 35}
          fill={colorMap[color] || colorMap.violet}
          opacity={0.6}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, config.scale + 0.15, 1],
          }}
          transition={{
            duration: reducedMotion ? 0 : animateDuration / 1000 * 3,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 0.6,
          }}
        />
      </svg>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </motion.div>
  );
}

export default BlobShape;
