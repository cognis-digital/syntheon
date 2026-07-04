'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef, useRef, useEffect, useState, type ComponentProps } from 'react'

export interface BrandMarqueeProps extends ComponentProps<'div'> {
  items: Array<{
    id: string
    label: string
    icon?: React.ReactNode
    gradient?: boolean
    delay?: number
  }>
  autoScroll?: boolean
  speed?: number
  direction?: 'left' | 'right'
  loop?: boolean
  hoverPause?: boolean
  blur?: boolean
  scaleOnHover?: boolean
}

const DEFAULT_ITEMS: BrandMarqueeProps['items'] = [
  { id: '1', label: 'Syntheon', gradient: true, delay: 0 },
  { id: '2', label: 'Violet', gradient: false, delay: 0.1 },
  { id: '3', label: 'Motion', gradient: true, delay: 0.2 },
  { id: '4', label: 'Premium', gradient: false, delay: 0.3 },
  { id: '5', label: 'Design', gradient: true, delay: 0.4 },
  { id: '6', label: 'Crafted', gradient: false, delay: 0.5 },
]

const createOriginalSVG = (id: string): React.ReactNode => {
  const colors = ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95']
  
  return (
    <svg
      className="w-10 h-10"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          {colors.map((color, i) => (
            <stop key={i} offset={`${(i / colors.length) * 100}%`} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      
      {/* Abstract geometric composition */}
      <motion.path
        d="M25 75 L35 65 L45 75 L55 60 L65 75 L80 60"
        stroke={`url(#grad-${id})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: 1,
          rotate: [0, id === '2' ? 360 : 0],
          x: id === '4' || id === '5' ? 5 : 0
        }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
      />
      
      <motion.circle
        cx="15"
        cy="85"
        r="8"
        fill={`url(#grad-${id})`}
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: [0, 1, 1]
        }}
        transition={{ duration: 1.5, delay: id === '3' ? 0.4 : 0 }}
      />
      
      <motion.rect
        x="85"
        y="20"
        width="10"
        height="60"
        rx="5"
        fill={`url(#grad-${id})`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: [0, 5, 0],
          opacity: 1
        }}
        transition={{ duration: 3, repeat: Infinity, delay: id === '6' ? 0.8 : 0 }}
      />
    </svg>
  )
}

export const BrandMarquee = forwardRef<HTMLDivElement, BrandMarqueeProps>(function(
  { 
    items = DEFAULT_ITEMS, 
    autoScroll = true, 
    speed = 15, 
    direction = 'left', 
    loop = true,
    hoverPause = false,
    blur = false,
    scaleOnHover = false,
    className,
    ...props 
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return
    
    let animationFrame: number
    let position = 0
    const scrollAmount = speed * (direction === 'left' ? -1 : 1)
    
    const animate = () => {
      if (!isPaused && containerRef.current) {
        position += scrollAmount
        
        // Loop back when reaching end
        if (loop) {
          const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth
          
          if (direction === 'left' && position <= -maxScroll * 2) {
            position = 0
          } else if (direction === 'right' && position >= maxScroll * 2) {
            position = -maxScroll * 2
          }
        }
        
        containerRef.current.scrollLeft += scrollAmount
      }
      
      animationFrame = requestAnimationFrame(animate)
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [autoScroll, speed, direction, loop, isPaused])

  const { scrollXRef } = useScroll()
  const opacity = useTransform(scrollXRef, [0, 1], [1, 0.5])
  
  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-lg bg-background',
        blur && 'backdrop-blur-sm',
        scaleOnHover && 'transition-transform duration-300 hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      <div 
        ref={containerRef}
        className="flex items-center gap-8 py-6"
        style={{ 
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex items-center gap-3 shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: scaleOnHover ? [1, 1.05, 1] : 1,
              rotate: item.gradient ? [0, (index % 3) * 45 - 60, 0] : 0
            }}
            transition={{ 
              duration: 0.8, 
              delay: item.delay || index * 0.1,
              ease: 'easeOut'
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full",
              item.gradient 
                ? `bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg` 
                : 'bg-muted'
            )}>
              {item.icon || createOriginalSVG(item.id)}
            </div>
            
            <span className={cn(
              "text-sm font-medium tracking-wide",
              item.gradient ? 'text-white' : 'text-foreground',
              blur && 'blur-[2px]'
            )}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Gradient overlays for depth */}
      <AnimatePresence>
        {items.map((_, i) => (
          <motion.div
            key={`overlay-${i}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15, scale: 1.2 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className="text-xs text-muted-foreground">Scroll</span>
        <motion.div
          className="w-4 h-4 rounded-full border-2 border-border"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  )
})
