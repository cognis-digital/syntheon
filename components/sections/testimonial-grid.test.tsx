import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestimonialGrid } from '@/components/sections/testimonial-grid'

describe('TestimonialGrid', () => {
  const defaultProps = {
    testimonials: [
      {
        id: '1',
        name: 'Sarah Chen',
        role: 'Product Designer',
        content: 'The attention to detail is unmatched. A truly premium experience.',
        rating: 5,
        avatarUrl: '/avatars/sarah.jpg'
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        role: 'CTO at TechFlow',
        content: 'Implementation was seamless and the results exceeded expectations.',
        rating: 4,
        avatarUrl: '/avatars/marcus.jpg'
      }
    ]
  }

  beforeEach(() => {
    // Mock framer-motion components if needed for isolated testing
    vi.mock('framer-motion')
  })

  it('renders with default props', () => {
    const { container, getByText } = render(
      <TestimonialGrid {...defaultProps} />
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', /testimonials/i)
  })

  it('displays all testimonial content', () => {
    const { container, getByText } = render(
      <TestimonialGrid {...defaultProps} />
    )

    // Check names
    expect(getByText(/Sarah Chen/i)).toBeInTheDocument()
    expect(getByText(/Marcus Johnson/i)).toBeInTheDocument()

    // Check roles
    expect(getByText(/Product Designer/i)).toBeInTheDocument()
    expect(getByText(/CTO at TechFlow/i)).toBeInTheDocument()

    // Check content
    expect(container).toHaveTextContent('The attention to detail is unmatched')
    expect(container).toHaveTextContent('Implementation was seamless')
  })

  it('renders star ratings correctly', () => {
    const { container, getAllByRole } = render(
      <TestimonialGrid {...defaultProps} />
    )

    // Should have 5 stars for first testimonial (full)
    expect(container).toHaveAttribute('aria-label', /5 out of 5/i)
    
    // Second testimonial should show 4 stars
    const secondStars = getAllByRole('img').slice(0, 10)
    expect(secondStars.some(s => s.getAttribute('aria-label')?.includes('4'))).toBe(true)
  })

  it('applies proper grid layout and responsive wrapping', () => {
    render(<TestimonialGrid {...defaultProps} />)

    const cards = screen.getAllByRole('article')
    
    expect(cards.length).toBe(2)
    
    // Each card should have consistent styling attributes
    cards.forEach(card => {
      expect(card).toHaveClass(/rounded/i)
      expect(card).toHaveClass(/gap/i)
    })
  })

  it('handles empty state gracefully', () => {
    const emptyProps = {
      testimonials: [],
      emptyState: { title: 'No testimonials yet', subtitle: 'Be the first to share your experience' }
    }

    render(<TestimonialGrid {...emptyProps} />)

    expect(screen.getByText(/no testimonials/i)).toBeInTheDocument()
  })

  it('applies accessibility attributes correctly', () => {
    const { container, getByRole } = render(
      <TestimonialGrid {...defaultProps} />
    )

    // Main region should be accessible
    const mainRegion = screen.getByRole('region')
    expect(mainRegion).toHaveAttribute('aria-label')

    // Each testimonial card should have proper structure
    const cards = container.querySelectorAll('[role="article"]')
    cards.forEach((card, index) => {
      expect(card).toHaveAttribute('data-testid', `testimonial-${index + 1}`)
    })
  })

  it('renders with dark mode support', () => {
    render(
      <TestimonialGrid 
        {...defaultProps} 
        className="dark:invert"
      />
    )

    expect(screen.getByRole('region')).toHaveClass(/dark/i)
  })

  it('applies custom className prop correctly', () => {
    const { container } = render(
      <TestimonialGrid {...defaultProps} className="custom-border" />
    )

    expect(container).toHaveClass(/custom-border/i)
  })

  it('handles motion preferences via prefers-reduced-motion', async () => {
    // Simulate reduced motion preference
    document.documentElement.style.setProperty(
      'prefers-reduced-motion: reduce'
    )

    const { container } = render(<TestimonialGrid {...defaultProps} />)

    // Animations should still be present but simplified
    expect(container).toHaveAttribute('data-reduced-motion')
  })

  it('renders avatar images with fallback', () => {
    const { container, getAllByRole } = render(
      <TestimonialGrid {...defaultProps} />
    )

    // Should have image elements for avatars
    expect(container).toHaveAttribute('aria-label', /avatar/i)
  })

  it('maintains consistent spacing and typography hierarchy', () => {
    const { container, getAllByRole } = render(
      <TestimonialGrid {...defaultProps} />
    )

    // Check for proper semantic spacing classes
    expect(container).toHaveClass(/gap/i)
    expect(container).toHaveClass(/p-|padding/i)
  })

  it('supports pagination controls when many testimonials exist', () => {
    const paginatedProps = {
      ...defaultProps,
      totalPages: 3,
      currentPage: 1,
      onPageChange: vi.fn()
    }

    render(<TestimonialGrid {...paginatedProps} />)

    // Pagination controls should be present
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('handles loading state', () => {
    const loadingProps = {
      testimonials: [],
      isLoading: true,
      emptyState: undefined
    }

    render(<TestimonialGrid {...loadingProps} />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('preserves focus management for keyboard navigation', () => {
    const { container, getAllByRole } = render(
      <TestimonialGrid {...defaultProps} />
    )

    // Each testimonial should be focusable via keyboard
    const cards = getAllByRole('article')
    expect(cards[0]).toHaveAttribute('tabindex', '0')
  })

  it('applies proper semantic HTML structure', () => {
    render(<TestimonialGrid {...defaultProps} />)

    // Main container should use appropriate landmark role
    const mainRegion = screen.getByRole('region')
    expect(mainRegion).toHaveAttribute('aria-label', /customer testimonials/i)
  })

  it('handles edge case: single testimonial only', () => {
    const singleProps = {
      testimonials: [defaultProps.testimonials[0]],
      emptyState: undefined
    }

    render(<TestimonialGrid {...singleProps} />)

    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('applies proper border and radius styling', () => {
    const { container, getAllByRole } = render(
      <TestimonialGrid {...defaultProps} />
    )

    // Cards should have rounded corners
    const cards = getAllByRole('article')
    expect(cards[0]).toHaveClass(/rounded/i)
  })

  it('supports custom empty state content', () => {
    render(
      <TestimonialGrid 
        {...defaultProps}
        emptyState={{
          title: 'Custom Title',
          subtitle: 'Custom Subtitle'
        }}
      />
    )

    expect(screen.getByText(/custom title/i)).toBeInTheDocument()
  })
})
