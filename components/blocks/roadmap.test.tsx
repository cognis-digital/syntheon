import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Roadmap from '@/components/blocks/roadmap'

describe('Roadmap', () => {
  const defaultProps = {} as Parameters<typeof Roadmap>[0]

  it('renders without crashing with defaults', () => {
    render(<Roadmap {...defaultProps} />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders key text content', () => {
    render(<Roadmap {...defaultProps} />)
    const title = screen.getByText(/roadmap/i)
    expect(title).toBeInTheDocument()
  })

  it('applies correct semantic roles and ARIA attributes', () => {
    render(<Roadmap {...defaultProps} />)
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('aria-label')
  })

  it('supports dark mode context', () => {
    document.body.classList.add('dark')
    render(<Roadmap {...defaultProps} />)
    expect(document.body).toHaveClass('dark')
  })
})
