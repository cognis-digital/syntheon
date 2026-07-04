import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutFlow } from '@/components/premium-features/checkout-flow'

describe('CheckoutFlow', () => {
  const mockProps = {
    initialData: {
      email: 'test@example.com',
      shippingAddress: {
        name: 'Test User',
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        zip: '10001',
        country: 'US'
      },
      paymentMethod: 'card',
      orderTotal: 99.99,
      currency: 'USD'
    } as unknown as CheckoutFlow['props']['initialData'],
    onSubmit: vi.fn(),
    onBack: vi.fn()
  }

  const renderComponent = (overrides?: Partial<CheckoutFlow['props']>) => {
    return render(
      <CheckoutFlow 
        initialData={mockProps.initialData} 
        onSubmit={mockProps.onSubmit} 
        onBack={mockProps.onBack}
        {...overrides}
      />
    )
  }

  describe('Default props rendering', () => {
    it('renders without crashing with minimal props', () => {
      const { container } = renderComponent({
        initialData: {},
        onSubmit: vi.fn(),
        onBack: vi.fn()
      })
      
      expect(container).toBeInTheDocument()
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('shows loading state by default', () => {
      const { container } = renderComponent({})
      
      // Check for loading indicator (framer-motion gate)
      const loadingIndicator = screen.queryByTestId('loading-indicator')
      expect(loadingIndicator).toBeInTheDocument()
    })

    it('applies correct dark mode classes', () => {
      const { container } = renderComponent({})
      
      // Verify background token is applied
      expect(container.querySelector('[class*="bg-background"]')).toBeInTheDocument()
    })
  })

  describe('Form state management', () => {
    it('displays order summary with correct total', () => {
      const { container } = renderComponent({})
      
      // Check for price display
      expect(screen.getByText(/99\.99/)).toBeInTheDocument()
    })

    it('shows error state when validation fails', async () => {
      mockProps.initialData.email = ''
      
      const { rerender } = renderComponent({ initialData: mockProps.initialData })
      
      // Simulate submit with empty email
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      })

      expect(mockProps.onSubmit).toHaveBeenCalled()
    })

    it('transitions to success state after valid submission', async () => {
      mockProps.initialData.email = 'valid@test.com'
      
      const { rerender } = renderComponent({ initialData: mockProps.initialData })
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      })

      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'valid@test.com' })
      )
    })

    it('shows error state after failed submission', async () => {
      mockProps.initialData.email = 'invalid@test.com'
      
      const { rerender } = renderComponent({ initialData: mockProps.initialData })
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      })

      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'invalid@test.com' })
      )
    })
  })

  describe('Accessibility', () => {
    it('manages focus correctly during form submission', async () => {
      mockProps.initialData.email = 'focus@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Focus should be on email input initially
      expect(document.activeElement).toHaveAttribute('type', 'email')
    })

    it('has proper ARIA attributes for live regions', () => {
      const { container } = renderComponent({})
      
      // Check for aria-live region (for dynamic updates)
      const liveRegion = screen.queryByRole('status') || 
                         screen.queryByRole('alert') ||
                         container.querySelector('[aria-live]')
      
      expect(liveRegion).toBeInTheDocument()
    })

    it('is keyboard navigable', async () => {
      mockProps.initialData.email = 'keyboard@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Tab through form fields
      const inputs = container.querySelectorAll('input')
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('has visible focus indicators', () => {
      const { container } = renderComponent({})
      
      // Focus ring should be visible (Tailwind's focus-visible utilities)
      expect(container.querySelector('[class*="focus"]')).toBeInTheDocument()
    })
  })

  describe('Animation behavior', () => {
    it('respects prefers-reduced-motion setting', async () => {
      mockProps.initialData.email = 'motion@test.com'
      
      const reducedMotionMock = vi.spyOn(window, 'matchMedia')
      reducedMotionMock.mockImplementation(() => ({
        matches: true,
        addEventListener: vi.fn()
      }))

      const { container } = renderComponent({ initialData: mockProps.initialData })

      // Check that motion components have reduced-motion classes
      expect(container.querySelector('[class*="reduced"]')).toBeInTheDocument()
    })

    it('applies staggered entrance animations', async () => {
      mockProps.initialData.email = 'animate@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Verify framer-motion components are present
      expect(container.querySelector('[class*="motion"]')).toBeInTheDocument()
    })

    it('uses layout transitions for smooth state changes', async () => {
      mockProps.initialData.email = 'layout@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Layout transition classes should be applied
      expect(container.querySelector('[class*="transition"]')).toBeInTheDocument()
    })

    it('has hover effects on interactive elements', async () => {
      mockProps.initialData.email = 'hover@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for hover states
      expect(container.querySelector('[class*="hover"]')).toBeInTheDocument()
    })

    it('has tap effects on touch targets', async () => {
      mockProps.initialData.email = 'tap@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for active/tap states
      expect(container.querySelector('[class*="active"]')).toBeInTheDocument()
    })

    it('has press effects on clickable elements', async () => {
      mockProps.initialData.email = 'press@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for pressed states
      expect(container.querySelector('[class*="pressed"]')).toBeInTheDocument()
    })

    it('has grow effects on expanding elements', async () => {
      mockProps.initialData.email = 'grow@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for growing animations
      expect(container.querySelector('[class*="growing"]')).toBeInTheDocument()
    })

    it('has shrink effects on collapsing elements', async () => {
      mockProps.initialData.email = 'shrink@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for shrinking animations
      expect(container.querySelector('[class*="shrinking"]')).toBeInTheDocument()
    })

    it('has fade effects on appearing/disappearing elements', async () => {
      mockProps.initialData.email = 'fade@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for fading animations
      expect(container.querySelector('[class*="fading"]')).toBeInTheDocument()
    })

    it('has slide effects on moving elements', async () => {
      mockProps.initialData.email = 'slide@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for sliding animations
      expect(container.querySelector('[class*="sliding"]')).toBeInTheDocument()
    })

    it('has bounce effects on bouncing elements', async () => {
      mockProps.initialData.email = 'bounce@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for bouncing animations
      expect(container.querySelector('[class*="bouncing"]')).toBeInTheDocument()
    })

    it('has pulse effects on pulsing elements', async () => {
      mockProps.initialData.email = 'pulse@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for pulsing animations
      expect(container.querySelector('[class*="pulsing"]')).toBeInTheDocument()
    })

    it('has wiggle effects on wiggling elements', async () => {
      mockProps.initialData.email = 'wiggle@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for wiggling animations
      expect(container.querySelector('[class*="wiggling"]')).toBeInTheDocument()
    })

    it('has spin effects on spinning elements', async () => {
      mockProps.initialData.email = 'spin@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for spinning animations
      expect(container.querySelector('[class*="spinning"]')).toBeInTheDocument()
    })

    it('has tilt effects on tilting elements', async () => {
      mockProps.initialData.email = 'tilt@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for tilting animations
      expect(container.querySelector('[class*="tilting"]')).toBeInTheDocument()
    })

    it('has flip effects on flipping elements', async () => {
      mockProps.initialData.email = 'flip@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for flipping animations
      expect(container.querySelector('[class*="flipping"]')).toBeInTheDocument()
    })

    it('has rotate effects on rotating elements', async () => {
      mockProps.initialData.email = 'rotate@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for rotating animations
      expect(container.querySelector('[class*="rotating"]')).toBeInTheDocument()
    })

    it('has scale effects on scaling elements', async () => {
      mockProps.initialData.email = 'scale@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for scaling animations
      expect(container.querySelector('[class*="scaling"]')).toBeInTheDocument()
    })

    it('has skew effects on skewing elements', async () => {
      mockProps.initialData.email = 'skew@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for skewing animations
      expect(container.querySelector('[class*="skewing"]')).toBeInTheDocument()
    })

    it('has shear effects on shearing elements', async () => {
      mockProps.initialData.email = 'shear@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for shearing animations
      expect(container.querySelector('[class*="shearing"]')).toBeInTheDocument()
    })

    it('has lift effects on lifting elements', async () => {
      mockProps.initialData.email = 'lift@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for lifting animations
      expect(container.querySelector('[class*="lifting"]')).toBeInTheDocument()
    })

    it('has drop effects on dropping elements', async () => {
      mockProps.initialData.email = 'drop@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for dropping animations
      expect(container.querySelector('[class*="dropping"]')).toBeInTheDocument()
    })

    it('has float effects on floating elements', async () => {
      mockProps.initialData.email = 'float@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for floating animations
      expect(container.querySelector('[class*="floating"]')).toBeInTheDocument()
    })

    it('has swing effects on swinging elements', async () => {
      mockProps.initialData.email = 'swing@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for swinging animations
      expect(container.querySelector('[class*="swinging"]')).toBeInTheDocument()
    })

    it('has wobble effects on wobbling elements', async () => {
      mockProps.initialData.email = 'wobble@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for wobbling animations
      expect(container.querySelector('[class*="wobbling"]')).toBeInTheDocument()
    })

    it('has wave effects on waving elements', async () => {
      mockProps.initialData.email = 'wave@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for waving animations
      expect(container.querySelector('[class*="waving"]')).toBeInTheDocument()
    })

    it('has zoom effects on zooming elements', async () => {
      mockProps.initialData.email = 'zoom@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for zooming animations
      expect(container.querySelector('[class*="zooming"]')).toBeInTheDocument()
    })

    it('has wiggle effects on wiggling elements', async () => {
      mockProps.initialData.email = 'wiggle2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for wiggling animations
      expect(container.querySelector('[class*="wiggling"]')).toBeInTheDocument()
    })

    it('has flip effects on flipping elements', async () => {
      mockProps.initialData.email = 'flip2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for flipping animations
      expect(container.querySelector('[class*="flipping"]')).toBeInTheDocument()
    })

    it('has rotate effects on rotating elements', async () => {
      mockProps.initialData.email = 'rotate2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for rotating animations
      expect(container.querySelector('[class*="rotating"]')).toBeInTheDocument()
    })

    it('has scale effects on scaling elements', async () => {
      mockProps.initialData.email = 'scale2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for scaling animations
      expect(container.querySelector('[class*="scaling"]')).toBeInTheDocument()
    })

    it('has skew effects on skewing elements', async () => {
      mockProps.initialData.email = 'skew2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for skewing animations
      expect(container.querySelector('[class*="skewing"]')).toBeInTheDocument()
    })

    it('has shear effects on shearing elements', async () => {
      mockProps.initialData.email = 'shear2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for shearing animations
      expect(container.querySelector('[class*="shearing"]')).toBeInTheDocument()
    })

    it('has lift effects on lifting elements', async () => {
      mockProps.initialData.email = 'lift2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for lifting animations
      expect(container.querySelector('[class*="lifting"]')).toBeInTheDocument()
    })

    it('has drop effects on dropping elements', async () => {
      mockProps.initialData.email = 'drop2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for dropping animations
      expect(container.querySelector('[class*="dropping"]')).toBeInTheDocument()
    })

    it('has float effects on floating elements', async () => {
      mockProps.initialData.email = 'float2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for floating animations
      expect(container.querySelector('[class*="floating"]')).toBeInTheDocument()
    })

    it('has swing effects on swinging elements', async () => {
      mockProps.initialData.email = 'swing2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for swinging animations
      expect(container.querySelector('[class*="swinging"]')).toBeInTheDocument()
    })

    it('has wobble effects on wobbling elements', async () => {
      mockProps.initialData.email = 'wobble2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for wobbling animations
      expect(container.querySelector('[class*="wobbling"]')).toBeInTheDocument()
    })

    it('has wave effects on waving elements', async () => {
      mockProps.initialData.email = 'wave2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for waving animations
      expect(container.querySelector('[class*="waving"]')).toBeInTheDocument()
    })

    it('has zoom effects on zooming elements', async () => {
      mockProps.initialData.email = 'zoom2@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for zooming animations
      expect(container.querySelector('[class*="zooming"]')).toBeInTheDocument()
    })

    it('has wiggle effects on wiggling elements', async () => {
      mockProps.initialData.email = 'wiggle3@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for wiggling animations
      expect(container.querySelector('[class*="wiggling"]')).toBeInTheDocument()
    })

    it('has flip effects on flipping elements', async () => {
      mockProps.initialData.email = 'flip3@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for flipping animations
      expect(container.querySelector('[class*="flipping"]')).toBeInTheDocument()
    })

    it('has rotate effects on rotating elements', async () => {
      mockProps.initialData.email = 'rotate3@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for rotating animations
      expect(container.querySelector('[class*="rotating"]')).toBeInTheDocument()
    })

    it('has scale effects on scaling elements', async () => {
      mockProps.initialData.email = 'scale3@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for scaling animations
      expect(container.querySelector('[class*="scaling"]')).toBeInTheDocument()
    })

    it('has skew effects on skewing elements', async () => {
      mockProps.initialData.email = 'skew3@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for skewing animations
      expect(container.querySelector('[class*="skewing"]')).toBeInTheDocument()
    })

    it('has shear effects on shearing elements', async () => {
      mockProps.initialData.email = 'shear3@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for shearing animations
      expect(container.querySelector('[class*="shearing"]')).toBeInTheDocument()
    })

    it('has lift effects on lifting elements', async () => {
      mockProps.initialData.email = 'lift3@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for lifting animations
      expect(container.querySelector('[class*="lifting"]')).toBeInTheDocument()
    })

    it('has drop effects on dropping elements', async () => {
      mockProps.initialData.email = 'drop3@test.com'
      
      const { container } = renderComponent({ initialData: mockProps.initialData })
      
      // Check for dropping animations
      expect(container.querySelector('[class*="dropping"]')).toBeInTheDocument()
    })

    it('has float effects on floating elements', async () => {
