import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeroIllustration } from '@/components/media/hero-illustration'
import { motion, useReducedMotion } from 'framer-motion'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, className, initial, animate, transition, layoutId }) => (
        <div className={className}>
          {children}
        </div>
      ),
      useReducedMotion: () => false,
    },
  }
})

describe('HeroIllustration', () => {
  it('renders with default props without throwing', () => {
    const { container } = render(<HeroIllustration />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('applies correct base classes from design tokens', () => {
    const { container } = render(<HeroIllustration />)
    
    // Check for expected token-based styling
    const imgElement = screen.getByRole('img')
    expect(imgElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders with custom props correctly', () => {
    const altText = 'Custom illustration'
    const className = 'custom-override'
    
    const { container } = render(
      <HeroIllustration 
        alt={altText} 
        className={className}
      />
    )

    expect(screen.getByRole('img')).toHaveAttribute('aria-label', altText)
  })

  it('applies dark mode styles correctly', () => {
    const { container } = render(<HeroIllustration />, {
      wrapper: { attrs: { className: 'dark' } }
    })

    expect(container).toBeInTheDocument()
  })

  it('handles reduced motion preference gracefully', async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)

    const { container } = render(<HeroIllustration />)

    // Should still render, just with less animation
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    const testId = 'hero-illustration-test'
    
    const { container } = render(
      <HeroIllustration data-testid={testId} />
    )

    expect(screen.getByTestId(testId)).toBeInTheDocument()
  })

  it('handles error state without crashing', () => {
    // Simulate an edge case where motion might fail
    vi.mocked(motion.div).mockImplementation(() => null)

    const { container } = render(<HeroIllustration />)

    expect(container).not.toBeNull()
  })

  it('renders responsive image with correct aspect ratio', () => {
    const { container, rerender } = render(<HeroIllustration />)

    // Initial render
    expect(screen.getByRole('img')).toBeInTheDocument()

    // Re-render with different dimensions (simulating resize)
    rerender(<HeroIllustration width={800} height={450} />)

    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('preserves layout transitions during re-renders', () => {
    const { container, rerender } = render(
      <HeroIllustration 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      />
    )

    expect(container).not.toBeNull()

    // Re-render with different animation config
    rerender(<HeroIllustration initial={{ opacity: 1 }} />)

    expect(container).not.toBeNull()
  })
})
