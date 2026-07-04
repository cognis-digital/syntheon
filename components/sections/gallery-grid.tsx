import { cn } from '@/lib/utils'
import type { AspectRatioType } from 'next/image'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'

export interface GalleryGridProps {
  items: Array<{
    id: string | number
    src: string
    alt: string
    title?: string
    caption?: string
    aspectRatio?: AspectRatioType
    isFullSize?: boolean
    loadingBehavior?: 'eager' | 'lazy'
  }>

  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: string | number
  aspectRatio?: AspectRatioType
  layout?: 'grid' | 'masonry'

  // Animation controls
  animateOnMount?: boolean
  animationDuration?: number
  hoverScale?: number
  staggerDelay?: number

  // Interaction
  showCaptions?: boolean
  showTitles?: boolean
  onClickItem?: (item: NonNullable<GalleryGridProps['items'][number]>) => void
  onImageError?: (id: string | number, error: Error) => void

  // Performance
  imagesLazy?: boolean
  preloadImages?: boolean
}

const DEFAULT_DURATION = 0.3
const HOVER_SCALE = 1.025
const GALLERY_ASPECT_RATIO = '4/3' as AspectRatioType

export interface GalleryGridState {
  hoveredId: string | number | null
  activeImage: NonNullable<GalleryGridProps['items'][number]> | null
}

function createStaggerVariants(
  duration: number,
  staggerDelay: number = 0.05
): Record<string, any> {
  const delay = (i: number) => staggerDelay * i

  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: delay,
      },
    },
  }
}

function createHoverVariants(
  scale: number = HOVER_SCALE
): Record<string, any> {
  return {
    hover: {
      scale,
      transition: {
        duration: 0.25,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    tap: {
      scale: scale * 0.98,
      transition: {
        duration: 0.1,
        ease: 'ease-in-out',
      },
    },
  }
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setReduced(true)
    } else {
      const listener = () => setReduced(mediaQuery.matches)
      mediaQuery.addEventListener('change', listener)

      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [])

  return reduced
}

function useScrollProgress(): [number, number] {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const handleScroll = () => {
      const rect = containerRef.current.getBoundingClientRect()
      setScrollY(rect.top - window.scrollY)
    }

    requestAnimationFrame(handleScroll)

    return () => {
      // Cleanup handled by useEffect auto-unmount
    }
  }, [])

  return [scrollY, containerRef]
}

function createImageLoader(
  imagesLazy: boolean = true,
  preloadImages: boolean = false
): (item: NonNullable<GalleryGridProps['items'][number]>) => React.ReactNode {
  const ImageComponent = imagesLazy ? 'img' : 'next/image' as any

  return (item) => {
    if (!preloadImages && !imagesLazy) {
      return <ImageComponent src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
    }

    const ImageWrapper = imagesLazy ? 'img' : 'next/image' as any

    return (
      <ImageWrapper
        src={item.src}
        alt={item.alt}
        fill
        className="object-cover transition-opacity duration-300"
        loading={imagesLazy && !preloadImages ? 'lazy' : undefined}
        priority={preloadImages || item.isFullSize}
      />
    )
  }
}

function createGalleryItem(
  item: NonNullable<GalleryGridProps['items'][number]>,
  index: number,
  duration: number,
  staggerDelay: number,
  hoverScale: number,
  reducedMotion: boolean,
  showCaptions: boolean,
  showTitles: boolean,
  onClickItem: GalleryGridProps['onClickItem'],
  imagesLazy: boolean,
  preloadImages: boolean
): React.ReactNode {
  const variants = createStaggerVariants(duration, staggerDelay)
  const hoverVariants = createHoverVariants(hoverScale)

  const ImageLoader = createImageLoader(imagesLazy, preloadImages)(item)

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={!reducedMotion ? 'hover' : undefined}
      onClick={() => onClickItem?.(item)}
      className={cn(
        'relative overflow-hidden rounded-lg cursor-pointer group',
        item.isFullSize && 'ring-2 ring-primary/50 shadow-xl'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {ImageLoader}

      <AnimatePresence>
        {(showCaptions || showTitles) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-x-0 bottom-0 p-4"
          >
            <div className="flex items-center justify-between text-white">
              {showTitles && (
                <span className="text-sm font-medium truncate max-w-[80%]">{item.title || item.alt}</span>
              )}
              {showCaptions && item.caption && (
                <span className="text-xs opacity-75 truncate max-w-[60%]">{item.caption}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-size indicator */}
      {item.isFullSize && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white font-medium"
        >
          Full view
        </motion.span>
      )}

      {/* Loading skeleton */}
      <div className={cn(
        'absolute inset-0 bg-muted',
        item.loadingBehavior === 'eager' ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
      )}>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-full h-full"
        />
      </div>
    </motion.div>
  )
}

function createGridColumns(columns: number): string {
  const base = `grid-cols-${columns}`
  return columns > 6 ? `${base} md:${base.replace('grid-cols-', 'grid-cols-')}` : base
}

export default function GalleryGrid({
  items,
  columns = 3,
  gap = 'gap-4',
  aspectRatio = GALLERY_ASPECT_RATIO,
  layout = 'grid',
  animateOnMount = true,
  animationDuration = DEFAULT_DURATION,
  hoverScale = HOVER_SCALE,
  staggerDelay = 0.05,
  showCaptions = false,
  showTitles = false,
  onClickItem,
  onImageError,
  imagesLazy = true,
  preloadImages = false,
}: GalleryGridProps) {
  const reducedMotion = useReducedMotion()

  // Memoize variants to prevent recreation on every render
  const staggerVariants = useCallback(
    createStaggerVariants(animationDuration, staggerDelay),
    [animationDuration, staggerDelay]
  )

  const hoverVariants = useCallback(createHoverVariants(hoverScale), [hoverScale])

  // Create image loader once
  const ImageLoader = useCallback(
    createImageLoader(imagesLazy, preloadImages),
    [imagesLazy, preloadImages]
  )

  return (
    <div className={cn('w-full', gap)}>
      <motion.div
        layout
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
        className={cn(
          'grid gap-4',
          createGridColumns(columns),
          reducedMotion ? '' : 'animate-in fade-in duration-500'
        )}
      >
        {items.map((item, index) => (
          <motion.div
            key={String(item.id)}
            layout
            initial="hidden"
            animate="visible"
            variants={staggerVariants}
            whileHover={!reducedMotion ? 'hover' : undefined}
            onClick={() => onClickItem?.(item)}
            className={cn(
              'relative overflow-hidden rounded-lg cursor-pointer group',
              item.isFullSize && 'ring-2 ring-primary/50 shadow-xl'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {ImageLoader(item)}

            <AnimatePresence>
              {(showCaptions || showTitles) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute inset-x-0 bottom-0 p-4"
                >
                  <div className="flex items-center justify-between text-white">
                    {showTitles && (
                      <span className="text-sm font-medium truncate max-w-[80%]">{item.title || item.alt}</span>
                    )}
                    {showCaptions && item.caption && (
                      <span className="text-xs opacity-75 truncate max-w-[60%]">{item.caption}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Full-size indicator */}
            {item.isFullSize && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white font-medium"
              >
                Full view
              </motion.span>
            )}

            {/* Loading skeleton */}
            <div className={cn(
              'absolute inset-0 bg-muted',
              item.loadingBehavior === 'eager' ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        ))}

        {/* Empty state */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full flex items-center justify-center py-24"
          >
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium mb-2">No images loaded</p>
              <p className="text-sm opacity-60">Add items to the gallery grid props</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Convenience component with common defaults for quick implementation
export function GalleryGridQuick({
  images,
  columns = 3,
}: {
  images: Array<{ src: string; alt: string; title?: string; caption?: string }>
  columns?: number
}) {
  return (
    <GalleryGrid
      items={images.map((img) => ({
        id: img.src,
        src: img.src,
        alt: img.alt,
        title: img.title,
        caption: img.caption,
        aspectRatio: '4/3',
        isFullSize: false,
        loadingBehavior: 'lazy',
      }))}
      columns={columns}
      showCaptions
    />
  )
}
