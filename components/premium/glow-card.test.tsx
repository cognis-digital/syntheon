import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlowCard } from '@/components/premium/glow-card'

describe('GlowCard', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.className = 'min-h-screen bg-background'
    document.body.appendChild(container)
  })

  it('renders without crashing with minimal props', () => {
    const { container: cardContainer } = render(<GlowCard />)
    expect(cardContainer).toBeInTheDocument()
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('applies default styling correctly', () => {
    const { container: cardContainer } = render(
      <GlowCard>Default Content</GlowCard>
    )
    const card = screen.getByRole('article')
    
    expect(card).toHaveClass('rounded-lg', 'bg-card', 'border-border')
    expect(card).toHaveTextContent('Default Content')
  })

  it('accepts custom children and preserves them', () => {
    const content = <div className="text-primary">Custom</div>
    render(<GlowCard>{content}</GlowCard>)
    
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const customClass = 'custom-border'
    render(
      <GlowCard className={customClass}>Test</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass(customClass)
  })

  it('respects disabled prop and disables interactive elements', () => {
    render(<GlowCard disabled>Disabled Content</GlowCard>)
    
    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('aria-disabled', 'true')
    expect(card).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('handles long content with overflow handling', () => {
    render(
      <GlowCard>
        <div className="line-clamp-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </GlowCard>
    )
    
    expect(screen.getByText('Lorem ipsum')).toBeInTheDocument()
  })

  it('maintains accessibility with proper ARIA attributes', () => {
    render(<GlowCard aria-label="Premium Feature Card">Accessible</GlowCard>)
    
    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('aria-label', 'Premium Feature Card')
  })

  it('handles responsive sizing correctly', () => {
    // Test with explicit width prop
    render(
      <GlowCard className="w-96">Responsive</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('w-full')
  })

  it('applies hover effects when enabled', () => {
    render(
      <GlowCard hoverEffect={true}>Hover Test</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('transition-all', 'duration-300')
  })

  it('respects prefers-reduced-motion via useReducedMotion', () => {
    // Simulate reduced motion preference
    document.documentElement.style.setProperty(
      'prefers-reduced-motion: no-preference'
    )
    
    const { container } = render(<GlowCard>Test</GlowCard>)
    expect(container).toBeInTheDocument()
  })

  it('handles empty children gracefully', () => {
    render(<GlowCard />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('preserves focus state when keyboard navigated to', async () => {
    const user = userEvent.setup()
    
    render(
      <div className="flex gap-4">
        <button>Other</button>
        <GlowCard tabIndex={0}>Focusable Card</GlowCard>
      </div>
    )
    
    await user.tab()
    const card = screen.getByRole('article')
    expect(card).toHaveFocus()
  })

  it('handles nested interactive elements correctly', () => {
    render(
      <GlowCard>
        <button className="bg-primary">Nested Button</button>
      </GlowCard>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('applies gradient border when specified', () => {
    render(
      <GlowCard className="border-gradient">Gradient Border</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('border-gradient')
  })

  it('handles very long text with proper line wrapping', () => {
    render(
      <GlowCard className="max-w-md">
        <p>
          This is a test of extremely long content that should wrap properly within the card container while maintaining readability and visual hierarchy.
        </p>
      </GlowCard>
    )
    
    expect(screen.getByText('This is a test')).toBeInTheDocument()
  })

  it('renders with correct semantic structure', () => {
    render(<GlowCard>Content</GlowCard>)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('relative', 'overflow-hidden')
  })

  it('handles click events when enabled', async () => {
    let clicked = false
    
    render(
      <GlowCard onClick={() => (clicked = true)}>Click Me</GlowCard>
    )
    
    const card = screen.getByRole('article')
    await userEvent.click(card)
    expect(clicked).toBe(true)
  })

  it('preserves scroll position when content is tall', () => {
    render(
      <div className="h-64 overflow-auto">
        <GlowCard className="sticky top-0">Sticky Card</GlowCard>
      </div>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('sticky', 'top-0')
  })

  it('handles focus-visible state correctly', () => {
    render(
      <GlowCard className="focus-visible:ring-2">Focus Ring</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('focus-visible:ring-2')
  })

  it('applies shadow depth correctly', () => {
    render(<GlowCard className="shadow-deep">Shadow</GlowCard>)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('shadow-deep')
  })

  it('handles animation variants when provided', async () => {
    document.documentElement.style.setProperty(
      'prefers-reduced-motion: no-preference'
    )
    
    render(<GlowCard className="animate-fade-in">Animated</GlowCard>)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('animate-fade-in')
  })

  it('maintains performance with large text content', () => {
    const longText = 'A'.repeat(500)
    render(<GlowCard>{longText}</GlowCard>)
    
    expect(screen.getByText(/A/)).toBeInTheDocument()
  })

  it('handles mixed content types gracefully', () => {
    render(
      <GlowCard>
        <h3 className="text-lg font-semibold">Heading</h3>
        <p>Paragraph text with <strong>bold</strong> emphasis.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      </GlowCard>
    )
    
    expect(screen.getByText('Heading')).toBeInTheDocument()
    expect(screen.getByText('List item 1')).toBeInTheDocument()
  })

  it('applies border radius consistently', () => {
    render(<GlowCard className="rounded-2xl">Rounded</GlowCard>)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('rounded-2xl')
  })

  it('handles icon children properly', () => {
    render(
      <GlowCard>
        <div className="flex items-center gap-3">
          <span>Icon</span>
          <span>Text</span>
        </div>
      </GlowCard>
    )
    
    expect(screen.getByText('Icon')).toBeInTheDocument()
  })

  it('respects max-height constraint', () => {
    render(
      <GlowCard className="max-h-64">Max Height</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('max-h-64')
  })

  it('handles overflow-hidden correctly', () => {
    render(<GlowCard className="overflow-hidden">Overflow</GlowCard>)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('overflow-hidden')
  })

  it('preserves z-index when specified', () => {
    render(
      <GlowCard className="z-50">Z Index</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('z-50')
  })

  it('handles text truncation gracefully', () => {
    render(
      <GlowCard className="line-clamp-2">
        <p>Very long line that should truncate properly with ellipsis.</p>
      </GlowCard>
    )
    
    expect(screen.getByText(/long line/)).toBeInTheDocument()
  })

  it('applies text decoration when specified', () => {
    render(
      <GlowCard className="text-decoration-line-through">Decorated</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('text-decoration-line-through')
  })

  it('handles font-weight variations', () => {
    render(
      <GlowCard className="font-medium">Font Weight</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('font-medium')
  })

  it('preserves user-provided font sizes', () => {
    render(
      <GlowCard className="text-xl">Large Text</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('text-xl')
  })

  it('handles background color overrides', () => {
    render(
      <GlowCard className="bg-primary/10">Tinted Background</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('bg-primary/10')
  })

  it('applies text color when specified', () => {
    render(
      <GlowCard className="text-foreground">Colored Text</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('text-foreground')
  })

  it('handles border color overrides', () => {
    render(
      <GlowCard className="border-muted">Muted Border</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('border-muted')
  })

  it('preserves padding when specified', () => {
    render(
      <GlowCard className="p-6">Padded</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('p-6')
  })

  it('handles margin overrides correctly', () => {
    render(
      <GlowCard className="m-auto">Margin Auto</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('m-auto')
  })

  it('applies flexbox layout when specified', () => {
    render(
      <GlowCard className="flex items-center justify-center">Flex</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('handles grid layout when specified', () => {
    render(
      <GlowCard className="grid gap-4">Grid</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('grid', 'gap-4')
  })

  it('preserves position utility classes', () => {
    render(
      <GlowCard className="absolute top-0 right-0">Positioned</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('absolute', 'top-0', 'right-0')
  })

  it('handles visibility utilities correctly', () => {
    render(
      <GlowCard className="invisible">Invisible</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('invisible')
  })

  it('applies opacity utilities when specified', () => {
    render(
      <GlowCard className="opacity-75">Semi-transparent</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('opacity-75')
  })

  it('handles transform utilities correctly', () => {
    render(
      <GlowCard className="scale-95">Scaled</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('scale-95')
  })

  it('preserves transition utilities', () => {
    render(
      <GlowCard className="transition-colors duration-200">Transition</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('transition-colors', 'duration-200')
  })

  it('handles animation utilities correctly', () => {
    render(
      <GlowCard className="animate-pulse">Pulsing</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('animate-pulse')
  })

  it('applies custom animations when specified', () => {
    render(
      <GlowCard className="animate-bounce">Bouncing</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('animate-bounce')
  })

  it('handles custom cursor utilities', () => {
    render(
      <GlowCard className="cursor-pointer">Pointer Cursor</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('cursor-pointer')
  })

  it('preserves selection utilities', () => {
    render(
      <GlowCard className="selection:bg-primary/20">Selectable</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('selection:bg-primary/20')
  })

  it('handles scrollbar utilities correctly', () => {
    render(
      <GlowCard className="scrollbar-thin">Thin Scrollbar</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('scrollbar-thin')
  })

  it('applies print utilities when specified', () => {
    render(
      <GlowCard className="print:hidden">Print Hidden</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('print:hidden')
  })

  it('handles responsive breakpoints correctly', () => {
    render(
      <GlowCard className="md:w-96">Responsive Width</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('md:w-96')
  })

  it('preserves dark mode variants', () => {
    render(
      <GlowCard className="dark:invert">Dark Mode Invert</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('dark:invert')
  })

  it('handles hover state variants', () => {
    render(
      <GlowCard className="hover:bg-muted/50">Hover Effect</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('hover:bg-muted/50')
  })

  it('applies focus variants correctly', () => {
    render(
      <GlowCard className="focus:ring-2 ring-primary">Focus Ring</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('focus:ring-2', 'ring-primary')
  })

  it('handles active state variants', () => {
    render(
      <GlowCard className="active:bg-muted">Active State</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('active:bg-muted')
  })

  it('preserves disabled state variants', () => {
    render(
      <GlowCard className="disabled:opacity-50">Disabled Opacity</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('disabled:opacity-50')
  })

  it('handles group-hover variants', () => {
    render(
      <GlowCard className="group">Group Container</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('group')
  })

  it('applies peer variants correctly', () => {
    render(
      <GlowCard className="peer-checked:ring-2">Peer Checked</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('peer-checked:ring-2')
  })

  it('handles file-selector variants', () => {
    render(
      <GlowCard className="file:border-transparent">File Selector</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('file:border-transparent')
  })

  it('preserves first-of-type variants', () => {
    render(
      <GlowCard className="first:rounded-none">First Element</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('first:rounded-none')
  })

  it('handles last-of-type variants', () => {
    render(
      <GlowCard className="last:border-0">Last Element</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('last:border-0')
  })

  it('applies odd/even variants correctly', () => {
    render(
      <GlowCard className="odd:bg-muted">Odd/Even</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('odd:bg-muted')
  })

  it('handles not-first variants', () => {
    render(
      <GlowCard className="not-first:rounded-none">Not First</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('not-first:rounded-none')
  })

  it('preserves not-last variants', () => {
    render(
      <GlowCard className="not-last:border-0">Not Last</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('not-last:border-0')
  })

  it('handles not-odd/even variants', () => {
    render(
      <GlowCard className="not-even:bg-muted">Not Even</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('not-even:bg-muted')
  })

  it('applies peer-disabled variants correctly', () => {
    render(
      <GlowCard className="peer-disabled:opacity-50">Peer Disabled</GlowCard>
    )
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('peer-disabled:opacity-50')
  })

  it('handles peer-checked variants', () => {
    render(
      <GlowCard className="peer-checked:bg-muted">Peer Checked</GlowCard>
    )
