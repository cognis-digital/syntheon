import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import SecurityBadges from '@/components/blocks/security-badges'

describe('SecurityBadges', () => {
  it('renders without crashing with default props', () => {
    render(<SecurityBadges />)
    
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByText(/secure/)).toBeInTheDocument()
  })

  it('renders all badge items with correct structure', () => {
    const { container } = render(<SecurityBadges />)
    
    // Verify the badges are rendered as list items
    const badgeItems = screen.getAllByRole('listitem')
    expect(badgeItems).toHaveLength(3)

    // Check each badge has proper heading structure
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings).toHaveLength(3)
  })

  it('applies correct ARIA roles and accessibility attributes', () => {
    render(<SecurityBadges />)

    // Verify the container has proper semantic structure
    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-label', /security badges/i)

    // Each badge should be focusable and have visible labels
    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      expect(item).toHaveFocusableElement()
      expect(within(item).getByRole('heading')).toBeInTheDocument()
    })
  })

  it('renders with dark mode support', () => {
    render(<SecurityBadges />, { wrapper: { children: ['<div class="dark">'] } })

    const list = screen.getByRole('list')
    expect(list).toHaveClass(/rounded/i)
    expect(list).toHaveClass(/border/i)
  })

  it('applies correct Tailwind utility classes', () => {
    render(<SecurityBadges />)

    // Check for expected design tokens in the rendered output
    const list = screen.getByRole('list')
    
    // Verify semantic class names are present
    expect(list).toHaveClass(/bg-card/i)
    expect(list).toHaveClass(/border-border/i)
  })
})
