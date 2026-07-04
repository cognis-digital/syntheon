'use client'

import { cn } from '@/lib/utils'
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react'

interface GalleryItemProps {
  src: string
  alt: string
  title?: string
  description?: string
  className?: string
}

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduced(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(prefers-reduced-animations: reduce)').matches
      )
    }
  }, [])

  return reduced
}

const createMasonryGrid = (items: GalleryItemProps[], columns: number) => {
  const totalHeight = items.reduce((sum, item) => sum + item.height || 300, 0)
  
  return items.map((item, index) => ({
    ...item,
    offsetTop: (index % columns) * 24,
    height: item.height || 300,
    key: `${item.src}-${index}`,
  }))
}

export interface ImageGalleryMasonryProps {
  items: GalleryItemProps[]
  columns?: number
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto'
  loadingImage?: string
  emptyState?: { title: string; description: string }
  className?: string
}

const defaultEmpty = {
  title: 'No images found',
  description: 'Try adjusting your filters or upload some content.',
}

export const ImageGalleryMasonry = ({
  items,
  columns = 3,
  aspectRatio = 'auto',
  loadingImage,
  emptyState = defaultEmpty,
  className,
}: ImageGalleryMasonryProps) => {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (containerRef.current && items.length > 0) {
      const totalHeight = items.reduce((sum, item) => sum + (item.height || 300), 0)
      containerRef.current.style.height = `${totalHeight}px`
    }
  }, [items])

  const handleImageLoad = useCallback((src: string) => {
    setLoadedImages(prev => ({ ...prev, [src]: true }))
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden bg-background',
        reducedMotion ? '' : 'transition-all duration-500 ease-out',
        className
      )}
    >
      {items.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">{emptyState.title}</p>
          <p className="text-sm opacity-70">{emptyState.description}</p>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Animated background pattern */}
          <motion.div
            initial={{ x: '-100%', y: '-100%' }}
            animate={{ 
              x: ['0%', '20%'], 
              y: ['0%', '30%'] 
            }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
          >
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </motion.div>

          {/* Gallery items */}
          <div className={cn(
            'relative z-10 p-4',
            reducedMotion ? '' : 'transition-all duration-500'
          )}>
            {items.map((item, index) => (
              <MasonryItem
                key={`${item.src}-${index}`}
                item={item}
                aspectRatio={aspectRatio}
                loaded={loadedImages[item.src]}
                onLoad={() => handleImageLoad(item.src)}
              />
            ))}
          </div>

          {/* Decorative corner accents */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-4 left-4 z-20"
          >
            <div className={cn(
              'h-8 w-8 rounded-full border-2',
              reducedMotion ? '' : 'animate-spin-slow'
            )}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="h-full w-full rounded-full"
              >
                <div className={cn(
                  'h-8 w-8 rounded-full border-4',
                  reducedMotion ? '' : 'animate-pulse-slow'
                )} />
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-4 left-8 z-20"
          >
            <div className={cn(
              'h-1 w-16 rounded-full',
              reducedMotion ? '' : 'animate-shimmer'
            )} />
          </motion.div>
        </>
      )}
    </div>
  )
}

const MasonryItem = ({ 
  item, 
  aspectRatio, 
  loaded, 
  onLoad 
}: { 
  item: GalleryItemProps & { offsetTop?: number; height?: number }; 
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'auto';
  loaded: boolean;
  onLoad: () => void;
}) => {
  const [hovered, setHovered] = useState(false)
  
  // Calculate aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square'
      case 'portrait': return 'aspect-[3/4]'
      case 'landscape': return 'aspect-[4/3]'
      default: 
        if (!item.height) return ''
        const ratio = item.height / 600
        return `aspect-[${ratio < 1 ? `${Math.round(ratio * 20)}/20` : `20/${Math.round(600 / (ratio * 20))}`}]`
    }
  }

  // Animation variants with reduced motion support
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    },
    hovered: { scale: 1.02, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      layoutId={item.alt}
      variants={containerVariants}
      initial="hidden"
      animate={hovered ? 'hovered' : 'visible'}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-xl bg-muted/50',
        getAspectRatioClass(),
        reducedMotion ? '' : 'transition-transform duration-300'
      )}
    >
      {/* Image container with loading state */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingTop: item.offsetTop || 0 }}
      >
        {loaded ? (
          <motion.img
            src={item.src}
            alt={item.alt}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover"
            onLoad={onLoad}
          />
        ) : (
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin-slow" />
        )}

        {/* Gradient overlay for hover effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: hovered ? 0.6 : 0,
            transition: { duration: 0.3 }
          }}
          className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
        />

        {/* Hover overlay with metadata */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-end p-4"
            >
              <div className={cn(
                'flex gap-2',
                reducedMotion ? '' : 'animate-slide-up'
              )}>
                {item.title && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium text-foreground"
                  >
                    {item.title}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}

          {/* Loading indicator */}
          {!loaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm"
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                reducedMotion ? '' : 'animate-pulse'
              )}>
                <Loader2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative corner markers */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: hovered ? 1 : 0.8,
            opacity: hovered ? 1 : 0.5,
            transition: { duration: 0.3 }
          }}
          className="absolute top-2 left-2 z-20"
        >
          <div className={cn(
            'h-4 w-4 rounded-full border-2',
            reducedMotion ? '' : 'animate-spin-slow'
          )}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="h-4 w-4 rounded-full"
            >
              <div className={cn(
                'h-4 w-4 rounded-full border-2',
                reducedMotion ? '' : 'animate-pulse-slow'
              )} />
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: hovered ? 1 : 0.5,
            opacity: hovered ? 1 : 0.3,
            transition: { duration: 0.3 }
          }}
          className="absolute bottom-2 left-4 z-20"
        >
          <div className={cn(
            'h-1 w-8 rounded-full',
            reducedMotion ? '' : 'animate-shimmer'
          )} />
        </motion.div>

        {/* Sparkle effect on hover */}
        {hovered && !reducedMotion && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: 1.2,
              transition: { duration: 0.8 }
            }}
            className="absolute -top-4 -right-4 z-30"
          >
            <Sparkles className="h-5 w-5 text-primary/60 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
          </motion.div>
        )}
      </div>

      {/* Caption overlay (always visible when hovered) */}
      <AnimatePresence>
        {hovered && item.description && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px]"
          >
            <div className={cn(
              'max-w-full px-6 py-4 text-center',
              reducedMotion ? '' : 'animate-fade-in'
            )}>
              <p className="text-sm font-medium text-foreground">
                {item.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick actions overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[4px]"
          >
            <div className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full',
              reducedMotion ? '' : 'animate-scale-in'
            )}>
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {!loaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-background/20"
        >
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            reducedMotion ? '' : 'animate-pulse'
          )}>
            <Loader2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// CSS Animations (injected via style tag)
const injectAnimations = () => {
  const styles = `
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse-slow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(300%); }
    }
    
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .animate-spin-slow {
      animation: spin-slow 4s linear infinite;
    }
    
    .animate-pulse-slow {
      animation: pulse-slow 2s ease-in-out infinite;
    }
    
    .animate-shimmer {
      animation: shimmer 1.5s ease-in-out infinite;
    }
    
    .animate-slide-up {
      animation: slide-up 0.4s ease-out forwards;
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }
    
    .animate-scale-in {
      animation: scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `

  if (!document.getElementById('gallery-animations')) {
    const style = document.createElement('style')
    style.id = 'gallery-animations'
    style.textContent = styles
    document.head.appendChild(style)
  }
}

// Initialize animations on mount
if (typeof window !== 'undefined') {
  injectAnimations()
}
