import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeroGradient } from '@/components/sections/hero-gradient'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

describe('HeroGradient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.className = ''
  })

  it('renders with all default props and no required arguments', () => {
    const { container, getByText } = render(<HeroGradient />)

    expect(container).toBeInTheDocument()
    expect(getByText(/hero/i)).toBeInTheDocument()
    expect(getByText(/gradient/i)).toBeInTheDocument()
  })

  it('applies correct Tailwind token classes by default', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for semantic class names
    expect(container).toHaveClass('bg-background')
    expect(getByText(/hero/i)).toHaveClass('text-foreground')
  })

  it('renders gradient background correctly', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Verify gradient is present in DOM
    const gradientEl = container.querySelector('[class*="gradient"]')
    expect(gradientEl).toBeInTheDocument()
  })

  it('applies Framer Motion layout transitions', () => {
    const wrapper = document.createElement('div')
    wrapper.id = 'root'
    document.body.appendChild(wrapper)

    render(<HeroGradient />, { container: wrapper })

    // Check for motion props in rendered output
    expect(container).toHaveAttribute('data-motion-enabled')
  })

  it('respects prefers-reduced-motion media query', () => {
    const reducedMotion = new Map([[useReducedMotion, true]])

    vi.mock('@/hooks/use-reduced-motion', async (importOriginal) => {
      const original = await importOriginal()
      return { ...original, useReducedMotion: true }
    })

    render(<HeroGradient />)

    // Motion should be disabled when reduced motion is detected
    expect(container).toHaveAttribute('data-reduced-motion')
  })

  it('supports dark mode via className prop', () => {
    const { container, getByText } = render(
      <HeroGradient className="dark" />
    )

    // Dark mode classes should be applied
    expect(getByText(/hero/i)).toHaveClass('text-foreground')
  })

  it('supports custom text content via children prop', () => {
    const customText = 'Custom Hero Text'
    render(<HeroGradient>{customText}</HeroGradient>)

    expect(screen.getByText(customText)).toBeInTheDocument()
  })

  it('applies rounded-md radius by default', () => {
    const { container } = render(<HeroGradient />)

    // Check for border radius styling
    expect(container).toHaveStyle(/rounded-md/)
  })

  it('handles keyboard navigation properly', async () => {
    const { container, getByText } = render(<HeroGradient />)

    const heroEl = container.querySelector('[role="main"]') as HTMLElement
    expect(heroEl).not.toBeNull()

    // Tab should focus the main element
    act(() => {
      heroEl?.focus()
    })

    expect(document.activeElement).toBe(heroEl)
  })

  it('maintains accessibility attributes', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for ARIA roles and labels
    expect(container.querySelector('[role="main"]')).toBeInTheDocument()
    expect(getByText(/hero/i)).toHaveAttribute('id')
  })

  it('renders responsive breakpoints correctly', () => {
    const { container } = render(<HeroGradient />)

    // Check for responsive utility classes
    expect(container).toHaveClass('md:')
  })

  it('applies bg-primary and text-primary-foreground tokens', () => {
    const { container, getByText } = render(<HeroGradient />)

    expect(getByText(/hero/i)).toHaveClass('text-primary')
    expect(getByText(/gradient/i)).toHaveClass('bg-primary')
  })

  it('handles hover state with smooth transitions', async () => {
    const user = userEvent.setup()

    render(<HeroGradient />)

    // Hover should trigger layout transition
    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousemove', {}))
    })

    expect(container).toHaveStyle(/transition/)
  })

  it('renders with proper semantic HTML structure', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Verify main content wrapper exists
    const mainWrapper = container.querySelector('[class*="main"]')
    expect(mainWrapper).toBeInTheDocument()
  })

  it('applies border-border token to appropriate elements', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for border styling on interactive elements
    const interactiveEl = container.querySelector('[class*="interactive"]')
    expect(interactiveEl).toHaveClass('border-border')
  })

  it('supports custom gradient direction via props', () => {
    const customDirection = 'to-bottom'
    render(<HeroGradient direction={customDirection} />)

    // Custom direction should be reflected in styles
    expect(container).toHaveStyle(/direction/)
  })

  it('maintains performance with will-change optimization', () => {
    const { container } = render(<HeroGradient />)

    // Check for GPU acceleration hints
    expect(container).toHaveStyle(/will-change/)
  })

  it('handles empty state gracefully', () => {
    render(<HeroGradient />)

    // Should not crash with minimal content
    expect(screen.getByText(/hero/i)).toBeInTheDocument()
  })

  it('applies bg-muted and text-muted-foreground for secondary elements', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check muted token usage in appropriate places
    expect(container).toHaveClass('bg-muted')
    expect(getByText(/secondary/i)).toHaveClass('text-muted-foreground')
  })

  it('renders with consistent spacing using Tailwind utilities', () => {
    const { container } = render(<HeroGradient />)

    // Verify padding/margin utilities are applied
    expect(container).toHaveStyle(/p-/i)
  })

  it('supports custom animation duration via props', async () => {
    const customDuration = '0.5s'
    render(<HeroGradient duration={customDuration} />)

    // Custom duration should be reflected in CSS variables or inline styles
    expect(container).toHaveStyle(/duration/)
  })

  it('handles focus states with visible outlines', () => {
    const user = userEvent.setup()

    render(<HeroGradient />)

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', {}))
    })

    expect(container).toHaveStyle(/outline/)
  })

  it('renders with proper z-index layering for depth effects', () => {
    const { container } = render(<HeroGradient />)

    // Check for z-index utilities in the DOM structure
    expect(container).toHaveClass('z-')
  })

  it('applies shadow utilities for tasteful depth', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Verify shadow is applied to appropriate elements
    expect(getByText(/hero/i)).toHaveClass('shadow-sm')
  })

  it('supports custom font weights via className prop', () => {
    render(<HeroGradient fontWeight="bold" />)

    // Custom weight should be reflected in rendered styles
    expect(container).toHaveStyle(/font-weight/)
  })

  it('handles scroll-triggered animations correctly', async () => {
    const wrapper = document.createElement('div')
    wrapper.id = 'root'
    document.body.appendChild(wrapper)

    render(<HeroGradient />, { container: wrapper })

    // Scroll should trigger layout transition
    await act(async () => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(container).toHaveStyle(/transition/)
  })

  it('applies rounded-lg to interactive elements', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for rounded-lg on buttons/links
    const interactiveEl = container.querySelector('[class*="interactive"]')
    expect(interactiveEl).toHaveClass('rounded-lg')
  })

  it('renders with proper contrast ratios for accessibility', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Verify foreground text has sufficient contrast
    expect(getByText(/hero/i)).toHaveStyle(/contrast/)
  })

  it('supports custom gradient colors via props', () => {
    const customColors = ['#8b5cf6', '#ec4899']
    render(<HeroGradient colors={customColors} />)

    // Custom colors should be reflected in gradient styles
    expect(container).toHaveStyle(/gradient/)
  })

  it('handles resize events gracefully', async () => {
    const wrapper = document.createElement('div')
    wrapper.id = 'root'
    document.body.appendChild(wrapper)

    render(<HeroGradient />, { container: wrapper })

    // Resize should not break layout
    await act(async () => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(container).toBeInTheDocument()
  })

  it('applies bg-card token to card containers', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for card background styling
    expect(getByText(/hero/i)).toHaveClass('bg-card')
  })

  it('renders with proper text hierarchy (h1 > h2 > p)', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify heading structure
    expect(getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('supports custom animation variants via props', () => {
    const customVariants = 'fade-in-up'
    render(<HeroGradient variants={customVariants} />)

    // Custom variants should be reflected in motion configuration
    expect(container).toHaveStyle(/animate/)
  })

  it('handles focus-visible state for keyboard navigation', async () => {
    const user = userEvent.setup()

    render(<HeroGradient />)

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', {}))
    })

    expect(container).toHaveStyle(/focus/)
  })

  it('applies text-primary-foreground to primary text elements', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for primary foreground color on main headings
    expect(getByText(/hero/i)).toHaveClass('text-primary')
  })

  it('renders with proper overflow handling for responsive content', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify overflow is handled gracefully
    expect(container).toHaveStyle(/overflow/)
  })

  it('supports custom animation delay via props', async () => {
    const customDelay = '0.2s'
    render(<HeroGradient delay={customDelay} />)

    // Custom delay should be reflected in CSS animations
    expect(container).toHaveStyle(/delay/)
  })

  it('handles pointer events with proper cursor styling', async () => {
    const user = userEvent.setup()

    render(<HeroGradient />)

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('pointerdown', {}))
    })

    expect(container).toHaveStyle(/cursor/)
  })

  it('applies border-border to container boundaries', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for border styling on main containers
    expect(getByText(/hero/i)).toHaveClass('border-border')
  })

  it('renders with proper line-height and letter-spacing for readability', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify typography utilities are applied
    expect(container).toHaveStyle(/line-height/)
  })

  it('supports custom animation easing via props', async () => {
    const customEasing = 'ease-in-out'
    render(<HeroGradient easing={customEasing} />)

    // Custom easing should be reflected in motion configuration
    expect(container).toHaveStyle(/easing/)
  })

  it('handles touch events with proper gesture support', async () => {
    const wrapper = document.createElement('div')
    wrapper.id = 'root'
    document.body.appendChild(wrapper)

    render(<HeroGradient />, { container: wrapper })

    // Touch should trigger appropriate layout transitions
    await act(async () => {
      window.dispatchEvent(new Event('touchstart'))
    })

    expect(container).toHaveStyle(/transition/)
  })

  it('applies bg-background to root container', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for background color on main containers
    expect(getByText(/hero/i)).toHaveClass('bg-background')
  })

  it('renders with proper max-width constraints for responsive design', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify max-width is applied appropriately
    expect(container).toHaveStyle(/max-width/)
  })

  it('supports custom animation direction via props', async () => {
    const customDirection = 'reverse'
    render(<HeroGradient direction={customDirection} />)

    // Custom direction should be reflected in motion configuration
    expect(container).toHaveStyle(/direction/)
  })

  it('handles focus-within state for nested interactive elements', async () => {
    const user = userEvent.setup()

    render(<HeroGradient />)

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', {}))
    })

    expect(container).toHaveStyle(/focus/)
  })

  it('applies text-foreground to default text elements', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for foreground color on default text
    expect(getByText(/hero/i)).toHaveClass('text-foreground')
  })

  it('renders with proper min-height for minimum content area', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify min-height is applied appropriately
    expect(container).toHaveStyle(/min-height/)
  })

  it('supports custom animation loop via props', async () => {
    const customLoop = 'infinite'
    render(<HeroGradient loop={customLoop} />)

    // Custom loop should be reflected in motion configuration
    expect(container).toHaveStyle(/loop/)
  })

  it('handles drag events with proper gesture support', async () => {
    const wrapper = document.createElement('div')
    wrapper.id = 'root'
    document.body.appendChild(wrapper)

    render(<HeroGradient />, { container: wrapper })

    // Drag should trigger appropriate layout transitions
    await act(async () => {
      window.dispatchEvent(new Event('dragstart'))
    })

    expect(container).toHaveStyle(/transition/)
  })

  it('applies rounded-md to interactive elements', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for border radius on interactive components
    expect(getByText(/interactive/i)).toHaveClass('rounded-md')
  })

  it('renders with proper font-family inheritance from design tokens', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify font-family is inherited correctly
    expect(container).toHaveStyle(/font-family/)
  })

  it('supports custom animation fill mode via props', async () => {
    const customFill = 'both'
    render(<HeroGradient fill={customFill} />)

    // Custom fill should be reflected in motion configuration
    expect(container).toHaveStyle(/fill/)
  })

  it('handles selection events with proper styling', async () => {
    const user = userEvent.setup()

    render(<HeroGradient />)

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', {}))
    })

    expect(container).toHaveStyle(/selection/)
  })

  it('applies border-border to container boundaries', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for border styling on main containers
    expect(getByText(/hero/i)).toHaveClass('border-border')
  })

  it('renders with proper text-transform utilities for consistency', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify text-transform is applied appropriately
    expect(container).toHaveStyle(/text-transform/)
  })

  it('supports custom animation timing function via props', async () => {
    const customTiming = 'linear'
    render(<HeroGradient timing={customTiming} />)

    // Custom timing should be reflected in motion configuration
    expect(container).toHaveStyle(/timing/)
  })

  it('handles paste events with proper clipboard support', async () => {
    const wrapper = document.createElement('div')
    wrapper.id = 'root'
    document.body.appendChild(wrapper)

    render(<HeroGradient />, { container: wrapper })

    // Paste should not break layout
    await act(async () => {
      window.dispatchEvent(new Event('paste'))
    })

    expect(container).toBeInTheDocument()
  })

  it('applies bg-muted to secondary containers', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for muted background on secondary elements
    expect(getByText(/secondary/i)).toHaveClass('bg-muted')
  })

  it('renders with proper aspect-ratio utilities for responsive content', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify aspect-ratio is applied appropriately
    expect(container).toHaveStyle(/aspect/)
  })

  it('supports custom animation iteration count via props', async () => {
    const customIterations = '3'
    render(<HeroGradient iterations={customIterations} />)

    // Custom iterations should be reflected in motion configuration
    expect(container).toHaveStyle(/iteration/)
  })

  it('handles context menu events with proper right-click support', async () => {
    const user = userEvent.setup()

    render(<HeroGradient />)

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('contextmenu', {}))
    })

    expect(container).toHaveStyle(/context/)
  })

  it('applies text-primary-foreground to primary headings', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for primary foreground color on main headings
    expect(getByText(/hero/i)).toHaveClass('text-primary')
  })

  it('renders with proper overflow-x and overflow-y utilities', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify horizontal/vertical overflow is handled
    expect(container).toHaveStyle(/overflow/)
  })

  it('supports custom animation direction via props', async () => {
    const customDirection = 'normal'
    render(<HeroGradient direction={customDirection} />)

    // Custom direction should be reflected in motion configuration
    expect(container).toHaveStyle(/direction/)
  })

  it('handles keydown events with proper keyboard support', async () => {
    const wrapper = document.createElement('div')
    wrapper.id = 'root'
    document.body.appendChild(wrapper)

    render(<HeroGradient />, { container: wrapper })

    // Keydown should not break layout
    await act(async () => {
      window.dispatchEvent(new Event('keydown'))
    })

    expect(container).toBeInTheDocument()
  })

  it('applies bg-card to card containers', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for card background on main containers
    expect(getByText(/hero/i)).toHaveClass('bg-card')
  })

  it('renders with proper text-wrap utilities for responsive content', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify text-wrap is applied appropriately
    expect(container).toHaveStyle(/text-wrap/)
  })

  it('supports custom animation rotation via props', async () => {
    const customRotation = '0deg'
    render(<HeroGradient rotation={customRotation} />)

    // Custom rotation should be reflected in motion configuration
    expect(container).toHaveStyle(/rotate/)
  })

  it('handles dragend events with proper gesture cleanup', async () => {
    const user = userEvent.setup()

    render(<HeroGradient />)

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('dragend'))
    })

    expect(container).toHaveStyle(/transition/)
  })

  it('applies rounded-lg to interactive elements', () => {
    const { container, getByText } = render(<HeroGradient />)

    // Check for border radius on interactive components
    expect(getByText(/interactive/i)).toHaveClass('rounded-lg')
  })

  it('renders with proper font-smooth utilities for crisp text rendering', () => {
    const { container, getAllByRole: getByRole } = render(<HeroGradient />)

    // Verify font-smooth is applied appropriately
    expect(container).toHave
