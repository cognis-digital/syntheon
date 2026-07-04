'use client'

import { cn } from '@/lib/utils'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { Play, Share2, Maximize2, Volume2, VolumeX, Pause, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VideoEmbedSectionProps {
  videoUrl: string
  title: string
  description?: string
  thumbnailUrl?: string
  showControls?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

export interface VideoEmbedSectionPropsInterface extends VideoEmbedSectionProps {}

export default function VideoEmbedSection({
  videoUrl,
  title = 'Watch the presentation',
  description = '',
  thumbnailUrl,
  showControls = true,
  autoplay = false,
  loop = false,
  muted = false,
}: VideoEmbedSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)

  const { scrollY } = useScroll()
  const isInView = useInView(containerRef, { once: true })

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ 
          opacity: isInView ? 0.7 : 0, 
          scale: 1,
          backgroundColor: 'hsl(265, 80%, 9%)'
        }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="absolute inset-0 z-0"
      />

      {/* Parallax gradient orbs */}
      <motion.div
        animate={{ 
          x: scrollY * 0.05,
          y: scrollY * 0.03,
          scale: isInView ? 1 : 0.8
        }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute -left-40 top-20 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
      />
      <motion.div
        animate={{ 
          x: scrollY * -0.03,
          y: scrollY * 0.05,
          scale: isInView ? 1 : 0.8
        }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        className="absolute -right-40 bottom-20 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[100px]"
      />

      {/* Content container */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ 
          opacity: isInView ? 1 : 0.8, 
          y: isInView ? 0 : 40,
          scale: 1 + (isInView ? 0.02 : 0)
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-5xl mx-auto px-4"
      >
        {/* Title and description */}
        <div className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: isInView ? 1 : 0.9, y: isInView ? 0 : -20 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
          >
            {title}
          </motion.h2>

          <AnimatePresence>
            {description && (
              <motion.p
                initial={{ opacity: 0, y: -15 }}
                animate={{ 
                  opacity: isInView ? 1 : 0.8, 
                  y: isInView ? 0 : -10,
                  filter: 'blur(4px)'
                }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                {description}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Social actions */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button variant="outline" size="sm" className="gap-2 border-border/50 hover:bg-primary/10">
              <Share2 className="w-4 h-4 text-muted-foreground" />
              Share
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-primary/10"
            >
              {showControls ? (
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
              )}
            </Button>
          </div>
        </div>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isInView ? 1 : 0.9, 
            scale: isInView ? 1 : 0.98,
            y: isHovered ? -4 : 0,
            boxShadow: isHovered 
              ? '0 25px 50px -12px rgba(139, 92, 246, 0.25)' 
              : '0 20px 40px -12px rgba(0, 0, 0, 0.3)',
            borderRadius: isHovered ? '2rem' : '1.5rem',
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-video bg-background rounded-2xl overflow-hidden border border-border/50 shadow-2xl"
        >
          {/* Thumbnail or video */}
          <div 
            className={cn(
              'absolute inset-0 flex items-center justify-center cursor-pointer group',
              thumbnailUrl ? 'bg-cover bg-center' : 'bg-muted/30'
            )}
            style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined}
          >
            {/* Video element */}
            <video
              className="absolute inset-0 w-full h-full object-contain"
              src={videoUrl}
              loop={loop}
              muted={muted}
              playsInline
              autoPlay={autoplay}
              controls={showControls}
              poster={thumbnailUrl}
            />

            {/* Custom play button overlay */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isHovered ? 1 : 0.95, 
                opacity: isHovered ? 1 : 0.7,
                x: [0, -3, 3, -3, 3, 0],
                y: [0, -2, 2, -2, 2, 0]
              }}
              transition={{ 
                scale: { duration: 0.4 },
                opacity: { duration: 0.3 },
                x: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
              }}
              className={cn(
                'absolute inset-0 flex items-center justify-center',
                isHovered ? '' : 'opacity-0 pointer-events-none'
              )}
            >
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ 
                  scale: [1.2, 1], 
                  opacity: 1,
                  backgroundColor: 'hsl(265, 80%, 9%)'
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-full p-6 bg-primary/80 backdrop-blur-sm shadow-2xl border border-white/20"
              >
                <Play className="w-12 h-12 text-primary-foreground fill-current" />
              </motion.div>

              {/* Ripple effect */}
              <AnimatePresence>
                {isHovered && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-full border-4 border-white/30"
                    />
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      className="absolute inset-0 rounded-full border-4 border-white/30"
                    />
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Hover overlay with controls */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                >
                  {/* Volume controls */}
                  <motion.div 
                    initial={{ x: -15, y: -15, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="absolute top-4 left-4 flex items-center gap-2"
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-primary/10"
                    >
                      {muted ? (
                        <VolumeX className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>

                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [1, 0.95, 1], 
                        opacity: 1,
                        x: [0, -2, 2, -2, 2, 0]
                      }}
                      transition={{ 
                        scale: { duration: 0.4 },
                        x: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      className="rounded-full p-3 bg-primary/80 backdrop-blur-sm border border-white/20 shadow-lg"
                    >
                      <Play className="w-5 h-5 text-primary-foreground fill-current" />
                    </motion.button>
                  </motion.div>

                  {/* Loading indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border border-border"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Default thumbnail overlay */}
            {!thumbnailUrl && !isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-3"
                >
                  <div 
                    className="rounded-full p-5 bg-primary/80 backdrop-blur-sm shadow-xl border border-white/20 cursor-pointer hover:bg-primary transition-colors group-hover:scale-110 duration-300"
                  >
                    <Play className="w-8 h-8 text-primary-foreground fill-current" />
                  </div>

                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-sm text-muted-foreground"
                  >
                    Click to play
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isInView ? 1 : 0.7, 
            scale: isInView ? 1 : 0.9,
            x: [0, -5, 5, -5, 5, 0],
            y: [0, -3, 3, -3, 3, 0]
          }}
          transition={{ 
            opacity: { duration: 0.6 },
            scale: { duration: 0.8 },
            x: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isInView ? 1 : 0.7, 
            scale: isInView ? 1 : 0.9,
            x: [0, 5, -5, 5, -5, 0],
            y: [0, 3, -3, 3, -3, 0]
          }}
          transition={{ 
            opacity: { duration: 0.6 },
            scale: { duration: 0.8 },
            x: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Reduced motion preference */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .video-section-animate {
            transition-duration: 0.2s !important;
            animation-duration: 1s !important;
          }
        }
      `}</style>
    </section>
  )
}
