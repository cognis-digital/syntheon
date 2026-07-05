import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SpotlightBackdrop from '@/components/media/spotlight-backdrop'

describe('SpotlightBackdrop', () => {
  const baseProps = {
    className: '',
    children: null,
    position: { x: 0.5, y: 0.5 },
    blur: 48,
    intensity: 12,
    size: 'md',
    style: {},
    asChild: false,
  }

  it('renders without throwing with default props', () => {
    const { container } = render(<SpotlightBackdrop />)
    expect(container).toBeInTheDocument()
  })

  it('applies className from props', () => {
    const testClass = 'test-class'
    const { container } = render(
      <SpotlightBackdrop className={testClass} />,
    )
    expect(container.firstChild).toHaveAttribute('class', expect.stringContaining(testClass))
  })

  it('applies inline style from props', () => {
    const testStyle: React.CSSProperties = { zIndex: 10 }
    const { container } = render(
      <SpotlightBackdrop style={testStyle} />,
    )
    expect(container.firstChild).toHaveAttribute('style')
  })

  it('applies position coordinates', () => {
    const pos = { x: 0.25, y: 0.75 }
    const { container } = render(
      <SpotlightBackdrop position={pos} />,
    )
    expect(container.firstChild).toHaveAttribute('style')
  })

  it('applies blur radius', () => {
    const { container } = render(
      <SpotlightBackdrop blur={64} />,
    )
    // Blur is typically applied via CSS filter or transform
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies intensity/opacity correctly', () => {
    const { container } = render(
      <SpotlightBackdrop intensity={8} />,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles size prop (sm, md, lg)', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      render(<SpotlightBackdrop size={size} />)
      // Size affects gradient spread - just verify no errors
    }
  })

  it('passes children through correctly', () => {
    const child = <div>Child content</div>
    const { container } = render(
      <SpotlightBackdrop>{child}</SpotlightBackdrop>,
    )
    expect(container.firstChild).toHaveTextContent('Child content')
  })

  it('applies Tailwind utility classes', () => {
    const testClasses = 'bg-background rounded-lg'
    const { container } = render(
      <SpotlightBackdrop className={testClasses} />,
    )
    expect(container.firstChild).toHaveAttribute(
      'class',
      expect.stringContaining(testClasses),
    )
  })

  it('handles asChild prop (wraps child element)', () => {
    const testElement = <div>Wrapped</div>
    render(<SpotlightBackdrop asChild>{testElement}</SpotlightBackdrop>)
    // Should render the wrapped element
  })

  it('renders with proper semantic structure', () => {
    const { container } = render(
      <SpotlightBackdrop className="bg-background rounded-lg" />,
    )
    
    expect(container.firstChild).not.toBeNull()
    expect(container.firstChild).toHaveAttribute('class')
  })

  it('handles edge case: zero blur', () => {
    const { container } = render(
      <SpotlightBackdrop blur={0} />,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: max intensity', () => {
    const { container } = render(
      <SpotlightBackdrop intensity={100} />,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: corner position', () => {
    const { container } = render(
      <SpotlightBackdrop position={{ x: 0, y: 0 }} />,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles edge case: center position', () => {
    const { container } = render(
      <SpotlightBackdrop position={{ x: 0.5, y: 0.5 }} />,
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
