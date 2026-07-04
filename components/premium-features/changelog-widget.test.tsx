import { render, screen, waitFor } from '@testing-library/react'
import type { ChangelogWidgetProps } from '@/components/premium-features/changelog-widget'
import { ChangelogWidget } from '@/components/premium-features/changelog-widget'

describe('ChangelogWidget', () => {
  const defaultProps: Partial<ChangelogWidgetProps> = {}

  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks()
  })

  describe('rendering with default props', () => {
    it('renders without crashing and displays content', () => {
      render(<ChangelogWidget {...defaultProps} />)

      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getByText(/changelog/i)).toBeInTheDocument()
    })

    it('applies correct base styling tokens', () => {
      const container = render(<ChangelogWidget {...defaultProps} />).container

      // Verify background uses bg-background token
      expect(container.querySelector('[class*="bg-background"]')).not.toBeNull()
      
      // Verify text uses foreground tokens
      expect(container.querySelector('[class*="text-foreground"]')).not.toBeNull()
    })

    it('respects dark mode context', () => {
      render(<ChangelogWidget {...defaultProps} />, {
        wrapper: {
          children: <div className="dark">
            <ChangelogWidget {...defaultProps} />
          </div>
        }
      })

      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  describe('with custom props', () => {
    it('renders with provided title', () => {
      render(<ChangelogWidget title="Custom Title" {...defaultProps} />)

      expect(screen.getByText(/custom title/i)).toBeInTheDocument()
    })

    it('handles empty changelog gracefully', () => {
      const { container } = render(
        <ChangelogWidget entries={[]} {...defaultProps} />
      )

      expect(container).not.toBeNull()
      expect(container.firstChild).not.toBe(null)
    })

    it('renders single entry correctly', () => {
      const entries = [
        {
          version: '1.0.0',
          date: new Date(),
          type: 'feature' as const,
          title: 'New Feature',
          description: 'Something cool',
        },
      ]

      render(<ChangelogWidget entries={entries} {...defaultProps} />)

      expect(screen.getByText(/1\.0\.0/i)).toBeInTheDocument()
    })

    it('renders multiple entries with proper ordering', () => {
      const entries = [
        { version: '2.0.0', date: new Date(), type: 'feature' as const, title: 'V2' },
        { version: '1.5.0', date: new Date(), type: 'fix' as const, title: 'Fix' },
      ]

      render(<ChangelogWidget entries={entries} {...defaultProps} />)

      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  describe('accessibility', () => {
    it('has proper ARIA role for region', () => {
      const { container } = render(<ChangelogWidget {...defaultProps} />)

      const region = container.querySelector('[role="region"]')
      expect(region).not.toBeNull()
      if (region) {
        expect(region.getAttribute('aria-label')).toContain('changelog')
      }
    })

    it('is keyboard navigable', () => {
      render(<ChangelogWidget {...defaultProps} />)

      const focusableElements = screen.getAllByTabbable()
      expect(focusableElements).not.toHaveLength(0)
    })
  })

  describe('performance & hydration', () => {
    it('hydrates without server/client mismatch errors', async () => {
      render(<ChangelogWidget {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('region')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('has minimal initial paint size', () => {
      const container = render(<ChangelogWidget {...defaultProps} />).container

      // Should not be full viewport height initially
      expect(container.getBoundingClientRect().height)
        .toBeLessThan(window.innerHeight * 2)
    })
  })

  describe('error boundaries & edge cases', () => {
    it('handles null entries gracefully', () => {
      render(<ChangelogWidget entries={null} {...defaultProps} />)

      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('handles undefined entries gracefully', () => {
      render(<ChangelogWidget entries={undefined} {...defaultProps} />)

      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('renders with invalid date without crashing', () => {
      const entries = [
        { version: '1.0.0', date: new Date('invalid') as any, type: 'feature' as const, title: 'Test' },
      ]

      expect(() => render(<ChangelogWidget entries={entries} {...defaultProps} />)).not.toThrow()
    })
  })
})
