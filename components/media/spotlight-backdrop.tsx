'use client'

import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from 'react-dom'
import * as React from 'react'

export interface SpotlightBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary color - defaults to violet-500 */
  primaryColor?: string
  /** Secondary/accent color for decorative elements */
  accentColor?: string
  /** Glow intensity (0.1 - 1) */
  glowIntensity?: number
  /** Particle count for floating elements */
  particleCount?: number
  /** Cursor trail length */
  trailLength?: number
  /** Minimum distance between particles */
  minDistance?: number
  /** Enable parallax effect */
  parallaxEnabled?: boolean
  /** Animation duration in ms */
  animationDuration?: number
}

interface FloatingParticleProps {
  x: number
  y: number
  size: number
  delay: number
  color: string
}

export interface SpotlightBackdropState {
  mouseX: number | null
  mouseY: number | null
  particles: FloatingParticleProps[]
  isHovered: boolean
}

const defaultColors = {
  primaryColor: 'hsl(265, 80%, 55%)', // violet-500 equivalent
  accentColor: 'hsl(265, 70%, 45%)',   // slightly darker for depth
}

const defaultConfig = {
  glowIntensity: 0.3,
  particleCount: 12,
  trailLength: 8,
  minDistance: 24,
  parallaxEnabled: true,
  animationDuration: 600,
}

export const SpotlightBackdrop = React.forwardRef<HTMLDivElement, SpotlightBackdropProps>(
  function SpotlightBackdrop(
    {
      className,
      primaryColor = defaultColors.primaryColor,
      accentColor = defaultColors.accentColor,
      glowIntensity = defaultConfig.glowIntensity,
      particleCount = defaultConfig.particleCount,
      trailLength = defaultConfig.trailLength,
      minDistance = defaultConfig.minDistance,
      parallaxEnabled = defaultConfig.parallaxEnabled,
      animationDuration = defaultConfig.animationDuration,
      style,
      children,
      ...props
    },
    ref
  ) {
    const [state, setState] = React.useState<SpotlightBackdropState>({
      mouseX: null,
      mouseY: null,
      particles: [],
      isHovered: false,
    })

    // Reduce motion check
    const reducedMotion = useReducedMotion() || window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Mouse tracking with smooth interpolation
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Parallax transforms
    const xParallax = useTransform(mouseX, (val) => val * 0.15)
    const yParallax = useTransform(mouseY, (val) => val * 0.15)

    // Generate particles on mount/resize
    React.useEffect(() => {
      if (!parallaxEnabled || reducedMotion) return

      const newParticles: FloatingParticleProps[] = []
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          size: Math.random() * 4 + 2,
          delay: Math.random() * animationDuration,
          color: i % 2 === 0 ? primaryColor : accentColor,
        })
      }

      setState((prev) => ({ ...prev, particles: newParticles }))
    }, [particleCount, parallaxEnabled, reducedMotion, primaryColor, accentColor, animationDuration])

    // Mouse move handler with smoothing
    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if (!parallaxEnabled || reducedMotion) return

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY

        // Convert to viewport coordinates relative to component
        setState((prev) => ({
          ...prev,
          mouseX: prev.mouseX ?? 50,
          mouseY: prev.mouseY ?? 50,
        }))
      }

      const handleMouseLeave = () => {
        if (!parallaxEnabled || reducedMotion) return
        setState((prev) => ({ ...prev, mouseX: null, mouseY: null }))
      }

      document.addEventListener('mousemove', handleMouseMove as any)
      document.addEventListener('touchmove', handleMouseMove as any)
      document.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any)
        document.removeEventListener('touchmove', handleMouseMove as any)
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }, [parallaxEnabled, reducedMotion])

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        mouseX.set(0)
        mouseY.set(0)
      }
    }, [])

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 10,
      willChange: 'transform',
      transform: parallaxEnabled ? `translate3d(${xParallax}px, ${yParallax}px, 0)` : undefined,
    }

    const spotlightStyle = {
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at center, 
        rgba(255,255,255,${glowIntensity}) 0%, 
        rgba(255,255,255,${glowIntensity * 0.1}) 40%,
        transparent 70%)`,
      mixBlendMode: 'overlay',
      filter: `blur(${30 + glowIntensity * 20}px)`,
    }

    const particleStyle = {
      position: 'absolute',
      width: `${Math.min(100, Math.max(4, state.particleCount / 2))}px`,
      height: `${Math.min(100, Math.max(4, state.particleCount / 2))}px`,
      borderRadius: '50%',
      background: `radial-gradient(circle at center, 
        ${primaryColor} 0%, 
        transparent 70%)`,
      opacity: 0.6 + (glowIntensity * 0.4),
    }

    const lineStyle = {
      position: 'absolute',
      width: `${20 + glowIntensity * 30}px`,
      height: '1px',
      background: `linear-gradient(90deg, 
        ${primaryColor} 0%, 
        transparent 100%)`,
      opacity: 0.4 + (glowIntensity * 0.2),
    }

    return (
      <motion.div
        ref={ref}
        className={cn('relative', className)}
        style={{ ...baseStyle, ...style }}
        {...props}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Main spotlight glow */}
        <motion.div
          className="absolute inset-0"
          style={spotlightStyle}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1 + (glowIntensity * 0.2), 
            opacity: 0.6 + (glowIntensity * 0.4) 
          }}
          transition={{ duration: animationDuration / 1000, ease: 'easeOut' }}
        />

        {/* Decorative particles */}
        <AnimatePresence>
          {!reducedMotion && state.particles.map((p, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute"
              style={{
                ...particleStyle,
                left: `${50 + p.x}%`,
                top: `${50 + p.y}%`,
                transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() / 2000 + i) * 0.3})`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 0.4 + (glowIntensity * 0.3),
                scale: 1 + Math.sin(Date.now() / 2500 + i) * 0.2,
              }}
              transition={{
                duration: animationDuration / 1000,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Floating lines for texture */}
        <AnimatePresence>
          {!reducedMotion && Array.from({ length: Math.floor(glowIntensity * 5 + 2) }).map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute"
              style={{
                ...lineStyle,
                left: `${30 + (i % 3) * 25}%`,
                top: `${20 + (i % 3) * 25}%`,
                transform: `rotate(${(i * 18) - Date.now() / 100}deg)`,
              }}
              initial={{ opacity: 0, x: 0 }}
              animate={{ 
                opacity: 0.2 + (glowIntensity * 0.2),
                x: Math.sin(Date.now() / 3000 + i) * 10,
              }}
              transition={{
                duration: animationDuration / 500,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Subtle gradient overlay for depth */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 40%, 
              ${primaryColor}15 0%, 
              transparent 60%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 + (glowIntensity * 0.1) }}
          transition={{ duration: animationDuration / 1000, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content children */}
        {children}
      </motion.div>
    )
  }
)
