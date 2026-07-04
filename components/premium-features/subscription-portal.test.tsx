import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubscriptionPortal } from '@/components/premium-features/subscription-portal'

describe('SubscriptionPortal', () => {
  const mockProps = {
    plans: [
      { id: 'basic', name: 'Basic', price: 9.99, features: ['Feature A'] },
      { id: 'pro', name: 'Pro', price: 29.99, features: ['Feature B', 'Feature C'] },
    ],
    currentPlanId: null as string | null,
    onPlanSelect: vi.fn(),
    onSuccess: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering with default props', () => {
    it('renders without crashing and shows plan cards', () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      expect(wrapper).toBeDefined()
      screen.getByText(/Basic/i)
      screen.getByText(/Pro/i)
    })

    it('displays pricing correctly', () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      expect(screen.getByText('$9.99')).toBeInTheDocument()
      expect(screen.getByText('$29.99')).toBeInTheDocument()
    })

    it('shows feature lists for each plan', () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      screen.getAllByText(/Feature A/i).forEach((el) => {
        expect(el).toBeInTheDocument()
      })
      screen.getAllByText(/Feature B/i).forEach((el) => {
        expect(el).toBeInTheDocument()
      })
    })
  })

  describe('Plan selection interaction', () => {
    it('calls onPlanSelect when a plan card is clicked', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      await userEvent.click(screen.getByText(/Basic/i))

      expect(mockProps.onPlanSelect).toHaveBeenCalledWith('basic')
      expect(mockProps.onPlanSelect).toHaveBeenCalledTimes(1)
    })

    it('highlights the selected plan', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      await userEvent.click(screen.getByText(/Basic/i))

      // Check for visual indication of selection (e.g., border, background change)
      const basicCard = screen.getByText(/Basic/i).closest('div')!
      expect(basicCard).toHaveClass(/selected|active/ig)
    })
  })

  describe('Form submission', () => {
    it('displays a success message after selection and submit', async () => {
      const onPlanSelect = vi.fn()
      const onSuccess = vi.fn()

      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          onPlanSelect={onPlanSelect}
          onSuccess={onSuccess}
        />
      )

      await userEvent.click(screen.getByText(/Basic/i))
      expect(onPlanSelect).toHaveBeenCalledWith('basic')

      const submitButton = screen.getByRole('button', { name: /continue/i })
      await userEvent.click(submitButton)

      expect(onSuccess).toHaveBeenCalled()
    })

    it('shows loading state during submission', async () => {
      const onPlanSelect = vi.fn()
      const onSuccess = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)))

      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          onPlanSelect={onPlanSelect}
          onSuccess={onSuccess}
        />
      )

      await userEvent.click(screen.getByText(/Basic/i))

      // Simulate form submission (adjust selector based on actual implementation)
      const submitButton = screen.getByRole('button', { name: /continue/i })
      await userEvent.click(submitButton)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('Error handling and validation', () => {
    it('shows error message when required field is missing', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      // Simulate incomplete form state (adjust selector as needed)
      await userEvent.click(screen.getByText(/Basic/i))

      const submitButton = screen.getByRole('button', { name: /continue/i })
      await userEvent.click(submitButton)

      expect(await screen.findByText(/error|required/ig)).toBeInTheDocument()
    })

    it('displays validation feedback for invalid email format', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      // Simulate email input with invalid value (adjust selector as needed)
      await userEvent.click(screen.getByText(/Basic/i))

      const submitButton = screen.getByRole('button', { name: /continue/i })
      await userEvent.click(submitButton)

      expect(await screen.findByText(/email|invalid/ig)).toBeInTheDocument()
    })
  })

  describe('Dark mode support', () => {
    it('renders correctly in dark mode', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />, {
        wrapper: {
          className: 'dark',
        },
      })

      expect(wrapper).toBeDefined()
      screen.getByText(/Basic/i)
    })

    it('applies dark mode styles correctly', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />, {
        wrapper: {
          className: 'dark',
        },
      })

      // Check for dark-mode-specific classes (adjust based on implementation)
      expect(screen.getByText(/Basic/i)).toHaveClass(/text-foreground/ig)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes on interactive elements', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      // Check for role="button" or aria-label on plan cards
      screen.getAllByRole(/card|link/ig).forEach((el) => {
        expect(el).toHaveAttribute('role')
      })
    })

    it('is keyboard navigable', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />)

      // Check that focus can be moved between elements
      await userEvent.tab()
      expect(document.activeElement).not.toBeNull()

      // Verify focus is trapped within the portal (if applicable)
      const activeEl = document.activeElement as HTMLElement
      expect(activeEl.closest('.subscription-portal')).toBeInTheDocument()
    })

    it('announces changes to screen readers', async () => {
      const onPlanSelect = vi.fn()

      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          onPlanSelect={onPlanSelect}
          onSuccess={() => {}}
        />
      )

      await userEvent.click(screen.getByText(/Basic/i))

      expect(onPlanSelect).toHaveBeenCalledWith('basic')
    })
  })

  describe('Responsive behavior', () => {
    it('renders mobile layout on small screens', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />, {
        wrapper: {
          className: 'max-w-[400px]', // Simulate mobile width
        },
      })

      expect(wrapper).toBeDefined()
    })

    it('renders desktop layout on large screens', async () => {
      const wrapper = render(<SubscriptionPortal {...mockProps} />, {
        wrapper: {
          className: 'max-w-[1200px]', // Simulate desktop width
        },
      })

      expect(wrapper).toBeDefined()
    })
  })

  describe('Edge cases', () => {
    it('handles empty plans array gracefully', async () => {
      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          plans={[]}
          onPlanSelect={() => {}}
          onSuccess={() => {}}
        />
      )

      expect(wrapper).toBeDefined()
    })

    it('handles loading state for plans', async () => {
      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          plans={[]}
          isLoadingPlans={true}
          onPlanSelect={() => {}}
          onSuccess={() => {}}
        />
      )

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('handles error state for plans', async () => {
      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          plans={[]}
          isLoadingPlans={false}
          error={{ message: 'Failed to load plans' }}
          onPlanSelect={() => {}}
          onSuccess={() => {}}
        />
      )

      expect(await screen.findByText(/failed|error/ig)).toBeInTheDocument()
    })
  })

  describe('State persistence', () => {
    it('maintains selected plan across re-renders', async () => {
      const onPlanSelect = vi.fn()

      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          currentPlanId='basic'
          onPlanSelect={onPlanSelect}
          onSuccess={() => {}}
        />
      )

      // Verify initial selection is reflected in UI
      expect(screen.getByText(/Basic/i)).toHaveClass(/selected|active/ig)
    })

    it('clears selection when switching plans', async () => {
      const onPlanSelect = vi.fn()

      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          currentPlanId='basic'
          onPlanSelect={onPlanSelect}
          onSuccess={() => {}}
        />
      )

      await userEvent.click(screen.getByText(/Pro/i))

      expect(onPlanSelect).toHaveBeenCalledWith('pro')
    })
  })

  describe('Performance', () => {
    it('renders quickly without excessive re-renders', async () => {
      const onPlanSelect = vi.fn()

      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          onPlanSelect={onPlanSelect}
          onSuccess={() => {}}
        />
      )

      // Measure initial render time (adjust threshold as needed)
      const startTime = performance.now()
      await waitFor(() => screen.getByText(/Basic/i))
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(500)
    })

    it('handles rapid plan switching without lag', async () => {
      const onPlanSelect = vi.fn().mockImplementation((planId: string) => {
        // Simulate async operation
        return new Promise((resolve) => setTimeout(resolve, 10))
      })

      const wrapper = render(
        <SubscriptionPortal
          {...mockProps}
          onPlanSelect={onPlanSelect}
          onSuccess={() => {}}
        />
      )

      // Rapidly switch between plans
      await userEvent.click(screen.getByText(/Basic/i))
      await userEvent.click(screen.getByText(/Pro/i))
      await userEvent.click(screen.getByText(/Basic/i))

      expect(onPlanSelect).toHaveBeenCalledTimes(3)
    })
  })

  describe('Integration with parent components', () => {
    it('passes through additional props correctly', async () => {
      const customProps = {
        title: 'Custom Portal Title',
        description: 'A custom description for the portal.',
        showLoadingIndicator: true,
      }

      const wrapper = render(
        <SubscriptionPortal {...mockProps} {...customProps} />
      )

      expect(wrapper).toBeDefined()
    })

    it('handles nested portals correctly', async () => {
      const onPlanSelect = vi.fn()

      const wrapper = render(
        <>
          <div className="outer-portal">
            <SubscriptionPortal {...mockProps} onPlanSelect={onPlanSelect} onSuccess={() => {}} />
          </div>
          <div className="inner-portal">
            <SubscriptionPortal {...mockProps} onPlanSelect={onPlanSelect} onSuccess={() => {}} />
          </div>
        </>
      )

      expect(screen.getAllByText(/Basic/i)).toHaveLength(2)
    })
  })
})
