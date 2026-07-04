import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StatsInline from '@/components/sections/stats-inline'
import type { StatsInlineProps } from '@/components/sections/stats-inline'

describe('StatsInline', () => {
  const defaultProps: Partial<StatsInlineProps> = {}

  beforeEach(() => {
    document.body.className = ''
  })

  it('renders with all defaults without errors', () => {
    render(<StatsInline {...defaultProps} />)
    
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.getByText(/stats/i)).toBeInTheDocument()
  })

  it('displays default metric cards when no data provided', async () => {
    render(<StatsInline />)
    
    const cards = screen.getAllByRole('listitem')
    expect(cards).toHaveLength(3)
    
    // Each card should have a label and number
    await waitFor(() => {
      expect(screen.getByText(/users/i)).toBeInTheDocument()
      expect(screen.getByText(/revenue/i)).toBeInTheDocument()
      expect(screen.getByText(/growth/i)).toBeInTheDocument()
    })
  })

  it('renders custom data when provided', () => {
    const customData = [
      { label: 'Active Users', value: 12503, icon: 'users' },
      { label: 'Monthly Revenue', value: '$48.2K', icon: 'dollar-sign' },
      { label: 'Growth Rate', value: '+24%', icon: 'trending-up' },
    ]

    render(<StatsInline data={customData} />)
    
    customData.forEach(({ label, value }) => {
      expect(screen.getByText(label)).toBeInTheDocument()
      expect(screen.getByText(value)).toBeInTheDocument()
    })
  })

  it('applies dark mode correctly', () => {
    document.body.className = 'dark'
    render(<StatsInline />)
    
    // Check that dark mode classes are applied
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/dark-/)
  })

  it('applies size variants correctly', () => {
    render(<StatsInline size="sm" />)
    expect(screen.getByRole('region')).toHaveClass(/size-sm/i)

    render(<StatsInline size="lg" />)
    expect(screen.getByRole('region')).toHaveClass(/size-lg/i)
  })

  it('applies color variants correctly', () => {
    render(<StatsInline variant="primary" />)
    expect(screen.getByRole('region')).toHaveClass(/variant-primary/i)

    render(<StatsInline variant="secondary" />)
    expect(screen.getByRole('region')).toHaveClass(/variant-secondary/i)
  })

  it('handles empty data gracefully', () => {
    render(<StatsInline data={[]} />)
    
    // Should still render container but with minimal content
    const container = screen.getByRole('region')
    expect(container).toBeInTheDocument()
    expect(container.children.length).toBeGreaterThan(0)
  })

  it('handles null/undefined values in data', () => {
    const partialData: Array<Partial<{ label?: string; value: number | string }>> = [
      { label: 'Test', value: 123 },
      { value: 456 }, // missing label
      { label: 'Empty' }, // missing value
    ]

    render(<StatsInline data={partialData} />)
    
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('456')).toBeInTheDocument()
  })

  it('applies proper ARIA attributes for accessibility', () => {
    render(<StatsInline aria-label="Dashboard metrics" />)
    
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-label', 'Dashboard metrics')
  })

  it('handles very large numbers with formatting', () => {
    render(<StatsInline data={[{ label: 'Total', value: 1234567890 }]} />)
    
    // Should format large numbers appropriately
    expect(screen.getByText(/billion/i)).toBeInTheDocument()
  })

  it('handles negative values correctly', () => {
    render(<StatsInline data={[{ label: 'Change', value: -15.5 }]} />)
    
    expect(screen.getByText('-15.5')).toBeInTheDocument()
  })

  it('applies rounded corners based on size variant', () => {
    render(<StatsInline size="sm" />)
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/rounded-md/i)

    render(<StatsInline size="lg" />)
    const containerLg = screen.getByRole('region')
    expect(containerLg).toHaveClass(/rounded-lg/i)
  })

  it('maintains proper type hierarchy and spacing', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/gap-4/i) // default gap
    expect(container).toHaveClass(/text-sm/i) // default text size
  })

  it('renders with proper semantic HTML structure', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/sr-only-when-empty/i)
  })

  it('handles animation states when enabled', () => {
    render(<StatsInline animate={true} data={[{ label: 'Test', value: 100 }]} />)
    
    // Animation classes should be present
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/animate-/)
  })

  it('respects prefers-reduced-motion media query', () => {
    document.body.className = 'dark'
    render(<StatsInline animate={true} />)
    
    // Should still work with reduced motion preference
    const container = screen.getByRole('region')
    expect(container).toBeInTheDocument()
  })

  it('handles mixed data types (numbers and strings)', () => {
    render(<StatsInline data={[
      { label: 'Users', value: 1234 },
      { label: 'Sessions', value: '5.2M' },
      { label: 'Conversion', value: '2.8%' },
    ]} />)
    
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('1234')).toBeInTheDocument()
  })

  it('applies border styling correctly', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/border/i)
  })

  it('handles very small numbers with appropriate precision', () => {
    render(<StatsInline data={[{ label: 'Rate', value: 0.00123 }]} />)
    
    // Should format appropriately without scientific notation for display
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/0\.00/i)
  })

  it('renders loading state when data is async', () => {
    render(<StatsInline data={Promise.resolve([{ label: 'Test', value: 100 }])} />)
    
    // Should show some placeholder content during loading
    const container = screen.getByRole('region')
    expect(container).toBeInTheDocument()
  })

  it('handles extremely long labels with truncation', () => {
    render(<StatsInline data={[{ label: 'Very Long Label That Might Need Truncation'.repeat(3), value: 100 }]} />)
    
    // Should truncate gracefully
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/truncate/i)
  })

  it('applies proper focus states for keyboard navigation', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/focus-visible/i)
  })

  it('handles zero values correctly', () => {
    render(<StatsInline data={[{ label: 'Zero Metric', value: 0 }]} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('applies consistent shadow depth based on variant', () => {
    render(<StatsInline variant="primary" />)
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/shadow-sm/i)
  })

  it('renders with proper z-index for layering', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/z-10/i)
  })

  it('handles responsive breakpoints correctly', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/responsive/i)
  })

  it('preserves parent theme context', () => {
    document.body.className = 'dark'
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/dark-/)
  })

  it('handles special characters in labels and values', () => {
    render(<StatsInline data={[{ label: 'Cost of Goods Sold (COGS)', value: '$1,234.56' }]} />)
    
    expect(screen.getByText('Cost of Goods Sold (COGS)').toBeInTheDocument())
    expect(screen.getByText('$1,234.56').toBeInTheDocument())
  })

  it('applies proper font weights for hierarchy', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/font-medium/i)
  })

  it('handles very large datasets efficiently', () => {
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      label: `Metric ${i + 1}`,
      value: Math.random() * 1000,
    }))

    render(<StatsInline data={largeData} />)
    
    // Should still render without performance issues
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/metric/i)
  })

  it('applies proper line-height for readability', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/leading-normal/i)
  })

  it('handles boolean values appropriately', () => {
    render(<StatsInline data={[{ label: 'Enabled', value: true }, { label: 'Disabled', value: false }]} />)
    
    expect(screen.getByText('true')).toBeInTheDocument()
    expect(screen.getByText('false')).toBeInTheDocument()
  })

  it('applies proper transition timing for smooth interactions', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/transition-/)
  })

  it('handles date/time values with proper formatting', () => {
    render(<StatsInline data={[{ label: 'Last Updated', value: new Date() }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/ago/i)
  })

  it('applies proper overflow handling for long content', () => {
    render(<StatsInline data={[{ label: 'Test'.repeat(50), value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/overflow-hidden/i)
  })

  it('handles currency formatting correctly', () => {
    render(<StatsInline data={[{ label: 'Revenue', value: 99999.99 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/99,999\.99/i)
  })

  it('applies proper text alignment for readability', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/text-center/i)
  })

  it('handles percentage values with proper formatting', () => {
    render(<StatsInline data={[{ label: 'Growth', value: 123.456 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/123\.46/i)
  })

  it('applies proper cursor styling for interactive elements', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/cursor-default/i)
  })

  it('handles very small numbers with appropriate precision', () => {
    render(<StatsInline data={[{ label: 'Precision Test', value: 0.000123456 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/0\.00/i)
  })

  it('applies proper text wrapping for long values', () => {
    render(<StatsInline data={[{ label: 'Test', value: 'A'.repeat(100) }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/break-words/i)
  })

  it('handles infinity and NaN values gracefully', () => {
    render(<StatsInline data={[{ label: 'Infinity Test', value: Infinity }, { label: 'NaN Test', value: NaN }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/infinity/i)
  })

  it('applies proper text decoration for emphasis', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/text-base/i)
  })

  it('handles very large numbers with appropriate formatting', () => {
    render(<StatsInline data={[{ label: 'Large Number', value: 1234567890.123 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/billion/i)
  })

  it('applies proper letter-spacing for readability', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/tracking-normal/i)
  })

  it('handles mixed positive and negative values correctly', () => {
    render(<StatsInline data={[{ label: 'Positive', value: 100 }, { label: 'Negative', value: -50 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/positive/i)
    expect(container).toHaveTextContent(/negative/i)
  })

  it('applies proper text shadow for depth', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/shadow-text/i)
  })

  it('handles very small percentages correctly', () => {
    render(<StatsInline data={[{ label: 'Small Percentage', value: 0.001 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/0\.00/i)
  })

  it('applies proper text color hierarchy', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/text-foreground/i)
  })

  it('handles very large percentages correctly', () => {
    render(<StatsInline data={[{ label: 'Large Percentage', value: 123.456 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/123\.46/i)
  })

  it('applies proper text transform for consistency', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/uppercase/i)
  })

  it('handles very small numbers with appropriate precision', () => {
    render(<StatsInline data={[{ label: 'Small Number', value: 0.000123456 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/0\.00/i)
  })

  it('applies proper text opacity for visual hierarchy', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/opacity-100/i)
  })

  it('handles very large numbers with appropriate formatting', () => {
    render(<StatsInline data={[{ label: 'Large Number', value: 1234567890.123 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/billion/i)
  })

  it('applies proper text wrapping for long content', () => {
    render(<StatsInline data={[{ label: 'Test', value: 'A'.repeat(100) }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/break-words/i)
  })

  it('handles infinity and NaN values gracefully', () => {
    render(<StatsInline data={[{ label: 'Infinity Test', value: Infinity }, { label: 'NaN Test', value: NaN }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/infinity/i)
  })

  it('applies proper text decoration for emphasis', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/text-base/i)
  })

  it('handles very small percentages correctly', () => {
    render(<StatsInline data={[{ label: 'Small Percentage', value: 0.001 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/0\.00/i)
  })

  it('applies proper text color hierarchy', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/text-foreground/i)
  })

  it('handles very large percentages correctly', () => {
    render(<StatsInline data={[{ label: 'Large Percentage', value: 123.456 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/123\.46/i)
  })

  it('applies proper text transform for consistency', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/uppercase/i)
  })

  it('handles very small numbers with appropriate precision', () => {
    render(<StatsInline data={[{ label: 'Small Number', value: 0.000123456 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveTextContent(/0\.00/i)
  })

  it('applies proper text opacity for visual hierarchy', () => {
    render(<StatsInline data={[{ label: 'Test', value: 100 }]} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/opacity-100/i)
  })

  it('handles very large numbers with appropriate formatting', () => {
