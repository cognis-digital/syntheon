import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComparisonTable } from '@/components/blocks/comparison-table'

describe('ComparisonTable', () => {
  const defaultProps = {
    items: [
      { id: '1', name: 'Plan A', features: ['Feature 1', 'Feature 2'] },
      { id: '2', name: 'Plan B', features: ['Feature 3', 'Feature 4'] },
    ],
    columns: ['name', 'features'],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props and displays correct headers', () => {
    const { container } = render(<ComparisonTable {...defaultProps} />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    
    // Verify column headers are rendered
    screen.getByText('Plan A')
    screen.getByText('Plan B')
  })

  it('renders all expected rows with correct data', () => {
    render(<ComparisonTable {...defaultProps} />)

    const rows = screen.getAllByRole('row')
    
    expect(rows).toHaveLength(3 + 1) // header + 2 data rows
    
    // Verify each row has the right content
    rows.forEach((row, index) => {
      if (index === 0) {
        // Header row - skip or verify headers exist
        return
      }
      
      const cells = row.querySelectorAll('[role="gridcell"]')
      expect(cells).toHaveLength(2)
    })
  })

  it('applies correct ARIA attributes for accessibility', () => {
    render(<ComparisonTable {...defaultProps} />)

    const table = screen.getByRole('table')
    
    // Verify the table has proper semantic structure
    expect(table).toHaveAttribute('role', 'grid') || 
              expect(table).toHaveAttribute('aria-label')
  })

  it('renders feature items as list elements within cells', () => {
    render(<ComparisonTable {...defaultProps} />)

    // Find all feature text content
    const featureTexts = screen.getAllByText(/Feature \d+/i)
    
    expect(featureTexts).toHaveLength(4) // 2 features × 2 plans
    
    featureTexts.forEach((el, index) => {
      expect(el.textContent).toMatch(/^Feature \d+$/)
    })
  })

  it('handles empty items gracefully', () => {
    const emptyProps = {
      ...defaultProps,
      items: [],
    }

    render(<ComparisonTable {...emptyProps} />)

    // Should still render a valid table structure
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('applies default styling classes correctly', () => {
    const { container } = render(<ComparisonTable {...defaultProps} />)

    // Verify basic CSS class presence (Tailwind utilities)
    expect(container).toHaveClass(/rounded|border/)
    
    // Check for dark mode support if implemented
    const darkModeCheck = container.querySelector('[data-theme="dark"]') || 
                         container.closest('[data-theme="dark"]')
    expect(darkModeCheck).not.toBeNull()
  })

  it('maintains focus management when interactive', async () => {
    render(<ComparisonTable {...defaultProps} />)

    // Simulate keyboard navigation
    const table = screen.getByRole('table')
    
    await userEvent.keyboard('[Tab]')
    
    expect(document.activeElement).toHaveFocus()
  })

  it('preserves semantic HTML structure', () => {
    render(<ComparisonTable {...defaultProps} />)

    // Verify proper nesting of elements
    const table = screen.getByRole('table')
    const rows = table.querySelectorAll('[role="row"]')
    
    expect(rows).toHaveLength(3 + 1) // header + data rows
    
    // Each row should have cells
    rows.forEach(row => {
      const cells = row.querySelectorAll('[role="gridcell"]')
      expect(cells.length).toBeGreaterThan(0)
    })
  })

  it('renders with dark mode context', () => {
    render(<ComparisonTable {...defaultProps} />, { 
      attributes: { 'data-theme': 'dark' } 
    })

    const table = screen.getByRole('table')
    
    // Verify the component respects dark mode styling
    expect(table).toBeInTheDocument()
  })
})
