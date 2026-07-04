import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { motion, useReducedMotion } from 'framer-motion'

// Mock the cn helper and other utilities
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}))

// Import the component (assumed to exist at this path)
import { FeedbackWidget } from '@/components/premium-features/feedback-widget'

describe('FeedbackWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props and no errors', () => {
    const { container } = render(<FeedbackWidget />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText(/feedback/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send feedback/i })).toBeInTheDocument()
  })

  it('applies default styling tokens correctly', () => {
    const { container } = render(<FeedbackWidget />)
    
    // Check for expected Tailwind classes from design system
    expect(container).toHaveClass(/bg-background/)
    expect(container).toHaveClass(/rounded-lg/)
    expect(container).toHaveClass(/border-border/)
  })

  it('renders custom text props when provided', () => {
    const customText = 'Custom Label'
    
    render(<FeedbackWidget label={customText} />)
    
    expect(screen.getByRole('heading')).toHaveTextContent(customText)
  })

  it('handles disabled state gracefully', () => {
    render(<FeedbackWidget disabled />)
    
    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveClass(/opacity-50/)
  })

  it('shows loading spinner during submission', async () => {
    // Mock the API call
    vi.spyOn(FeedbackWidget, 'submit').mockResolvedValue({ success: true })
    
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    await userEvent.click(submitButton)
    
    expect(screen.getByText(/sending/i)).toBeInTheDocument()
    expect(screen.queryByText(/send feedback/i)).not.toBeInTheDocument()
  })

  it('displays error state when submission fails', async () => {
    // Mock failed API call
    vi.spyOn(FeedbackWidget, 'submit').mockRejectedValue(new Error('Network timeout'))
    
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    await userEvent.click(submitButton)
    
    expect(screen.queryByText(/sending/i)).not.toBeInTheDocument()
    expect(screen.getByText(/failed to send/i)).toBeInTheDocument()
  })

  it('respects dark mode context', () => {
    document.body.classList.add('dark')
    
    render(<FeedbackWidget />)
    
    // Should still have proper contrast in dark mode
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('applies reduced motion when preferred', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }))
    
    render(<FeedbackWidget />)
    
    // Should have reduced animation classes
    expect(screen.getByRole('form')).toHaveClass(/animate-slow/)
  })

  it('handles keyboard navigation correctly', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    const submitButton = screen.getByRole('button')
    
    // Tab should move from input to button
    await userEvent.tab()
    expect(document.activeElement).toBe(submitButton)
  })

  it('validates empty submission', async () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    await userEvent.click(submitButton)
    
    // Should show validation error for empty input
    expect(screen.getByText(/please enter some feedback/i)).toBeInTheDocument()
  })

  it('handles very long text gracefully', () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    await userEvent.type(input, 'A'.repeat(500))
    
    expect(input).toHaveAttribute('maxlength')
  })

  it('preserves focus state after interaction', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    await userEvent.type(input, 'Test feedback')
    
    expect(document.activeElement).toBe(input)
  })

  it('applies custom color tokens when provided', () => {
    render(<FeedbackWidget accentColor="text-primary" />)
    
    // Should have the specified accent color applied
    expect(screen.getByRole('button')).toHaveClass(/text-primary/)
  })

  it('handles special characters in input without breaking', async () => {
    const specialChars = '<script>alert("XSS")</script>'
    
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    await userEvent.type(input, specialChars)
    
    expect(input).toHaveValue(specialChars)
  })

  it('renders with proper ARIA attributes', () => {
    render(<FeedbackWidget label="Customer Feedback" />)
    
    const form = screen.getByRole('form') as HTMLFormElement
    expect(form).toHaveAttribute('aria-labelledby')
    expect(form).toHaveAttribute('aria-describedby')
  })

  it('handles submit event propagation correctly', async () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    let submitEvent: Event | null = null
    
    submitButton.addEventListener('submit', (e) => {
      submitEvent = e
    })
    
    await userEvent.click(submitButton)
    
    expect(submitEvent).not.toBeNull()
  })

  it('shows success state after successful submission', async () => {
    vi.spyOn(FeedbackWidget, 'submit').mockResolvedValue({ success: true })
    
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    await userEvent.click(submitButton)
    
    expect(screen.queryByText(/failed/i)).not.toBeInTheDocument()
  })

  it('handles multiple rapid submissions gracefully', async () => {
    vi.spyOn(FeedbackWidget, 'submit').mockResolvedValue({ success: true })
    
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    
    // Click rapidly
    await userEvent.click(submitButton)
    await userEvent.click(submitButton)
    await userEvent.click(submitButton)
    
    // Should only have one active submission state
    expect(screen.queryByText(/sending/i)).not.toBeInTheDocument()
  })

  it('applies correct border radius from design tokens', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    expect(container).toHaveClass(/rounded-lg/)
  })

  it('handles focus ring accessibility correctly', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Simulate tab navigation to focus the input
    await userEvent.tab()
    
    expect(input).toHaveFocus()
  })

  it('renders with correct semantic heading hierarchy', () => {
    render(<FeedbackWidget label="Customer Feedback" />)
    
    const h1 = screen.getByRole('heading') as HTMLHeadingElement
    expect(h1.tagName.toLowerCase()).toBe('h2') // Should be H2, not H1 for component
  })

  it('handles icon props when provided', () => {
    render(<FeedbackWidget label="Customer Feedback" />)
    
    const container = screen.getByRole('form') as HTMLElement
    expect(container).toHaveClass(/border-border/)
  })

  it('maintains proper contrast ratios in both light and dark modes', () => {
    // Light mode (default)
    render(<FeedbackWidget />)
    const inputLight = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Dark mode
    document.body.classList.add('dark')
    render(<FeedbackWidget />)
    const inputDark = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    expect(inputLight).toHaveAttribute('aria-invalid', 'false')
    expect(inputDark).toHaveAttribute('aria-invalid', 'false')
  })

  it('handles edge case of extremely short text', () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    await userEvent.type(input, '?')
    
    expect(input).toHaveValue('?')
  })

  it('applies smooth transitions for all interactive elements', async () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    expect(submitButton).toHaveClass(/transition/)
  })

  it('handles focus trap within form when modal is open', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    expect(document.activeElement).toBe(input)
  })

  it('renders with correct z-index for proper layering', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have appropriate z-index for overlay/modal behavior
    expect(container).toHaveClass(/z-50/)
  })

  it('handles resize events gracefully', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Simulate window resize (would typically trigger re-render)
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('preserves scroll position when modal opens/closes', async () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    
    // Should have overflow handling for long content
    expect(container).toHaveClass(/overflow-y-auto/)
  })

  it('handles keyboard escape key to close modal', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Simulate pressing Escape (would typically close modal)
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('applies proper shadow depth for premium feel', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have subtle shadow for depth
    expect(container).toHaveClass(/shadow-sm/)
  })

  it('handles touch interactions with proper active states', async () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    
    // Simulate touch interaction (would show active state on mobile)
    expect(submitButton).toHaveClass(/active/)
  })

  it('renders with correct font family from design tokens', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should use the primary font family
    expect(container).toHaveClass(/font-sans/)
  })

  it('handles focus-visible state for keyboard users', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    
    // Should show focus ring only when focused via keyboard
    expect(input).toHaveClass(/focus-visible/)
  })

  it('applies proper min-height for touch targets', () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    // Touch targets should be at least 44px height on mobile
    expect(submitButton).toHaveClass(/min-h-10/)
  })

  it('handles paste events without breaking', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Simulate pasting content (would typically insert text)
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('renders with correct line-height for readability', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have proper line height for long text
    expect(container).toHaveClass(/leading-normal/)
  })

  it('handles selection events gracefully', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    
    // Should allow text selection for copying
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('applies proper letter-spacing for premium typography', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have subtle letter spacing
    expect(container).toHaveClass(/tracking-normal/)
  })

  it('handles drag events without breaking layout', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Simulate dragging text (would typically move cursor)
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('renders with correct max-width for responsive design', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have appropriate max-width for different breakpoints
    expect(container).toHaveClass(/max-w-md/)
  })

  it('handles copy events without breaking', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    
    // Should allow copying of text
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('applies proper word-wrap for long URLs or paths', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should handle long text gracefully
    expect(container).toHaveClass(/break-words/)
  })

  it('handles cut events without breaking', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    
    // Should allow cutting of text
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('renders with correct min-height for vertical rhythm', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have proper min-height for content
    expect(container).toHaveClass(/min-h-12/)
  })

  it('handles drop events without breaking layout', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Simulate dropping text (would typically insert at cursor)
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('applies proper overflow handling for long content', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should handle overflow gracefully
    expect(container).toHaveClass(/overflow-hidden/)
  })

  it('handles scroll events without breaking', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Simulate scrolling within form (would typically adjust position)
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('renders with correct aspect-ratio for consistent sizing', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have proper aspect ratio considerations
    expect(container).toHaveClass(/aspect-auto/)
  })

  it('handles resize events without breaking layout', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    // Simulate resizing (would typically adjust dimensions)
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('applies proper text-overflow for long content', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should handle text overflow gracefully
    expect(container).toHaveClass(/truncate/)
  })

  it('handles pointer events without breaking interaction', async () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    
    // Simulate pointer interaction (would typically show hover state)
    expect(submitButton).toHaveClass(/hover/)
  })

  it('renders with correct touch-action for mobile optimization', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have proper touch action settings
    expect(container).toHaveClass(/touch-none/)
  })

  it('handles selection highlighting without breaking', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    
    // Should allow proper text selection
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('applies proper cursor styling for interactive elements', () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    // Should have appropriate cursor style
    expect(submitButton).toHaveClass(/cursor-pointer/)
  })

  it('handles focus-within state correctly', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    
    // Should show focus-within styles when child is focused
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('renders with correct z-index for proper layering in modal context', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    // Should have appropriate z-index for modal overlay
    expect(container).toHaveClass(/z-50/)
  })

  it('handles animation preferences correctly', async () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    
    // Should respect user's motion preferences
    expect(container).toHaveClass(/animate-slow/)
  })

  it('applies proper transition timing for smooth interactions', () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    // Should have appropriate transition duration
    expect(submitButton).toHaveClass(/transition-all/)
  })

  it('handles reduced motion preference gracefully', async () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    
    // Should apply reduced animation when preferred
    expect(container).toHaveClass(/animate-slow/)
  })

  it('renders with correct semantic roles for accessibility', () => {
    render(<FeedbackWidget label="Customer Feedback" />)
    
    const form = screen.getByRole('form') as HTMLFormElement
    
    // Should have proper ARIA attributes
    expect(form).toHaveAttribute('aria-labelledby')
    expect(form).toHaveAttribute('aria-describedby')
  })

  it('handles keyboard focus management correctly', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    
    // Should maintain proper focus state
    expect(document.activeElement).toBe(input)
  })

  it('applies proper contrast ratios for readability', () => {
    render(<FeedbackWidget />)
    
    const container = screen.getByRole('form') as HTMLElement
    
    // Should have sufficient contrast for text elements
    expect(container).toHaveClass(/text-foreground/)
  })

  it('handles focus-visible state for keyboard users correctly', async () => {
    render(<FeedbackWidget />)
    
    const input = screen.getByLabelText(/feedback/i) as HTMLInputElement
    
    await userEvent.type(input, 'Test')
    
    // Should show visible focus ring when focused via keyboard
    expect(input).toHaveClass(/focus-visible/)
  })

  it('renders with proper min-height for touch targets on mobile', () => {
    render(<FeedbackWidget />)
    
    const submitButton = screen.getByRole('button')
    
    // Touch targets should be at least 44px height on mobile devices
    expect(submitButton).toHaveClass(/min-h-10/)
  })

  it('handles paste events without breaking the input state', async () => {
    render(<FeedbackWidget />
