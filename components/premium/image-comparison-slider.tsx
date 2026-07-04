'use client'

import { useState, useRef, useEffect, useReducedMotion } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GripVertical, MousePointer2, ArrowLeft, ArrowRight, Info } from 'lucide-react'

export interface ImageComparisonSliderProps {
  beforeImage: string | null
  afterImage: string | null
  aspectRatio?: number
  className?: string
  labelBefore?: string
  labelAfter?: string
  showLabels?: boolean
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
}

export interface ImageComparisonSliderState {
  position: number
  isDragging: boolean
  dragStartX: number
  dragOffset: number
}

const DEFAULT_ASPECT_RATIO = 16 / 9
const MIN_SLIDER_WIDTH = 200
const MAX_SLIDER_WIDTH = 350
const HANDLE_SIZE = 48
const HANDLE_RADIUS = 24

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  className,
  labelBefore = 'Before',
  labelAfter = 'After',
  showLabels = true,
  borderRadius = 'lg',
}: ImageComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<ImageComparisonSliderState>({
    position: 0.5,
    isDragging: false,
    dragStartX: 0,
    dragOffset: 0,
  })

  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!reducedMotion && !state.isDragging) {
      setState((prev) => ({ ...prev, position: 0.5 }))
    }
  }, [beforeImage, afterImage, reducedMotion])

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || !afterImage) return

    setState((prev) => ({
      ...prev,
      isDragging: true,
      dragStartX: 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX,
      dragOffset: prev.position * 100,
    }))

    document.body.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!state.isDragging || !containerRef.current) return

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
    const containerRect = containerRef.current.getBoundingClientRect()
    let newPosition = ((clientX - containerRect.left) / containerRect.width) * 100

    if (newPosition < 5) newPosition = 5
    if (newPosition > 95) newPosition = 95

    setState((prev) => ({ ...prev, position: newPosition / 100 }))
  }

  const handleMouseUp = () => {
    setState((prev) => ({ ...prev, isDragging: false }))
    document.body.style.cursor = 'default'
  }

  useEffect(() => {
    if (!state.isDragging && containerRef.current) {
      const listener = (e: MouseEvent | TouchEvent) => handleMouseMove(e)
      window.addEventListener('mousemove', listener as any)
      window.addEventListener('touchmove', listener as any)

      return () => {
        window.removeEventListener('mousemove', listener as any)
        window.removeEventListener('touchmove', listener as any)
      }
    }
  }, [state.isDragging])

  useEffect(() => {
    if (!state.isDragging) {
      const listener = (e: MouseEvent | TouchEvent) => handleMouseUp()
      window.addEventListener('mouseup', listener as any)
      window.addEventListener('touchend', listener as any)

      return () => {
        window.removeEventListener('mouseup', listener as any)
        window.removeEventListener('touchend', listener as any)
      }
    }
  }, [state.isDragging])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!containerRef.current || !afterImage) return

    const step = 5
    let newPosition = state.position * 100

    switch (e.key) {
      case 'ArrowLeft':
        newPosition = Math.max(5, newPosition - step)
        break
      case 'ArrowRight':
        newPosition = Math.min(95, newPosition + step)
        break
      case 'Home':
        newPosition = 5
        break
      case 'End':
        newPosition = 95
        break
    }

    if (newPosition !== state.position * 100) {
      setState((prev) => ({ ...prev, position: newPosition / 100 }))
    }
  }

  const getHandleStyle = () => {
    return {
      left: `${state.position * 100}%`,
      transform: 'translateX(-50%)',
    }
  }

  const getSliderWidth = () => {
    if (!afterImage) return 0
    const containerWidth = containerRef.current?.clientWidth || 320
    return Math.min(Math.max(containerWidth * aspectRatio, MIN_SLIDER_WIDTH), MAX_SLIDER_WIDTH)
  }

  const handleBeforeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    e.preventDefault()
    setState((prev) => ({ ...prev, position: 5 / 100 }))
  }

  const handleAfterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    e.preventDefault()
    setState((prev) => ({ ...prev, position: 95 / 100 }))
  }

  const getBorderRadiusClass = () => {
    const radiusMap: Record<string, string> = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    }

    return radiusMap[borderRadius] || radiusMap.lg
  }

  const getContainerStyle = () => {
    if (!afterImage) return {}
    return { width: getSliderWidth() }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none touch-none',
        'bg-background border border-border rounded-xl overflow-hidden shadow-sm',
        getBorderRadiusClass(),
        className,
      )}
      style={{ aspectRatio: `${aspectRatio}` }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Image comparison slider. Drag to compare before and after images."
    >
      <AnimatePresence initial={false}>
        {afterImage && (
          <>
            {/* Before Image */}
            <motion.div
              className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
              style={{ left: 0, top: 0 }}
              onClick={handleBeforeClick}
              role="button"
              tabIndex={showLabels ? -1 : undefined}
              aria-label={`Show ${labelBefore} image. Click or drag to adjust.`}
            >
              <img
                src={beforeImage || ''}
                alt=""
                className="h-full w-full object-cover pointer-events-none"
              />

              {showLabels && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-muted/80 backdrop-blur-sm rounded-full shadow-sm border border-border/50">
                    {labelBefore}
                  </span>
                </div>
              )}

              <motion.div
                className="absolute inset-0 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: state.position > 0.01 ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="absolute inset-y-0 left-0 flex items-center justify-end">
                  <motion.div
                    className={cn(
                      'relative z-20 cursor-pointer',
                      'bg-background/95 backdrop-blur-md border border-border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200',
                      'w-14 h-14 flex items-center justify-center',
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="text-primary w-6 h-6" />
                  </motion.div>
                </div>

                <div className="absolute inset-y-0 right-4 flex items-center">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium',
                    'text-primary bg-muted/80 backdrop-blur-sm rounded-full shadow-sm border border-border/50',
                  )}>
                    {labelBefore}
                  </span>
                </div>
              </motion.div>

              {/* Gradient overlay for smooth transition */}
              <motion.div
                className="absolute inset-y-0 right-0 w-16 z-30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: state.position > 0.95 ? 1 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div className="h-full w-full bg-gradient-to-l from-background/80 via-transparent to-transparent" />
              </motion.div>

              {/* Gradient overlay for smooth transition (left side) */}
              <motion.div
                className="absolute inset-y-0 left-0 w-16 z-30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: state.position < 0.05 ? 1 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div className="h-full w-full bg-gradient-to-r from-background/80 via-transparent to-transparent" />
              </motion.div>
            </motion.div>

            {/* After Image */}
            <motion.div
              className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
              style={{ left: 0, top: 0 }}
              onClick={handleAfterClick}
              role="button"
              tabIndex={showLabels ? -1 : undefined}
              aria-label={`Show ${labelAfter} image. Click or drag to adjust.`}
            >
              <img
                src={afterImage || ''}
                alt=""
                className="h-full w-full object-cover pointer-events-none"
              />

              {showLabels && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-muted/80 backdrop-blur-sm rounded-full shadow-sm border border-border/50">
                    {labelAfter}
                  </span>
                </div>
              )}

              <motion.div
                className="absolute inset-0 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: state.position < 0.99 ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium',
                    'text-primary bg-muted/80 backdrop-blur-sm rounded-full shadow-sm border border-border/50',
                  )}>
                    {labelAfter}
                  </span>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center justify-end">
                  <motion.div
                    className={cn(
                      'relative z-20 cursor-pointer',
                      'bg-background/95 backdrop-blur-md border border-border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200',
                      'w-14 h-14 flex items-center justify-center',
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="text-primary w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Gradient overlay for smooth transition (right side) */}
              <motion.div
                className="absolute inset-y-0 right-0 w-16 z-30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: state.position > 0.95 ? 1 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div className="h-full w-full bg-gradient-to-l from-background/80 via-transparent to-transparent" />
              </motion.div>

              {/* Gradient overlay for smooth transition (left side) */}
              <motion.div
                className="absolute inset-y-0 left-0 w-16 z-30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: state.position < 0.05 ? 1 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div className="h-full w-full bg-gradient-to-r from-background/80 via-transparent to-transparent" />
              </motion.div>
            </motion.div>

            {/* Slider Handle */}
            <AnimatePresence initial={false}>
              {state.position > 0.01 && state.position < 0.99 && (
                <motion.div
                  className="absolute inset-y-0 z-30 flex items-center"
                  style={getHandleStyle()}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <motion.div
                    className={cn(
                      'relative z-30 cursor-grab active:cursor-grabbing',
                      'bg-background/95 backdrop-blur-md border border-border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200',
                      'w-14 h-14 flex items-center justify-center',
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <GripVertical className="text-primary w-6 h-6" />
                    
                    {/* Tooltip */}
                    <AnimatePresence>
                      {state.isDragging && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-3 px-3 py-2 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl text-xs font-medium text-primary"
                        >
                          <span className="flex items-center gap-1">
                            <MousePointer2 className="w-4 h-4" />
                            Drag to compare
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Progress indicator */}
                    <div className={cn(
                      'absolute inset-x-0 top-0 h-1 bg-muted',
                      state.position > 0.5 ? 'rounded-b-full' : 'rounded-t-full',
                    )}>
                      <motion.div
                        className="h-full bg-primary"
                        style={{ width: `${state.position * 2}rem` }}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>

                  {/* Handle overlay for smooth transition */}
                  <motion.div
                    className="absolute inset-y-0 left-0 w-16 z-40 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: state.position > 0.95 ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <div className="h-full w-full bg-gradient-to-l from-background/80 via-transparent to-transparent" />
                  </motion.div>

                  <motion.div
                    className="absolute inset-y-0 right-0 w-16 z-40 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: state.position < 0.05 ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <div className="h-full w-full bg-gradient-to-r from-background/80 via-transparent to-transparent" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info badge */}
            {showLabels && (
              <motion.div
                className="absolute bottom-4 left-4 z-30 flex items-center gap-2 px-3 py-2 bg-background/95 backdrop-blur-md border border-border rounded-full shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              >
                <Info className="text-primary w-5 h-5" />
                <span className="text-xs font-medium text-foreground">Drag to compare</span>
              </motion.div>
            )}

            {/* Keyboard hint */}
            {showLabels && (
              <motion.div
                className="absolute bottom-4 right-4 z-30 flex items-center gap-2 px-3 py-2 bg-background/95 backdrop-blur-md border border-border rounded-full shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              >
                <span className="text-xs text-muted-foreground">
                  {reducedMotion ? 'Click to reset' : 'Arrow keys to adjust'}
                </span>
              </motion.div>
            )}
          </>
        )}

        {/* Empty state */}
        {!afterImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              'flex flex-col items-center gap-4 px-6 py-8',
              'bg-background/50 backdrop-blur-md border border-border rounded-lg shadow-xl',
            )}>
              <Info className="text-primary w-12 h-12" />
              <span className="text-sm font-medium text-foreground">No after image provided</span>
              <p className="text-xs text-muted-foreground max-w-[280px] text-center">
