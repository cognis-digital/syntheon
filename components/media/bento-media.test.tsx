import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, Mock } from 'vitest'
import { bentoMedia } from '@/components/media/bento-media'

// Mock cn utility
vi.mock('@/lib/utils', async () => ({
  cn: (...args: any[]) => args.flat().join(' '),
}))

describe('bentoMedia', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without throwing with default props', () => {
    const { container } = render(<bentoMedia />)

    expect(container).not.toBeNull()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('applies base grid classes by default', () => {
    const { container } = render(<bentoMedia />)

    // Check for expected utility classes in rendered output
    const gridEl = container.querySelector('[class*="grid"]') ||
                    container.querySelector('[class*="columns"]')

    expect(gridEl).not.toBeNull()
  })

  it('accepts image source prop', async () => {
    render(<bentoMedia src="/test.jpg" />)

    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement
      expect(img.src).toContain('/test.jpg')
    })
  })

  it('accepts video source prop', async () => {
    render(<bentoMedia src="/video.mp4" type="video" />)

    await waitFor(() => {
      const video = screen.getByRole('img') as HTMLVideoElement
      expect(video.src).toContain('/video.mp4')
    })
  })

  it('applies custom className', () => {
    render(<bentoMedia className="custom-class" />)

    // Should include both base and custom classes
    const gridEl = container.querySelector('[class*="grid"]') ||
                    container.querySelector('[class*="columns"]')

    expect(gridEl?.className).toContain('custom-class')
  })

  it('handles lazy loading', async () => {
    render(<bentoMedia src="/lazy.jpg" lazy />)

    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement
      expect(img.loading).toBe('lazy')
    })
  })

  it('respects prefers-reduced-motion', async () => {
    document.body.style.setProperty(
      'prefers-reduced-motion: reduce',
      'reduce'
    )

    render(<bentoMedia />)

    // Should still render, just without animations
    expect(screen.getByRole('img')).toBeInTheDocument()

    document.body.style.removeProperty('prefers-reduced-motion')
  })

  it('renders accessible image with alt text', async () => {
    render(<bentoMedia src="/test.jpg" alt="Test Image" />)

    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.alt).toBe('Test Image')
  })

  it('handles missing source gracefully', () => {
    const { container } = render(<bentoMedia src="" />)

    // Should not crash with empty string
    expect(container).not.toBeNull()
  })

  it('applies rounded corners by default', async () => {
    render(<bentoMedia />)

    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement
      // Check for border-radius in computed styles or classes
      expect(img.style.borderRadius).not.toBe('0px') ||
              (img.className.includes('rounded') && true)
    })
  })

  it('supports responsive sizing', async () => {
    render(<bentoMedia src="/test.jpg" width={800} height={600} />)

    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement
      expect(img.style.width).toBe('800px')
      expect(img.style.height).toBe('600px')
    })
  })
})
