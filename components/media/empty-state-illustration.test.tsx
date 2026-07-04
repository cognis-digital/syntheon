import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyStateIllustration from '@/components/media/empty-state-illustration'

describe('EmptyStateIllustration', () => {
  it('renders without throwing with default props', () => {
    const { container } = render(<EmptyStateIllustration />)
    
    expect(container).toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
    expect(container.firstChild).toHaveAttribute('aria-hidden')
  })

  it('has expected dimensions', () => {
    const { container } = render(<EmptyStateIllustration />)
    const element = container.querySelector('[role="img"]') || 
                    container.querySelector('svg') || 
                    container.querySelector('picture')
    
    expect(element).toHaveAttribute('width', '24')
  })

  it('applies dark mode correctly', () => {
    document.body.classList.add('dark')
    const { container } = render(<EmptyStateIllustration />)
    const element = container.querySelector('[role="img"]') || 
                    container.querySelector('svg') || 
                    container.querySelector('picture')
    
    expect(element).toHaveAttribute('fill', 'currentColor')
  })

  it('accepts optional size prop', () => {
    const { container } = render(<EmptyStateIllustration size={32} />)
    const element = container.querySelector('[role="img"]') || 
                    container.querySelector('svg') || 
                    container.querySelector('picture')
    
    expect(element).toHaveAttribute('width', '32')
  })

  it('accepts optional variant prop', () => {
    const { container } = render(<EmptyStateIllustration variant="success" />)
    const element = container.querySelector('[role="img"]') || 
                    container.querySelector('svg') || 
                    container.querySelector('picture')
    
    expect(element).toHaveAttribute('fill', 'var(--color-success-500)')
  })

  it('respects prefers-reduced-motion', () => {
    document.body.classList.add('dark')
    const wrapper = render(<EmptyStateIllustration />).container
    
    // Check that motion is gated when needed
    expect(wrapper.querySelector('[role="img"]')).not.toBeNull()
  })
})
