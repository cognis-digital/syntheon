import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { OnboardingChecklistProps } from '@/components/app/onboarding-checklist'

// Mock the component and its dependencies
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.flat().join(' '))
}))

describe('OnboardingChecklist', () => {
  const mockProps = {
    title: 'Welcome to Syntheon',
    steps: [
      { id: 'step-1', label: 'Create account', completed: false },
      { id: 'step-2', label: 'Verify email', completed: true },
      { id: 'step-3', label: 'Set up profile', completed: false }
    ],
    onComplete: vi.fn()
  }

  it('renders with mock props without errors', () => {
    const { container } = render(
      <OnboardingChecklist {...mockProps} />
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByText(mockProps.title)).toBeInTheDocument()
  })

  it('displays all steps in order', () => {
    render(<OnboardingChecklist {...mockProps} />)

    mockProps.steps.forEach((step, index) => {
      const stepElement = screen.getByText(step.label)
      expect(stepElement).toBeInTheDocument()
      
      // Verify correct ordering
      if (index > 0) {
        const previousStep = screen.getAllByText(/.*$/)[index - 1]
        expect(previousStep).toBeWithin(stepElement.closest('ol')!)
      }
    })
  })

  it('shows completion state correctly', () => {
    render(<OnboardingChecklist {...mockProps} />)

    // Completed step should have visual indicator
    const completedStep = screen.getByText('Verify email').closest('li')!
    expect(completedStep).toHaveAttribute('aria-checked', 'true')

    // Incomplete steps should show unchecked state
    const incompleteStep = screen.getByText('Create account').closest('li')!
    expect(incompleteStep).toHaveAttribute('aria-checked', 'false')
  })

  it('handles empty steps array gracefully', () => {
    render(
      <OnboardingChecklist
        title="Empty Checklist"
        steps={[]}
        onComplete={() => {}}
      />
    )

    expect(screen.getByText('Empty Checklist')).toBeInTheDocument()
    // Should still render container even with no steps
  })

  it('passes through additional className props', () => {
    const customClass = 'custom-checklist-border'
    
    render(
      <OnboardingChecklist
        {...mockProps}
        className={customClass}
      />
    )

    // Verify custom class is applied to container
    expect(screen.getByRole('region')).toHaveClass(customClass)
  })

  it('handles disabled state', () => {
    render(
      <OnboardingChecklist
        {...mockProps}
        disabled={true}
      />
    )

    // All interactive elements should be disabled
    const inputs = screen.getAllByRole('checkbox')
    inputs.forEach(input => expect(input).toBeDisabled())
  })

  it('applies dark mode correctly', () => {
    render(
      <OnboardingChecklist {...mockProps} className="dark" />
    )

    // Verify dark mode classes are applied
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/dark-?.*?/)
  })

  it('calls onComplete when all steps complete', async () => {
    const mockOnComplete = vi.fn()
    
    render(
      <OnboardingChecklist
        {...mockProps}
        onComplete={mockOnComplete}
      />
    )

    // Simulate completing remaining steps
    await userEvent.click(screen.getByText('Create account'))
    await userEvent.click(screen.getByText('Set up profile'))

    expect(mockOnComplete).toHaveBeenCalled()
  })

  it('maintains accessibility attributes', () => {
    render(<OnboardingChecklist {...mockProps} />)

    // Verify region role for screen readers
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-labelledby')

    // Verify list is properly structured
    const ol = screen.getByRole('list')
    expect(ol).toHaveAttribute('aria-label', /onboarding/i)
  })

  it('renders with proper semantic HTML structure', () => {
    render(<OnboardingChecklist {...mockProps} />)

    // Verify heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(mockProps.title)

    // Verify list container
    const ol = screen.getByRole('list')
    expect(ol).toBeInTheDocument()
  })

  it('handles partial completion state correctly', () => {
    const partialProps = {
      ...mockProps,
      steps: [
        { id: 'step-1', label: 'Create account', completed: true },
        { id: 'step-2', label: 'Verify email', completed: false }
      ]
    }

    render(<OnboardingChecklist {...partialProps} />)

    // Verify mixed state is displayed correctly
    const firstStep = screen.getByText('Create account').closest('li')!
    expect(firstStep).toHaveAttribute('aria-checked', 'true')

    const secondStep = screen.getByText('Verify email').closest('li')!
    expect(secondStep).toHaveAttribute('aria-checked', 'false')
  })

  it('applies rounded-md radius by default', () => {
    render(<OnboardingChecklist {...mockProps} />)

    // Verify border-radius is applied
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/rounded-?.*?md/)
  })

  it('renders with bg-background and text-foreground tokens', () => {
    render(<OnboardingChecklist {...mockProps} />)

    // Verify base styling tokens are applied
    const container = screen.getByRole('region')
    expect(container).toHaveClass(/bg-?.*?background/)
  })

  it('handles large number of steps without performance issues', () => {
    const manySteps: OnboardingChecklistProps['steps'] = Array.from({ length: 50 }, (_, i) => ({
      id: `step-${i}`,
      label: `Step ${i + 1}: Configure module`,
      completed: false
    }))

    render(
      <OnboardingChecklist
        title="Large Checklist"
        steps={manySteps}
        onComplete={() => {}}
      />
    )

    // Should render all items
    expect(screen.getAllByText(/Step \d+:/)).toHaveLength(manySteps.length)
  })

  it('preserves focus management on mount', () => {
    const { container } = render(<OnboardingChecklist {...mockProps} />)

    // Container should be focusable for keyboard navigation
    expect(container).toHaveFocus()
  })

  it('handles null/undefined title gracefully', () => {
    render(
      <OnboardingChecklist
        title={null as any}
        steps={mockProps.steps.slice(0, 2)}
        onComplete={() => {}}
      />
    )

    // Should still render without crashing
    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('applies border-border token for list styling', () => {
    render(<OnboardingChecklist {...mockProps} />)

    const ol = screen.getByRole('list')
    expect(ol).toHaveClass(/border-?.*?border/)
  })

  it('supports custom step labels with special characters', () => {
    const specialCharsSteps: OnboardingChecklistProps['steps'] = [
      { id: 'step-1', label: 'Step 1: &quot;quoted&quot;', completed: false },
      { id: 'step-2', label: 'Step 2: <special> chars</special>', completed: true }
    ]

    render(
      <OnboardingChecklist
        title="Special Characters Test"
        steps={specialCharsSteps}
        onComplete={() => {}}
      />
    )

    // Should render special characters correctly
    expect(screen.getByText(/quoted/)).toBeInTheDocument()
  })

  it('maintains consistent spacing with Tailwind utilities', () => {
    render(<OnboardingChecklist {...mockProps} />)

    const container = screen.getByRole('region')
    expect(container).toHaveClass(/gap-?.*?4|p-?.*?3/)
  })
})
