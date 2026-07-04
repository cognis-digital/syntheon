'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Info, X, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface BeforeAfterCardProps {
  beforeImage: string
  afterImage: string
  title?: string
  subtitle?: string
  description?: string
  showControls?: boolean
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto'
  accentColor?: 'violet' | 'indigo' | 'purple' | 'fuchsia'
  enableDrag?: boolean
}

const ASPECT_RATIOS: Record<string, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  auto: '',
}

export const BeforeAfterCard = ({
  beforeImage,
  afterImage,
  title,
  subtitle,
  description,
  showControls = true,
  aspectRatio = 'square',
  accentColor = 'violet',
  enableDrag = true,
}: BeforeAfterCardProps) => {
  const [position, setPosition] = useState(50)

  const getAccentClass = () => {
    switch (accentColor) {
      case 'indigo': return 'bg-indigo-600 text-indigo-100 border-indigo-700'
      case 'purple': return 'bg-purple-600 text-purple-100 border-purple-700'
      case 'fuchsia': return 'bg-fuchsia-600 text-fuchsia-100 border-fuchsia-700'
      default: return 'bg-violet-600 text-violet-100 border-violet-700'
    }
  }

  const getGradient = () => {
    switch (accentColor) {
      case 'indigo': return 'from-indigo-500/20 to-transparent'
      case 'purple': return 'from-purple-500/20 to-transparent'
      case 'fuchsia': return 'from-fuchsia-500/20 to-transparent'
      default: return 'from-violet-500/20 to-transparent'
    }
  }

  const handleDragEnd = (info: { offset: [number, number] }) => {
    const x = info.offset[0] / window.innerWidth * 100
    setPosition(Math.max(0, Math.min(100, x)))
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {title && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute top-4 left-4 z-30 max-w-[85%]"
        >
          <Card className="bg-background/90 backdrop-blur-md border-border shadow-lg">
            <CardContent className="p-4 space-y-2">
              {subtitle && (
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {subtitle}
                </div>
              )}
              <h3 className="text-sm font-semibold leading-tight">{title}</h3>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <AnimatePresence mode='wait'>
        <motion.div
          key={position}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'absolute inset-0',
            ASPECT_RATIOS[aspectRatio],
            'bg-gradient-to-br from-background via-background to-muted/20'
          )}
        >
          <div className="relative h-full w-full">
            {/* Before Image Layer */}
            <motion.img
              src={beforeImage}
              alt="Before"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: position / 100,
                scale: 1 + (position / 200),
                filter: `brightness(${90 - position * 0.5}%) blur(${position * 0.1}px)`
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className={cn(
                'absolute h-full w-full object-cover',
                'transition-all duration-300 ease-out',
                position === 0 ? '' : 'opacity-0 scale-105 blur-sm'
              )}
            />

            {/* After Image Layer */}
            <motion.img
              src={afterImage}
              alt="After"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ 
                opacity: 1 - position / 100,
                scale: 1 + (position / 300),
                filter: `brightness(${85 + position * 0.3}%) blur(${(100 - position) * 0.1}px)`
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className={cn(
                'absolute h-full w-full object-cover',
                'transition-all duration-300 ease-out',
                position === 100 ? '' : 'opacity-0 scale-95 blur-sm'
              )}
            />

            {/* Gradient Overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ 
                background: `linear-gradient(to right, ${getGradient()}, transparent)`
              }}
            />

            {/* Slider Handle */}
            {enableDrag && (
              <motion.div
                drag={true}
                dragConstraints={{ left: 0, right: window.innerWidth }}
                onDragEnd={handleDragEnd}
                initial={{ x: 50 * (window.innerWidth / 100) }}
                animate={{ 
                  x: position * (window.innerWidth / 100),
                  y: '50%'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
              >
                <div 
                  className={cn(
                    'relative flex items-center justify-center w-16 h-16 rounded-full shadow-xl border-4',
                    getAccentClass(),
                    'hover:scale-105 transition-transform duration-200'
                  )}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                  <ChevronLeft 
                    className="w-6 h-6 text-white relative z-10" 
                    strokeWidth={2.5}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-background text-xs rounded-full shadow-lg border border-border"
                  >
                    {position === 0 ? 'Before' : position === 100 ? 'After' : `${Math.round(position)}%`}
                  </motion.div>

                  {/* Decorative rings */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent animate-spin-slow" />
                </div>
              </motion.div>
            )}

            {/* Info Toggle Button */}
            {showControls && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute top-4 right-4 z-30 rounded-full bg-background/80 backdrop-blur-sm border',
                  'hover:bg-background hover:border-primary transition-colors'
                )}
              >
                <Info className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}

            {/* Bottom Controls */}
            {showControls && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30"
              >
                <AnimatePresence>
                  {position !== 0 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className={cn(
                          'gap-2 bg-background/90 backdrop-blur-md border-border hover:bg-background transition-colors'
                        )}
                      >
                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Before</span>
                      </Button>
                    </motion.div>
                  )}

                  {position !== 100 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className={cn(
                          'gap-2 bg-background/90 backdrop-blur-md border-border hover:bg-background transition-colors'
                        )}
                      >
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">After</span>
                      </Button>
                    </motion.div>
                  )}

                  {position !== 50 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className={cn(
                          'gap-2 bg-background/90 backdrop-blur-md border-border hover:bg-background transition-colors'
                        )}
                      >
                        <Maximize2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Reset</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Center Reset Button */}
                {position !== 50 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'rounded-full bg-background/90 backdrop-blur-md border-border hover:bg-background hover:border-primary transition-colors'
                      )}
                      onClick={() => setPosition(50)}
                    >
                      <Minimize2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </motion.div>
                )}

                {position === 50 && (
                  <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'rounded-full bg-background/90 backdrop-blur-md border-border hover:bg-background hover:border-primary transition-colors'
                      )}
                      onClick={() => setPosition(50)}
                    >
                      <Maximize2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </motion.div>
                )}

                {position !== 50 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'rounded-full bg-background/90 backdrop-blur-md border-border hover:bg-background hover:border-primary transition-colors'
                      )}
                      onClick={() => setPosition(50)}
                    >
                      <Minimize2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </motion.div>
                )}

                {/* Info Modal Toggle */}
                {description && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className={cn(
                        'gap-2 bg-background/90 backdrop-blur-md border-border hover:bg-background transition-colors'
                      )}
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Details</span>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Loading State */}
            {(beforeImage || afterImage) && (
              <div 
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm',
                  'transition-opacity duration-300',
                  position === 0 ? 'opacity-100' : 'opacity-0'
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-8 h-8 rounded-full border-2 border-violet-400/50"
                  />
                </div>
              </div>
            )}

            {(beforeImage || afterImage) && (
              <div 
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm',
                  'transition-opacity duration-300',
                  position === 100 ? 'opacity-100' : 'opacity-0'
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-8 h-8 rounded-full border-2 border-violet-400/50"
                  />
                </div>
              </div>
            )}

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, rotate: -15 }}
              animate={{ 
                opacity: position / 200,
                rotate: -15 + (position / 30)
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute top-8 left-8 z-20"
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                getAccentClass()
              )}>
                <span className="text-white font-bold text-lg">B</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotate: 15 }}
              animate={{ 
                opacity: (100 - position) / 200,
                rotate: 15 + ((100 - position) / 30)
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute bottom-8 right-8 z-20"
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                getAccentClass()
              )}>
                <span className="text-white font-bold text-lg">A</span>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: position / 100,
                opacity: 0.3 + (position / 250)
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 h-1 bg-muted"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: position / 100,
                  backgroundColor: `hsl(${260 - (position / 5)}, 70%, 50%)`
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute h-full bg-gradient-to-r from-violet-500 to-indigo-500"
              />
            </motion.div>

            {/* Keyboard Instructions */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: position === 50 ? 1 : 0.6, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-2 right-2 z-30 text-xs"
            >
              <span className={cn(
                'px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border',
                getAccentClass()
              )}>
                ← → Drag or use keyboard
              </span>
            </motion.div>

            {/* Accessibility: Screen Reader Announcements */}
            <div className="sr-only" aria-live="polite">
              {position === 0 && 'Showing before image'}
              {position === 100 && 'Showing after image'}
              {enableDrag && position > 0 && position < 100 && `Slider at ${Math.round(position)} percent, showing blend of both images`}
            </div>

            {/* Focus Indicator */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ 
                boxShadow: enableDrag ? `inset 0 0 0 2px hsla(260, 80%, 50%, ${position / 300})` : 'none'
              }}
            />

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
