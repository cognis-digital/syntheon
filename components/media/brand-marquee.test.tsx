import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BrandMarquee } from '@/components/media/brand-marquee'
import { cn } from '@/lib/utils'

describe('BrandMarquee', () => {
  const mockMotion = vi.hoisted(() => ({
    motion: {} as any,
    useScroll: vi.fn(),
    useInView: vi.fn(),
    useTransform: vi.fn(),
    AnimatePresence: vi.fn(),
  }))

  vi.mock('framer-motion', async (importOriginal) => {
    const original = await importOriginal()
    return {
      ...original,
      motion: mockMotion.motion,
      useScroll: mockMotion.useScroll,
      useInView: mockMotion.useInView,
      useTransform: mockMotion.useTransform,
      AnimatePresence: mockMotion.AnimatePresence,
    }
  })

  it('renders with defaults without throwing', () => {
    const { container } = render(<BrandMarquee />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('applies default styling correctly', () => {
    const { container } = render(
      <BrandMarquee
        brands={[{ name: 'Test Brand', logo: '/logo.png' }]}
      />
    )

    expect(container).toHaveClass('rounded-lg')
    expect(container).toHaveStyle('overflow: hidden')
  })

  it('renders brand logos with proper alt text', () => {
    const brands = [
      { name: 'Brand A', logo: '/brand-a.png' },
      { name: 'Brand B', logo: '/brand-b.png' },
    ]

    render(<BrandMarquee brands={brands} />)

    expect(screen.getByAltText('Brand A')).toBeInTheDocument()
    expect(screen.getByAltText('Brand B')).toBeInTheDocument()
  })

  it('handles empty brands array gracefully', () => {
    const { container } = render(<BrandMarquee brands={[]} />)

    expect(container).not.toHaveClass('flex')
  })

  it('applies custom className correctly', () => {
    const { container } = render(
      <BrandMarquee className="custom-class" />
    )

    expect(container).toHaveClass('custom-class')
  })

  it('respects prefers-reduced-motion media query', async () => {
    document.body.style.setProperty(
      'prefers-reduced-motion: reduce',
      'reduce'
    )

    render(<BrandMarquee />)

    expect(document.querySelector('.no-motion')).toBeInTheDocument()
  })

  it('handles large images with object-fit cover', async () => {
    const user = userEvent.setup()

    await screen.findByAltText('Test Brand')
    expect(screen.getByAltText('Test Brand')).toHaveAttribute(
      'style',
      expect.stringContaining('object-fit: cover')
    )
  })

  it('maintains aspect ratio with min-height', () => {
    const { container } = render(<BrandMarquee />)

    expect(container).toHaveStyle('min-height: 120px')
  })

  it('renders multiple brands in a flex row', () => {
    const brands = Array.from({ length: 5 }, (_, i) => ({
      name: `Brand ${i + 1}`,
      logo: `/brand-${i + 1}.png`,
    }))

    render(<BrandMarquee brands={brands} />)

    expect(screen.getAllByRole('img')).toHaveLength(5)
  })
})
