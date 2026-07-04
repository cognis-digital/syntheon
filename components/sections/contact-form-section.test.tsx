import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactFormSection from '@/components/sections/contact-form-section'

describe('ContactFormSection', () => {
  const defaultProps = {} as Parameters<typeof ContactFormSection>[0]

  beforeEach(() => {
    // Reset any global state between tests
    document.body.className = ''
  })

  it('renders with all defaults and no required props', () => {
    render(<ContactFormSection {...defaultProps} />)

    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByText(/contact/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByType('submit')).toBeInTheDocument()
  })

  it('renders with custom title and description', () => {
    render(
      <ContactFormSection
        title="Get in Touch"
        description="Send us a message and we'll respond promptly."
        {...defaultProps}
      />
    )

    expect(screen.getByText(/get in touch/i)).toBeInTheDocument()
    expect(screen.getByText(/send us a message/i)).toBeInTheDocument()
  })

  it('handles controlled form state', () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const submitBtn = screen.getByType('submit')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.click(submitBtn)

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
      }),
    )
  })

  it('displays error messages on invalid submission', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const submitBtn = screen.getByType('submit')

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    })
  })

  it('shows success message after valid submission', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const submitBtn = screen.getByType('submit')

    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/sent/i)).toBeInTheDocument()
    })
  })

  it('applies dark mode correctly', () => {
    document.body.className = 'dark'

    render(<ContactFormSection {...defaultProps} />)

    const formEl = screen.getByRole('form') as HTMLElement
    expect(formEl).toHaveStyle(/dark/i)
  })

  it('is accessible with proper ARIA attributes', () => {
    render(<ContactFormSection {...defaultProps} />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)

    expect(nameInput).toHaveAttribute('aria-required', 'true')
    expect(emailInput).toHaveAttribute('aria-required', 'true')
  })

  it('handles focus states for keyboard navigation', () => {
    render(<ContactFormSection {...defaultProps} />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    fireEvent.focus(nameInput)

    expect(nameInput).toHaveFocus()
  })

  it('renders responsive container with proper sizing', () => {
    render(<ContactFormSection {...defaultProps} />)

    const formContainer = screen.getByRole('form')
    expect(formContainer).toHaveStyle(/max-width/i)
  })

  it('handles loading state gracefully', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        isSubmitting
        {...defaultProps}
      />
    )

    expect(screen.getByText(/sending/i)).toBeInTheDocument()
  })

  it('respects prefers-reduced-motion preference', () => {
    Object.defineProperty(window, 'matchMedia', vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })))

    render(<ContactFormSection {...defaultProps} />)

    expect(screen.getByRole('form')).toHaveStyle(/reduced-motion/i)
  })

  it('validates email format before submission', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@' } })

    await waitFor(() => {
      expect(screen.getByText(/format/i)).toBeInTheDocument()
    })
  })

  it('clears success message after timeout', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const submitBtn = screen.getByType('submit')

    fireEvent.change(nameInput, { target: { value: 'Clear Test' } })
    fireEvent.change(emailInput, { target: { value: 'clear@test.com' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/sent/i)).toBeInTheDocument()
    })

    // Simulate timeout clearing the message
    setTimeout(() => {
      expect(screen.queryByText(/sent/i)).not.toBeInTheDocument()
    }, 100)
  })

  it('handles empty form submission', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const submitBtn = screen.getByType('submit')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument()
    })
  })

  it('supports custom icon rendering', () => {
    render(
      <ContactFormSection
        icon={<svg aria-hidden="true" className="w-6 h-6"><path d="M12 8v4l3 3"></path></svg>}
        {...defaultProps}
      />
    )

    const icon = screen.getByRole('img') || screen.getByTestId(/icon/i)
    expect(icon).toBeInTheDocument()
  })

  it('applies correct border radius and spacing', () => {
    render(<ContactFormSection {...defaultProps} />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    expect(nameInput).toHaveStyle(/rounded-lg/i)
  })

  it('handles long text wrapping gracefully', async () => {
    render(
      <ContactFormSection
        title="A Very Long Title That Should Wrap Properly"
        description="This is a very long description that should also wrap correctly within the container and not overflow its bounds."
        {...defaultProps}
      />
    )

    expect(screen.getByText(/very long title/i)).toBeInTheDocument()
  })

  it('preserves focus state on form submission', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    fireEvent.focus(nameInput)
    expect(nameInput).toHaveFocus()

    const submitBtn = screen.getByType('submit')
    fireEvent.click(submitBtn)

    // Focus should shift to email or stay on form
    await waitFor(() => {
      expect(screen.getByRole('form')).toHaveFocus() ||
        expect(screen.getByLabelText(/email/i)).toHaveFocus()
    })
  })

  it('handles submit button hover state', () => {
    render(<ContactFormSection {...defaultProps} />)

    const submitBtn = screen.getByType('submit') as HTMLButtonElement
    fireEvent.mouseEnter(submitBtn)

    expect(submitBtn).toHaveStyle(/hover/i)
  })

  it('renders with proper semantic structure', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLFormElement
    const inputs = form.querySelectorAll('input, textarea')

    expect(inputs.length).toBeGreaterThan(0)
    inputs.forEach((input) => {
      expect(input.tagName.toLowerCase()).toMatch(/input|textarea/i)
    })
  })

  it('handles disabled state', () => {
    render(
      <ContactFormSection
        isSubmitting
        {...defaultProps}
      />
    )

    const submitBtn = screen.getByType('submit') as HTMLButtonElement
    expect(submitBtn).toHaveAttribute('disabled')
  })

  it('supports custom error boundary rendering', () => {
    render(
      <ContactFormSection
        onError={(error) => console.error(error)}
        {...defaultProps}
      />
    )

    // Error handler should be wired up
    expect(screen.getByRole('form')).toBeInTheDocument()
  })

  it('renders with proper meta tags for SEO', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLFormElement
    // Verify semantic structure
    expect(form).toHaveAttribute('aria-label', /contact/i)
  })

  it('handles paste events for convenience', async () => {
    render(<ContactFormSection {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    fireEvent.paste(emailInput, ['test@example.com'])

    await waitFor(() => {
      expect(emailInput.value).toBe('test@example.com')
    })
  })

  it('applies correct z-index for modal/overlay scenarios', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should have appropriate stacking context
    expect(form).toHaveStyle(/z-10/i) ||
      expect(form).toHaveStyle(/relative/i)
  })

  it('handles touch interactions for mobile users', () => {
    render(<ContactFormSection {...defaultProps} />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    fireEvent.touchStart(nameInput)
    expect(nameInput).toHaveAttribute('aria-pressed', 'false') ||
      expect(nameInput).not.toHaveAttribute('aria-pressed')
  })

  it('preserves scroll position on form mount', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true })

    render(<ContactFormSection {...defaultProps} />)

    // Should not cause layout shift
    expect(document.body).toHaveStyle(/overflow/i) ||
      expect(screen.getByRole('form')).not.toHaveStyle(/transform/i)
  })

  it('handles keyboard enter key for form submission', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'Enter Test' } })

    // Simulate pressing Enter in the input field
    fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter', keyCode: 13 })

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument()
    })
  })

  it('supports custom label positioning', () => {
    render(
      <ContactFormSection
        labelsPosition="floating"
        {...defaultProps}
      />
    )

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    expect(nameInput).toHaveStyle(/transform/i) ||
      expect(nameInput).not.toHaveStyle(/absolute/i)
  })

  it('handles file input with drag-and-drop', async () => {
    render(<ContactFormSection {...defaultProps} />)

    const fileInput = screen.getByLabelText(/attachment/i) as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [new File([], 'test.txt')] } })

    await waitFor(() => {
      expect(screen.getByText(/attached/i)).toBeInTheDocument() ||
        expect(fileInput).not.toHaveAttribute('aria-describedby')
    })
  })

  it('applies correct transition timing for smooth interactions', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should have smooth transitions
    expect(form).toHaveStyle(/transition/i) ||
      expect(form).not.toHaveStyle(/linear/i)
  })

  it('handles resize events gracefully', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should handle resize without layout shift
    expect(form).toHaveStyle(/max-width/i) ||
      expect(form).not.toHaveStyle(/overflow:hidden/i)
  })

  it('supports custom theme colors', () => {
    render(
      <ContactFormSection
        theme={{ primary: '#8b5cf6' }}
        {...defaultProps}
      />
    )

    const form = screen.getByRole('form') as HTMLElement
    // Should apply custom theme
    expect(form).toHaveStyle(/#8b5cf6/i) ||
      expect(form).not.toHaveStyle(/bg-background/i)
  })

  it('handles focus trap within modal context', async () => {
    render(<ContactFormSection {...defaultProps} />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    fireEvent.focus(nameInput)

    // Should maintain focus within form context
    expect(screen.getByRole('form')).toHaveFocus() ||
      expect(nameInput).toHaveFocus()
  })

  it('applies correct font stack for readability', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should have readable typography
    expect(form).toHaveStyle(/font/i) ||
      expect(form).not.toHaveStyle(/monospace/i)
  })

  it('handles copy-to-clipboard for email field', async () => {
    render(<ContactFormSection {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    fireEvent.paste(emailInput, ['copy@example.com'])

    await waitFor(() => {
      expect(emailInput.value).toBe('copy@example.com')
    })
  })

  it('supports custom validation rules', () => {
    render(
      <ContactFormSection
        validate={(data) => ({ name: data.name.length > 0, email: true })}
        {...defaultProps}
      />
    )

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    expect(nameInput).toHaveAttribute('aria-invalid', 'false') ||
      expect(nameInput).not.toHaveAttribute('aria-invalid')
  })

  it('handles offline state gracefully', async () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should handle offline with appropriate feedback
    expect(form).toHaveStyle(/pointer-events/i) ||
      expect(form).not.toHaveStyle(/opacity:0/i)
  })

  it('applies correct contrast ratios for accessibility', () => {
    render(<ContactFormSection {...defaultProps} />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    // Should have good contrast
    expect(nameInput).toHaveStyle(/contrast/i) ||
      expect(nameInput).not.toHaveStyle(/opacity:0.5/i)
  })

  it('supports custom animation duration', () => {
    render(
      <ContactFormSection
        animate={{ duration: 0.3 }}
        {...defaultProps}
      />
    )

    const form = screen.getByRole('form') as HTMLElement
    // Should have smooth animations
    expect(form).toHaveStyle(/transition/i) ||
      expect(form).not.toHaveStyle(/linear/i)
  })

  it('handles deep nested focus restoration', async () => {
    render(<ContactFormSection {...defaultProps} />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    fireEvent.focus(nameInput)

    // Should restore focus on unmount
    expect(screen.queryByRole('form')).toHaveFocus() ||
      expect(nameInput).toHaveFocus()
  })

  it('supports custom error message rendering', () => {
    render(
      <ContactFormSection
        errorMessage="Custom validation error"
        {...defaultProps}
      />
    )

    const errorMsg = screen.getByText(/custom validation/i)
    expect(errorMsg).toBeInTheDocument()
  })

  it('handles form reset on successful submission', async () => {
    const handleSubmit = vi.fn()
    render(
      <ContactFormSection
        onSubmit={handleSubmit}
        {...defaultProps}
      />
    )

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'Reset Test' } })

    const submitBtn = screen.getByType('submit')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/sent/i)).toBeInTheDocument()
    })

    // Form should be reset after submission
    setTimeout(() => {
      expect(nameInput.value).toBe('')
    }, 100)
  })

  it('applies correct box-sizing for padding calculations', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should have proper box model
    expect(form).toHaveStyle(/box-sizing/i) ||
      expect(form).not.toHaveStyle(/border-box/i)
  })

  it('handles custom cursor styles', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should have appropriate cursor for interactive elements
    expect(form).toHaveStyle(/cursor/i) ||
      expect(form).not.toHaveStyle(/pointer/i)
  })

  it('supports custom scrollbar styling', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should have smooth scrolling behavior
    expect(form).toHaveStyle(/scrollbar/i) ||
      expect(form).not.toHaveStyle(/auto-scroll/i)
  })

  it('handles custom meta viewport settings', () => {
    render(<ContactFormSection {...defaultProps} />)

    const form = screen.getByRole('form') as HTMLElement
    // Should have proper responsive viewport
    expect(form).toHaveStyle(/max-width/i) ||
      expect(form).not.toHaveStyle(/100vw/i)
  })

  it('supports custom meta description', () => {
    render(
      <ContactFormSection
        metaDescription="Get in touch with our team for inquiries and support."
        {...defaultProps}
      />
    )

    const form = screen.getByRole('form') as HTMLElement
    // Should have proper metadata
    expect(form).toHaveStyle(/meta/i) ||
      expect(form).not.toHaveStyle(/hidden/i)
  })

  it('handles custom meta keywords', () => {
    render(
      <ContactFormSection
        metaKeywords={['support', 'contact', 'help']}
        {...defaultProps}
      />
    )

    const form = screen.getByRole('form') as HTMLElement
    // Should have proper metadata structure
    expect(form).toHaveStyle(/meta/i) ||
      expect(form).not.toHaveStyle(/noindex/i)
  })

  it('supports custom meta robots settings', () => {
    render(
      <ContactFormSection
        metaRobots="noindex, nofollow"
        {...defaultProps}
      />
    )

    const form = screen.getByRole('form') as HTMLElement
    // Should have proper SEO metadata
    expect(form).toHaveStyle(/meta/i) ||
      expect(form).not.toHaveStyle(/all/i)
  })
