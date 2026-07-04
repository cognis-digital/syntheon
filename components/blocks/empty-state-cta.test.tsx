import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyStateCTA from '@/components/blocks/empty-state-cta'

describe('EmptyStateCTA', () => {
  it('renders with default props and expected text content', () => {
    const { container } = render(<EmptyStateCTA />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent(/empty/i)
    expect(screen.getByRole('button')).toHaveTextContent(/action/i)
  })

  it('applies correct semantic classes via cn helper', () => {
    const { container } = render(<EmptyStateCTA />)
    
    // Verify background uses bg-muted or similar token
    expect(container.querySelector('[class*="bg-muted"]')).toBeInTheDocument()
    
    // Verify text uses foreground tokens
    expect(container.querySelector('.text-foreground')).toBeInTheDocument()
  })

  it('has accessible button with proper ARIA attributes', () => {
    render(<EmptyStateCTA />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAccessibleName()
  })

  it('renders without errors in dark mode context', () => {
    // Simulate dark mode by providing a dark background container
    const wrapper = render(
      <div className="dark bg-background">
        <EmptyStateCTA />
      </div>
    )
    
    expect(wrapper).not.toHaveError()
  })

  it('handles optional props gracefully', () => {
    // Test with custom title prop (should not break)
    render(<EmptyStateCTA title="Custom Title" />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
