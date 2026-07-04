'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type VariantProps, cva } from 'class-variance-authority'

export interface IconTileGridProps {
  items: Array<{
    icon: React.ReactNode
    label?: string
    description?: string
    href?: string
    new?: boolean
    featured?: boolean
    color?: 'violet' | 'indigo' | 'purple' | 'fuchsia'
    size?: 'sm' | 'md' | 'lg'
  }>

  columns?: number
  showLabels?: boolean
  showDescriptions?: boolean
  hoverEffect?: 'scale' | 'lift' | 'glow'
  gradient?: boolean
  glowIntensity?: number
  scaleOnHover?: number
  liftY?: number
  duration?: number
}

const variants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg border bg-background text-sm font-medium transition-colors',
  {
    variants: {
      size: {
        sm: 'h-10 px-3 py-1.5 text-xs border-border/40',
        md: 'h-12 px-4 py-2 text-sm border-border/40',
        lg: 'h-14 px-5 py-2.5 text-base border-border/40',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const colorMap = {
  violet: {
    bg: 'bg-violet-600',
    hover: 'hover:bg-violet-700',
    glow: 'shadow-[0_0_25px_rgba(139,92,246,0.3)]',
    gradient: 'from-violet-500/20 via-transparent to-transparent',
  },
  indigo: {
    bg: 'bg-indigo-600',
    hover: 'hover:bg-indigo-700',
    glow: 'shadow-[0_0_25px_rgba(99,102,241,0.3)]',
    gradient: 'from-indigo-500/20 via-transparent to-transparent',
  },
  purple: {
    bg: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    glow: 'shadow-[0_0_25px_rgba(192,132,252,0.3)]',
    gradient: 'from-purple-500/20 via-transparent to-transparent',
  },
  fuchsia: {
    bg: 'bg-fuchsia-600',
    hover: 'hover:bg-fuchsia-700',
    glow: 'shadow-[0_0_25px_rgba(232,121,249,0.3)]',
    gradient: 'from-fuchsia-500/20 via-transparent to-transparent',
  },
}

const defaultItems = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Dashboard',
    description: 'Full analytics overview',
    new: true,
    featured: true,
    color: 'violet',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.159a6 6 0 01-3.83.517L7.428 15.17a2 2 0 00-1.022.547M3 12h18" />
      </svg>
    ),
    label: 'Live Stream',
    description: 'Real-time broadcasting',
    featured: true,
    color: 'indigo',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Notifications',
    description: 'Smart alerts system',
    color: 'purple',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4L3 8" />
      </svg>
    ),
    label: 'Quick Actions',
    description: 'Frequently used tools',
    color: 'fuchsia',
  },
]

export const IconTileGrid = ({
  items = defaultItems,
  columns = 4,
  showLabels = true,
  showDescriptions = false,
  hoverEffect = 'scale',
  gradient = true,
  glowIntensity = 0.3,
  scaleOnHover = 1.05,
  liftY = 2,
  duration = 400,
}: IconTileGridProps) => {
  const reducedMotion = useReducedMotion()

  return (
    <div className="grid gap-4 sm:gap-6" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {items.map((item, index) => {
        const colorConfig = colorMap[item.color || 'violet']

        return (
          <motion.a
            key={index}
            href={item.href || '#'}
            className={cn(
              variants({ size: item.size || 'md' }),
              item.new && 'relative overflow-hidden',
              item.featured ? colorConfig.bg : '',
              item.hoverEffect === 'glow' ? colorConfig.glow : ''
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{
              delay: index * 50,
              duration: 0.4,
              ease: 'easeOut',
            }}
            whileHover={reducedMotion ? {} : { scale: scaleOnHover, y: -liftY }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
            layoutId={`tile-${index}`}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-sm"
                initial={{ scale: 0.9, rotate: -5 }}
                animate={reducedMotion ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center"
                  animate={reducedMotion ? {} : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className={cn('text-lg', item.new && colorConfig.bg) || ''}>
                    {item.icon}
                  </span>
                </motion.div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn('font-semibold', item.new && colorConfig.bg) || ''}>
                    {item.label}
                  </span>
                  {item.new && (
                    <Badge variant="secondary" className={cn('h-5 px-1.5 text-xs', colorConfig.bg)}>
                      New
                    </Badge>
                  )}
                </div>

                {showDescriptions && item.description && (
                  <p className="text-muted-foreground/70 text-xs mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              {gradient && (
                <motion.div
                  className={cn('absolute inset-0', colorConfig.gradient)}
                  initial={{ opacity: 0 }}
                  whileHover={reducedMotion ? {} : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {item.featured && !gradient && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={reducedMotion ? {} : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={reducedMotion ? {} : { opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <svg className="h-5 w-5 text-muted-foreground/60" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </motion.a>
        )
      })}

      {items.length === 0 && (
        <motion.div
          className="col-span-full flex h-48 items-center justify-center rounded-xl border border-border/50 bg-background/50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
        >
          <p className="text-muted-foreground text-sm">No tiles configured</p>
        </motion.div>
      )}
    </div>
  )
}
