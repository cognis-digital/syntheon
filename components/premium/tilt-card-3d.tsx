'use client'

import { motion, useMotionValue2, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef, useRef, useState, useEffect, useCallback } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
  'relative overflow-hidden rounded-xl border bg-card text-foreground shadow-sm transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary/50',
  {
    variants: {
      variant: {
        default: 'border-border',
        premium: 'border-primary/30 shadow-lg shadow-primary/10',
        gradient: 'bg-gradient-to-br from-background via-background to-background border-primary/20',
      },
      size: {
        sm: 'p-4 text-sm',
        md: 'p-5 text-base',
        lg: 'p-6 text-lg',
        xl: 'p-8 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface TiltCardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  loading?: boolean
  href?: string
  target?: string
}

export interface TiltCardComponentProps extends TiltCardProps {}

const defaultClassNames = 'cursor-pointer select-none'

export const TiltCard3D = forwardRef<HTMLDivElement, TiltCardComponentProps>(function TiltCard3D(
  { children, className, variant, size, disabled, loading, href, target, ...props },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [x, setX] = useMotionValue2(0)
  const [y, setY] = useMotionValue2(0)
  const [isHovering, setIsHovering] = useState(false)

  const rotateX = useTransform(y, [-100, 100], [-8, 8])
  const rotateY = useTransform(x, [-100, 100], [8, -8])

  const springConfig = { damping: 25, stiffness: 400 }
  const smoothX = useSpring(x, springConfig)
  const smoothY = useSpring(y, springConfig)

  const handleMouseMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current || !isHovering) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      let clientX, clientY

      if ('touches' in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else {
        clientX = (event as MouseEvent).clientX
        clientY = (event as MouseEvent).clientY
      }

      setX((clientX - centerX) / 15)
      setY((clientY - centerY) / 15)
    },
    [isHovering]
  )

  const handleMouseEnter = useCallback(() => {
    if (!disabled && !loading) setIsHovering(true)
  }, [disabled, loading])

  const handleMouseLeave = useCallback(() => {
    setX(0)
    setY(0)
    setIsHovering(false)
  }, [])

  useEffect(() => {
    if (isHovering && !disabled && !loading) {
      return () => {
        setX(0)
        setY(0)
      }
    }
  }, [isHovering, disabled, loading])

  const content = (
    <motion.div
      className={cn('relative h-full w-full', defaultClassNames)}
      style={{ rotateX: smoothX, rotateY: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleMouseMove}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/50 to-transparent opacity-0 transition-opacity duration-300" />

      {children}
    </motion.div>
  )

  return (
    <a
      href={href || undefined}
      target={target || undefined}
      ref={ref as React.RefObject<HTMLAnchorElement>}
      className={cn(
        cardVariants({ variant, size }),
        disabled && 'cursor-not-allowed opacity-60',
        loading && 'animate-pulse cursor-wait',
        className
      )}
      {...props}
    >
      {content}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewY(25deg); }
          100% { transform: translateX(300%) skewY(25deg); }
        }

        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        .depth-shadow {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 2px 4px -1px rgba(0, 0, 0, 0.1),
            0 1px 3px -1px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 2px 4px -1px rgba(0, 0, 0, 0.08),
            0 1px 3px -1px rgba(0, 0, 0, 0.05);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.12),
            0 2px 4px -1px rgba(0, 0, 0, 0.08);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 6px 10px -3px rgba(0, 0, 0, 0.12),
            0 4px 6px -2px rgba(0, 0, 0, 0.08);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 3px 5px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 3px 5px -1px rgba(0, 0, 0, 0.08),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 5px 8px -3px rgba(0, 0, 0, 0.12),
            0 4px 6px -2px rgba(0, 0, 0, 0.08);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 8px 12px -4px rgba(0, 0, 0, 0.15),
            0 6px 10px -3px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 4px 6px -2px rgba(0, 0, 0, 0.1),
            0 3px 5px -1px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 4px 6px -2px rgba(0, 0, 0, 0.08),
            0 3px 5px -1px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 6px 10px -4px rgba(0, 0, 0, 0.12),
            0 5px 8px -3px rgba(0, 0, 0, 0.08);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 10px 16px -4px rgba(0, 0, 0, 0.15),
            0 7px 12px -5px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 5px 8px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 5px 8px -3px rgba(0, 0, 0, 0.08),
            0 4px 6px -2px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 8px 13px -5px rgba(0, 0, 0, 0.15),
            0 6px 10px -4px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 12px 20px -6px rgba(0, 0, 0, 0.18),
            0 9px 14px -6px rgba(0, 0, 0, 0.12);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 6px 10px -4px rgba(0, 0, 0, 0.1),
            0 5px 8px -3px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 6px 9px -4px rgba(0, 0, 0, 0.08),
            0 5px 8px -3px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 10px 16px -6px rgba(0, 0, 0, 0.15),
            0 8px 13px -7px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 14px 24px -7px rgba(0, 0, 0, 0.2),
            0 10px 16px -8px rgba(0, 0, 0, 0.13);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 7px 12px -5px rgba(0, 0, 0, 0.1),
            0 6px 10px -4px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 7px 10px -5px rgba(0, 0, 0, 0.08),
            0 6px 9px -4px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 12px 20px -7px rgba(0, 0, 0, 0.18),
            0 9px 15px -7px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 16px 28px -8px rgba(0, 0, 0, 0.22),
            0 12px 20px -9px rgba(0, 0, 0, 0.14);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 8px 13px -6px rgba(0, 0, 0, 0.1),
            0 7px 12px -5px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 8px 11px -6px rgba(0, 0, 0, 0.08),
            0 7px 10px -5px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 14px 24px -8px rgba(0, 0, 0, 0.2),
            0 11px 19px -8px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 18px 32px -10px rgba(0, 0, 0, 0.25),
            0 14px 24px -11px rgba(0, 0, 0, 0.16);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 9px 15px -7px rgba(0, 0, 0, 0.1),
            0 8px 13px -6px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 9px 12px -7px rgba(0, 0, 0, 0.08),
            0 8px 11px -6px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 16px 28px -9px rgba(0, 0, 0, 0.22),
            0 13px 22px -10px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 20px 36px -12px rgba(0, 0, 0, 0.28),
            0 16px 28px -14px rgba(0, 0, 0, 0.18);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 10px 17px -8px rgba(0, 0, 0, 0.1),
            0 9px 15px -7px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 10px 14px -8px rgba(0, 0, 0, 0.08),
            0 9px 12px -7px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 18px 32px -10px rgba(0, 0, 0, 0.25),
            0 15px 26px -12px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 24px 40px -16px rgba(0, 0, 0, 0.3),
            0 20px 36px -18px rgba(0, 0, 0, 0.2);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 12px 20px -9px rgba(0, 0, 0, 0.1),
            0 11px 18px -9px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 12px 16px -10px rgba(0, 0, 0, 0.08),
            0 11px 14px -9px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 20px 36px -12px rgba(0, 0, 0, 0.28),
            0 17px 30px -14px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 28px 48px -20px rgba(0, 0, 0, 0.35),
            0 24px 42px -24px rgba(0, 0, 0, 0.2);
        }

        .depth-shadow-active:active {
          box-shadow: 
            0 14px 24px -11px rgba(0, 0, 0, 0.1),
            0 13px 22px -11px rgba(0, 0, 0, 0.07);
        }

        .depth-shadow-disabled {
          box-shadow: 
            0 14px 18px -12px rgba(0, 0, 0, 0.08),
            0 13px 16px -11px rgba(0, 0, 0, 0.06);
        }

        .depth-shadow-loading {
          box-shadow: 
            0 24px 42px -16px rgba(0, 0, 0, 0.3),
            0 21px 38px -18px rgba(0, 0, 0, 0.1);
        }

        .depth-shadow-hover:hover {
          box-shadow: 
            0 32px 56px -24px rgba(0, 0, 0, 0.4),
