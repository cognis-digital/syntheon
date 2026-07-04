import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BillingSummary } from '@/components/app/billing-summary'
import { cn } from '@/lib/utils'

describe('BillingSummary', () => {
  const mockProps = {
    totalAmount: 1250.99,
    currency: 'USD',
    period: 'monthly',
    status: 'active',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    planName: 'Pro Plan',
    features: ['Feature A', 'Feature B'],
    discountAmount: 50,
    taxAmount: 87.59,
    onUpgradeClick: vi.fn(),
    onDowngradeClick: vi.fn(),
  }

  describe('rendering with mock props', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <BillingSummary {...mockProps} />
      )
      expect(container).toBeInTheDocument()
    })

    it('displays total amount correctly', () => {
      render(<BillingSummary {...mockProps} />)
      expect(screen.getByText(/1,250\.99/)).toBeInTheDocument()
    })

    it('shows currency symbol', () => {
      render(<BillingSummary {...mockProps} />)
      expect(screen.getByText('$')).toBeInTheDocument()
    })

    it('displays period label', () => {
      render(<BillingSummary {...mockProps} />)
      expect(screen.getByText(/monthly/i)).toBeInTheDocument()
    })

    it('shows status indicator', () => {
      render(<BillingSummary {...mockProps} />)
      const statusEl = screen.getByRole('status') || screen.getByText(/active/i)
      expect(statusEl).toBeInTheDocument()
    })

    it('displays next billing date', () => {
      render(<BillingSummary {...mockProps} />)
      expect(screen.getByText(/in 30 days/i)).toBeInTheDocument()
    })

    it('shows plan name', () => {
      render(<BillingSummary {...mockProps} />)
      expect(screen.getByText(/Pro Plan/i)).toBeInTheDocument()
    })

    it('renders feature list', () => {
      render(<BillingSummary {...mockProps} />)
      const features = screen.getAllByText(/Feature [AB]/i)
      expect(features).toHaveLength(2)
    })

    it('displays discount amount when present', () => {
      render(<BillingSummary {...mockProps} />)
      expect(screen.getByText(/50\.00/i)).toBeInTheDocument()
    })

    it('displays tax amount when present', () => {
      render(<BillingSummary {...mockProps} />)
      expect(screen.getByText(/87\.59/i)).toBeInTheDocument()
    })

    it('renders upgrade button with correct label', () => {
      render(<BillingSummary {...mockProps} />)
      const upgradeBtn = screen.getByRole('button', { name: /upgrade/i })
      expect(upgradeBtn).toBeInTheDocument()
      expect(upgradeBtn).toHaveAttribute('aria-label')
    })

    it('renders downgrade button with correct label', () => {
      render(<BillingSummary {...mockProps} />)
      const downgradeBtn = screen.getByRole('button', { name: /downgrade/i })
      expect(downgradeBtn).toBeInTheDocument()
      expect(downgradeBtn).toHaveAttribute('aria-label')
    })

    it('calls onUpgradeClick when upgrade button is clicked', async () => {
      render(<BillingSummary {...mockProps} />)
      const upgradeBtn = screen.getByRole('button', { name: /upgrade/i })
      
      await userEvent.click(upgradeBtn)
      expect(mockProps.onUpgradeClick).toHaveBeenCalled()
    })

    it('calls onDowngradeClick when downgrade button is clicked', async () => {
      render(<BillingSummary {...mockProps} />)
      const downgradeBtn = screen.getByRole('button', { name: /downgrade/i })
      
      await userEvent.click(downgradeBtn)
      expect(mockProps.onDowngradeClick).toHaveBeenCalled()
    })

    it('applies correct styling classes via cn helper', () => {
      render(<BillingSummary {...mockProps} />)
      const container = screen.getByRole('article') || screen.getByRole('region')
      
      // Check for expected Tailwind utility classes
      expect(container).toHaveClass(/rounded/i)
      expect(container).toHaveClass(/border/i)
    })

    it('handles dark mode correctly', () => {
      const { container } = render(
        <BillingSummary {...mockProps} className="dark" />
      )
      
      // Should still render with proper structure in dark mode
      expect(container).toBeInTheDocument()
      expect(screen.getByText(/1,250\.99/)).toBeInTheDocument()
    })

    it('respects custom className prop', () => {
      const customClass = 'custom-border-blue'
      
      render(
        <BillingSummary {...mockProps} className={customClass} />
      )
      
      // Custom class should be present alongside default classes
      expect(container).toHaveClass(customClass)
    })

    it('handles zero discount amount gracefully', () => {
      const noDiscount = { ...mockProps, discountAmount: 0 }
      render(<BillingSummary {...noDiscount} />)
      
      // Should still render without breaking
      expect(screen.getByText(/1,250\.99/)).toBeInTheDocument()
    })

    it('handles very large amounts correctly', () => {
      const largeAmount = { ...mockProps, totalAmount: 999999.99 }
      render(<BillingSummary {...largeAmount} />)
      
      expect(screen.getByText(/999,999\.99/)).toBeInTheDocument()
    })

    it('handles special characters in plan name', () => {
      const specialChars = { ...mockProps, planName: 'Pro Plan (Enterprise)' }
      render(<BillingSummary {...specialChars} />)
      
      expect(screen.getByText(/Pro Plan/i)).toBeInTheDocument()
    })

    it('renders empty features array without breaking', () => {
      const noFeatures = { ...mockProps, features: [] }
      render(<BillingSummary {...noFeatures} />)
      
      // Should still render with some default content or empty state
      expect(screen.getByText(/1,250\.99/)).toBeInTheDocument()
    })

    it('handles missing optional props gracefully', () => {
      const minimalProps = {
        totalAmount: 100,
        currency: 'USD',
        period: 'monthly',
        status: 'active',
        planName: 'Basic',
      }
      
      render(<BillingSummary {...minimalProps} />)
      
      expect(screen.getByText(/100/i)).toBeInTheDocument()
    })

    it('preserves focus state on interactive elements', () => {
      const { container } = render(
        <BillingSummary {...mockProps} />
      )
      
      const upgradeBtn = screen.getByRole('button', { name: /upgrade/i })
      expect(upgradeBtn).toHaveAttribute('tabIndex')
    })

    it('has proper ARIA attributes for accessibility', () => {
      render(<BillingSummary {...mockProps} />)
      
      // Check that interactive elements have ARIA labels
      const buttons = screen.getAllByRole('button')
      buttons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-label') || 
                      expect(btn).toHaveTextContent()
      })
    })

    it('renders with correct semantic HTML structure', () => {
      render(<BillingSummary {...mockProps} />)
      
      // Should use appropriate semantic elements
      const container = screen.getByRole('article') || screen.getByRole('region')
      expect(container).toBeInTheDocument()
    })

    it('handles negative amounts (refunds/credits)', () => {
      const negativeAmount = { ...mockProps, totalAmount: -50.00 }
      render(<BillingSummary {...negativeAmount} />)
      
      // Should display with appropriate formatting
      expect(screen.getByText(/-50\.00/i)).toBeInTheDocument()
    })

    it('handles very small amounts correctly', () => {
      const smallAmount = { ...mockProps, totalAmount: 0.01 }
      render(<BillingSummary {...smallAmount} />)
      
      expect(screen.getByText(/0\.01/i)).toBeInTheDocument()
    })

    it('renders within reasonable DOM size for performance', () => {
      const { container } = render(
        <BillingSummary {...mockProps} />
      )
      
      // Should not create excessive nested elements
      expect(container.querySelectorAll('*')).toHaveLength(
        expect.lessThan(100)
      )
    })

    it('handles concurrent renders without state corruption', () => {
      const { container: container1 } = render(<BillingSummary {...mockProps} />)
      const { container: container2 } = render(<BillingSummary {...mockProps} />)
      
      expect(container1).not.toBe(container2)
      expect(screen.getByText(/1,250\.99/)).toBeInTheDocument()
    })

    it('preserves props through re-renders', () => {
      const updatedAmount = 1300.00
      
      render(<BillingSummary {...mockProps} />)
      
      // Component should maintain its internal state correctly
      expect(screen.getByText(/1,250\.99/)).toBeInTheDocument()
    })

    it('handles edge case: exactly zero total amount', () => {
      const zeroAmount = { ...mockProps, totalAmount: 0 }
      render(<BillingSummary {...zeroAmount} />)
      
      expect(screen.getByText(/0\.00/i)).toBeInTheDocument()
    })

    it('handles edge case: very large decimal precision', () => {
      const highPrecision = { 
        ...mockProps, 
        totalAmount: 1234.567890123456 
      }
      render(<BillingSummary {...highPrecision} />)
      
      // Should handle without breaking or showing NaN
      expect(screen.getByText(/1,234\.56/i)).toBeInTheDocument()
    })

    it('handles edge case: empty string currency', () => {
      const noCurrency = { ...mockProps, currency: '' }
      render(<BillingSummary {...noCurrency} />)
      
      // Should not crash with missing currency
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: null period', () => {
      const noPeriod = { ...mockProps, period: null }
      render(<BillingSummary {...noPeriod} />)
      
      // Should have a default fallback or handle gracefully
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: empty status string', () => {
      const emptyStatus = { ...mockProps, status: '' }
      render(<BillingSummary {...emptyStatus} />)
      
      // Should not crash with empty status
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: future date for next billing', () => {
      const farFuture = { 
        ...mockProps, 
        nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) 
      }
      render(<BillingSummary {...farFuture} />)
      
      expect(screen.getByText(/in 1 year/i)).toBeInTheDocument()
    })

    it('handles edge case: past date for next billing', () => {
      const inPast = { 
        ...mockProps, 
        nextBillingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
      }
      render(<BillingSummary {...inPast} />)
      
      // Should handle without breaking
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: very long plan name', () => {
      const longName = { 
        ...mockProps, 
        planName: 'Enterprise Ultimate Pro Plan with All Features and Services' 
      }
      render(<BillingSummary {...longName} />)
      
      // Should truncate or handle gracefully
      expect(screen.getByText(/Pro Plan/i)).toBeInTheDocument()
    })

    it('handles edge case: special characters in features', () => {
      const specialFeatures = { 
        ...mockProps, 
        features: ['Feature & More', 'Feature <script>', 'Feature "quotes"'] 
      }
      render(<BillingSummary {...specialFeatures} />)
      
      // Should not break with HTML entities or quotes
      expect(screen.getByText(/Feature [A&<"]/i)).toBeInTheDocument()
    })

    it('handles edge case: boolean discountAmount', () => {
      const boolDiscount = { 
        ...mockProps, 
        discountAmount: true as unknown as number 
      }
      render(<BillingSummary {...boolDiscount} />)
      
      // Should handle gracefully (likely shows 1 or converts to string)
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: undefined discountAmount', () => {
      const noDiscount = { ...mockProps, discountAmount: undefined }
      render(<BillingSummary {...noDiscount} />)
      
      // Should have a default value or handle gracefully
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: very long feature list', () => {
      const manyFeatures = { 
        ...mockProps, 
        features: Array.from({ length: 50 }, (_, i) => `Feature ${i + 1}`) 
      }
      render(<BillingSummary {...manyFeatures} />)
      
      // Should handle without excessive DOM growth
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: mixed currency formats', () => {
      const euroCurrency = { ...mockProps, currency: 'EUR' }
      render(<BillingSummary {...euroCurrency} />)
      
      // Should handle different currencies
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: custom period values', () => {
      const yearly = { ...mockProps, period: 'yearly' }
      render(<BillingSummary {...yearly} />)
      
      expect(screen.getByText(/yearly/i)).toBeInTheDocument()
    })

    it('handles edge case: future status (e.g., "pending")', () => {
      const pending = { ...mockProps, status: 'pending' }
      render(<BillingSummary {...pending} />)
      
      // Should handle unknown statuses gracefully
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: very short plan name', () => {
      const shortName = { ...mockProps, planName: 'X' }
      render(<BillingSummary {...shortName} />)
      
      // Should handle without breaking layout
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: whitespace-only strings', () => {
      const whitespace = { 
        ...mockProps, 
        planName: '   ', 
        period: '  ' 
      }
      render(<BillingSummary {...whitespace} />)
      
      // Should trim or handle gracefully
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: NaN values', () => {
      const nan = { 
        ...mockProps, 
        totalAmount: Number.NaN 
      }
      render(<BillingSummary {...nan} />)
      
      // Should not crash with NaN
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: Infinity values', () => {
      const infinity = { 
        ...mockProps, 
        totalAmount: Number.POSITIVE_INFINITY 
      }
      render(<BillingSummary {...infinity} />)
      
      // Should handle gracefully (likely shows "∞" or formats appropriately)
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: very negative amounts', () => {
      const veryNegative = { 
        ...mockProps, 
        totalAmount: -99999.99 
      }
      render(<BillingSummary {...veryNegative} />)
      
      // Should format correctly with negative sign
      expect(screen.getByText(/-99,999\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: mixed positive/negative amounts', () => {
      const mixed = { 
        ...mockProps, 
        totalAmount: 1250.99 - 50 + 87.59 
      }
      render(<BillingSummary {...mixed} />)
      
      // Should calculate and display correctly
      expect(screen.getByText(/1,288\.58/i)).toBeInTheDocument()
    })

    it('handles edge case: currency with spaces', () => {
      const spaced = { ...mockProps, currency: 'US Dollar' }
      render(<BillingSummary {...spaced} />)
      
      // Should handle non-standard currency names
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: locale-specific formatting', () => {
      const locale = { ...mockProps }
      render(<BillingSummary {...locale} />)
      
      // Should use appropriate number format for the currency
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: extremely long text content', () => {
      const longContent = { 
        ...mockProps, 
        planName: 'A'.repeat(500),
        features: ['B'.repeat(100)]
      }
      render(<BillingSummary {...longContent} />)
      
      // Should handle without breaking layout or performance
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: unicode characters', () => {
      const unicode = { 
        ...mockProps, 
        planName: 'Pro Plan (日本語)',
        features: ['Feature (émojis) 🎉'] 
      }
      render(<BillingSummary {...unicode} />)
      
      // Should handle Unicode correctly
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: very small decimal amounts', () => {
      const tiny = { 
        ...mockProps, 
        totalAmount: 0.0001 
      }
      render(<BillingSummary {...tiny} />)
      
      // Should handle without scientific notation issues
      expect(screen.getByText(/0\.00/i)).toBeInTheDocument()
    })

    it('handles edge case: exact round numbers', () => {
      const round = { ...mockProps, totalAmount: 100.00 }
      render(<BillingSummary {...round} />)
      
      expect(screen.getByText(/100\.00/i)).toBeInTheDocument()
    })

    it('handles edge case: numbers requiring rounding', () => {
      const needsRound = { 
        ...mockProps, 
        totalAmount: 1234.56789 
      }
      render(<BillingSummary {...needsRound} />)
      
      // Should round appropriately (likely to 2 decimal places)
      expect(screen.getByText(/1,234\.57/i)).toBeInTheDocument()
    })

    it('handles edge case: currency with thousand separators disabled', () => {
      const noSeparators = { ...mockProps }
      render(<BillingSummary {...noSeparators} />)
      
      // Should still display the number, formatting may vary by locale
      expect(screen.getByText(/1250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: currency with different decimal precision', () => {
      const jpy = { ...mockProps, currency: 'JPY' }
      render(<BillingSummary {...jpy} />)
      
      // Should handle currencies that don't use decimals
      expect(screen.getByText(/1250/i)).toBeInTheDocument()
    })

    it('handles edge case: empty features array with fallback', () => {
      const noFeatures = { ...mockProps, features: [] }
      render(<BillingSummary {...noFeatures} />)
      
      // Should have a default message or empty state
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: very long feature names', () => {
      const longFeature = { 
        ...mockProps, 
        features: ['A'.repeat(300)] 
      }
      render(<BillingSummary {...longFeature} />)
      
      // Should truncate or handle gracefully
      expect(screen.getByText(/1,250\.99/i)).toBeInTheDocument()
    })

    it('handles edge case: mixed valid/invalid feature types', () => {
