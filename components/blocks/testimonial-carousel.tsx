'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export interface TestimonialCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{
    id: string
    content: string
    author: string
    role?: string
    avatar?: string | null
    rating?: number
  }>
  autoplay?: boolean
  autoplayInterval?: number
  infinite?: boolean
  loop?: boolean
  initialSlide?: number
  speed?: number
  showControls?: boolean
  showDots?: boolean
  showIndicators?: boolean
  className?: string
}

export interface TestimonialCarouselState {
  current: number
  isPaused: boolean
  direction: 'forward' | 'backward'
  isLoading: boolean
}

interface TestimonialCarouselContextValue extends TestimonialCarouselState {}

const DEFAULT_ITEMS = [
  {
    id: '1',
    content: "Syntheon completely transformed how we build AI applications. The platform's intuitive interface and powerful features allowed us to launch our MVP in record time.",
    author: "Sarah Chen",
    role: "CTO, TechFlow Inc.",
    avatar: null,
    rating: 5,
  },
  {
    id: '2',
    content: "The violet design system is stunning. Our users immediately noticed the polish and it elevated our entire brand perception overnight.",
    author: "Marcus Rodriguez",
    role: "Product Designer, Creative Studio",
    avatar: null,
    rating: 5,
  },
  {
    id: '3',
    content: "We've tried every AI app builder on the market. Syntheon's combination of speed, flexibility, and beautiful defaults is unmatched.",
    author: "Elena Volkov",
    role: "Founder, AI Solutions Co.",
    avatar: null,
    rating: 4,
  },
]

const DEFAULT_SPEED = 5000
const MIN_SLIDES = 3

export const TestimonialCarouselContext = React.createContext<TestimonialCarouselContextValue>({})

function useTestimonialCarousel() {
  return React.useContext(TestimonialCarouselContext)
}

export function TestimonialCarousel({
  items = DEFAULT_ITEMS,
  autoplay = false,
  autoplayInterval = DEFAULT_SPEED,
  infinite = true,
  loop = true,
  initialSlide = 0,
  speed = DEFAULT_SPEED,
  showControls = true,
  showDots = true,
  showIndicators = true,
  className,
  ...props
}: TestimonialCarouselProps) {
  const [current, setCurrent] = React.useState(initialSlide % items.length)
  const [isPaused, setIsPaused] = React.useState(false)
  const [direction, setDirection] = React.useState<'forward' | 'backward'>('forward')
  const [isLoading, setIsLoading] = React.useState(true)

  const { autoplay: contextAutoplay, autoplayInterval: contextInterval } = useTestimonialCarousel()

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (infinite && loop) {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 100)
    } else {
      setIsLoading(false)
    }
  }, [infinite, loop])

  const nextSlide = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length)
    setDirection('forward')
  }, [items.length])

  const prevSlide = React.useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length)
    setDirection('backward')
  }, [items.length])

  const goToSlide = React.useCallback((index: number) => {
    if (infinite && loop) {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 100)
    } else {
      setIsLoading(false)
    }
    setCurrent(index % items.length)
    setDirection('forward')
  }, [items.length, infinite, loop])

  const goToNext = React.useCallback(() => {
    if (infinite && loop) {
      nextSlide()
    } else {
      goToSlide((current + 1) % items.length)
    }
  }, [nextSlide, current, infinite, loop, goToSlide])

  const goToPrev = React.useCallback(() => {
    if (infinite && loop) {
      prevSlide()
    } else {
      goToSlide((current - 1 + items.length) % items.length)
    }
  }, [prevSlide, current, infinite, loop, goToSlide])

  const startAutoplay = React.useCallback(() => {
    setIsPaused(false)
    intervalRef.current = setInterval(nextSlide, autoplayInterval)
  }, [nextSlide, autoplayInterval])

  const stopAutoplay = React.useCallback(() => {
    setIsPaused(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const togglePause = React.useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const goToPreviousSlide = React.useCallback(() => {
    setDirection('backward')
    goToPrev()
  }, [goToPrev])

  const goToNextSlide = React.useCallback(() => {
    setDirection('forward')
    goToNext()
  }, [goToNext])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goToPreviousSlide()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goToNextSlide()
      }
    },
    [goToPreviousSlide, goToNextSlide]
  )

  React.useEffect(() => {
    if (autoplay && !isPaused) {
      startAutoplay()
    } else if (intervalRef.current) {
      stopAutoplay()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoplay, isPaused, startAutoplay, stopAutoplay])

  const totalSlides = items.length

  let displayItems: typeof items = []
  if (infinite && loop) {
    displayItems = [...items.slice(0, MIN_SLIDES), ...items]
  } else {
    displayItems = items
  }

  return (
    <TestimonialCarouselContext.Provider value={{ current, isPaused, direction, isLoading }}>
      <div
        ref={containerRef}
        role="region"
        aria-label="Testimonials carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative overflow-hidden rounded-lg border-border bg-background',
          showControls && 'p-4 sm:p-6',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 mb-4">
          {showIndicators && (
            <>
              <span className="text-sm text-muted-foreground font-medium">
                Testimonials
              </span>
              <span className="text-xs text-muted-foreground">
                ({totalSlides} reviews)
              </span>
            </>
          )}

          {showControls && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousSlide}
                disabled={!infinite || !loop || isLoading}
                className="h-8 w-8 rounded-full border-border bg-muted/50 hover:bg-muted transition-colors"
                aria-label="Go to previous testimonial"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </Button>

              {showDots && (
                <div className="flex items-center gap-1.5">
                  {items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      disabled={!infinite || !loop || isLoading}
                      className={cn(
                        'h-2 w-2 rounded-full transition-all duration-300',
                        current === index
                          ? 'bg-primary scale-125'
                          : 'bg-muted/70 hover:bg-muted'
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                      aria-current={current === index ? 'step' : undefined}
                    />
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextSlide}
                disabled={!infinite || !loop || isLoading}
                className="h-8 w-8 rounded-full border-border bg-muted/50 hover:bg-muted transition-colors"
                aria-label="Go to next testimonial"
              >
                <ChevronRight className="h-4 w-4 text-foreground" />
              </Button>
            </>
          )}

          {showControls && (autoplay || isPaused) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePause}
              className="h-8 w-8 rounded-full border-border bg-muted/50 hover:bg-muted transition-colors ml-auto"
              aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            >
              {isPaused ? <Play className="h-4 w-4 text-foreground" /> : <Pause className="h-4 w-4 text-foreground" />}
            </Button>
          )}

          {showControls && (autoplay || isPaused) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={stopAutoplay}
              className="h-8 w-8 rounded-full border-border bg-muted/50 hover:bg-muted transition-colors ml-auto"
              aria-label="Stop autoplay"
            >
              <X className="h-4 w-4 text-foreground" />
            </Button>
          )}
        </div>

        <div
          className={cn(
            'flex gap-6 overflow-x-hidden transition-transform duration-500 ease-out',
            (infinite && loop) ? 'py-2' : ''
          )}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <Card className="h-full border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  {item.rating && (
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < item.rating ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn(
                            i < item.rating
                              ? 'text-yellow-500 fill-yellow-500/20'
                              : 'text-muted-foreground',
                            'h-4 w-4'
                          )}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17.17 14.14 18.18 21.02 12 17.77 5.82 21.02 6.83 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  )}

                  <blockquote className="text-sm sm:text-base text-foreground leading-relaxed">
                    {item.content}
                  </blockquote>

                  <div className="flex flex-col items-center gap-1.5 min-h-[4rem] justify-center">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover border-border bg-muted"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {item.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <cite className="block text-sm font-semibold text-foreground">
                      {item.author}
                    </cite>

                    {item.role && (
                      <span className="text-xs text-muted-foreground">{item.role}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {(infinite && loop) && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[5%] h-full bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[5%] h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <span className="h-4 w-1.5 rounded-full bg-primary" />
              <span className="h-4 w-1.5 rounded-full bg-primary" style={{ animationDelay: '0.1s' }} />
              <span className="h-4 w-1.5 rounded-full bg-primary" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}

        {(!infinite || !loop) && (
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}

        {(!infinite || !loop) && (
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        )}
      </div>
    </TestimonialCarouselContext.Provider>
  )
}
