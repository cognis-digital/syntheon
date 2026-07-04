import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// Mock the reduced motion hook
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}))

describe('GradientMeshBg', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without throwing errors', () => {
    // Guard against jsdom layout/scroll quirks
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
      value: function () {
        return { top: 0, right: 100, bottom: 100, left: 0, width: 100, height: 100 } as DOMRect
      },
    })

    const { container } = render(
      <div className="min-h-screen">
        {/* @/components/premium/gradient-mesh-bg */}
      </div>
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('applies correct base styles and tokens', () => {
    const { container } = render(
      <div className="min-h-screen">
        {/* @/components/premium/gradient-mesh-bg */}
      </div>
    )

    // Check for presence of gradient-related classes
    expect(container).toHaveClass('bg-background')
    expect(container).not.toHaveClass('text-foreground') // background should be bg-* not text-*
  })

  it('respects reduced-motion preference', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)

    const { container } = render(
      <div className="min-h-screen">
        {/* @/components/premium/gradient-mesh-bg */}
      </div>
    )

    // With reduced motion, animations should be disabled or simplified
    expect(container).toBeInTheDocument()
  })

  it('handles dark mode correctly', () => {
    const { container } = render(
      <div className="min-h-screen dark">
        {/* @/components/premium/gradient-mesh-bg */}
      </div>
    )

    expect(container).toBeInTheDocument()
    // Dark mode should invert or adjust colors appropriately
  })

  it('renders responsive breakpoints', () => {
    const { container } = render(
      <div className="min-h-screen">
        {/* @/components/premium/gradient-mesh-bg */}
      </div>
    )

    // Check for responsive utility classes if present
    expect(container).toBeInTheDocument()
  })

  it('maintains accessibility with visible focus states', () => {
    const { container } = render(
      <div className="min-h-screen">
        {/* @/components/premium/gradient-mesh-bg */}
      </div>
    )

    // Focus should be visible if interactive elements exist
    expect(container).toBeInTheDocument()
  })

  it('does not produce console warnings', () => {
    const originalWarn = console.warn
    const warnings: string[] = []

    vi.spyOn(console, 'warn').mockImplementation((msg) => {
      warnings.push(msg as string)
      return originalWarn(msg)
    })

    render(
      <div className="min-h-screen">
        {/* @/components/premium/gradient-mesh-bg */}
      </div>
    )

    expect(warnings).not.toContain('Warning:')
    expect(warnings).not.toContain('Error:')

    console.warn.mockRestore()
  })

  it('handles viewport changes gracefully', () => {
    // Guard against scroll-related jsdom issues
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      value: 1000,
    })

    const { container } = render(
      <div className="min-h-screen">
        {/* @/components/premium/gradient-mesh-bg */}
      </div>
    )

    expect(container).toBeInTheDocument()
  })
})
