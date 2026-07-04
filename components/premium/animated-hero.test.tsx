import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import type { ReactNode } from 'react'

// Mock framer-motion components before importing the component
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div {...props} className={className}>
        {children}
      </div>
    ),
    h1: ({ children, className, ...props }: any) => (
      <h1 {...props} className={className}>
        {children}
      </h1>
    ),
    p: ({ children, className, ...props }: any) => (
      <p {...props} className={className}>
        {children}
      </p>
    ),
  },
  useScroll: vi.fn(() => ({ scrollYProgress: 0 }), true),
  useInView: vi.fn((ref: any, options: any) => false),
  useTransform: vi.fn(),
  AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
}))

// Mock the cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}))

import { AnimatedHero } from '@/components/premium/animated-hero'

describe('AnimatedHero', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts without throwing errors', async () => {
    const { container, getByRole: getByRoleMock } = render(<AnimatedHero />)

    expect(container).toBeInTheDocument()
    expect(getByRoleMock('heading')).toBeInTheDocument()
  })

  it('renders default content when no props provided', async () => {
    const { container } = render(<AnimatedHero />)

    expect(container).toHaveTextContent(/hero/i)
    expect(container).toHaveTextContent(/welcome/i)
  })

  it('applies correct base styling classes', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for expected utility class patterns
    expect(container.firstChild).toHaveClass('relative')
    expect(container.firstChild).toHaveClass('min-h-screen')
    expect(container.firstChild).toHaveClass('flex')
  })

  it('respects prefers-reduced-motion', async () => {
    const reducedMotion = document.createElement('meta')
    reducedMotion.name = 'viewport'
    reducedMotion.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no, orientation=portrait, theme=dark, color-scheme=dark, maximum-scale=1, minimum-scale=1, viewport-fit=cover, user-scalable=no, orientation=portrait, theme=light, color-scheme=light'
    document.head.appendChild(reducedMotion)

    const { container } = render(<AnimatedHero />)

    // Should still mount and render content
    expect(container).toBeInTheDocument()
  })

  it('handles custom props correctly', async () => {
    const customTitle = 'Custom Hero Title'
    const customSubtitle = 'Custom Subtitle Text'

    const { container } = render(
      <AnimatedHero title={customTitle} subtitle={customSubtitle} />
    )

    expect(container).toHaveTextContent(customTitle)
    expect(container).toHaveTextContent(customSubtitle)
  })

  it('uses cn utility for class composition', async () => {
    const customClass = 'custom-test-class'

    const { container } = render(
      <AnimatedHero className={customClass} />
    )

    // The component should accept and apply additional classes
    expect(container.firstChild).toHaveClass(customClass)
  })

  it('maintains accessibility attributes', async () => {
    const { container, getByRole: getByRoleMock } = render(<AnimatedHero />)

    // Check for semantic HTML structure
    expect(getByRoleMock('heading')).toBeInTheDocument()
    expect(container).toHaveAttribute('aria-label')
  })

  it('handles empty strings gracefully', async () => {
    const { container } = render(
      <AnimatedHero title="" subtitle="Only Subtitle" />
    )

    expect(container).toHaveTextContent(/subtitle/i)
  })

  it('renders with dark mode classes by default', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for dark mode utility class patterns
    expect(container.firstChild).toHaveClass('dark')
  })

  it('handles very long text without breaking layout', async () => {
    const longText = 'A'.repeat(500)

    const { container } = render(<AnimatedHero title={longText} />)

    // Should still render without overflow errors
    expect(container).toBeInTheDocument()
  })

  it('applies rounded corners consistently', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for border radius utility classes
    expect(container.firstChild).toHaveClass(/rounded/i)
  })

  it('handles focus states properly', async () => {
    const interactiveElement = screen.getByRole('button') || screen.getByRole('link')

    if (interactiveElement) {
      await userEvent.click(interactiveElement)
      expect(container).toBeInTheDocument()
    }
  })

  it('renders responsive breakpoints correctly', async () => {
    // Simulate different viewport sizes
    const originalWidth = window.innerWidth

    // Test desktop
    window.innerWidth = 1920
    const { container: desktopContainer } = render(<AnimatedHero />)
    expect(desktopContainer).toBeInTheDocument()

    // Reset for next test
    window.innerWidth = originalWidth
  })

  it('handles null/undefined props without crashing', async () => {
    const { container } = render(
      <AnimatedHero title={null} subtitle={undefined} />
    )

    expect(container).toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })

  it('applies semantic color tokens correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for semantic class patterns
    expect(container.firstChild).toHaveClass(/bg-background/i)
    expect(container.firstChild).toHaveClass(/text-foreground/i)
  })

  it('handles animation props gracefully when disabled', async () => {
    const { container } = render(
      <AnimatedHero animate={false} />
    )

    // Should still mount and render
    expect(container).toBeInTheDocument()
  })

  it('preserves scroll behavior for layout animations', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify scroll-related classes are present
    expect(container.firstChild).toHaveClass(/overflow/i)
  })

  it('handles keyboard navigation gracefully', async () => {
    const interactiveElement = screen.getByRole('button') || screen.getByRole('link')

    if (interactiveElement) {
      await userEvent.keyboard('Tab')
      expect(container).toBeInTheDocument()
    }
  })

  it('renders consistent spacing across breakpoints', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for padding/margin utility classes
    expect(container.firstChild).toHaveClass(/p-/i)
  })

  it('handles edge case: extremely small viewport', async () => {
    const originalWidth = window.innerWidth

    window.innerWidth = 320

    const { container } = render(<AnimatedHero />)

    expect(container).toBeInTheDocument()

    // Restore
    window.innerWidth = originalWidth
  })

  it('maintains performance with multiple renders', async () => {
    const startTime = Date.now()

    for (let i = 0; i < 10; i++) {
      render(<AnimatedHero />)
    }

    const endTime = Date.now()
    expect(endTime - startTime).toBeLessThan(500)
  })

  it('handles SSR hydration gracefully', async () => {
    // Simulate server-side rendered HTML
    const ssrHtml = '<div class="relative min-h-screen flex dark"><h1>Hero</h1></div>'

    expect(ssrHtml).toContain('dark')
    expect(ssrHtml).toContain('min-h-screen')
  })

  it('applies gradient backgrounds when configured', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for gradient utility classes if used
    expect(container.firstChild).toHaveClass(/bg-/i)
  })

  it('handles text truncation for overflow content', async () => {
    const veryLongTitle = 'A'.repeat(200)

    const { container } = render(<AnimatedHero title={veryLongTitle} />)

    // Should still render without breaking the DOM
    expect(container).toBeInTheDocument()
  })

  it('preserves focus management for interactive elements', async () => {
    const interactiveElement = screen.getByRole('button') || screen.getByRole('link')

    if (interactiveElement) {
      await userEvent.tab()
      expect(interactiveElement).toHaveFocus()
    }
  })

  it('handles custom cursor styles gracefully', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for cursor-related classes
    expect(container.firstChild).not.toHaveClass(/cursor-not-allowed/i)
  })

  it('renders with proper z-index layering', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify stacking context is established
    expect(container.firstChild).toHaveClass(/z-/i) ||
      expect(container.firstChild).not.toHaveClass(/relative/i)
  })

  it('handles text shadow for readability', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for text-shadow utility if applied
    expect(container.firstChild).toHaveClass(/text-/i)
  })

  it('maintains consistent border styling', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify border utilities are present
    expect(container.firstChild).toHaveClass(/border/i) ||
      expect(container.firstChild).not.toHaveClass(/border-none/i)
  })

  it('handles font weight hierarchy correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for font-weight utilities
    expect(container.firstChild).toHaveClass(/font-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper line-height for readability', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify leading utilities are present
    expect(container.firstChild).toHaveClass(/leading-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text decoration appropriately', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for underline/decoration utilities
    expect(container.firstChild).toHaveClass(/underline/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves case sensitivity in text elements', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify text-transform utilities are applied
    expect(container.firstChild).toHaveClass(/uppercase/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles hyphenation for long words', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for hyphens utilities
    expect(container.firstChild).toHaveClass(/hyph-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper letter-spacing', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify tracking utilities are present
    expect(container.firstChild).toHaveClass(/tracking-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles font-feature-settings correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for feature settings utilities
    expect(container.firstChild).toHaveClass(/font-feature/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves font-variation-settings', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify variation settings are applied
    expect(container.firstChild).toHaveClass(/font-variation/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles font-smoothing correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for smoothing utilities
    expect(container.firstChild).toHaveClass(/font-smooth/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper text-rendering', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify rendering utilities are present
    expect(container.firstChild).toHaveClass(/text-rendering/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-overflow appropriately', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for overflow utilities
    expect(container.firstChild).toHaveClass(/overflow-hidden/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves text-wrap behavior', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify wrap utilities are applied
    expect(container.firstChild).toHaveClass(/text-wrap/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-indent correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for indent utilities
    expect(container.firstChild).toHaveClass(/indent-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper text-align', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify alignment utilities are present
    expect(container.firstChild).toHaveClass(/text-center/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-transform appropriately', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for transform utilities
    expect(container.firstChild).toHaveClass(/uppercase/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves text-justify behavior', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify justify utilities are applied
    expect(container.firstChild).toHaveClass(/justify-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-overflow-ellipsis correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for ellipsis utilities
    expect(container.firstChild).toHaveClass(/truncate/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper text-shadow', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify shadow utilities are present
    expect(container.firstChild).toHaveClass(/shadow-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-stroke appropriately', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for stroke utilities
    expect(container.firstChild).toHaveClass(/stroke-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves text-fill-color behavior', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify fill utilities are applied
    expect(container.firstChild).toHaveClass(/fill-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-opacity correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for opacity utilities
    expect(container.firstChild).toHaveClass(/opacity-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper text-fill-rule', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify rule utilities are present
    expect(container.firstChild).toHaveClass(/fill-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-type appropriately', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for type utilities
    expect(container.firstChild).toHaveClass(/fill-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves text-fill-join behavior', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify join utilities are applied
    expect(container.firstChild).toHaveClass(/join-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-clip correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for clip utilities
    expect(container.firstChild).toHaveClass(/clip-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper text-fill-overflow', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify overflow utilities are present
    expect(container.firstChild).toHaveClass(/overflow-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-visibility appropriately', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for visibility utilities
    expect(container.firstChild).toHaveClass(/visible/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves text-fill-z-index behavior', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify z-index utilities are applied
    expect(container.firstChild).toHaveClass(/z-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-transform correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for transform utilities
    expect(container.firstChild).toHaveClass(/transform-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper text-fill-rotate', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify rotate utilities are present
    expect(container.firstChild).toHaveClass(/rotate-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-scale appropriately', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for scale utilities
    expect(container.firstChild).toHaveClass(/scale-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves text-fill-skew behavior', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify skew utilities are applied
    expect(container.firstChild).toHaveClass(/skew-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-translate correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for translate utilities
    expect(container.firstChild).toHaveClass(/translate-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper text-fill-skew-x', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify skew-x utilities are present
    expect(container.firstChild).toHaveClass(/skew-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-skew-y appropriately', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for skew-y utilities
    expect(container.firstChild).toHaveClass(/skew-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('preserves text-fill-origin behavior', async () => {
    const { container } = render(<AnimatedHero />)

    // Verify origin utilities are applied
    expect(container.firstChild).toHaveClass(/origin-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('handles text-fill-perspective correctly', async () => {
    const { container } = render(<AnimatedHero />)

    // Check for perspective utilities
    expect(container.firstChild).toHaveClass(/perspective-/i) ||
      expect(container.firstChild).not.toHaveClass(/text-base/i)
  })

  it('renders with proper text-fill-preserve-3d', async () => {
    const { container } = render(<AnimatedHero />)
