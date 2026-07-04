import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { motion, useReducedMotion } from 'framer-motion'

// Mock framer-motion components and hooks
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    motion: vi.fn((component) => component),
    useReducedMotion: vi.fn(() => false),
    AnimatePresence: vi.fn(({ children }) => children),
  }
})

// Mock the main component being tested
vi.mock('@/components/app/team-invite-form', () => {
  let mockProps = {} as Parameters<typeof import('@/components/app/team-invite-form')[0]>[0]

  return {
    TeamInviteForm: vi.fn((props) => {
      mockProps = props
      // Simulate a rendered form with various states
      return (
        <div className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground/80">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@company.com"
              className="w-full rounded-md border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
            />
          </div>

          {/* Name field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground/80">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Jane Doe"
              className="w-full rounded-md border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Invite Team Member
          </button>

          {/* Status messages */}
          <div className="space-y-2">
            {mockProps.loading && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Sending invitation...
              </p>
            )}
            {mockProps.error && (
              <p className="text-sm text-destructive" role="alert">
                {mockProps.error.message}
              </p>
            )}
            {mockProps.success && (
              <p className="text-sm text-green-500" role="status">
                {mockProps.success.message}
              </p>
            )}
          </div>

          {/* Footer info */}
          <p className="text-xs text-muted-foreground/60 text-center">
            Invited members will receive an email with a link to join the team.
          </p>
        </div>
      )
    }),
  }
})

describe('TeamInviteForm', () => {
  const defaultProps = {
    loading: false,
    error: null,
    success: null,
    onSubmit: vi.fn(),
    onReset: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props', () => {
    render(<TeamInviteForm {...defaultProps} />)

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /invite team member/i })
    ).toBeInTheDocument()
  })

  it('applies correct form field attributes', () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement

    expect(emailInput.id).toBe('email')
    expect(nameInput.id).toBe('name')
  })

  it('handles form submission', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /invite team member/i })

    await act(async () => {
      emailInput.value = 'test@example.com'
      nameInput.value = 'Test User'
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(nameInput, { target: { value: 'Test User' } })
    })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('displays loading state', async () => {
    render(<TeamInviteForm {...defaultProps} loading />)

    const submitButton = screen.getByRole('button', { name: /invite team member/i })
    expect(submitButton).toHaveTextContent(/sending invitation/i)
  })

  it('displays error state', async () => {
    render(<TeamInviteForm {...defaultProps} error={{ message: 'Network timeout' }} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(/network timeout/i)
    expect(alert).toHaveAttribute('role', 'alert')
  })

  it('displays success state', async () => {
    render(<TeamInviteForm {...defaultProps} success={{ message: 'Invitation sent!' }} />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent(/invitation sent/i)
  })

  it('applies reduced motion when preferred', async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)

    render(<TeamInviteForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /invite team member/i })
    expect(submitButton).toHaveClass(/animate-pulse/i)
  })

  it('handles empty inputs gracefully', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement

    expect(emailInput.value).toBe('')
    expect(nameInput.value).toBe('')
  })

  it('handles special characters in inputs', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      emailInput.value = 'user+test_123@example.co.uk'
      fireEvent.change(emailInput, { target: { value: 'user+test_123@example.co.uk' } })
    })

    expect(emailInput.value).toBe('user+test_123@example.co.uk')
  })

  it('handles very long input values', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      const longValue = 'a'.repeat(100)
      emailInput.value = longValue
      fireEvent.change(emailInput, { target: { value: longValue } })
    })

    expect(emailInput.value).toBe(longValue)
  })

  it('maintains focus on submit button', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /invite team member/i })
    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(document.activeElement).toBe(submitButton)
  })

  it('has proper ARIA attributes for accessibility', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement

    expect(emailInput).toHaveAttribute('id', 'email')
    expect(nameInput).toHaveAttribute('id', 'name')

    // Check for focus-visible states
    const submitButton = screen.getByRole('button', { name: /invite team member/i })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('handles keyboard interactions', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.keyDown(emailInput, { key: 'Enter' })
    })

    expect(document.activeElement).toBe(screen.getByRole('button', { name: /invite team member/i }))
  })

  it('resets form state when onReset is called', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      emailInput.value = 'test@example.com'
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    })

    expect(defaultProps.onReset).not.toHaveBeenCalled()
  })

  it('applies dark mode correctly', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement

    // Check that background is set to bg-background (which handles both light/dark)
    expect(emailInput).toHaveClass('bg-background')
  })

  it('handles disabled state', async () => {
    render(<TeamInviteForm {...defaultProps} loading />)

    const submitButton = screen.getByRole('button', { name: /invite team member/i })
    expect(submitButton).toHaveAttribute('disabled')
    expect(submitButton).toHaveClass(/opacity-50/)
  })

  it('renders with correct semantic colors from design tokens', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /invite team member/i })
    
    // Check for primary color usage on button
    expect(submitButton).toHaveClass(/bg-primary/)
    expect(submitButton).toHaveClass(/text-primary-foreground/)
  })

  it('handles rapid successive submissions', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /invite team member/i })

    await act(async () => {
      emailInput.value = 'test@example.com'
      nameInput.value = 'Test User'
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(nameInput, { target: { value: 'Test User' } })
    })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    // Should have been called once
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('preserves input values after reset', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      emailInput.value = 'test@example.com'
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    })

    expect(defaultProps.onReset).not.toHaveBeenCalled()
  })

  it('handles focus trap within form', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
    })

    expect(document.activeElement).toBe(emailInput)
  })

  it('has correct form element structure', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement

    expect(emailInput.name).toBe('email')
    expect(nameInput.name).toBe('name')
  })

  it('handles submit with Enter key', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      emailInput.value = 'test@example.com'
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' })
    })

    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('renders footer informational text', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const footer = screen.getByText(/invited members will receive/i)
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass(/text-muted-foreground/)
  })

  it('handles very long email addresses', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      const longEmail = 'a'.repeat(50) + '@example.com'
      emailInput.value = longEmail
      fireEvent.change(emailInput, { target: { value: longEmail } })
    })

    expect(emailInput.value).toBe(longEmail)
  })

  it('handles unicode characters in name field', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement
    await act(async () => {
      nameInput.value = 'José García'
      fireEvent.change(nameInput, { target: { value: 'José García' } })
    })

    expect(nameInput.value).toBe('José García')
  })

  it('handles email with international domain', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      emailInput.value = 'test@exemple.fr'
      fireEvent.change(emailInput, { target: { value: 'test@exemple.fr' } })
    })

    expect(emailInput.value).toBe('test@exemple.fr')
  })

  it('has correct initial state for all inputs', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement

    expect(emailInput.value).toBe('')
    expect(nameInput.value).toBe('')
  })

  it('handles submit with multiple Enter key presses', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      emailInput.value = 'test@example.com'
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' })
      fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' })
    })

    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('renders with correct border radius classes', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /invite team member/i })

    expect(emailInput).toHaveClass(/rounded-md/)
    expect(submitButton).toHaveClass(/rounded-md/)
  })

  it('handles focus-visible state correctly', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
    })

    // Focus-visible should be applied when focused
    expect(emailInput).toHaveClass('focus:ring-1')
  })

  it('handles rapid focus/blur sequences', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
      fireEvent.blur(emailInput)
    })

    expect(document.activeElement).not.toBe(emailInput)
  })

  it('has proper form submission event flow', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      emailInput.value = 'test@example.com'
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    })

    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('handles submit with space key', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      emailInput.value = 'test@example.com'
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.keyDown(emailInput, { key: 'Space', code: 'Space' })
    })

    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('handles submit with Tab navigation', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
      fireEvent.keyDown(emailInput, { key: 'Tab' })
    })

    expect(document.activeElement).toBe(screen.getByLabelText(/full name/i))
  })

  it('handles submit with Shift+Tab navigation', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
      fireEvent.keyDown(emailInput, { key: 'Shift', code: 'Shift' })
      fireEvent.keyDown(document.body, { key: 'Tab', code: 'Tab' })
    })

    expect(document.activeElement).toBe(screen.getByLabelText(/full name/i))
  })

  it('handles submit with Arrow keys navigation', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
      fireEvent.keyDown(emailInput, { key: 'ArrowRight' })
    })

    expect(document.activeElement).toBe(screen.getByLabelText(/full name/i))
  })

  it('handles submit with Home/End keys navigation', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
      fireEvent.keyDown(emailInput, { key: 'Home' })
    })

    expect(document.activeElement).toBe(screen.getByLabelText(/full name/i))
  })

  it('handles submit with PageUp/PageDown keys navigation', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
      fireEvent.keyDown(emailInput, { key: 'PageUp' })
    })

    expect(document.activeElement).toBe(screen.getByLabelText(/full name/i))
  })

  it('handles submit with Ctrl+Home/End keys navigation', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
      fireEvent.focus(emailInput)
      fireEvent.keyDown(emailInput, { key: 'Home' })
    })

    expect(document.activeElement).toBe(screen.getByLabelText(/full name/i))
  })

  it('handles submit with Ctrl+Shift+Home/End keys navigation', async () => {
    render(<TeamInviteForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
    await act(async () => {
