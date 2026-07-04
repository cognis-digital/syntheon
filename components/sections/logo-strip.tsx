'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import { type ClassValue, clsx } from 'clsx'
import * as React from 'react'

export const logoStripVariants = cva(
  'flex flex-wrap justify-center items-center gap-8 py-12 px-4 md:px-0',
  {
    variants: {
      variant: {
        default: 'bg-background/5 backdrop-blur-sm border-b border-border',
        dark: 'bg-background/5 backdrop-blur-sm border-t border-border',
        gradient: 'bg-gradient-to-b from-background via-background/80 to-background/30 border-b border-border/20',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface LogoStripProps extends VariantProps<typeof logoStripVariants> {
  logos: Array<{
    src: string
    alt: string
    href?: string
    width?: number | string
    height?: number | string
    delay?: number
  }>
  columns?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  scale?: number
  blur?: boolean
  grayscale?: boolean
  invert?: boolean
  reverse?: boolean
  className?: string
}

export function LogoStrip({
  logos,
  variant = 'default',
  columns = '4',
  scale = 1,
  blur = false,
  grayscale = true,
  invert = true,
  reverse = false,
  className,
}: LogoStripProps) {
  const containerVariants = React.useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        transition: {
          delayChildren: i * 0.05,
          staggerChildren: 0.02,
          ease: [0.23, 1, 0.32, 1],
        },
      }),
    }),
    []
  )

  const itemVariants = React.useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 40,
        scale: 0.85,
        rotateX: -20,
        filter: blur ? 'blur(10px)' : 'none',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 24,
          delay: 0.1,
        },
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: blur ? 'blur(0px)' : 'none',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 24,
          delay: 0.1,
        },
      },
    }),
    [blur]
  )

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(logoStripVariants({ variant }), className)}
    >
      <div
        className={cn('flex flex-wrap justify-center gap-8 md:gap-12', {
          'flex-row-reverse': reverse,
        })}
      >
        {logos.map((logo, index) => (
          <motion.a
            key={`${logo.src}-${index}`}
            href={logo.href || '#'}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center transition-all duration-500 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg overflow-hidden"
          >
            <motion.img
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 120}
              height={logo.height || 48}
              className="max-w-full max-h-16 object-contain transition-all duration-500 group-hover:scale-125"
              style={{
                transform: `scale(${scale})`,
                filter: grayscale ? (invert ? 'invert(1) grayscale(1)' : 'grayscale(1)') : 'none',
              }}
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backdropFilter: 'blur(4px)' }}
            />
          </motion.a>
        ))}
      </div>

      {logos.length === 0 && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm"
        >
          No logos available
        </motion.p>
      )}
    </motion.section>
  )
}
