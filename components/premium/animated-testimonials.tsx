'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export interface TestimonialProps {
  name: string
  role: string
  content: string
  avatarUrl?: string
  rating?: number
  verified?: boolean
}

const testimonialsData: TestimonialProps[] = [
  {
    name: 'Alexandra Chen',
    role: 'VP Engineering, TechFlow',
    content:
      'The design system transformed our entire product. The violet palette is stunning and the motion feels incredibly premium.',
    avatarUrl: '/avatars/alexandra.jpg',
    rating: 5,
    verified: true,
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Designer, Studio North',
    content:
      'Finally a component library that understands motion. The staggered reveals and layout transitions are silky smooth.',
    avatarUrl: '/avatars/marcus.jpg',
    rating: 5,
    verified: true,
  },
  {
    name: 'Sofia Rodriguez',
    role: 'CTO, Innovate Labs',
    content:
      'The attention to accessibility details is remarkable. Motion is properly gated and the focus states are perfect.',
    avatarUrl: '/avatars/sofia.jpg',
    rating: 5,
    verified: true,
  },
]

const variants = {
  container: {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  },
  card: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
}

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
    }

    return () => {}
  }, [])

  return reduced
}

export const AnimatedTestimonials = ({
  testimonials = testimonialsData,
}: {
  testimonials?: TestimonialProps[]
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [reducedMotion, testimonials.length])

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }
  }, [isAnimating])

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      setDirection(-1)
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }, [isAnimating])

  return (
    <div className="relative w-full max-w-4xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Testimonials
          </span>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-violet-400 to-purple-300 bg-clip-text text-transparent pb-4">
          What people are saying
        </h2>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Don't just take our word for it. See what industry leaders have to say about working with us.
        </p>
      </motion.div>

      <div className="relative min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode='wait'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                key={index}
                variants={variants.container}
                initial="hidden"
                animate="visible"
                custom={index}
                className="w-full max-w-2xl"
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border shadow-2xl shadow-primary/10 overflow-hidden">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      {/* Avatar */}
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="relative flex-shrink-0"
                      >
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border shadow-lg">
                          {testimonial.avatarUrl ? (
                            <img
                              src={testimonial.avatarUrl}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              loading="eager"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center">
                              <span className="text-3xl font-bold text-muted-foreground">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Verified badge */}
                        {testimonial.verified && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="absolute -bottom-2 -right-2 p-2 bg-background rounded-full shadow-lg border border-border"
                          >
                            <Star className="w-4 h-4 text-primary fill-current" />
                          </motion.div>
                        )}

                        {/* Sparkle effect */}
                        {index === 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-4 -right-4"
                          >
                            <Sparkles className="w-6 h-6 text-primary drop-shadow-lg" />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="mb-4 flex items-center justify-center md:justify-start gap-2">
                          <span className="text-xl font-bold bg-gradient-to-r from-primary to-violet-300 bg-clip-text text-transparent">
                            {testimonial.name}
                          </span>
                          {testimonial.verified && (
                            <Badge variant="default" size="sm">
                              Verified
                            </Badge>
                          )}
                        </div>

                        <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-4">
                          "{testimonial.content}"
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {testimonial.role}
                          </span>
                          {testimonial.rating && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center gap-1"
                            >
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{testimonial.rating}/5</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Progress bar */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 bg-muted overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-violet-400 to-purple-300"
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={isAnimating || reducedMotion}
            className="pointer-events-auto bg-background/80 backdrop-blur-sm hover:bg-background border-border shadow-lg rounded-full transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={isAnimating || reducedMotion}
            className="pointer-events-auto bg-background/80 backdrop-blur-sm hover:bg-background border-border shadow-lg rounded-full transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
          {testimonials.map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.4, scale: 0.8 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0.4,
                scale: index === currentIndex ? 1.2 : 0.8,
              }}
              transition={{ duration: 0.3 }}
              className="w-2 h-2 rounded-full bg-muted cursor-pointer pointer-events-auto"
              onClick={() => {
                setDirection(1)
                setCurrentIndex(index)
              }}
            />
          ))}
        </div>

        {/* Background glow effects */}
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute -bottom-20 right-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Scroll indicator */}
        <motion.div
          className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="text-xs text-muted-foreground tracking-wider uppercase">Scroll to discover</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '24px' }}
            transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
            className="w-1 bg-gradient-to-b from-primary to-transparent rounded-full"
          />
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: 'easeOut' }}
        className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
      >
        {[
          { label: 'Happy Clients', value: '500+', icon: <Star className="w-5 h-5 text-primary fill-current" /> },
          { label: 'Awards Won', value: '12', icon: <Sparkles className="w-5 h-5 text-primary" /> },
          { label: 'Years Experience', value: '8+', icon: <div className="text-xl font-bold">⏳</div> },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 + index * 0.1, duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-2 flex items-center justify-center gap-2">
              {stat.icon}
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-violet-300 bg-clip-text text-transparent">
                {stat.value}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// Helper components for cleaner code
const Badge = React.forwardRef<HTMLDivElement, { children: React.ReactNode; variant?: 'default' | 'outline'; size?: 'sm' | 'md' }>(({ children, variant = 'default', size = 'sm' }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium border transition-colors duration-200'

  const variants = {
    default: 'bg-primary/10 text-primary border-transparent hover:bg-primary/20',
    outline: 'bg-background text-muted-foreground border-border hover:border-primary/50',
  }

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  }

  return (
    <div ref={ref} className={cn(baseClasses, variants[variant], sizes[size])}>
      {children}
    </div>
  )
})

Badge.displayName = 'Badge'

// Type declarations for hooks
declare const useState: () => [number, (n: number) => void]
declare const useEffect: (fn: () => (() => void), deps: any[]) => void
declare const useCallback: <T extends (...args: any[]) => any>(fn: T, deps: any[]) => T

// Export types for external use
export type { TestimonialProps }
