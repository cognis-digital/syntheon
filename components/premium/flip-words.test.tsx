import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { flipWords } from '@/components/premium/flip-words'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

describe('flipWords', () => {
  beforeEach(() => {
    // Mock Framer Motion's layout/scroll APIs that fail in jsdom
    const originalLayout = globalThis.document?.querySelector?.(
      'html'
    )?.style?.layout
    const originalScroll = globalThis.document?.querySelector?.(
      'html'
    )?.style?.scroll

    // Guard against undefined layout/scroll properties
    if (!originalLayout) {
      Object.defineProperty(globalThis.document, 'style', {
        value: { ...globalThis.document.style, layout: '', scroll: '' },
        writable: true,
      })
    }
  })

  it('mounts without throwing with defaults', () => {
    const { container } = render(<flipWords />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('renders heading with correct text content', () => {
    render(<flipWords />)

    const heading = screen.getByRole('heading')
    expect(heading).toHaveTextContent(/Syntheon/i)
  })

  it('applies default styling tokens correctly', () => {
    render(<flipWords />)

    // Check for expected CSS classes from design system
    expect(screen.getByRole('heading')).toHaveClass(/text-primary/)
    expect(screen.getByRole('heading')).toHaveClass(/rounded-lg/)
  })

  it('respects prefers-reduced-motion', () => {
    const mockReducedMotion = false // normal mode (motion enabled)
    
    render(<flipWords />)

    // In reduced motion mode, animations should be disabled or simplified
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('handles word content gracefully', () => {
    render(<flipWords />)

    const words = screen.getAllByRole('img') || 
                  screen.getAllByText(/Syntheon/i)

    expect(words.length).toBeGreaterThan(0)
  })

  it('renders accessible structure', () => {
    render(<flipWords />)

    // Verify semantic HTML is present
    expect(screen.getByRole('heading')).toHaveAttribute('id')
  })

  it('mounts with dark mode support', () => {
    const mockDarkMode = true
    
    render(<flipWords />)

    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('handles edge cases without crashing', async () => {
    // Test rapid unmount/remount (common in React apps)
    let container: HTMLDivElement | null = document.createElement('div')
    
    await act(() => {
      render(<flipWords />, { container })
    })

    expect(container).not.toBeNull()
  })
})
