'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export interface LogoItemProps {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  delay?: number
  scaleOnHover?: boolean
}

export interface InfiniteLogoScrollProps {
  logos: LogoItemProps[]
  speed?: number // 0.5 - 2.0, default 1.0
  gap?: number // in px, default 32
  reverse?: boolean
  loopInterval?: number // ms between full loops, default 8000
  containerPadding?: number | string // padding around container
  hoverEffect?: 'scale' | 'opacity' | 'none'
  scaleOnHoverAmount?: number // for scale effect, default 1.1
  opacityOnHoverAmount?: number // for opacity effect, default 0.8
  staggerDelay?: number // delay between logo entrances in ms
  reverseStagger?: boolean // reverse the stagger order when reversing scroll
}

export interface InfiniteLogoScrollState {
  isHovered: boolean
  currentLoopIndex: number
  totalLoops: number
}

interface LogoItemWithPosition extends LogoItemProps {
  x: number
  y: number
  index: number
}

const DEFAULTS = {
  speed: 1.0,
  gap: 32,
  reverse: false,
  loopInterval: 8000,
  containerPadding: '4rem',
  hoverEffect: 'scale',
  scaleOnHoverAmount: 1.1,
  opacityOnHoverAmount: 0.8,
  staggerDelay: 50,
  reverseStagger: false,
}

const createLogoItemWithPosition = (
  logo: LogoItemProps,
  index: number,
  totalItems: number,
  containerWidth: number,
  gap: number,
): LogoItemWithPosition => {
  const itemWidth = logo.width || 120
  const offset = (index % totalItems) * (itemWidth + gap)
  
  // Calculate position for infinite loop effect
  let x = offset - containerWidth / 2
  
  // Mirror items at edges for seamless loop
  if (x < -containerWidth / 2) {
    x += containerWidth
  } else if (x > containerWidth / 2) {
    x -= containerWidth
  }

  return {
    ...logo,
    x: Math.round(x),
    y: 0,
    index,
  }
}

const calculateTotalItems = (
  logos: LogoItemProps[],
  containerWidth: number,
  gap: number,
): number => {
  const itemWidth = logos[0]?.width || 120
  // Ensure at least 3 items for smooth loop
  let total = Math.ceil(containerWidth / (itemWidth + gap)) + 2
  return Math.max(6, total)
}

export function InfiniteLogoScroll({
  logos,
  speed = DEFAULTS.speed,
  gap = DEFAULTS.gap,
  reverse = DEFAULTS.reverse,
  loopInterval = DEFAULTS.loopInterval,
  containerPadding = DEFAULTS.containerPadding,
  hoverEffect = DEFAULTS.hoverEffect,
  scaleOnHoverAmount = DEFAULTS.scaleOnHoverAmount,
  opacityOnHoverAmount = DEFAULTS.opacityOnHoverAmount,
  staggerDelay = DEFAULTS.staggerDelay,
  reverseStagger = DEFAULTS.reverseStagger,
}: InfiniteLogoScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [totalItems, setTotalItems] = useState(6)
  const [isHovered, setIsHovered] = useState(false)
  const [currentLoopIndex, setCurrentLoopIndex] = useState(0)

  // Calculate total items when container size changes
  useEffect(() => {
    if (containerRef.current && containerWidth > 0) {
      setTotalItems(calculateTotalItems(logos, containerWidth, gap))
    }
  }, [logos, containerWidth, gap])

  // Create logo items with positions
  const createLogoItems = () => {
    if (!containerWidth || totalItems === 0) return []
    
    const items: LogoItemWithPosition[] = []
    for (let i = 0; i < totalItems * 2; i++) {
      // Duplicate logos to ensure smooth infinite loop
      const logoIndex = i % logos.length
      const item = createLogoItemWithPosition(
        logos[logoIndex],
        i,
        totalItems * 2,
        containerWidth,
        gap,
      )
      items.push(item)
    }

    // Sort by x position for rendering order
    return items.sort((a, b) => a.x - b.x)
  }

  const logoItems = createLogoItems()

  // Calculate animation parameters
  const baseDuration = loopInterval / 1000
  const adjustedDuration = baseDuration / speed
  
  // Create staggered entrance animation
  const getStaggerDelay = (index: number) => {
    if (!reverseStagger && reverse) {
      return (totalItems * 2 - index) * staggerDelay
    }
    return index * staggerDelay
  }

  // Calculate x position for infinite loop effect
  const calculateXPosition = (item: LogoItemWithPosition, totalWidth: number): number => {
    if (!containerWidth || totalItems === 0) return item.x
    
    const containerHalfWidth = containerWidth / 2
    let x = item.x - containerHalfWidth
    
    // Create seamless loop by mirroring at edges
    if (x < -totalWidth / 2) {
      x += totalWidth
    } else if (x > totalWidth / 2) {
      x -= totalWidth
    }
    
    return x
  }

  const totalWidth = containerWidth * 3 // Extra space for smooth transitions

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ padding: containerPadding }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient for depth */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isHovered ? 0.1 : 0,
          y: 0,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="h-full w-full bg-gradient-to-b from-violet-500/10 via-transparent to-transparent blur-xl"
          style={{ transform: `translateY(-${isHovered ? 40 : 0}px)` }}
        />
      </motion.div>

      {/* Logo container with infinite scroll effect */}
      <div
        className="absolute inset-0 flex items-center will-change-transform"
        style={{ 
          transform: `translateX(${-currentLoopIndex * totalWidth / speed + (containerWidth / 2 - totalWidth / 4)}px)`,
        }}
      >
        {logoItems.map((item, i) => {
          const xPosition = calculateXPosition(item, totalWidth)
          
          return (
            <motion.div
              key={`${item.src}-${i}`}
              className="absolute flex items-center justify-center"
              style={{ 
                left: `${xPosition}px`,
                transform: 'translateX(-50%)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? opacityOnHoverAmount : 1,
                scale: hoverEffect === 'scale' && !isHovered ? scaleOnHoverAmount : 1,
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <img
                src={item.src}
                alt={item.alt || `Logo ${i + 1}`}
                style={{ 
                  width: item.width,
                  height: 'auto',
                  maxWidth: '100%',
                }}
                className="object-contain"
                loading="eager"
              />
            </motion.div>
          )
        })}
      </div>

      {/* Animated loop indicator */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 0.6,
              scale: 1,
              x: [0, -20, 0],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-violet-500/70 font-medium tracking-wide"
          >
            <span className="inline-block animate-pulse">
              • Smooth Loop Active •
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle parallax effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 0.15 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div 
          className="h-full w-full bg-gradient-to-br from-violet-500/5 via-transparent to-transparent blur-2xl"
          style={{ transform: `scale(${1 + isHovered ? 0.1 : 0})` }}
        />
      </motion.div>
    </div>
  )
}
