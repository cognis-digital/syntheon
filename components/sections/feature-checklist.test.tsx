import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import FeatureChecklist from '@/components/sections/feature-checklist'

describe('FeatureChecklist', () => {
  const defaultProps = {
    features: [
      { id: '1', title: 'Premium Support', description: '24/7 priority assistance', icon: 'shield' },
      { id: '2', title: 'Advanced Analytics', description: 'Deep insights and reporting', icon: 'chart' },
      { id: '3', title: 'Custom Integrations', description: 'Connect your favorite tools', icon: 'plug' },
    ],
  }

  beforeEach(() => {
    document.body.className = ''
  })

  it('renders with default props and correct structure', () => {
    const { container, getByText } = render(<FeatureChecklist {...defaultProps} />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent('Features')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders all feature items with correct content', () => {
    render(<FeatureChecklist {...defaultProps} />)

    expect(screen.getByText(/Premium Support/i)).toBeInTheDocument()
    expect(screen.getByText(/24\/7 priority assistance/i)).toBeInTheDocument()
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  })

  it('applies correct semantic Tailwind classes', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check for background and border usage
    expect(container).toHaveClass(/bg-background/)
    expect(container).toHaveClass(/border-border/i)
  })

  it('handles empty features array gracefully', () => {
    const { container } = render(<FeatureChecklist features={[]} />)

    expect(container).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('applies motion classes for animations', () =>
    async () => {
      const { container, getByText } = render(<FeatureChecklist {...defaultProps} />)

      // Wait for animations to settle
      await waitFor(() => expect(container).toHaveClass(/animate-entrance/i))

      // Verify staggered entrance effect is applied
      expect(getByText('Premium Support')).toBeInTheDocument()
    })())

  it('handles checkbox interaction correctly', () => {
    const { container, getAllByRole } = render(<FeatureChecklist {...defaultProps} />)

    const checkboxes = getAllByRole('checkbox')

    // Initial state: all unchecked
    expect(checkboxes[0]).not.toBeChecked()

    // Click first checkbox
    fireEvent.click(checkboxes[0])
    expect(checkboxes[0]).toBeChecked()

    // Verify visual feedback (checkmark appears)
    expect(container).toHaveClass(/checked/i)
  })

  it('applies hover effects to feature items', () => {
    const { container, getAllByRole } = render(<FeatureChecklist {...defaultProps} />)

    const items = getAllByRole('listitem')

    // Hover over first item
    act(() => {
      fireEvent.mouseEnter(items[0])
    })

    expect(items[0]).toHaveClass(/hover-interactive/i)
  })

  it('applies focus styles for accessibility', () => {
    const { container, getAllByRole } = render(<FeatureChecklist {...defaultProps} />)

    const checkboxes = getAllByRole('checkbox')

    // Focus first checkbox
    act(() => {
      fireEvent.focus(checkboxes[0])
    })

    expect(checkboxes[0]).toHaveClass(/focus-visible/i)
  })

  it('handles keyboard navigation', () => {
    const { container, getAllByRole } = render(<FeatureChecklist {...defaultProps} />)

    const checkboxes = getAllByRole('checkbox')

    // Tab to first checkbox and press space
    act(() => {
      checkboxes[0].focus()
      fireEvent.keyDown(checkboxes[0], { key: ' ', code: 'Space' })
    })

    expect(checkboxes[0]).toBeChecked()
  })

  it('applies dark mode classes correctly', () => {
    document.body.className = 'dark'

    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // In dark mode, should still use semantic tokens
    expect(container).toHaveClass(/text-foreground/i)
  })

  it('handles feature with missing description', () => {
    const partialFeatures = [
      { id: '1', title: 'Test Feature', icon: 'star' },
    ]

    render(<FeatureChecklist features={partialFeatures} />)

    expect(screen.getByText(/Test Feature/i)).toBeInTheDocument()
  })

  it('handles feature with missing icon', () => {
    const partialFeatures = [
      { id: '1', title: 'Test Feature', description: 'A test' },
    ]

    render(<FeatureChecklist features={partialFeatures} />)

    expect(screen.getByText(/Test Feature/i)).toBeInTheDocument()
  })

  it('applies rounded-md border styling consistently', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check for consistent radius usage
    expect(container).toHaveClass(/rounded-md/i)
  })

  it('renders with proper type hierarchy (h1, h2, etc.)', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Verify heading structure
    const headings = container.querySelectorAll('h1, h2')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('applies generous spacing between items', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check for gap/spacing classes
    expect(container).toHaveClass(/gap-4/i)
  })

  it('handles large feature list gracefully', () => {
    const manyFeatures = Array.from({ length: 50 }, (_, i) => ({
      id: `feature-${i}`,
      title: `Feature ${i + 1}`,
      description: `Description for feature ${i + 1}`,
      icon: 'star',
    }))

    const { container } = render(<FeatureChecklist features={manyFeatures} />)

    expect(container).toHaveClass(/scrollable/i)
    expect(screen.getAllByRole('checkbox')).toHaveLength(50)
  })

  it('applies proper z-index for interactive elements', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that interactive elements have appropriate stacking context
    expect(container).toHaveClass(/z-interactive/i)
  })

  it('handles feature with very long description', () => {
    const longDescription = 'A'.repeat(200)

    render(<FeatureChecklist features={[{ id: '1', title: 'Test', description: longDescription }]} />)

    expect(screen.getByText(/Test/i)).toBeInTheDocument()
  })

  it('applies proper contrast ratios for text elements', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that foreground/background classes are used correctly
    expect(container).toHaveClass(/text-foreground/i)
  })

  it('handles feature with special characters in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Premium & Enterprise Support', description: 'Test', icon: 'shield' },
        ]}
      />
    )

    expect(screen.getByText(/Premium & Enterprise/i)).toBeInTheDocument()
  })

  it('applies proper transition properties for smooth interactions', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check for transition classes
    expect(container).toHaveClass(/transition-interactive/i)
  })

  it('handles feature with unicode characters', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: '日本語サポート', description: 'テスト', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/日本語/i)).toBeInTheDocument()
  })

  it('applies proper ARIA labels for screen readers', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that list items have proper roles
    const listItems = container.querySelectorAll('[role="listitem"]')
    expect(listItems.length).toBe(3)
  })

  it('handles feature with very short description', () => {
    render(<FeatureChecklist features={[{ id: '1', title: 'Test', icon: 'star' }]} />)

    expect(screen.getByText(/Test/i)).toBeInTheDocument()
  })

  it('applies proper semantic HTML structure', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Verify semantic elements are used
    expect(container).toHaveClass(/sr-only/i) // Screen reader only text where needed
  })

  it('handles feature with emoji in description', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Test', description: '🚀 Fast performance!', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/Fast/i)).toBeInTheDocument()
  })

  it('applies proper focus ring for keyboard navigation', () => {
    const { container, getAllByRole } = render(<FeatureChecklist {...defaultProps} />)

    const checkboxes = getAllByRole('checkbox')

    // Focus and check for focus styles
    act(() => {
      checkboxes[0].focus()
    })

    expect(checkboxes[0]).toHaveClass(/ring-interactive/i)
  })

  it('handles feature with newlines in description', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Test', description: 'Line 1\nLine 2', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/Line 1/i)).toBeInTheDocument()
  })

  it('applies proper min-height for list items', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have minimum height
    expect(container).toHaveClass(/min-h-interactive/i)
  })

  it('handles feature with very long title', () => {
    const longTitle = 'A'.repeat(100)

    render(<FeatureChecklist features={[{ id: '1', title: longTitle, description: 'Test' }]} />)

    expect(screen.getByText(/A/i)).toBeInTheDocument()
  })

  it('applies proper overflow handling for content', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check for overflow properties
    expect(container).toHaveClass(/overflow-interactive/i)
  })

  it('handles feature with trailing punctuation in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Premium Support!', description: 'Test', icon: 'shield' },
        ]}
      />
    )

    expect(screen.getByText(/Premium/i)).toBeInTheDocument()
  })

  it('applies proper line-height for readability', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that text has appropriate line height
    expect(container).toHaveClass(/leading-interactive/i)
  })

  it('handles feature with special HTML entities', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Test & More', description: 'Ampersand entity', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/Ampersand/i)).toBeInTheDocument()
  })

  it('applies proper max-width for list items', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate width constraints
    expect(container).toHaveClass(/max-w-interactive/i)
  })

  it('handles feature with very short title (single word)', () => {
    render(<FeatureChecklist features={[{ id: '1', title: 'X', description: 'Test' }]} />)

    expect(screen.getByText(/X/i)).toBeInTheDocument()
  })

  it('applies proper font-weight for headings', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that headings have appropriate weight
    expect(container).toHaveClass(/font-interactive/i)
  })

  it('handles feature with special characters in description', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Test', description: 'Special chars: & < > " \'', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/Special/i)).toBeInTheDocument()
  })

  it('applies proper letter-spacing for readability', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that text has appropriate spacing
    expect(container).toHaveClass(/tracking-interactive/i)
  })

  it('handles feature with mixed case in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'PREMIUM & Enterprise Support', description: 'Test', icon: 'shield' },
        ]}
      />
    )

    expect(screen.getByText(/PREMIUM/i)).toBeInTheDocument()
  })

  it('applies proper text-transform for consistency', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that text has appropriate transformation
    expect(container).toHaveClass(/text-interactive/i)
  })

  it('handles feature with numbers in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Version 2.0 Support', description: 'Test', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/Version/i)).toBeInTheDocument()
  })

  it('applies proper vertical-align for icons and text', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate alignment
    expect(container).toHaveClass(/align-interactive/i)
  })

  it('handles feature with parentheses in description', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Test', description: '(Optional)', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/Optional/i)).toBeInTheDocument()
  })

  it('applies proper box-shadow for depth', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate shadow
    expect(container).toHaveClass(/shadow-interactive/i)
  })

  it('handles feature with colons in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Support: 24/7', description: 'Test', icon: 'shield' },
        ]}
      />
    )

    expect(screen.getByText(/Support/i)).toBeInTheDocument()
  })

  it('applies proper border-radius for rounded corners', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate radius
    expect(container).toHaveClass(/rounded-interactive/i)
  })

  it('handles feature with semicolons in description', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Test', description: 'First; Second; Third', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/First/i)).toBeInTheDocument()
  })

  it('applies proper z-index for layering', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate stacking context
    expect(container).toHaveClass(/z-interactive/i)
  })

  it('handles feature with hyphens in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Enterprise-Level Support', description: 'Test', icon: 'shield' },
        ]}
      />
    )

    expect(screen.getByText(/Enterprise/i)).toBeInTheDocument()
  })

  it('applies proper min-height for touch targets', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate minimum height
    expect(container).toHaveClass(/min-h-interactive/i)
  })

  it('handles feature with apostrophes in description', () =>
    async () => {
      render(
        <FeatureChecklist
          features={[
            { id: '1', title: "Test", description: "It's working!", icon: 'star' },
          ]}
        />
      )

      // Wait for rendering
      await waitFor(() => expect(screen.getByText(/working/i)).toBeInTheDocument())
    })())

  it('applies proper cursor style for interactive elements', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate cursor
    expect(container).toHaveClass(/cursor-interactive/i)
  })

  it('handles feature with underscores in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: 'Under_score Support', description: 'Test', icon: 'shield' },
        ]}
      />
    )

    expect(screen.getByText(/Under/i)).toBeInTheDocument()
  })

  it('applies proper padding for breathing room', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate padding
    expect(container).toHaveClass(/p-interactive/i)
  })

  it('handles feature with tildes in description', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: "Test", description: '~ Optional ~', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/Optional/i)).toBeInTheDocument()
  })

  it('applies proper margin for spacing between items', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate margins
    expect(container).toHaveClass(/m-interactive/i)
  })

  it('handles feature with backticks in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: '`Code` Support', description: 'Test', icon: 'shield' },
        ]}
      />
    )

    expect(screen.getByText(/Code/i)).toBeInTheDocument()
  })

  it('applies proper overflow for long content', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate overflow handling
    expect(container).toHaveClass(/overflow-interactive/i)
  })

  it('handles feature with slashes in description', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: "Test", description: 'Path/to/file', icon: 'star' },
        ]}
      />
    )

    expect(screen.getByText(/Path/i)).toBeInTheDocument()
  })

  it('applies proper text-wrap for long titles', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate wrapping
    expect(container).toHaveClass(/break-interactive/i)
  })

  it('handles feature with asterisks in title', () => {
    render(
      <FeatureChecklist
        features={[
          { id: '1', title: '*Important*', description: 'Test', icon: 'shield' },
        ]}
      />
    )

    expect(screen.getByText(/Important/i)).toBeInTheDocument()
  })

  it('applies proper selection highlight for text', () => {
    const { container } = render(<FeatureChecklist {...defaultProps} />)

    // Check that items have appropriate selection styles
    expect(container).toHaveClass(/select-interactive/i)
  })

  it('handles feature with plus signs in description', () => {
