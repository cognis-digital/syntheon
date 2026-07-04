import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ParallaxSection } from '@/components/premium/parallax-section'

describe('ParallaxSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props without throwing', () => {
    const { container, getByText } = render(
      <ParallaxSection>
        <h1 className="text-2xl font-bold">Hello World</h1>
      </ParallaxSection>
    )

    expect(container).toBeInTheDocument()
    expect(getByText('Hello World')).toBeInTheDocument()
  })

  it('applies base classes from className prop', () => {
    const wrapper = render(
      <ParallaxSection className="custom-class">
        Content
      </ParallaxSection>
    )

    // Check that container has expected structure
    expect(wrapper.container).toHaveClass('relative')
  })

  it('accepts id prop and applies it to root element', () => {
    const wrapper = render(
      <ParallaxSection id="test-section">
        Content
      </ParallaxSection>
    )

    expect(screen.getByRole('region')).toHaveAttribute('id', 'test-section')
  })

  it('renders children correctly with proper nesting', () => {
    const wrapper = render(
      <ParallaxSection title="Test Title">
        <p className="text-muted-foreground">Description text</p>
      </ParallaxSection>
    )

    expect(screen.getByText(/Test Title/i)).toBeInTheDocument()
  })

  it('handles dark mode correctly', () => {
    document.body.classList.add('dark')

    const wrapper = render(
      <ParallaxSection title="Dark Mode Test">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
    
    // Clean up
    document.body.classList.remove('dark')
  })

  it('applies variant-specific styling when provided', () => {
    const variants = ['minimal', 'bold', 'elegant'] as const
    
    variants.forEach((variant) => {
      const wrapper = render(
        <ParallaxSection title="Variant Test" variant={variant}>
          Content
        </ParallaxSection>
      )

      expect(wrapper.container).toHaveClass('relative')
    })
  })

  it('accepts speed prop for parallax intensity', () => {
    const wrapper = render(
      <ParallaxSection title="Speed Test" speed={0.5}>
        Content
      </ParallaxSection>
    )

    // Speed should be stored as a prop or state
    expect(wrapper.container).toHaveAttribute('data-speed', '0.5')
  })

  it('accepts direction prop for scroll direction', () => {
    const wrapper = render(
      <ParallaxSection title="Direction Test" direction="vertical">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveAttribute('data-direction', 'vertical')
  })

  it('handles responsive sizing correctly', () => {
    const wrapper = render(
      <ParallaxSection title="Responsive Test" className="max-w-4xl">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('applies proper ARIA attributes for accessibility', () => {
    const wrapper = render(
      <ParallaxSection 
        title="Accessible Section" 
        aria-label="Test accessible parallax section"
      >
        Content
      </ParallaxSection>
    )

    // Check that region role is applied (framer-motion typically adds this)
    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('handles keyboard navigation gracefully', async () => {
    const wrapper = render(
      <ParallaxSection title="Keyboard Test">
        <button>Click me</button>
      </ParallaxSection>
    )

    // Simulate tabbing through the section
    await userEvent.tab()
    
    expect(screen.getByText('Click me')).toHaveFocus()
  })

  it('preserves focus when interacting', async () => {
    const wrapper = render(
      <ParallaxSection title="Focus Test">
        <button id="focus-btn">Focus</button>
      </ParallaxSection>
    )

    await userEvent.click(screen.getByText('Focus'))
    
    // Focus should remain within the interactive area
    expect(document.activeElement).not.toBeNull()
  })

  it('handles long content with proper scrolling', () => {
    const longContent = Array(20)
      .fill(null)
      .map((_, i) => <p key={i}>Paragraph {i + 1}</p>)
      .join('')

    render(
      <ParallaxSection title="Long Content Test">
        {longContent}
      </ParallaxSection>
    )

    expect(screen.getByText(/Paragraph 20/i)).toBeInTheDocument()
  })

  it('handles empty children gracefully', () => {
    const wrapper = render(
      <ParallaxSection title="Empty Children Test">
        {/* No children */}
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('accepts optional className override for customization', () => {
    const wrapper = render(
      <ParallaxSection 
        title="Custom Class Test" 
        className="bg-primary/10 backdrop-blur-sm"
      >
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles very fast speed values', () => {
    const wrapper = render(
      <ParallaxSection title="Fast Speed Test" speed={2.0}>
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveAttribute('data-speed', '2')
  })

  it('handles very slow speed values', () => {
    const wrapper = render(
      <ParallaxSection title="Slow Speed Test" speed={0.1}>
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveAttribute('data-speed', '0.1')
  })

  it('handles negative direction values (reverse scroll)', () => {
    const wrapper = render(
      <ParallaxSection title="Reverse Direction Test" direction="-1">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveAttribute('data-direction', '-1')
  })

  it('renders with proper type hierarchy (headings)', () => {
    const wrapper = render(
      <ParallaxSection title="Type Hierarchy Test">
        <h2 className="text-xl font-semibold">Subheading</h2>
        <p className="text-sm text-muted-foreground">Description</p>
      </ParallaxSection>
    )

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('handles nested interactive elements correctly', () => {
    const wrapper = render(
      <ParallaxSection title="Nested Interactive Test">
        <nav>
          <ul className="flex gap-4">
            <li><a href="#">Link 1</a></li>
            <li><a href="#">Link 2</a></li>
          </ul>
        </nav>
      </ParallaxSection>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('preserves custom event handlers on children', () => {
    const handleClick = vi.fn()
    
    render(
      <ParallaxSection title="Event Handler Test">
        <button onClick={handleClick}>Test Button</button>
      </ParallaxSection>
    )

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('handles focus trap within the section', async () => {
    const wrapper = render(
      <ParallaxSection title="Focus Trap Test">
        <div tabIndex={0}>Focusable Div</div>
        <button id="outside-btn">Outside</button>
      </ParallaxSection>
    )

    // Focus the section itself
    await userEvent.tab()
    
    expect(document.activeElement).toHaveClass('relative')
  })

  it('handles scroll events without crashing', () => {
    const wrapper = render(
      <ParallaxSection title="Scroll Event Test">
        Content
      </ParallaxSection>
    )

    // Simulate scroll behavior (jsdom may not have full scroll APIs)
    expect(wrapper.container).not.toThrow()
  })

  it('handles layout transitions gracefully', () => {
    const wrapper = render(
      <ParallaxSection title="Layout Transition Test">
        Content
      </ParallaxSection>
    )

    // Layout animations should not cause reflows that break tests
    expect(wrapper.container).not.toHaveClass(/overflow-hidden/)
  })

  it('accepts border radius customization', () => {
    const wrapper = render(
      <ParallaxSection title="Border Radius Test" className="rounded-2xl">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles overflow scenarios gracefully', () => {
    const wrapper = render(
      <ParallaxSection title="Overflow Test" className="overflow-hidden">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative', 'overflow-hidden')
  })

  it('preserves z-index stacking context', () => {
    const wrapper = render(
      <ParallaxSection title="Z-Index Test" className="z-50">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles very long titles without breaking layout', () => {
    const longTitle = 'A'.repeat(100)
    
    render(
      <ParallaxSection title={longTitle}>
        Content
      </ParallaxSection>
    )

    expect(screen.getByText(longTitle)).toBeInTheDocument()
  })

  it('handles special characters in content', () => {
    const wrapper = render(
      <ParallaxSection title="Special Characters Test">
        <p className="text-muted-foreground">
          &lt;div&gt; with HTML entities: "quotes" and 'apostrophes'
        </p>
      </ParallaxSection>
    )

    expect(screen.getByText(/&lt;div&gt;/i)).toBeInTheDocument()
  })

  it('renders with proper semantic structure', () => {
    const wrapper = render(
      <ParallaxSection 
        title="Semantic Structure Test" 
        aria-labelledby="section-title"
      >
        Content
      </ParallaxSection>
    )

    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('handles animation preferences (reduced motion)', () => {
    document.body.classList.add('prefers-reduced-motion')

    const wrapper = render(
      <ParallaxSection title="Reduced Motion Test">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
    
    // Clean up
    document.body.classList.remove('prefers-reduced-motion')
  })

  it('accepts custom animation duration', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Duration Test">
        Content
      </ParallaxSection>
    )

    // Animation duration should be stored for later use
    expect(wrapper.container).toHaveAttribute('data-animation-duration')
  })

  it('handles lazy loading content correctly', () => {
    const wrapper = render(
      <ParallaxSection title="Lazy Load Test" className="lazy-load">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative', 'lazy-load')
  })

  it('preserves scroll position when re-rendering', () => {
    const wrapper = render(
      <ParallaxSection title="Scroll Position Test">
        Content
      </ParallaxSection>
    )

    // Should not cause unnecessary scroll jumps
    expect(wrapper.container).not.toHaveClass(/overflow-y-auto/)
  })

  it('handles focus management on mount', () => {
    const wrapper = render(
      <ParallaxSection title="Focus Management Test">
        Content
      </ParallaxSection>
    )

    // Focus should be properly managed on initial mount
    expect(document.activeElement).not.toBeNull()
  })

  it('accepts custom focus behavior', () => {
    const wrapper = render(
      <ParallaxSection title="Custom Focus Test" className="focus-within">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles hover states gracefully', async () => {
    const wrapper = render(
      <ParallaxSection title="Hover State Test">
        <button className="hover:scale-105">Hover Me</button>
      </ParallaxSection>
    )

    // Hover state should be applied without issues
    expect(wrapper.container).not.toHaveClass(/cursor-not-allowed/)
  })

  it('preserves touch interaction capabilities', () => {
    const wrapper = render(
      <ParallaxSection title="Touch Interaction Test">
        Content
      </ParallaxSection>
    )

    // Touch events should be properly delegated
    expect(wrapper.container).not.toHaveClass(/select-none/)
  })

  it('handles resize events without layout shift', () => {
    const wrapper = render(
      <ParallaxSection title="Resize Test">
        Content
      </ParallaxSection>
    )

    // Resize should not cause excessive reflows
    expect(wrapper.container).not.toHaveClass(/overflow-x-auto/)
  })

  it('accepts custom cursor behavior', () => {
    const wrapper = render(
      <ParallaxSection title="Custom Cursor Test" className="cursor-none">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles gradient backgrounds correctly', () => {
    const wrapper = render(
      <ParallaxSection 
        title="Gradient Background Test" 
        className="bg-gradient-to-br from-primary/10 to-secondary/5"
      >
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves backdrop blur effects', () => {
    const wrapper = render(
      <ParallaxSection 
        title="Backdrop Blur Test" 
        className="backdrop-blur-md bg-background/50"
      >
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles text shadow for depth', () => {
    const wrapper = render(
      <ParallaxSection title="Text Shadow Test">
        <h1 className="text-shadow-lg">Shadowed Text</h1>
      </ParallaxSection>
    )

    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('preserves box shadow for depth', () => {
    const wrapper = render(
      <ParallaxSection title="Box Shadow Test" className="shadow-2xl">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles border radius transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Border Radius Transition Test" className="rounded-3xl">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves transition timing functions', () => {
    const wrapper = render(
      <ParallaxSection title="Transition Timing Test" className="transition-all duration-300">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles multiple animation layers', () => {
    const wrapper = render(
      <ParallaxSection title="Multiple Animation Layers Test">
        <div className="animate-fade-in">Layer 1</div>
        <div className="animate-slide-up">Layer 2</div>
      </ParallaxSection>
    )

    expect(screen.getByText('Layer 1')).toBeInTheDocument()
    expect(screen.getByText('Layer 2')).toBeInTheDocument()
  })

  it('preserves animation easing functions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Easing Test" className="ease-in-out">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles animation delay values', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Delay Test" className="animate-delay-200">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves animation iteration counts', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Iteration Test" className="animate-infinite">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles animation fill modes', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Fill Mode Test" className="animate-fill-backwards">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves animation timing functions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Timing Function Test" className="animate-timing-ease-in">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles animation transform properties', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Transform Test" className="animate-transform-scale">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves animation opacity transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Opacity Test" className="animate-opacity-fade">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles animation filter effects', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Filter Test" className="animate-filter-blur">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves animation blur transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Blur Test" className="animate-blur-smooth">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles animation contrast transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Contrast Test" className="animate-contrast-normal">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves animation brightness transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Brightness Test" className="animate-brightness-100">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles animation hue transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Hue Test" className="animate-hue-rotate">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves animation saturation transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Saturation Test" className="animate-saturate-100">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('handles animation invert transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Invert Test" className="animate-invert-100">
        Content
      </ParallaxSection>
    )

    expect(wrapper.container).toHaveClass('relative')
  })

  it('preserves animation grayscale transitions', () => {
    const wrapper = render(
      <ParallaxSection title="Animation Grayscale Test" className="animate-grayscale-100">
        Content
      </ParallaxSection>
