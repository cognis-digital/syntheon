'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, RefreshCcw, MousePointer2, Zap, Settings2 } from 'lucide-react'

export interface ImageCompareSliderProps {
  beforeImage: string | null
  afterImage: string | null
  mode?: 'vertical' | 'horizontal'
  width?: number | string
  height?: number | string
  className?: string
  beforeLabel?: string
  afterLabel?: string
  showControls?: boolean
  autoPlay?: boolean
}

export interface ImageCompareSliderState {
  splitPosition: number
  isDragging: boolean
  dragDirection: 'horizontal' | 'vertical' | null
}

const DEFAULT_STATE: ImageCompareSliderState = {
  splitPosition: 0.5,
  isDragging: false,
  dragDirection: null,
}

export const placeholderSVGs = {
  before: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${100}' height='${100}' viewBox='0 0 100 100'%3E%3Crect fill='%23e9d5f6' rx='8'/%3E%3Ctext x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%237c3aed' font-family='sans-serif' font-size='14'%3EBefore%3C/text%3E%3C/svg%3E`,
  after: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${100}' height='${100}' viewBox='0 0 100 100'%3E%3Crect fill='%23c4b5fd' rx='8'/%3E%3Ctext x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%236d28d9' font-family='sans-serif' font-size='14'%3EAfter%3C/text%3E%3C/svg%3E`,
}

function createPlaceholder(url: string | null, label: string): string {
  if (!url) return placeholderSVGs[label] || placeholderSVGs.before
  return url
}

export function ImageCompareSlider({
  beforeImage = null,
  afterImage = null,
  mode = 'vertical',
  width = '100%',
  height = 'auto',
  className,
  beforeLabel = 'Before',
  afterLabel = 'After',
  showControls = true,
  autoPlay = false,
}: ImageCompareSliderProps) {
  const state: ImageCompareSliderState = {
    ...DEFAULT_STATE,
    splitPosition: mode === 'horizontal' ? 0.5 : 1,
  }

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = React.useState(false)
  const [hoverMode, setHoverMode] = React.useState<NonNullable<ImageCompareSliderProps['mode']>>(mode)

  // Calculate dimensions based on mode and viewport
  const getDimensions = () => {
    if (typeof width === 'number') return { w: width, h: height }
    if (typeof height === 'number') return { w: width, h: height }
    
    const container = containerRef.current
    if (!container) return { w: 0, h: 0 }

    const rect = container.getBoundingClientRect()
    // Maintain aspect ratio for responsive behavior
    const minDim = Math.min(rect.width, rect.height)
    return {
      w: mode === 'horizontal' ? minDim : rect.width,
      h: mode === 'vertical' ? minDim : rect.height,
    }
  }

  // Handle drag movement with smooth interpolation
  const handleDrag = (deltaX: number, deltaY: number) => {
    if (!containerRef.current || !state.dragDirection) return

    const containerRect = containerRef.current.getBoundingClientRect()
    let newPosition: number

    if (mode === 'horizontal') {
      // Horizontal mode - adjust split position based on X movement
      const maxDelta = containerRect.width / 2
      newPosition = Math.max(0, Math.min(1, state.splitPosition + deltaX / maxDelta))
    } else {
      // Vertical mode - adjust split position based on Y movement
      const maxDelta = containerRect.height / 2
      newPosition = Math.max(0, Math.min(1, state.splitPosition + deltaY / maxDelta))
    }

    // Smoothly interpolate to new position
    state.splitPosition = newPosition
  }

  // Handle click anywhere in the slider area
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !state.dragDirection) return

    const containerRect = containerRef.current.getBoundingClientRect()
    let splitPos: number

    if (mode === 'horizontal') {
      // Calculate X position as percentage of width
      const x = e.clientX - containerRect.left
      splitPos = Math.max(0, Math.min(1, x / containerRect.width))
    } else {
      // Calculate Y position as percentage of height
      const y = e.clientY - containerRect.top
      splitPos = Math.max(0, Math.min(1, y / containerRect.height))
    }

    state.splitPosition = splitPos
  }

  // Reset slider to center position
  const handleReset = () => {
    if (mode === 'horizontal') {
      state.splitPosition = 0.5
    } else {
      state.splitPosition = 1
    }
  }

  // Toggle between vertical and horizontal modes
  const toggleMode = () => {
    setHoverMode((prev) => (prev === 'vertical' ? 'horizontal' : 'vertical'))
    if (mode === 'horizontal') {
      state.splitPosition = 0.5
    } else {
      state.splitPosition = 1
    }
  }

  // Auto-play animation effect with smooth transitions
  const autoPlayEffect = React.useMemo(() => ({
    animate: {
      splitPosition: [state.splitPosition, 0.4, 0.6, state.splitPosition],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
  }), [])

  // Calculate dynamic dimensions for responsive layout
  const dims = getDimensions()

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-xl border-border bg-background shadow-sm',
        mode === 'horizontal' ? 'aspect-video' : 'aspect-square',
        className
      )}
      style={{ width, height }}
      onMouseMove={(e) => handleDrag(e.movementX || 0, e.movementY || 0)}
      onClick={handleContainerClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setHoverMode(mode)
      }}
    >
      {/* Background gradient overlay for visual depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Before image layer */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <img
          src={createPlaceholder(beforeImage, beforeLabel)}
          alt={beforeLabel}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>

      {/* After image layer with split effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      >
        <img
          src={createPlaceholder(afterImage, afterLabel)}
          alt={afterLabel}
          className="h-full w-full object-cover"
          draggable={false}
        />

        {/* Split line overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: mode === 'horizontal' ? (state.splitPosition - 0.5) * dims.w : 0,
            y: mode === 'vertical' ? (state.splitPosition - 1) * dims.h : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Split line with gradient glow effect */}
          <div className="relative h-full w-px">
            <motion.div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
              style={{
                height: '80%',
                width: '4px',
                background: 'linear-gradient(90deg, transparent 0%, #7c3aed 50%, transparent 100%)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)',
              }}
            />
          </div>

          {/* Split line glow effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'linear-gradient(90deg, transparent 45%, rgba(124, 58, 237, 0.1) 50%, transparent 55%)',
            }}
          />
        </motion.div>

        {/* Mode toggle indicator */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="absolute top-4 left-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Badge variant="secondary" className="gap-2">
                <MousePointer2 size={14} />
                <span className="text-sm font-medium">{hoverMode === 'vertical' ? 'Vertical Mode' : 'Horizontal Mode'}</span>
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control buttons overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className="absolute top-4 right-4 flex items-center gap-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMode}
                className="rounded-full hover:bg-background/80 hover:text-primary transition-colors"
                aria-label={`Toggle between ${beforeLabel} and ${afterLabel} views`}
              >
                <Settings2 size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="rounded-full hover:bg-background/80 hover:text-primary transition-colors"
                aria-label="Reset slider to center position"
              >
                <RefreshCcw size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsHovering(false)
                  setHoverMode(mode)
                }}
                className="rounded-full hover:bg-background/80 hover:text-primary transition-colors"
                aria-label="Close controls overlay"
              >
                <X size={16} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Labels for accessibility and clarity */}
        <AnimatePresence>
          {(isHovering || showControls) && (
            <>
              <motion.div
                className="absolute top-4 left-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Badge variant="outline" className="gap-2">
                  <span className="text-sm font-medium">{beforeLabel}</span>
                </Badge>
              </motion.div>

              <motion.div
                className="absolute bottom-4 right-4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Badge variant="outline" className="gap-2">
                  <span className="text-sm font-medium">{afterLabel}</span>
                </Badge>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Drag hint indicator */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 px-6 py-3 bg-background/95 backdrop-blur-sm rounded-full shadow-lg border-border">
                <motion.div
                  animate={{ rotate: [0, 180] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MousePointer2 size={20} className="text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-foreground">
                  Drag to compare • Click anywhere to set split point
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-play animation effect */}
        {autoPlay && (
          <motion.div
            className="absolute inset-0"
            animate={autoPlayEffect.animate}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Loading state overlay */}
      <AnimatePresence>
        {(beforeImage === null || afterImage === null) && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.5, scale: 0.95 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Zap size={48} className="text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-foreground">Loading comparison...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility info panel */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-background/95 backdrop-blur-sm border-border shadow-lg">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Comparison Controls</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use your mouse to drag the split line or click anywhere to set a custom comparison point.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsHovering(false)}>
                  <X size={14} />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Helper component for creating custom cursor effect (optional enhancement)
export function ComparisonCursor() {
  const [position, setPosition] = React.useState({ x: -100, y: -100 })
  const [isActive, setIsActive] = React.useState(false)

  return (
    <motion.div
      className="fixed pointer-events-none z-50 hidden"
      style={{ left: position.x, top: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    >
      <div className="relative w-8 h-8">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/50"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <MousePointer2 size={16} className="text-primary" />
        </div>
      </div>
    </motion.div>
  )
}

// Reduced motion preference detection
export function useReducedMotion() {
  const [isReduced, setIsReduced] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReduced(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return isReduced
}
