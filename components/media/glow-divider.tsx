'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

export interface GlowDividerProps extends VariantProps<GlowDividerVariants> {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  intensity?: 'subtle' | 'medium' | 'strong' | 'max'
  hoverEffect?: boolean
  glowColor?: string
  borderRadius?: number
}

const baseVariants = cva(
  'relative flex items-center justify-center overflow-hidden rounded-full bg-background',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
      intensity: {
        subtle: 'shadow-sm',
        medium: 'shadow-md',
        strong: 'shadow-lg',
        max: 'shadow-xl',
      },
    },
    defaultVariants: {
      size: 'md',
      intensity: 'medium',
    },
  }
)

const glowVariants = cva('absolute inset-0 rounded-full', {
  variants: {
    intensity: {
      subtle: {
        background: 'conic-gradient(from 180deg, hsl(var(--primary), 65%, 45%), transparent)',
        filter: 'blur(20px) opacity(0.3)',
      },
      medium: {
        background: 'conic-gradient(from 180deg, hsl(var(--primary), 70%, 50%), hsl(var(--primary), 60%, 40%), transparent)',
        filter: 'blur(24px) opacity(0.4)',
      },
      strong: {
        background: 'conic-gradient(from 180deg, hsl(var(--primary), 75%, 55%), hsl(var(--primary), 65%, 45%), hsl(var(--primary), 55%, 35%), transparent)',
        filter: 'blur(28px) opacity(0.5)',
      },
      max: {
        background: 'conic-gradient(from 180deg, hsl(var(--primary), 80%, 60%), hsl(var(--primary), 70%, 50%), hsl(var(--primary), 60%, 40%), hsl(var(--primary), 50%, 30%), transparent)',
        filter: 'blur(32px) opacity(0.6)',
      },
    },
  },
})

const glowDividerVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: (hoverEffect: boolean) => ({
    scale: hoverEffect ? 1.1 : 1,
    rotate: 360,
    transition: {
      duration: 2,
      ease: 'easeInOut',
      times: [0, 0.5],
    },
  }),
  tap: (hoverEffect: boolean) => ({
    scale: hoverEffect ? 1 : 1,
    rotate: 360,
    transition: { duration: 0.2, ease: 'easeOut' },
  }),
}

export interface GlowDividerVariants {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  intensity?: 'subtle' | 'medium' | 'strong' | 'max'
}

const defaultGlowColor = `hsl(var(--primary), 70%, 50%)`

export const GlowDivider: React.FC<GlowDividerProps> = ({
  className,
  size = 'md',
  intensity = 'medium',
  hoverEffect = true,
  glowColor = defaultGlowColor,
  borderRadius = 9999,
}) => {
  const isReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn(baseVariants({ size, intensity }), className)}
      variants={{ hover: hoverEffect ? glowDividerVariants.hover(hoverEffect) : {}, tap: hoverEffect ? glowDividerVariants.tap(hoverEffect) : {} }}
      initial="initial"
      whileHover="hover"
      whileTap={hoverEffect ? 'tap' : undefined}
      animate={!isReducedMotion && !hoverEffect ? 'hover' : 'initial'}
      transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        borderRadius: borderRadius,
        boxShadow: intensity === 'subtle'
          ? `0 2px 8px hsl(var(--muted-foreground), 0.15)`
          : intensity === 'medium'
            ? `0 4px 16px hsl(var(--muted-foreground), 0.2)`
            : intensity === 'strong'
              ? `0 8px 32px hsl(var(--muted-foreground), 0.25)`
              : `0 12px 48px hsl(var(--muted-foreground), 0.3)`,
      }}
    >
      <motion.div
        className={cn(glowVariants({ intensity }))}
        style={{
          background: glowColor,
          filter: 'blur(24px)',
          opacity: isReducedMotion ? 0.5 : 0.6,
        }}
        animate={!isReducedMotion && hoverEffect ? { rotate: 360 } : {}}
        transition={{ duration: 8, ease: 'linear', repeat: Infinity, delay: 0 }}
      />

      <motion.div
        className="relative z-10 flex items-center justify-center"
        initial={isReducedMotion ? {} : { scale: 0.95, opacity: 0.7 }}
        animate={!isReducedMotion ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            'w-6 h-6 text-primary',
            intensity === 'subtle' && 'text-muted-foreground',
            intensity === 'medium' && 'text-foreground',
            intensity === 'strong' && 'text-foreground',
            intensity === 'max' && 'text-foreground',
            isReducedMotion ? '' : 'opacity-80'
          )}
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 7V3M12 17v4M7 12H3M17 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {!isReducedMotion && hoverEffect && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25, scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  )
}
