'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface GradientMeshBgProps {
  /** Background color - defaults to violet theme */
  background?: string;
  
  /** Intensity of the gradient mesh effect (0-1) */
  intensity?: number;
  
  /** Animation speed multiplier */
  speed?: number;
  
  /** Whether to enable parallax mouse interaction */
  parallax?: boolean;
  
  /** Custom cursor style - 'default' | 'crosshair' | 'pointer' */
  cursor?: 'default' | 'crosshair' | 'pointer';
  
  /** Additional CSS classes for customization */
  className?: string;
  
  /** Children content to render over the mesh */
  children?: ReactNode;
}

export const GradientMeshBg = ({
  background = 'bg-background',
  intensity = 0.6,
  speed = 1,
  parallax = true,
  cursor = 'default',
  className,
  children,
}: GradientMeshBgProps) => {
  const reducedMotion = useReducedMotion();

  // Generate mesh positions for a premium feel
  const meshPositions: [number, number][] = [
    [10, 20],
    [35, 45],
    [60, 25],
    [80, 55],
    [25, 75],
    [55, 90],
  ];

  // Create gradient mesh with tasteful violet tones
  const createMeshGradient = (position: [number, number]) => {
    return `radial-gradient(ellipse at ${position[0]}% ${position[1]}%, 
      hsla(var(--primary), ${intensity * 0.4 + 0.1}) 0%, 
      transparent 50%)`;
  };

  // Animation variants for smooth, premium feel
  const meshAnimation = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
        delay: Math.random() * 0.3,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div
      className={cn(
        'fixed inset-0 overflow-hidden pointer-events-none z-0',
        background,
        cursor === 'crosshair' ? 'cursor-crosshair' : '',
        cursor === 'pointer' ? 'cursor-pointer' : '',
        className
      )}
    >
      {/* Base gradient layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: intensity * 0.3 + 0.1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5"
      />

      {/* Animated mesh layers */}
      <div className="absolute inset-0">
        {meshPositions.map((pos, index) => (
          <motion.div
            key={index}
            initial={{ x: pos[0], y: pos[1] }}
            animate={{ 
              x: [pos[0], pos[0] + 20 * speed, pos[0]],
              y: [pos[1], pos[1] - 15 * speed, pos[1]]
            }}
            transition={{
              duration: 8 / speed,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
            className="absolute w-96 h-96"
          >
            <div 
              className={cn(
                'w-full h-full rounded-full blur-[100px]',
                `bg-gradient-to-br from-primary/30 to-secondary/10`
              )}
            />
          </motion.div>
        ))}
      </div>

      {/* Interactive parallax layer */}
      {parallax && !reducedMotion && (
        <motion.div
          className="absolute inset-0 opacity-40"
          initial={{ x: 0, y: 0 }}
          animate={{ 
            x: typeof window !== 'undefined' ? window.scrollY * 0.1 : 0,
            y: typeof window !== 'undefined' ? -window.scrollX * 0.1 : 0,
          }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <div className="w-full h-full bg-gradient-to-tr from-primary/5 via-transparent to-primary/5" />
        </motion.div>
      )}

      {/* Content layer */}
      {children && (
        <div 
          className={cn(
            'relative z-10 w-full h-full',
            reducedMotion ? '' : 'will-change-transform'
          )}
        >
          {children}
        </div>
      )}

      {/* Subtle noise texture for premium feel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: intensity * 0.15 + 0.05 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Motion preference indicator */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: intensity * 0.2 + 0.1,
          rotate: 0,
          opacity: reducedMotion ? 0 : intensity * 0.3 + 0.1
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute bottom-4 right-4 z-20"
      >
        <div 
          className={cn(
            'rounded-full p-2 bg-background/80 backdrop-blur-sm border border-border',
            reducedMotion ? '' : 'cursor-default hover:scale-110 transition-transform'
          )}
          aria-hidden="true"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className={cn(
              'text-foreground/70',
              reducedMotion ? '' : 'transition-colors hover:text-foreground'
            )}
          >
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default GradientMeshBg;
