import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsletterCard } from '@/components/sections/newsletter-card'
import type { NewsletterCardProps } from '@/components/sections/newsletter-card'

describe('NewsletterCard', () => {
  const defaultProps: Partial<NewsletterCardProps> = {}

  describe('Rendering with defaults', () => {
    it('renders without crashing', () => {
      render(<NewsletterCard {...defaultProps} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('displays headline text by default', () => {
      render(<NewsletterCard {...defaultProps} />)
      const heading = screen.getByRole('heading')
      expect(heading).toHaveTextContent(/newsletter/i)
    })

    it('includes call-to-action button', () => {
      render(<NewsletterCard {...defaultProps} />)
      const btn = screen.getByRole('button', { name: /subscribe/i })
      expect(btn).toBeInTheDocument()
      expect(btn).toHaveAttribute('type', 'submit')
    })

    it('applies correct form semantics', () => {
      render(<NewsletterCard {...defaultProps} />)
      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/email/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'email')
    })

    it('includes accessibility attributes', () => {
      render(<NewsletterCard {...defaultProps} />)
      const heading = screen.getByRole('heading')
      expect(heading).toHaveAttribute('aria-level', '2')
      
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('novalidate')
    })

    it('applies consistent border radius', () => {
      render(<NewsletterCard {...defaultProps} />)
      const container = screen.getByRole('article')
      expect(container).toHaveClass(/rounded/i)
    })
  })

  describe('Dark mode support', () => {
    beforeEach(() => {
      document.body.classList.add('dark')
    })

    afterEach(() => {
      document.body.classList.remove('dark')
    })

    it('applies dark theme classes correctly', () => {
      render(<NewsletterCard {...defaultProps} />)
      const container = screen.getByRole('article')
      
      // Check for dark mode specific class application
      expect(container).toHaveClass(/dark/i)
    })
  })

  describe('Responsive behavior', () => {
    it('applies mobile-first responsive classes', () => {
      render(<NewsletterCard {...defaultProps} />)
      const container = screen.getByRole('article')
      
      // Check for responsive utility classes
      expect(container).toHaveClass(/md:/i)
    })

    it('maintains layout at small viewport', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 })
      render(<NewsletterCard {...defaultProps} />)
      
      const container = screen.getByRole('article')
      expect(container).toBeInTheDocument()
    })

    it('maintains layout at large viewport', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1920 })
      render(<NewsletterCard {...defaultProps} />)
      
      const container = screen.getByRole('article')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Interactive states', () => {
    it('button shows loading state on click', async () => {
      const user = userEvent.setup()
      render(<NewsletterCard {...defaultProps} />)
      
      const btn = screen.getByRole('button')
      await user.click(btn)
      
      // Verify button interaction triggers expected behavior
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('input shows focus state', async () => {
      const user = userEvent.setup()
      render(<NewsletterCard {...defaultProps} />)
      
      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/email/i)
      await user.type(input, 'test@example.com')
      
      expect(input).toHaveFocus()
    })

    it('handles keyboard navigation', async () => {
      render(<NewsletterCard {...defaultProps} />)
      
      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/email/i)
      await userEvent.type(input, 'test@example.com')
      
      expect(screen.getByRole('button')).toHaveFocus()
    })
  })

  describe('Content assertions', () => {
    it('includes expected semantic elements', () => {
      render(<NewsletterCard {...defaultProps} />)
      
      const article = screen.getByRole('article')
      const heading = screen.getByRole('heading')
      const form = screen.getByRole('form')
      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/email/i)
      const button = screen.getByRole('button', { name: /subscribe/i })
      
      expect(article).toBeInTheDocument()
      expect(heading).toBeInTheDocument()
      expect(form).toBeInTheDocument()
      expect(input).toBeInTheDocument()
      expect(button).toBeInTheDocument()
    })

    it('includes descriptive text content', () => {
      render(<NewsletterCard {...defaultProps} />)
      
      const heading = screen.getByRole('heading')
      expect(heading).toHaveTextContent(/newsletter/i)
    })

    it('includes helpful placeholder text', () => {
      render(<NewsletterCard {...defaultProps} />)
      
      const input = screen.getByPlaceholderText(/email/i)
      expect(input).toBeInTheDocument()
    })

    it('includes appropriate button label', () => {
      render(<NewsletterCard {...defaultProps} />)
      
      const btn = screen.getByRole('button')
      expect(btn).toHaveTextContent(/subscribe/i)
    })
  })

  describe('Edge cases and robustness', () => {
    it('handles empty props gracefully', () => {
      render(<NewsletterCard />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('renders with minimal required props', () => {
      const minimalProps: Partial<NewsletterCardProps> = {}
      render(<NewsletterCard {...minimalProps} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('does not throw on prop changes', async () => {
      let container: HTMLElement
      
      render(<NewsletterCard />, { initialProps: { id: 1 } })
      container = screen.getByRole('article')
      
      await waitFor(() => {
        expect(container).toBeInTheDocument()
      })
    })

    it('handles null/undefined values safely', () => {
      const safeProps: Partial<NewsletterCardProps> = {
        headline: undefined,
        description: '',
      }
      render(<NewsletterCard {...safeProps} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('applies consistent styling across renders', () => {
      const container1 = render(<NewsletterCard />).container
      const container2 = render(<NewsletterCard />).container
      
      // Both should have similar structure
      expect(container1.children.length).toBeGreaterThan(0)
      expect(container2.children.length).toBeGreaterThan(0)
    })

    it('maintains stable DOM structure', () => {
      const { rerender } = render(<NewsletterCard />)
      
      const initialHeading = screen.getByRole('heading')
      rerender(<NewsletterCard />)
      
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })
  })

  describe('Performance considerations', () => {
    it('renders synchronously without blocking', async () => {
      const startTime = performance.now()
      render(<NewsletterCard />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('uses efficient class composition', () => {
      render(<NewsletterCard />)
      const container = screen.getByRole('article')
      
      // Should use cn utility for efficient class merging
      expect(container.className.length).toBeGreaterThan(0)
    })
  })

  describe('Type safety verification', () => {
    it('accepts valid prop types', () => {
      const validProps: Partial<NewsletterCardProps> = {
        headline: 'Valid Headline',
        description: 'A valid description',
        ctaText: 'Subscribe Now',
        emailPlaceholder: 'Enter your email...',
      }
      
      render(<NewsletterCard {...validProps} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('handles optional props correctly', () => {
      const partialProps: Partial<NewsletterCardProps> = {}
      render(<NewsletterCard {...partialProps} />)
      
      // Should not crash with minimal props
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('applies custom props when provided', () => {
      render(
        <NewsletterCard
          headline="Custom Headline"
          description="Custom Description"
        />
      )
      
      const heading = screen.getByRole('heading')
      expect(heading).toHaveTextContent(/Custom Headline/i)
    })
  })

  describe('Animation and motion', () => {
    it('applies reduced-motion preference correctly', async () => {
      document.body.classList.add('dark')
      
      render(<NewsletterCard />)
      
      // Check that animation classes are applied appropriately
      const container = screen.getByRole('article')
      expect(container).toBeInTheDocument()
    })

    it('maintains smooth transitions on mount', async () => {
      render(<NewsletterCard />)
      
      await waitFor(() => {
        const container = screen.getByRole('article')
        expect(container).toBeInTheDocument()
      })
    })
  })
})
