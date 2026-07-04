'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEffect, useState, useRef } from 'react'

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Color of the beam (defaults to violet theme) */
  color?: string
  /** Width of the border in pixels */
  borderWidth?: number | string
  /** Gap between segments for segmented effect */
  gap?: number
  /** Animation speed - lower is faster */
  speed?: number
  /** Whether to use a continuous line or segmented beam */
  segmented?: boolean
  /** Size of the segment if segmented */
  segmentSize?: number
  /** Direction of animation (clockwise/counter-clockwise) */
  direction?: 'clockwise' | 'counter-clockwise'
  /** Glow intensity for ambient effect */
  glowIntensity?: number
}

export interface BorderBeamComponent extends React.FC<BorderBeamProps> {
  __isPremium: true
}

const DEFAULTS = {
  color: '#8b5cf6', // violet-500
  borderWidth: '1px',
  gap: 4,
  speed: 3,
  segmented: false,
  segmentSize: 20,
  direction: 'clockwise',
  glowIntensity: 0.5,
}

const getAnimationVariants = (direction: string, speed: number) => {
  const duration = Math.max(1, speed / 3) * 4 // scale to reasonable range
  return {
    clockwise: {
      rotate: 360,
      transition: {
        duration: duration,
        ease: 'linear',
        repeat: Infinity,
      },
    },
    counterClockwise: {
      rotate: -360,
      transition: {
        duration: duration,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  }[direction]
}

const getSegmentedVariants = (segmentSize: number, gap: number) => ({
  hidden: { opacity: 0, scale: 0.5, rotateY: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
})

export const BorderBeam: BorderBeamComponent = ({
  className,
  children,
  color = DEFAULTS.color,
  borderWidth = DEFAULTS.borderWidth,
  gap = DEFAULTS.gap,
  speed = DEFAULTS.speed,
  segmented = DEFAULTS.segmented,
  segmentSize = DEFAULTS.segmentSize,
  direction = DEFAULTS.direction,
  glowIntensity = DEFAULTS.glowIntensity,
  ...props
}) => {
  const isReducedMotion = useReducedMotion()

  // Generate gradient for continuous beam effect
  const getGradient = () => {
    if (!segmented) {
      return `conic-gradient(from 0deg, 
        transparent 0%, 
        ${color} 15%, 
        transparent 30%, 
        ${color} 45%, 
        transparent 60%, 
        ${color} 75%, 
        transparent 90%)`
    }
    return `conic-gradient(from 0deg, 
      transparent 0%, 
      ${color} 10%, 
      transparent 20%, 
      ${color} 30%, 
      transparent 40%, 
      ${color} 50%, 
      transparent 60%)`
  }

  const [activeSegment, setActiveSegment] = useState(0)
  const totalSegments = Math.ceil((100 - gap * 2) / (segmentSize + gap)) || 1

  // Calculate segment positions for staggered animation
  const getSegmentPositions = () => {
    const positions: [number, number][] = []
    let angle = 0
    while (angle < 360) {
      const radius = 50 + borderWidth * 2
      const x = Math.cos(angle * Math.PI / 180) * radius - gap / 2
      const y = Math.sin(angle * Math.PI / 180) * radius - gap / 2
      positions.push([x, y])
      angle += (segmentSize + gap) / (Math.PI * 2 * radius) * 360
    }
    return positions
  }

  const segmentPositions = getSegmentPositions()

  useEffect(() => {
    if (!isReducedMotion && !segmented) {
      // For continuous beam, animate the gradient rotation
      setActiveSegment((prev) => (prev + 1) % totalSegments)
    }
  }, [activeSegment, isReducedMotion, segmented])

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        {
          'overflow-hidden': !segmented,
        },
        className
      )}
      {...props}
    >
      {/* Glow effect layer */}
      {!isReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(60% 60% at 50% 50%, 
              rgba(${color.slice(1)}, ${glowIntensity}) 0%, 
              transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Main beam container */}
      <div
        className="relative"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '9999px',
          background: segmented ? getGradient() : `conic-gradient(from 0deg, 
            transparent 0%, 
            ${color} 15%, 
            transparent 30%, 
            ${color} 45%, 
            transparent 60%, 
            ${color} 75%, 
            transparent 90%)`,
          backgroundSize: segmented ? `20px 20px, 100% 100%` : '300% 100%',
        }}
      >
        {/* Animated beam layer */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={segmented ? { rotate: 360 } : {}}
          transition={{
            duration: segmented ? speed * 4 : speed,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {/* Beam core */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${activeSegment * (360 / totalSegments)}deg, 
                transparent 0%, 
                ${color} 15%, 
                transparent 30%)`,
              backgroundSize: segmented ? `${segmentSize + gap}px 20px` : '40% 100%',
            }}
          />

          {/* Secondary highlight for depth */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${activeSegment * (360 / totalSegments) + 45}deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.15) 10%, 
                transparent 20%)`,
              backgroundSize: segmented ? `${segmentSize + gap}px 20px` : '40% 100%',
            }}
          />
        </motion.div>

        {/* Content layer */}
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* Segmented beam overlay (if enabled) */}
      {segmented && !isReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, 
              transparent 0%, 
              ${color} 10%, 
              transparent 20%, 
              ${color} 30%, 
              transparent 40%, 
              ${color} 50%, 
              transparent 60%)`,
            backgroundSize: `${segmentSize + gap}px 100%`,
          }}
        />
      )}

      {/* Ambient particles for extra premium feel */}
      {!isReducedMotion && (
        <>
          {[...Array(8)].map((_, i) => {
            const offset = (i / 8) * 360
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: '4px',
                  height: '4px',
                  background: color,
                  opacity: 0.15,
                  filter: 'blur(2px)',
                  left: `calc(50% + ${Math.cos(offset * Math.PI / 180) * 60}px - 2px)`,
                  top: `calc(50% + ${Math.sin(offset * Math.PI / 180) * 60}px - 2px)`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{
                  duration: 3 + (i % 2) * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )
          })}
        </>
      )}

      {/* Reduced motion fallback */}
      {isReducedMotion && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, 
              transparent 0%, 
              ${color} 15%, 
              transparent 30%, 
              ${color} 45%, 
              transparent 60%, 
              ${color} 75%, 
              transparent 90%)`,
            backgroundSize: '300% 100%',
          }}
        />
      )}
    </div>
  )
}
