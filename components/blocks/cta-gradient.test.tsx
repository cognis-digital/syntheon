import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CTAGradient from '@/components/blocks/cta-gradient'

describe('CTAGradient', () => {
  it('renders with default props and correct text content', () => {
    const { container } = render(<CTAGradient />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button').textContent).toBe('Get Started')
  })

  it('applies correct default styles including background gradient', () => {
    const { container } = render(<CTAGradient />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gradient-to-r')
    expect(button).toHaveClass('text-white')
  })

  it('accepts custom text content', () => {
    const { container } = render(<CTAGradient text="Custom Text" />)
    
    expect(screen.getByRole('button').textContent).toBe('Custom Text')
  })

  it('applies custom className correctly', () => {
    const { container } = render(
      <CTAGradient className="border-2 border-blue-500" />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-2')
  })

  it('respects dark mode context', () => {
    document.body.classList.add('dark')
    render(<CTAGradient />)
    
    const button = screen.getByRole('button')
    // Text should remain white in dark mode for CTA buttons
    expect(button).toHaveClass('text-white')
  })

  it('passes through all forwarded props', () => {
    const { container } = render(
      <CTAGradient 
        href="/test" 
        target="_blank" 
        rel="noopener noreferrer"
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('href', '/test')
    expect(button).toHaveAttribute('target', '_blank')
  })

  it('has proper ARIA attributes for accessibility', () => {
    render(<CTAGradient />)
    
    const button = screen.getByRole('button')
    // Should have a name from text content
    expect(button.getAttribute('aria-label')).toBe('Get Started')
  })
})
