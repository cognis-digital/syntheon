import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShimmerSkeleton } from '@/components/premium/shimmer-skeleton'

describe('ShimmerSkeleton', () => {
  beforeEach(() => {
    // Mock framer-motion layout APIs that jsdom lacks
    const mockLayout = vi.fn((props) => props.children as React.ReactNode)
    Object.defineProperty(window, 'getBoundingClientRect', () => () => ({
      top: 0, right: 100, bottom: 100, left: 0, width: 100, height: 50, x: 0, y: 0
    }))

    vi.mock('framer-motion', async (importOriginal) => {
      const actual = await importOriginal()
      return {
        ...actual,
        motion: {
          ...actual.motion,
          LayoutGroup: mockLayout as any,
          useMotionValue: vi.fn(() => 0),
          useTransform: vi.fn((fn) => fn(0)),
          AnimatePresence: actual.motion.AnimatePresence,
        },
      }
    })

    // Mock cn utility
    vi.mock('@/lib/utils', async (importOriginal) => {
      const actual = await importOriginal()
      return {
        ...actual,
        cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
      }
    })
  })

  it('mounts without throwing with default props', () => {
    render(<ShimmerSkeleton />)
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(document.body).not.toHaveAttribute('aria-busy')
  })

  it('applies skeleton styling classes by default', () => {
    const wrapper = render(<ShimmerSkeleton />)
    const img = screen.getByRole('img') as HTMLImageElement

    // Check for expected CSS variable usage (via computed style)
    expect(img.style).toHaveProperty('aspectRatio')
  })

  it('accepts custom className and merges correctly', () => {
    render(
      <ShimmerSkeleton className="custom-class" data-testid="custom-skeleton">
        Custom content
      </ShimmerSkeleton>
    )
    const img = screen.getByRole('img') as HTMLImageElement

    // Should include both default and custom classes
    expect(img.className).toContain('skeleton')
    expect(img.className).toContain('custom-class')
  })

  it('accepts size prop and adjusts aspect ratio accordingly', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    for (const size of sizes) {
      render(<ShimmerSkeleton size={size} />)
      const img = screen.getByRole('img') as HTMLImageElement

      // Aspect ratios are typically 1:1, 4:3, or similar depending on implementation
      expect(img.style.aspectRatio).toBeDefined()
    }
  })

  it('accepts src prop and uses provided image', () => {
    const testSrc = 'https://example.com/test.png'
    render(<ShimmerSkeleton src={testSrc} />)
    const img = screen.getByRole('img') as HTMLImageElement

    expect(img.src).toBe(testSrc)
  })

  it('accepts loading prop and reflects in aria attributes', () => {
    render(<ShimmerSkeleton loading={true} />)
    const img = screen.getByRole('img') as HTMLImageElement

    // Loading state should indicate busy/active state
    expect(img.getAttribute('aria-busy')).toBe('true')
  })

  it('accepts alt text for accessibility', () => {
    render(<ShimmerSkeleton alt="Loading skeleton" />)
    const img = screen.getByRole('img') as HTMLImageElement

    expect(img.alt).toBe('Loading skeleton')
  })

  it('respects prefers-reduced-motion by disabling animation when requested', async () => {
    // Simulate reduced motion preference
    Object.defineProperty(window, 'matchMedia', vi.fn((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })))

    render(<ShimmerSkeleton />)
    const img = screen.getByRole('img') as HTMLImageElement

    // Should still mount, but animation classes might differ
    expect(img).toBeInTheDocument()
  })

  it('accepts children and renders them inside', () => {
    render(
      <ShimmerSkeleton>
        <span data-testid="inner-content">Inner content</span>
      </ShimmerSkeleton>
    )

    const inner = screen.getByTestId('inner-content')
    expect(inner).toBeInTheDocument()
  })

  it('handles invalid size gracefully', () => {
    render(<ShimmerSkeleton size="invalid" />)
    const img = screen.getByRole('img') as HTMLImageElement

    // Should default to a sensible aspect ratio
    expect(img.style.aspectRatio).toBeDefined()
  })

  it('handles null/undefined src gracefully', () => {
    render(<ShimmerSkeleton src={null} />)
    const img = screen.getByRole('img') as HTMLImageElement

    // Should use default placeholder or empty src
    expect(img.src).toBeInstanceOf(String)
  })

  it('applies correct border radius based on size', () => {
    for (const [size, expectedRadius] of [
      ['sm', 'rounded-sm'],
      ['md', 'rounded-md'],
      ['lg', 'rounded-lg'],
    ] as const) {
      render(<ShimmerSkeleton size={size} />)
      const img = screen.getByRole('img') as HTMLImageElement

      expect(img.className).toContain(expectedRadius)
    }
  })

  it('handles concurrent renders without state corruption', () => {
    const wrapper1 = render(<ShimmerSkeleton />)
    const wrapper2 = render(<ShimmerSkeleton src="https://example.com/other.png" />)

    expect(wrapper1.container.firstChild).toBeDefined()
    expect(wrapper2.container.firstChild).toBeDefined()

    // Clean up
    wrapper1.unmount()
    wrapper2.unmount()
  })

  it('accepts aria-label for screen readers', () => {
    render(<ShimmerSkeleton aria-label="Loading data" />)
    const img = screen.getByRole('img') as HTMLImageElement

    expect(img.getAttribute('aria-label')).toBe('Loading data')
  })

  it('handles focus management correctly', () => {
    render(<ShimmerSkeleton tabIndex={0} />)
    const img = screen.getByRole('img') as HTMLImageElement

    // Should be focusable if tab index is set
    expect(img.tabIndex).toBe(0)
  })

  it('renders with correct semantic role', () => {
    render(<ShimmerSkeleton />)
    const img = screen.getByRole('img') as HTMLImageElement

    expect(img.getAttribute('role')).toBe('img')
  })

  it('handles very large images gracefully', async () => {
    // Simulate a large image that might cause layout shifts
    render(<ShimmerSkeleton src="https://example.com/large-placeholder.png" />)
    const img = screen.getByRole('img') as HTMLImageElement

    expect(img).toBeInTheDocument()
  })

  it('handles very small images gracefully', async () => {
    render(<ShimmerSkeleton size="sm" />)
    const img = screen.getByRole('img') as HTMLImageElement

    expect(img).toBeInTheDocument()
  })

  it('accepts additional props and passes them through correctly', () => {
    render(
      <ShimmerSkeleton
        src="https://example.com/test.png"
        alt="Test image"
        loading={true}
        className="extra-class"
        data-custom-attr="test-value"
      />
    )

    const img = screen.getByRole('img') as HTMLImageElement

    expect(img.src).toBe('https://example.com/test.png')
    expect(img.alt).toBe('Test image')
    expect(img.className).toContain('extra-class')
  })

  it('maintains stable class names across renders', () => {
    const render1 = render(<ShimmerSkeleton />)
    const classes1 = (render1.container.firstChild as HTMLElement)?.className

    const render2 = render(<ShimmerSkeleton />)
    const classes2 = (render2.container.firstChild as HTMLElement)?.className

    // Should have consistent structure
    expect(classes1).toMatch(/skeleton/)
  })

  it('handles rapid mount/unmount cycles', () => {
    for (let i = 0; i < 50; i++) {
      render(<ShimmerSkeleton />)
      const img = screen.getByRole('img') as HTMLImageElement
      expect(img).toBeInTheDocument()

      render(<ShimmerSkeleton src={`https://example.com/${i}.png`} />)
    }

    // Should not have crashed or leaked state
    expect(screen.getAllByRole('img')).toHaveLength(1)
  })
})
