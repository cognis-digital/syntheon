'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

export interface ErrorIllustrationProps {
  title: string
  description?: string
  icon?: ReactNode
  variant?: 'glitch' | 'waves' | 'fragments' | 'abstract'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  accentColor?: 'violet' | 'purple' | 'indigo' | 'fuchsia'
  showTitle?: boolean
  className?: string
}

const variants = {
  glitch: {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.45, 0, 0.55, 1] }
    },
    hover: { scale: 1.02, rotate: -3, transition: { duration: 0.3 } }
  },
  waves: {
    initial: { pathLength: 0.4, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.2, ease: 'easeInOut' }
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  },
  fragments: {
    initial: { 
      opacity: 0, 
      rotate: [-45, 45], 
      x: [0, -20, 20] 
    },
    animate: { 
      opacity: 1, 
      rotate: 0, 
      x: 0,
      transition: { duration: 0.8 }
    },
    hover: { scale: 1.03, transition: { duration: 0.25 } }
  },
  abstract: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    hover: { scale: 1.04, rotate: 2, transition: { duration: 0.3 } }
  }
}

const sizeMultipliers = {
  sm: { width: 160, height: 160, fontSize: 'sm', gap: 0.5 },
  md: { width: 240, height: 240, fontSize: 'base', gap: 0.75 },
  lg: { width: 320, height: 320, fontSize: 'lg', gap: 1 },
  xl: { width: 480, height: 480, fontSize: 'xl', gap: 1.25 }
}

const accentColors = {
  violet: { primary: '#7c3aed', secondary: '#a78bfa', glow: '#ddd6fe' },
  purple: { primary: '#8b5cf6', secondary: '#d8b4fe', glow: '#f3e8ff' },
  indigo: { primary: '#6366f1', secondary: '#c7d2fe', glow: '#e0e7ff' },
  fuchsia: { primary: '#d946ef', secondary: '#f4d2fe', glow: '#fdf4ff' }
}

function createIllustration(
  variant: ErrorIllustrationProps['variant'],
  size: ErrorIllustrationProps['size'] = 'md',
  accentColor: ErrorIllustrationProps['accentColor'] = 'violet'
) {
  const mult = sizeMultipliers[size]
  const color = accentColors[accentColor]

  return (
    <svg
      width={mult.width}
      height={mult.height}
      viewBox={`0 0 ${mult.width} ${mult.height}`}
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color.primary, stopOpacity: 0.4 }} />
          <stop offset="50%" style={{ stopColor: color.secondary, stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: color.primary, stopOpacity: 0.3 }} />
        </linearGradient>
        
        <filter id={`glow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {variant === 'glitch' && (
        <>
          <motion.circle
            cx={mult.width / 2}
            cy={mult.height / 2}
            r={Math.min(mult.width, mult.height) * 0.35}
            fill="url(#grad-glitch)"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              x: [-5, 5, -2, 2, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <motion.path
            d={`M ${mult.width / 2} ${mult.height * 0.4} 
                Q ${(mult.width / 2) - 50} ${(mult.height / 2) - 30}, 
                   ${(mult.width / 2) + 50} ${(mult.height / 2) + 30}`}
            stroke={color.primary}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              d: [
                `M ${mult.width / 2} ${mult.height * 0.4} Q ${(mult.width / 2) - 50} ${(mult.height / 2) - 30}, ${(mult.width / 2) + 50} ${(mult.height / 2) + 30}`,
                `M ${mult.width / 2} ${mult.height * 0.4} Q ${(mult.width / 2) - 80} ${(mult.height / 2) - 60}, ${(mult.width / 2) + 100} ${(mult.height / 2) + 60}`,
                `M ${mult.width / 2} ${mult.height * 0.4} Q ${(mult.width / 2) - 30} ${(mult.height / 2) - 20}, ${(mult.width / 2) + 30} ${(mult.height / 2) + 20}`
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.circle
            cx={mult.width * 0.25}
            cy={mult.height * 0.35}
            r="8"
            fill={color.primary}
            opacity={0.6}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1],
              rotate: [-180, 0]
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <motion.circle
            cx={mult.width * 0.75}
            cy={mult.height * 0.65}
            r="12"
            fill={color.secondary}
            opacity={0.4}
            initial={{ scale: 0, rotate: 90 }}
            animate={{ 
              scale: [0, 1],
              rotate: [90, 0]
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.rect
            x={mult.width * 0.2}
            y={mult.height * 0.5}
            width={mult.width * 0.6}
            height="4"
            rx="2"
            fill={color.primary}
            opacity={0.3}
            initial={{ y: -10, rotate: 5 }}
            animate={{ 
              y: [0, 2, 0],
              rotate: [5, -3, 5]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {variant === 'waves' && (
        <>
          <motion.path
            d={`M 0 ${mult.height * 0.5} 
                C ${mult.width * 0.25} ${(mult.height / 3) - 40}, 
                   ${mult.width * 0.75} ${(mult.height / 3) + 40}, 
                   ${mult.width} ${mult.height * 0.5}`}
            stroke={color.primary}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            filter={`url(#glow-waves)`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              d: [
                `M 0 ${mult.height * 0.5} C ${mult.width * 0.25} ${(mult.height / 3) - 40}, ${mult.width * 0.75} ${(mult.height / 3) + 40}, ${mult.width} ${mult.height * 0.5}`,
                `M 0 ${mult.height * 0.5} C ${mult.width * 0.25} ${(mult.height / 3) - 60}, ${mult.width * 0.75} ${(mult.height / 3) + 60}, ${mult.width} ${mult.height * 0.5}`,
                `M 0 ${mult.height * 0.5} C ${mult.width * 0.25} ${(mult.height / 3) - 20}, ${mult.width * 0.75} ${(mult.height / 3) + 20}, ${mult.width} ${mult.height * 0.5}`
              ]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.path
            d={`M 0 ${(mult.height / 3) + 40} 
                C ${mult.width * 0.25} ${(mult.height / 3) - 20}, 
                   ${mult.width * 0.75} ${(mult.height / 3) + 60}, 
                   ${mult.width} ${(mult.height / 3) + 40}`}
            stroke={color.secondary}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              d: [
                `M 0 ${(mult.height / 3) + 40} C ${mult.width * 0.25} ${(mult.height / 3) - 20}, ${mult.width * 0.75} ${(mult.height / 3) + 60}, ${mult.width} ${(mult.height / 3) + 40}`,
                `M 0 ${(mult.height / 3) + 40} C ${mult.width * 0.25} ${(mult.height / 3) - 40}, ${mult.width * 0.75} ${(mult.height / 3) + 80}, ${mult.width} ${(mult.height / 3) + 40}`,
                `M 0 ${(mult.height / 3) + 40} C ${mult.width * 0.25} ${(mult.height / 3) - 10}, ${mult.width * 0.75} ${(mult.height / 3) + 90}, ${mult.width} ${(mult.height / 3) + 40}`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.circle
            cx={mult.width * 0.15}
            cy={mult.height * 0.3}
            r="6"
            fill={color.primary}
            opacity={0.5}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ 
              scale: [0, 1],
              rotate: [-90, 0]
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          <motion.circle
            cx={mult.width * 0.85}
            cy={mult.height * 0.7}
            r="10"
            fill={color.secondary}
            opacity={0.4}
            initial={{ scale: 0, rotate: 90 }}
            animate={{ 
              scale: [0, 1],
              rotate: [90, 0]
            }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <motion.rect
            x={mult.width * 0.25}
            y={mult.height * 0.4}
            width="8"
            height="12"
            rx="4"
            fill={color.primary}
            opacity={0.3}
            initial={{ y: -5, rotate: 10 }}
            animate={{ 
              y: [0, 3, 0],
              rotate: [10, -8, 10]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.rect
            x={mult.width * 0.6}
            y={mult.height * 0.45}
            width="12"
            height="8"
            rx="4"
            fill={color.secondary}
            opacity={0.3}
            initial={{ y: -3, rotate: -10 }}
            animate={{ 
              y: [0, 2, 0],
              rotate: [-10, 6, -10]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {variant === 'fragments' && (
        <>
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: [0.8, 1],
              rotate: [-5, 5]
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.path
              d={`M ${mult.width * 0.3} ${mult.height / 2} 
                   L ${(mult.width / 4) + 15} ${(mult.height / 2) - 25}
                   L ${(mult.width / 4) + 45} ${(mult.height / 2) - 10}`}
              stroke={color.primary}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  `M ${mult.width * 0.3} ${mult.height / 2} L ${(mult.width / 4) + 15} ${(mult.height / 2) - 25} L ${(mult.width / 4) + 45} ${(mult.height / 2) - 10}`,
                  `M ${mult.width * 0.3} ${mult.height / 2} L ${(mult.width / 4) + 20} ${(mult.height / 2) - 30} L ${(mult.width / 4) + 50} ${(mult.height / 2) - 15}`,
                  `M ${mult.width * 0.3} ${mult.height / 2} L ${(mult.width / 4) + 18} ${(mult.height / 2) - 28} L ${(mult.width / 4) + 48} ${(mult.height / 2) - 12}`
                ]
              }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.path
              d={`M ${mult.width * 0.6} ${mult.height / 2} 
                   L ${(mult.width / 4) + 15} ${(mult.height / 2) + 25}
                   L ${(mult.width / 4) + 45} ${(mult.height / 2) + 10}`}
              stroke={color.secondary}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  `M ${mult.width * 0.6} ${mult.height / 2} L ${(mult.width / 4) + 15} ${(mult.height / 2) + 25} L ${(mult.width / 4) + 45} ${(mult.height / 2) + 10}`,
                  `M ${mult.width * 0.6} ${mult.height / 2} L ${(mult.width / 4) + 20} ${(mult.height / 2) + 30} L ${(mult.width / 4) + 50} ${(mult.height / 2) + 15}`,
                  `M ${mult.width * 0.6} ${mult.height / 2} L ${(mult.width / 4) + 18} ${(mult.height / 2) + 28} L ${(mult.width / 4) + 48} ${(mult.height / 2) + 12}`
                ]
              }}
              transition={{ duration: 0.8, delay: 0.15, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.g>

          <motion.circle
            cx={mult.width * 0.4}
            cy={mult.height * 0.35}
            r="7"
            fill={color.primary}
            opacity={0.6}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1],
              rotate: [-180, 0]
            }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />

          <motion.circle
            cx={mult.width * 0.6}
            cy={mult.height * 0.65}
            r="9"
            fill={color.secondary}
            opacity={0.5}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ 
              scale: [0, 1],
              rotate: [180, 0]
            }}
            transition={{ duration: 0.7, delay: 0.35 }}
          />

          <motion.rect
            x={mult.width * 0.25}
            y={mult.height * 0.45}
            width="10"
            height="6"
            rx="3"
            fill={color.primary}
            opacity={0.3}
            initial={{ y: -8, rotate: 8 }}
            animate={{ 
              y: [0, 2, 0],
              rotate: [8, -5, 8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.rect
            x={mult.width * 0.65}
            y={mult.height * 0.45}
            width="12"
            height="8"
            rx="3"
            fill={color.secondary}
            opacity={0.3}
            initial={{ y: -6, rotate: -8 }}
            animate={{ 
              y: [0, 3, 0],
              rotate: [-8, 5, -8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
