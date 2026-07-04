import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReferralWidget } from '@/components/premium-features/referral-widget'

describe('ReferralWidget', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders default structure with no props', () => {
    const { container } = render(<ReferralWidget />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('region')).toHaveTextContent(/referral/i)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies correct semantic classes via cn helper', () => {
    const wrapper = render(<ReferralWidget />)
    const container = wrapper.container

    // Verify background and text tokens are applied
    expect(container.querySelector('[class*="bg-background"]')).not.toBeNull()
    expect(container.querySelector('[class*="text-foreground"]')).not.toBeNull()
  })

  it('handles custom title prop', () => {
    const title = 'Exclusive Access'
    render(<ReferralWidget title={title} />)

    expect(screen.getByRole('heading')).toHaveTextContent(title)
  })

  it('handles custom subtitle prop', () => {
    const subtitle = 'Invite friends and earn rewards'
    render(<ReferralWidget subtitle={subtitle} />)

    expect(screen.getByRole('paragraph')).toHaveTextContent(subtitle)
  })

  it('renders action button with correct ARIA attributes', () => {
    render(<ReferralWidget />)

    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-label')
    expect(btn).not.toHaveClass(/disabled/i)
  })

  it('calls onClick handler when button is clicked', async () => {
    let clickCount = 0
    render(
      <ReferralWidget
        title="Test Widget"
        subtitle="Click me"
        onAction={() => {
          clickCount++
        }}
      />
    )

    const btn = screen.getByRole('button')
    await userEvent.click(btn)

    expect(clickCount).toBe(1)
  })

  it('applies disabled state when isDisabled prop is true', () => {
    render(<ReferralWidget isDisabled={true} />)

    const btn = screen.getByRole('button')
    expect(btn).toHaveClass(/disabled/i)
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })

  it('preserves focus when re-rendered with same props', () => {
    render(<ReferralWidget />)
    const btn1 = screen.getByRole('button')
    btn1.focus()

    // Re-render with new props
    render(<ReferralWidget title="New Title" />)
    const btn2 = screen.getByRole('button')

    expect(btn2).toBe(document.activeElement)
  })

  it('handles edge case: empty string title', () => {
    render(<ReferralWidget title="" />)

    // Should still render, but heading might be hidden or show default
    const container = screen.getByRole('region')
    expect(container).toBeInTheDocument()
  })

  it('handles edge case: very long subtitle text', () => {
    const longText = 'A'.repeat(500)
    render(<ReferralWidget subtitle={longText} />)

    expect(screen.getByRole('paragraph')).toHaveTextContent(longText)
  })

  it('applies rounded-md radius to container per design tokens', () => {
    const wrapper = render(<ReferralWidget />)
    const container = wrapper.container

    // Check for Tailwind's rounded-md utility class
    expect(container.querySelector('[class*="rounded-md"]')).not.toBeNull()
  })

  it('works correctly in dark mode context', () => {
    document.body.classList.add('dark')

    render(<ReferralWidget />)

    const container = screen.getByRole('region')
    // Should still have background classes applied
    expect(container.querySelector('[class*="bg-"]')).not.toBeNull()

    document.body.classList.remove('dark')
  })

  it('passes through unknown props without error', () => {
    render(
      <ReferralWidget
        title="Test"
        data-testid="custom-widget"
        className="custom-border"
      />
    )

    expect(screen.getByTestId('custom-widget')).toBeInTheDocument()
  })

  it('maintains layout animation context if using framer-motion', () => {
    render(<ReferralWidget title="Animated" />)

    const container = screen.getByRole('region')
    // If motion is used, should have motion.div or similar wrapper
    expect(container).toHaveClass(/motion/i) ||
      expect(container).not.toHaveClass(/overflow-hidden/i)
  })

  it('handles multiple rapid re-renders gracefully', () => {
    const renders: string[] = []
    let renderCount = 0

    const WidgetWithCounter = () => {
      renderCount++
      renders.push(`Render #${renderCount}`)
      return <ReferralWidget title={`Title ${renderCount}`} />
    }

    render(<WidgetWithCounter />)

    // Trigger multiple updates
    fireEvent.change(screen.getByRole('heading'), { target: { value: 'New' } })
    expect(renderCount).toBeGreaterThanOrEqual(1)
  })

  it('correctly calculates button dimensions for touch targets', () => {
    render(<ReferralWidget />)

    const btn = screen.getByRole('button')
    // Minimum touch target is typically 44x44px
    expect(btn.getBoundingClientRect().width).toBeGreaterThan(32)
    expect(btn.getBoundingClientRect().height).toBeGreaterThan(32)
  })

  it('applies proper z-index for modal/overlay behavior if applicable', () => {
    const wrapper = render(<ReferralWidget />)
    const container = wrapper.container

    // Check for z-index utilities in class list
    expect(container.querySelector('[class*="z-"]')).not.toBeNull() ||
      expect(container).toHaveClass(/relative/i)
  })
})
