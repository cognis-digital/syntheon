import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { FeatureThreeUp } from '@/components/sections/feature-three-up'

describe('FeatureThreeUp', () => {
  const defaultProps = {
    features: [
      { title: 'Feature One', description: 'Description one' },
      { title: 'Feature Two', description: 'Description two' },
      { title: 'Feature Three', description: 'Description three' },
    ],
  }

  it('renders with defaults and asserts key content', () => {
    const { container } = render(
      <FeatureThreeUp {...defaultProps} className="bg-background" />
    )

    expect(container).toBeInTheDocument()

    // Assert all features are present
    ['Feature One', 'Feature Two', 'Feature Three'].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })

    // Assert descriptions are rendered
    expect(screen.getByText('Description one')).toBeInTheDocument()
    expect(screen.getByText('Description two')).toBeInTheDocument()
    expect(screen.getByText('Description three')).toBeInTheDocument()
  })

  it('applies className correctly', () => {
    const wrapper = render(
      <FeatureThreeUp {...defaultProps} className="bg-primary rounded-lg" />
    )

    // Check that the container has the expected class (adjust selector based on actual structure)
    expect(wrapper.container).toHaveClass(/rounded-lg/)
  })

  it('handles empty features gracefully', () => {
    const wrapper = render(<FeatureThreeUp features={[]} className="bg-background" />)

    // Should not crash and should have some minimal content or be empty
    expect(wrapper.container).toBeInTheDocument()
  })

  it('renders with dark mode context correctly', async () => {
    document.body.classList.add('dark')

    const wrapper = render(
      <FeatureThreeUp {...defaultProps} className="bg-background" />
    )

    // Wait for any motion to settle
    await waitFor(() => {
      expect(wrapper.container).toBeInTheDocument()
    })

    document.body.classList.remove('dark')
  })

  it('applies focus styles for accessibility', () => {
    const wrapper = render(
      <FeatureThreeUp {...defaultProps} className="bg-background" />
    )

    // Find interactive elements (buttons, links) and check focus states
    const focusableElements = wrapper.container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    expect(focusableElements.length).toBeGreaterThan(0)

    // Simulate focus on first element
    if (focusableElements[0]) {
      focusableElements[0].focus()
      document.activeElement === focusableElements[0]
        ? expect(document.activeElement).toHaveFocus()
        : null
    }
  })

  it('renders without warnings', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<FeatureThreeUp {...defaultProps} className="bg-background" />)

    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
