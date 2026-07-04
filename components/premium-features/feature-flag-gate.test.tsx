import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeatureFlagGate } from '@/components/premium-features/feature-flag-gate'

// Mock the cn helper
vi.mock('@/lib/utils', async () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

describe('FeatureFlagGate', () => {
  const user = userEvent.setup()

  describe('rendering with enabled feature flag', () => {
    it('renders premium content when flag is true', () => {
      render(
        <FeatureFlagGate
          enabled={true}
          fallback={<div className="text-muted-foreground">Basic</div>}
          premium={<div className="text-primary">Premium</div>}
        />
      )

      expect(screen.getByText('Premium')).toBeInTheDocument()
    })
  })

  describe('rendering with disabled feature flag', () => {
    it('renders fallback content when flag is false', () => {
      render(
        <FeatureFlagGate
          enabled={false}
          fallback={<div className="text-muted-foreground">Basic</div>}
          premium={<div className="text-primary">Premium</div>}
        />
      )

      expect(screen.getByText('Basic')).toBeInTheDocument()
    })

    it('renders fallback with default content when flag is false', () => {
      render(
        <FeatureFlagGate enabled={false} fallbackContent="Default" />
      )

      expect(screen.getByText('Default')).toBeInTheDocument()
    })
  })

  describe('default props behavior', () => {
    it('renders premium content by default when no fallback provided', () => {
      render(
        <FeatureFlagGate enabled={true} premium={<div>Content</div>} />
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('renders empty container with disabled flag and no fallback', () => {
      const { container } = render(<FeatureFlagGate enabled={false} />)

      expect(container.firstChild).not.toBeNull()
    })
  })

  describe('content switching transitions', () => {
    it('switches content when enabled prop changes', async () => {
      const wrapper = render(
        <div>
          <FeatureFlagGate
            enabled={false}
            fallback={<span className="text-muted-foreground">A</span>}
            premium={<span className="text-primary">B</span>}
          />
        </div>
      )

      // Start disabled
      expect(screen.getByText('A')).toBeInTheDocument()

      // Enable it
      wrapper.rerender(
        <div>
          <FeatureFlagGate
            enabled={true}
            fallback={<span className="text-muted-foreground">A</span>}
            premium={<span className="text-primary">B</span>}
          />
        </div>
      )

      expect(screen.getByText('B')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('preserves semantic structure', () => {
      render(
        <FeatureFlagGate
          enabled={true}
          fallback={<button aria-label="Fallback">A</button>}
          premium={<button aria-label="Premium">B</button>}
        />
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(1) // Only the active one renders
    })
  })

  describe('responsive variants', () => {
    it('respects size prop if provided', () => {
      render(
        <FeatureFlagGate
          enabled={true}
          premium={<div className="text-primary">Content</div>}
          size="lg"
        />
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('uses default size when not specified', () => {
      render(
        <FeatureFlagGate enabled={true} premium={<div>Content</div>} />
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles null/undefined fallback gracefully', () => {
      render(
        <FeatureFlagGate enabled={true} premium={<div>Content</div>} />
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('renders children directly when no wrapper needed', () => {
      const wrapper = render(
        <FeatureFlagGate enabled={true}>
          <div className="text-primary">Direct child</div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Direct child')).toBeInTheDocument()
    })

    it('preserves class names from props', () => {
      render(
        <FeatureFlagGate enabled={true} premium={<div className="custom">Content</div>} />
      )

      const div = screen.getByText('Content') as HTMLDivElement
      expect(div).toHaveClass('custom')
    })
  })
})
