import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import FeatureAlternating from '@/components/blocks/feature-alternating'

describe('FeatureAlternating', () => {
  const defaultProps = {
    features: [
      { title: 'Premium Plan', description: 'Full access to all features.', price: '$99/mo' },
      { title: 'Standard Plan', description: 'Core functionality included.', price: '$49/mo' },
      { title: 'Basic Plan', description: 'Essential tools for starters.', price: '$19/mo' }
    ],
    variant: 'vertical',
    theme: 'dark' as const,
  }

  it('renders with default props', () => {
    render(<FeatureAlternating {...defaultProps} />)
    
    expect(screen.getByRole('region')).toHaveTextContent(/Premium Plan/)
    expect(screen.getByRole('region')).toHaveTextContent(/Standard Plan/)
    expect(screen.getByRole('region')).toHaveTextContent(/Basic Plan/)
  })

  it('renders each feature with correct structure', () => {
    render(<FeatureAlternating {...defaultProps} />)
    
    const firstPlan = screen.getAllByRole('article')[0]
    expect(firstPlan).toContainElement(screen.getByText(/Premium Plan/))
    expect(firstPlan).toContainElement(screen.getByText(/Full access to all features./))
  })

  it('applies correct semantic classes', () => {
    render(<FeatureAlternating {...defaultProps} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/rounded-lg/)
    expect(container).toHaveClass(/gap-4/)
  })

  it('renders in dark mode correctly', () => {
    render(<FeatureAlternating {...defaultProps} theme="dark" />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveStyle(/background-color:.*#18181b/)
  })

  it('renders in light mode correctly', () => {
    render(<FeatureAlternating {...defaultProps} theme="light" />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveStyle(/background-color:.*#ffffff/)
  })

  it('handles empty features array gracefully', () => {
    render(<FeatureAlternating features={[]} variant="vertical" />)
    
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
})
