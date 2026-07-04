'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface BentoGridItemProps {
  title: string
  description?: string
  icon?: React.ReactNode
  href?: string
  variant?: 'default' | 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  delay?: number
  children?: React.ReactNode
}

export interface BentoGridProps {
  items: BentoGridItemProps[]
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: string
  hoverEffect?: boolean
  staggerDelay?: number
}

const variants = {
  default: {
    background: 'bg-background',
    border: 'border-border',
    titleColor: 'text-foreground',
    descColor: 'text-muted-foreground',
    iconBg: 'bg-muted/50',
    hoverShadow: 'shadow-sm',
  },
  primary: {
    background: 'bg-primary/10',
    border: 'border-primary/20',
    titleColor: 'text-primary',
    descColor: 'text-primary-foreground/70',
    iconBg: 'bg-primary/20',
    hoverShadow: 'shadow-primary/20',
  },
  secondary: {
    background: 'bg-secondary/10',
    border: 'border-secondary/20',
    titleColor: 'text-secondary',
    descColor: 'text-secondary-foreground/70',
    iconBg: 'bg-secondary/20',
    hoverShadow: 'shadow-secondary/20',
  },
  accent: {
    background: 'bg-accent/10',
    border: 'border-accent/20',
    titleColor: 'text-accent',
    descColor: 'text-accent-foreground/70',
    iconBg: 'bg-accent/20',
    hoverShadow: 'shadow-accent/20',
  },
}

const sizeClasses = {
  sm: 'p-3 gap-4',
  md: 'p-5 gap-6',
  lg: 'p-6 gap-8',
  xl: 'p-8 gap-10',
}

export function BentoGrid({
  items,
  columns = 2,
  gap = 'gap-4',
  hoverEffect = true,
  staggerDelay = 0.1,
}: BentoGridProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={cn(
        'grid w-full auto-rows-[minmax(140px,auto)]',
        columns === 1 ? 'grid-cols-1' : `grid-cols-${columns}`,
        gap,
        reducedMotion && 'animate-none'
      )}
    >
      {items.map((item, index) => (
        <BentoGridItem
          key={index}
          {...item}
          delay={staggerDelay * index}
        />
      ))}
    </div>
  )
}

function BentoGridItem({
  title,
  description,
  icon,
  href,
  variant = 'default',
  size = 'md',
  delay = 0,
  children,
}: BentoGridItemProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl transition-all duration-500 ease-out',
        sizeClasses[size],
        variants[variant].background,
        hoverEffect ? 'hover:scale-[1.02] hover:-translate-y-1' : ''
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { scale: 1.05, y: -4 } : undefined}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-background/50 to-transparent"
        initial={{ opacity: 0 }}
        whileHover={hoverEffect ? { opacity: 0.3 } : undefined}
        transition={{ duration: 0.2 }}
      />

      <Card className="h-full flex flex-col relative z-10 bg-background/80 backdrop-blur-xl border-border">
        <CardContent className="flex-1 p-0 flex flex-col">
          {icon && (
            <div
              className={cn(
                'w-12 h-12 rounded-lg mb-4 flex items-center justify-center',
                variants[variant].iconBg,
                hoverEffect ? 'transition-transform duration-300' : ''
              )}
              whileHover={hoverEffect ? { rotate: 5 } : undefined}
            >
              {icon}
            </div>
          )}

          <CardHeader className="flex-1 px-4 pb-2">
            <CardTitle
              className={cn(
                'text-lg font-semibold mb-1',
                variants[variant].titleColor,
                hoverEffect ? 'transition-colors duration-300' : ''
              )}
            >
              {title}
            </CardTitle>

            <CardDescription
              className={cn(
                'text-sm leading-relaxed mb-4',
                variants[variant].descColor,
                hoverEffect ? 'transition-colors duration-300' : ''
              )}
            >
              {description}
            </CardDescription>

            <div className="flex items-center justify-between mt-auto">
              {href && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-9 px-3 text-xs rounded-full transition-all duration-300',
                    hoverEffect ? 'hover:scale-105' : ''
                  )}
                  asChild
                >
                  <a href={href}>Read more</a>
                </Button>
              )}

              {children && (
                <div className="flex items-center gap-2">
                  {children}
                </div>
              )}
            </div>
          </CardHeader>
        </CardContent>
      </Card>

      {/* Decorative glow effect */}
      {!reducedMotion && hoverEffect && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl blur-xl"
          initial={{ opacity: 0 }}
          whileHover={hoverEffect ? { opacity: 0.6 } : undefined}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  )
}
