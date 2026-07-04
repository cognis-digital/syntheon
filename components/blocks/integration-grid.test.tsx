import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import IntegrationGrid from '@/components/blocks/integration-grid'

describe('IntegrationGrid', () => {
  it('renders with default props and expected text content', () => {
    const { container } = render(<IntegrationGrid />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('grid')).toBeInTheDocument()
    
    // Verify key text elements exist
    expect(screen.getByText(/integration/i)).toBeInTheDocument()
  })

  it('applies correct ARIA roles for accessibility', () => {
    render(<IntegrationGrid />)
    
    const grid = screen.getByRole('grid')
    expect(grid).toHaveAttribute('aria-label')
  })

  it('renders interactive elements with proper focus states', async () => {
    render(<IntegrationGrid />)
    
    // Check for focusable elements
    const buttons = screen.getAllByRole('button')
    buttons.forEach(btn => {
      expect(btn).toHaveAttribute('tabindex')
    })
  })

  it('supports dark mode via CSS variables', () => {
    document.body.classList.add('dark')
    
    render(<IntegrationGrid />)
    
    // Verify dark mode classes are applied
    const grid = screen.getByRole('grid')
    expect(grid).toHaveClass(/dark-?/i)
  })

  it('renders responsive layout correctly', () => {
    render(<IntegrationGrid />)
    
    // Check for responsive utility classes
    const container = screen.getByRole('grid')
    expect(container).toHaveClass(/responsive|flex/i)
  })
})
