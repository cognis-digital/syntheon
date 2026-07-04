'use client';

import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

export interface ShimmerSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the skeleton */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** Animation duration in milliseconds */
  animationDuration?: number;
  
  /** Intensity of the shimmer effect (0-1) */
  intensity?: number;
  
  /** Direction of the shimmer sweep */
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom';
  
  /** Whether to show a subtle glow halo around edges */
  withGlow?: boolean;
  
  /** Custom gradient colors (default: violet-themed) */
  gradientColors?: [string, string];
}

export interface ShimmerSkeletonSizes {
  sm: {
    padding: '1.5rem';
    borderRadius: '0.75rem';
    minHeight: '2.25rem';
  };
  md: {
    padding: '2rem';
    borderRadius: '1rem';
    minHeight: '3rem';
  };
  lg: {
    padding: '2.5rem';
    borderRadius: '1.25rem';
    minHeight: '4rem';
  };
  xl: {
    padding: '3rem';
    borderRadius: '1.5rem';
    minHeight: '5rem';
  };
  full: {
    padding: '0.75rem';
    borderRadius: '0.875rem';
    minHeight: 'auto';
  };
}

const SIZES: Record<string, ShimmerSkeletonSizes> = {
  sm: { padding: '1.5rem', borderRadius: '0.75rem', minHeight: '2.25rem' },
  md: { padding: '2rem', borderRadius: '1rem', minHeight: '3rem' },
  lg: { padding: '2.5rem', borderRadius: '1.25rem', minHeight: '4rem' },
  xl: { padding: '3rem', borderRadius: '1.5rem', minHeight: '5rem' },
  full: { padding: '0.75rem', borderRadius: '0.875rem', minHeight: 'auto' },
};

const DEFAULTS = {
  size: 'md',
  animationDuration: 2400,
  intensity: 0.6,
  direction: 'left-to-right',
  withGlow: true,
  gradientColors: ['#8b5cf6', '#a78bfa'], // violet-500 to violet-400
};

const getDirectionTransform = (direction: ShimmerSkeletonProps['direction']) => {
  switch (direction) {
    case 'right-to-left': return '-100%';
    case 'top-to-bottom': return '-100%';
    default: return '0%'; // left-to-right
  }
};

const getDirectionAnimation = (direction: ShimmerSkeletonProps['direction']) => {
  switch (direction) {
    case 'right-to-left': return 'translateX(-100%) translateX(100%)';
    case 'top-to-bottom': return 'translateY(-100%) translateY(100%)';
    default: return 'translateX(0%) translateX(100%)'; // left-to-right
  }
};

const getDirectionKey = (direction: ShimmerSkeletonProps['direction']) => {
  switch (direction) {
    case 'right-to-left': return 'x-reverse';
    case 'top-to-bottom': return 'y-down';
    default: return 'x-normal'; // left-to-right
  }
};

const createGradientAnimation = (
  direction: ShimmerSkeletonProps['direction'],
  duration: number,
  intensity: number
) => {
  const key = getDirectionKey(direction);
  const transform = getDirectionTransform(direction);
  
  return {
    xNormal: `translateX(0%) translateX(${transform})`,
    xReverse: `translateX(-100%) translateX(100%)`,
    yDown: `translateY(-100%) translateY(100%)`,
    duration,
    intensity,
  };
};

const createGradient = (colors: [string, string]) => {
  const [start, end] = colors;
  return `linear-gradient(${getDirectionAnimation('left-to-right')}, ${start} 0%, ${end} 10%)`;
};

export function ShimmerSkeleton({
  className,
  children,
  size: sizeProp = DEFAULTS.size,
  animationDuration = DEFAULTS.animationDuration,
  intensity = DEFAULTS.intensity,
  direction = DEFAULTS.direction,
  withGlow = DEFAULTS.withGlow,
  gradientColors = DEFAULTS.gradientColors,
  ...props
}: ShimmerSkeletonProps) {
  const reducedMotion = useReducedMotion();
  const sizeConfig = SIZES[sizeProp] || SIZES.md;
  
  const animationConfig = createGradientAnimation(direction, animationDuration, intensity);
  const gradientStyle = createGradient(gradientColors);
  
  const baseStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: sizeConfig.borderRadius,
    minHeight: sizeConfig.minHeight,
    background: gradientStyle,
    willChange: 'transform',
    transform: reducedMotion ? undefined : animationConfig.xNormal,
    transition: reducedMotion ? undefined : `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  const glowStyles = withGlow && !reducedMotion ? {
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15), 0 4px 16px rgba(139, 92, 246, 0.1)',
  } : {};

  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-lg', sizeProp === 'full' ? '' : 'p-4', className)}
      style={{ ...baseStyles, ...glowStyles }}
      animate={{
        transform: reducedMotion ? undefined : animationConfig.xNormal,
      }}
      transition={{
        duration: animationDuration / 1000,
        ease: [0.4, 0, 0.2, 1],
        repeat: Infinity,
        delay: 0,
      }}
      {...props}
    >
      {children ? (
        <div className="h-full w-full">
          {children}
        </div>
      ) : (
        <div 
          className={cn(
            'absolute inset-0',
            sizeProp === 'full' ? '' : 'p-4 rounded-lg',
            reducedMotion ? '' : 'animate-shimmer-sweep'
          )}
          style={{
            background: gradientStyle,
            opacity: intensity,
          }}
        />
      )}
    </motion.div>
  );
}

// CSS for smooth shimmer sweep animation
const ShimmerSkeletonCSS = () => (
  <style>{`
    @keyframes shimmer-sweep {
      0% { transform: translateX(0%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(0%); }
    }
    
    .animate-shimmer-sweep {
      animation: shimmer-sweep ${DEFAULTS.animationDuration}ms linear infinite;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .animate-shimmer-sweep {
        animation: none;
      }
      
      motion.div[style*="transform"] {
        transform: translateX(0%);
      }
    }
  `}</style>
);

// Auto-inject styles on mount (optional, for SSR hydration)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.id = 'shimmer-skeleton-styles';
  style.textContent = ShimmerSkeletonCSS().props.children;
  document.head.appendChild(style);
}

export default ShimmerSkeleton;
