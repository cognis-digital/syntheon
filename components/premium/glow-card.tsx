'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export interface GlowCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'neon' | 'subtle';
  intensity?: number; // 0-1, default 0.5
  hoverScale?: number; // 1-2, default 1.02
  duration?: number; // ms, default 400
}

const variants = {
  default: {
    initial: { scale: 1, rotateX: 0 },
    hover: { 
      scale: 1.05, 
      rotateX: 3, 
      transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } 
    },
  },
  neon: {
    initial: { scale: 1, boxShadow: 'none' },
    hover: { 
      scale: 1.03, 
      boxShadow: '0 0 40px -10px rgba(139, 92, 246, 0.5)',
      transition: { duration: 0.3, ease: 'ease-out' }
    },
  },
  subtle: {
    initial: { scale: 1 },
    hover: { 
      scale: 1.01, 
      transition: { duration: 0.5, ease: 'linear' }
    },
  },
};

const defaultVariants = variants.default;

export function GlowCard({
  children,
  className,
  variant = 'default',
  intensity = 0.5,
  hoverScale = 1.02,
  duration = 400,
}: GlowCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm',
        variant === 'neon' && 'border-violet-400/20 shadow-lg shadow-violet-900/10',
        variant === 'subtle' && 'border-border/60 shadow-md',
        className,
      )}
      variants={variants[variant]}
      initial="initial"
      whileHover={!reducedMotion ? "hover" : "initial"}
      animate={!reducedMotion ? "initial" : "initial"}
      transition={{ duration: duration / 1000 }}
    >
      {/* Animated gradient border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: variant === 'neon' 
            ? `conic-gradient(from 180deg, transparent 0%, rgba(139, 92, 246, ${intensity}) 50%, transparent 100%)`
            : `radial-gradient(circle at center, rgba(139, 92, 246, ${intensity * 0.3}) 0%, transparent 70%)`,
          opacity: reducedMotion ? 0 : intensity,
        }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: 'linear',
          delay: 1 - intensity * 2,
        }}
      />

      {/* Inner glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(60% 50% at 50% 50%, rgba(139, 92, 246, ${intensity * 0.4}) 0%, transparent 70%)`,
          opacity: reducedMotion ? 0 : intensity * 0.5,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Hover overlay for depth */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
          }}
        />
      )}
    </motion.div>
  );
}

export default GlowCard;
