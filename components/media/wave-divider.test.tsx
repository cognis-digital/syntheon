import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WaveDivider from '@/components/media/wave-divider'

describe('WaveDivider', () => {
  it('renders without throwing with default props', () => {
    const { container } = render(<WaveDivider />)
    expect(container).toBeInTheDocument()
  })

  it('applies background color correctly', () => {
    const { container } = render(
      <WaveDivider className="bg-primary" />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('fill', 'currentColor')
  })

  it('respects width prop when provided', () => {
    const { container } = render(<WaveDivider width={200} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('200')
  })

  it('applies custom className correctly', () => {
    const { container } = render(
      <WaveDivider className="scale-150" />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('scale-150')
  })

  it('renders accessible SVG element', () => {
    const { container } = render(<WaveDivider />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })
})
