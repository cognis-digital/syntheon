import { describe, it, expect, vi, userEvent } from 'vitest-dom'
import { render, screen, within } from '@testing-library/react'
import FeatureTabs from '@/components/blocks/feature-tabs'

describe('FeatureTabs', () => {
  const mockProps = {
    title: 'Features',
    tabs: [
      { id: 'tab-1', label: 'Tab One', content: 'Content for tab one' },
      { id: 'tab-2', label: 'Tab Two', content: 'Content for tab two' },
    ],
  }

  it('renders with default props and shows all tabs', () => {
    render(<FeatureTabs {...mockProps} />)
    
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByText('Tab One')).toBeInTheDocument()
    expect(screen.getByText('Tab Two')).toBeInTheDocument()
  })

  it('renders each tab button with correct aria attributes', () => {
    render(<FeatureTabs {...mockProps} />)
    
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(2)
    
    // First tab should be selected by default
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('renders panel content when tab is clicked', async () => {
    render(<FeatureTabs {...mockProps} />)
    
    const firstTab = screen.getByRole('tab', { name: 'Tab One' })
    await userEvent.click(firstTab)
    
    expect(screen.getByText('Content for tab one')).toBeInTheDocument()
  })

  it('applies semantic Tailwind classes correctly', () => {
    render(<FeatureTabs {...mockProps} />)
    
    const container = screen.getByRole('tablist')
    // Verify some expected class patterns are present
    expect(container).toHaveClass(/rounded/ig)
  })

  it('handles empty items gracefully', () => {
    render(<FeatureTabs title="Empty" tabs={[]} />)
    
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })
})
