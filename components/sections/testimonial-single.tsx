'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRef } from 'react'

interface TestimonialProps {
  name: string
  role?: string
  company?: string
  avatarUrl?: string
  content: string
  rating?: number | null
  verified?: boolean
  className?: string
}

export interface TestimonialSingleProps extends TestimonialProps {}

const DEFAULT_AVATAR = 'https://placehold.co/100x100/violet/white?text=AV'

function getRatingStars(rating: number | null): string[] {
  if (rating === null) return []
  const stars = ['★', '☆']
  return Array.from({ length: 5 }, (_, i) => 
    i < Math.floor(rating) ? stars[0] : stars[1]
  )
}

function getRatingColor(rating: number | null): string {
  if (rating === null) return 'text-muted-foreground'
  const threshold = rating / 5
  if (threshold >= 4.5) return 'text-yellow-400 drop-shadow-sm'
  if (threshold >= 3.5) return 'text-yellow-300'
  if (threshold >= 2.5) return 'text-orange-400'
  return 'text-muted-foreground'
}

function getGradientColor(verified: boolean): string {
  if (!verified) return 'transparent'
  return 'linear-gradient(to right, rgba(139, 92, 246, 0.1), transparent)'
}

export function TestimonialSingle({
  name = 'Alex Morgan',
  role = 'Senior Developer',
  company = 'TechFlow Inc.',
  avatarUrl = DEFAULT_AVATAR,
  content = "This platform completely transformed how we handle our design system. The violet theme is stunning and the motion feels premium.",
  rating = null,
  verified = false,
  className,
}: TestimonialSingleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '0px 0px 100px 0px', amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        y: isInView ? 0 : 40 
      }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'relative rounded-2xl border bg-background/50 backdrop-blur-xl p-8 shadow-sm',
        verified && `border-violet-400/30 ${getGradientColor(verified)}`,
        className
      )}
    >
      {/* Animated gradient border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: verified ? 0.1 : 0 }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-400/30 via-transparent to-transparent blur-xl" />
      </motion.div>

      {/* Content wrapper */}
      <div className="relative z-10">
        <p className={cn(
          'text-lg leading-relaxed text-foreground',
          verified ? 'font-medium' : ''
        )}>
          {content}
        </p>

        {/* Rating display */}
        {rating !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={cn(
              'mt-4 flex items-center gap-2',
              verified ? 'text-violet-600' : 'text-muted-foreground'
            )}
          >
            <span className="flex">
              {getRatingStars(rating).map((star, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 400 }}
                  className={cn(
                    'text-xl',
                    getRatingColor(rating)
                  )}
                >
                  {star}
                </motion.span>
              ))}
            </span>
            <span className="text-sm">
              {(rating / 5).toFixed(1)} / 5.0
            </span>
          </motion.div>
        )}

        {/* Author info */}
        <div className={cn(
          'mt-6 flex items-center gap-4',
          verified ? 'pt-2 border-t border-border/50' : ''
        )}>
          <motion.img
            src={avatarUrl}
            alt={`${name}'s avatar`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 500, damping: 20 }}
            className="h-12 w-12 rounded-full border-2 object-cover"
            style={{
              borderColor: verified ? '#8b5cf6' : undefined,
              boxShadow: verified ? '0 0 30px rgba(139, 92, 246, 0.3)' : undefined,
            }}
          />

          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'font-semibold truncate',
              verified ? 'text-violet-700 dark:text-violet-300' : ''
            )}>
              {name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {role} • {company}
            </p>
          </div>

          {/* Verified badge */}
          {verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 400 }}
              className="flex items-center gap-1 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Verified
            </motion.div>
          )}
        </div>
      </div>

      {/* Hover interaction hint */}
      <motion.div
        className="absolute -bottom-8 left-0 right-0 flex justify-center opacity-0 transition-opacity duration-300"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <div className="text-xs text-muted-foreground">
          {verified ? 'Verified customer' : 'Customer testimonial'}
        </div>
      </motion.div>

      {/* Subtle shine effect on hover */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-2xl pointer-events-none overflow-hidden',
          verified && 'opacity-100'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.5 }}
      >
        <div className="absolute -left-full top-1/2 h-8 w-32 bg-gradient-to-r from-transparent via-violet-400/20 to-transparent blur-sm" />
      </motion.div>
    </motion.div>
  )
}
