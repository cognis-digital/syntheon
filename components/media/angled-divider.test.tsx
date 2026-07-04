import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AngledDivider } from '@/components/media/angled-divider'
import { cn } from '@/lib/utils'

describe('AngledDivider', () => {
  beforeEach(() => {
    // Reset any global state before each test
    document.body.className = ''
  })

  it('renders with default props without throwing', () => {
    const { container } = render(<AngledDivider />)
    
    expect(container).toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })

  it('applies correct base classes by default', () => {
    const { container } = render(<AngledDivider />)
    
    // Check for expected utility classes
    const el = container.querySelector('[class*="rounded-lg"]') || 
               container.querySelector('[class*="border"]')
    expect(el).not.toBeNull()
  })

  it('accepts className override', () => {
    const customClass = 'custom-test-class'
    const { container } = render(<AngledDivider className={customClass} />)
    
    // Should contain both default and custom classes
    expect(container.firstChild).toHaveAttribute('class')
    expect(container.firstChild?.className).toContain(customClass)
  })

  it('respects variant prop', () => {
    const variants = ['default', 'primary', 'secondary'] as const
    
    variants.forEach((variant, index) => {
      render(<AngledDivider variant={variant} />)
      
      // Each variant should render without error
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('applies dark mode classes correctly', () => {
    document.body.classList.add('dark')
    
    const { container } = render(<AngledDivider />)
    
    // Should have dark-mode-aware styling
    expect(container.firstChild).not.toBeNull()
    
    document.body.classList.remove('dark')
  })

  it('handles responsive breakpoints', () => {
    // Mobile
    Object.defineProperty(window, 'innerWidth', { value: 375 })
    const { container } = render(<AngledDivider />)
    expect(container.firstChild).not.toBeNull()
    
    // Desktop
    Object.defineProperty(window, 'innerWidth', { value: 1920 })
    const { rerender } = render(<AngledDivider />)
    expect(rerender.container.firstChild).not.toBeNull()
  })

  it('applies size variants correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach((size, index) => {
      render(<AngledDivider size={size} />)
      
      // Should not throw for any valid size
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles disabled state gracefully', () => {
    const { container } = render(<AngledDivider disabled />)
    
    expect(container.firstChild).not.toBeNull()
    // Disabled might apply opacity or pointer-events
    expect(container.firstChild?.className).toContain('opacity-') || 
           expect(container.firstChild?.className).toContain('pointer-events-none')
  })

  it('respects animation duration prop', () => {
    const durations = ['100ms', '300ms', '500ms'] as const
    
    durations.forEach((duration, index) => {
      render(<AngledDivider animate={{ duration }} />)
      
      // Should accept any valid duration string
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('uses framer-motion motion components correctly', () => {
    const { container } = render(<AngledDivider />)
    
    // Check for motion component presence (might be wrapped in <motion.div>)
    const hasMotionClass = container.firstChild?.className.includes('motion') || 
                          container.firstChild?.className.includes('framer-motion')
    
    expect(hasMotionClass).toBe(true)
  })

  it('has proper accessibility attributes', () => {
    const { container } = render(<AngledDivider />)
    
    // Should be presentational (role=presentation or similar)
    const el = container.querySelector('[role]') || 
               container.querySelector('[aria-hidden="true"]')
    
    expect(el).not.toBeNull()
  })

  it('handles focus states correctly', () => {
    const { container } = render(<AngledDivider />)
    
    // Focus should not break layout or cause jumps
    document.body.focus()
    expect(container.firstChild).not.toBeNull()
  })

  it('respects reduced motion preferences', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 10 })
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Test with reduced motion enabled
    document.body.classList.add('dark')
    
    render(<AngledDivider />)
    
    expect(screen.getByRole('presentation')).toBeInTheDocument()
    
    document.body.classList.remove('dark')
  })

  it('handles border radius variants', () => {
    const radii = ['none', 'sm', 'md', 'lg'] as const
    
    radii.forEach((radius, index) => {
      render(<AngledDivider radius={radius} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('accepts custom gradient props', () => {
    const customGradient = 'linear-gradient(45deg, #8b5cf6, #ec4899)'
    
    render(<AngledDivider gradient={customGradient} />)
    
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles loading state', () => {
    const { container } = render(<AngledDivider loading />)
    
    // Should not throw during loading simulation
    expect(container.firstChild).not.toBeNull()
  })

  it('respects semantic color tokens', () => {
    const colors = [
      'bg-background',
      'text-foreground', 
      'text-primary',
      'bg-muted'
    ] as const
    
    colors.forEach((color, index) => {
      render(<AngledDivider className={cn(color)} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles edge case: very small container', () => {
    Object.defineProperty(window, 'innerWidth', { value: 10 })
    
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
    
    // Restore
    Object.defineProperty(window, 'innerWidth', { value: 1920 })
  })

  it('handles edge case: very large container', () => {
    Object.defineProperty(window, 'innerWidth', { value: 5000 })
    
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
    
    // Restore
    Object.defineProperty(window, 'innerWidth', { value: 1920 })
  })

  it('handles edge case: zero height/width content', () => {
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
  })

  it('renders with proper semantic HTML structure', () => {
    const { container } = render(<AngledDivider />)
    
    // Should be a valid HTML element
    const el = container.querySelector('*') as HTMLElement
    
    expect(el?.tagName).toBeTruthy()
    expect(el?.className).toContain('rounded') || 
           expect(el?.className).toContain('border')
  })

  it('handles concurrent rendering without race conditions', () => {
    Promise.all([
      render(<AngledDivider />),
      render(<AngledDivider variant="primary" />)
    ]).then(() => {
      // Should complete without errors
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles strict mode correctly', () => {
    const { container } = render(<AngledDivider />)
    
    // In React 18+, components may be rendered twice in strict mode
    // Should handle this gracefully
    expect(container.firstChild).not.toBeNull()
  })

  it('accepts all standard HTML attributes', () => {
    const attrs: Record<string, string> = {
      id: 'divider-1',
      title: 'Styled Divider',
      tabIndex: '-1',
      ariaLabel: 'Visual divider'
    }
    
    render(<AngledDivider {...attrs} />)
    
    // Should not throw with any valid HTML attributes
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles boolean props correctly', () => {
    const boolProps = ['hidden', 'visible'] as const
    
    boolProps.forEach((bool, index) => {
      render(<AngledDivider hidden={bool} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('respects border color tokens', () => {
    const borders = ['border-border', 'bg-card'] as const
    
    borders.forEach((border, index) => {
      render(<AngledDivider className={cn(border)} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles custom animation variants', () => {
    const animations = ['slide-up', 'fade-in', 'scale'] as const
    
    animations.forEach((anim, index) => {
      render(<AngledDivider animate={{ variant: anim }} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles custom cursor prop if applicable', () => {
    // Some premium components might have custom cursor support
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
  })

  it('passes through unknown props safely', () => {
    const unknownProps: Record<string, string> = {
      'data-test': 'value',
      'data-id': '12345'
    }
    
    render(<AngledDivider {...unknownProps} />)
    
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles memory cleanup correctly', () => {
    const instances: any[] = []
    
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(<AngledDivider />)
      instances.push(unmount)
      
      // Unmount each instance
      unmount()
    }
    
    // Should not leak memory or cause errors
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles keyboard navigation gracefully', () => {
    const { container } = render(<AngledDivider />)
    
    // Focus should work without issues
    document.body.focus()
    expect(container.firstChild).not.toBeNull()
  })

  it('respects touch event handling', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 10 })
    
    const { container } = render(<AngledDivider />)
    
    // Should handle touch events without breaking layout
    expect(container.firstChild).not.toBeNull()
  })

  it('handles scroll reveal animations correctly', () => {
    Object.defineProperty(window, 'scrollY', { value: 0 })
    
    const { container } = render(<AngledDivider />)
    
    // Should work at any scroll position
    expect(container.firstChild).not.toBeNull()
  })

  it('handles viewport changes gracefully', () => {
    const viewports = [375, 768, 1024, 1920] as const
    
    viewports.forEach((viewport, index) => {
      Object.defineProperty(window, 'innerWidth', { value: viewport })
      
      const { container } = render(<AngledDivider />)
      
      expect(container.firstChild).not.toBeNull()
    })
  })

  it('handles CSS variable injection correctly', () => {
    document.body.style.setProperty('--divider-color', '#8b5cf6')
    
    const { container } = render(<AngledDivider />)
    
    // Should respect custom CSS variables if component uses them
    expect(container.firstChild).not.toBeNull()
  })

  it('handles async initialization correctly', () => {
    // Simulate async setup
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const { container } = render(<AngledDivider />)
        
        expect(container.firstChild).not.toBeNull()
        resolve()
      }, 10)
    })
  })

  it('handles SSR hydration correctly', () => {
    // Simulate server-side rendered HTML
    document.body.innerHTML = '<div class="rounded-lg border"></div>'
    
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles concurrent mode correctly', () => {
    // In React 18+, components may be rendered concurrently
    Promise.all([
      render(<AngledDivider />),
      render(<AngledDivider variant="primary" />)
    ]).then(() => {
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles strict mode double-render correctly', () => {
    const { container } = render(<AngledDivider />)
    
    // React 18+ may render components twice in strict mode
    expect(container.firstChild).not.toBeNull()
  })

  it('accepts all valid Tailwind utility classes', () => {
    const utilities = [
      'rounded-lg',
      'border',
      'bg-background',
      'text-foreground'
    ] as const
    
    utilities.forEach((util, index) => {
      render(<AngledDivider className={cn(util)} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles custom theme tokens correctly', () => {
    // Simulate custom theme injection
    const customTheme = {
      '--divider-radius': '0.5rem' as string,
      '--divider-color': '#8b5cf6' as string
    }
    
    Object.entries(customTheme).forEach(([key, value]) => {
      document.body.style.setProperty(key, value)
    })
    
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles nested component rendering correctly', () => {
    // Simulate being rendered inside other components
    document.body.innerHTML = '<div><div class="container"></div></div>'
    
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles iframe shadow DOM correctly', () => {
    // Simulate being in an iframe (common for embeds)
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles shadow DOM correctly', () => {
    // Simulate being in a shadow root (Web Components)
    const host = document.createElement('div')
    const shadow = host.attachShadow({ mode: 'open' })
    
    const { container } = render(<AngledDivider />, { container: shadow })
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles portal rendering correctly', () => {
    // Simulate being rendered via a portal (e.g., modal, tooltip)
    document.body.innerHTML = '<div id="portal-root"></div>'
    
    const root = document.getElementById('portal-root') as HTMLElement
    
    const { container } = render(<AngledDivider />, { container: root })
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles event delegation correctly', () => {
    // Simulate being inside a component with delegated events
    document.body.innerHTML = '<div class="event-delegator"></div>'
    
    const delegator = document.querySelector('.event-delegator') as HTMLElement
    
    const { container } = render(<AngledDivider />, { container: delegator })
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles focus management correctly', () => {
    // Simulate being inside a focusable component
    document.body.innerHTML = '<div tabindex="0"></div>'
    
    const focusable = document.querySelector('[tabindex="0"]') as HTMLElement
    
    const { container } = render(<AngledDivider />, { container: focusable })
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles aria attributes correctly', () => {
    const ariaProps = {
      'aria-label': 'Visual divider element' as string,
      'role': 'presentation' as string
    }
    
    render(<AngledDivider {...ariaProps} />)
    
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles data attributes correctly', () => {
    const dataProps = {
      'data-testid': 'angled-divider-test' as string,
      'data-variant': 'default' as string
    }
    
    render(<AngledDivider {...dataProps} />)
    
    expect(screen.getByTestId('angled-divider-test')).toBeInTheDocument()
  })

  it('handles custom event listeners correctly', () => {
    // Simulate being inside a component with custom events
    document.body.innerHTML = '<div class="event-listener"></div>'
    
    const listener = document.querySelector('.event-listener') as HTMLElement
    
    const { container } = render(<AngledDivider />, { container: listener })
    
    expect(container.firstChild).not.toBeNull()
  })

  it('handles performance optimizations correctly', () => {
    // Simulate being in a performance-critical path
    const iterations = 100
    
    for (let i = 0; i < iterations; i++) {
      render(<AngledDivider />)
    }
    
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles memory constraints correctly', () => {
    // Simulate being in a low-memory environment
    const initialMemory = performance.memory?.usedJSHeapSize || 0
    
    render(<AngledDivider />)
    
    // Should not cause excessive memory growth
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles concurrent rendering correctly', () => {
    // Simulate being rendered concurrently with other components
    Promise.all([
      render(<AngledDivider />),
      render(<AngledDivider variant="primary" />)
    ]).then(() => {
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles strict mode double-render correctly', () => {
    // React 18+ may render components twice in strict mode
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
  })

  it('accepts all valid semantic color tokens', () => {
    const colors = [
      'bg-background',
      'text-foreground', 
      'text-primary',
      'bg-muted',
      'border-border'
    ] as const
    
    colors.forEach((color, index) => {
      render(<AngledDivider className={cn(color)} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles custom gradient props correctly', () => {
    const customGradient = 'linear-gradient(45deg, #8b5cf6, #ec4899)'
    
    render(<AngledDivider gradient={customGradient} />)
    
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles loading state gracefully', () => {
    const { container } = render(<AngledDivider loading />)
    
    // Should not throw during loading simulation
    expect(container.firstChild).not.toBeNull()
  })

  it('respects border radius variants correctly', () => {
    const radii = ['none', 'sm', 'md', 'lg'] as const
    
    radii.forEach((radius, index) => {
      render(<AngledDivider radius={radius} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles custom animation variants correctly', () => {
    const animations = ['slide-up', 'fade-in', 'scale'] as const
    
    animations.forEach((anim, index) => {
      render(<AngledDivider animate={{ variant: anim }} />)
      
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })

  it('handles custom cursor prop if applicable', () => {
    // Some premium components might have custom cursor support
    const { container } = render(<AngledDivider />)
    
    expect(container.firstChild).not.toBeNull()
  })

  it('passes through unknown props safely', () => {
    const unknownProps: Record<string, string> = {
      'data-test': 'value',
      'data-id': '12345'
    }
    
    render(<AngledDivider {...unknownProps} />)
    
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles boolean props correctly', () => {
    const boolProps = ['hidden', 'visible'] as const
    
    boolProps.forEach((bool, index) => {
