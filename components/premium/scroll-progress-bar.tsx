'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export interface ScrollProgressBarProps {
  height?: number | string
  color?: string
  borderRadius?: number | string
  showGradient?: boolean
}

export default function ScrollProgressBar({
  height = 3,
  color = 'bg-primary',
  borderRadius = 9999,
  showGradient = false,
}: ScrollProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    setIsReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        typeof window === 'undefined'
    )
  }, [])

  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ['start start', 'end end'],
  })

  const scaleX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1],
    { clamp: true }
  )

  const gradientX = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true })

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-0 left-0 z-[9999]"
      style={{
        height,
        width: '100%',
        position: 'absolute',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary/40 via-primary to-primary/40',
          showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />

      <motion.div
        className={cn(
          'h-full w-[250%] bg-gradient-to-r from-primary via-primary/40 to-transparent',
          !showGradient && 'bg-gradient-to-r from-transparent via-primary/60 to-transparent'
        )}
        style={{
          borderRadius: borderRadius,
          scaleX,
          gradientX,
        }}
      />
