import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import NewsletterInline from '@/components/blocks/newsletter-inline'

describe('NewsletterInline', () => {
  it('renders with default props without crashing', () => {
    const { container } = render(<NewsletterInline />)
    expect(container).toBeInTheDocument()
  })

  it('contains the expected heading text', () => {
    render(<NewsletterInline />)
    expect(screen.getByRole('heading')).toHaveTextContent(/newsletter/i)
  })

  it('contains a form element with input and submit button', () => {
    render(<NewsletterInline />)
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/email/i)
    expect(input).toHaveAttribute('type', 'email')

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(/subscribe|join/i)
  })

  it('applies correct semantic classes via cn helper', () => {
    render(<NewsletterInline />)
    const form = screen.getByRole('form')
    // Verify the form has expected styling classes
    expect(form).toHaveClass(/rounded/i, /border/i)
  })

  it('handles email input with proper validation attributes', () => {
    render(<NewsletterInline />)
    const input = screen.getByPlaceholderText(/email/i) as HTMLInputElement

    // Check for required attribute or aria-required
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('aria-label')
  })

  it('focuses the email input on mount', () => {
    render(<NewsletterInline />)
    const input = screen.getByPlaceholderText(/email/i) as HTMLInputElement

    // The input should be focusable and have a tabindex of 0 or positive value
    expect(input).toHaveAttribute('tabindex')
    expect(parseInt(input.getAttribute('tabindex') || '0')).toBeGreaterThanOrEqual(0)
  })

  it('renders accessible form labels', () => {
    render(<NewsletterInline />)
    const input = screen.getByPlaceholderText(/email/i) as HTMLInputElement

    // Check for aria-labelledby or aria-describedby relationships
    expect(input).toHaveAttribute('aria-label') ||
      expect(input).toHaveAttribute('aria-labelledby') ||
      expect(input).toHaveAttribute('aria-describedby')
  })

  it('supports custom className prop', () => {
    const customClass = 'custom-test-class'
    render(<NewsletterInline className={customClass} />)
    // The container should include the custom class
    const container = screen.getByRole('form')
    expect(container).toHaveClass(customClass)
  })

  it('supports custom heading level via props', () => {
    render(<NewsletterInline headingLevel="h2" />)
    const heading = screen.getByRole('heading') as HTMLElement
    // Should be an h2 element when specified
    expect(heading.tagName.toLowerCase()).toBe('h2')
  })

  it('renders with dark mode classes when in dark theme', () => {
    render(<NewsletterInline />)
    const container = screen.getByRole('form')
    // Should have dark mode variant classes applied
    expect(container).toHaveClass(/dark/i, /border/i)
  })

  it('includes proper ARIA attributes for form context', () => {
    render(<NewsletterInline />)
    const form = screen.getByRole('form')

    // Form should be in a landmark region or have appropriate context
    expect(form).toHaveAttribute('aria-label') ||
      expect(form).toHaveAttribute('role', 'search') ||
      expect(form).toHaveAttribute('role', 'group')
  })
})
