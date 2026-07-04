'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface MediaCardProps {
  title: string
  subtitle?: string
  description: string
  tags: string[]
  author: string
  date: string
  views: number
  likes: number
  category: 'illustration' | 'photography' | 'design' | '3d' | 'mixed-media'
  featured?: boolean
  gradient?: boolean
}

export interface MediaCardPropsInterface extends MediaCardProps {
  className?: string
  hoverEffect?: 'scale' | 'lift' | 'glow' | false
  revealOnScroll?: boolean
}

const categoryColors: Record<string, string> = {
  illustration: 'from-pink-400 to-rose-500',
  photography: 'from-blue-400 to-cyan-500',
  design: 'from-violet-400 to-purple-600',
  '3d': 'from-emerald-400 to-teal-500',
  'mixed-media': 'from-orange-400 to-red-500',
}

const categoryIcons: Record<string, React.ReactNode> = {
  illustration: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  photography: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 7l6-4 6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  design: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  '3d': (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'mixed-media': (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l9 4.5V17.5L12 22l-9-4.5V6.5L12 2z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
    </svg>
  ),
}

const createSVGBackground = (category: string, featured?: boolean): React.ReactNode => {
  const baseSize = 60
  const offset = featured ? 30 : 20
  
  if (featured) {
    return (
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${baseSize} ${baseSize}`}
        style={{ opacity: 0.15 }}
        initial={{ rotate: -45, scale: 0.8 }}
        animate={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <motion.circle
          cx={baseSize / 2}
          cy={baseSize / 2}
          r={baseSize * 0.4}
          fill={`url(#grad-${category})`}
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: categoryColors[category].split(' ')[0].replace(/-/g, '') }}
        />
      </motion.svg>
    )
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox={`0 0 ${baseSize} ${baseSize}`}>
      <defs>
        <linearGradient id={`grad-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: 'transparent' }} />
        </linearGradient>
      </defs>
      <motion.circle
        cx={baseSize / 2 + offset}
        cy={baseSize / 2 - offset}
        r={baseSize * 0.35}
        fill="url(#grad-${category})"
        initial={{ x: -10, y: 10 }}
        animate={{ x: 10, y: -10 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  )
}

const AnimatedCounter = ({ value, label }: { value: number; label: string }) => {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    let start = 0
    const duration = Math.min(value * 50, 1500)
    const increment = value / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(Math.round(value))
        clearInterval(timer)
      } else {
        setCount(Math.round(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono font-bold text-primary">{count.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export const MediaCard = ({ 
  title, 
  subtitle, 
  description, 
  tags, 
  author, 
  date, 
  views, 
  likes, 
  category,
  featured = false,
  gradient = true,
  className,
  hoverEffect = 'lift',
  revealOnScroll = false,
}: MediaCardPropsInterface) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  // Scroll reveal hook
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 150], [0, 1])
  const y = useTransform(scrollY, [0, 150], [30, 0])

  // Determine hover effect variants
  const getHoverVariants = () => {
    switch (hoverEffect) {
      case 'scale':
        return {
          scale: isHovered ? 1.02 : 1,
          transition: { duration: 0.3 },
        }
      case 'lift':
        return {
          y: isHovered ? -8 : 0,
          transition: { duration: 0.3 },
        }
      case 'glow':
        return {
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(139, 92, 246, 0.4)' 
            : undefined,
          transition: { duration: 0.3 },
        }
      default:
        return {}
    }
  }

  const hoverVariants = getHoverVariants()

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card border-border",
        gradient && !featured ? `bg-gradient-to-br from-background via-background/95 to-background` : '',
        className
      )}
      style={{ opacity, y }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={hoverVariants}
      whileHover={hoverEffect !== false ? { ...hoverVariants } : undefined}
    >
      {/* Background decorative elements */}
      <AnimatePresence>
        {(gradient || featured) && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: gradient ? 1 : 0.5 }}
            transition={{ duration: 0.4 }}
          >
            {createSVGBackground(category, featured)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content container */}
      <div className="relative z-10 p-6">
        {/* Header with category badge and title */}
        <div className="flex items-start justify-between mb-4">
          <Badge 
            variant={featured ? "default" : "secondary"} 
            className={cn(
              "gap-2 px-3 py-1.5 text-sm",
              featured && categoryColors[category],
              !featured && "bg-muted/80 text-muted-foreground border-border"
            )}
          >
            {categoryIcons[category]}
            <span className="capitalize">{category}</span>
          </Badge>

          {featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.13L12 17.77l-6.18 3.26L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          )}
        </div>

        {/* Title and subtitle */}
        <h3 className={cn(
          "text-xl font-semibold text-foreground mb-2",
          featured ? "text-3xl" : "",
          isHovered && hoverEffect === 'scale' ? "scale-[1.01] origin-left transition-transform duration-200" : ""
        )}>
          {title}
        </h3>

        {subtitle && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {subtitle}
          </p>
        )}

        {/* Description */}
        <p className={cn(
          "text-sm text-muted-foreground/80 leading-relaxed",
          isHovered && hoverEffect === 'lift' ? "translate-y-[-4px] transition-transform duration-200" : ""
        )}>
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tags.slice(0, 3).map((tag, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="px-2 py-1 text-xs rounded-md bg-muted/50 border-border"
            >
              {tag}
            </motion.span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-md bg-muted/50 border-border">
              +{tags.length - 3} more
            </span>
          )}
        </div>

        {/* Author and date */}
        <div className={cn(
          "flex items-center gap-2 mt-4 text-sm",
          isHovered && hoverEffect === 'glow' ? "text-primary" : ""
        )}>
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z" stroke="currentColor" strokeWidth="2"/>
            <path d="M17 8l4 4m0 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-muted-foreground">by {author}</span>
        </div>

        {/* Meta stats */}
        <motion.div 
          className={cn(
            "flex items-center gap-4 mt-3 pt-4 border-t border-border/50",
            isHovered && (hoverEffect === 'scale' || hoverEffect === 'lift') ? "translate-y-[-2px]" : ""
          )}
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
              <path d="M18 3l3 3m0 0l3 3m-3-3v15a2 2 0 01-2 2H5a2 2 0 01-2-2V6l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <AnimatedCounter value={views} label="views" />
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
              <path d="M7 11l7-7 7 7m-14 6l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <AnimatedCounter value={likes} label="likes" />
          </div>

          <span className="text-xs text-muted-foreground ml-auto">
            {formattedDate}
          </span>
        </motion.div>
      </div>

      {/* Hover overlay with quick actions */}
      <AnimatePresence>
        {(isHovered && hoverEffect !== false) && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute bottom-6 left-6 right-6 flex items-center justify-between"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div className="flex gap-3">
                {hoverEffect === 'glow' && (
                  <>
                    <Button variant="outline" size="sm" className="gap-2 border-border/50 hover:border-primary/50">
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                        <path d="M19 8l-7 5-7-5V5h14v3z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </Button>
                  </>
                )}
              </div>

              {hoverEffect === 'scale' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-muted-foreground">Share</span>
                  <svg className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" viewBox="0 0 24 24" fill="none">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.25.09-.51.09-.77s-.04-.52-.09-.77l6.11-3.31c.52.47 1.2.77 1.96.77s1.44-.3 1.96-.77l6.11 3.31c-.52.47-1.2.77-1.96.77h-.08zM18 21.5l-6.08-3.37L6 21.5V2.5h6.08l6.08 3.37L24 2.5v19z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </motion.div>
              )}

              {hoverEffect === 'lift' && (
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M8.59 16.59l4.58 4.58L20.5 17l-6-6-2.91 2.91z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </Button>
              )}

              {hoverEffect === 'glow' && (
                <motion.div
                  className="flex items-center gap-3 pl-4 border-l border-border/50"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 10, opacity: 0 }}
                >
                  <Button variant="outline" size="sm" className="gap-2 border-border/50 hover:border-primary/50">
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                      <path d="M19 8l-7 5-7-5V5h14v3z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </Button>
                </motion.div>
              )}

              {hoverEffect !== 'glow' && (
                <div className="flex items-center gap-2 pl-4 border-l border-border/50">
