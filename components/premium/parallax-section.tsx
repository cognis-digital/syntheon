'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

export interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
  easing?: (t: number) => number
  viewportMargin?: number
}

const defaultEasing = (t: number) => t * (2 - t) // smoothstep for buttery feel

export function ParallaxSection({
  children,
  className,
  speed = 1.5,
  easing = defaultEasing,
  viewportMargin = 100,
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: `${viewportMargin}px` })

  useEffect(() => {
    if (!isInView || !scrollRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        scrollRef.current?.requestAnimationFrame(() => {
          const rect = entry.contentRect
          scrollRef.current.style.width = `${rect.width}px`
          scrollRef.current.style.height = `${rect.height}px`
        })
      }
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isInView])

  const y1 = useTransform(
    scrollRef,
    [0, '50%'],
    [0, -scrollRef.current?.offsetHeight / 2 * speed],
    { easing: easing }
  )

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ minHeight: '100vh' }}
    >
      <motion.div
        ref={scrollRef}
        className="absolute inset-0"
        style={{ y: y1, willChange: 'transform' }}
      >
        {children}
      </motion.div>

      {/* Parallax overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />
    </div>
  )
}
