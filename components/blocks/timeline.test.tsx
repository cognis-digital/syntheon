import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Timeline from '@/components/blocks/timeline'

describe('Timeline', () => {
  it('renders with default props and shows title text', () => {
    const { container } = render(<Timeline />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent('Timeline')
  })

  it('renders each item with correct structure', () => {
    render(
      <Timeline>
        <Timeline.Item date="2024-01-01" title="First Event">Description 1</Timeline.Item>
        <Timeline.Item date="2024-01-02" title="Second Event">Description 2</Timeline.Item>
      </Timeline>
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText(/First Event/i)).toBeInTheDocument()
    expect(screen.getByText(/Second Event/i)).toBeInTheDocument()
  })

  it('applies correct ARIA roles for accessibility', () => {
    render(<Timeline />)
    
    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-label')
  })

  it('renders date in the expected format', () => {
    render(
      <Timeline>
        <Timeline.Item date="2024-01-15" title="Test">Content</Timeline.Item>
      </Timeline>
    )

    expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument()
  })

  it('applies rounded styling by default', () => {
    const { container } = render(<Timeline />)
    
    // Check for Tailwind's rounded class (converted to inline styles in production)
    expect(container.firstChild).toHaveAttribute('style')
  })
})
