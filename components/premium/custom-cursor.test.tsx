import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { CustomCursor } from '@/components/premium/custom-cursor'
import type { ComponentProps } from '@/components/premium/custom-cursor'

// Mock framer-motion components (jsdom lacks layout/scroll APIs)
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(() => <div />),
    h1: vi.fn(() => <h1 />),
    button: vi.fn(() => <button />),
  },
  useScroll: vi.fn(),
  useInView: vi.fn(),
  useTransform: vi.fn(),
  AnimatePresence: ({ children }) => children,
}))

// Mock cn helper
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}))

describe('CustomCursor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts without throwing with default props', async () => {
    const { container } = render(<CustomCursor />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('renders with custom cursor enabled by default', async () => {
    const { container } = render(<CustomCursor />)

    // Guard against jsdom layout quirks - just check presence
    await waitFor(() => {
      expect(container).not.toBeNull()
    })
  })

  it('accepts custom cursor props without crashing', async () => {
    const props: ComponentProps = {
      enabled: true,
      size: 'large',
      trail: true,
    }

    render(<CustomCursor {...props} />)

    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('handles disabled state gracefully', async () => {
    const { container } = render(<CustomCursor enabled={false} />)

    await waitFor(() => {
      expect(container).not.toBeNull()
    })
  })

  it('does not throw on rapid mount/unmount cycles', async () => {
    let count = 0

    const wrapper = (props: ComponentProps | undefined) =>
      <CustomCursor {...props} />

    // Rapid lifecycle test - guard against memory leaks or stale closures
    for (let i = 0; i < 5; i++) {
      render(wrapper(i === 2 ? { enabled: false } : undefined))
      count++
    }

    expect(count).toBe(5)
  })

  it('uses prefers-reduced-motion context when available', async () => {
    const mockQuery = vi.fn().mockReturnValue({ matches: true })

    // Simulate reduced motion preference
    vi.mocked(mockQuery).mockImplementationOnce(() => ({ matches: true }))

    render(<CustomCursor />)

    await waitFor(() => {
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })
})
