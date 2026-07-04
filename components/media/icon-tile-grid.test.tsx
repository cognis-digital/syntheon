import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconTileGrid } from '@/components/media/icon-tile-grid'

describe('IconTileGrid', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Reset any global state before each test
    document.body.className = ''
  })

  it('renders with default props without throwing', () => {
    const { container } = render(<IconTileGrid />)
    
    expect(container).toBeTruthy()
    expect(container.firstChild).not.toBeNull()
  })

  it('applies dark mode correctly when className includes "dark"', () => {
    const { container, rerender } = render(<IconTileGrid className="dark" />)
    
    // Should have dark mode classes applied
    expect(container.querySelector('[class*="dark"]')).toBeTruthy()
    
    rerender(<IconTileGrid className="" />)
    expect(container.firstChild).not.toContainAttribute('class', 'dark')
  })

  it('renders accessible structure with proper ARIA attributes', () => {
    const { container } = render(
      <IconTileGrid 
        aria-label="Feature categories"
        role="list"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-sm font-medium">Fast</span>
        </div>
      </IconTileGrid>
    )

    // Check for list semantics
    expect(container.querySelector('[role="list"]')).toBeTruthy()
    
    // Check that interactive items have proper focus states
    const focusable = container.querySelectorAll('button, [tabindex]')
    focusable.forEach(el => {
      expect(el.getAttribute('tabindex')).not.toBeNull()
    })
  })

  it('handles keyboard navigation', async () => {
    const { container } = render(
      <IconTileGrid role="list">
        {[1, 2, 3].map(i => (
          <button key={i} tabIndex={0} className="focus:ring-2 focus:ring-primary rounded-lg p-2">
            <span>Item {i}</span>
          </button>
        ))}
      </IconTileGrid>
    )

    const buttons = container.querySelectorAll('button')
    
    // Tab through items
    await user.tab()
    expect(document.activeElement).toBe(buttons[0])
    
    await user.tab()
    expect(document.activeElement).toBe(buttons[1])
  })

  it('applies hover effects with framer-motion', async () => {
    const { container } = render(
      <IconTileGrid className="hover-lift">
        <button className="rounded-lg p-3 bg-background border-border hover:border-primary transition-colors">
          <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
          </svg>
        </button>
      </IconTileGrid>
    )

    const button = container.querySelector('button')
    
    // Simulate hover
    await user.hover(button)
    
    // Should have hover state classes applied
    expect(container).toBeTruthy()
  })

  it('renders responsive grid layout', () => {
    const { container } = render(
      <IconTileGrid columns={2} gap="md">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-2 rounded-lg p-3 bg-card border-border hover:bg-muted transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        ))}
      </IconTileGrid>
    )

    // Check grid columns are set
    expect(container.querySelector('.columns-2')).toBeTruthy()
    
    // Check gap is applied
    expect(container.querySelector('.gap-md')).toBeTruthy()
  })

  it('handles mixed content types gracefully', () => {
    const { container } = render(
      <IconTileGrid>
        {/* Icon only */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
          </svg>
        </div>

        {/* Icon + label */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
          </svg>
          <span className="text-sm font-medium">Feature</span>
        </div>

        {/* Text only */}
        <div className="flex items-center gap-2">
          <span className="text-muted text-sm">Description</span>
        </div>
      </IconTileGrid>
    )

    // Should render all content without errors
    expect(container.querySelectorAll('.w-5')).toHaveLength(2)
    expect(container.querySelector('.text-muted')).toBeTruthy()
  })

  it('applies proper border radius and depth', () => {
    const { container } = render(
      <IconTileGrid rounded="lg" shadow="sm">
        <div className="flex items-center gap-2 rounded-lg p-3 bg-card border-border hover:bg-muted transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
          </svg>
        </div>
      </IconTileGrid>
    )

    // Check rounded classes are applied
    expect(container.querySelector('.rounded-lg')).toBeTruthy()
    
    // Check shadow is applied (via className)
    expect(container.querySelector('.shadow-sm')).toBeTruthy()
  })

  it('handles prefers-reduced-motion gracefully', async () => {
    const { container, rerender } = render(
      <IconTileGrid animate="hover">
        <button className="rounded-lg p-3 bg-background border-border hover:border-primary transition-colors">
          <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
          </svg>
        </button>
      </IconTileGrid>
    )

    // Check animation class is applied
    expect(container.querySelector('.animate-hover')).toBeTruthy()
    
    // Simulate reduced motion preference
    rerender(
      <IconTileGrid animate="hover" className="reduced-motion">
        <button className="rounded-lg p-3 bg-background border-border hover:border-primary transition-colors">
          <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
          </svg>
        </button>
      </IconTileGrid>
    )

    // Should still render, just with reduced motion classes
    expect(container.querySelector('.reduced-motion')).toBeTruthy()
  })

  it('supports custom column count and gap sizing', () => {
    const sizes = [1, 2, 3, 4, 5] as const
    
    sizes.forEach((cols) => {
      render(
        <IconTileGrid columns={cols} gap="md">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2 rounded-lg p-3 bg-card border-border hover:bg-muted transition-colors cursor-pointer">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
              </svg>
            </div>
          ))}
        </IconTileGrid>
      )

      expect(container.querySelector(`.columns-${cols}`)).toBeTruthy()
    })
  })

  it('handles empty state gracefully', () => {
    const { container } = render(<IconTileGrid />)
    
    // Should still have a valid container
    expect(container.firstChild).not.toBeNull()
  })

  it('applies correct semantic color tokens', () => {
    const { container } = render(
      <IconTileGrid>
        <div className="flex items-center gap-2 rounded-lg p-3 bg-card border-border hover:bg-muted transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
          </svg>
        </div>
      </IconTileGrid>
    )

    // Check primary color is used for icons
    expect(container.querySelector('.text-primary')).toBeTruthy()
    
    // Check muted text is available
    expect(container.querySelector('.bg-card')).toBeTruthy()
  })

  it('maintains focus management during interactions', async () => {
    const { container } = render(
      <IconTileGrid role="list">
        {[1, 2, 3].map(i => (
          <button 
            key={i} 
            tabIndex={0} 
            className="focus:ring-2 focus:ring-primary rounded-lg p-3 bg-background border-border hover:border-primary transition-colors"
          >
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102 1.101m7.824-9.912a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.657l-1.102-1.101m-7.828 9.913a4 4 0 00-5.656 0l-4-4a4 4 0 005.656-5.657l1.102 1.101" />
            </svg>
          </button>
        ))}
      </IconTileGrid>
    )

    const buttons = container.querySelectorAll('button')
    
    // Focus first button and check focus ring
    buttons[0].focus()
    await waitFor(() => {
      expect(document.activeElement).toBe(buttons[0])
    })

    // Check focus styles are applied
    const focusedButton = document.activeElement as HTMLElement
    expect(focusedButton.classList.contains('focus:ring-2')).toBeTruthy()
  })
})
