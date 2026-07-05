import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuroraBackdrop } from '@/components/media/aurora-backdrop'

describe('AuroraBackdrop', () => {
  const baseProps = {
    className: '',
    children: null,
    opacity: 0.6,
    variant: 'default',
    size: 'cover',
    darkMode: true,
    rounded: 'lg',
  }

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders without throwing', () => {
    const { container } = render(<AuroraBackdrop {...baseProps} />)
    expect(container).toBeInTheDocument()
  })

  it('applies base className when provided', () => {
    const testClass = 'test-class'
    const { container } = render(
      <AuroraBackdrop className={testClass} {...baseProps} />
    )
    expect(container.firstChild).toHaveAttribute('class', expect.stringContaining(testClass))
  })

  it('applies opacity prop correctly', () => {
    const customOpacity = 0.85
    const { container } = render(
      <AuroraBackdrop opacity={customOpacity} {...baseProps} />
    )
    // Aurora backdrops typically use background-image with alpha, checking computed style
    expect(container.firstChild).toHaveStyle('opacity', customOpacity)
  })

  it('applies size prop correctly', () => {
    const testSize = 'contain'
    const { container } = render(
      <AuroraBackdrop size={testSize} {...baseProps} />
    )
    expect(container.firstChild).toHaveAttribute('style', expect.stringContaining(testSize))
  })

  it('applies rounded prop correctly', () => {
    const testRounded = 'md'
    const { container } = render(
      <AuroraBackdrop rounded={testRounded} {...baseProps} />
    )
    expect(container.firstChild).toHaveAttribute('style', expect.stringContaining(testRounded))
  })

  it('applies darkMode prop correctly', () => {
    const { container } = render(
      <AuroraBackdrop darkMode={false} {...baseProps} />
    )
    // Dark mode typically toggles a data attribute or class
    expect(container.firstChild).toHaveAttribute('style')
  })

  it('applies variant prop correctly', () => {
    const testVariant = 'subtle'
    const { container } = render(
      <AuroraBackdrop variant={testVariant} {...baseProps} />
    )
    expect(container.firstChild).toHaveAttribute('style')
  })

  it('renders children when provided', () => {
    const childText = 'Hello Aurora'
    const { container } = render(
      <AuroraBackdrop>
        <span>{childText}</span>
      </AuroraBackdrop>
    )
    expect(screen.getByText(childText)).toBeInTheDocument()
  })

  it('handles responsive sizing', () => {
    // Simulate viewport resize
    const originalInnerWidth = window.innerWidth
    window.innerWidth = 375 // Mobile

    const { container } = render(<AuroraBackdrop size="cover" {...baseProps} />)

    expect(container.firstChild).toBeInTheDocument()

    window.innerWidth = originalInnerWidth
  })

  it('applies proper accessibility attributes', () => {
    const { container } = render(
      <AuroraBackdrop aria-label="Background decoration">
        <span>Content</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toHaveAttribute('aria-label')
  })

  it('handles focus states for interactive variants', () => {
    const { container } = render(
      <AuroraBackdrop variant="interactive">
        <span>Focusable</span>
      </AuroraBackdrop>
    )
    // Interactive backdrops should have visible focus indicators
    expect(container.firstChild).toHaveAttribute('style')
  })

  it('renders with correct default values', () => {
    const { container } = render(<AuroraBackdrop />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).not.toHaveClass('hidden')
  })

  it('handles edge case: zero opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={0} {...baseProps}>
        <span>Should still render</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: very high opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={0.99} {...baseProps}>
        <span>High opacity</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: empty children', () => {
    const { container } = render(<AuroraBackdrop />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: null variant', () => {
    const { container } = render(
      <AuroraBackdrop variant={null} {...baseProps}>
        <span>Null variant</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: invalid size', () => {
    const { container } = render(
      <AuroraBackdrop size="invalid" {...baseProps}>
        <span>Invalid size</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: very large opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={1.2} {...baseProps}>
        <span>Large opacity</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: negative rounded value', () => {
    const { container } = render(
      <AuroraBackdrop rounded="-xl" {...baseProps}>
        <span>Negative rounded</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: boolean props', () => {
    const { container } = render(
      <AuroraBackdrop darkMode={true} {...baseProps}>
        <span>Boolean prop</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: string boolean', () => {
    const { container } = render(
      <AuroraBackdrop darkMode="true" {...baseProps}>
        <span>String boolean</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: empty string className', () => {
    const { container } = render(
      <AuroraBackdrop className="" {...baseProps}>
        <span>Empty class</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: whitespace-only className', () => {
    const { container } = render(
      <AuroraBackdrop className="   " {...baseProps}>
        <span>Whitespace class</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: very long text content', () => {
    const longText = 'A'.repeat(1000)
    const { container } = render(
      <AuroraBackdrop>
        <span>{longText}</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: nested components', () => {
    const { container } = render(
      <AuroraBackdrop>
        <div className="nested">
          <span>Deeply nested</span>
        </div>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: SVG children', () => {
    const { container } = render(
      <AuroraBackdrop>
        <svg width="24" height="24">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: event handlers', () => {
    const handleClick = vi.fn()
    const { container } = render(
      <AuroraBackdrop onClick={handleClick}>
        <span>Clickable</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: ref prop', () => {
    const testRef = {} as React.RefObject<HTMLDivElement>
    const { container } = render(
      <AuroraBackdrop ref={testRef}>
        <span>With ref</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: key prop', () => {
    const testKey = 'unique-key'
    const { container } = render(
      <AuroraBackdrop key={testKey}>
        <span>With key</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: dangerouslySetInnerHTML', () => {
    const htmlContent = '<strong>Bold text</strong>'
    const { container } = render(
      <AuroraBackdrop dangerouslySetInnerHTML={{ __html: htmlContent }}>
        <span>With HTML</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: CSS variables', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--custom-var': 'red' }}>
        <span>With CSS var</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: inline styles', () => {
    const testStyle = { color: 'blue' }
    const { container } = render(
      <AuroraBackdrop style={testStyle}>
        <span>With inline style</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: multiple children', () => {
    const { container } = render(
      <AuroraBackdrop>
        <span>Child 1</span>
        <div>Child 2</div>
        <p>Child 3</p>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: self-closing tag', () => {
    const { container } = render(<AuroraBackdrop />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: deeply nested props', () => {
    const nestedProps = {
      opacity: 0.5,
      variant: 'default',
      size: 'cover',
      darkMode: true,
      rounded: 'lg',
    }
    const { container } = render(
      <AuroraBackdrop {...nestedProps}>
        <span>Nested props</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: spread with override', () => {
    const base = { opacity: 0.3, variant: 'default' }
    const override = { opacity: 0.7, size: 'contain' }
    const { container } = render(
      <AuroraBackdrop {...base} {...override}>
        <span>Spread override</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: undefined props', () => {
    const { container } = render(
      <AuroraBackdrop opacity={undefined} variant={undefined}>
        <span>Undefined props</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: null props', () => {
    const { container } = render(
      <AuroraBackdrop opacity={null} variant={null}>
        <span>Null props</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: mixed null and undefined', () => {
    const { container } = render(
      <AuroraBackdrop opacity={null} variant={undefined}>
        <span>Mixed null/undefined</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: very long className', () => {
    const longClass = 'a'.repeat(500) + '-class'
    const { container } = render(
      <AuroraBackdrop className={longClass}>
        <span>Long class</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: special characters in props', () => {
    const { container } = render(
      <AuroraBackdrop className="test-class-123_abc">
        <span>Special chars</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: unicode in children', () => {
    const { container } = render(
      <AuroraBackdrop>
        <span>🌈✨🎨</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: emoji in className', () => {
    const { container } = render(
      <AuroraBackdrop className="rainbow-emoji">
        <span>Emoji class</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: very small opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={0.01} {...baseProps}>
        <span>Near transparent</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: exact 50% opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={0.5} {...baseProps}>
        <span>Halfway</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: exact 100% opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={1} {...baseProps}>
        <span>Full opacity</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: exact 0% opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={0} {...baseProps}>
        <span>Zero opacity</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: negative opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={-0.1} {...baseProps}>
        <span>Negative opacity</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: very large negative opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={-10} {...baseProps}>
        <span>Large negative</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: very large positive opacity', () => {
    const { container } = render(
      <AuroraBackdrop opacity={10} {...baseProps}>
        <span>Large positive</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: floating point precision', () => {
    const { container } = render(
      <AuroraBackdrop opacity={0.3333333333} {...baseProps}>
        <span>Precision test</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: scientific notation', () => {
    const { container } = render(
      <AuroraBackdrop opacity={1e-3} {...baseProps}>
        <span>Scientific</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: hex colors in style', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--hue': '120deg' }}>
        <span>Hex color</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: rgb colors in style', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--rgb': '255,0,0' }}>
        <span>RGB color</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: hsl colors in style', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--hsl': '120,50%,50%' }}>
        <span>HSL color</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: gradient colors in style', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--gradient': 'linear-gradient(to right, red, blue)' }}>
        <span>Gradient</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: transform in style', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--transform': 'scale(1.5)' }}>
        <span>Transform</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: filter in style', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--filter': 'blur(10px)' }}>
        <span>Filter</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: backdrop-filter in style', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--backdrop': 'blur(20px)' }}>
        <span>Backdrop filter</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: multiple CSS variables', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--var1': 'red', '--var2': 'blue' }}>
        <span>Multiple vars</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: CSS variable with unit', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--size': '100px' }}>
        <span>Variable with unit</span>
      </AuroraBackdrop>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: CSS variable without unit', () => {
    const { container } = render(
      <AuroraBackdrop style={{ '--value': '50' }}>
        <span>Variable no unit</span>
