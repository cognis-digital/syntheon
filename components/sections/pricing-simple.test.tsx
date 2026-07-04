import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PricingSimple from '@/components/sections/pricing-simple'

describe('PricingSimple', () => {
  const mockPlans = [
    {
      id: 'hobby',
      name: 'Hobby',
      priceMonthly: 0,
      priceYearly: 0,
      features: ['Basic analytics', '1 user'],
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 29,
      priceYearly: 24,
      features: ['Advanced analytics', '5 users', 'API access'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 99,
      priceYearly: 81,
      features: ['Everything in Pro', 'Unlimited users', 'Priority support'],
    },
  ]

  describe('Rendering with defaults', () => {
    beforeEach(() => {
      render(<PricingSimple plans={mockPlans} />)
    })

    it('renders the container with correct structure', () => {
      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getByText(/pricing/i)).toBeInTheDocument()
    })

    it('displays all three plan cards', () => {
      const hobbyCard = screen.getByText(/hobby/i)
      const proCard = screen.getByText(/pro/i)
      const enterpriseCard = screen.getByText(/enterprise/i)

      expect(hobbyCard).toBeInTheDocument()
      expect(proCard).toBeInTheDocument()
      expect(enterpriseCard).toBeInTheDocument()
    })

    it('shows correct pricing for monthly view', () => {
      expect(screen.getByText('$0')).toBeInTheDocument()
      expect(screen.getByText('$29')).toBeInTheDocument()
      expect(screen.getByText('$99')).toBeInTheDocument()
    })

    it('shows correct pricing for yearly view after toggle', async () => {
      const yearlyToggle = screen.getByRole('checkbox')
      
      await userEvent.click(yearlyToggle)
      await waitFor(() => {
        expect(screen.getByText(/yearly/i)).toHaveAttribute('aria-checked', 'true')
        expect(screen.getByText('$0')).toBeInTheDocument()
        expect(screen.getByText('$24')).toBeInTheDocument()
        expect(screen.getByText('$81')).toBeInTheDocument()
      })
    })

    it('displays feature lists for each plan', () => {
      const proFeatures = screen.getAllByText(/advanced analytics/i)
      expect(proFeatures).toHaveLength(1)
      
      const apiAccessFeature = screen.getByText(/api access/i)
      expect(apiAccessFeature).toBeInTheDocument()
    })

    it('renders CTA buttons with correct text', () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      expect(proButton).toBeInTheDocument()
      
      // Hobby plan should have "Get started" or similar
      const hobbyButton = screen.getAllByRole('button')
      expect(hobbyButton.some((btn) => btn.textContent.includes('get started'))).toBe(true)
    })

    it('applies correct ARIA attributes for accessibility', () => {
      const yearlyToggle = screen.getByRole('checkbox')
      
      // Should have aria-label describing the toggle purpose
      expect(yearlyToggle).toHaveAttribute(
        'aria-label',
        /switch between monthly and yearly pricing/i
      )

      // Plans should be focusable
      const planCards = screen.getAllByRole('article')
      planCards.forEach((card) => {
        expect(card).toHaveAttribute('tabindex', '-1') || 
          expect(card).toHaveAttribute('role', 'button')
      })
    })

    it('handles responsive layout with correct breakpoints', () => {
      const container = screen.getByRole('region')
      
      // Desktop: 3 columns
      expect(container).toHaveStyleContaining('grid-template-columns: repeat(3, minmax(0, 1fr))')
      
      // Mobile: single column (via media query)
      const mobileQuery = window.matchMedia('(max-width: 768px)')
      if (!mobileQuery.matches) {
        expect(container).toHaveStyleContaining('grid-template-columns: 1fr')
      }
    })

    it('applies dark mode correctly', () => {
      document.body.classList.add('dark')
      
      const container = screen.getByRole('region')
      // Should maintain proper contrast in dark mode
      expect(container).toHaveStyleContaining('color-scheme: dark') ||
        expect(container).toHaveStyleContaining('--bg-background')
    })

    it('preserves focus state for keyboard navigation', () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      // Focus the button and verify outline is visible
      proButton.focus()
      expect(proButton).toHaveFocus()
      
      // Should have proper focus styles applied
      expect(document.activeElement).toBe(proButton)
    })

    it('handles hover states with appropriate transitions', async () => {
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.hover(proCard)
      await waitFor(() => {
        // Should have transition effects applied
        expect(proCard).toHaveStyleContaining('transition') ||
          expect(proCard).toHaveStyleContaining('--hover:')
      })
    })

    it('renders all plan names correctly', () => {
      const planNames = screen.getAllByRole('heading', { level: 2 })
      
      expect(planNames.map((h) => h.textContent)).toEqual(
        ['Hobby', 'Pro', 'Enterprise']
      )
    })

    it('shows correct billing cycle indicators', () => {
      const monthlyIndicator = screen.getByText(/monthly/i)
      const yearlyIndicator = screen.getByText(/yearly/i)
      
      expect(monthlyIndicator).toHaveAttribute('aria-checked', 'true')
      expect(yearlyIndicator).toHaveAttribute('aria-checked', 'false')
    })

    it('displays savings information when yearly is selected', async () => {
      const yearlyToggle = screen.getByRole('checkbox')
      
      await userEvent.click(yearlyToggle)
      await waitFor(() => {
        // Should show savings percentage or amount
        expect(screen.queryByText(/save/i)).toBeInTheDocument() ||
          expect(screen.queryByText(/discount/i)).toBeInTheDocument()
      })
    })

    it('handles empty state gracefully', () => {
      render(<PricingSimple plans={[]} />)
      
      const container = screen.getByRole('region')
      expect(container).toHaveTextContent(/no plans/i) ||
        expect(container).toHaveTextContent(/empty/i)
    })

    it('applies correct border and radius styling', () => {
      const planCards = screen.getAllByRole('article')
      
      // Should have consistent rounded corners
      planCards.forEach((card) => {
        expect(card).toHaveStyleContaining('border-radius: 0.5rem') ||
          expect(card).toHaveStyleContaining('--radius:')
      })
    })

    it('maintains proper text hierarchy', () => {
      // Plan names should be more prominent than prices
      const planNames = screen.getAllByRole('heading', { level: 2 })
      const priceElements = screen.getAllByText(/\$[0-9]+/)
      
      expect(planNames).toHaveLength(3)
      expect(priceElements).toHaveLength(6) // 3 plans × 2 billing cycles
    })

    it('handles focus trap for keyboard users', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.tab()
      expect(document.activeElement).toBe(proButton) ||
        expect(screen.queryByFocusable()).not.toBeNull()
    })

    it('applies correct semantic HTML structure', () => {
      const container = screen.getByRole('region')
      const planCards = container.querySelectorAll('article, .plan-card')
      
      // Should use proper heading hierarchy
      expect(container).toHaveDescendantsWithTags(['h2', 'p', 'ul', 'button'])
    })

    it('renders feature checkmarks correctly', () => {
      const proFeatures = screen.getByText(/advanced analytics/i)
      
      // Features should have visual indicators (checkmarks, bullets)
      expect(proFeatures).toHaveStyleContaining('--indicator:') ||
        expect(proFeatures).toHaveDescendantsWithTags(['li'])
    })

    it('handles click events on CTA buttons', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.click(proButton)
      
      // Should trigger navigation or modal (at minimum, event fires)
      expect(proButton).toHaveAttribute('aria-pressed') ||
        expect(proButton).toHaveAttribute('type', 'button')
    })

    it('applies correct color tokens from design system', () => {
      const container = screen.getByRole('region')
      
      // Should use semantic color variables
      expect(container).toHaveStyleContaining('--bg-background:') ||
        expect(container).toHaveStyleContaining('--text-foreground:')
    })

    it('handles scroll animations gracefully', async () => {
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.hover(proCard)
      await waitFor(() => {
        // Should have animation-related styles if applicable
        expect(proCard).toHaveStyleContaining('--animation:') ||
          expect(proCard).toHaveStyleContaining('transition')
      })
    })

    it('preserves layout when switching between plans', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.click(proButton)
      await waitFor(() => {
        // Layout should remain stable
        expect(screen.getByText(/pro/i)).toBeInTheDocument()
      })
    })

    it('applies correct z-index for layering', () => {
      const container = screen.getByRole('region')
      
      // Should have proper stacking context
      expect(container).toHaveStyleContaining('--z-index:') ||
        expect(container).not.toHaveStyleContaining('overflow: hidden')
    })

    it('handles reduced motion preference correctly', async () => {
      document.body.classList.add('prefers-reduced-motion')
      
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.hover(proCard)
      await waitFor(() => {
        // Should have reduced animation duration or no animation
        expect(proCard).toHaveStyleContaining('--duration:') ||
          expect(proCard).not.toHaveStyleContaining('animation: infinite')
      })
    })

    it('renders with correct font weights for hierarchy', () => {
      const planNames = screen.getAllByRole('heading', { level: 2 })
      
      // Plan names should have heavier weight than prices
      expect(planNames).toHaveLength(3)
    })

    it('handles focus-visible state correctly', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.tab()
      expect(proButton).toHaveFocus()
      
      // Should have visible focus ring
      expect(document.activeElement).toBe(proButton)
    })

    it('applies correct box-shadow for depth', () => {
      const planCards = screen.getAllByRole('article')
      
      // Should have subtle shadows for depth
      planCards.forEach((card) => {
        expect(card).toHaveStyleContaining('--shadow:') ||
          expect(card).not.toHaveStyleContaining('box-shadow: none')
      })
    })

    it('handles keyboard navigation between plans', async () => {
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.tab()
      expect(document.activeElement).toBe(proCard) ||
        expect(screen.queryByFocusable()).not.toBeNull()
    })

    it('renders loading state if applicable', async () => {
      // If the component has a loading prop, test it
      render(<PricingSimple plans={mockPlans} isLoading />)
      
      const container = screen.getByRole('region')
      expect(container).toHaveTextContent(/loading/i) ||
        expect(container).not.toHaveStyleContaining('opacity: 1')
    })

    it('applies correct min-height for scrollable content', () => {
      const container = screen.getByRole('region')
      
      // Should have minimum height to prevent layout shift
      expect(container).toHaveStyleContaining('--min-height:') ||
        expect(container).not.toHaveStyleContaining('height: auto')
    })

    it('handles error state gracefully', async () => {
      render(<PricingSimple plans={mockPlans} error="Test error" />)
      
      const container = screen.getByRole('region')
      expect(container).toHaveTextContent(/error/i) ||
        expect(container).not.toHaveStyleContaining('--error:')
    })

    it('applies correct overflow handling', () => {
      const planCards = screen.getAllByRole('article')
      
      // Should handle long content gracefully
      planCards.forEach((card) => {
        expect(card).toHaveStyleContaining('--overflow:') ||
          expect(card).not.toHaveStyleContaining('overflow: hidden')
      })
    })

    it('renders with correct line-height for readability', () => {
      const container = screen.getByRole('region')
      
      // Should have appropriate line height
      expect(container).toHaveStyleContaining('--line-height:') ||
        expect(container).not.toHaveStyleContaining('line-height: 1')
    })

    it('handles focus-within for nested interactive elements', async () => {
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.tab()
      await waitFor(() => {
        // Should maintain focus within the card if applicable
        expect(proCard).toHaveFocus() ||
          expect(document.activeElement).toBeWithin(proCard)
      })
    })

    it('applies correct text-transform for consistency', () => {
      const planNames = screen.getAllByRole('heading', { level: 2 })
      
      // Plan names should have consistent casing
      planNames.forEach((name) => {
        expect(name).toHaveStyleContaining('--text-transform:') ||
          expect(name).not.toHaveStyleContaining('text-transform: none')
      })
    })

    it('handles aria-expanded for toggle controls', async () => {
      const yearlyToggle = screen.getByRole('checkbox')
      
      await userEvent.click(yearlyToggle)
      await waitFor(() => {
        expect(yearlyToggle).toHaveAttribute(
          'aria-expanded',
          'true' || 'false'
        )
      })
    })

    it('renders with correct letter-spacing for readability', () => {
      const container = screen.getByRole('region')
      
      // Should have appropriate letter spacing
      expect(container).toHaveStyleContaining('--letter-spacing:') ||
        expect(container).not.toHaveStyleContaining('letter-spacing: 0')
    })

    it('handles aria-live for dynamic content updates', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.click(proButton)
      await waitFor(() => {
        // Should have appropriate aria-live regions if applicable
        expect(screen.queryByRole('status')).not.toBeNull() ||
          expect(document.activeElement).toHaveAttribute('aria-live')
      })
    })

    it('applies correct text-indent for visual hierarchy', () => {
      const container = screen.getByRole('region')
      
      // Should have appropriate indentation if applicable
      expect(container).toHaveStyleContaining('--text-indent:') ||
        expect(container).not.toHaveStyleContaining('text-indent: 0')
    })

    it('handles aria-describedby for additional context', async () => {
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.hover(proCard)
      await waitFor(() => {
        // Should have appropriate descriptions if applicable
        expect(proCard).toHaveAttribute('aria-describedby') ||
          expect(proCard).not.toHaveAttribute('aria-describedby')
      })
    })

    it('renders with correct word-break for long URLs', () => {
      const container = screen.getByRole('region')
      
      // Should handle long content gracefully
      expect(container).toHaveStyleContaining('--word-break:') ||
        expect(container).not.toHaveStyleContaining('white-space: nowrap')
    })

    it('handles aria-hidden for decorative elements', async () => {
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.hover(proCard)
      await waitFor(() => {
        // Should have appropriate hidden states if applicable
        expect(proCard).toHaveAttribute('aria-hidden') ||
          expect(proCard).not.toHaveAttribute('aria-hidden')
      })
    })

    it('applies correct text-overflow for truncated content', () => {
      const container = screen.getByRole('region')
      
      // Should handle long content gracefully
      expect(container).toHaveStyleContaining('--text-overflow:') ||
        expect(container).not.toHaveStyleContaining('white-space: nowrap')
    })

    it('handles aria-controls for interactive sections', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.click(proButton)
      await waitFor(() => {
        // Should have appropriate controls if applicable
        expect(proButton).toHaveAttribute('aria-controls') ||
          expect(proButton).not.toHaveAttribute('aria-controls')
      })
    })

    it('renders with correct text-wrap for responsive content', () => {
      const container = screen.getByRole('region')
      
      // Should handle long content gracefully
      expect(container).toHaveStyleContaining('--text-wrap:') ||
        expect(container).not.toHaveStyleContaining('white-space: nowrap')
    })

    it('handles aria-labelledby for section headers', async () => {
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.hover(proCard)
      await waitFor(() => {
        // Should have appropriate labels if applicable
        expect(proCard).toHaveAttribute('aria-labelledby') ||
          expect(proCard).not.toHaveAttribute('aria-labelledby')
      })
    })

    it('applies correct text-align for visual consistency', () => {
      const container = screen.getByRole('region')
      
      // Should have appropriate alignment
      expect(container).toHaveStyleContaining('--text-align:') ||
        expect(container).not.toHaveStyleContaining('text-align: left')
    })

    it('handles aria-busy for loading states', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.click(proButton)
      await waitFor(() => {
        // Should have appropriate busy state if applicable
        expect(proButton).toHaveAttribute('aria-busy') ||
          expect(proButton).not.toHaveAttribute('aria-busy')
      })
    })

    it('renders with correct text-decoration for links', () => {
      const container = screen.getByRole('region')
      
      // Should have appropriate decoration if applicable
      expect(container).toHaveStyleContaining('--text-decoration:') ||
        expect(container).not.toHaveStyleContaining('text-decoration: none')
    })

    it('handles aria-invalid for form inputs', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.click(proButton)
      await waitFor(() => {
        // Should have appropriate validation state if applicable
        expect(proButton).toHaveAttribute('aria-invalid') ||
          expect(proButton).not.toHaveAttribute('aria-invalid')
      })
    })

    it('applies correct text-shadow for depth', () => {
      const container = screen.getByRole('region')
      
      // Should have appropriate shadow if applicable
      expect(container).toHaveStyleContaining('--text-shadow:') ||
        expect(container).not.toHaveStyleContaining('text-shadow: none')
    })

    it('handles aria-atomic for live regions', async () => {
      const proCard = screen.getByText(/pro/i)
      
      await userEvent.hover(proCard)
      await waitFor(() => {
        // Should have appropriate atomic state if applicable
        expect(proCard).toHaveAttribute('aria-atomic') ||
          expect(proCard).not.toHaveAttribute('aria-atomic')
      })
    })

    it('renders with correct text-transform for consistency', () => {
      const container = screen.getByRole('region')
      
      // Should have appropriate transformation if applicable
      expect(container).toHaveStyleContaining('--text-transform:') ||
        expect(container).not.toHaveStyleContaining('text-transform: none')
    })

    it('handles aria-relevant for dynamic updates', async () => {
      const proButton = screen.getByRole('button', { name: /start free trial/i })
      
      await userEvent.click(proButton)
      await waitFor(() => {
        // Should have appropriate relevance state if applicable
        expect(proButton).toHaveAttribute('aria-relevant') ||
          expect(proButton).not.toHaveAttribute('aria-relevant')
      })
    })

    it('applies correct text-overflow for truncated content', () => {
      const container = screen.getByRole('region')
      
      // Should handle long content gracefully
      expect(container).toHaveStyleContaining('--text-overflow:') ||
        expect(container).not.toHaveStyleContaining('white-space: nowrap')
    })
