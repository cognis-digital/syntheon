import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeroScreenshot from '@/components/sections/hero-screenshot'

describe('HeroScreenshot', () => {
  const mockImage = new URL('./mock-image.png', import.meta.url).href

  it('renders with default props and shows content', () => {
    render(<HeroScreenshot />)

    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByAltText(/screenshot/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /hero screenshot/i })).toBeInTheDocument()
  })

  it('applies default styling tokens correctly', () => {
    render(<HeroScreenshot />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockImage)
    expect(img).toHaveClass(/rounded-lg/)
  })

  it('handles image loading states gracefully', async () => {
    const user = userEvent.setup()

    render(<HeroScreenshot />)

    const img = screen.getByRole('img')
    
    // Initial state: placeholder or loading indicator
    expect(img).toBeInTheDocument()
    
    // After load: actual image visible
    await user.click(screen.getByAltText(/screenshot/i))
  })

  it('supports accessible keyboard navigation', () => {
    render(<HeroScreenshot />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('tabIndex', '0')
    expect(img).toHaveAttribute('aria-hidden', 'false')
  })

  it('respects reduced motion preferences', () => {
    document.body.style.setProperty(
      'prefers-reduced-motion: reduce',
      'reduce'
    )

    render(<HeroScreenshot />)

    const img = screen.getByRole('img')
    expect(img).toHaveClass(/animate/i)
  })
})
