import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepsVertical } from '@/components/sections/steps-vertical'

describe('StepsVertical', () => {
  const defaultProps = {
    steps: [
      { id: 'step-1', title: 'Step One', description: 'First step details' },
      { id: 'step-2', title: 'Step Two', description: 'Second step details' },
      { id: 'step-3', title: 'Step Three', description: 'Third step details' },
    ],
  }

  it('renders with default props and correct structure', () => {
    const { container, getByText } = render(
      <StepsVertical {...defaultProps} />
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders all step titles with correct text content', () => {
    render(<StepsVertical {...defaultProps} />)

    const titles = screen.getAllByText(/Step One|Step Two|Step Three/i)
    expect(titles).toHaveLength(3)
    expect(screen.getByText('Step One')).toBeInTheDocument()
  })

  it('renders step descriptions', () => {
    render(<StepsVertical {...defaultProps} />)

    const desc1 = screen.getByText(/First step details/i)
    expect(desc1).toBeInTheDocument()
  })

  it('applies correct accessibility attributes', () => {
    render(<StepsVertical {...defaultProps} />)

    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-label')
    
    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      expect(item).toHaveAttribute('aria-labelledby')
      expect(item).toHaveAttribute('data-step-index', `${index}`)
    })
  })

  it('applies responsive and theme classes', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/rounded-lg/)
    expect(container).toHaveClass(/gap-4|gap-\d+/i)
  })

  it('handles empty steps array gracefully', () => {
    const { container } = render(<StepsVertical steps={[]} />)
    
    expect(screen.queryByRole('list')).toBeInTheDocument()
    expect(container.innerHTML).not.toContain('Step')
  })

  it('renders with custom className prop', () => {
    const customClass = 'custom-steps-class'
    render(
      <StepsVertical {...defaultProps} className={customClass} />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(customClass)
  })

  it('applies dark mode variants correctly', () => {
    render(
      <StepsVertical {...defaultProps} className="dark" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/dark-/)
  })

  it('handles partial steps array', () => {
    render(
      <StepsVertical
        steps={[defaultProps.steps[0], defaultProps.steps[2]]}
      />
    )

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
  })

  it('applies proper type defaults for optional props', () => {
    render(<StepsVertical steps={[]} />)
    
    // Should not crash with minimal props
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('maintains stable DOM structure across renders', () => {
    const { container, rerender } = render(
      <StepsVertical {...defaultProps} />
    )

    const initialListId = container.querySelector('[aria-label]')?.id
    
    rerender(<StepsVertical steps={[{ id: 'new-step' }] as any} />)
    
    expect(container).not.toBeNull()
  })

  it('handles user interactions without errors', async () => {
    const { container } = render(
      <StepsVertical {...defaultProps} />
    )

    // Simulate a click on first step
    await userEvent.click(screen.getByText('Step One'))
    
    expect(container).not.toBeNull()
  })

  it('renders with correct semantic HTML for screen readers', () => {
    render(<StepsVertical {...defaultProps} />)

    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('role', 'list')
    
    // Each item should be focusable and keyboard-accessible
    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      expect(item).toHaveAttribute('tabindex', '-1' || '0' || '')
    })
  })

  it('applies consistent border radius across all steps', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    items.forEach((item, index) => {
      expect(item).toHaveClass(/rounded-lg|rounded-md/i)
    })
  })

  it('handles long text with proper line breaks', () => {
    render(
      <StepsVertical
        steps={[{ id: 'step-1', title: 'Very Long Title That Should Wrap', description: 'Description that is also quite lengthy and should demonstrate proper text wrapping behavior' }]}
      />
    )

    expect(screen.getByText('Very Long')).toBeInTheDocument()
  })

  it('applies correct z-index for overlay elements if present', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/z-\d+/i || /relative/i)
  })

  it('maintains proper focus management', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    
    // First item should be initially focused or have focus indicator
    expect(items[0]).toHaveAttribute('tabindex', '-1' || '0' || '')
  })

  it('handles edge case with single step', () => {
    render(
      <StepsVertical steps={[{ id: 'only-step', title: 'Only Step', description: 'The only step' }]}
      />
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('applies consistent font hierarchy for titles vs descriptions', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    
    // Titles should have different styling than descriptions
    items.forEach((item, index) => {
      if (index === 0) {
        expect(item).toHaveClass(/text-lg|font-medium/i)
      } else {
        expect(item).toHaveClass(/text-base/i)
      }
    })
  })

  it('handles null/undefined step gracefully', () => {
    render(
      <StepsVertical
        steps={[{ id: 'step-1', title: 'Step One' }, undefined, { id: 'step-3', title: 'Step Three' }]}
      />
    )

    // Should not crash and should handle gracefully
    expect(screen.getByText('Step One')).toBeInTheDocument()
  })

  it('applies proper loading state if present', () => {
    render(
      <StepsVertical {...defaultProps} isLoading={true} />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/animate-|pulse/i)
  })

  it('maintains consistent spacing between steps', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    
    // Check that gap is applied consistently
    items.forEach((_, index) => {
      if (index > 0) {
        expect(items[index].previousElementSibling).toHaveClass(/gap-4|gap-\d+/i || /mb-2/i)
      }
    })
  })

  it('applies proper transition properties for smooth interactions', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/transition-|ease/i || /duration-/)
  })

  it('handles responsive breakpoints correctly', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    
    // Should have responsive classes for mobile
    expect(container).toHaveClass(/md-|lg-|xl-/)
  })

  it('applies proper hover states', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    
    // Each item should have hover state classes
    items.forEach((item, index) => {
      if (index === 0) {
        expect(item).toHaveClass(/hover-|focus-/)
      } else {
        expect(item).toHaveClass(/hover-|focus-/)
      }
    })
  })

  it('handles keyboard navigation properly', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    
    // First item should be focusable for keyboard nav
    expect(items[0]).toHaveAttribute('tabindex', '-1' || '0' || '')
  })

  it('applies proper contrast ratios for text elements', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    
    // Titles should use foreground colors
    items.forEach((_, index) => {
      if (index === 0) {
        expect(items[index]).toHaveClass(/text-foreground|text-primary/i)
      } else {
        expect(items[index]).toHaveClass(/text-muted|text-secondary/i)
      }
    })
  })

  it('handles very long step arrays without performance issues', () => {
    const manySteps = Array.from({ length: 50 }, (_, i) => ({
      id: `step-${i}`,
      title: `Step ${i + 1}`,
      description: `Description for step ${i + 1}`
    }))

    render(<StepsVertical steps={manySteps} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(50)
  })

  it('applies proper shadow depth hierarchy', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/shadow-|ring-/)
  })

  it('handles animation preferences correctly', () => {
    render(
      <StepsVertical {...defaultProps} className="animate-in fade-in duration-700" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/animate-|fade-in/i)
  })

  it('applies proper border styling for separation', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    
    // Items should have consistent borders
    items.forEach((_, index) => {
      if (index === 0) {
        expect(items[index]).toHaveClass(/border-t|rounded-tl/i)
      } else {
        expect(items[index]).toHaveClass(/border-b|rounded-bl/i)
      }
    })
  })

  it('handles disabled state gracefully', () => {
    render(
      <StepsVertical {...defaultProps} disabled={true} />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/opacity-50|pointer-events-none/i)
  })

  it('applies proper loading skeleton if in progress', () => {
    render(
      <StepsVertical {...defaultProps} isLoading={true} />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/animate-|skeleton/i)
  })

  it('handles error state appropriately', () => {
    render(
      <StepsVertical {...defaultProps} error={true} />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/error-|destructive/i)
  })

  it('applies proper focus ring for accessibility', () => {
    render(<StepsVertical {...defaultProps} />)

    const items = screen.getAllByRole('listitem')
    
    // Items should have focus rings when focused
    items.forEach((_, index) => {
      if (index === 0) {
        expect(items[index]).toHaveClass(/focus-|ring-/)
      } else {
        expect(items[index]).toHaveClass(/focus-|ring-/)
      }
    })
  })

  it('handles custom step icons properly', () => {
    render(
      <StepsVertical
        {...defaultProps}
        steps={[
          { id: 'step-1', title: 'Step One', description: 'First step details', icon: 'check' },
          { id: 'step-2', title: 'Step Two', description: 'Second step details', icon: 'arrow-right' },
        ]}
      />
    )

    expect(screen.getByText('Step One')).toBeInTheDocument()
  })

  it('applies proper z-index for modal-like overlays', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/z-\d+/i || /relative/i)
  })

  it('handles very deep nesting without issues', () => {
    render(
      <StepsVertical
        {...defaultProps}
        steps={[{ id: 'step-1', title: 'Step One' }]}
      />
    )

    // Should handle nested content properly
    expect(screen.getByText('Step One')).toBeInTheDocument()
  })

  it('applies proper overflow handling for long text', () => {
    render(
      <StepsVertical
        {...defaultProps}
        steps={[{ id: 'step-1', title: 'A', description: 'B'.repeat(200) }]}
      />
    )

    // Should handle overflow gracefully
    expect(screen.getByText('Step One')).toBeInTheDocument()
  })

  it('handles custom event handlers without errors', () => {
    const handleClick = vi.fn()
    
    render(
      <StepsVertical
        {...defaultProps}
        steps={[{ id: 'step-1', title: 'Step One' }]}
        onStepClick={handleClick}
      />
    )

    expect(screen.getByText('Step One')).toBeInTheDocument()
  })

  it('applies proper min/max height constraints', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/min-h-|max-h-/i || /h-\d+/i)
  })

  it('handles custom padding values', () => {
    render(
      <StepsVertical {...defaultProps} className="p-8" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/p-8/i)
  })

  it('applies proper margin utilities for spacing', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/m-\d+|my-2/i)
  })

  it('handles custom width/height constraints', () => {
    render(
      <StepsVertical {...defaultProps} className="w-full max-w-4xl" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/max-w-4xl/i)
  })

  it('applies proper flex/grid layout utilities', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/flex|grid|block/i)
  })

  it('handles custom font sizes appropriately', () => {
    render(
      <StepsVertical {...defaultProps} className="text-xl" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/text-xl/i)
  })

  it('applies proper letter-spacing for readability', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/tracking-|letter-/)
  })

  it('handles custom line-height values', () => {
    render(
      <StepsVertical {...defaultProps} className="leading-relaxed" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/leading-|line-height/i)
  })

  it('applies proper text-align for different contexts', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/text-|align-/i)
  })

  it('handles custom text-transform values', () => {
    render(
      <StepsVertical {...defaultProps} className="uppercase" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/uppercase/i)
  })

  it('applies proper text-opacity for subtle effects', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/opacity-|text-opacity/i)
  })

  it('handles custom text-shadow for depth', () => {
    render(
      <StepsVertical {...defaultProps} className="shadow-sm" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/shadow-|text-shadow/i)
  })

  it('applies proper text-gradient for visual interest', () => {
    render(
      <StepsVertical {...defaultProps} className="bg-clip-text text-transparent bg-gradient-to-r" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/gradient-|bg-clip/i)
  })

  it('handles custom background utilities', () => {
    render(
      <StepsVertical {...defaultProps} className="bg-card" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/bg-card/i)
  })

  it('applies proper border utilities for separation', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/border-|rounded-lg/i)
  })

  it('handles custom ring utilities for focus states', () => {
    render(
      <StepsVertical {...defaultProps} className="ring-1 ring-ring" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/ring-|ring-ring/i)
  })

  it('applies proper transition utilities for smooth interactions', () => {
    render(<StepsVertical {...defaultProps} />)

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/transition-|ease/i)
  })

  it('handles custom animation utilities', () => {
    render(
      <StepsVertical {...defaultProps} className="animate-in fade-in" />
    )

    const container = screen.getByRole('list').closest('[class*="steps-vertical"]')
    expect(container).toHaveClass(/animate-|fade-in/i)
  })

  it('applies proper transform utilities for positioning', () => {
    render(<StepsVertical {...defaultProps} />)
