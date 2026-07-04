import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StepsHorizontal from '@/components/sections/steps-horizontal'

describe('StepsHorizontal', () => {
  it('renders with default props and shows step labels', () => {
    const steps = [
      { label: 'Step One', id: 'one' },
      { label: 'Step Two', id: 'two' },
      { label: 'Step Three', id: 'three' },
    ]

    render(<StepsHorizontal steps={steps} />)

    expect(screen.getByText('Step One')).toBeInTheDocument()
    expect(screen.getByText('Step Two')).toBeInTheDocument()
    expect(screen.getByText('Step Three')).toBeInTheDocument()
  })

  it('applies correct base classes for horizontal layout', () => {
    const steps = [{ label: 'Test' }]

    render(<StepsHorizontal steps={steps} />)

    // Check for horizontal container structure
    expect(screen.getByRole('navigation')).toHaveClass(/flex|horizontal/)
  })

  it('applies active state styling when current step is passed', () => {
    const steps = [
      { label: 'First', id: 'first' },
      { label: 'Second', id: 'second' },
    ]

    render(<StepsHorizontal steps={steps} currentStep={1} />)

    // First step should be active/complete, second in-progress
    expect(screen.getByText('First')).toHaveClass(/active|completed/)
  })

  it('applies in-progress styling to the current step', () => {
    const steps = [
      { label: 'One', id: 'one' },
      { label: 'Two', id: 'two' },
    ]

    render(<StepsHorizontal steps={steps} currentStep={0} />)

    // Current step should have in-progress styling
    expect(screen.getByText('One')).toHaveClass(/in-progress|current/)
  })

  it('applies default/inactive styling to future steps', () => {
    const steps = [
      { label: 'A', id: 'a' },
      { label: 'B', id: 'b' },
    ]

    render(<StepsHorizontal steps={steps} currentStep={0} />)

    // Future step should be default/inactive
    expect(screen.getByText('B')).toHaveClass(/default|inactive/)
  })

  it('renders with semantic color tokens', () => {
    const steps = [{ label: 'Test' }]

    render(<StepsHorizontal steps={steps} />)

    // Check for semantic class usage (these will vary by implementation)
    expect(screen.getByText('Test')).toHaveClass(/text-|bg-/)
  })

  it('applies rounded corners via Tailwind utility', () => {
    const steps = [{ label: 'Rounded' }]

    render(<StepsHorizontal steps={steps} />)

    // Check for border radius application
    expect(screen.getByText('Rounded')).toHaveClass(/rounded/)
  })

  it('applies dark mode variants correctly', () => {
    const steps = [{ label: 'Dark Mode' }]

    render(
      <div className="dark">
        <StepsHorizontal steps={steps} />
      </div>
    )

    expect(screen.getByText('Dark Mode')).toHaveClass(/dark-/)
  })

  it('applies custom classes when provided', () => {
    const steps = [{ label: 'Custom' }]

    render(
      <StepsHorizontal
        steps={steps}
        className="custom-container"
        stepClassName="custom-step"
      />
    )

    expect(screen.getByText('Custom')).toHaveClass(/custom-/)
  })

  it('renders accessible navigation structure', () => {
    const steps = [
      { label: 'Start', id: 'start' },
      { label: 'Finish', id: 'finish' },
    ]

    render(<StepsHorizontal steps={steps} />)

    // Should have proper role for interactive navigation
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('handles empty steps array gracefully', () => {
    const steps = []

    render(<StepsHorizontal steps={steps} />)

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('applies proper ARIA attributes for screen readers', () => {
    const steps = [{ label: 'Accessible' }]

    render(<StepsHorizontal steps={steps} ariaLabel="Process Steps" />)

    // Check for accessible structure
    expect(screen.getByRole('navigation')).toHaveAttribute(/aria-label|role/)
  })
})
