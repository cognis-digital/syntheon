'use client'

import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface EmptyStateIllustrationProps {
  /** Primary violet color - main accent */
  primaryColor?: string
  
  /** Secondary/tertiary colors for depth */
  secondaryColor?: string
  tertiaryColor?: string
  
  /** Size multiplier (1-3) */
  size?: 'sm' | 'md' | 'lg' | number
  
  /** Opacity of the overall illustration */
  opacity?: number
  
  /** Whether to enable parallax mouse interaction */
  parallax?: boolean
  
  /** Hover magnification intensity */
  hoverMagnify?: boolean
  
  /** Custom SVG paths override (for branding) */
  customPaths?: {
    primaryPath?: string
    secondaryPath?: string
  }
  
  /** Children to render inside the illustration */
  children?: ReactNode
  
  /** Animation duration in ms */
  animationDuration?: number
}

const DEFAULT_COLORS = {
  primary: 'hsl(265, 70%, 55%)',
  secondary: 'hsl(265, 60%, 45%)',
  tertiary: 'hsl(265, 50%, 35%)'
}

const DEFAULT_SIZES = {
  sm: 120,
  md: 200,
  lg: 320
}

function getDimensions(size: number | string): [number, number] {
  if (typeof size === 'string') {
    const s = DEFAULT_SIZES[size as keyof typeof DEFAULT_SIZES] || DEFAULT_SIZES.md
    return [s, s]
  }
  return [size, size]
}

function createFloatingShape(
  x: number, 
  y: number, 
  color: string, 
  delay: number,
  path?: string
): JSX.Element {
  const basePath = path || 'M50 50 L150 20 L250 80 L350 40 L450 100 L550 60 L650 90 L750 50 L850 80 L950 40'
  
  return (
    <motion.circle
      key={x}
      cx={x}
      cy={y}
      r="12"
      fill={color}
      opacity={0.6 + Math.sin(Date.now() / 1000 * 3) * 0.2}
      initial={{ scale: 0, rotate: -45 }}
      animate={{ 
        scale: [0, 1], 
        rotate: [-45, 0, 45, 0] 
      }}
      transition={{
        duration: 3,
        delay: delay * 0.2,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
  )
}

export interface EmptyStateIllustrationProps extends EmptyStateIllustrationProps {}

export default function EmptyStateIllustration({
  primaryColor = DEFAULT_COLORS.primary,
  secondaryColor = DEFAULT_COLORS.secondary,
  tertiaryColor = DEFAULT_COLORS.tertiary,
  size = 'md',
  opacity = 1,
  parallax = true,
  hoverMagnify = false,
  customPaths,
  children,
  animationDuration = 4000,
}: EmptyStateIllustrationProps) {
  const containerSize = getDimensions(size)
  
  // Mouse position for parallax effect
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!parallax || !hoverMagnify) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }
  
  // Parallax transforms
  const xTransform = useTransform(mouseX, [0, 1], [-20, 20])
  const yTransform = useTransform(mouseY, [0, 1], [-20, 20])
  const rotateTransform = useTransform(
    mouseX, 
    [0, 1], 
    [-5, 5]
  )

  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center",
        `w-[${containerSize[0]}px] h-[${containerSize[1]}px]`,
        {
          'cursor-grab active:cursor-grabbing': parallax && hoverMagnify,
          'cursor-default': !parallax || !hoverMagnify
        }
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0.5)
        mouseY.set(0.5)
      }}
      style={{ opacity }}
    >
      <AnimatePresence>
        {/* Background layer - subtle gradient orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`bg-${i}`}
            className="absolute rounded-full blur-3xl"
            initial={{ 
              scale: 0, 
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100 
            }}
            animate={{ 
              scale: [0, 1.5], 
              opacity: [0, 0.3, 0] 
            }}
            transition={{
              duration: animationDuration / 1000,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '40%',
              height: '40%',
              background: `radial-gradient(circle at center, ${[primaryColor, secondaryColor, tertiaryColor][i]} 0%, transparent 70%)`
            }}
          />
        ))}

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ x: xTransform, y: yTransform, rotate: rotateTransform }}
          transition={{ duration: 0.15 }}
        >
          <svg 
            width={containerSize[0]} 
            height={containerSize[1]}
            viewBox="0 0 300 300"
            className="w-full h-full drop-shadow-2xl"
            style={{ filter: `drop-shadow(0 8px 32px ${primaryColor}40)` }}
          >
            {/* Main constellation - larger shapes */}
            <g fill={primaryColor} opacity="0.15">
              {[...Array(6)].map((_, i) => (
                <circle
                  key={`main-${i}`}
                  cx={20 + i * 45}
                  cy={30 + Math.sin(i) * 20}
                  r="35"
                />
              ))}
            </g>

            {/* Core shapes - primary color */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1], 
                opacity: 1,
                rotate: [-360, 0] 
              }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            >
              <motion.circle
                cx="75"
                cy="80"
                r="18"
                fill={primaryColor}
                animate={{ scale: [0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx="145"
                cy="75"
                r="16"
                fill={secondaryColor}
                animate={{ scale: [0.8, 1] }}
                transition={{ duration: 2, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>

            {/* Secondary constellation */}
            <g fill={secondaryColor} opacity="0.1">
              {[...Array(4)].map((_, i) => (
                <circle
                  key={`sec-${i}`}
                  cx={235 - i * 60}
                  cy={95 + Math.cos(i) * 15}
                  r="22"
                />
              ))}
            </g>

            {/* Connecting lines */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: animationDuration / 1000, repeat: Infinity }}
            >
              <line x1="75" y1="80" x2="93" y2="80" stroke={primaryColor} strokeWidth="1.5" opacity="0.6" />
              <line x1="93" y1="80" x2="145" y2="75" stroke={secondaryColor} strokeWidth="1.5" opacity="0.6" />
            </motion.g>

            {/* Decorative particles */}
            {[...Array(12)].map((_, i) => (
              <motion.circle
                key={`particle-${i}`}
                cx={Math.random() * 300}
                cy={Math.random() * 300}
                r="2"
                fill={primaryColor}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1], 
                  y: [0, -5, 0],
                  opacity: [0, 0.8, 0] 
                }}
                transition={{
                  duration: animationDuration / 2000,
                  delay: i * 100,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Central glow effect */}
            <motion.circle
              cx="150"
              cy="150"
              r="60"
              fill={primaryColor}
              opacity="0.08"
              initial={{ scale: 0, rotate: -360 }}
              animate={{ 
                scale: [0, 2], 
                rotate: 0,
                opacity: [0, 0.15] 
              }}
              transition={{ duration: animationDuration / 1000, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Content layer */}
        <AnimatePresence>
          {children && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover magnification overlay */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/5 to-transparent dark:via-black/10"
          animate={{ 
            scale: 1,
            opacity: hoverMagnify ? [0, 0.3, 0] : 0
          }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Accessibility info */}
      <motion.div 
        className="sr-only"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {parallax ? 'Interactive empty state illustration with parallax effects' : 'Static empty state illustration'}
      </motion.div>
    </motion.div>
  )
}

/**
 * Quick variants for common use cases
 */
export const EmptyStateVariants = {
  subtle: {
    opacity: 0.7,
    parallax: false,
    hoverMagnify: false,
    animationDuration: 3000
  },
  vibrant: {
    opacity: 1,
    parallax: true,
    hoverMagnify: true,
    animationDuration: 5000,
    primaryColor: 'hsl(265, 80%, 60%)'
  },
  minimal: {
    opacity: 0.9,
    parallax: false,
    hoverMagnify: true,
    animationDuration: 4000,
    primaryColor: 'hsl(265, 70%, 50%)'
  }
} as const

/**
 * Pre-configured sizes with recommended use cases
 */
export const SizePresets = {
  thumbnail: { size: 'sm', className: 'w-32 h-32' },
  card: { size: 'md', className: 'w-48 h-48' },
  hero: { size: 'lg', className: 'w-full max-w-lg' }
} as const

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion() {
  return typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
