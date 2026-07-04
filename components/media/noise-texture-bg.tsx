'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NoiseTextureBgProps {
  intensity?: number
  color?: string
  blur?: boolean
  parallax?: boolean
}

export interface NoiseTextureBgInterface extends React.ComponentProps<'div'>, NoiseTextureBgProps {}

export default function NoiseTextureBg({
  className,
  intensity = 0.4,
  color = 'var(--color-background)',
  blur = true,
  parallax = false,
  ...props
}: NoiseTextureBgInterface) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion || !parallax) {
    return (
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-[-1] select-none',
          blur && 'blur-xl',
          className,
        )}
        style={{
          backgroundImage: `radial-gradient(${color}, ${color}), radial-gradient(${color}, ${color})`,
          backgroundSize: `${intensity * 400}% ${intensity * 400}%`,
          opacity: intensity,
        }}
        {...props}
      />
    )
  }

  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 30])

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-[-1] select-none overflow-hidden',
        blur && 'blur-xl',
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(${color}, ${color}), radial-gradient(${color}, ${color})`,
        backgroundSize: `${intensity * 400}% ${intensity * 400}%`,
        opacity: intensity,
      }}
      {...props}
    >
      <motion.div className="absolute inset-0" style={{ y: y1 }} />
      <motion.div className="absolute inset-0" style={{ y: y2 }} />
    </div>
  )
}
