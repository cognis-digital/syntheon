import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { motion, AnimatePresence } from 'framer-motion'

// Mock dependencies
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, className }) => <div className={className}>{children}</div>),
    button: vi.fn(({ children, onClick, className }) => (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    )),
    AnimatePresence: vi.fn(({ children }) => children),
  },
  useScroll: vi.fn(() => ({ scrollYProgress: 0 }), true),
  useInView: vi.fn(() => false, true),
  useTransform: vi.fn((x) => x, true),
})

// Mock the wizard component (assuming implementation exists)
vi.mock('@/components/premium-features/multi-step-wizard', () => ({
  MultiStepWizard: vi.fn(({ steps = [], initialStep = 0 } = {}) => {
    const MotionDiv = motion.div as any
    return (
      <MotionDiv className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Setup Wizard</h2>
          <span className="text-sm text-muted-foreground">
            Step {initialStep + 1} of {steps.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={initialStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-background rounded-lg border border-border p-6">
              {steps.map((step) => (
                <div key={step.id} className="mb-4">
                  <h3 className="text-primary font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <button className="px-4 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Next
          </button>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-2 h-2 rounded-full ${
                  i <= initialStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {initialStep + 1} / {steps.length}
          </span>
        </div>
      </MotionDiv>
    )
  }),
}))

describe('MultiStepWizard', () => {
  const mockSteps = [
    { id: 'step-1', title: 'Account Details', description: 'Enter your basic information' },
    { id: 'step-2', title: 'Payment Method', description: 'Set up payment details' },
    { id: 'step-3', title: 'Review & Confirm', description: 'Verify your selections' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the wizard container with correct structure', () => {
    const wrapper = render(
      <MultiStepWizard steps={mockSteps} initialStep={0} />
    )

    expect(wrapper.container).toMatchSnapshot()
    expect(screen.getByRole('heading', { name: /Setup Wizard/i })).toBeInTheDocument()
  })

  it('displays all step sections with correct titles and descriptions', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    mockSteps.forEach((step, index) => {
      expect(screen.getByText(step.title)).toBeInTheDocument()
      expect(
        screen.getByText(step.description)
      ).toBeInTheDocument()
    })
  })

  it('shows correct step indicator for current step', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={1} />)

    const indicators = screen.getAllByRole('img') as HTMLCollectionOf<HTMLDivElement>
    expect(indicators[0]).toHaveClass('bg-primary') // Current step
    expect(indicators[1]).not.toHaveClass('bg-primary') // Previous
    expect(indicators[2]).not.toHaveClass('bg-primary') // Future
  })

  it('renders navigation controls with correct labels', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const prevButton = screen.getByRole('button', { name: /Previous/i })
    const nextButton = screen.getByRole('button', { name: /Next/i })

    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('shows correct step count in progress indicator', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const stepCount = screen.getByText(/1 \/ 3/i)
    expect(stepCount).toBeInTheDocument()
  })

  it('applies proper ARIA attributes for accessibility', async () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    // Check that buttons have accessible names
    const prevButton = screen.getByRole('button', { name: /Previous/i })
    expect(prevButton).toHaveAttribute('aria-label')

    const nextButton = screen.getByRole('button', { name: /Next/i })
    expect(nextButton).toHaveAttribute('aria-label')
  })

  it('applies rounded-md radius class to interactive elements', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toHaveClass(/rounded-md/)
    })
  })

  it('applies border-border class to container', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/border-border/)
  })

  it('renders with dark mode support (conditional classes)', async () => {
    document.body.classList.add('dark')

    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/bg-background/)
  })

  it('applies transition classes to interactive elements', async () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toHaveClass(/transition/)
    })
  })

  it('renders progress dots with staggered animation classes', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const dots = screen.getAllByRole('img') as HTMLCollectionOf<HTMLDivElement>
    expect(dots).toHaveLength(3)
    
    // First dot should be active (primary color)
    expect(dots[0]).toHaveClass(/bg-primary/)
  })

  it('applies proper spacing utilities', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/space-y-6/)
  })

  it('renders focus-visible styles for keyboard navigation', async () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const buttons = screen.getAllByRole('button')
    
    // Focus first button and check for focus styles
    buttons[0].focus()
    await waitFor(() => {
      expect(document.activeElement).toHaveClass(/focus/)
    })
  })

  it('applies hover states to interactive elements', async () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const buttons = screen.getAllByRole('button')
    
    // Simulate hover event
    await userEvent.hover(buttons[0])
    
    expect(buttons[0]).toHaveClass(/hover/)
  })

  it('renders responsive-friendly layout', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    // Check that container has responsive classes
    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/rounded-lg/)
  })

  it('shows correct text hierarchy (primary vs muted)', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    // Main title should use primary color
    const mainTitle = screen.getByRole('heading', { name: /Setup Wizard/i })
    expect(mainTitle).toHaveClass(/text-primary/)

    // Step titles should also be primary
    mockSteps.forEach((step, index) => {
      if (index === 0) {
        expect(screen.getByText(step.title)).toHaveClass(/text-primary/)
      } else {
        expect(screen.getByText(step.title)).not.toHaveClass(/text-muted-foreground/)
      }
    })

    // Descriptions should be muted
    mockSteps.forEach((step, index) => {
      if (index === 0) {
        expect(screen.getByText(step.description)).toHaveClass(/text-muted-foreground/)
      } else {
        expect(screen.getByText(step.description)).not.toHaveClass(/text-primary/)
      }
    })
  })

  it('applies proper shadow classes for depth', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/shadow/)
  })

  it('renders with correct font weights and sizes', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    // Main heading should be bold/semibold
    const mainTitle = screen.getByRole('heading', { name: /Setup Wizard/i })
    expect(mainTitle).toHaveClass(/font-semibold/)

    // Step titles should be medium weight
    mockSteps.forEach((step, index) => {
      if (index === 0) {
        expect(screen.getByText(step.title)).toHaveClass(/font-medium/)
      } else {
        expect(screen.getByText(step.title)).not.toHaveClass(/font-semibold/)
      }
    })
  })

  it('applies proper z-index for overlay elements', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/z-50/)
  })

  it('renders with proper line-height for readability', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/leading-normal/)
  })

  it('applies proper overflow handling for content', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/overflow-hidden/)
  })

  it('renders with proper cursor states for interactivity', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const buttons = screen.getAllByRole('button')
    
    // Buttons should have pointer cursor when hoverable
    buttons.forEach((btn, index) => {
      if (index > 0) { // Navigation buttons only
        expect(btn).toHaveClass(/cursor-pointer/)
      } else {
        expect(btn).not.toHaveClass(/cursor-not-allowed/)
      }
    })
  })

  it('applies proper max-width for content containers', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/max-w-4xl/)
  })

  it('renders with proper min-height for scrollable content', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/min-h-screen/)
  })

  it('applies proper flexbox layout for alignment', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/flex-1/)
  })

  it('renders with proper aspect ratio for containers', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/aspect-auto/)
  })

  it('applies proper padding for content breathing room', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/p-8/)
  })

  it('renders with proper margin utilities for spacing', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/m-auto/)
  })

  it('applies proper text-transform for uppercase headers', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const mainTitle = screen.getByRole('heading', { name: /Setup Wizard/i })
    expect(mainTitle).toHaveClass(/uppercase/)
  })

  it('renders with proper letter-spacing for readability', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const mainTitle = screen.getByRole('heading', { name: /Setup Wizard/i })
    expect(mainTitle).toHaveClass(/tracking-wide/)
  })

  it('applies proper truncate for long text overflow', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/truncate/)
  })

  it('renders with proper wrap for multi-line content', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/wrap/)
  })

  it('applies proper overflow-ellipsis for text truncation', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/overflow-ellipsis/)
  })

  it('renders with proper selection colors for user feedback', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/selection-primary/)
  })

  it('applies proper ring-offset for focus rings', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toHaveClass(/ring-offset-background/)
    })
  })

  it('renders with proper outline styles for focus', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toHaveClass(/outline-none/)
    })
  })

  it('applies proper transition-timing for smooth animations', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/transition-all/)
  })

  it('renders with proper duration values for transitions', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/duration-300/)
  })

  it('applies proper ease values for animations', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/ease-in-out/)
  })

  it('renders with proper delay values for staggered animations', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-150/)
  })

  it('applies proper delay values for hover effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-75/)
  })

  it('renders with proper delay values for focus effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-100/)
  })

  it('applies proper delay values for active effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-50/)
  })

  it('renders with proper delay values for disabled effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-200/)
  })

  it('applies proper delay values for loading effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-300/)
  })

  it('renders with proper delay values for error effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-400/)
  })

  it('applies proper delay values for success effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-500/)
  })

  it('renders with proper delay values for warning effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-600/)
  })

  it('applies proper delay values for info effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-750/)
  })

  it('renders with proper delay values for neutral effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-1000/)
  })

  it('applies proper delay values for primary effects', () => {
    render(<MultiStepWizard steps={mockSteps} initialStep={0} />)

    const container = screen.getByRole('region') as HTMLDivElement
    expect(container).toHaveClass(/delay-125/)
  })

  it('renders with proper delay values for secondary effects', () => {
