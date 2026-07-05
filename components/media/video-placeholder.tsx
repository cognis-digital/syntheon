'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRef } from 'react'

export interface VideoPlaceholderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  accentColor?: 'violet' | 'indigo' | 'purple' | 'fuchsia'
  showControls?: boolean
  showTimeRemaining?: boolean
  durationSeconds?: number
  decorativePattern?: 'dots' | 'lines' | 'grid' | 'abstract'
}

export interface VideoPlaceholderSize {
  sm: { width: 120; height: 90 }
  md: { width: 320; height: 180 }
  lg: { width: 560; height: 315 }
  xl: { width: 720; height: 405 }
  full: { width: '100%'; height: '100%' }
}

const SIZES = VideoPlaceholderSize as const

export function VideoPlaceholder({
  className,
  size = 'md',
  accentColor = 'violet',
  showControls = true,
  showTimeRemaining = false,
  durationSeconds = 60,
  decorativePattern = 'dots',
}: VideoPlaceholderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)

  const sizeConfig = SIZES[size]
  const accentHue = accentColor === 'violet' ? 265 : accentColor === 'indigo' ? 240 : accentColor === 'purple' ? 275 : 300

  // Parallax effect on hover
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, -8])
  const opacity1 = useTransform(scrollY, [0, 500], [0.7, 1])

  // Stagger animation variants
  const staggerDelay = size === 'full' ? 0 : 0.02

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-xl bg-background border border-border',
        `h-[${sizeConfig.height}] w-[${sizeConfig.width}]`,
        size === 'full' ? 'min-h-full min-w-full' : '',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background"
        style={{ y: y1, opacity: opacity1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Decorative pattern layer */}
      <DecorativePattern
        type={decorativePattern}
        hue={accentHue}
        scale={isHovered ? 1.2 : 1}
      />

      {/* Main content container */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Play button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-20 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm border border-border shadow-lg"
            >
              <motion.svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke={`hsl(${accentHue}, 70%, 50%)`}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="6 3 18 12 6 21 6 3" />
              </motion.svg>
            </motion.button>

            {/* Time display */}
            {showTimeRemaining && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-muted-foreground"
              >
                {formatTime(durationSeconds)} remaining
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Subtle floating elements */}
        <FloatingElements hue={accentHue} isHovered={isHovered} />
      </div>

      {/* Bottom overlay with subtle gradient */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/80 to-transparent"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      />

      {/* Accessibility info */}
      <div className="sr-only">
        Video placeholder for {size === 'full' ? 'page content' : size.toUpperCase()} sized media preview
      </div>
    </motion.div>
  )
}

// Decorative SVG pattern layer
function DecorativePattern({ type, hue, scale }: { type: VideoPlaceholderProps['decorativePattern']; hue: number; scale: number }) {
  const baseColor = `hsla(${hue}, 60%, 50%, 0.12)`
  const accentColor = `hsla(${hue}, 70%, 45%, 0.08)`

  if (type === 'dots') {
    return (
      <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ transform: `scale(${scale})` }}>
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="1.5" fill={baseColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>
    )
  }

  if (type === 'lines') {
    return (
      <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ transform: `scale(${scale})` }}>
        <defs>
          <pattern id="linePattern" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 32 64 M 0 32 L 64 32" stroke={accentColor} strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#linePattern)" />
      </svg>
    )
  }

  if (type === 'grid') {
    return (
      <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ transform: `scale(${scale})` }}>
        <defs>
          <pattern id="gridPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke={accentColor} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>
    )
  }

  // Abstract - default decorative element
  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ transform: `scale(${scale})` }}>
      <defs>
        <radialGradient id={`abstractGrad-${hue}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={baseColor} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="50%" cy="50%" r="40%" fill={`url(#abstractGrad-${hue})`} opacity="0.6" />
    </svg>
  )
}

// Floating decorative elements for depth
function FloatingElements({ hue, isHovered }: { hue: number; isHovered: boolean }) {
  const floatOffset = isHovered ? 20 : 15
  const accentColor = `hsla(${hue}, 60%, 45%, 0.08)`

  return (
    <>
      <motion.div
        className="absolute top-4 left-4"
        initial={{ x: -floatOffset, y: -floatOffset, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke={accentColor} strokeWidth="1.5" fill="none" />
          <path d="M 12 6 L 12 18 M 6 12 L 18 12" stroke={accentColor} strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-4 right-4"
        initial={{ x: floatOffset, y: floatOffset, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="6" stroke={accentColor} strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="3" fill={accentColor} opacity="0.4" />
        </svg>
      </motion.div>
    </>
  )
}

// Format time in mm:ss format
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
