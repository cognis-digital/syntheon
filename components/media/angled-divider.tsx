'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import { useMemo } from 'react'

export interface AngledDividerProps extends VariantProps<{
  variant: 'solid' | 'dashed' | 'gradient' | 'glow'
}> {
  /** Size of the angle (degrees) */
  angle?: number
  /** Width of the divider bar */
  width?: string | number
  /** Height of the divider bar */
  height?: string | number
  /** Gap between segments for dashed style */
  gap?: string | number
  /** Background color override */
  background?: string
  /** Border radius */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /** Whether to animate the angle transition */
  animateAngle?: boolean
  /** Custom SVG path for more complex shapes */
  customPath?: string
  /** Gradient stops (for gradient variant) */
  gradientStops?: [string, string][]
}

const dividerVariants = cva(
  'relative inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        solid: '',
        dashed: 'border-b-2 border-dashed',
        gradient: 'bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-400 bg-[length:300%_auto]',
        glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
      },
    },
    defaultVariants: { variant: 'solid' },
  }
)

const angleVariants = {
  initial: { rotate: 0 },
  animate: (angle: number) => ({ rotate: angle }),
}

export interface AngledDividerComponentProps extends AngledDividerProps {}

/**
 * Creates a premium angled divider with smooth motion and violet aesthetics.
 */
export function AngledDivider(
  props: AngledDividerComponentProps & { className?: string }
) {
  const {
    variant = 'solid',
    angle = 45,
    width = '100%',
    height = '2px',
    gap = '8px',
    background = undefined,
    borderRadius = 'none',
    animateAngle = true,
    customPath,
    gradientStops,
    className,
  } = props

  const isReducedMotion = useReducedMotion()

  // Calculate rotation with smooth easing
  const targetRotation = useMemo(() => {
    if (customPath) return angle * (Math.PI / 180)
    return angle * (Math.PI / 180)
  }, [angle, customPath])

  const baseClasses = cn(
    dividerVariants({ variant }),
    borderRadius === 'none' ? '' : `rounded-${borderRadius}`,
    background && !customPath ? `bg-[${background}]` : '',
    gradientStops?.length > 0 && !customPath
      ? `bg-gradient-to-r ${gradientStops.map((stop, i) => `${i === 0 ? 'from-' : ''}${stop}`).join(' ')}`
      : '',
    className
  )

  // Build SVG path based on variant and custom path
  const buildPath = useMemo(() => {
    if (customPath) return customPath

    // Default angled line with decorative elements
    const halfAngle = angle / 2
    const cos = Math.cos(halfAngle * Math.PI / 180)
    const sin = Math.sin(halfAngle * Math.PI / 180)

    // Create a nice decorative pattern
    return `M -${width} 0 L ${width} 0` +
      (variant === 'dashed' ? '' : '') +
      (variant === 'gradient' || variant === 'glow' ? '' : '')
  }, [width, angle, customPath, variant])

  return (
    <motion.div
      className={baseClasses}
      style={{ width, height }}
      initial={isReducedMotion ? {} : { rotate: 0 }}
      animate={isReducedMotion ? { rotate: targetRotation } : { rotate: targetRotation }}
      transition={{
        duration: isReducedMotion ? 0.3 : 1.2,
        ease: 'easeInOut',
        delay: 0.15,
      }}
    >
      {/* Main divider bar */}
      <div className="absolute inset-0 flex items-center justify-center">
        {customPath ? (
          <svg width={width} height={height} viewBox={`-${width/2} -${height/2} ${width*2} ${height*2}`}>
            <path d={buildPath} fill="none" stroke="currentColor" strokeWidth={height === '2px' ? 1 : parseFloat(height)} className="text-foreground" />
          </svg>
        ) : (
          // Default decorative SVG pattern
          <svg width={width} height={height} viewBox={`-${width/2} -${height/2} ${width*2} ${height*2}`}>
            {/* Main line */}
            {variant !== 'dashed' && (
              <>
                <motion.path
                  d="M -10 0 L 10 0"
                  stroke="currentColor"
                  strokeWidth={parseFloat(height) || 1}
                  className="text-foreground/80"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </>
            )}

            {/* Decorative angled accents */}
            <motion.path
              d="M -25 0 L -15 0"
              stroke="currentColor"
              strokeWidth={parseFloat(height) || 1}
              className="text-primary/40"
              initial={{ rotate: -angle, opacity: 0 }}
              animate={{ rotate: -angle, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            />
            <motion.path
              d="M 25 0 L 35 0"
              stroke="currentColor"
              strokeWidth={parseFloat(height) || 1}
              className="text-primary/40"
              initial={{ rotate: angle, opacity: 0 }}
              animate={{ rotate: angle, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            />

            {/* Optional glow effect for gradient/glow variants */}
            {variant === 'glow' && (
              <motion.circle
                cx="0"
                cy="0"
                r={parseFloat(height) || 1 + 8}
                fill="currentColor"
                className="text-primary/20 blur-xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            )}

            {/* Dashed pattern */}
            {variant === 'dashed' && (
              <>
                <motion.path
                  d="M -30 0 L -20 0 M 20 0 L 30 0"
                  stroke="currentColor"
                  strokeWidth={parseFloat(height) || 1}
                  className="text-foreground/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                />
              </>
            )}

            {/* Gradient overlay for gradient variant */}
            {variant === 'gradient' && (
              <motion.linearGradient
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {gradientStops?.map((stop, i) => (
                  <motion.stop
                    key={i}
                    offset={i / (gradientStops.length - 1)}
                    stopColor={stop[0]}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                  />
                ))}
              </motion.linearGradient>
            )}
          </svg>
        )}

        {/* Subtle background fill */}
        <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px]" />
      </div>
    </motion.div>
  )
}
