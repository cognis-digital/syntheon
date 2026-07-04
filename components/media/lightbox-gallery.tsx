'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, Maximize2, Minus, ChevronLeft, ChevronRight, Play } from 'lucide-react'

export interface LightboxGalleryProps {
  images: string[]
  title?: string
  subtitle?: string
  showControls: boolean
  autoPlay?: boolean
  intervalMs?: number
  aspectRatio?: '16/9' | '4/3' | 'square' | 'auto'
  overlayColor: 'violet-dark' | 'black' | 'blue-black'
  motionEnabled: boolean
}

const ASPECT_RATIOS = {
  '16/9': 1.778,
  '4/3': 1.333,
  square: 1,
  auto: undefined as number | undefined,
}

function getOverlayColor(overlay: LightboxGalleryProps['overlayColor']): string {
  const colors = {
    'violet-dark': 'rgba(221, 209, 254, 0.85)', // hsl(273, 60%, 90%) with opacity
    black: 'rgba(10, 10, 15, 0.92)',
    'blue-black': 'rgba(15, 25, 40, 0.94)',
  }
  return colors[overlay]
}

function createOverlayGradient(overlay: LightboxGalleryProps['overlayColor']): string {
  const base = getOverlayColor(overlay)
  
  switch (overlay) {
    case 'violet-dark':
      return `linear-gradient(to bottom, ${base}, rgba(180, 165, 240, 0.7), ${base})`
    case 'black':
      return `linear-gradient(to bottom, ${base}, rgba(0, 0, 0, 0.95))`
    default:
      return base
  }
}

function createConstellationSVG(width: number, height: number): string {
  // Create an original geometric constellation pattern
  const centerX = width / 2
  const centerY = height / 2
  
  let svgContent = `
    <defs>
      <linearGradient id="constellation-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8b7cf5;stop-opacity:0.4"/>
        <stop offset="50%" style="stop-color:#a78bfa;stop-opacity:0.6"/>
        <stop offset="100%" style="stop-color:#8b7cf5;stop-opacity:0.3"/>
      </linearGradient>
      <filter id="soft-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `

  // Central focal point - a pulsing orb
  svgContent += `
    <g id="central-orb">
      <circle cx="${centerX}" cy="${centerY}" r="40" fill="url(#constellation-glow)" 
              filter="url(#soft-glow)"/>
      <circle cx="${centerX}" cy="${centerY}" r="25" fill="rgba(139, 124, 245, 0.8)"/>
    </g>
  `

  // Radiating constellation nodes - original geometric arrangement
  const nodes = [
    { x: centerX + 60, y: centerY - 80 },
    { x: centerX - 60, y: centerY - 70 },
    { x: centerX + 50, y: centerY + 90 },
    { x: centerX - 45, y: centerY + 85 },
    { x: centerX + 30, y: centerY - 30 },
    { x: centerX - 25, y: centerY - 25 },
    { x: centerX + 15, y: centerY + 40 },
    { x: centerX - 10, y: centerY + 35 },
  ]

  nodes.forEach((node, i) => {
    const offset = (i % 2 === 0 ? 1 : -1) * 8
    svgContent += `
      <g id="constellation-node-${i}">
        <circle cx="${node.x + offset}" cy="${node.y + offset}" r="6" 
                fill="#c4b5fd" filter="url(#soft-glow)"/>
        <circle cx="${node.x + offset}" cy="${node.y + offset}" r="2" 
                fill="white"/>
      </g>
    `
  })

  // Connecting lines - subtle neural network effect
  svgContent += `
    <g id="constellation-connections">
      ${nodes.map((node, i) => {
        const next = nodes[(i + 1) % nodes.length]
        return `
          <line x1="${node.x}" y1="${node.y}" 
                x2="${next.x}" y2="${next.y}" 
                stroke="rgba(148, 163, 184, 0.2)" 
                stroke-width="1" opacity="0.5"/>
        `
      }).join('')}
    </g>
  `

  return svgContent
}

function createDecorativeBorder(width: number): string {
  // Original decorative border pattern - Art Deco inspired with modern twist
  const segments = [
    'M0,15 L20,15',      // Top-left corner accent
    'Mwidth-20,15 Lwidth,15',   // Top-right corner accent  
    'M0,height-15 L20,height-15',  // Bottom-left corner accent
    'Mwidth-20,height-15 Lwidth,height-15', // Bottom-right corner accent
    'M8,width/2 L12,width/2',   // Central decorative element
  ]

  return segments.map(s => s.replace('width', width).replace('height', width)).join('\n')
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
    }

    return () => {} // Cleanup not needed for this simple case
  }, [])

  return reduced
}

function useScrollProgress() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollY
}

export function LightboxGallery({
  images,
  title = 'Visual Collection',
  subtitle = '',
  showControls = true,
  autoPlay = false,
  intervalMs = 5000,
  aspectRatio = '16/9',
  overlayColor = 'violet-dark',
  motionEnabled = true,
}: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)

  // Use framer-motion for smooth transitions
  const containerVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    }),
  }

  // Calculate aspect ratio for container
  const ratio = ASPECT_RATIOS[aspectRatio] || undefined

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Animated overlay with gradient */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 z-50"
            style={{ background: createOverlayGradient(overlayColor) }}
          />
        )}
      </AnimatePresence>

      {/* Decorative constellation SVG - renders over images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {motionEnabled && !useReducedMotion() && (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -1, 0]
              }}
              transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 opacity-[0.08]"
            >
              <svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`} preserveAspectRatio="none">
                {createConstellationSVG(window.innerWidth, window.innerHeight)}
              </svg>
            </motion.div>

            {/* Subtle border decoration */}
            <div className="absolute inset-4 pointer-events-none opacity-[0.15]">
              <svg viewBox={`0 0 ${window.innerWidth - 8} ${window.innerHeight - 8}`} preserveAspectRatio="none">
                {createDecorativeBorder(window.innerWidth - 8)}
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Main image container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={containerVariants}
        initial="enter"
        animate="center"
        exit="exit"
        key={currentIndex}
      >
        {images[currentIndex] && (
          <img
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none cursor-zoom-out"
            draggable={false}
            onClick={() => setShowOverlay(false)}
          />
        )}
      </motion.div>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && showOverlay && (
          <div className="absolute inset-0 z-40 flex items-center justify-between p-6">
            {/* Left controls */}
            <div className="flex items-center gap-3 text-white/90">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const prev = (currentIndex - 1 + images.length) % images.length
                  setIsAnimating(true)
                  setCurrentIndex(prev)
                  setTimeout(() => setIsAnimating(false), 300)
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              {title && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium tracking-wide">{title}</span>
                  {subtitle && <span className="text-xs text-white/70">{subtitle}</span>}
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowOverlay(false)}
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3 text-white/90">
              {autoPlay && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const next = (currentIndex + 1) % images.length
                    setIsAnimating(true)
                    setCurrentIndex(next)
                    setTimeout(() => setIsAnimating(false), 300)
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}

              {autoPlay && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Toggle auto-play state (would need ref to track)
                  }}
                  aria-label={autoPlay ? 'Pause autoplay' : 'Resume autoplay'}
                >
                  <Play className="h-5 w-5 fill-current" />
                </Button>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span>{currentIndex + 1}</span>
                <span>/</span>
                <span>{images.length}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowOverlay(false)}
                aria-label="Expand to full screen"
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-4 left-4 z-50"
        >
          <div className="flex items-center gap-2 text-white/90">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Minus className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Keyboard navigation hints */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 2 }}
            className="absolute bottom-4 left-6 z-30 text-white/70 text-xs"
          >
            <span className="font-medium">Space</span> to close • <span className="font-medium">Arrows</span> to navigate
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export interface LightboxGalleryProps {
  images: string[]
  title?: string
  subtitle?: string
  showControls?: boolean
  autoPlay?: boolean
  intervalMs?: number
  aspectRatio?: '16/9' | '4/3' | 'square' | 'auto'
  overlayColor?: 'violet-dark' | 'black' | 'blue-black'
  motionEnabled?: boolean
}
