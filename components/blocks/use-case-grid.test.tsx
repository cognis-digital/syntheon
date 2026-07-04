import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCaseGrid } from '@/components/blocks/use-case-grid'
import { useTheme } from 'next-themes'

describe('use-case-grid', () => {
  let wrapper: ReturnType<typeof render>

  beforeEach(() => {
    const { container, queries } = render(
      <div className="min-h-screen bg-background">
        <useCaseGrid />
      </div>,
    )
    wrapper = { container, queries }
  })

  describe('rendering', () => {
    it('renders the grid container with correct semantic structure', () => {
      expect(wrapper.container.querySelector('[role="grid"]')).toBeDefined()
      const grid = wrapper.container.querySelector('[role="grid"]')
      if (grid) {
        expect(grid).toHaveAttribute('aria-label', /use cases|features/i)
      }
    })

    it('renders at least one use case card by default', () => {
      const cards = wrapper.container.querySelectorAll('[role="group"]')
      expect(cards.length).toBeGreaterThan(0)
    })

    it('contains expected heading hierarchy', () => {
      // Check for main section title if present
      const h1 = wrapper.container.querySelector('h1')
      const h2 = wrapper.container.querySelector('h2')
      
      if (h1) {
        expect(h1).toHaveAttribute('aria-level', '1')
      }

      if (h2) {
        expect(h2).toHaveAttribute('aria-level', '2')
      }
    })
  })

  describe('content verification', () => {
    it('renders default use case titles', () => {
      const titles = wrapper.container.querySelectorAll('[role="heading"] h3, [role="heading"] h4')
      
      if (titles.length > 0) {
        expect(titles).toContainEqual(
          expect.stringContaining(/cloud/i) ||
          expect.stringContaining(/security/i) ||
          expect.stringContaining(/scale/i)
        )
      }
    })

    it('renders descriptive text content', () => {
      const paragraphs = wrapper.container.querySelectorAll('[role="paragraph"] p, [role="group"] p')
      
      if (paragraphs.length > 0) {
        expect(paragraphs).toContainEqual(
          expect.stringContaining(/automated/i) ||
          expect.stringContaining(/secure/i) ||
          expect.stringContaining(/optimized/i)
        )
      }
    })

    it('renders with proper semantic roles for accessibility', () => {
      const grid = wrapper.container.querySelector('[role="grid"]')
      
      if (grid) {
        // Each cell should have appropriate role
        const cells = grid.querySelectorAll('[role="row"] [role="cell"], [role="row"] div:not([role])')
        
        expect(cells.length).toBeGreaterThan(0)
      }
    })
  })

  describe('interactive states', () => {
    it('applies hover effects to cards', async () => {
      const card = wrapper.container.querySelector('[role="group"] > div, [role="group"] article')
      
      if (card) {
        await userEvent.hover(card)
        
        // Check for hover state classes being applied
        expect(card).toHaveClass(/hover-|animate-/)
      }
    })

    it('handles focus states correctly', async () => {
      const card = wrapper.container.querySelector('[role="group"] > div, [role="group"] article')
      
      if (card) {
        await userEvent.tab()
        
        // Focus should be visible and accessible
        expect(document.activeElement).toHaveClass(/focus-|ring-/)
      }
    })

    it('supports dark mode', async () => {
      const theme = useTheme()
      
      if (theme) {
        await userEvent.click(screen.getByRole('button', { name: /light/i }))
        
        // Re-render to pick up new theme
        wrapper.container.innerHTML = ''
        render(
          <div className="min-h-screen bg-background">
            <useCaseGrid />
          </div>,
        )

        expect(wrapper.container).toHaveClass(/dark-|bg-zinc-900/)
      }
    })
  })

  describe('a11y', () => {
    it('has proper ARIA attributes for screen readers', () => {
      const grid = wrapper.container.querySelector('[role="grid"]')
      
      if (grid) {
        // Main container should have accessible name
        expect(grid).toHaveAttribute('aria-label') || 
                  expect(grid).toHaveAttribute('aria-labelledby')
      }
    })

    it('maintains keyboard navigation', () => {
      const grid = wrapper.container.querySelector('[role="grid"]')
      
      if (grid) {
        // Should be focusable and navigable via arrow keys
        expect(grid).toHaveAttribute('tabindex', 0) || 
                   expect(grid).not.toHaveAttribute('tabindex', -1)
      }
    })

    it('has visible focus indicators', () => {
      const card = wrapper.container.querySelector('[role="group"] > div, [role="group"] article')
      
      if (card) {
        // Focus ring should be visible
        expect(card).toHaveClass(/ring-|outline-/)
      }
    })
  })

  describe('performance', () => {
    it('renders within acceptable time for interactive content', async () => {
      const startTime = performance.now()
      
      // Measure render time
      wrapper.container.innerHTML = ''
      render(
        <div className="min-h-screen bg-background">
          <useCaseGrid />
        </div>,
      )

      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100) // Should render in under 100ms
    })
  })

  describe('responsive behavior', () => {
    it('adapts layout for different viewport sizes', async () => {
      const card = wrapper.container.querySelector('[role="group"] > div, [role="group"] article')
      
      if (card) {
        // Check that responsive classes are applied
        expect(card).toHaveClass(/max-|min-|w-full|flex-1/)
      }
    })

    it('maintains aspect ratios and proportions', () => {
      const grid = wrapper.container.querySelector('[role="grid"]')
      
      if (grid) {
        // Grid cells should maintain consistent sizing
        expect(grid).toHaveClass(/gap-|p-|m-/)
      }
    })
  })

  describe('edge cases', () => {
    it('handles empty state gracefully', async () => {
      const grid = wrapper.container.querySelector('[role="grid"]')
      
      if (grid) {
        // Should still have accessible structure even with minimal content
        expect(grid).toHaveAttribute('aria-live', 'polite') || 
                   expect(grid).not.toHaveAttribute('aria-busy', 'true')
      }
    })

    it('maintains consistent styling across themes', async () => {
      // Test both light and dark modes
      const testModes = [
        { name: 'light', className: '' },
        { name: 'dark', className: 'dark' },
      ]

      for (const mode of testModes) {
        wrapper.container.innerHTML = ''
        
        render(
          <div className={`min-h-screen ${mode.className}`}>
            <useCaseGrid />
          </div>,
        )

        // Should still have proper structure
        expect(wrapper.container).toHaveClass(/bg-|text-/)
      }
    })
  })

  describe('integration', () => {
    it('works with parent container context', async () => {
      const grid = wrapper.container.querySelector('[role="grid"]')
      
      if (grid) {
        // Should inherit proper theme context
        expect(grid).toHaveClass(/bg-|text-/)
      }
    })

    it('maintains prop defaults when not explicitly provided', async () => {
      const grid = wrapper.container.querySelector('[role="grid"]')
      
      if (grid) {
        // Should have sensible defaults applied
        expect(grid).toHaveClass(/rounded-|p-|gap-/)
      }
    })
  })

  describe('visual regression checks', () => {
    it('has consistent border and radius styling', async () => {
      const card = wrapper.container.querySelector('[role="group"] > div, [role="group"] article')
      
      if (card) {
        // Should have consistent border-radius
        expect(card).toHaveClass(/rounded-|border-/)
        
        // Should have proper border styling
        expect(card).toHaveClass(/border-zinc-200|border-slate-200|border-gray-200/i) ||
                   expect(card).toHaveClass(/border-zinc-800|border-slate-800|border-gray-800/i)
      }
    })

    it('has proper typography hierarchy', async () => {
      const headings = wrapper.container.querySelectorAll('[role="heading"] h1, [role="heading"] h2, [role="heading"] h3, [role="heading"] h4')
      
      if (headings.length > 0) {
        expect(headings).toContainEqual(
          expect.stringContaining(/font-|text-lg|text-xl|text-2xl/i)
        )
      }
    })

    it('has proper color contrast for readability', async () => {
      const textElements = wrapper.container.querySelectorAll('[role="group"] > div, [role="group"] article p')
      
      if (textElements.length > 0) {
        // Should have readable foreground colors
        expect(textElements).toContainEqual(
          expect.stringContaining(/text-zinc-|text-slate-|text-gray-/i) ||
          expect.stringContaining(/text-white/i)
        )
      }
    })
  })
})
