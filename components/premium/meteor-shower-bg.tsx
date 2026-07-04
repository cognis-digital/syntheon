'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface MeteorShowerBgProps {
  /** Intensity of meteor density (0.1 - 2) */
  intensity?: number
  
  /** Speed multiplier for animation */
  speedMultiplier?: number
  
  /** Size range for meteors in pixels */
  sizeRange?: [number, number]
  
  /** Color variant using violet palette */
  colorVariant?: 'default' | 'soft' | 'neon'
  
  /** Duration of each meteor trail (ms) */
  trailDuration?: number
  
  /** Whether to add subtle parallax depth effect */
  parallax?: boolean
  
  /** Custom children overlay content */
  children?: ReactNode
  
  /** Background blur intensity for glow effect */
  blurIntensity?: number
}

export default function MeteorShowerBg({
  intensity = 1,
  speedMultiplier = 0.8,
  sizeRange = [6, 12],
  colorVariant = 'default',
  trailDuration = 1500,
  parallax = false,
  blurIntensity = 40,
  children,
}: MeteorShowerBgProps) {
  const reducedMotion = useReducedMotion()

  // Generate meteor positions and velocities
  const generateMeteors = () => {
    const count = Math.floor(15 * intensity)
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage for initial position
      y: -Math.random() * 20 - 10, // start above viewport
      vx: (Math.random() - 0.5) * 2 + 0.5, // velocity X
      vy: Math.random() * 3 + 2, // velocity Y (always downward-ish)
      size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
      delay: Math.random() * trailDuration,
    }))
  }

  const meteors = generateMeteors()

  // Color configuration based on variant
  const getColors = () => {
    switch (colorVariant) {
      case 'soft':
        return {
          primary: '#8b7cf5',
          secondary: '#a78bfa',
          glow: 'rgba(139, 124, 245, 0.15)',
        }
      case 'neon':
        return {
          primary: '#d946ef',
          secondary: '#e879f9',
          glow: 'rgba(217, 70, 239, 0.25)',
        }
      default:
        return {
          primary: '#a78bfa',
          secondary: '#c4b5fd',
          glow: 'rgba(167, 139, 250, 0.1)',
        }
    }
  }

  const colors = getColors()

  // Animation variants for meteors with staggered entrance
  const meteorVariants = {
    initial: (i: number) => ({
      x: meteors[i].x * 120,
      y: meteors[i].y * 80 - 50,
      opacity: 0,
      scale: 0.3,
      rotate: Math.random() * 720 - 360,
    }),
    animate: (i: number) => ({
      x: meteors[i].x * 120 + meteors[i].vx * trailDuration * speedMultiplier,
      y: meteors[i].y * 80 + meteors[i].vy * trailDuration * speedMultiplier - 50,
      opacity: 0.6,
      scale: 1,
      rotate: meteors[i].rotate + (meteors[i].vx * trailDuration) / 2,
    }),
    exit: {
      x: meteors[i].x * 120 + meteors[i].vx * trailDuration * speedMultiplier,
      y: meteors[i].y * 80 + meteors[i].vy * trailDuration * speedMultiplier - 50,
      opacity: 0,
      scale: 0.3,
    },
  }

  // Parallax effect for depth
  const parallaxVariants = {
    initial: (i: number) => ({
      z: Math.random() * 2 - 1,
      y: meteors[i].y * 40 - 30,
    }),
    animate: (i: number) => ({
      z: Math.random() * 2 - 1 + (meteors[i].vx * trailDuration) / 500,
      y: meteors[i].y * 40 + meteors[i].vy * trailDuration * speedMultiplier / 3 - 30,
    }),
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background gradient layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Glow overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-violet-500/5 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
      />

      {/* Meteors container */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
      >
        {reducedMotion ? (
          // Static fallback for reduced motion users
          <div className="relative w-full h-full">
            {meteors.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{
                  x: m.x * 120,
                  y: m.y * 80 - 50,
                  opacity: 0.4,
                  scale: 0.5,
                }}
                animate={{
                  x: m.x * 120 + (m.vx * trailDuration) / 3,
                  y: m.y * 80 + (m.vy * trailDuration) / 3 - 50,
                  opacity: 0.4,
                  scale: 1,
                }}
                transition={{
                  duration: trailDuration / 2,
                  ease: 'easeOut',
                  delay: m.delay,
                }}
                className="absolute rounded-full"
                style={{
                  width: m.size * 0.6,
                  height: m.size * 0.6,
                  background: `radial-gradient(circle at 30% 30%, ${colors.primary}, transparent)`,
                  filter: 'blur(4px)',
                  opacity: 0.5 + (m.vx / 2),
                }}
              />
            ))}
          </div>
        ) : (
          // Animated meteors for normal users
          <AnimatePresence>
            {meteors.map((m, i) => (
              <motion.div
                key={m.id}
                className="absolute rounded-full"
                style={{
                  width: m.size * 0.6,
                  height: m.size * 0.6,
                  background: `radial-gradient(circle at 30% 30%, ${colors.primary}, transparent)`,
                  filter: 'blur(2px)',
                  opacity: 0.5 + (m.vx / 2),
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { ...meteorVariants.initial(i), ...parallaxVariants.initial(i) },
                  animate: { ...meteorVariants.animate(i), ...parallaxVariants.animate(i) },
                  exit: meteorVariants.exit,
                }}
                transition={{
                  duration: trailDuration / 2,
                  ease: 'easeOut',
                  delay: m.delay,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  times: [0, 0.3, 0.6],
                  staggerChildren: 0.1,
                }}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Subtle star field background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ scale: 0.95, rotate: -1 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: trailDuration / 2,
                repeat: Infinity,
                delay: Math.random() * trailDuration,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Content overlay */}
      <div className="relative z-10 inset-0">
        {children}
      </div>
    </div>
  )
}
