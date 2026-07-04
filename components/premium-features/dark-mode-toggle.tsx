'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor } from 'lucide-react'

export interface DarkModeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'icon-only'
  label?: string
}

const variants = {
  sm: { width: 40, height: 40 },
  md: { width: 52, height: 52 },
  lg: { width: 68, height: 68 },
} as const

export interface DarkModeToggleState {
  isDark: boolean
  prefersReducedMotion: boolean
}

const DEFAULT_STATE: DarkModeToggleState = {
  isDark: false,
  prefersReducedMotion: false,
}

function detectSystemPreference(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function DarkModeToggle({ 
  className, 
  size = 'md', 
  variant = 'default',
  label = 'Toggle theme'
}: DarkModeToggleProps) {
  const [state, setState] = useState<DarkModeToggleState>({ ...DEFAULT_STATE })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Detect system preference and reduced motion
    const isDark = detectSystemPreference()
    const prefersReducedMotion = 
      typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setState({ isDark, prefersReducedMotion })
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    if (state.isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [state.isDark])

  const toggleTheme = () => {
    setState(prev => ({ ...prev, isDark: !prev.isDark }))
  }

  const sizeConfig = variants[size]
  
  // Motion variants for tasteful transitions
  const motionVariants = {
    initial: { scale: 0.85, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
        duration: 0.3
      }
    },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.15 } }
  }

  // Reduced motion variant
  const reducedMotionVariants = state.prefersReducedMotion 
    ? { initial: {}, animate: {}, exit: {} }
    : motionVariants

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.isDark ? 'dark' : 'light'}
        className={cn(
          'relative flex items-center justify-center',
          sizeConfig.width === 68 && 'p-2 rounded-full',
          className
        )}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={reducedMotionVariants}
      >
        <Button
          variant={variant}
          size={size === 'lg' ? 'icon-lg' : size === 'md' ? 'icon' : 'sm'}
          className={cn(
            'relative w-full h-full rounded-full transition-colors duration-300',
            state.isDark 
              ? 'bg-background text-foreground hover:bg-muted/80 border-border' 
              : 'bg-background text-foreground hover:bg-muted/80 border-border',
            variant === 'icon-only' && 'p-2'
          )}
          onClick={toggleTheme}
          aria-label={label}
          role="switch"
          aria-checked={state.isDark ? 'on' : 'off'}
        >
          <motion.div
            className={cn(
              'relative w-full h-full flex items-center justify-center',
              size === 'lg' && 'p-2'
            )}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {state.isDark ? (
              <Moon className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Sun className="w-5 h-5" strokeWidth={2} />
            )}

            {/* Subtle glow effect when dark mode is active */}
            {state.isDark && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}

            {/* Ring indicator for active state */}
            {state.isDark && (
              <motion.div
                className="absolute inset-2 rounded-full border border-primary/30"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}

// Convenience component for quick usage anywhere in the app
export function useDarkMode() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return DEFAULT_STATE

  return state
}
