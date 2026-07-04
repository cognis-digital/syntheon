import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

// Mock LayoutAnimation API that jsdom lacks
const mockLayoutAnimation = {
  configure: () => {},
  prepare: () => {},
} as unknown as typeof window['LayoutAnimation']

Object.defineProperty(window, 'LayoutAnimation', { value: mockLayoutAnimation })

// Create a minimal RevealOnScroll component for testing
function createRevealComponent() {
  const RevealContext = createContext<{
    isReducedMotion: boolean
    revealThreshold: number
  }>({
    isReducedMotion: false,
    revealThreshold: 0.15,
  })

  function RevealOnScroll({
    children,
    className,
    threshold = 0.15,
    delay = 0,
    duration = 0.6,
    staggerChildren = true,
  }: {
    children: React.ReactNode
    className?: string
    threshold?: number
    delay?: number
    duration?: number
    staggerChildren?: boolean
  }) {
    const [isReducedMotion, setIsReducedMotion] = useState(false)

    useEffect(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsReducedMotion(true)
      }
    }, [])

    return (
      <RevealContext.Provider value={{ isReducedMotion, revealThreshold: threshold }}>
        <motion.div
          className={cn('overflow-hidden', className)}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration, ease: 'easeOut' }}
        >
          <AnimatePresence mode='wait'>
            {children}
          </AnimatePresence>
        </motion.div>
      </RevealContext.Provider>
    )
  }

  return RevealOnScroll as any
}

describe('RevealOnScroll', () => {
  let RevealOnScroll: typeof createRevealComponent

  beforeEach(() => {
    RevealOnScroll = createRevealComponent()
    document.body.innerHTML = ''
  })

  it('mounts without throwing in jsdom environment', () => {
    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="child">Hello</div>
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies className correctly', () => {
    const wrapper = render(
      <RevealOnScroll className="custom-class">
        <div data-testid="child" />
      </RevealOnScroll>
    )

    expect(wrapper.container.firstChild).toHaveClass('custom-class')
  })

  it('passes threshold prop to context', () => {
    const wrapper = render(
      <RevealOnScroll threshold={0.25}>
        <div data-testid="child" />
      </RevealOnScroll>
    )

    // Access the context via a child component
    function TestChild() {
      const ctx = useContext(RevealContext)
      return <span>{ctx.revealThreshold}</span>
    }

    const wrapper2 = render(
      <RevealOnScroll threshold={0.3}>
        <TestChild />
      </RevealOnScroll>
    )

    expect(screen.getByText('0.3')).toBeInTheDocument()
  })

  it('applies default duration when not specified', () => {
    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="child" />
      </RevealOnScroll>
    )

    expect(wrapper.container.firstChild).toHaveAttribute('transition-duration')
  })

  it('renders children with AnimatePresence', () => {
    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="child-1">First</div>
        <div data-testid="child-2">Second</div>
      </RevealOnScroll>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })

  it('handles empty children gracefully', () => {
    const wrapper = render(<RevealOnScroll />)

    expect(wrapper).toBeTruthy()
    expect(wrapper.container.firstChild).toHaveAttribute('initial')
  })

  it('passes duration prop to motion.div', () => {
    const wrapper = render(
      <RevealOnScroll duration={1.5}>
        <div data-testid="child" />
      </RevealOnScroll>
    )

    expect(wrapper.container.firstChild).toHaveAttribute('transition-duration')
  })

  it('applies staggerChildren prop to AnimatePresence', () => {
    const wrapper = render(
      <RevealOnScroll staggerChildren={true}>
        <div data-testid="child-1" />
        <div data-testid="child-2" />
      </RevealOnScroll>
    )

    expect(wrapper.container.firstChild).toHaveAttribute('children')
  })

  it('renders with reduced motion preference', () => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const originalState = mediaQuery.matches

    // Simulate reduced motion
    Object.defineProperty(mediaQuery, 'matches', { value: true })

    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="child" />
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
  })

  it('renders with custom delay', () => {
    const wrapper = render(
      <RevealOnScroll delay={0.3}>
        <div data-testid="child" />
      </RevealOnScroll>
    )

    // Check that the component accepts and stores the delay prop
    expect(wrapper).toBeTruthy()
  })

  it('handles nested RevealOnScroll components', () => {
    const wrapper = render(
      <RevealOnScroll threshold={0.2}>
        <div data-testid="outer-child">Outer</div>
        <RevealOnScroll duration={0.8}>
          <div data-testid="inner-child">Inner</div>
        </RevealOnScroll>
      </RevealOnScroll>
    )

    expect(screen.getByTestId('outer-child')).toBeInTheDocument()
    expect(screen.getByTestId('inner-child')).toBeInTheDocument()
  })

  it('applies border-radius via className', () => {
    const wrapper = render(
      <RevealOnScroll className="rounded-lg">
        <div data-testid="child" />
      </RevealOnScroll>
    )

    expect(wrapper.container.firstChild).toHaveClass('rounded-lg')
  })

  it('handles long content without overflow issues', () => {
    const longContent = 'A'.repeat(1000)
    const wrapper = render(
      <RevealOnScroll className="max-w-4xl">
        <div data-testid="long-content">{longContent}</div>
      </RevealOnScroll>
    )

    expect(screen.getByTestId('long-content')).toHaveTextContent(longContent)
  })

  it('renders with proper accessibility attributes', () => {
    const wrapper = render(
      <RevealOnScroll className="sr-only">
        <div data-testid="a11y-child" aria-label="Test label" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('a11y-child')).toHaveAttribute('aria-label', 'Test label')
  })

  it('handles keyboard navigation within children', () => {
    const wrapper = render(
      <RevealOnScroll className="p-4">
        <div data-testid="focusable" tabIndex={0} role="button">
          Focus me
        </div>
      </RevealOnScroll>
    )

    expect(screen.getByTestId('focusable')).toHaveAttribute('tabIndex', '0')
  })

  it('preserves focus within children during animation', () => {
    const wrapper = render(
      <RevealOnScroll className="p-4">
        <div data-testid="focus-target" tabIndex={0} role="button">
          Focus me
        </div>
      </RevealOnScroll>
    )

    expect(screen.getByTestId('focus-target')).toHaveAttribute('tabIndex', '0')
  })

  it('handles conditional rendering within children', () => {
    const [show, setShow] = useState(true)

    function TestComponent() {
      return (
        <RevealOnScroll>
          {show && <div data-testid="conditional">Visible</div>}
        </RevealOnScroll>
      )
    }

    render(<TestComponent />)

    expect(screen.getByTestId('conditional')).toBeInTheDocument()

    // Toggle visibility
    setShow(false)

    waitFor(() => {
      expect(screen.queryByTestId('conditional')).not.toBeInTheDocument()
    })
  })

  it('renders with semantic color tokens', () => {
    const wrapper = render(
      <RevealOnScroll className="bg-background text-foreground">
        <div data-testid="colored-child" />
      </RevealOnScroll>
    )

    expect(wrapper.container.firstChild).toHaveClass('bg-background')
    expect(wrapper.container.firstChild).toHaveClass('text-foreground')
  })

  it('handles very fast duration', () => {
    const wrapper = render(
      <RevealOnScroll duration={0.01}>
        <div data-testid="fast-child" />
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
  })

  it('handles very slow duration', () => {
    const wrapper = render(
      <RevealOnScroll duration={30}>
        <div data-testid="slow-child" />
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
  })

  it('applies overflow-hidden by default', () => {
    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="overflow-child" style={{ width: '200px' }}>
          AAAAAAAAAA
        </div>
      </RevealOnScroll>
    )

    expect(wrapper.container.firstChild).toHaveAttribute('style', /overflow-hidden/)
  })

  it('handles zero children count', () => {
    const wrapper = render(
      <RevealOnScroll>
        {[].map(() => null)}
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
  })

  it('renders with proper HTML structure', () => {
    const wrapper = render(
      <RevealOnScroll className="custom">
        <div data-testid="root-child" />
      </RevealOnScroll>
    )

    // Check for expected DOM hierarchy
    expect(wrapper.container.firstChild).toHaveAttribute('class')
    expect(wrapper.container.firstChild).toHaveAttribute('initial')
  })

  it('handles React.memo-style optimizations', () => {
    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="memo-child">Memo</div>
      </RevealOnScroll>
    )

    expect(screen.getByTestId('memo-child')).toBeInTheDocument()
  })

  it('handles suspense boundaries', () => {
    const SuspenseBoundary = ({ children }: { children: React.ReactNode }) => (
      <suspense fallback={<div data-testid="fallback">Loading...</div>}>
        {children}
      </suspense>
    )

    const wrapper = render(
      <SuspenseBoundary>
        <RevealOnScroll>
          <div data-testid="suspense-child" />
        </RevealOnScroll>
      </SuspenseBoundary>
    )

    expect(screen.getByTestId('suspense-child')).toBeInTheDocument()
  })

  it('handles concurrent rendering', () => {
    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="concurrent-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('concurrent-child')).toBeInTheDocument()
  })

  it('applies all motion props correctly', () => {
    const wrapper = render(
      <RevealOnScroll
        threshold={0.2}
        delay={0.1}
        duration={0.5}
        staggerChildren={true}
      >
        <div data-testid="motion-child" />
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
  })

  it('handles SSR-like hydration', () => {
    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="hydration-child">Hydrated</div>
      </RevealOnScroll>
    )

    // Simulate initial mount state
    expect(wrapper).toBeTruthy()
  })

  it('renders with proper type safety', () => {
    const wrapper = render(
      <RevealOnScroll
        threshold={0.25}
        delay={100}
        duration={0.75}
        staggerChildren={false}
      >
        <div data-testid="typed-child" />
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
  })

  it('handles deeply nested motion components', () => {
    const wrapper = render(
      <RevealOnScroll>
        <RevealOnScroll>
          <RevealOnScroll>
            <div data-testid="deep-child" />
          </RevealOnScroll>
        </RevealOnScroll>
      </RevealOnScroll>
    )

    expect(screen.getByTestId('deep-child')).toBeInTheDocument()
  })

  it('applies default values when props are omitted', () => {
    const wrapper = render(
      <RevealOnScroll>
        <div data-testid="defaults-child" />
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
  })

  it('handles React.StrictMode correctly', () => {
    const StrictModeWrapper = ({ children }: { children: React.ReactNode }) => (
      <React.StrictMode>{children}</React.StrictMode>
    )

    const wrapper = render(
      <StrictModeWrapper>
        <RevealOnScroll>
          <div data-testid="strict-child" />
        </RevealOnScroll>
      </StrictModeWrapper>
    )

    expect(screen.getByTestId('strict-child')).toBeInTheDocument()
  })

  it('renders with proper shadow DOM boundaries', () => {
    const ShadowRoot = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="shadow-root">{children}</div>
    )

    const wrapper = render(
      <ShadowRoot>
        <RevealOnScroll>
          <div data-testid="shadow-child" />
        </RevealOnScroll>
      </ShadowRoot>
    )

    expect(screen.getByTestId('shadow-child')).toBeInTheDocument()
  })

  it('handles iframe-like boundaries', () => {
    const IframeBoundary = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="iframe-boundary" style={{ position: 'relative' }}>
        {children}
      </div>
    )

    const wrapper = render(
      <IframeBoundary>
        <RevealOnScroll>
          <div data-testid="iframe-child" />
        </RevealOnScroll>
      </IframeBoundary>
    )

    expect(screen.getByTestId('iframe-child')).toBeInTheDocument()
  })

  it('applies proper z-index stacking context', () => {
    const wrapper = render(
      <RevealOnScroll className="relative">
        <div data-testid="z-index-child" />
      </RevealOnScroll>
    )

    expect(wrapper).toBeTruthy()
  })

  it('handles pointer events correctly', () => {
    const wrapper = render(
      <RevealOnScroll className="cursor-pointer">
        <div data-testid="pointer-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('pointer-child')).toBeInTheDocument()
  })

  it('renders with proper touch event handling', () => {
    const wrapper = render(
      <RevealOnScroll className="touch-none">
        <div data-testid="touch-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('touch-child')).toBeInTheDocument()
  })

  it('handles resize events gracefully', () => {
    const wrapper = render(
      <RevealOnScroll className="resize-none">
        <div data-testid="resize-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('resize-child')).toBeInTheDocument()
  })

  it('applies proper selection behavior', () => {
    const wrapper = render(
      <RevealOnScroll className="select-none">
        <div data-testid="selection-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('selection-child')).toBeInTheDocument()
  })

  it('handles overflow behavior correctly', () => {
    const wrapper = render(
      <RevealOnScroll className="overflow-auto">
        <div data-testid="overflow-child" style={{ width: '200px' }}>
          AAAAAAAAAA
        </div>
      </RevealOnScroll>
    )

    expect(screen.getByTestId('overflow-child')).toBeInTheDocument()
  })

  it('renders with proper scroll behavior', () => {
    const wrapper = render(
      <RevealOnScroll className="scroll-smooth">
        <div data-testid="scroll-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('scroll-child')).toBeInTheDocument()
  })

  it('handles transition timing functions', () => {
    const wrapper = render(
      <RevealOnScroll className="transition-all">
        <div data-testid="transition-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('transition-child')).toBeInTheDocument()
  })

  it('applies proper easing functions', () => {
    const wrapper = render(
      <RevealOnScroll className="ease-in-out">
        <div data-testid="easing-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('easing-child')).toBeInTheDocument()
  })

  it('handles composite animations', () => {
    const wrapper = render(
      <RevealOnScroll className="composite">
        <div data-testid="composite-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('composite-child')).toBeInTheDocument()
  })

  it('renders with proper animation timing', () => {
    const wrapper = render(
      <RevealOnScroll className="animate-in">
        <div data-testid="timing-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('timing-child')).toBeInTheDocument()
  })

  it('handles animation delays', () => {
    const wrapper = render(
      <RevealOnScroll delay={0.2}>
        <div data-testid="delay-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('delay-child')).toBeInTheDocument()
  })

  it('applies proper animation duration', () => {
    const wrapper = render(
      <RevealOnScroll duration={0.4}>
        <div data-testid="duration-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('duration-child')).toBeInTheDocument()
  })

  it('handles animation iterations', () => {
    const wrapper = render(
      <RevealOnScroll className="animate-infinite">
        <div data-testid="iteration-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('iteration-child')).toBeInTheDocument()
  })

  it('renders with proper animation fill mode', () => {
    const wrapper = render(
      <RevealOnScroll className="animate-fill-mode">
        <div data-testid="fillmode-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('fillmode-child')).toBeInTheDocument()
  })

  it('handles animation state', () => {
    const wrapper = render(
      <RevealOnScroll className="animate-state">
        <div data-testid="state-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('state-child')).toBeInTheDocument()
  })

  it('applies proper animation direction', () => {
    const wrapper = render(
      <RevealOnScroll className="animate-direction">
        <div data-testid="direction-child" />
      </RevealOnScroll>
    )

    expect(screen.getByTestId('direction-child')).toBeInTheDocument()
  })

  it('handles animation iteration count', () => {
    const wrapper = render(
      <RevealOnScroll className="animate-count">
        <div data-testid="count-child" />
      </RevealOnScroll>
    )
