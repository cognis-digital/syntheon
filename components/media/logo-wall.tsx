'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMemo, useState, useEffect } from 'react'

export interface LogoWallProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  gridColumns?: number | 'auto'
  cellSize?: number
  gap?: number
  hoverScale?: number
  staggerDelay?: number
  onCellHover?: (index: number) => void
}

export interface LogoWallCellProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  x: number
  y: number
  size: number
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  children?: React.ReactNode
}

const createGrid = (columns: LogoWallProps['gridColumns'], cellSize: number, gap: number): { x: number; y: number }[] => {
  if (columns === 'auto') return [{ x: 0, y: 0 }]
  
  const cols = typeof columns === 'number' ? columns : 4
  const grid: { x: number; y: number }[] = []
  
  for (let i = 0; i < Math.min(cols * 3, 24); i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    grid.push({
      x: col * cellSize + gap,
      y: row * cellSize + gap,
    })
  }
  
  return grid
}

const createAbstractLogoSVG = (x: number, y: number, size: number): React.ReactNode => {
  const offset = size / 4
  
  // Create a unique abstract geometric pattern based on position
  const rotation = ((x + y) * 7) % 360
  const scaleOffset = (x - y) % 5
  
  return (
    <motion.g
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ 
        opacity: 1, 
        rotate: rotation + scaleOffset * 12,
        filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.4))'
      }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <path
        d={`M${offset},${offset} L${size - offset},${offset} 
           Q${size * 0.75},${offset * 0.3} ${size * 0.9},${offset * 0.6}
           L${size},${size / 2} Q${size * 0.95},${size * 0.8} 
            ${size * 0.7},${size - offset}
           L${offset * 0.3},${size - offset}
           Q${offset},${size * 0.8} ${offset * 0.25},${size * 0.6}
           Z`}
        fill="url(#grad1)"
      />
      <path
        d={`M${offset + size * 0.3},${offset + size * 0.3} 
           L${offset + size * 0.7},${offset + size * 0.3}
           Q${offset + size * 0.85},${offset + size * 0.45} 
            ${offset + size * 0.9},${offset + size * 0.6}
           L${offset + size * 0.9},${offset + size * 0.7}
           Q${offset + size * 0.85},${offset + size * 0.8} 
            ${offset + size * 0.75},${offset + size * 0.85}
           L${offset + size * 0.6},${offset + size * 0.9}
           Q${offset + size * 0.45},${offset + size * 0.85} 
            ${offset + size * 0.35},${offset + size * 0.75}
           L${offset + size * 0.25},${offset + size * 0.6}
           Q${offset + size * 0.15},${offset + size * 0.45} 
            ${offset + size * 0.3},${offset + size * 0.3}
           Z`}
        fill="url(#grad2)"
      />
    </motion.g>
  )
}

const createGradientDefs = (): React.ReactNode => (
  <>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="50%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#DDD6FE" />
      </linearGradient>
    </defs>
  </>
)

export const LogoWallCell: React.FC<LogoWallCellProps> = ({
  index,
  x,
  y,
  size,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  children,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ duration: 0.3 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'relative flex items-center justify-center',
        className
      )}
      style={{
        width: size,
        height: size,
        cursor: 'pointer',
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <svg
        width={size * 0.9}
        height={size * 0.9}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        {createGradientDefs()}
        {createAbstractLogoSVG(x, y, size)}
        
        {/* Subtle hover effect */}
        <motion.circle
          r={size * 0.15}
          fill="#8B5CF6"
          opacity={isHovered ? 0.3 : 0}
          animate={{ 
            cx: x + size / 2,
            cy: y + size / 2,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.4 }}
        />
      </svg>

      {children && (
        <span className="absolute inset-0 flex items-center justify-center text-xs text-primary/70">
          {String(index).padStart(2, '0')}
        </span>
      )}
    </motion.div>
  )
}

export const LogoWall: React.FC<LogoWallProps> = ({
  className,
  gridColumns = 4,
  cellSize = 180,
  gap = 24,
  hoverScale = 1.05,
  staggerDelay = 0,
  onCellHover,
  children,
  ...props
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const grid = useMemo(() => 
    createGrid(gridColumns, cellSize, gap),
    [gridColumns, cellSize, gap]
  )

  const totalCells = grid.length

  return (
    <motion.div
      className={cn(
        'relative p-8 rounded-xl bg-background/50 backdrop-blur-sm',
        'border border-border/20 shadow-lg shadow-violet-900/10',
        'transition-shadow duration-300 hover:shadow-xl hover:shadow-violet-900/20',
        className
      )}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${totalCells}, ${cellSize}px)`,
        gap,
      }}
      {...props}
    >
      <svg width="100%" height="100%">
        {createGradientDefs()}
      </svg>

      <AnimatePresence initial={false}>
        {grid.map((pos, i) => (
          <LogoWallCell
            key={i}
            index={i}
            x={pos.x}
            y={pos.y}
            size={cellSize}
            isHovered={hoveredIndex === i}
            onMouseEnter={() => {
              setHoveredIndex(i)
              onCellHover?.(i)
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Background pattern for each cell */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={{ opacity: 0.3 }}
              animate={{ 
                background: hoveredIndex === i 
                  ? 'linear-gradient(135deg, #8B5CF6 0%, transparent 50%)' 
                  : 'transparent',
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Decorative elements */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: hoveredIndex === i ? 1 : 0.8,
                opacity: hoveredIndex === i ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            >
              <svg width={cellSize * 0.6} height={cellSize * 0.6}>
                <circle
                  cx={cellSize / 2}
                  cy={cellSize / 2}
                  r={cellSize * 0.15}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  opacity={hoveredIndex === i ? 0.8 : 0.3}
                />
              </svg>
            </motion.div>

            {/* Main logo content */}
            <LogoWallCell
              index={i}
              x={pos.x}
              y={pos.y}
              size={cellSize}
              isHovered={hoveredIndex === i}
              onMouseEnter={() => {
                setHoveredIndex(i)
                onCellHover?.(i)
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {children && (
                <span className="text-xs text-primary/60">
                  {String(i).padStart(2, '0')}
                </span>
              )}
            </LogoWallCell>
          </LogoWallCell>
        ))}
      </AnimatePresence>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full"
        initial={{ x: 0, y: 0, scale: 0 }}
        animate={{ 
          x: hoveredIndex !== null ? Math.random() * 20 - 10 : 0,
          y: hoveredIndex !== null ? Math.random() * 20 - 10 : 0,
          scale: hoveredIndex !== null ? 1.5 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        <svg width="100%" height="100%">
          <circle
            cx="50%"
            cy="50%"
            r="40"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth={2}
            opacity={hoveredIndex !== null ? 0.4 : 0.1}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full"
        initial={{ x: 0, y: 0, scale: 0 }}
        animate={{ 
          x: hoveredIndex !== null ? Math.random() * 15 - 7.5 : 0,
          y: hoveredIndex !== null ? Math.random() * 15 - 7.5 : 0,
          scale: hoveredIndex !== null ? 1.3 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        <svg width="100%" height="100%">
          <path
            d="M25 25 L45 25 L45 45 Z"
            fill="#8B5CF6"
            opacity={hoveredIndex !== null ? 0.3 : 0.1}
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}

// Hook to detect reduced motion preference
export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduced(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
    }
  }, [])

  return reduced
}

// Wrapper that gates motion
export const LogoWallWithMotion = React.forwardRef<HTMLDivElement, LogoWallProps>(
  function LogoWallWithMotion(props, ref) {
    const [isReducedMotion, setIsReducedMotion] = useReducedMotion()

    if (isReducedMotion) {
      return (
        <LogoWall
          {...props}
          ref={ref}
          staggerDelay={0}
        />
      )
    }

    return (
      <LogoWall
        {...props}
        ref={ref}
        staggerDelay={staggerDelay || 0.1}
      />
    )
  }
)
