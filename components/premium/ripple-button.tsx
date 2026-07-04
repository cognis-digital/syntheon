'use client'

import { motion, useReducedMotion } from 'framer-motion'
import React from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants, ButtonProps as BaseButtonProps } from '@/components/ui/button'

export interface RippleButtonProps extends Omit<BaseButtonProps, 'children'> {
  rippleColor?: string
  intensity?: number
}

const defaultRippleColor = 'hsla(var(--primary), 0.15)'
const defaultIntensity = 0.3

export function RippleButton({
  className,
  variant = 'default',
  size = 'default',
  rippleColor = defaultRippleColor,
  intensity = defaultIntensity,
  children,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = React.useState<React.JSX.Element[]>([])

  if (useReducedMotion()) {
    return <button className={cn(buttonVariants({ variant, size }), className)} {...props}>{children}</button>
  }

  const handleInteraction = () => {
    const id = Math.random().toString(36).slice(2)
    const newRipple = (
      <motion.span
        key={id}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="pointer-events-none absolute rounded-full border border-white/20 bg-black/5"
        style={{
          width: 'var(--button-size)',
          height: 'var(--button-size)',
          top: 'calc(50% - var(--button-size) / 2)',
          left: 'calc(50% - var(--button-size) / 2)',
          '--button-size': `${props.size === 'lg' ? '1.75rem' : props.size === 'sm' ? '1.25rem' : '1.5rem'}`,
        }}
      />
    )

    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.key !== id))
    }, 800)
  }

  return (
    <motion.button
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
      style={{
        '--ripple-color': rippleColor,
        '--ripple-intensity': intensity,
      } as React.CSSProperties}
      {...props}
    >
      {children}

      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.key}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none absolute rounded-full border border-white/20 bg-black/5"
            style={{
              width: 'var(--button-size)',
              height: 'var(--button-size)',
              top: 'calc(50% - var(--button-size) / 2)',
              left: 'calc(50% - var(--button-size) / 2)',
              '--button-size': `${props.size === 'lg' ? '1.75rem' : props.size === 'sm' ? '1.25rem' : '1.5rem'}`,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  )
}
