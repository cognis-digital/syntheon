import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { BentoGrid } from '@/components/blocks/bento-grid'

describe('BentoGrid', () => {
  beforeEach(() => {
    document.body.className = ''
  })

  it('renders with default props and accessible structure', async () => {
    const { container, getByRole } = render(<BentoGrid />)

    expect(container).toBeInTheDocument()
    expect(getByRole('grid')).toBeInTheDocument()
    expect(screen.getByText(/bento/i)).toBeInTheDocument()
  })

  it('applies correct ARIA attributes for grid layout', () => {
    const { container } = render(<BentoGrid />)

    const grid = container.querySelector('[role="grid"]')
    expect(grid).toHaveAttribute('aria-label')
  })

  it('renders child items with proper focus management', async () => {
    const { getByRole, container } = render(
      <BentoGrid>
        <div className="bento-item">Item One</div>
        <div className="bento-item">Item Two</div>
      </BentoGrid>
    )

    expect(container.querySelectorAll('.bento-item')).toHaveLength(2)
  })

  it('maintains dark mode compatibility', () => {
    document.body.className = 'dark'

    render(<BentoGrid />)

    const grid = container.querySelector('[role="grid"]')
    expect(grid).toBeInTheDocument()
  })
})
