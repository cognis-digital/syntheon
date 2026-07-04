import { describe, it, expect } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import BreadcrumbBar from '@/components/blocks/breadcrumb-bar'

describe('BreadcrumbBar', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders with default props and shows text content', () => {
    render(<BreadcrumbBar />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText(/breadcrumb/i)).toBeInTheDocument()
  })

  it('applies correct ARIA roles for accessibility', () => {
    render(<BreadcrumbBar />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label')
  })

  it('renders with design tokens applied', () => {
    render(<BreadcrumbBar />)

    // Verify background and text colors are set via CSS classes
    const container = screen.getByRole('navigation')
    expect(container.classList).toContain('bg-background')
    expect(container.classList).toContain('text-foreground')
  })

  it('handles empty state gracefully', () => {
    render(<BreadcrumbBar />)

    // Should not crash with no items
    const nav = screen.getByRole('navigation')
    expect(nav).not.toHaveAttribute('aria-hidden', 'true')
  })
})
