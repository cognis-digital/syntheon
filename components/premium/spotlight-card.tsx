'use client'

import { motion, useTransform, useScroll, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface SpotlightCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  variant?: 'default' | 'glow' | 'subtle'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  accentColor?: 'violet' | 'indigo' | 'purple' | 'fuchsia'
  imageSrc?: string
  imageAlt?: string
  hoverEffect?: boolean
  showBadge?: boolean
}

const variants = {
  default: {
    base: { scale: 1, rotateX: 0 },
    hover: { scale: 1.02, rotateX: -5 },
    spotlight: { blur: 40, opacity: 0.8 }
  },
  glow: {
    base: { scale: 1, rotateX: 0 },
    hover: { scale: 1.03, rotateX: -8 },
    spotlight: { blur: 60, opacity: 0.95 }
  },
  subtle: {
    base: { scale: 1, rotateX: 0 },
    hover: { scale: 1.01, rotateX: -3 },
    spotlight: { blur: 24, opacity: 0.6 }
  }
}

const sizes = {
  sm: { padding: 'p-4', width: 'w-56', height: 'h-auto' },
  md: { padding: 'p-6', width: 'w-72', height: 'h-auto' },
  lg: { padding: 'p-8', width: 'w-96', height: 'h-auto' },
  xl: { padding: 'p-10', width: 'w-[48rem]', height: 'h-auto' }
}

const accentColors = {
  violet: { from: '#c4b5fd', to: '#a78bfa', glow: '#8b5cf6' },
  indigo: { from: '#e0e7ff', to: '#c7d2fe', glow: '#6366f1' },
  purple: { from: '#fbcfe8', to: '#f9a8d4', glow: '#ec4899' },
  fuchsia: { from: '#ffdde1', to: '#eeb7c0', glow: '#f472b6' }
}

export const SpotlightCard = ({
  title,
  description,
  children,
  footer,
  variant = 'default',
  size = 'md',
  accentColor = 'violet',
  imageSrc,
  imageAlt = '',
  hoverEffect = true,
  showBadge = false
}: SpotlightCardProps) => {
  const reducedMotion = useReducedMotion()
  const motionVariants = variants[variant]

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl bg-background border border-border',
        sizes[size].padding,
        hoverEffect ? 'transition-transform duration-300 ease-out' : ''
      )}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="h-full">
        {imageSrc && (
          <motion.div
            className="relative h-48 w-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent"
            />
          </motion.div>
        )}

        <CardHeader className={cn('pb-2', !imageSrc ? 'pt-6' : '')}>
          {showBadge && (
            <div className="flex items-center gap-1.5 mb-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-border">
                <span className="animate-pulse">●</span> Premium
              </Badge>
            </div>
          )}

          {title && (
            <h2 className={cn(
              'text-2xl font-semibold tracking-tight',
              accentColor === 'violet' ? 'text-violet-600 dark:text-violet-400' : ''
            )}>
              {title}
            </h2>
          )}

          {description && (
            <p className={cn(
              'text-muted-foreground',
              accentColor === 'violet' ? 'text-muted-foreground/70' : ''
            )}>
              {description}
            </p>
          )}
        </CardHeader>

        <CardContent className="py-4">
          {children}
        </CardContent>

        {footer && (
          <CardFooter className={cn('pt-2', !imageSrc ? 'pb-6' : '')}>
            {footer}
          </CardFooter>
        )}
      </Card>

      {!reducedMotion && hoverEffect && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div
              className={cn(
                'absolute -inset-full bg-gradient-to-r',
                accentColor === 'violet' ? 'from-violet-500/20 via-fuchsia-400/10 to-purple-500/20' : ''
              )}
            />
          </motion.div>

          <SpotlightOverlay
            variant={variant}
            accentColor={accentColor}
            reducedMotion={reducedMotion}
          />
        </>
      )}
    </motion.div>
  )
}

const SpotlightOverlay = ({
  variant,
  accentColor,
  reducedMotion
}: {
  variant: SpotlightCardProps['variant']
  accentColor: SpotlightCardProps['accentColor']
  reducedMotion: boolean
}) => {
  const colors = accentColors[accentColor]

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <SpotlightGlow
        colors={colors}
        variant={variant}
        reducedMotion={reducedMotion}
      />
    </motion.div>
  )
}

const SpotlightGlow = ({
  colors,
  variant,
  reducedMotion
}: {
  colors: { from: string; to: string; glow: string }
  variant: SpotlightCardProps['variant']
  reducedMotion: boolean
}) => {
  const spotlightColor = reducedMotion ? colors.glow : '#ffffff'

  return (
    <motion.div
      className="absolute -inset-full z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.div
        className={cn(
          'absolute -left-[20%] top-1/4 h-72 w-72 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className={cn(
          'absolute -right-[20%] top-1/3 h-64 w-64 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.to}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        className={cn(
          'absolute -bottom-[20%] left-1/3 h-80 w-80 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        className={cn(
          'absolute -top-[30%] right-1/4 h-68 w-68 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <motion.div
        className={cn(
          'absolute -right-[25%] bottom-1/4 h-76 w-76 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.to}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <motion.div
        className={cn(
          'absolute -left-[30%] top-1/2 h-72 w-72 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      <motion.div
        className={cn(
          'absolute -bottom-[35%] left-1/2 h-84 w-84 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      <motion.div
        className={cn(
          'absolute -top-[25%] left-1/4 h-70 w-70 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.to}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
      />

      <motion.div
        className={cn(
          'absolute -right-[30%] top-1/2 h-68 w-68 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
      />

      <motion.div
        className={cn(
          'absolute -bottom-[20%] right-1/3 h-74 w-74 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
      />

      <motion.div
        className={cn(
          'absolute -left-[25%] bottom-1/3 h-76 w-76 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.to}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />

      <motion.div
        className={cn(
          'absolute -top-[35%] right-1/2 h-78 w-78 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
      />

      <motion.div
        className={cn(
          'absolute -bottom-[30%] left-1/4 h-72 w-72 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 12 }}
      />

      <motion.div
        className={cn(
          'absolute -right-[35%] bottom-1/2 h-74 w-74 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.to}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 13 }}
      />

      <motion.div
        className={cn(
          'absolute -top-[28%] left-1/2 h-76 w-76 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 14 }}
      />

      <motion.div
        className={cn(
          'absolute -left-[35%] top-1/2 h-78 w-78 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 15 }}
      />

      <motion.div
        className={cn(
          'absolute -bottom-[28%] right-1/3 h-76 w-76 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.to}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 16 }}
      />

      <motion.div
        className={cn(
          'absolute -right-[28%] top-1/3 h-74 w-74 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 17 }}
      />

      <motion.div
        className={cn(
          'absolute -top-[32%] right-1/3 h-76 w-76 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 18 }}
      />

      <motion.div
        className={cn(
          'absolute -bottom-[32%] left-1/3 h-78 w-78 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.to}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 19 }}
      />

      <motion.div
        className={cn(
          'absolute -left-[32%] bottom-1/2 h-76 w-76 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 20 }}
      />

      <motion.div
        className={cn(
          'absolute -right-[32%] bottom-1/3 h-78 w-78 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 21 }}
      />

      <motion.div
        className={cn(
          'absolute -top-[38%] left-1/2 h-76 w-76 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.to}, transparent)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 22 }}
      />

      <motion.div
        className={cn(
          'absolute -bottom-[38%] right-1/2 h-78 w-78 rounded-full blur-3xl',
          reducedMotion ? '' : 'animate-pulse'
        )}
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
