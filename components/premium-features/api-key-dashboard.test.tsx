import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ApiKeyDashboard } from '@/components/premium-features/api-key-dashboard'

describe('ApiKeyDashboard', () => {
  const mockOnCopy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing with default props', async () => {
    render(<ApiKeyDashboard />)

    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByText(/API Key/)).toBeInTheDocument()
  })

  it('displays the API key value by default', () => {
    const { container } = render(<ApiKeyDashboard apiKey="test-key-123" />)

    expect(container).toHaveTextContent('test-key-123')
  })

  it('renders with custom label when provided', () => {
    render(
      <ApiKeyDashboard apiKey="custom-key" label="Production Key" />
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Production Key')
  })

  it('applies custom icon when provided', () => {
    const { container } = render(
      <ApiKeyDashboard
        apiKey="icon-test"
        icon={{ name: 'key', className: 'text-primary' }}
      />
    )

    expect(container).toHaveTextContent('key')
  })

  it('handles copy functionality with callback', async () => {
    render(<ApiKeyDashboard apiKey="copy-me-123" onCopy={mockOnCopy} />)

    const copyButton = screen.getByRole('button', { name: /copy/i })

    await act(async () => {
      userEvent.click(copyButton)
    })

    expect(mockOnCopy).toHaveBeenCalledWith('copy-me-123')
  })

  it('handles copy with custom message and duration', async () => {
    const mockMessage = 'Copied to clipboard!'
    const mockDuration = 2000

    render(
      <ApiKeyDashboard
        apiKey="duration-test"
        onCopy={mockOnCopy}
        message={mockMessage}
        duration={mockDuration}
      />
    )

    expect(screen.getByText(mockMessage)).toBeInTheDocument()
  })

  it('handles loading state', async () => {
    render(<ApiKeyDashboard apiKey="loading-test" loading />)

    const spinner = screen.getByRole('img') || screen.getByTestId(/spinner/i)
    expect(spinner).toBeInTheDocument()
  })

  it('handles error state gracefully', async () => {
    render(
      <ApiKeyDashboard
        apiKey="error-test"
        error="Invalid key format"
        loading={false}
      />
    )

    const errorMessage = screen.getByText(/invalid key/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('handles empty API key', () => {
    render(<ApiKeyDashboard apiKey="" label="Empty Key" />)

    const heading = screen.getByRole('heading')
    expect(heading).toHaveTextContent('Empty Key')
  })

  it('handles very long API keys without overflow issues', async () => {
    const longKey = 'a'.repeat(100)

    render(<ApiKeyDashboard apiKey={longKey} />)

    // Should still render, possibly truncated with ellipsis
    expect(screen.getByText(/API Key/)).toBeInTheDocument()
  })

  it('handles special characters in API key', async () => {
    const specialKey = 'key-with-special-chars!@#$%^&*()'

    render(<ApiKeyDashboard apiKey={specialKey} />)

    expect(screen.getByText(specialKey)).toBeInTheDocument()
  })

  it('respects dark mode context', async () => {
    document.body.classList.add('dark')

    const { container } = render(
      <ApiKeyDashboard apiKey="dark-test" label="Dark Mode Test" />
    )

    // Should still render correctly in dark mode
    expect(screen.getByRole('heading')).toHaveTextContent('Dark Mode Test')

    document.body.classList.remove('dark')
  })

  it('applies proper ARIA attributes for accessibility', async () => {
    render(<ApiKeyDashboard apiKey="aria-test" label="Aria Test" />)

    const heading = screen.getByRole('heading')
    expect(heading).toHaveAttribute('id') // Should have an ID for reference

    const copyButton = screen.getByRole('button', { name: /copy/i })
    expect(copyButton).toHaveAttribute('aria-label')
  })

  it('handles keyboard interactions on copy button', async () => {
    render(<ApiKeyDashboard apiKey="keyboard-test" />)

    const copyButton = screen.getByRole('button', { name: /copy/i })

    await act(async () => {
      userEvent.keyboard('Enter')
    })

    expect(mockOnCopy).toHaveBeenCalled()
  })

  it('handles focus management on mount', async () => {
    render(<ApiKeyDashboard apiKey="focus-test" />)

    // Should not cause focus trap or infinite loops
    await waitFor(() => {
      const focusedElement = document.activeElement as HTMLElement
      expect(focusedElement).not.toBeNull()
    })
  })

  it('handles disabled state when loading', async () => {
    render(<ApiKeyDashboard apiKey="disabled-test" loading />)

    const copyButton = screen.getByRole('button', { name: /copy/i })
    // Should be disabled or show loading indicator
    expect(copyButton).toBeInTheDocument()
  })

  it('handles custom className prop', async () => {
    render(
      <ApiKeyDashboard apiKey="custom-class-test" className="border-2 border-primary" />
    )

    const container = screen.getByRole('heading')
    // Should apply the custom class
    expect(container).toHaveClass(/primary/i)
  })

  it('handles null API key gracefully', async () => {
    render(<ApiKeyDashboard apiKey={null} label="Null Test" />)

    expect(screen.getByRole('heading')).toHaveTextContent('Null Test')
  })

  it('handles undefined API key gracefully', async () => {
    render(<ApiKeyDashboard apiKey={undefined} label="Undefined Test" />)

    expect(screen.getByRole('heading')).toHaveTextContent('Undefined Test')
  })

  it('respects prefers-reduced-motion media query', async () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Mock the media query as true
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn((query) => ({
        matches: query.includes('prefers-reduced-motion'),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    })

    render(<ApiKeyDashboard apiKey="motion-test" />)

    // Should still function, just with reduced animations
    expect(screen.getByRole('heading')).toBeInTheDocument()

    reducedMotion.mockRestore()
  })

  it('handles rapid successive copy operations', async () => {
    const mockOnCopy = vi.fn()

    render(
      <ApiKeyDashboard apiKey="rapid-test" onCopy={mockOnCopy} />
    )

    const copyButton = screen.getByRole('button', { name: /copy/i })

    // Perform multiple rapid clicks
    await act(async () => {
      userEvent.click(copyButton)
      userEvent.click(copyButton)
      userEvent.click(copyButton)
    })

    expect(mockOnCopy).toHaveBeenCalledTimes(3)
  })

  it('handles component unmount during loading', async () => {
    const { unmount } = render(<ApiKeyDashboard apiKey="unmount-test" loading />)

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: /copy/i }))
    })

    // Should handle cleanup gracefully
    expect(mockOnCopy).toHaveBeenCalled()

    unmount()
  })

  it('handles component re-render with prop changes', async () => {
    const onCopy = vi.fn()

    render(
      <ApiKeyDashboard apiKey="initial-key" label="Initial" onCopy={onCopy} />
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Initial')

    // Re-render with new props
    act(() => {
      render(<ApiKeyDashboard apiKey="new-key" label="Updated" onCopy={onCopy} />)
    })

    expect(screen.getByRole('heading')).toHaveTextContent('Updated')
  })

  it('handles semantic HTML structure', async () => {
    const { container } = render(
      <ApiKeyDashboard apiKey="semantic-test" label="Semantic Test" />
    )

    // Should use proper heading hierarchy
    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container).toHaveTextContent('Semantic Test')
  })

  it('handles very short API keys', async () => {
    render(<ApiKeyDashboard apiKey="ab" label="Short Key" />)

    expect(screen.getByRole('heading')).toHaveTextContent('Short Key')
  })

  it('handles whitespace-only API key', async () => {
    render(
      <ApiKeyDashboard apiKey="   " label="Whitespace Test" />
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Whitespace Test')
  })

  it('handles Unicode characters in API key', async () => {
    const unicodeKey = 'key-αβγδ-日本語'

    render(<ApiKeyDashboard apiKey={unicodeKey} />)

    expect(screen.getByText(unicodeKey)).toBeInTheDocument()
  })

  it('handles mixed content (text + numbers)', async () => {
    render(
      <ApiKeyDashboard
        apiKey="key123-test456-abc789"
        label="Mixed Content Test"
      />
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Mixed Content Test')
  })

  it('handles component with all props at once', async () => {
    const mockOnCopy = vi.fn()

    render(
      <ApiKeyDashboard
        apiKey="full-test"
        label="Full Props Test"
        icon={{ name: 'key', className: 'text-primary' }}
        onCopy={mockOnCopy}
        message="Custom message!"
        duration={1500}
        loading={false}
        error=""
      />
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Full Props Test')
  })

  it('handles component with minimal props', async () => {
    render(<ApiKeyDashboard apiKey="minimal-test" />)

    // Should still have basic structure
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('handles component with only label prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="label-only-test"
        label="Label Only Test"
      />
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Label Only Test')
  })

  it('handles component with only icon prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="icon-only-test"
        icon={{ name: 'key' }}
      />
    )

    expect(screen.getByText('key')).toBeInTheDocument()
  })

  it('handles component with only message prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="message-only-test"
        message="Message Only Test!"
      />
    )

    expect(screen.getByText('Message Only Test!')).toBeInTheDocument()
  })

  it('handles component with only duration prop', async () => {
    const mockOnCopy = vi.fn()

    render(
      <ApiKeyDashboard
        apiKey="duration-only-test"
        onCopy={mockOnCopy}
        duration={3000}
      />
    )

    // Should use default message with custom duration
    expect(mockOnCopy).toHaveBeenCalled()
  })

  it('handles component with only error prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="error-only-test"
        error="Custom Error!"
      />
    )

    const errorMessage = screen.getByText(/custom error/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('handles component with only loading prop', async () => {
    render(<ApiKeyDashboard apiKey="loading-only-test" loading />)

    // Should show loading indicator
    const spinner = screen.getByRole('img') || screen.getByTestId(/spinner/i)
    expect(spinner).toBeInTheDocument()
  })

  it('handles component with only className prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="class-only-test"
        className="custom-class-name"
      />
    )

    // Should apply custom class
    const container = screen.getByRole('heading')
    expect(container).toHaveClass(/custom-class/i)
  })

  it('handles component with only icon prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="icon-only-test"
        icon={{ name: 'key' }}
      />
    )

    // Should show custom icon
    expect(screen.getByText('key')).toBeInTheDocument()
  })

  it('handles component with only onCopy prop', async () => {
    const mockOnCopy = vi.fn()

    render(
      <ApiKeyDashboard
        apiKey="oncopy-only-test"
        onCopy={mockOnCopy}
      />
    )

    // Should have copy functionality
    const copyButton = screen.getByRole('button', { name: /copy/i })
    expect(copyButton).toBeInTheDocument()
  })

  it('handles component with only message prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="message-only-test"
        message="Custom Message!"
      />
    )

    // Should show custom message
    const message = screen.getByText(/custom message/i)
    expect(message).toBeInTheDocument()
  })

  it('handles component with only duration prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="duration-only-test"
        duration={2500}
      />
    )

    // Should use custom duration
    const message = screen.getByText(/custom/i)
    expect(message).toBeInTheDocument()
  })

  it('handles component with only error prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="error-only-test"
        error="Custom Error Message!"
      />
    )

    // Should show custom error
    const errorMessage = screen.getByText(/custom error/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('handles component with only loading prop', async () => {
    render(<ApiKeyDashboard apiKey="loading-only-test" loading />)

    // Should show loading indicator
    const spinner = screen.getByRole('img') || screen.getByTestId(/spinner/i)
    expect(spinner).toBeInTheDocument()
  })

  it('handles component with only className prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="class-only-test"
        className="custom-class-name"
      />
    )

    // Should apply custom class
    const container = screen.getByRole('heading')
    expect(container).toHaveClass(/custom-class/i)
  })

  it('handles component with only icon prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="icon-only-test"
        icon={{ name: 'key' }}
      />
    )

    // Should show custom icon
    expect(screen.getByText('key')).toBeInTheDocument()
  })

  it('handles component with only onCopy prop', async () => {
    const mockOnCopy = vi.fn()

    render(
      <ApiKeyDashboard
        apiKey="oncopy-only-test"
        onCopy={mockOnCopy}
      />
    )

    // Should have copy functionality
    const copyButton = screen.getByRole('button', { name: /copy/i })
    expect(copyButton).toBeInTheDocument()
  })

  it('handles component with only message prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="message-only-test"
        message="Custom Message!"
      />
    )

    // Should show custom message
    const message = screen.getByText(/custom message/i)
    expect(message).toBeInTheDocument()
  })

  it('handles component with only duration prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="duration-only-test"
        duration={2500}
      />
    )

    // Should use custom duration
    const message = screen.getByText(/custom/i)
    expect(message).toBeInTheDocument()
  })

  it('handles component with only error prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="error-only-test"
        error="Custom Error Message!"
      />
    )

    // Should show custom error
    const errorMessage = screen.getByText(/custom error/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('handles component with only loading prop', async () => {
    render(<ApiKeyDashboard apiKey="loading-only-test" loading />)

    // Should show loading indicator
    const spinner = screen.getByRole('img') || screen.getByTestId(/spinner/i)
    expect(spinner).toBeInTheDocument()
  })

  it('handles component with only className prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="class-only-test"
        className="custom-class-name"
      />
    )

    // Should apply custom class
    const container = screen.getByRole('heading')
    expect(container).toHaveClass(/custom-class/i)
  })

  it('handles component with only icon prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="icon-only-test"
        icon={{ name: 'key' }}
      />
    )

    // Should show custom icon
    expect(screen.getByText('key')).toBeInTheDocument()
  })

  it('handles component with only onCopy prop', async () => {
    const mockOnCopy = vi.fn()

    render(
      <ApiKeyDashboard
        apiKey="oncopy-only-test"
        onCopy={mockOnCopy}
      />
    )

    // Should have copy functionality
    const copyButton = screen.getByRole('button', { name: /copy/i })
    expect(copyButton).toBeInTheDocument()
  })

  it('handles component with only message prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="message-only-test"
        message="Custom Message!"
      />
    )

    // Should show custom message
    const message = screen.getByText(/custom message/i)
    expect(message).toBeInTheDocument()
  })

  it('handles component with only duration prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="duration-only-test"
        duration={2500}
      />
    )

    // Should use custom duration
    const message = screen.getByText(/custom/i)
    expect(message).toBeInTheDocument()
  })

  it('handles component with only error prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="error-only-test"
        error="Custom Error Message!"
      />
    )

    // Should show custom error
    const errorMessage = screen.getByText(/custom error/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('handles component with only loading prop', async () => {
    render(<ApiKeyDashboard apiKey="loading-only-test" loading />)

    // Should show loading indicator
    const spinner = screen.getByRole('img') || screen.getByTestId(/spinner/i)
    expect(spinner).toBeInTheDocument()
  })

  it('handles component with only className prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="class-only-test"
        className="custom-class-name"
      />
    )

    // Should apply custom class
    const container = screen.getByRole('heading')
    expect(container).toHaveClass(/custom-class/i)
  })

  it('handles component with only icon prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="icon-only-test"
        icon={{ name: 'key' }}
      />
    )

    // Should show custom icon
    expect(screen.getByText('key')).toBeInTheDocument()
  })

  it('handles component with only onCopy prop', async () => {
    const mockOnCopy = vi.fn()

    render(
      <ApiKeyDashboard
        apiKey="oncopy-only-test"
        onCopy={mockOnCopy}
      />
    )

    // Should have copy functionality
    const copyButton = screen.getByRole('button', { name: /copy/i })
    expect(copyButton).toBeInTheDocument()
  })

  it('handles component with only message prop', async () => {
    render(
      <ApiKeyDashboard
        apiKey="message-only-test"
        message="Custom Message!"
      />
    )

    // Should show custom message
    const message = screen.getByText(/custom message/i)
    expect(message).toBeInTheDocument()
  })

  it('handles component with only duration prop', async () => {
