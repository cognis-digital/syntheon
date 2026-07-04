'use client'

import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMemo, useRef, useState, useEffect } from 'react'

export interface TextRevealMaskProps {
  text: string
  variant?: 'curtain' | 'wave' | 'fade' | 'split' | 'blur'
  duration?: number
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'both'
  trigger?: 'scroll' | 'hover' | 'manual' | 'auto'
  staggerDelay?: number
  className?: string
  children?: React.ReactNode
}

export interface TextRevealMaskChildrenProps {
  index: number
  total: number
  isActive: boolean
}

const DEFAULT_DURATION = 0.6
const DEFAULT_DELAY = 0
const DEFAULT_STAGGER = 0.15

function createStaggeredDelay(index: number, baseDelay: number, stagger: number): number {
  return baseDelay + (index * stagger)
}

export function TextRevealMask({
  text,
  variant = 'curtain',
  duration = DEFAULT_DURATION,
  delay = DEFAULT_DELAY,
  direction = 'up',
  trigger = 'auto',
  staggerDelay = DEFAULT_STAGGER,
  className,
  children,
}: TextRevealMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTriggered, setIsTriggered] = useState(false)
  const isInView = useInView(containerRef, { once: true, margin: '10% 2%' })

  useEffect(() => {
    if (trigger === 'scroll' || trigger === 'auto') {
      setIsTriggered(isInView)
    } else if (trigger === 'hover') {
      const el = containerRef.current
      if (el) {
        const handler = () => setIsTriggered(true)
        el.addEventListener('mouseenter', handler)
        return () => el?.removeEventListener('mouseenter', handler)
      }
    } else if (trigger === 'manual') {
      // Will be controlled by children prop
    }
  }, [isInView, trigger])

  const getTransform = (dir: string): string | undefined => {
    switch (dir) {
      case 'up': return 'translateY(-100%)'
      case 'down': return 'translateY(100%)'
      case 'left': return 'translateX(-100%)'
      case 'right': return 'translateX(100%)'
      default: return undefined
    }
  }

  const getInitialTransform = (dir: string): string | undefined => {
    switch (dir) {
      case 'up': return 'translateY(0)'
      case 'down': return 'translateY(0)'
      case 'left': return 'translateX(0)'
      case 'right': return 'translateX(0)'
      default: return undefined
    }
  }

  const getRotate = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '-180deg'
      case 'down': return '180deg'
      case 'left': return '-90deg'
      case 'right': return '90deg'
      default: return undefined
    }
  }

  const getRotateInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '0deg'
      case 'down': return '0deg'
      case 'left': return '0deg'
      case 'right': return '0deg'
      default: return undefined
    }
  }

  const getScale = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1.2
      case 'down': return 1.2
      case 'left': return 1.2
      case 'right': return 1.2
      default: return undefined
    }
  }

  const getScaleInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getSkew = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '-5deg'
      case 'down': return '5deg'
      case 'left': return '-10deg'
      case 'right': return '10deg'
      default: return undefined
    }
  }

  const getSkewInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '0deg'
      case 'down': return '0deg'
      case 'left': return '0deg'
      case 'right': return '0deg'
      default: return undefined
    }
  }

  const getOpacity = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1.2
      case 'down': return 1.2
      case 'left': return 1.2
      case 'right': return 1.2
      default: return undefined
    }
  }

  const getOpacityInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getFilter = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0.2
      case 'down': return 0.2
      case 'left': return 0.3
      case 'right': return 0.3
      default: return undefined
    }
  }

  const getFilterInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getBlur = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0.5
      case 'down': return 0.5
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getBlurInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0
      case 'down': return 0
      case 'left': return 0
      case 'right': return 0
      default: return undefined
    }
  }

  const getShadow = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 2
      case 'down': return 2
      case 'left': return 3
      case 'right': return 3
      default: return undefined
    }
  }

  const getShadowInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0
      case 'down': return 0
      case 'left': return 0
      case 'right': return 0
      default: return undefined
    }
  }

  const getZIndex = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 20
      case 'down': return 20
      case 'left': return 30
      case 'right': return 30
      default: return undefined
    }
  }

  const getZIndexInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 10
      case 'down': return 10
      case 'left': return 20
      case 'right': return 20
      default: return undefined
    }
  }

  const getTransformInitial = (dir: string): string | undefined => {
    switch (dir) {
      case 'up': return 'translateY(100%)'
      case 'down': return 'translateY(-100%)'
      case 'left': return 'translateX(100%)'
      case 'right': return 'translateX(-100%)'
      default: return undefined
    }
  }

  const getTransform = (dir: string): string | undefined => {
    switch (dir) {
      case 'up': return 'translateY(0)'
      case 'down': return 'translateY(0)'
      case 'left': return 'translateX(0)'
      case 'right': return 'translateX(0)'
      default: return undefined
    }
  }

  const getRotate = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '180deg'
      case 'down': return '-180deg'
      case 'left': return '90deg'
      case 'right': return '-90deg'
      default: return undefined
    }
  }

  const getRotateInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '0deg'
      case 'down': return '0deg'
      case 'left': return '0deg'
      case 'right': return '0deg'
      default: return undefined
    }
  }

  const getScale = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getScaleInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1.2
      case 'down': return 1.2
      case 'left': return 1.2
      case 'right': return 1.2
      default: return undefined
    }
  }

  const getSkew = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '5deg'
      case 'down': return '-5deg'
      case 'left': return '10deg'
      case 'right': return '-10deg'
      default: return undefined
    }
  }

  const getSkewInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '0deg'
      case 'down': return '0deg'
      case 'left': return '0deg'
      case 'right': return '0deg'
      default: return undefined
    }
  }

  const getOpacity = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getOpacityInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1.2
      case 'down': return 1.2
      case 'left': return 1.2
      case 'right': return 1.2
      default: return undefined
    }
  }

  const getFilter = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 0.3
      case 'right': return 0.3
      default: return undefined
    }
  }

  const getFilterInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0.2
      case 'down': return 0.2
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getBlur = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0
      case 'down': return 0
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getBlurInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0.5
      case 'down': return 0.5
      case 'left': return 0
      case 'right': return 0
      default: return undefined
    }
  }

  const getShadow = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0
      case 'down': return 0
      case 'left': return 3
      case 'right': return 3
      default: return undefined
    }
  }

  const getShadowInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 2
      case 'down': return 2
      case 'left': return 0
      case 'right': return 0
      default: return undefined
    }
  }

  const getZIndex = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 10
      case 'down': return 10
      case 'left': return 20
      case 'right': return 20
      default: return undefined
    }
  }

  const getZIndexInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 30
      case 'down': return 30
      case 'left': return 10
      case 'right': return 10
      default: return undefined
    }
  }

  const getTransformInitial = (dir: string): string | undefined => {
    switch (dir) {
      case 'up': return 'translateY(0)'
      case 'down': return 'translateY(0)'
      case 'left': return 'translateX(0)'
      case 'right': return 'translateX(0)'
      default: return undefined
    }
  }

  const getTransform = (dir: string): string | undefined => {
    switch (dir) {
      case 'up': return 'translateY(-100%)'
      case 'down': return 'translateY(100%)'
      case 'left': return 'translateX(-100%)'
      case 'right': return 'translateX(100%)'
      default: return undefined
    }
  }

  const getRotate = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '-180deg'
      case 'down': return '180deg'
      case 'left': return '-90deg'
      case 'right': return '90deg'
      default: return undefined
    }
  }

  const getRotateInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '0deg'
      case 'down': return '0deg'
      case 'left': return '0deg'
      case 'right': return '0deg'
      default: return undefined
    }
  }

  const getScale = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1.2
      case 'down': return 1.2
      case 'left': return 1.2
      case 'right': return 1.2
      default: return undefined
    }
  }

  const getScaleInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getSkew = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '-5deg'
      case 'down': return '5deg'
      case 'left': return '-10deg'
      case 'right': return '10deg'
      default: return undefined
    }
  }

  const getSkewInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return '0deg'
      case 'down': return '0deg'
      case 'left': return '0deg'
      case 'right': return '0deg'
      default: return undefined
    }
  }

  const getOpacity = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1.2
      case 'down': return 1.2
      case 'left': return 1.2
      case 'right': return 1.2
      default: return undefined
    }
  }

  const getOpacityInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getFilter = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0.2
      case 'down': return 0.2
      case 'left': return 0.3
      case 'right': return 0.3
      default: return undefined
    }
  }

  const getFilterInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 1
      case 'down': return 1
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getBlur = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0.5
      case 'down': return 0.5
      case 'left': return 1
      case 'right': return 1
      default: return undefined
    }
  }

  const getBlurInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0
      case 'down': return 0
      case 'left': return 0
      case 'right': return 0
      default: return undefined
    }
  }

  const getShadow = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 2
      case 'down': return 2
      case 'left': return 3
      case 'right': return 3
      default: return undefined
    }
  }

  const getShadowInitial = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 0
      case 'down': return 0
      case 'left': return 0
      case 'right': return 0
      default: return undefined
    }
  }

  const getZIndex = (dir: string): number | undefined => {
    switch (dir) {
      case 'up': return 20
      case 'down': return 20
      case 'left': return 30
      case 'right': return 30
      default: return undefined
    }
  }

  const getZIndexInitial = (dir: string): number | undefined
