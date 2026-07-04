'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode, useRef, useState } from 'react'

export interface RevealOnScrollProps {
  children: ReactNode
  /** Animation delay in milliseconds. Default: 0 */
  delay?: number
  /** Stagger duration between items. Default: 150ms */
  staggerDuration?: number
  /** Direction of reveal animation. Options: 'up', 'down', 'fade' (default), 'scale' */
  direction?: 'up' | 'down' | 'fade' | 'scale'
  /** Whether to animate children individually or as a group. Default: true */
  animateChildren?: boolean
  /** Custom CSS class for the container */
  className?: string
  /** Minimum viewport percentage before triggering reveal. Default: 0.5 (50%) */
  threshold?: number
  /** Axis for checking visibility. Default: 'y' */
  axis?: 'x' | 'y'
}

export const RevealOnScroll = ({
  children,
  delay = 0,
  staggerDuration = 150,
  direction = 'fade',
  animateChildren = true,
  className,
  threshold = 0.5,
  axis = 'y',
}: RevealOnScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { amount: threshold, axis })
  const reducedMotion = useReducedMotion()

  // Calculate stagger offset based on delay and stagger duration
  const getStaggerOffset = (index: number): number => {
    return index * staggerDuration + delay
  }

  if (!isInView || !reducedMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'overflow-hidden',
        direction === 'up' && 'from-transparent to-background/90',
        direction === 'down' && 'from-background/90 to-transparent',
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative z-10">
        {React.Children.map(children, (child, index) => {
          if (animateChildren && React.isValidElement(child)) {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.35,
                  delay: getStaggerOffset(index),
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              >
                {child}
              </motion.div>
            )
          }
          return child
        })}
      </div>

      {/* Directional gradient overlay for visual polish */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {direction === 'up' && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full bg-gradient-to-b from-violet-50/40 to-transparent dark:from-violet-950/20"
          />
        )}
        {direction === 'down' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full bg-gradient-to-t from-violet-50/40 to-transparent dark:from-violet-950/20"
          />
        )}
      </div>

      {/* Subtle depth overlay */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inset-0 bg-gradient-to-br from-violet-400/10 via-transparent to-violet-600/10"
        />
      </div>
    </motion.div>
  )
}
