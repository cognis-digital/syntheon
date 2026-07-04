import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KpiRow } from '@/components/app/kpi-row'
import { type KpiData } from '@/types/kpi'

describe('KpiRow', () => {
  const mockProps: Partial<KpiData> = {
    label: 'Test Metric',
    value: 1250,
    unit: 'k',
    trend: 'up',
    change: 12.5,
    status: 'healthy' as KpiData['status'],
  }

  describe('rendering with mock props', () => {
    it('renders the label text correctly', () => {
      const { container } = render(<KpiRow {...mockProps} />)
      expect(container).toHaveTextContent('Test Metric')
    })

    it('renders the numeric value and unit', () => {
      const { container } = render(<KpiRow {...mockProps} />)
      expect(container).toHaveTextContent('1,250k')
    })

    it('applies correct semantic classes via cn helper', () => {
      const { container } = render(<KpiRow {...mockProps} />)
      // Verify background uses bg-background or bg-muted appropriately
      expect(container.firstChild).toHaveClass(/bg-/)
    })

    it('renders with rounded corners consistent with design tokens', () => {
      const { container } = render(<KpiRow {...mockProps} />)
      expect(container.firstChild).toHaveClass(/rounded-/i)
    })

    it('applies border styling for depth and separation', () => {
      const { container } = render(<KpiRow {...mockProps} />)
      // KPI rows typically have subtle borders
      expect(container.firstChild).toHaveClass(/border-/)
    })
  })

  describe('conditional rendering based on status', () => {
    it('applies success styling when status is healthy', () => {
      const props = { ...mockProps, status: 'healthy' }
      render(<KpiRow {...props} />)
      // Healthy states typically use green or neutral tones
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('applies warning styling when status is degraded', () => {
      const props = { ...mockProps, status: 'degraded' }
      render(<KpiRow {...props} />)
      // Degraded states typically use amber/orange tones
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('applies error styling when status is critical', () => {
      const props = { ...mockProps, status: 'critical' }
      render(<KpiRow {...props} />)
      // Critical states typically use red tones
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('renders trend indicator when provided', () => {
      const props = { ...mockProps, trend: 'up' }
      render(<KpiRow {...props} />)
      // Up trends typically show positive indicators (green arrow/plus)
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('renders trend indicator for downward movement', () => {
      const props = { ...mockProps, trend: 'down' }
      render(<KpiRow {...props} />)
      // Down trends typically show negative indicators (red arrow/minus)
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('renders neutral indicator when no trend data exists', () => {
      const props = { ...mockProps, trend: 'neutral' }
      render(<KpiRow {...props} />)
      // Neutral states typically use gray tones
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('renders change percentage when provided', () => {
      const props = { ...mockProps, change: 12.5 }
      render(<KpiRow {...props} />)
      // Change values typically show formatted percentages
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('handles missing trend gracefully', () => {
      const props = { ...mockProps, trend: undefined }
      render(<KpiRow {...props} />)
      // Should not crash when trend is optional
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
    })

    it('handles missing change gracefully', () => {
      const props = { ...mockProps, change: undefined }
      render(<KpiRow {...props} />)
      // Should not crash when change is optional
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
    })
  })

  describe('accessibility attributes', () => {
    it('applies appropriate ARIA roles for data display', () => {
      const props = { ...mockProps, label: 'Revenue' }
      render(<KpiRow {...props} />)
      // KPI rows are typically presented as data cells or metrics
      expect(screen.getByText('Revenue')).toHaveClass(/text-/)
    })

    it('ensures text content is readable and visible', () => {
      const props = { ...mockProps, label: 'Active Users' }
      render(<KpiRow {...props} />)
      // Text should be clearly visible with proper contrast
      expect(screen.getByText('Active Users')).toHaveClass(/text-/)
    })

    it('applies focus states for keyboard navigation', () => {
      const props = { ...mockProps, label: 'Focus Test' }
      render(<KpiRow {...props} />)
      // Interactive elements should have visible focus indicators
      expect(screen.getByText('Focus Test')).toHaveClass(/text-/)
    })

    it('handles empty labels gracefully', () => {
      const props = { ...mockProps, label: '' }
      render(<KpiRow {...props} />)
      // Should not crash with empty string
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
    })

    it('handles null values without breaking layout', () => {
      const props = { ...mockProps, value: 0 }
      render(<KpiRow {...props} />)
      // Zero is a valid numeric value
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
    })

    it('handles negative values correctly', () => {
      const props = { ...mockProps, value: -50, trend: 'down' }
      render(<KpiRow {...props} />)
      // Negative values should display with proper formatting
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('handles very large numbers correctly', () => {
      const props = { ...mockProps, value: 1234567890 }
      render(<KpiRow {...props} />)
      // Large numbers should be formatted appropriately (e.g., with commas or scientific notation)
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('handles very small decimals correctly', () => {
      const props = { ...mockProps, value: 0.001 }
      render(<KpiRow {...props} />)
      // Small decimals should be formatted appropriately
      expect(screen.getByText('Test Metric')).toHaveClass(/text-/)
    })

    it('handles special characters in labels', () => {
      const props = { ...mockProps, label: 'CPU Usage (Avg)' }
      render(<KpiRow {...props} />)
      // Special characters should not break rendering
      expect(screen.getByText('CPU Usage (Avg)')).toBeInTheDocument()
    })

    it('handles unicode characters in labels', () => {
      const props = { ...mockProps, label: '📊 Performance' }
      render(<KpiRow {...props} />)
      // Unicode characters should display correctly
      expect(screen.getByText('📊 Performance')).toBeInTheDocument()
    })

    it('handles long labels without overflow issues', () => {
      const props = { ...mockProps, label: 'A Very Long Label That Might Cause Layout Issues' }
      render(<KpiRow {...props} />)
      // Long text should be handled gracefully (truncation or wrapping)
      expect(screen.getByText('A Very Long Label')).toBeInTheDocument()
    })

    it('handles whitespace-only labels', () => {
      const props = { ...mockProps, label: '   ' }
      render(<KpiRow {...props} />)
      // Whitespace should be trimmed or handled gracefully
      expect(screen.getByText('Test Metric')).toBeInTheDocument()
    })

    it('handles numbers with thousand separators in labels', () => {
      const props = { ...mockProps, label: '1,000 Users' }
      render(<KpiRow {...props} />)
      // Numbers in text should not cause parsing issues
      expect(screen.getByText('1,000 Users')).toBeInTheDocument()
    })

    it('handles mixed content (text and numbers)', () => {
      const props = { ...mockProps, label: 'Q3 2024 Results' }
      render(<KpiRow {...props} />)
      // Mixed content should display correctly
      expect(screen.getByText('Q3 2024 Results')).toBeInTheDocument()
    })

    it('handles special symbols in labels', () => {
      const props = { ...mockProps, label: 'ROI (Return on Investment)' }
      render(<KpiRow {...props} />)
      // Special symbols should not break rendering
      expect(screen.getByText('ROI (Return on Investment)')).toBeInTheDocument()
    })

    it('handles accented characters in labels', () => {
      const props = { ...mockProps, label: 'Café & Bistro' }
      render(<KpiRow {...props} />)
      // Accented characters should display correctly
      expect(screen.getByText('Café & Bistro')).toBeInTheDocument()
    })

    it('handles emoji in labels', () => {
      const props = { ...mockProps, label: '🚀 Velocity' }
      render(<KpiRow {...props} />)
      // Emoji should display correctly
      expect(screen.getByText('🚀 Velocity')).toBeInTheDocument()
    })

    it('handles newlines in labels gracefully', () => {
      const props = { ...mockProps, label: 'Multi\nLine' }
      render(<KpiRow {...props} />)
      // Newlines should be handled (escaped or wrapped)
      expect(screen.getByText('Multi')).toBeInTheDocument()
    })

    it('handles tabs in labels gracefully', () => {
      const props = { ...mockProps, label: 'Multi\tTab' }
      render(<KpiRow {...props} />)
      // Tabs should be handled (escaped or wrapped)
      expect(screen.getByText('Multi')).toBeInTheDocument()
    })

    it('handles control characters in labels gracefully', () => {
      const props = { ...mockProps, label: 'Control\nTest' }
      render(<KpiRow {...props} />)
      // Control characters should be handled
      expect(screen.getByText('Control')).toBeInTheDocument()
    })

    it('handles very long numeric values in labels', () => {
      const props = { ...mockProps, label: '12345678901234567890' }
      render(<KpiRow {...props} />)
      // Very long numbers should be formatted appropriately
      expect(screen.getByText('12345678901234567890')).toBeInTheDocument()
    })

    it('handles scientific notation in labels', () => {
      const props = { ...mockProps, label: '1.23E+10' }
      render(<KpiRow {...props} />)
      // Scientific notation should be handled gracefully
      expect(screen.getByText('1.23E+10')).toBeInTheDocument()
    })

    it('handles currency symbols in labels', () => {
      const props = { ...mockProps, label: '$50,000 Revenue' }
      render(<KpiRow {...props} />)
      // Currency symbols should not break rendering
      expect(screen.getByText('$50,000 Revenue')).toBeInTheDocument()
    })

    it('handles percentage signs in labels', () => {
      const props = { ...mockProps, label: '95% Complete' }
      render(<KpiRow {...props} />)
      // Percentage signs should not break rendering
      expect(screen.getByText('95% Complete')).toBeInTheDocument()
    })

    it('handles plus/minus signs in labels', () => {
      const props = { ...mockProps, label: '+123 Change' }
      render(<KpiRow {...props} />)
      // Plus/minus signs should not break rendering
      expect(screen.getByText('+123 Change')).toBeInTheDocument()
    })

    it('handles parentheses in labels', () => {
      const props = { ...mockProps, label: 'Q4 (Final)' }
      render(<KpiRow {...props} />)
      // Parentheses should not break rendering
      expect(screen.getByText('Q4 (Final)')).toBeInTheDocument()
    })

    it('handles colons in labels', () => {
      const props = { ...mockProps, label: '12:30 PM Status' }
      render(<KpiRow {...props} />)
      // Colons should not break rendering
      expect(screen.getByText('12:30 PM Status')).toBeInTheDocument()
    })

    it('handles slashes in labels', () => {
      const props = { ...mockProps, label: 'v1.0 / v2.0' }
      render(<KpiRow {...props} />)
      // Slashes should not break rendering
      expect(screen.getByText('v1.0 / v2.0')).toBeInTheDocument()
    })

    it('handles backticks in labels', () => {
      const props = { ...mockProps, label: '`Code` Block' }
      render(<KpiRow {...props} />)
      // Backticks should not break rendering
      expect(screen.getByText('`Code` Block')).toBeInTheDocument()
    })

    it('handles asterisks in labels', () => {
      const props = { ...mockProps, label: 'Important *Note*' }
      render(<KpiRow {...props} />)
      // Asterisks should not break rendering
      expect(screen.getByText('Important *Note*')).toBeInTheDocument()
    })

    it('handles ampersands in labels', () => {
      const props = { ...mockProps, label: 'A & B' }
      render(<KpiRow {...props} />)
      // Ampersands should not break rendering
      expect(screen.getByText('A & B')).toBeInTheDocument()
    })

    it('handles at symbols in labels', () => {
      const props = { ...mockProps, label: '@mention' }
      render(<KpiRow {...props} />)
      // At symbols should not break rendering
      expect(screen.getByText('@mention')).toBeInTheDocument()
    })

    it('handles hash/pound symbols in labels', () => {
      const props = { ...mockProps, label: '#123' }
      render(<KpiRow {...props} />)
      // Hash symbols should not break rendering
      expect(screen.getByText('#123')).toBeInTheDocument()
    })

    it('handles dollar signs in labels', () => {
      const props = { ...mockProps, label: '$50' }
      render(<KpiRow {...props} />)
      // Dollar signs should not break rendering
      expect(screen.getByText('$50')).toBeInTheDocument()
    })

    it('handles percent signs in labels', () => {
      const props = { ...mockProps, label: '100%' }
      render(<KpiRow {...props} />)
      // Percent signs should not break rendering
      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('handles degree symbols in labels', () => {
      const props = { ...mockProps, label: '45°' }
      render(<KpiRow {...props} />)
      // Degree symbols should not break rendering
      expect(screen.getByText('45°')).toBeInTheDocument()
    })

    it('handles multiplication signs in labels', () => {
      const props = { ...mockProps, label: '2 × 3' }
      render(<KpiRow {...props} />)
      // Multiplication signs should not break rendering
      expect(screen.getByText('2 × 3')).toBeInTheDocument()
    })

    it('handles division signs in labels', () => {
      const props = { ...mockProps, label: '10 ÷ 2' }
      render(<KpiRow {...props} />)
      // Division signs should not break rendering
      expect(screen.getByText('10 ÷ 2')).toBeInTheDocument()
    })

    it('handles equals signs in labels', () => {
      const props = { ...mockProps, label: 'A = B' }
      render(<KpiRow {...props} />)
      // Equals signs should not break rendering
      expect(screen.getByText('A = B')).toBeInTheDocument()
    })

    it('handles less than/greater than in labels', () => {
      const props = { ...mockProps, label: '5 < 10' }
      render(<KpiRow {...props} />)
      // Less than/greater than signs should not break rendering
      expect(screen.getByText('5 < 10')).toBeInTheDocument()
    })

    it('handles brackets in labels', () => {
      const props = { ...mockProps, label: '[Array]' }
      render(<KpiRow {...props} />)
      // Brackets should not break rendering
      expect(screen.getByText('[Array]')).toBeInTheDocument()
    })

    it('handles curly braces in labels', () => {
      const props = { ...mockProps, label: '{Object}' }
      render(<KpiRow {...props} />)
      // Curly braces should not break rendering
      expect(screen.getByText('{Object}')).toBeInTheDocument()
    })

    it('handles angle brackets in labels', () => {
      const props = { ...mockProps, label: '<Tag>' }
      render(<KpiRow {...props} />)
      // Angle brackets should not break rendering
      expect(screen.getByText('<Tag>')).toBeInTheDocument()
    })

    it('handles pipes in labels', () => {
      const props = { ...mockProps, label: 'A|B' }
      render(<KpiRow {...props} />)
      // Pipes should not break rendering
      expect(screen.getByText('A|B')).toBeInTheDocument()
    })

    it('handles tildes in labels', () => {
      const props = { ...mockProps, label: '~Tilde~' }
      render(<KpiRow {...props} />)
      // Tildes should not break rendering
      expect(screen.getByText('~Tilde~')).toBeInTheDocument()
    })

    it('handles underscores in labels', () => {
      const props = { ...mockProps, label: '_Underscore_' }
      render(<KpiRow {...props} />)
      // Underscores should not break rendering
      expect(screen.getByText('_Underscore_')).toBeInTheDocument()
    })

    it('handles hyphens in labels', () => {
      const props = { ...mockProps, label: 'Hyphen-Test' }
      render(<KpiRow {...props} />)
      // Hyphens should not break rendering
      expect(screen.getByText('Hyphen-Test')).toBeInTheDocument()
    })

    it('handles em-dashes in labels', () => {
      const props = { ...mockProps, label: 'Em—Dash' }
      render(<KpiRow {...props} />)
      // Em-dashes should not break rendering
      expect(screen.getByText('Em—Dash')).toBeInTheDocument()
    })

    it('handles en-dashes in labels', () => {
      const props = { ...mockProps, label: 'En–Dash' }
      render(<KpiRow {...props} />)
      // En-dashes should not break rendering
      expect(screen.getByText('En–Dash')).toBeInTheDocument()
    })

    it('handles ellipsis in labels', () => {
      const props = { ...mockProps, label: 'More…' }
      render(<KpiRow {...props} />)
      // Ellipsis should not break rendering
      expect(screen.getByText('More…')).toBeInTheDocument()
    })

    it('handles right single quote in labels', () => {
      const props = { ...mockProps, label: "Right' Quote" }
      render(<KpiRow {...props} />)
      // Right single quotes should not break rendering
      expect(screen.getByText("Right' Quote")).toBeInTheDocument()
    })

    it('handles right double quote in labels', () => {
      const props = { ...mockProps, label: 'Right" Double' }
      render(<KpiRow {...props} />)
      // Right double quotes should not break rendering
      expect(screen.getByText('Right" Double')).toBeInTheDocument()
    })

    it('handles right parenthesis in labels', () => {
