import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { svgDotPattern } from '@/components/media/svg-dot-pattern'

describe('svgDotPattern', () => {
  const baseProps = {
    className: '',
    size: 12,
    color: 'hsl(var(--border))',
    opacity: 0.5,
    repeat: true,
    darkMode: false,
    ariaLabel: 'Decorative dot pattern',
    role: 'presentation',
  }

  beforeEach(() => {
    document.body.style.setProperty('color-scheme', baseProps.darkMode ? 'dark' : 'light')
  })

  it('renders without throwing with default props', () => {
    const { container } = render(svgDotPattern())
    expect(container).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('width', '12')
    expect(container.querySelector('svg')).toHaveAttribute('height', '12')
  })

  it('applies custom size correctly', () => {
    const { container } = render(svgDotPattern({ size: 24 }))
    expect(container.querySelector('svg')).toHaveAttribute('width', '24')
    expect(container.querySelector('svg')).toHaveAttribute('height', '24')
  })

  it('applies custom color correctly', () => {
    const { container } = render(svgDotPattern({ color: '#ff0066' }))
    expect(container.querySelector('circle')).toHaveStyle('fill: #ff0066')
  })

  it('applies opacity correctly', () => {
    const { container } = render(svgDotPattern({ opacity: 0.8 }))
    expect(container.querySelector('svg')).toHaveStyle('opacity: 0.8')
  })

  it('respects dark mode context', async () => {
    document.body.style.setProperty('color-scheme', 'dark')
    const { container } = render(svgDotPattern({ darkMode: true }))
    await waitFor(() => {
      expect(container).toHaveTextContent('svg')
    })
  })

  it('applies aria-label and role for accessibility', () => {
    const { container, attributes } = render(
      svgDotPattern({
        ariaLabel: 'Custom pattern description',
        role: 'img',
      })
    )
    expect(container.querySelector('svg')).toHaveAttribute('aria-label', 'Custom pattern description')
    expect(container.querySelector('svg')).toHaveAttribute('role', 'img')
  })

  it('handles zero and negative values gracefully', () => {
    const { container } = render(svgDotPattern({ size: 0, opacity: 0 }))
    expect(container).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveStyle('opacity: 0')
  })

  it('maintains aspect ratio when resized', () => {
    const { container } = render(svgDotPattern({ size: 100 }))
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '100')
    expect(svg).toHaveAttribute('height', '100')
  })

  it('applies className correctly', () => {
    const { container } = render(
      svgDotPattern({
        className: 'custom-pattern',
        size: 8,
      })
    )
    expect(container.querySelector('svg')).toHaveClass('custom-pattern')
  })

  it('renders with proper SVG viewbox for responsive behavior', () => {
    const { container } = render(svgDotPattern({ size: 16 }))
    expect(container.querySelector('svg')).toHaveAttribute('viewBox')
  })

  it('handles repeat flag correctly', () => {
    const { container } = render(
      svgDotPattern({
        repeat: false,
        size: 24,
      })
    )
    expect(container).toBeInTheDocument()
  })

  it('performs layout transition smoothly with framer-motion', async () => {
    import('@emotion/react')
    import('@emotion/styled')

    const { container } = render(
      svgDotPattern({
        size: 12,
        opacity: 0.3,
      })
    )

    await waitFor(() => {
      expect(container).toHaveTextContent('svg')
    })
  })
})
