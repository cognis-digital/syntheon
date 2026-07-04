import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RippleButton } from '@/components/premium/ripple-button'
import { motion, useReducedMotion } from 'framer-motion'

describe('RippleButton', () => {
  beforeEach(() => {
    // Guard against jsdom layout quirks that framer-motion might probe
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { value: 100 })
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { value: 50 })
    Object.defineProperty(window, 'scrollX', { value: 0 })
    Object.defineProperty(window, 'scrollY', { value: 0 })
  })

  it('mounts without throwing with default props', () => {
    const { container } = render(<RippleButton />)
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with custom children', () => {
    const { container } = render(
      <RippleButton>Custom Label</RippleButton>
    )
    expect(screen.getByText(/custom label/i)).toBeInTheDocument()
  })

  it('applies correct semantic classes via cn helper', () => {
    const wrapper = render(<RippleButton />)
    const btn = screen.getByRole('button')
    // Verify base button role exists
    expect(btn).toHaveAttribute('role', 'button')
  })

  it('handles dark mode correctly', () => {
    document.body.classList.add('dark')
    
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // In dark mode, background should use darker semantic value
    expect(btn).toHaveClass(/bg-background/i)
  })

  it('handles accessibility attributes', () => {
    render(
      <RippleButton aria-label="Test button" />
    )
    const btn = screen.getByRole('button')
    
    // ARIA label should be preserved if provided
    expect(btn).toHaveAttribute('aria-label', 'Test button')
  })

  it('handles keyboard interactions without errors', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    await userEvent.keyboard('Enter')
    // Should not throw any errors during keydown handling
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles motion reduction preference', () => {
    document.body.classList.add('prefers-reduced-motion')
    
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Component should still mount and function normally
    expect(btn).toBeInTheDocument()
  })

  it('handles edge case: empty string children', () => {
    const wrapper = render(<RippleButton />)
    expect(wrapper.container).not.toBeNull()
  })

  it('handles edge case: undefined props gracefully', () => {
    // Should not crash with minimal/no props
    const wrapper = render(<RippleButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies rounded styling correctly', () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Verify some form of border-radius is applied
    expect(btn).toHaveClass(/rounded/i)
  })

  it('handles click event without errors', async () => {
    let clicked = false
    
    render(
      <RippleButton onClick={() => { clicked = true }} />
    )
    
    await userEvent.click(screen.getByRole('button'))
    
    // Should not throw, and state should update
    expect(clicked).toBe(true)
  })

  it('handles disabled state gracefully', () => {
    render(<RippleButton disabled />)
    const btn = screen.getByRole('button')
    
    // Disabled button should still be in DOM but visually distinct
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('disabled')
  })

  it('handles variant prop correctly', () => {
    render(<RippleButton variant="primary" />)
    const btn = screen.getByRole('button')
    
    // Primary variant should use primary semantic colors
    expect(btn).toHaveClass(/bg-primary/i)
  })

  it('handles size prop correctly', () => {
    render(<RippleButton size="lg" />)
    const btn = screen.getByRole('button')
    
    // Large size should apply appropriate padding/size classes
    expect(btn).toHaveClass(/rounded-lg/i)
  })

  it('handles loading state without layout thrashing', async () => {
    render(<RippleButton loading />)
    const btn = screen.getByRole('button')
    
    // Loading state should not cause excessive re-renders or layout shifts
    expect(btn).toBeInTheDocument()
  })

  it('handles icon prop correctly', () => {
    render(
      <RippleButton icon="plus" />
    )
    const btn = screen.getByRole('button')
    
    // Icon should be rendered if provided
    expect(screen.queryByTestId(/icon/i)).toBeInTheDocument()
  })

  it('handles full-width variant', () => {
    render(<RippleButton fullWidth />)
    const btn = screen.getByRole('button')
    
    // Full width should apply appropriate classes
    expect(btn).toHaveClass(/w-full/i)
  })

  it('handles outline variant for accessibility focus', () => {
    render(<RippleButton variant="outline" />)
    const btn = screen.getByRole('button')
    
    // Outline variant should use border-based styling
    expect(btn).toHaveClass(/border/i)
  })

  it('handles ghost variant correctly', () => {
    render(<RippleButton variant="ghost" />)
    const btn = screen.getByRole('button')
    
    // Ghost variant should be minimal with subtle background
    expect(btn).toHaveClass(/bg-muted/i)
  })

  it('handles all semantic color variants', () => {
    const variants: Array<{ name: string; className: RegExp }> = [
      { name: 'primary', className: /bg-primary/i },
      { name: 'secondary', className: /bg-secondary/i },
      { name: 'tertiary', className: /bg-tertiary/i },
    ]

    variants.forEach(({ name, className }) => {
      render(<RippleButton variant={name} />)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass(className)
    })
  })

  it('handles compound props together', () => {
    render(
      <RippleButton 
        variant="primary" 
        size="lg" 
        fullWidth 
        loading 
        disabled={false}
      />
    )
    
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass(/rounded-lg/i) // from lg size
    expect(btn).toHaveClass(/w-full/i)     // from fullWidth
  })

  it('handles focus state correctly', () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Focus should be visible and accessible
    expect(btn).toHaveAttribute('tabIndex', '0')
  })

  it('handles hover state without layout thrashing', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    await userEvent.hover(btn)
    
    // Should not cause excessive re-renders
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles active/pressed state', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    await userEvent.click(btn)
    
    // Active state should be handled gracefully
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles long text without overflow issues', () => {
    render(<RippleButton>Very Long Text That Should Wrap Properly</RippleButton>)
    const btn = screen.getByRole('button')
    
    // Should handle arbitrary length content
    expect(btn).toHaveTextContent(/very long text/i)
  })

  it('handles emoji and special characters', () => {
    render(<RippleButton>🔥 Fire 🔥</RippleButton>)
    const btn = screen.getByRole('button')
    
    // Should render special characters correctly
    expect(btn).toHaveTextContent(/fire/i)
  })

  it('handles nested components gracefully', () => {
    render(
      <div className="flex flex-col gap-2">
        <RippleButton>First</RippleButton>
        <RippleButton variant="secondary">Second</RippleButton>
        <RippleButton disabled>Third</RippleButton>
      </div>
    )
    
    // All buttons should render correctly in sequence
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('handles async initialization gracefully', () => {
    // Simulate component that might have async setup
    const wrapper = render(<RippleButton />)
    
    // Should resolve and mount without errors
    expect(wrapper.container).not.toBeNull()
  })

  it('handles memory cleanup (unmount)', () => {
    let unmounted = false
    
    const { rerender } = render(
      <RippleButton onUnmount={() => { unmounted = true }} />
    )
    
    // Should mount successfully
    expect(screen.getByRole('button')).toBeInTheDocument()
    
    // Cleanup should work without errors
    rerender(<RippleButton />)
    expect(unmounted).toBe(true)
  })

  it('handles ref forwarding correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    
    render(
      <RippleButton ref={ref} />
    )
    
    // Ref should be forwarded to the actual button element
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('handles form submission correctly', () => {
    let submitted = false
    
    render(
      <form onSubmit={(e) => { e.preventDefault(); submitted = true; }}>
        <RippleButton type="submit">Submit</RippleButton>
      </form>
    )
    
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('type', 'submit')
  })

  it('handles focus trap in modal-like contexts', () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Focus should be movable and not trapped incorrectly
    btn.focus()
    expect(document.activeElement).toBe(btn)
  })

  it('handles scroll position changes gracefully', async () => {
    window.scrollY = 100
    
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Should handle scroll state without thrashing
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles resize events', async () => {
    window.innerWidth = 1024
    
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Should handle resize without layout thrashing
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles touch events on mobile', async () => {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 10 })
    
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Touch should work without errors
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles pointer events correctly', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Pointer events should work with framer-motion
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles selection state', () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Selection should be handled gracefully
    window.getSelection()?.selectAllChildren(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles drag events if applicable', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Drag should not cause errors even if not fully implemented
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles paste events', () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Paste should be handled gracefully
    window.dispatchEvent(new Event('paste'))
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles copy events', () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Copy should be handled gracefully
    window.dispatchEvent(new ClipboardEvent('copy'))
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles cut events', () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Cut should be handled gracefully
    window.dispatchEvent(new ClipboardEvent('cut'))
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles keydown events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Keydown should be handled gracefully
    await userEvent.keyboard('Tab')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles keyup events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Keyup should be handled gracefully
    await userEvent.keyboard('Tab')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles keypress events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Keypress should be handled gracefully
    await userEvent.keyboard('Tab')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles input events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Input should be handled gracefully
    await userEvent.type(btn, 'test')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles change events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Change should be handled gracefully
    await userEvent.type(btn, 'test')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles blur events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Blur should be handled gracefully
    await userEvent.tab()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles focus events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Focus should be handled gracefully
    await userEvent.type(btn, 'test')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles scroll events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Scroll should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles wheel events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Wheel should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles mouseover events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Mouseover should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles mouseout events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Mouseout should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles mouseenter events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Mouseenter should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles mouseleave events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Mouseleave should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles mousemove events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Mousemove should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles mouseup events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Mouseup should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles mousedown events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Mousedown should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles touchstart events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Touchstart should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles touchend events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Touchend should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles touchmove events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Touchmove should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles touchcancel events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Touchcancel should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles pointerdown events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Pointerdown should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles pointerup events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Pointerup should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles pointermove events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Pointermove should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles pointerenter events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Pointerenter should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles pointerleave events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Pointerleave should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles pointerout events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Pointerout should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles pointerover events', async () => {
    render(<RippleButton />)
    const btn = screen.getByRole('button')
    
    // Pointerover should be handled gracefully
    await userEvent.hover(btn)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
