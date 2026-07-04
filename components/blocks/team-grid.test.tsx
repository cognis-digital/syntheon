import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TeamGrid from '@/components/blocks/team-grid'

describe('TeamGrid', () => {
  const defaultProps = {
    members: [
      { name: 'Jane Doe', role: 'Product Designer', image: '/placeholder.jpg' },
      { name: 'John Smith', role: 'Frontend Engineer', image: '/placeholder.jpg' },
    ],
  }

  it('renders without crashing with default props', () => {
    const { container } = render(<TeamGrid {...defaultProps} />)
    expect(container).toBeInTheDocument()
  })

  it('renders all member names correctly', () => {
    render(<TeamGrid {...defaultProps} />)
    
    const names = screen.getAllByRole('heading')
    expect(names.map(n => n.textContent)).toContain('Jane Doe')
    expect(names.map(n => n.textContent)).toContain('John Smith')
  })

  it('renders all member roles correctly', () => {
    render(<TeamGrid {...defaultProps} />)
    
    const roleElements = screen.getAllByRole('paragraph')
    expect(roleElements.some(el => el.textContent.includes('Product Designer'))).toBe(true)
    expect(roleElements.some(el => el.textContent.includes('Frontend Engineer'))).toBe(true)
  })

  it('renders correct number of member cards', () => {
    render(<TeamGrid {...defaultProps} />)
    
    const cardContainers = screen.getAllByRole('article') || 
                         screen.queryAllByTestId(/member-card/i) ||
                         screen.queryAllByRole('figure')
    
    expect(cardContainers.length).toBe(2)
  })

  it('applies correct semantic styling', () => {
    render(<TeamGrid {...defaultProps} />)
    
    const container = screen.getByRole('main') || screen.getByRole('article')
    // Check for expected Tailwind utility classes in rendered output
    expect(container.className).toContain('grid')
  })

  it('handles empty members array gracefully', () => {
    render(<TeamGrid members={[]} />)
    
    const container = screen.getByRole('main') || screen.getByRole('article')
    // Should not crash and should have some fallback content
    expect(container).toBeInTheDocument()
  })

  it('renders images as alt text when present', () => {
    render(<TeamGrid {...defaultProps} />)
    
    const imgElements = screen.getAllByRole('img') || 
                       screen.queryAllByTestId(/image/i)
    
    if (imgElements.length > 0) {
      expect(imgElements[0].alt).toContain('Jane Doe')
    }
  })

  it('applies proper accessibility attributes', () => {
    render(<TeamGrid {...defaultProps} />)
    
    const container = screen.getByRole('main') || screen.getByRole('article')
    // Check for ARIA attributes if component uses them
    expect(container).toHaveAttribute('aria-label') || 
                    expect(container).not.toHaveAttribute('aria-hidden')
  })

  it('handles hover states without breaking layout', async () => {
    render(<TeamGrid {...defaultProps} />)
    
    const cards = screen.getAllByRole('article') || 
                  screen.queryAllByTestId(/member-card/i)
    
    if (cards.length > 0) {
      await userEvent.hover(cards[0])
      // Should not cause layout shift or errors
      expect(document.body).not.toHaveAttribute('style', /overflow: hidden/)
    }
  })

  it('renders responsive grid structure', () => {
    render(<TeamGrid {...defaultProps} />)
    
    const container = screen.getByRole('main') || screen.getByRole('article')
    expect(container.className).toMatch(/grid|flex/i)
  })
})
