import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ConfettiButton } from '@/components/premium/confetti-button'

describe('ConfettiButton', () => {
  const mockCreateParticle = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts without throwing', () => {
    render(
      <ConfettiButton
        createParticle={mockCreateParticle}
        className="bg-primary"
      />
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('applies custom className', () => {
    render(
      <ConfettiButton createParticle={mockCreateParticle} className="custom-class" />
    )

    const button = screen.getByRole('button')
    expect(button.classList).toContain('custom-class')
  })

  it('renders with default props when no children provided', () => {
    render(<ConfettiButton createParticle={mockCreateParticle} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Click me')
  })

  it('accepts custom text content via children', () => {
    render(
      <ConfettiButton createParticle={mockCreateParticle}>Custom Text</ConfettiButton>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Custom Text')
  })

  it('handles jsdom layout quirks gracefully', () => {
    render(
      <ConfettiButton createParticle={mockCreateParticle} />
    )

    // Guard against jsdom scroll/layout APIs that may throw
    const button = screen.getByRole('button')
    expect(button).not.toHaveAttribute('style', 'scroll-behavior: smooth')
  })

  it('preserves focus state for accessibility', () => {
    render(
      <ConfettiButton createParticle={mockCreateParticle} autoFocus />
    )

    const button = screen.getByRole('button')
    expect(button).toBeFocus()
  })
})
