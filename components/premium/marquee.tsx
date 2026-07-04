'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface MarqueeProps {
  items: React.ReactNode[] | string[]
  delay?: number
  speed?: number
  direction?: 'horizontal' | 'vertical'
  pauseOnHover?: boolean
  gap?: number
  className?: string
  itemClassName?: string
}

const defaultDelay = 1000
const defaultSpeed = 24
const defaultGap = 16

export function Marquee({
  items,
  delay = defaultDelay,
  speed = defaultSpeed,
  direction = 'horizontal',
  pauseOnHover = true,
  gap = defaultGap,
  className,
  itemClassName,
}: MarqueeProps) {
  const isReducedMotion = useReducedMotion()

  const itemsRef = React.useRef<HTMLDivElement>(null)

  // Duplicate content for seamless infinite loop
  const duplicatedItems: React.ReactNode[] = []

  if (Array.isArray(items)) {
    duplicatedItems.push(...items, ...items)
  } else {
    duplicatedItems.push(items, items)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        direction === 'horizontal' ? 'flex' : 'block',
        className
      )}
      onMouseEnter={() => {
        if (pauseOnHover && !isReducedMotion) {
          itemsRef.current?.style.setProperty('--paused', 1)
        }
      }}
      onMouseLeave={() => {
        if (pauseOnHover && !isReducedMotion) {
          itemsRef.current?.style.removeProperty('--paused')
        }
      }}
    >
      <motion.div
        ref={itemsRef}
        className="flex"
        style={{
          gap: `${gap}px`,
          '--paused': 0,
        } as React.CSSProperties}
        animate={{
          x: [0, -100],
          y: isReducedMotion ? undefined : [0, -50],
        }}
        transition={{
          duration: direction === 'horizontal' 
            ? (speed / 60) * duplicatedItems.length 
            : speed / 30,
          ease: 'linear',
          repeat: Infinity,
          pauseDuration: 0.1,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <motion.div
            key={`${index}-${typeof item === 'string' ? item : ''}`}
            className={cn(
              'flex-shrink-0',
              direction === 'horizontal' ? 'flex items-center justify-center py-4' : '',
              itemClassName
            )}
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            } as React.CSSProperties}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient overlays for seamless loop transition */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}
