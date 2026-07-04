'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CheckCircle2, Sparkles, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface SuccessIllustrationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  intensity?: 'subtle' | 'medium' | 'vibrant'
  showControls?: boolean
  onReset?: () => void
}

const SIZE_SCALE = {
  sm: { width: 120, height: 120 },
  md: { width: 160, height: 160 },
  lg: { width: 240, height: 240 },
  xl: { width: 320, height: 320 },
}

const INTENSITY = {
  subtle: { opacity: 0.5, blur: 10, scale: 1.1 },
  medium: { opacity: 0.8, blur: 6, scale: 1.05 },
  vibrant: { opacity: 1, blur: 3, scale: 1 },
}

export function SuccessIllustration({
  size = 'md',
  intensity = 'medium',
  showControls = false,
  onReset,
}: SuccessIllustrationProps) {
  const reducedMotion = useReducedMotion()
  const s = SIZE_SCALE[size]
  const i = INTENSITY[intensity]

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/5',
          reducedMotion ? '' : 'animate-pulse-slow'
        )}
        animate={{
          scale: [1, 1.02, 1],
          opacity: i.opacity * 0.3,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative"
        style={{ width: s.width, height: s.height }}
        initial={false}
        animate={reducedMotion ? {} : { rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full">
          <defs>
            <radialGradient id="glow1" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={i.opacity} />
              <stop offset="40%" stopColor="#a78bfa" stopOpacity={i.opacity * 0.3} />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity={i.opacity * 0.1} />
            </radialGradient>

            <filter id="softGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="arcGrad1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            <linearGradient id="arcGrad2">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </linearGradient>
          </defs>

          {/* Outer glow ring */}
          <motion.circle
            cx="120"
            cy="120"
            r={90 + i.blur * 3}
            fill="url(#glow1)"
            filter="url(#softGlow)"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Checkmark arc */}
          <motion.path
            d="M 30 120 A 90 90 0 1 1 210 120"
            fill="none"
            stroke="url(#arcGrad1)"
            strokeWidth={8 + i.blur * 2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              scale: [1, 1.05],
            }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          />

          {/* Inner checkmark */}
          <motion.path
            d="M 85 95 L 105 115 L 145 75"
            fill="none"
            stroke="#fff"
            strokeWidth={6 + i.blur * 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              scale: [0.8, 1],
            }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          />

          {/* Floating particles */}
          {[...Array(8)].map((_, idx) => (
            <motion.circle
              key={idx}
              cx="120"
              cy="120"
              r={4 + Math.random() * 3}
              fill="#fff"
              opacity={i.opacity * 0.6}
              initial={{ x: 120, y: 120, scale: 0 }}
              animate={{
                x: 120 + (Math.random() - 0.5) * 80,
                y: 120 + (Math.random() - 0.5) * 80,
                scale: [0, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: idx * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Inner glow core */}
          <motion.circle
            cx="120"
            cy="120"
            r={35 + i.blur * 4}
            fill="url(#glow1)"
            opacity={i.opacity * 0.8}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>

        {showControls && (
          <motion.div
            className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2 border-violet-300/50 hover:bg-violet-50 dark:hover:bg-violet-950/30"
            >
              <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              Reset Demo
            </Button>

            {onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-muted-foreground hover:text-primary"
              >
                <Zap className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )}

        {showControls && (
          <motion.div
            className="absolute -top-16 left-0 right-0 flex justify-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Card className="shadow-lg border-border/60 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-foreground">
                  Success State
                </span>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {showControls && (
        <motion.div
          className="absolute -right-16 top-0 bottom-0 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Card className="shadow-lg border-border/60 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-foreground">
                Verified ✓
              </span>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
