'use client'

import { ReactNode, useRef, useLayoutEffect } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(8px)',
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1],
      staggerChildren: 0,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1],
      staggerChildren: 0,
    },
  },
}

const revealChildVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    transition: {
      duration: 0.45,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

const revealStaggerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

interface RevealProps extends VariantProps<typeof revealVariants> {
  children: ReactNode
  threshold?: number
  direction?: 'up' | 'down' | 'both'
  delayOffset?: number
  easing?: [number, number, number, number]
  className?: string
  style?: React.CSSProperties
}

export interface StickyScrollRevealProps extends RevealProps {
  variant?: 'staggered' | 'cascade' | 'smooth' | 'reveal'
  reverse?: boolean
  containerPadding?: number
}

const revealCva = cva(
  'relative overflow-hidden rounded-lg border border-border bg-background/50 backdrop-blur-sm shadow-sm',
  {
    variants: {
      variant: {
        staggered: '',
        cascade: '',
        smooth: '',
        reveal: '',
      },
    },
    defaultVariants: {
      variant: 'staggered',
    },
  }
)

export function StickyScrollReveal(
  props: StickyScrollRevealProps & React.HTMLAttributes<HTMLDivElement>
): JSX.Element {
  const {
    children,
    threshold = 0.15,
    direction = 'up',
    delayOffset = 0,
    easing = [0.23, 1, 0.36, 1],
    className,
    style,
    variant = 'staggered',
    reverse = false,
    containerPadding = 48,
    ...rest
  } = props

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold, margin: `-${containerPadding}px` })
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (isInView && !reducedMotion) {
      document.body.style.scrollBehavior = 'smooth'
    } else if (!isInView) {
      document.body.style.scrollBehavior = ''
    }
    return () => {
      document.body.style.scrollBehavior = ''
    }
  }, [isInView, reducedMotion])

  const directionMultipliers: Record<string, number> = {
    up: 1,
    down: -1,
    both: 0,
  }

  const multiplier = reverse ? -directionMultipliers[direction] : directionMultipliers[direction]

  const containerVariants = reducedMotion || !isInView
    ? {
        hidden: {},
        visible: {},
      }
    : {
        hidden: { opacity: 0, y: 12 * multiplier },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easing } },
      }

  const childVariants = reducedMotion || !isInView
    ? { hidden: {}, visible: {} }
    : revealChildVariants

  return (
    <motion.div
      ref={ref}
      variants={containerVariants as any}
      initial="hidden"
      animate="visible"
      className={cn(revealCva({ variant }), className)}
      style={{ padding: `${containerPadding}px`, ...style }}
      {...rest}
    >
      <AnimatePresence mode='popLayout'>
        {isInView && (
          <motion.div
            variants={revealStaggerVariants as any}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <div
              style={{
                transform: `translateY(-${containerPadding}px)`,
              }}
            >
              {children}
            </div>

            <motion.div
              variants={revealStaggerVariants as any}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 z-20 pointer-events-none"
            >
              <div style={{ transform: `translateY(${containerPadding}px)` }}>
                {children}
              </div>
            </motion.div>

            <motion.div
              variants={revealStaggerVariants as any}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 z-30 pointer-events-none"
            >
              <div style={{ transform: `translateY(-${containerPadding}px)` }}>
                {children}
              </div>
            </motion.div>

            <motion.div variants={revealStaggerVariants as any} initial="hidden" animate="visible">
              <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-background/80 via-transparent to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isInView && (
        <motion.div
          variants={revealStaggerVariants as any}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-t from-background/90 via-transparent to-transparent"
        />
      )}

      <motion.div
        variants={revealStaggerVariants as any}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-b from-background/90 via-transparent to-transparent"
      />
    </motion.div>
  )
}
