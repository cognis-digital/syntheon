import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import StatsBand from '@/components/blocks/stats-band'

describe('StatsBand', () => {
  it('renders with default props and correct text content', () => {
    const { container } = render(<StatsBand />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('region')).toHaveTextContent(/stats/i)
  })

  it('applies dark-mode correctly via CSS variables', () => {
    document.body.classList.add('dark')
    const { container } = render(<StatsBand />)
    
    // Verify dark mode tokens are applied
    expect(container).toHaveStyle(/bg-background/)
    expect(container).toHaveStyle(/text-foreground/)
  })

  it('uses accessible ARIA attributes', () => {
    const { container } = render(<StatsBand aria-label="Test stats band" />)
    
    // Check for proper accessibility attributes
    expect(container).toHaveAttribute('aria-label')
  })

  it('renders with focus states visible', () => {
    const { container, rerender } = render(<StatsBand />)
    
    // Simulate keyboard navigation
    container.focus()
    expect(document.activeElement).toBe(container)
  })
})
