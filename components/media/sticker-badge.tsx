'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ButtonProps } from '@/components/ui/button'
import { type CardProps } from '@/components/ui/card'
import { type BadgeProps } from '@/components/ui/badge'

interface StickerBadgeProps extends 
  Partial<ButtonProps>, 
  Partial<CardProps>, 
  Partial<BadgeProps> {
  children?: React.ReactNode
  icon?: 'star' | 'sparkle' | 'crown' | 'gem' | 'lightning' | 'heart' | 'zap' | 'flame'
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  pulse?: boolean
  tilt?: boolean
}

const STICKER_VARIANTS = {
  default: {
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    border: 'border-transparent',
    shadow: 'shadow-lg',
    hoverShadow: 'shadow-xl',
    ring: 'ring-0',
    hoverRing: 'ring-2 ring-white/30'
  },
  outline: {
    bg: 'bg-background',
    text: 'text-primary',
    border: 'border-border',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-md',
    ring: 'ring-0',
    hoverRing: 'ring-1 ring-white/20'
  },
  ghost: {
    bg: 'bg-background/50',
    text: 'text-muted-foreground',
    border: 'border-transparent',
    shadow: 'shadow-none',
    hoverShadow: 'shadow-sm',
    ring: 'ring-0',
    hoverRing: 'ring-1 ring-white/10'
  },
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    border: 'border-transparent',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-md',
    ring: 'ring-0',
    hoverRing: 'ring-1 ring-white/20'
  },
  destructive: {
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    border: 'border-transparent',
    shadow: 'shadow-lg',
    hoverShadow: 'shadow-xl',
    ring: 'ring-0',
    hoverRing: 'ring-2 ring-white/30'
  },
  link: {
    bg: 'bg-background',
    text: 'text-primary',
    border: 'border-transparent',
    shadow: 'shadow-sm',
    hoverShadow: 'shadow-md',
    ring: 'ring-0',
    hoverRing: 'ring-2 ring-primary/40'
  }
}

const STICKER_ICONS = {
  star: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  sparkle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2L9.5 8.5 3 10l5.5 1.5L7.5 18 12 15l4.5 3 1-6.5L21 10l-5.5-1.5L19.5 8.5 12 2zm0 15l-2-5-5-1.5 5-1.5 2-5 2 5 5 1.5-5 1.5-2 5z"/>
    </svg>
  ),
  crown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l-3.5 6h7L12 2zm0 8l-5 9h10l-5-9z"/>
    </svg>
  ),
  gem: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2L5 8l7 3 7-3-7-6zm0 15l-7-9 7-3 7 3-7 9z"/>
    </svg>
  ),
  lightning: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  heart: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  zap: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
    </svg>
  ),
  flame: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 5.5c.67-.89 1.4-1.62 2.1-2.1C15.8 2.6 14.08 2 12 2c-2.08 0-3.8.6-5.6 1.4-.7.47-1.43 1.2-2.1 2.1C3.6 6.1 3 7.82 3 10c0 3.31 2.69 6 6 6 .55 0 1-.45 1-1v-1h2v1c0 .55.45 1 1 1 3.31 0 6-2.69 6-6 0-2.18-.6-3.9-1.4-5.5z"/>
    </svg>
  )
}

const getIcon = (name: string, className?: string) => {
  const IconComponent = STICKER_ICONS[name as keyof typeof STICKER_ICONS] || STICKER_ICONS.star
  return <IconComponent className={cn('w-5 h-5', className)} />
}

const getStickerSize = (size: StickerBadgeProps['size']) => {
  const sizes: Record<string, number> = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  }
  return sizes[size] || sizes.md
}

const getStickerPadding = (size: StickerBadgeProps['size']) => {
  const paddings: Record<string, string> = {
    sm: 'px-2 py-1',
    md: 'px-3 py-2',
    lg: 'px-4 py-3',
    xl: 'px-5 py-4'
  }
  return paddings[size] || paddings.md
}

const getStickerRadius = (size: StickerBadgeProps['size']) => {
  const radii: Record<string, string> = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  }
  return radii[size] || radii.md
}

const getStickerFontWeight = (size: StickerBadgeProps['size']) => {
  const weights: Record<string, string> = {
    sm: 'text-xs font-medium',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
    xl: 'text-lg font-extrabold'
  }
  return weights[size] || weights.md
}

const getStickerLineHeight = (size: StickerBadgeProps['size']) => {
  const heights: Record<string, string> = {
    sm: 'leading-none',
    md: 'leading-tight',
    lg: 'leading-normal',
    xl: 'leading-relaxed'
  }
  return heights[size] || heights.md
}

const getStickerMaxWidth = (size: StickerBadgeProps['size']) => {
  const widths: Record<string, string> = {
    sm: 'max-w-[120px]',
    md: 'max-w-[160px]',
    lg: 'max-w-[200px]',
    xl: 'max-w-[280px]'
  }
  return widths[size] || widths.md
}

const getStickerMinWidth = (size: StickerBadgeProps['size']) => {
  const minWidths: Record<string, string> = {
    sm: 'min-w-[100px]',
    md: 'min-w-[140px]',
    lg: 'min-w-[200px]',
    xl: 'min-w-[300px]'
  }
  return minWidths[size] || minWidths.md
}

const StickerBadge = ({ 
  children, 
  icon, 
  variant = 'default', 
  size = 'md', 
  glow = false, 
  pulse = false,
  tilt = true,
  className,
  ...props 
}: StickerBadgeProps) => {
  const reducedMotion = useReducedMotion()
  const stickerSize = getStickerSize(size)
  const stickerPadding = getStickerPadding(size)
  const stickerRadius = getStickerRadius(size)
  const stickerFontWeight = getStickerFontWeight(size)
  const stickerLineHeight = getStickerLineHeight(size)
  const stickerMaxWidth = getStickerMaxWidth(size)
  const stickerMinWidth = getStickerMinWidth(size)
  const stickerStyle = STICKER_VARIANTS[variant]

  const baseVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    hover: { 
      scale: 1.05,
      y: -3,
      boxShadow: stickerStyle.hoverShadow,
      transition: { duration: 0.2 }
    }
  }

  const iconVariants = reducedMotion ? {} : {
    initial: { rotate: [-5, 5], scale: 0.8 },
    animate: { 
      rotate: [0, 0], 
      scale: 1,
      transition: { duration: 0.3 }
    }
  }

  const contentVariants = reducedMotion ? {} : {
    initial: { y: -5, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { delay: 0.1 }
    }
  }

  const stickerVariants = reducedMotion ? {} : {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  }

  const glowVariants = reducedMotion ? {} : {
    initial: { boxShadow: stickerStyle.shadow },
    animate: { 
      boxShadow: [stickerStyle.shadow, stickerStyle.hoverShadow],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
  }

  const pulseVariants = reducedMotion ? {} : {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
  }

  const tiltVariants = reducedMotion ? {} : {
    initial: { rotateX: -5, rotateY: 5 },
    animate: { 
      rotateX: 0, 
      rotateY: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <motion.div
      className={cn(
        'relative inline-flex flex-col items-center justify-center',
        stickerPadding,
        stickerRadius,
        stickerFontWeight,
        stickerLineHeight,
        stickerMaxWidth,
        stickerMinWidth,
        stickerStyle.bg,
        stickerStyle.text,
        stickerStyle.border,
        stickerStyle.shadow,
        stickerStyle.ring,
        stickerStyle.hoverRing,
        className
      )}
      style={{ 
        width: `${stickerSize}px`,
        height: `${stickerSize}px`
      }}
      variants={stickerVariants}
      initial="initial"
      animate="animate"
      whileHover={!reducedMotion ? 'hover' : undefined}
      {...props}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50 blur-sm pointer-events-none"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      <motion.div
        className="relative z-10 flex items-center justify-center gap-2"
        variants={pulseVariants}
        initial="initial"
        animate="animate"
      >
        {icon && (
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
          >
            {getIcon(icon)}
          </motion.div>
        )}

        {children && (
          <motion.span
            className="text-center text-primary-foreground dark:text-primary"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            style={{ 
              fontSize: `${stickerSize / 12}px`,
              lineHeight: '1.2'
            }}
          >
            {children}
          </motion.span>
        )}

        <motion.div
          className={cn(
            'absolute inset-0 rounded-full opacity-0',
            stickerStyle.hoverRing,
            '!z-50 pointer-events-none'
          )}
          variants={tiltVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-30 blur-md pointer-events-none"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />
    </motion.div>
  )
}

export { StickerBadge }
export type { StickerBadgeProps }
