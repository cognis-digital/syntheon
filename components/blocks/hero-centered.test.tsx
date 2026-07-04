import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import heroCentered from '@/components/blocks/hero-centered'

describe('hero-centered', () => {
  it('renders with defaults and contains expected text', () => {
    const { container } = render(<heroCentered />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent(/Syntheon/i)
    expect(screen.getByRole('paragraph')).toBeInTheDocument()
  })

  it('applies correct semantic classes', () => {
    const { container } = render(<heroCentered />)

    // Check for background class
    expect(container.querySelector('[class*="bg-background"]')).toBeInTheDocument()

    // Check for text foreground
    expect(container.querySelector('[class*="text-foreground"]')).toBeInTheDocument()
  })

  it('is accessible with proper heading level', () => {
    const { container } = render(<heroCentered />)

    const heading = screen.getByRole('heading')
    expect(heading).toHaveAttribute('aria-level')
  })
})
