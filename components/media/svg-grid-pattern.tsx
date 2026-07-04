'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

export interface SvgGridPatternProps {
  className?: string
  size?: number | string
  gap?: number | string
  opacity?: number
  hueShift?: number
  saturation?: number
  lightness?: number
  scale?: number
  rotation?: number
  children?: ReactNode
}

const DEFAULTS = {
  size: '24',
  gap: '8',
  opacity: 0.15,
  hueShift: 0,
  saturation: 100,
  lightness: 60,
  scale: 1,
  rotation: 0,
}

export function SvgGridPattern({
  className,
  size = DEFAULTS.size,
  gap = DEFAULTS.gap,
  opacity = DEFAULTS.opacity,
  hueShift = DEFAULTS.hueShift,
  saturation = DEFAULTS.saturation,
  lightness = DEFAULTS.lightness,
  scale = DEFAULTS.scale,
  rotation = DEFAULTS.rotation,
  children,
}: SvgGridPatternProps) {
  const reducedMotion = useReducedMotion()

  const patternSize = typeof size === 'number' ? size : Number(size) || DEFAULTS.size
  const gapValue = typeof gap === 'number' ? gap : Number(gap) || DEFAULTS.gap
  const effectiveOpacity = Math.max(0, Math.min(1, opacity))

  const gridColor = `hsl(${275 + hueShift}, ${saturation}%, ${lightness}%)`

  return (
    <motion.div
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        reducedMotion ? '' : 'will-change-transform',
        className,
      )}
      style={{
        opacity: effectiveOpacity,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
      }}
      initial={false}
      animate={reducedMotion ? {} : { x: [0, 20, -20, 0], y: [0, 15, -15, 0] }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        width={patternSize}
        height={patternSize}
        viewBox={`-${gapValue/2} -${gapValue/2} ${patternSize + gapValue} ${patternSize + gapValue}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grid-gradient-${hueShift}-${saturation}-${lightness}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gridColor} />
            <stop offset="50%" stopColor={gridColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={gridColor} />
          </linearGradient>
        </defs>

        {/* Primary grid lines */}
        <motion.line
          x1="-gapValue/2" y1="0" x2={patternSize - gapValue/2} y2="0"
          stroke={gridColor}
          strokeWidth="0.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
        />
        <motion.line
          x1="-gapValue/2" y1="0" x2="-gapValue/2" y2={patternSize - gapValue/2}
          stroke={gridColor}
          strokeWidth="0.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
        />

        {/* Secondary decorative dots */}
        <motion.circle
          cx="-gapValue/2" cy="-gapValue/2" r="1" fill={gridColor}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle background gradient overlay */}
        <motion.rect
          x="-gapValue/2" y="-gapValue/2" width={patternSize + gapValue} height={patternSize + gapValue}
          fill={`url(#grid-gradient-${hueShift}-${saturation}-${lightness})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
        />

        {/* Floating particles for depth */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={i}
            cx={`${Math.random() * patternSize - gapValue/2}`}
            cy={`${Math.random() * patternSize - gapValue/2}`}
            r="0.8"
            fill={gridColor}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, effectiveOpacity * 0.6, 0],
              x: (Math.random() - 0.5) * 30,
              y: (Math.random() - 0.5) * 30,
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Content layer */}
        {children && (
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </svg>
    </motion.div>
  )
}
