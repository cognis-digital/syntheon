import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogoStrip } from '@/components/sections/logo-strip'

describe('LogoStrip', () => {
  const mockCn = vi.fn()
  vi.mock('@/lib/utils', async (importOriginal) => {
    const actual = await importOriginal()
    return {
      ...actual,
      cn: mockCn as any,
    }
  })

  beforeEach(() => {
    mockCn.mockClear()
  })

  it('renders without crashing', () => {
    render(<LogoStrip />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders with default props correctly', () => {
    const { container } = render(<LogoStrip />)
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('items-center')
  })

  it('applies dark mode classes when in dark theme', async () => {
    document.body.classList.add('dark')
    
    const { container } = render(<LogoStrip />)
    await waitFor(() => {
      expect(container).toHaveClass('dark:')
    })
  })

  it('handles accessibility attributes correctly', () => {
    const { container } = render(
      <LogoStrip aria-label="Company partners" />
    )
    
    expect(screen.getByRole('img')).toHaveAttribute('aria-hidden')
  })

  it('renders multiple logos with proper spacing', () => {
    const { container } = render(<LogoStrip count={5} />)
    expect(container.querySelectorAll('img')).toHaveLength(5)
  })

  it('applies responsive sizing for mobile devices', async () => {
    document.body.style.width = '375px' // iPhone width
    
    const { container } = render(<LogoStrip />)
    await waitFor(() => {
      expect(container).toHaveClass('md:')
    })
  })

  it('handles loading state gracefully', async () => {
    const { container, rerender } = render(
      <LogoStrip isLoading={true} />
    )
    
    expect(screen.getByRole('img')).toHaveAttribute('aria-busy')
    
    rerender(<LogoStrip isLoading={false} />)
    await waitFor(() => {
      expect(screen.getByRole('img')).not.toHaveAttribute('aria-busy')
    })
  })

  it('respects custom dimensions when provided', () => {
    const { container } = render(
      <LogoStrip width={120} height={40} />
    )
    
    expect(container).toHaveStyle({
      '--logo-width': '120px',
      '--logo-height': '40px',
    })
  })

  it('applies custom theme overrides correctly', () => {
    const { container } = render(
      <LogoStrip 
        className="gap-8 py-6" 
        variant="outlined" 
      />
    )
    
    expect(container).toHaveClass('gap-8')
    expect(container).toHaveClass('py-6')
  })

  it('maintains proper contrast ratios in dark mode', async () => {
    document.body.classList.add('dark')
    
    const { container } = render(<LogoStrip />)
    await waitFor(() => {
      expect(container).toHaveStyle({
        '--logo-opacity': '0.85',
      })
    })
  })

  it('handles empty state gracefully', () => {
    const { container } = render(
      <LogoStrip count={0} />
    )
    
    expect(container).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('applies smooth transitions for hover effects', async () => {
    document.body.style.width = '1200px' // Desktop width
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('transition')
    })
  })

  it('supports custom logo URLs with fallback', () => {
    const { container } = render(
      <LogoStrip 
        logos={[
          'https://example.com/logo1.png',
          'https://example.com/logo2.svg',
        ]}
      />
    )
    
    expect(container.querySelectorAll('img')).toHaveLength(2)
  })

  it('respects prefers-reduced-motion media query', async () => {
    document.body.style.setProperty(
      '--has-reduced-motion',
      'true'
    )
    
    const { container } = render(<LogoStrip />)
    await waitFor(() => {
      expect(container).toHaveClass('duration-300')
    })
  })

  it('handles keyboard navigation correctly', () => {
    const { container, rerender } = render(
      <LogoStrip 
        interactive={true}
        onLogoClick={() => {}}
      />
    )
    
    expect(screen.getByRole('img')).toHaveAttribute('tabIndex')
    
    rerender(<LogoStrip interactive={false} />)
    await waitFor(() => {
      expect(screen.queryByRole('img')).not.toHaveAttribute('tabIndex')
    })
  })

  it('applies proper border radius for consistency', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveClass('rounded-lg')
  })

  it('maintains consistent spacing across different viewports', async () => {
    document.body.style.width = '768px' // Tablet width
    
    const { container } = render(<LogoStrip />)
    await waitFor(() => {
      expect(container).toHaveClass('lg:')
    })
  })

  it('handles error state for broken images', async () => {
    const { container, rerender } = render(
      <LogoStrip 
        onError={(e: any) => console.error(e)}
      />
    )
    
    expect(container).toHaveAttribute('onError')
    
    rerender(<LogoStrip />)
    await waitFor(() => {
      expect(container).not.toHaveAttribute('onError')
    })
  })

  it('applies proper z-index for layering', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveStyle({
      'zIndex': '10',
    })
  })

  it('supports custom animation duration', async () => {
    document.body.style.width = '1920px' // Large desktop
    
    const { container } = render(<LogoStrip />)
    await waitFor(() => {
      expect(container).toHaveClass('duration-500')
    })
  })

  it('handles responsive image loading', async () => {
    document.body.style.width = '414px' // iPhone Plus
    
    const { container } = render(<LogoStrip />)
    await waitFor(() => {
      expect(container).toHaveClass('loading')
    })
  })

  it('applies proper font metrics for logo text', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        fontSize="sm"
      />
    )
    
    expect(container).toHaveStyle({
      'font-size': '0.875rem',
    })
  })

  it('maintains proper aspect ratio for logos', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveStyle({
      '--logo-aspect-ratio': '16/9',
    })
  })

  it('handles custom cursor interaction', async () => {
    document.body.style.width = '800px' // Small desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('cursor-pointer')
    })
  })

  it('applies proper shadow depth for visual hierarchy', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveStyle({
      'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
    })
  })

  it('supports custom gradient overlays', async () => {
    document.body.style.width = '1600px' // Large desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('gradient-overlay')
    })
  })

  it('handles custom font family for logos', () => {
    const { container } = render(
      <LogoStrip 
        fontFamily="sans"
        fontWeight="medium"
      />
    )
    
    expect(container).toHaveStyle({
      'font-family': '"Inter", sans-serif',
    })
  })

  it('applies proper line-height for logo text', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        lineHeight="tight"
      />
    )
    
    expect(container).toHaveStyle({
      'line-height': '1.25rem',
    })
  })

  it('handles custom text transform for logos', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        textTransform="uppercase"
      />
    )
    
    expect(container).toHaveStyle({
      'text-transform': 'uppercase',
    })
  })

  it('applies proper letter-spacing for logo text', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        letterSpacing="wide"
      />
    )
    
    expect(container).toHaveStyle({
      'letter-spacing': '0.1em',
    })
  })

  it('handles custom background for logo container', () => {
    const { container } = render(
      <LogoStrip 
        backgroundColor="white"
        opacity={0.95}
      />
    )
    
    expect(container).toHaveStyle({
      'background-color': '#ffffff',
    })
  })

  it('applies proper overflow handling for logo images', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveClass('overflow-hidden')
  })

  it('supports custom max-width for responsive logos', async () => {
    document.body.style.width = '1400px' // Medium desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('max-w-full')
    })
  })

  it('handles custom min-height for logo containers', () => {
    const { container } = render(
      <LogoStrip 
        minHeight={60}
        maxHeight={80}
      />
    )
    
    expect(container).toHaveStyle({
      'minHeight': '60px',
    })
  })

  it('applies proper text shadow for logo readability', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        textShadow="medium"
      />
    )
    
    expect(container).toHaveStyle({
      'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.3)',
    })
  })

  it('handles custom border styling for logo container', () => {
    const { container } = render(
      <LogoStrip 
        borderColor="gray"
        borderWidth={1}
      />
    )
    
    expect(container).toHaveStyle({
      'border-color': '#e5e7eb',
    })
  })

  it('applies proper transition timing for logo interactions', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveClass('transition-all')
  })

  it('supports custom easing functions for animations', async () => {
    document.body.style.width = '1024px' // Laptop width
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('ease-in-out')
    })
  })

  it('handles custom padding for logo containers', () => {
    const { container } = render(
      <LogoStrip 
        padding="tight"
        gap="medium"
      />
    )
    
    expect(container).toHaveStyle({
      'padding': '0.5rem',
    })
  })

  it('applies proper margin for logo spacing', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveClass('m-0')
  })

  it('supports custom opacity for logo images', async () => {
    document.body.style.width = '1280px' // Large laptop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('opacity-90')
    })
  })

  it('handles custom filter effects for logo images', () => {
    const { container } = render(
      <LogoStrip 
        blur={2}
        grayscale={0.1}
      />
    )
    
    expect(container).toHaveStyle({
      'filter': 'blur(2px) grayscale(10%)',
    })
  })

  it('applies proper transform for logo positioning', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveClass('transform')
  })

  it('supports custom scale for logo images', async () => {
    document.body.style.width = '1536px' // Extra large desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('scale-100')
    })
  })

  it('handles custom rotate for logo images', () => {
    const { container } = render(
      <LogoStrip 
        rotate={5}
        skewX={2}
      />
    )
    
    expect(container).toHaveStyle({
      'transform': 'rotate(5deg) skewX(2deg)',
    })
  })

  it('applies proper zIndex for logo layering', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveStyle({
      'zIndex': '10',
    })
  })

  it('supports custom pointer events for interactive logos', async () => {
    document.body.style.width = '960px' // Medium laptop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('pointer-events-none')
    })
  })

  it('handles custom cursor for interactive logos', () => {
    const { container } = render(
      <LogoStrip 
        cursor="zoom-in"
        hoverEffect={true}
      />
    )
    
    expect(container).toHaveStyle({
      'cursor': 'zoom-in',
    })
  })

  it('applies proper selection styling for logo text', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        selectable={false}
      />
    )
    
    expect(container).toHaveStyle({
      'user-select': 'none',
    })
  })

  it('supports custom font weight for logo text', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        fontWeight="bold"
      />
    )
    
    expect(container).toHaveStyle({
      'font-weight': '700',
    })
  })

  it('handles custom font size for logo text', async () => {
    document.body.style.width = '1680px' // Extra large desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('text-xl')
    })
  })

  it('applies proper text decoration for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        textDecoration="underline"
      />
    )
    
    expect(container).toHaveStyle({
      'text-decoration': 'underline',
    })
  })

  it('supports custom text color for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        textColor="primary"
      />
    )
    
    expect(container).toHaveStyle({
      'color': '#7c3aed',
    })
  })

  it('handles custom text alignment for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        textAlign="center"
      />
    )
    
    expect(container).toHaveStyle({
      'text-align': 'center',
    })
  })

  it('applies proper text overflow handling for logo images', () => {
    const { container } = render(<LogoStrip />)
    
    expect(container).toHaveClass('truncate')
  })

  it('supports custom line height for logo images', async () => {
    document.body.style.width = '1840px' // Ultra wide desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('leading-tight')
    })
  })

  it('handles custom text wrapping for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        wrap="nowrap"
      />
    )
    
    expect(container).toHaveStyle({
      'white-space': 'nowrap',
    })
  })

  it('applies proper text case for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        case="uppercase"
      />
    )
    
    expect(container).toHaveStyle({
      'text-transform': 'uppercase',
    })
  })

  it('supports custom text shadow for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        textShadow="large"
      />
    )
    
    expect(container).toHaveStyle({
      'text-shadow': '0 4px 6px rgba(0, 0, 0, 0.15)',
    })
  })

  it('handles custom letter spacing for logo images', async () => {
    document.body.style.width = '2000px' // Ultra wide desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('tracking-wider')
    })
  })

  it('applies proper text indent for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        indent="tight"
      />
    )
    
    expect(container).toHaveStyle({
      'text-indent': '0.25em',
    })
  })

  it('supports custom text opacity for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        opacity={0.8}
      />
    )
    
    expect(container).toHaveStyle({
      'opacity': '0.8',
    })
  })

  it('handles custom text blur for logo images', async () => {
    document.body.style.width = '2160px' // Ultra wide desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
      expect(container).toHaveClass('blur-sm')
    })
  })

  it('applies proper text gradient for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        gradient="linear"
      />
    )
    
    expect(container).toHaveStyle({
      'background-image': 'linear-gradient(...)',
    })
  })

  it('supports custom text background for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        bg="solid"
      />
    )
    
    expect(container).toHaveStyle({
      'background-color': '#f9fafb',
    })
  })

  it('handles custom text border for logo images', () => {
    const { container } = render(
      <LogoStrip 
        withText={true}
        border="thin"
      />
    )
    
    expect(container).toHaveStyle({
      'border-width': '1px',
    })
  })

  it('applies proper text outline for logo images', async () => {
    document.body.style.width = '2320px' // Ultra wide desktop
    
    const { container } = render(<LogoStrip />)
    
    await waitFor(() => {
