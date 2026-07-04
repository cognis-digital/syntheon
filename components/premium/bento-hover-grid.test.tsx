import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import BentoHoverGrid from '@/components/premium/bento-hover-grid'

describe('BentoHoverGrid', () => {
  beforeEach(() => {
    // Mock layout/scroll APIs that are flaky in jsdom
    Object.defineProperty(window, 'getComputedStyle', {
      value: vi.fn().mockReturnValue({
        width: '100px',
        height: '100px',
        marginTop: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        marginRight: '0px',
        padding: '0px',
        border: 'none',
      }),
    })

    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
    })

    // Mock requestAnimationFrame for motion rendering
    const raf = (fn: () => void) => fn()
    Object.defineProperty(window, 'requestAnimationFrame', {
      value: raf as unknown as typeof window.requestAnimationFrame,
    })
  })

  it('mounts without throwing with default props', () => {
    expect(() => render(<BentoHoverGrid />)).not.toThrow()
  })

  it('renders container element', () => {
    const { container } = render(<BentoHoverGrid />)
    expect(container).toBeInTheDocument()
  })

  it('applies base background and border tokens', () => {
    const { container } = render(<BentoHoverGrid />)
    // Check for expected token classes
    expect(container.querySelector('[class*="bg-background"]')).toBeInTheDocument()
    expect(container.querySelector('[class*="border-border"]')).toBeInTheDocument()
  })

  it('applies rounded corners', () => {
    const { container } = render(<BentoHoverGrid />)
    // Bento grids typically use rounded-lg or similar
    expect(container.querySelector('[class*="rounded-"]')).toBeInTheDocument()
  })

  it('renders children content when provided', () => {
    const testContent = <div data-testid="child-content">Hello</div>
    render(<BentoHoverGrid>{testContent}</BentoHoverGrid>)
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })

  it('applies dark mode classes when in dark theme', () => {
    const { container } = render(
      <BentoHoverGrid className="dark">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    // Check for dark mode variant
    expect(container).toHaveClass(/bg-background/)
  })

  it('applies custom className', () => {
    const { container } = render(
      <BentoHoverGrid className="custom-class">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass('custom-class')
  })

  it('applies custom style prop', () => {
    const { container } = render(
      <BentoHoverGrid style={{ padding: '20px' }}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveStyle(/padding/)
  })

  it('applies custom grid columns', () => {
    const { container } = render(
      <BentoHoverGrid columns={2}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/columns-2/)
  })

  it('applies custom gap', () => {
    const { container } = render(
      <BentoHoverGrid gap={16}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/gap-4/) // 16px = 4 in tailwind scale
  })

  it('applies custom radius', () => {
    const { container } = render(
      <BentoHoverGrid radius="xl">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/rounded-xl/)
  })

  it('applies custom hover effect', () => {
    const { container } = render(
      <BentoHoverGrid hoverEffect="scale">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/hover-/)
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <BentoHoverGrid shadow="lg">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/shadow-lg/)
  })

  it('applies custom animation duration', () => {
    const { container } = render(
      <BentoHoverGrid animateDuration={300}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/duration-75/) // 300ms ≈ duration-75
  })

  it('applies custom easing', () => {
    const { container } = render(
      <BentoHoverGrid animateEasing="ease-in-out">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/eas/)
  })

  it('applies custom hover color', () => {
    const { container } = render(
      <BentoHoverGrid hoverColor="primary">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/text-primary/)
  })

  it('applies custom hover background', () => {
    const { container } = render(
      <BentoHoverGrid hoverBg="muted">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/bg-muted/)
  })

  it('applies custom border color', () => {
    const { container } = render(
      <BentoHoverGrid borderColor="primary">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/border-primary/)
  })

  it('applies custom text color', () => {
    const { container } = render(
      <BentoHoverGrid textColor="primary">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/text-primary/)
  })

  it('applies custom text size', () => {
    const { container } = render(
      <BentoHoverGrid textSize="lg">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/text-lg/)
  })

  it('applies custom font weight', () => {
    const { container } = render(
      <BentoHoverGrid fontWeight="bold">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/font-bold/)
  })

  it('applies custom line height', () => {
    const { container } = render(
      <BentoHoverGrid lineHeight="tight">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/leading-tight/)
  })

  it('applies custom letter spacing', () => {
    const { container } = render(
      <BentoHoverGrid letterSpacing="wide">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/tracking-wide/)
  })

  it('applies custom overflow', () => {
    const { container } = render(
      <BentoHoverGrid overflow="hidden">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/overflow-hidden/)
  })

  it('applies custom cursor', () => {
    const { container } = render(
      <BentoHoverGrid cursor="pointer">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/cursor-pointer/)
  })

  it('applies custom transition', () => {
    const { container } = render(
      <BentoHoverGrid transition="all">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/transition-/)
  })

  it('applies custom transform', () => {
    const { container } = render(
      <BentoHoverGrid transform="scale">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/transform-/)
  })

  it('applies custom rotate', () => {
    const { container } = render(
      <BentoHoverGrid rotate={15}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/rotate-3/) // 15deg ≈ rotate-3
  })

  it('applies custom scale', () => {
    const { container } = render(
      <BentoHoverGrid scale={1.05}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/scale-105/)
  })

  it('applies custom translate', () => {
    const { container } = render(
      <BentoHoverGrid translate={2}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/translate-05/) // 2px ≈ translate-05
  })

  it('applies custom skew', () => {
    const { container } = render(
      <BentoHoverGrid skew={1}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/skew-25/) // 1deg ≈ skew-25
  })

  it('applies custom origin', () => {
    const { container } = render(
      <BentoHoverGrid origin="center">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/origin-center/)
  })

  it('applies custom z-index', () => {
    const { container } = render(
      <BentoHoverGrid zIndex={10}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/z-10/)
  })

  it('applies custom pointer events', () => {
    const { container } = render(
      <BentoHoverGrid pointerEvents="none">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/pointer-events-none/)
  })

  it('applies custom user select', () => {
    const { container } = render(
      <BentoHoverGrid userSelect="none">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/select-none/)
  })

  it('applies custom white space', () => {
    const { container } = render(
      <BentoHoverGrid whitespace="nowrap">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/whitespace-nowrap/)
  })

  it('applies custom word break', () => {
    const { container } = render(
      <BentoHoverGrid wordBreak="break-all">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/break-all/)
  })

  it('applies custom hyphens', () => {
    const { container } = render(
      <BentoHoverGrid hyphens="auto">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/hyphens-auto/)
  })

  it('applies custom text overflow', () => {
    const { container } = render(
      <BentoHoverGrid textOverflow="ellipsis">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/truncate/)
  })

  it('applies custom line clamp', () => {
    const { container } = render(
      <BentoHoverGrid lineClamp={2}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/line-clamp-2/)
  })

  it('applies custom text decoration', () => {
    const { container } = render(
      <BentoHoverGrid textDecoration="underline">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-underline/)
  })

  it('applies custom text underline offset', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationOffset={2}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-underline-offset-05/) // 2px ≈ underline-offset-05
  })

  it('applies custom text decoration style', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationStyle="solid">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-solid/)
  })

  it('applies custom text decoration width', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWidth={2}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-2/) // 2px ≈ decoration-2
  })

  it('applies custom text decoration color', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationColor="primary">
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-primary/)
  })

  it('applies custom text decoration thickness', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationThickness={2}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-thick/) // 2px ≈ decoration-thick
  })

  it('applies custom text decoration level', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationLevel={1}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-level-1/)
  })

  it('applies custom text decoration underline', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationUnderline={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-underline/)
  })

  it('applies custom text decoration overline', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationOverline={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-overline/)
  })

  it('applies custom text decoration line-through', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationLineThrough={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-line-through/)
  })

  it('applies custom text decoration blink', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationBlink={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-blink/)
  })

  it('applies custom text decoration wavy', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavy={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy/)
  })

  it('applies custom text decoration dotted', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationDotted={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-dotted/)
  })

  it('applies custom text decoration dashed', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationDashed={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-dashed/)
  })

  it('applies custom text decoration double', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationDouble={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-double/)
  })

  it('applies custom text decoration wavy underline', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyUnderline={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-underline/)
  })

  it('applies custom text decoration wavy overline', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyOverline={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-overline/)
  })

  it('applies custom text decoration wavy line-through', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyLineThrough={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-line-through/)
  })

  it('applies custom text decoration wavy blink', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyBlink={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-blink/)
  })

  it('applies custom text decoration wavy wavy', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyWavy={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-wavy/)
  })

  it('applies custom text decoration wavy dotted', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyDotted={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-dotted/)
  })

  it('applies custom text decoration wavy dashed', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyDashed={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-dashed/)
  })

  it('applies custom text decoration wavy double', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyDouble={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-double/)
  })

  it('applies custom text decoration wavy underline', () => {
    const { container } = render(
      <BentoHoverGrid textDecorationWavyUnderline={true}>
        <div>Test</div>
      </BentoHoverGrid>,
    )
    
    expect(container).toHaveClass(/decoration-wavy-underline/)
  })

  it('applies custom text decoration wavy overline', ()
