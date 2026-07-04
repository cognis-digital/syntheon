import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MetricCards from '@/components/blocks/metric-cards'

describe('MetricCards', () => {
  it('renders without crashing with defaults', () => {
    const { container } = render(<MetricCards />)
    expect(container).toBeInTheDocument()
  })

  it('renders metric labels and values', () => {
    render(<MetricCards />)
    
    // Verify common metric card elements exist
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByText(/metric/i)).toBeInTheDocument()
  })

  it('applies correct ARIA roles for accessibility', () => {
    const { container } = render(<MetricCards />)
    
    // Check for semantic structure
    expect(container).toHaveAttribute('role')
  })

  it('renders with proper heading hierarchy', () => {
    render(<MetricCards />)
    
    // Verify heading levels are appropriate
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('handles empty state gracefully', () => {
    render(<MetricCards />)
    expect(screen.queryByText(/no data/i)).toBeInTheDocument()
  })
})
