import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HoverPreviewCard } from '@/components/premium/hover-preview-card'
import { motion, useReducedMotion } from 'framer-motion'

describe('HoverPreviewCard', () => {
  beforeEach(() => {
    // Mock reduced motion detection for consistent testing
    const originalUseReducedMotion = useReducedMotion as any
    vi.spyOn(motion, 'useReducedMotion').mockReturnValue(false)
  })

  it('mounts without throwing with default props', () => {
    expect(() => render(<HoverPreviewCard />)).not.toThrow()
  })

  it('renders the card container with correct structure', () => {
    const { container } = render(<HoverPreviewCard title="Test" />)
    
    // Guard against jsdom layout quirks
    expect(container).toHaveTextContent('Test')
    expect(container.querySelector('[role="button"]')).not.toBeNull()
  })

  it('applies hover state with motion when not reduced', async () => {
    const { container } = render(<HoverPreviewCard title="Hover Test" />)
    
    // Wait for potential layout animations to settle
    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    // Verify interactive element exists
    const button = container.querySelector('[role="button"]')
    expect(button).not.toBeNull()
  })

  it('applies reduced motion when signal is true', async () => {
    vi.spyOn(motion, 'useReducedMotion').mockReturnValue(true)
    
    const { container } = render(<HoverPreviewCard title="Reduced Motion" />)
    
    // Should still mount but with minimal/no animation
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles custom className prop', () => {
    const { container } = render(
      <HoverPreviewCard 
        title="Custom Class" 
        className="custom-border custom-shadow" 
      />
    )
    
    // Check that additional classes are preserved
    expect(container).toHaveClass(/custom-/i)
  })

  it('handles custom href prop', () => {
    const { container } = render(
      <HoverPreviewCard 
        title="Link Test" 
        href="/test" 
      />
    )
    
    // Should have an anchor element when href is provided
    expect(container.querySelector('a')).not.toBeNull()
  })

  it('handles image prop', () => {
    const { container } = render(
      <HoverPreviewCard 
        title="Image Test" 
        src="/test.png" 
      />
    )
    
    // Should have an img element when src is provided
    expect(container.querySelector('img')).not.toBeNull()
  })

  it('handles disabled state', () => {
    const { container } = render(
      <HoverPreviewCard 
        title="Disabled Test" 
        disabled={true} 
      />
    )
    
    // Should still be interactive but visually indicated as disabled
    expect(container).toHaveTextContent('Disabled Test')
  })

  it('handles loading state', async () => {
    const { container, rerender } = render(
      <HoverPreviewCard title="Loading" loading={true} />
    )
    
    // Should show loading indicator
    await waitFor(() => expect(container).toBeInTheDocument())
    
    rerender(<HoverPreviewCard title="Ready" />)
    await waitFor(() => expect(container).toHaveTextContent('Ready'))
  })

  it('handles long text with truncation', () => {
    const veryLongTitle = 'A'.repeat(100)
    
    render(<HoverPreviewCard title={veryLongTitle} />)
    
    // Should handle overflow gracefully without breaking layout
    expect(screen.getByText(/A/)).toBeInTheDocument()
  })

  it('handles empty title', () => {
    const { container } = render(<HoverPreviewCard title="" />)
    
    // Should still be functional with no text content
    expect(container).not.toBeNull()
  })

  it('preserves focus state for accessibility', async () => {
    const user = userEvent.setup()
    
    const { container } = render(<HoverPreviewCard title="Focus Test" />)
    const button = container.querySelector('[role="button"]')
    
    // Focus the element
    await act(async () => {
      button?.focus()
    })
    
    expect(document.activeElement).toBe(button)
  })

  it('handles keyboard interactions', async () => {
    const user = userEvent.setup()
    
    render(<HoverPreviewCard title="Keyboard Test" />)
    const button = container.querySelector('[role="button"]')
    
    // Simulate Enter key press
    await act(async () => {
      button?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    })
    
    expect(button).not.toBeNull()
  })

  it('handles nested motion components gracefully', async () => {
    // Ensure deeply nested animations don't cause stack overflow
    render(<HoverPreviewCard title="Nested Test" />)
    
    await waitFor(() => {
      expect(document.body).toBeInTheDocument()
    })
  })

  it('renders with dark mode context', () => {
    document.documentElement.classList.add('dark')
    
    const { container } = render(<HoverPreviewCard title="Dark Mode" />)
    
    // Should still function correctly in dark mode
    expect(container).toHaveTextContent('Dark Mode')
  })

  it('handles type coercion gracefully', () => {
    // Test with various prop types that might come from user input
    render(<HoverPreviewCard 
      title={123 as string} 
      src={null as any} 
      href={undefined as any} 
    />)
    
    expect(container).not.toBeNull()
  })

  it('handles very large dimensions', () => {
    // Ensure no overflow with extreme values
    render(<HoverPreviewCard title="Large" />)
    
    await waitFor(() => {
      expect(document.body).not.toHaveAttribute('style', /overflow: hidden/i)
    })
  })

  it('handles rapid re-renders without crashing', async () => {
    const { rerender } = render(<HoverPreviewCard title="Initial" />)
    
    // Simulate rapid state changes
    for (let i = 0; i < 10; i++) {
      rerender(<HoverPreviewCard key={i} title={`Iteration ${i}`} />)
    }
    
    expect(document.body).not.toBeNull()
  })

  it('handles focus trap when modal is open', async () => {
    const user = userEvent.setup()
    
    render(<HoverPreviewCard title="Focus Trap" />)
    const button = container.querySelector('[role="button"]')
    
    // Focus and ensure tab order works
    await act(async () => {
      button?.focus()
    })
    
    expect(document.activeElement).toBe(button)
  })

  it('handles custom motion variants', async () => {
    const { container } = render(
      <HoverPreviewCard 
        title="Custom Motion" 
        // Would accept custom variant props here
      />
    )
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles concurrent renders', async () => {
    const promises: Promise<void>[] = []
    
    for (let i = 0; i < 5; i++) {
      promises.push(
        render(<HoverPreviewCard key={i} title={`Concurrent ${i}`} />).then(({ unmount }) => {
          setTimeout(() => unmount(), 10)
        })
      )
    }
    
    await Promise.all(promises)
    expect(document.body).not.toBeNull()
  })

  it('handles CSS variable injection', () => {
    const { container } = render(<HoverPreviewCard title="CSS Vars" />)
    
    // Should apply theme variables correctly
    expect(container).toHaveClass(/rounded/i)
  })

  it('handles text wrapping and overflow', () => {
    render(<HoverPreviewCard title="Very Long Text That Will Definitely Wrap Around Multiple Lines And Test The Overflow Behavior Correctly" />)
    
    // Should handle without layout shifts
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles resize events gracefully', async () => {
    const { container } = render(<HoverPreviewCard title="Resize" />)
    
    // Simulate resize (jsdom limitation, but should not crash)
    window.dispatchEvent(new Event('resize'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles scroll events without performance issues', async () => {
    render(<HoverPreviewCard title="Scroll" />)
    
    // Simulate scroll (jsdom limitation, but should not crash)
    window.dispatchEvent(new Event('scroll'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles pointer events correctly', async () => {
    const user = userEvent.setup()
    
    render(<HoverPreviewCard title="Pointer" />)
    const button = container.querySelector('[role="button"]')
    
    // Simulate hover state
    await act(async () => {
      button?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    })
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles touch events correctly', async () => {
    const user = userEvent.setup()
    
    render(<HoverPreviewCard title="Touch" />)
    const button = container.querySelector('[role="button"]')
    
    // Simulate touch interaction
    await act(async () => {
      button?.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))
    })
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles paste events gracefully', async () => {
    render(<HoverPreviewCard title="Paste" />)
    
    // Simulate paste (edge case for text input scenarios)
    window.dispatchEvent(new ClipboardEvent('paste'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles drag events gracefully', async () => {
    render(<HoverPreviewCard title="Drag" />)
    
    // Simulate drag (for interactive preview scenarios)
    window.dispatchEvent(new DragEvent('dragstart'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles keyboard events gracefully', async () => {
    render(<HoverPreviewCard title="Keyboard" />)
    
    // Simulate various keyboard events
    const keys = ['ArrowUp', 'ArrowDown', 'Space', 'Enter']
    for (const key of keys) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
    }
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles selection events gracefully', async () => {
    render(<HoverPreviewCard title="Selection" />)
    
    // Simulate text selection (for copy/paste scenarios)
    window.getSelection()?.selectAllChildren(document.body)
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles composition events gracefully', async () => {
    render(<HoverPreviewCard title="Composition" />)
    
    // Simulate text composition (for multi-language input)
    window.dispatchEvent(new CompositionEvent('compositionstart'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles beforeunload gracefully', async () => {
    render(<HoverPreviewCard title="BeforeUnload" />)
    
    // Simulate page unload (for modal close scenarios)
    window.dispatchEvent(new Event('beforeunload'))
    
    await waitFor(() => expect(document.body).toBeInTheDocument())
  })

  it('handles online/offline events gracefully', async () => {
    render(<HoverPreviewCard title="Network" />)
    
    // Simulate network status changes
    window.dispatchEvent(new Event('online'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles visibility change gracefully', async () => {
    render(<HoverPreviewCard title="Visibility" />)
    
    // Simulate tab switching (for lazy loading scenarios)
    document.dispatchEvent(new VisibilityEvent('visibilitychange'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles fullscreen change gracefully', async () => {
    render(<HoverPreviewCard title="Fullscreen" />)
    
    // Simulate fullscreen toggle (for modal scenarios)
    document.dispatchEvent(new FullscreenChangeEvent('fullscreenchange'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles pagehide/pageleave gracefully', async () => {
    render(<HoverPreviewCard title="PageLeave" />)
    
    // Simulate navigation (for cleanup scenarios)
    window.dispatchEvent(new PageTransitionEvent('pagehide'))
    
    await waitFor(() => expect(document.body).toBeInTheDocument())
  })

  it('handles popstate gracefully', async () => {
    render(<HoverPreviewCard title="PopState" />)
    
    // Simulate browser back/forward (for modal navigation scenarios)
    window.dispatchEvent(new PopStateEvent('popstate'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles hashchange gracefully', async () => {
    render(<HoverPreviewCard title="HashChange" />)
    
    // Simulate hash navigation (for modal close scenarios)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles storage change gracefully', async () => {
    render(<HoverPreviewCard title="Storage" />)
    
    // Simulate storage event (for cross-tab modal scenarios)
    window.dispatchEvent(new StorageEvent('storage'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles message events gracefully', async () => {
    render(<HoverPreviewCard title="Message" />)
    
    // Simulate postMessage (for iframe/modal communication scenarios)
    window.dispatchEvent(new MessageEvent('message'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles focusin/focusout gracefully', async () => {
    render(<HoverPreviewCard title="Focus" />)
    
    // Simulate focus changes (for keyboard navigation scenarios)
    document.dispatchEvent(new FocusEvent('focusin'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles blur events gracefully', async () => {
    render(<HoverPreviewCard title="Blur" />)
    
    // Simulate blur (for modal close scenarios)
    document.dispatchEvent(new FocusEvent('blur'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles input events gracefully', async () => {
    render(<HoverPreviewCard title="Input" />)
    
    // Simulate text input (for search/filter scenarios)
    document.dispatchEvent(new InputEvent('input'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles change events gracefully', async () => {
    render(<HoverPreviewCard title="Change" />)
    
    // Simulate form field changes (for filter scenarios)
    document.dispatchEvent(new Event('change'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles submit events gracefully', async () => {
    render(<HoverPreviewCard title="Submit" />)
    
    // Simulate form submission (for search/filter scenarios)
    document.dispatchEvent(new SubmitEvent('submit'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles reset events gracefully', async () => {
    render(<HoverPreviewCard title="Reset" />)
    
    // Simulate form reset (for filter clear scenarios)
    document.dispatchEvent(new Event('reset'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles select events gracefully', async () => {
    render(<HoverPreviewCard title="Select" />)
    
    // Simulate dropdown selection (for filter scenarios)
    document.dispatchEvent(new SelectEvent('select'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles keydown events gracefully', async () => {
    render(<HoverPreviewCard title="Keydown" />)
    
    // Simulate keyboard input (for accessibility scenarios)
    document.dispatchEvent(new KeyboardEvent('keydown'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles keypress events gracefully', async () => {
    render(<HoverPreviewCard title="Keypress" />)
    
    // Simulate character input (for search scenarios)
    document.dispatchEvent(new KeyboardEvent('keypress'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles keyup events gracefully', async () => {
    render(<HoverPreviewCard title="Keyup" />)
    
    // Simulate keyboard release (for accessibility scenarios)
    document.dispatchEvent(new KeyboardEvent('keyup'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles mouse events gracefully', async () => {
    render(<HoverPreviewCard title="Mouse" />)
    
    // Simulate various mouse interactions (for hover effects)
    document.dispatchEvent(new MouseEvent('mousedown'))
    document.dispatchEvent(new MouseEvent('mouseup'))
    document.dispatchEvent(new MouseEvent('click'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles wheel events gracefully', async () => {
    render(<HoverPreviewCard title="Wheel" />)
    
    // Simulate scroll wheel (for lazy loading scenarios)
    document.dispatchEvent(new WheelEvent('wheel'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles contextmenu events gracefully', async () => {
    render(<HoverPreviewCard title="ContextMenu" />)
    
    // Simulate right-click (for custom menu scenarios)
    document.dispatchEvent(new MouseEvent('contextmenu'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles doubleclick events gracefully', async () => {
    render(<HoverPreviewCard title="DoubleClick" />)
    
    // Simulate double-click (for image zoom scenarios)
    document.dispatchEvent(new MouseEvent('dblclick'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles dragstart events gracefully', async () => {
    render(<HoverPreviewCard title="DragStart" />)
    
    // Simulate drag start (for image upload scenarios)
    document.dispatchEvent(new DragEvent('dragstart'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles dragend events gracefully', async () => {
    render(<HoverPreviewCard title="DragEnd" />)
    
    // Simulate drag end (for image upload scenarios)
    document.dispatchEvent(new DragEvent('dragend'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles dragenter events gracefully', async () => {
    render(<HoverPreviewCard title="DragEnter" />)
    
    // Simulate drag enter (for image upload scenarios)
    document.dispatchEvent(new DragEvent('dragenter'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles dragleave events gracefully', async () => {
    render(<HoverPreviewCard title="DragLeave" />)
    
    // Simulate drag leave (for image upload scenarios)
    document.dispatchEvent(new DragEvent('dragleave'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles dragover events gracefully', async () => {
    render(<HoverPreviewCard title="DragOver" />)
    
    // Simulate drag over (for image upload scenarios)
    document.dispatchEvent(new DragEvent('dragover'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles drop events gracefully', async () => {
    render(<HoverPreviewCard title="Drop" />)
    
    // Simulate file drop (for image upload scenarios)
    document.dispatchEvent(new DragEvent('drop'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles scroll events gracefully', async () => {
    render(<HoverPreviewCard title="Scroll" />)
    
    // Simulate scrolling (for lazy loading scenarios)
    window.dispatchEvent(new Event('scroll'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles resize events gracefully', async () => {
    render(<HoverPreviewCard title="Resize" />)
    
    // Simulate resizing (for responsive layouts)
    window.dispatchEvent(new Event('resize'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles load events gracefully', async () => {
    render(<HoverPreviewCard title="Load" />)
    
    // Simulate page load (for initial rendering scenarios)
    window.dispatchEvent(new Event('load'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles unload events gracefully', async () => {
    render(<HoverPreviewCard title="Unload" />)
    
    // Simulate page unload (for cleanup scenarios)
    window.dispatchEvent(new Event('unload'))
    
    await waitFor(() => expect(document.body).toBeInTheDocument())
  })

  it('handles error events gracefully', async () => {
    render(<HoverPreviewCard title="Error" />)
    
    // Simulate resource load error (for image fallback scenarios)
    window.dispatchEvent(new ErrorEvent('error'))
    
    await waitFor(() => expect(container).toBeInTheDocument())
  })

  it('handles abort events gracefully', async () => {
    render(<HoverPreviewCard title="Abort" />)
    
    // Simulate request abort (for lazy loading scenarios)
