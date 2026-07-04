'use client'

import { motion, useMotionValue, useSpring, type SpringOptions } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import React from 'react'

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intensity?: number
  springConfig?: SpringOptions
  size?: 'sm' | 'md' | 'lg'
}

const DEFAULT_SPRING: SpringOptions = {
  damping: 12,
  stiffness: 150,
  mass: 1,
}

export function MagneticButton({
  children,
  className,
  intensity = 30,
  springConfig = DEFAULT_SPRING,
  size = 'md',
  ...props
}: MagneticButtonProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  return (
    <motion.div
      className="relative"
      style={{
        x: springX,
        y: springY,
        cursor: 'grab',
        touchAction: 'none',
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        x.set(e.clientX - rect.left - centerX + intensity * (e.clientX - rect.left - centerX) / rect.width)
        y.set(e.clientY - rect.top - centerY + intensity * (e.clientY - rect.top - centerY) / rect.height)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0]
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        x.set(touch.clientX - rect.left - centerX + intensity * (touch.clientX - rect.left - centerX) / rect.width)
        y.set(touch.clientY - rect.top - centerY + intensity * (touch.clientY - rect.top - centerY) / rect.height)
      }}
      onTouchEnd={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <button
        className={cn(
          buttonVariants({ size, variant: 'default', radius: 'md' }),
          'transition-transform duration-200 hover:-translate-y-1 active:scale-95',
          className
        )}
        style={{ transform: `translate3d(${springX.get()}, ${springY.get()}, 0)` }}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  )
}
