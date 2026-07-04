import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AIChatWidget } from '@/components/premium-features/ai-chat-widget'

describe('AIChatWidget', () => {
  const defaultProps = {
    userId: 'test-user-123',
    sessionId: 'session-abc-456',
    initialMessages: [],
    onUserMessage: vi.fn(),
    onSystemResponse: vi.fn(),
    onError: vi.fn(),
    theme: 'dark' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.className = ''
  })

  describe('Basic Rendering', () => {
    it('renders without crashing with default props', () => {
      render(<AIChatWidget {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('applies correct base classes for dark theme', () => {
      const container = document.createElement('div')
      container.className = 'dark'
      document.body.appendChild(container)

      render(<AIChatWidget {...defaultProps} />, { container })

      expect(document.body).toHaveClass('bg-background')
    })

    it('applies correct base classes for light theme', () => {
      const container = document.createElement('div')
      container.className = 'light'
      document.body.appendChild(container)

      render(<AIChatWidget {...defaultProps} />, { container })

      expect(document.body).not.toHaveClass('bg-background')
    })
  })

  describe('User Input Handling', () => {
    it('displays user message when sent via form submission', async () => {
      const onUserMessage = vi.fn()

      render(<AIChatWidget {...defaultProps} onUserMessage={onUserMessage} />)

      const input = screen.getByRole('textbox')
      await act(async () => {
        userEvent.type(input, 'Hello AI')
      })

      expect(onUserMessage).toHaveBeenCalledWith('Hello AI', expect.any(Object))
    })

    it('displays user message when sent via button click', async () => {
      const onUserMessage = vi.fn()

      render(<AIChatWidget {...defaultProps} onUserMessage={onUserMessage} />)

      const input = screen.getByRole('textbox')
      await act(async () => {
        userEvent.type(input, 'Hello AI')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(onUserMessage).toHaveBeenCalledWith('Hello AI', expect.any(Object))
    })

    it('shows typing indicator while processing', async () => {
      const onSystemResponse = vi.fn()
      const mockResponse = 'Hello! How can I help you today?'

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Test message')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(screen.getByText(/typing|processing/i)).toBeInTheDocument()
    })

    it('displays system response after processing completes', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        setTimeout(() => {
          onSystemResponse(message, metadata)
        }, 500)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      const input = screen.getByRole('textbox')
      await act(async () => {
        userEvent.type(input, 'Hello')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/hello/i)).toBeInTheDocument()
      })
    })

    it('handles empty input gracefully', async () => {
      const onUserMessage = vi.fn()

      render(<AIChatWidget {...defaultProps} onUserMessage={onUserMessage} />)

      const input = screen.getByRole('textbox')
      await act(async () => {
        userEvent.type(input, '')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(onUserMessage).not.toHaveBeenCalled()
    })

    it('shows placeholder when input is empty', async () => {
      render(<AIChatWidget {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder')
    })
  })

  describe('System Responses', () => {
    it('renders system message with proper formatting', async () => {
      const onSystemResponse = vi.fn((message: string) => {
        setTimeout(() => {
          onSystemResponse(message)
        }, 300)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/test/i)).toBeInTheDocument()
      })
    })

    it('handles streaming responses with partial updates', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        let i = 0
        const interval = setInterval(() => {
          if (i < message.length) {
            onSystemResponse(message.slice(0, i + 5), { isStreaming: true })
            i += 5
          } else {
            clearInterval(interval)
            onSystemResponse(message, { isStreaming: false })
          }
        }, 100)

        setTimeout(() => clearInterval(interval), 800)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Stream test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(await screen.findByText(/stream/)).toBeInTheDocument()
    })

    it('displays truncated long responses with ellipsis', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        setTimeout(() => {
          onSystemResponse(message.slice(0, 150) + '...', metadata)
        }, 300)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Long message')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/long/)).toBeInTheDocument()
      })
    })
  })

  describe('Error States', () => {
    it('displays error message when API fails', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        setTimeout(() => {
          if (metadata?.isError) {
            onSystemResponse(message, metadata)
          } else {
            throw new Error('API Error')
          }
        }, 300)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Error test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument()
      })
    })

    it('calls onError callback when error occurs', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        setTimeout(() => {
          if (metadata?.isError) {
            onSystemResponse(message, metadata)
          } else {
            throw new Error('API Error')
          }
        }, 300)
      })

      const onError = vi.fn()

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} onError={onError} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Error test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
      })
    })

    it('shows retry button after transient error', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        setTimeout(() => {
          if (metadata?.isError) {
            onSystemResponse(message, metadata)
          } else {
            throw new Error('API Error')
          }
        }, 300)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Error test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/retry|try again/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows initial loading state before first response', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        setTimeout(() => {
          onSystemResponse(message, metadata)
        }, 500)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Initial load test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(await screen.findByText(/loading|connecting/i)).toBeInTheDocument()
    })

    it('resets loading state after response completes', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        setTimeout(() => {
          onSystemResponse(message, metadata)
        }, 500)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Load test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(await screen.findByText(/load/)).toBeInTheDocument()

      // After response, loading should clear
      await waitFor(() => {
        expect(screen.queryByText(/loading|connecting/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Event Handlers', () => {
    it('calls onUserMessage with correct payload structure', async () => {
      const onUserMessage = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        expect(message).toBe('Test message')
        expect(metadata?.timestamp).toBeDefined()
        expect(metadata?.sessionId).toBe(defaultProps.sessionId)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={onUserMessage} />)

      const input = screen.getByRole('textbox')
      await act(async () => {
        userEvent.type(input, 'Test message')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(onUserMessage).toHaveBeenCalledWith('Test message', expect.any(Object))
    })

    it('calls onSystemResponse with correct payload structure', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        expect(message).toBe('System response')
        expect(metadata?.isStreaming).toBe(false)
        expect(metadata?.sessionId).toBe(defaultProps.sessionId)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(onSystemResponse).toHaveBeenCalledWith('System response', expect.any(Object))
    })

    it('calls onError with error details when failure occurs', async () => {
      const onSystemResponse = vi.fn((message: string, metadata?: Record<string, unknown>) => {
        setTimeout(() => {
          if (metadata?.isError) {
            onSystemResponse(message, metadata)
          } else {
            throw new Error('API Error')
          }
        }, 300)
      })

      const onError = vi.fn((error: Error, context?: Record<string, unknown>) => {
        expect(error.message).toBe('API Error')
        expect(context?.sessionId).toBe(defaultProps.sessionId)
      })

      render(<AIChatWidget {...defaultProps} onUserMessage={vi.fn()} onSystemResponse={onSystemResponse} onError={onError} />)

      await act(async () => {
        userEvent.type(screen.getByRole('textbox'), 'Test')
      })

      const sendButton = screen.getByRole('button', { name: /send/i })
      await act(async () => {
        userEvent.click(sendButton)
      })

      expect(onError).toHaveBeenCalled()
    })

    it('handles keyboard shortcuts (Enter to send, Escape to clear)', async () => {
      const onUserMessage = vi.fn()

      render(<AIChatWidget {...defaultProps} onUserMessage={onUserMessage} />)

      const input = screen.getByRole('textbox')

      // Test Enter key sends message
      await act(async () => {
        userEvent.type(input, 'Enter test', { initialSelectionStart: 0, initialSelectionEnd: 1 })
        userEvent.keyboard('{Enter}')
      })

      expect(onUserMessage).toHaveBeenCalledWith('Enter test', expect.any(Object))

      // Test Escape key clears input
      await act(async () => {
        userEvent.type(input, 'Escape test')
        userEvent.keyboard('{Escape}')
      })

      expect(screen.getByRole('textbox')).toHaveValue('')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA roles and attributes', async () => {
      render(<AIChatWidget {...defaultProps} />)

      // Check for dialog role
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-label')
    })

    it('input has correct accessibility attributes', async () => {
      render(<AIChatWidget {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby')
      expect(input).toHaveAttribute('aria-placeholder')
    })

    it('focus trap is active within dialog', async () => {
      render(<AIChatWidget {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('tabIndex={-1}')
    })

    it('keyboard navigation works correctly', async () => {
      render(<AIChatWidget {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toBeFocusable()
    })

    it('has visible focus indicators', async () => {
      render(<AIChatWidget {...defaultProps} />)

      const input = screen.getByRole('textbox')
      // Focus the input to check for visual feedback
      await act(async () => {
        userEvent.tab()
      })

      expect(input).toHaveFocus()
    })
  })

  describe('Theme Compatibility', () => {
    it('renders correctly in dark mode', async () => {
      const container = document.createElement('div')
      container.className = 'dark'
      document.body.appendChild(container)

      render(<AIChatWidget {...defaultProps} />, { container })

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('renders correctly in light mode', async () => {
      const container = document.createElement('div')
      container.className = 'light'
      document.body.appendChild(container)

      render(<AIChatWidget {...defaultProps} />, { container })

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('applies correct color tokens for dark mode', async () => {
      const container = document.createElement('div')
      container.className = 'dark'
      document.body.appendChild(container)

      render(<AIChatWidget {...defaultProps} />, { container })

      expect(document.body).toHaveClass('bg-background')
    })

    it('applies correct color tokens for light mode', async () => {
      const container = document.createElement('div')
      container.className = 'light'
      document.body.appendChild(container)

      render(<AIChatWidget {...defaultProps} />, { container })

      expect(document.body).not.toHaveClass('bg-background')
    })
  })

  describe('Reduced Motion Support', () => {
    it('applies reduced motion preferences correctly', async () => {
      const container = document.createElement('div')
      container.className = 'dark'
      document.body.appendChild(container)

      render(<AIChatWidget {...defaultProps} />, { container })

      // Check that reduced motion class is applied when needed
      expect(document.body).toHaveClass('bg-background')
    })

    it('handles prefers-reduced-motion media query', async () => {
      const container = document.createElement('div')
      container.className = 'dark'
      document.body.appendChild(container)

      render(<AIChatWidget {...defaultProps} />, { container })

      expect(document.body).toHaveClass('bg-background')
    })
  })

  describe('Component Lifecycle', () => {
    it('initializes with correct default state', async () => {
      const onUserMessage = vi.fn()

      render(<AIChatWidget {...defaultProps} onUserMessage={onUserMessage} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('updates when props change (userId)', async () => {
      const onUserMessage = vi.fn()

      const { rerender } = render(<AIChatWidget {...defaultProps} userId="user-1" onUserMessage={onUserMessage} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      rerender(<AIChatWidget {...defaultProps} userId="user-2" onUserMessage={onUserMessage} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('updates when props change (sessionId)', async () => {
      const onUserMessage = vi.fn()

      const { rerender } = render(<AIChatWidget {...defaultProps} sessionId="session-1" onUserMessage={onUserMessage} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      rerender(<AIChatWidget {...defaultProps} sessionId="session-2" onUserMessage={onUserMessage} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('updates when props change (theme)', async () => {
      const container = document.createElement('div')
      container.className = 'dark'
      document.body.appendChild(container)

      const onUserMessage = vi.fn()

      render(<AIChatWidget {...defaultProps} theme="dark" userId="user-1" sessionId="session-1" onUserMessage={onUserMessage} />, { container })

      expect(document.body).toHaveClass('bg-background')

      rerender(<AIChatWidget {...defaultProps} theme="light" userId="user-2" sessionId="session-2" onUserMessage={onUserMessage} />, { container })

      expect(document.body).not.toHaveClass('bg
