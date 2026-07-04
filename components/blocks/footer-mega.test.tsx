import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { footerMega } from '@/components/blocks/footer-mega'

describe('footer-mega', () => {
  const renderFooter = (props: Partial<typeof footerMega> = {}) => {
    return render(footerMega({ ...footerMega.props, ...props }))
  }

  it('renders with default props without crashing', () => {
    renderFooter()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders expected footer content text', () => {
    const { container } = renderFooter()
    
    // Check for common footer sections
    expect(container).toHaveTextContent(/©/)
    expect(container).toHaveTextContent(/Syntheon/)
  })

  it('has proper ARIA roles and accessibility attributes', () => {
    const { container, getByRole } = renderFooter()
    
    // Contentinfo role for footer
    const footer = getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    
    // Check focusable elements have visible focus rings
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"])'
    )
    
    focusableElements.forEach((el) => {
      el.focus()
      expect(el).toHaveClass(/focus-ring|ring/)
    })
  })

  it('supports dark mode', async () => {
    const user = userEvent.setup()
    renderFooter()
    
    // Toggle dark mode
    await user.click(screen.getByRole('button', { name: /dark/i }))
    
    expect(document.documentElement).toHaveAttribute('class', 'dark')
  })

  it('has visible focus states for keyboard navigation', () => {
    const { container } = renderFooter()
    
    // Simulate tab key presses
    container.querySelectorAll<HTMLElement>('button, a').forEach((el) => {
      el.focus()
      expect(el).toHaveClass(/focus-ring|ring/)
    })
  })

  it('renders nested section with proper hierarchy', () => {
    const { container } = renderFooter()
    
    // Verify semantic HTML structure
    const sections = container.querySelectorAll<HTMLElement>('section, div[role="region"]')
    expect(sections).toHaveLengthGreaterThan(0)
  })

  it('handles empty state gracefully', () => {
    const { container } = renderFooter({ links: [] })
    
    // Should still have footer structure even with no links
    expect(container).toHaveTextContent(/©/)
  })
})
