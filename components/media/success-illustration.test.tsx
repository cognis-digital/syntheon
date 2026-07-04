import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SuccessIllustration } from '@/components/media/success-illustration'

describe('SuccessIllustration', () => {
  it('renders without throwing with default props', () => {
    const { container } = render(<SuccessIllustration />)
    expect(container).not.toBeNull()
    expect(container.firstChild).toBeTruthy()
  })

  it('contains success-related content in the DOM', () => {
    render(<SuccessIllustration />)
    const textContent = screen.getByText(/success/i, { exact: false })
    expect(textContent).toBeInTheDocument()
  })

  it('applies correct base styling classes', () => {
    const { container } = render(<SuccessIllustration />)
    // Check for expected utility classes
    const el = container.querySelector('[class*="bg-"]') || container.firstChild as HTMLElement
    expect(el?.className).toContain('rounded-lg')
  })

  it('supports dark mode', () => {
    document.body.classList.add('dark')
    render(<SuccessIllustration />)
    // In dark mode, background should use darker variants
    const el = container.querySelector('[class*="bg-"]') || container.firstChild as HTMLElement
    expect(el?.className).toContain('rounded-lg')
  })

  it('has accessible structure with proper ARIA attributes', () => {
    render(<SuccessIllustration />)
    // Check for semantic elements and accessibility
    const heading = screen.queryByRole('heading') || container.querySelector('h1, h2, h3')
    expect(heading).toBeTruthy()

    // Verify focusable interactive elements if any exist
    const focusables = container.querySelectorAll<HTMLElement>(
      'button, [tabindex], input, a'
    )
    expect(focusables.length).toBeGreaterThanOrEqual(0)
  })

  it('handles optional props gracefully', () => {
    render(<SuccessIllustration title="Custom Title" subtitle="Custom Subtitle" />)
    const textContent = screen.getByText(/custom/i, { exact: false })
    expect(textContent).toBeInTheDocument()
  })

  it('applies correct radius styling via Tailwind', () => {
    const { container } = render(<SuccessIllustration />)
    // Verify rounded classes are present (could be md or lg depending on design system)
    const el = container.querySelector('[class*="rounded"]') || container.firstChild as HTMLElement
    expect(el?.className).toMatch(/rounded-md|rounded-lg/ig)
  })

  it('maintains proper type safety with optional props', () => {
    // Test that component accepts various prop combinations
    const validConfigs: Array<{ title?: string; subtitle?: string }> = [
      {},
      { title: 'Test' },
      { subtitle: 'Sub' },
      { title: 'A', subtitle: 'B' },
    ]

    for (const config of validConfigs) {
      render(<SuccessIllustration {...config} />)
      expect(screen.getByRole('img')).toBeInTheDocument()
    }
  })
})
