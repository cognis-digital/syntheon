'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type React from 'react'

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  hoverEffect?: boolean
  staggerDelay?: number
  reverseOrder?: boolean
}

const sizes = {
  sm: { width: 40, height: 40, gap: 16 },
  md: { width: 56, height: 56, gap: 20 },
  lg: { width: 80, height: 80, gap: 24 },
  xl: { width: 96, height: 96, gap: 32 },
  '2xl': { width: 120, height: 120, gap: 40 },
}

const variants = {
  initial: { scale: 0.85, opacity: 0, rotateX: -90 },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: i * 0.06,
    },
  }),
}

export const AvatarStack = ({
  children,
  max,
  size = 'md',
  hoverEffect = true,
  staggerDelay = 100,
  reverseOrder = false,
  className,
  ...props
}: AvatarStackProps) => {
  const reducedMotion = useReducedMotion()
  const config = sizes[size]

  return (
    <div
      role="group"
      aria-label="Avatar stack"
      className={cn(
        'relative flex items-center justify-center',
        `gap-${config.gap}`,
        className,
      )}
      {...props}
    >
      <motion.div
        initial={false}
        animate={reducedMotion ? 'animate' : undefined}
        variants={variants}
        transition={{ staggerChildren: staggerDelay }}
        className="flex flex-col items-center justify-center"
      >
        {React.Children.map(children, (child, i) => {
          const reversedIndex = reverseOrder ? children.length - 1 - i : i

          return (
            <motion.div
              key={reversedIndex}
              variants={{
                initial: reducedMotion ? 'animate' : undefined,
                animate: reducedMotion ? 'animate' : variants.animate(reversedIndex),
              }}
              className="relative"
            >
              <div
                className={cn(
                  'absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg',
                  hoverEffect && 'transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:scale-105 cursor-pointer',
                )}
              />

              <div className="relative z-10 flex items-center justify-center">
                {child}
              </div>

              {/* Decorative ring effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={reducedMotion ? 'animate' : undefined}
                variants={{
                  initial: reducedMotion ? 'animate' : undefined,
                  animate: reducedMotion ? 'animate' : {
                    scale: [1.2, 1],
                    opacity: [0, 0],
                    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                  },
                }}
                className="absolute inset-0 rounded-full border-4 border-violet-400/20"
              />

              {/* Soft glow */}
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={reducedMotion ? 'animate' : undefined}
                variants={{
                  initial: reducedMotion ? 'animate' : undefined,
                  animate: reducedMotion ? 'animate' : {
                    scale: [1.2, 1],
                    opacity: [0, 0.3, 0],
                    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                  },
                }}
                className="absolute -inset-4 rounded-full bg-violet-500/10 blur-xl"
              />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Overflow indicator */}
      {max && children.length > max && (
        <div className="absolute -top-2 -right-2 z-20">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-medium text-white shadow-md">
            {children.length - max}
          </span>
        </div>
      )}

      {/* Stack count hint */}
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={reducedMotion ? 'animate' : undefined}
        variants={{
          initial: reducedMotion ? 'animate' : { opacity: 0, y: 8 },
          animate: reducedMotion ? 'animate' : { opacity: 1, y: 0 },
        }}
        className="absolute -bottom-6 text-xs font-medium text-muted-foreground"
      >
        {children.length} avatars
      </motion.span>
    </div>
  )
}
