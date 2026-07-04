'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { Menu, X, ChevronRight, Sparkles } from 'lucide-react'

export interface FloatingNavbarProps extends VariantProps<typeof navbarContainer> {
  logo: string
  links: Array<{ label: string; href: string }>
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

const navbarContainer = cva(
  'fixed top-6 left-1/2 -translate-x-1/2 z-[999] max-w-[580px] w-full rounded-full border bg-background/70 backdrop-blur-xl shadow-sm transition-shadow duration-300',
  {
    variants: {
      state: {
        default: 'border-border/40 shadow-xs',
        hover: 'border-primary/60 shadow-lg ring-1 ring-primary/20',
        active: 'border-primary shadow-xl ring-1 ring-primary/30 scale-[1.02]',
      },
    },
  }
)

export interface FloatingNavbarState {
  DEFAULT: 'default'
  HOVER: 'hover'
  ACTIVE: 'active'
}

const stateVariants = {
  DEFAULT: navbarContainer.variants.state.default,
  HOVER: navbarContainer.variants.state.hover,
  ACTIVE: navbarContainer.variants.state.active,
} as const

export interface FloatingNavbarItemProps {
  label: string
  href: string
  index: number
  isActive?: boolean
}

const itemVariants = {
  initial: (index: number) => ({
    opacity: 0,
    y: 12,
    rotateX: -15,
    filter: 'blur(8px)',
  }),
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'none',
    transition: (prev: number) => ({
      duration: 0.6 + prev * 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    }),
  },
  hover: {
    scale: 1.08,
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

const linkVariants = {
  initial: (index: number) => ({ opacity: 0 }),
  animate: { opacity: 1, transition: { delay: index * 0.08 } },
  hover: { scale: 1.05, color: 'text-primary' },
}

const ctaVariants = {
  initial: (index: number) => ({
    opacity: 0,
    y: 24,
    rotateY: -20,
    filter: 'blur(6px)',
  }),
  animate: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    filter: 'none',
    transition: { delay: 0.3, type: 'spring', stiffness: 250 },
  },
}

export const FloatingNavbarItem = ({ label, href, index, isActive }: FloatingNavbarItemProps) => {
  return (
    <motion.a
      href={href}
      variants={linkVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={cn(
        'relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200',
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        index === 0 && !isActive && 'text-foreground'
      )}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <motion.span
          layoutId={`underline-${href}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[calc(100%-8px)] h-0.5 bg-primary rounded-full"
        />
      )}
    </motion.a>
  )
}

export const FloatingNavbarCTA = ({ label, href }: { label: string; href?: string }) => {
  return (
    <motion.div
      variants={ctaVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden rounded-full px-6 py-3 bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20"
    >
      <span className="relative z-10 flex items-center gap-2">
        {label}
        {href && (
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        )}
      </span>
      <motion.div
        layoutId={`cta-glow-${href || 'default'}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/30"
      />
    </motion.div>
  )
}

export const FloatingNavbar = ({
  logo,
  links,
  ctaLabel,
  ctaHref,
  className,
}: FloatingNavbarProps) => {
  const reducedMotion = useReducedMotion()
  const [scrollY] = useScroll()
  const y = useTransform(scrollY, [0, 1], [0, -8])

  return (
    <motion.div
      layoutId="navbar-container"
      className={cn(navbarContainer.className, 'state-DEFAULT', className)}
      initial={{ opacity: 0, scale: 0.95, rotateY: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateY: 0,
        y,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      whileHover="HOVER"
      whileTap={{ scale: 0.98 }}
      layoutTransition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className={cn('flex items-center justify-between px-6 py-4', reducedMotion && 'gap-2')}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 0.2 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner"
          >
            <Sparkles className="h-4.5 w-4.5" strokeWidth={2} />
          </motion.div>
          <span className="text-lg font-bold tracking-tight">{logo}</span>
        </motion.div>

        {!reducedMotion && (
          <>
            <div className="flex items-center gap-3">
              {links.map((link, index) => (
                <FloatingNavbarItem key={link.href} {...link} index={index} />
              ))}
            </div>
            {ctaLabel && ctaHref && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <FloatingNavbarCTA label={ctaLabel} href={ctaHref} />
              </motion.div>
            )}
          </>
        )}

        {reducedMotion && (
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              {links.map((link, index) => (
                <FloatingNavbarItem key={link.href} {...link} index={index} />
              ))}
            </div>
            {ctaLabel && ctaHref && (
              <FloatingNavbarCTA label={ctaLabel} href={ctaHref} />
            )}
          </div>
        )}

        {/* Mobile menu toggle - visible only on smaller screens */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </motion.button>

        {/* Close button for mobile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors"
          aria-label="Close menu"
        >
          <X className="h-4.5 w-4.5" />
        </motion.button>
      </div>

      {/* Animated underline effect */}
      {!reducedMotion && (
        <motion.div
          layoutId="navbar-underline"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 h-0.5 w-[calc(100%-48px)] bg-gradient-to-r from-transparent via-primary/70 to-transparent"
        />
      )}
    </motion.div>
  )
}
