'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEffect, useMemo } from 'react'

export interface AuroraBackdropProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  intensity?: 1 | 2 | 3 | 4 | 5
  speed?: 0.5 | 1 | 1.5 | 2 | 3
  hueShift?: boolean
  overlayOpacity?: number
}

export const AuroraBackdrop = ({
  className,
  size = 'md',
  intensity = 3,
  speed = 1,
  hueShift = true,
  overlayOpacity = 0.5,
}: AuroraBackdropProps) => {
  const reducedMotion = useReducedMotion()

  const sizeClasses = useMemo(() => {
    const map: Record<string, string> = {
      sm: 'h-48 w-full',
      md: 'h-64 w-full',
      lg: 'h-96 w-full',
      xl: 'h-[50vh] w-full',
      full: 'h-screen w-full fixed inset-0 z-[-1]',
    }
    return map[size] || map.md
  }, [size])

  const intensityClasses = useMemo(() => {
    const baseOpacity = (intensity - 1) / 4
    return `opacity-${Math.round(baseOpacity * 100)}`
  }, [intensity])

  const variants = reducedMotion
    ? {}
    : {
        animate: {
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
        },
      }

  return (
    <div className={cn('relative overflow-hidden bg-background', sizeClasses, intensityClasses, className)}>
      {/* Layer 1 - Deep violet base */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: hueShift
            ? 'conic-gradient(from 280deg, hsla(265, 70%, 45%, 0.3), hsla(280, 65%, 40%, 0.2), hsla(295, 60%, 35%, 0.15))'
            : 'radial-gradient(circle at 50% 50%, hsla(270, 60%, 40%, 0.25), transparent)',
        }}
        {...variants}
      />

      {/* Layer 2 - Soft glow orbs */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: hueShift
            ? 'radial-gradient(60% 40% at 15% 30%, hsla(275, 80%, 55%, 0.18), transparent 60%), radial-gradient(50% 30% at 85% 20%, hsla(260, 75%, 50%, 0.15), transparent 50%)'
            : 'radial-gradient(circle at 30% 40%, hsla(270, 70%, 50%, 0.18), transparent 50%), radial-gradient(circle at 70% 60%, hsla(280, 65%, 45%, 0.15), transparent 40%)',
        }}
        {...variants}
      />

      {/* Layer 3 - Subtle noise texture */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity={overlayOpacity} />
        </svg>
      </div>

      {/* Layer 4 - Animated shimmer sweep */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: hueShift
            ? 'linear-gradient(120deg, transparent 30%, hsla(275, 60%, 45%, 0.1) 50%, transparent 70%)'
            : 'linear-gradient(90deg, transparent 30%, rgba(255, 255, 255, 0.08) 50%, transparent 70%)',
        }}
        animate={{ x: ['100%', '-10%'] }}
        {...variants}
      />

      {/* Layer 5 - Deep shadow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  )
}
