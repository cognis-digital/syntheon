'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEffect, useState, useRef, useCallback } from 'react'

export interface PageTransitionProps {
  /** Whether to show a loading indicator during transition */
  isLoading?: boolean
  
  /** Duration in milliseconds for the transition animation */
  duration?: number
  
  /** Custom colors - overrides default violet palette */
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
  
  /** Whether to show a subtle gradient overlay */
  showGradient?: boolean
  
  /** Gradient intensity (0-1) */
  gradientIntensity?: number
  
  /** Custom easing function - default is easeInOutCubic */
  easing?: 'easeInOutCubic' | 'linear' | 'easeOutQuart' | string
  
  /** Whether to animate the cursor overlay */
  showCursorOverlay?: boolean
  
  /** Cursor size multiplier (1-3) */
  cursorSize?: number
  
  /** Whether to show a subtle shimmer effect on hover */
  shimmerOnHover?: boolean
  
  /** Custom shimmer delay in ms */
  shimmerDelay?: number
  
  /** Text content for loading state */
  loadingText?: string
  
  /** Callback when transition completes */
  onComplete?: () => void
  
  /** Whether to allow user interaction during transition */
  interactiveDuringTransition?: boolean
  
  /** Minimum time before allowing next transition (ms) */
  minTransitionTime?: number
  
  /** Custom overlay content */
  children?: React.ReactNode
}

export interface PageTransitionState {
  isActive: boolean
  progress: number
  isComplete: boolean
  canInteract: boolean
}

interface PageTransitionContextValue extends PageTransitionState {}

const DEFAULT_DURATION = 400
const DEFAULT_COLORS = {
  primary: 'hsl(265, 80%, 60%)',
  secondary: 'hsl(265, 70%, 50%)',
  accent: 'hsl(265, 90%, 45%)'
}

const DEFAULT_LOADING_TEXT = 'Syntheon'

export const PageTransitionContext = React.createContext<PageTransitionContextValue>({
  isActive: false,
  progress: 0,
  isComplete: false,
  canInteract: true
})

// Helper to create smooth gradient backgrounds
function getGradientBackground(
  primaryColor: string,
  secondaryColor: string,
  intensity: number = 1
): string {
  const [r1, g1, b1] = primaryColor.slice(4).split(',').map(Number)
  const [r2, g2, b2] = secondaryColor.slice(4).split(',').map(Number)
  
  // Create a subtle gradient using the provided colors
  return `linear-gradient(135deg, 
    rgba(${r1}, ${g1}, ${b1}, ${intensity * 0.1}) 0%,
    rgba(${r2}, ${g2}, ${b2}, ${intensity * 0.08}) 50%,
    transparent 100%)`
}

// Helper to create shimmer effect CSS
function getShimmerStyle(): React.CSSProperties {
  return {
    background: 'linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.1) 48%, 
      rgba(255, 255, 255, 0.2) 50%, 
      rgba(255, 255, 255, 0.1) 52%, 
      transparent 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite linear'
  } as React.CSSProperties
}

// Shimmer keyframes injected into document
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`

export function PageTransition({
  isLoading = false,
  duration = DEFAULT_DURATION,
  colors = DEFAULT_COLORS,
  showGradient = true,
  gradientIntensity = 0.5,
  easing = 'easeInOutCubic',
  showCursorOverlay = true,
  cursorSize = 1.2,
  shimmerOnHover = false,
  shimmerDelay = 300,
  loadingText = DEFAULT_LOADING_TEXT,
  onComplete,
  interactiveDuringTransition = false,
  minTransitionTime = 500,
  children
}: PageTransitionProps) {
  const [state, setState] = useState<PageTransitionState>({
    isActive: isLoading,
    progress: 0,
    isComplete: false,
    canInteract: true
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const shimmerRef = useRef<HTMLDivElement>(null)
  const lastTransitionTime = useRef(0)
  const isAnimating = useRef(false)

  // Calculate easing function
  const getEasingFunction = useCallback(() => {
    if (easing === 'easeInOutCubic') return 'cubic-bezier(0.65, 0, 0.35, 1)'
    if (easing === 'linear') return 'linear'
    if (easing === 'easeOutQuart') return 'cubic-bezier(0.25, 1, 0.5, 1)'
    return easing || 'cubic-bezier(0.65, 0, 0.35, 1)'
  }, [easing])

  // Handle scroll-based parallax effects
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ['start end', 'end start'],
    duration: duration * 2
  })

  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -50])

  // Update state when loading changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isActive: isLoading,
      isComplete: !isLoading && prev.isComplete
    }))
  }, [isLoading])

  // Handle transition completion
  useEffect(() => {
    if (state.isActive) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isComplete: true,
          canInteract: interactiveDuringTransition
        }))
        lastTransitionTime.current = Date.now()
        
        if (onComplete) {
          onComplete()
        }
      }, duration - 50)

      return () => clearTimeout(timer)
    } else if (state.isComplete && !isLoading) {
      // Allow next transition after minimum time
      const minTime = Math.max(duration, minTransitionTime)
      const remaining = minTransitionTime - (Date.now() - lastTransitionTime.current)
      
      if (remaining > 0) {
        setTimeout(() => {
          setState(prev => ({ ...prev, isComplete: false }))
        }, remaining)
      } else {
        setState(prev => ({ ...prev, isComplete: false }))
      }
    }
  }, [state.isActive, state.isComplete, isLoading, duration, minTransitionTime, interactiveDuringTransition, onComplete])

  // Handle cursor overlay animation
  const cursorStyle = showCursorOverlay && !useReducedMotion() 
    ? {
        transform: `scale(${cursorSize})`,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    : {}

  // Handle shimmer effect on hover
  const shimmerStyle = shimmerOnHover && !useReducedMotion() 
    ? { ...getShimmerStyle(), opacity: state.isActive ? 0.3 : 0 }
    : {}

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden pointer-events-none"
      style={{ 
        background: showGradient 
          ? getGradientBackground(colors.primary, colors.secondary, gradientIntensity)
          : 'transparent'
      }}
    >
      {/* Inject shimmer keyframes */}
      <style>{shimmerKeyframes}</style>

      {/* Loading overlay - only shows when active */}
      <AnimatePresence>
        {state.isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              ease: getEasingFunction(),
              delay: 0.1
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: state.isActive ? 1 : 0,
                y: 0
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3"
            >
              {/* Animated logo/brand */}
              <motion.div
                animate={state.isActive ? { 
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center"
              >
                <div 
                  ref={cursorRef}
                  style={{ ...cursorStyle, transformOrigin: 'center' }}
                  className="w-8 h-8 rounded-full border-2 border-white/30"
                />
              </motion.div>

              {/* Loading text */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: state.isActive ? 1 : 0,
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.2,
                  repeat: Infinity
                }}
                className="text-white/90 text-sm font-medium tracking-wider"
              >
                {loadingText}
              </motion.span>

              {/* Progress indicator */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: state.isActive ? Math.min(1, (Date.now() - duration * 0.2) / (duration * 0.8)) : 0
                }}
                transition={{ ease: 'easeInOut' }}
                className="w-32 h-1 bg-white/10 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: state.isActive ? `${Math.min(100, (Date.now() - duration * 0.2) / (duration * 0.8)) * 100}%` : 0
                  }}
                  transition={{ ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                />
              </motion.div>
            </motion.div>

            {/* Shimmer effect on hover */}
            {shimmerOnHover && (
              <div 
                ref={shimmerRef}
                style={{ ...shimmerStyle, opacity: shimmerOnHover ? 0.5 : 0 }}
                className="absolute inset-0 pointer-events-none"
              />
            )}

            {/* Cursor overlay */}
            {showCursorOverlay && (
              <motion.div
                initial={{ scale: 1.2 }}
                animate={cursorStyle.transform ? cursorStyle.transform : 'scale(1)'}
                className="absolute inset-0 pointer-events-none"
                style={{ 
                  background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)`,
                  transform: cursorStyle.transform || 'scale(1)'
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content wrapper - applies subtle transforms during transition */}
      <div 
        className="relative z-0"
        style={{ transform: yTransform, willChange: 'transform' }}
      >
        {children}
      </div>
    </motion.div>
  )
}

// Reduced motion detection hook
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduced(mediaQuery.matches)
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', () => {
          setReduced(mediaQuery.matches)
        })
      } else {
        // Fallback for older browsers
        const event = new Event('change') as MediaQueryListEvent & { matches: boolean }
        mediaQuery.dispatchEvent(event)
      }
    }

    checkReducedMotion()
    return () => {}
  }, [])

  return reduced
}

// Enhanced version with context support
export function PremiumPageTransition({
  isLoading = false,
  duration = DEFAULT_DURATION,
  colors = DEFAULT_COLORS,
  showGradient = true,
  gradientIntensity = 0.5,
  easing = 'easeInOutCubic',
  showCursorOverlay = true,
  cursorSize = 1.2,
  shimmerOnHover = false,
  shimmerDelay = 300,
  loadingText = DEFAULT_LOADING_TEXT,
  onComplete,
  interactiveDuringTransition = false,
  minTransitionTime = 500,
  children
}: PageTransitionProps) {
  const [contextState, setContextState] = useState<PageTransitionState>({
    isActive: isLoading,
    progress: 0,
    isComplete: false,
    canInteract: true
  })

  // Sync with parent context if available
  useEffect(() => {
    const context = document.querySelector('[data-page-transition="context"]') as HTMLDivElement | null
    
    if (context) {
      const ctx = context.dataset.pageTransitionContext as string || '{}'
      try {
        const parsed: Partial<PageTransitionState> = JSON.parse(ctx)
        setContextState(prev => ({ ...prev, ...parsed }))
      } catch {
        // Fallback to local state
      }
    }
  }, [isLoading])

  return (
    <motion.div
      data-page-transition="context"
      data-page-transition-context={JSON.stringify(contextState)}
      className="fixed inset-0 z-[100] overflow-hidden pointer-events-none"
      style={{ 
        background: showGradient 
          ? getGradientBackground(colors.primary, colors.secondary, gradientIntensity)
          : 'transparent'
      }}
    >
      <style>{shimmerKeyframes}</style>

      {/* Loading overlay */}
      <AnimatePresence>
        {contextState.isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: contextState.isActive ? 1 : 0,
                y: 0
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                animate={contextState.isActive ? { 
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center"
              >
                <div 
                  style={{ transform: `scale(${cursorSize})` }}
                  className="w-8 h-8 rounded-full border-2 border-white/30"
                />
              </motion.div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: contextState.isActive ? 1 : 0,
                  y: [0, -5, 0]
                }}
                transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                className="text-white/90 text-sm font-medium tracking-wider"
              >
                {loadingText}
              </motion.span>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: contextState.isActive ? Math.min(1, (Date.now() - duration * 0.2) / (duration * 0.8)) : 0
                }}
                transition={{ ease: 'easeInOut' }}
                className="w-32 h-1 bg-white/10 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: contextState.isActive ? `${Math.min(100, (Date.now() - duration * 0.2) / (duration * 0.8)) * 100}%` : 0
                  }}
                  transition={{ ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                />
              </motion.div>

              {shimmerOnHover && (
                <div 
                  style={{ 
                    ...getShimmerStyle(), 
                    opacity: contextState.isActive ? 0.3 : 0,
                    animationDelay: `${shimmerDelay}ms`
                  }}
                  className="absolute inset-0 pointer-events-none"
                />
              )}

              {showCursorOverlay && (
                <motion.div
                  initial={{ scale: 1.2 }}
                  animate={cursorSize > 1 ? `scale(${cursorSize})` : 'scale(1)'}
                  className="absolute inset-0 pointer-events-none"
                  style={{ 
                    background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)`,
                    transform: cursorSize > 1 ? `scale(${cursorSize})` : 'scale(1)'
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="relative z-0"
        style={{ transform: `translateY(-${scrollYProgress * 50}px)`, willChange: 'transform' }}
      >
        {children}
      </div>
    </motion.div>
  )
}

// Convenience wrapper for Next.js App Router
export function usePageTransition() {
  const [state, setState] = useState<PageTransitionState>({
    isActive: false,
    progress: 0,
    isComplete: false,
    canInteract: true
  })

  // Expose state to parent component via context
  useEffect(() => {
    if (document.body) {
      document.body.setAttribute('data-page-transition', 'active')
      document.body.setAttribute(
        'data-page-transition-context', 
        JSON.stringify(state)
      )
    }
  }, [state])

  return state
}
