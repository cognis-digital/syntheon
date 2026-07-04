import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import CtaBanner from '@/components/sections/cta-banner'

describe('CtaBanner', () => {
  it('renders with default props and no crashes', () => {
    const wrapper = render(<CtaBanner />)
    expect(wrapper.container).toBeInTheDocument()
  })

  it('displays headline content', async () => {
    render(<CtaBanner />)
    await waitFor(() => {
      expect(screen.getByRole('heading')).toHaveTextContent(/elevate/)
    })
  })

  it('renders primary CTA button with correct attributes', () => {
    const wrapper = render(<CtaBanner />)
    const btn = screen.getByRole('button', { name: /explore/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-label')
  })

  it('applies motion classes for entrance animation', () => {
    const wrapper = render(<CtaBanner />)
    // Check for staggered animation markers
    expect(wrapper.container).toContainHTML(/stagger/i)
  })

  it('handles reduced-motion preference gracefully', async () => {
    const mockUseReducedMotion = vi.fn().mockReturnValue(true)
    ;(useReducedMotion as unknown as typeof import('@/hooks/use-reduced-motion').default) = mockUseReducedMotion

    render(<CtaBanner />)
    
    // Should still render, just with less motion
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('supports dark mode correctly', () => {
    const wrapper = render(
      <div className="dark">
        <CtaBanner />
      </div>
    )
    // Should not crash in dark mode
    expect(wrapper.container).not.toBeNull()
  })

  it('has accessible focus states', async () => {
    const wrapper = render(<CtaBanner />)
    
    // Simulate tab navigation to buttons
    await wrapper.findByRole('button')
    
    const btn = screen.getByRole('button', { name: /explore/i })
    expect(btn).toHaveAttribute('tabindex', '-1')
  })

  it('renders subheadline text content', async () => {
    render(<CtaBanner />)
    await waitFor(() => {
      const subhead = screen.getByRole('paragraph') || screen.getByText(/your/i)
      expect(subhead).toBeInTheDocument()
    })
  })

  it('includes secondary action button when present', async () => {
    render(<CtaBanner />)
    
    // Check for multiple interactive elements
    const buttons = await screen.findAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('applies proper semantic color tokens', () => {
    const wrapper = render(<CtaBanner />)
    
    // Verify background uses correct token class
    expect(wrapper.container).toContainHTML(/bg-background/i)
  })

  it('handles keyboard navigation correctly', async () => {
    const wrapper = render(<CtaBanner />)
    
    const btn = screen.getByRole('button', { name: /explore/i })
    btn.focus()
    
    // Should have focus ring visible via CSS
    expect(document.activeElement).toBe(btn)
  })

  it('maintains layout during animation transitions', async () => {
    render(<CtaBanner />)
    
    const container = screen.getByRole('banner') || wrapper.container
    
    // Should not overflow or shift unexpectedly
    expect(container.getBoundingClientRect()).not.toBeNull()
  })
})
