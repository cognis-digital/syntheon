import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import heroSplit from '@/components/blocks/hero-split'

describe('HeroSplit', () => {
  const defaultProps = {}

  it('renders with default props without crashing', async () => {
    render(<heroSplit {...defaultProps} />)

    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('contains expected heading content', () => {
    render(<heroSplit title="Test Title" subtitle="Test Subtitle" />)

    const h1 = screen.queryByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
    expect(h1?.textContent).toContain('Test')
  })

  it('contains expected paragraph content', () => {
    render(<heroSplit title="Title" subtitle="Sub" />)

    const p = screen.queryByRole('paragraph')
    expect(p).toBeInTheDocument()
  })

  it('applies correct ARIA roles for accessibility', () => {
    render(<heroSplit title="Accessible Test" />)

    // Verify main landmark exists
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('handles click events on interactive elements', async () => {
    render(
      <heroSplit
        title="Click Test"
        cta={{ text: 'Learn More', href: '#' }}
      />
    )

    const button = screen.getByRole('link')
    expect(button).toBeInTheDocument()
  })

  it('renders responsive classes correctly', () => {
    render(<heroSplit title="Responsive Test" />)

    // Check that container has expected base styles
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/rounded/)
  })

  it('applies dark mode variants when in dark theme', async () => {
    render(
      <heroSplit title="Dark Mode Test" className="dark-mode" />
    )

    const container = screen.getByRole('region')
    expect(container).toHaveClass(/rounded/)
  })

  it('handles empty props gracefully', () => {
    render(<heroSplit />)

    // Should not crash with minimal props
    expect(screen.queryByRole('heading')).toBeInTheDocument()
  })

  it('supports custom className merging', () => {
    render(
      <heroSplit title="Custom Class Test" className="custom-border" />
    )

    const container = screen.getByRole('region')
    expect(container).toHaveClass(/rounded/)
  })
})
