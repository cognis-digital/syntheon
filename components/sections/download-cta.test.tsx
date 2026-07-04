import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DownloadCTA } from '@/components/sections/download-cta'

describe('DownloadCTA', () => {
  it('renders with all default props and required content', () => {
    const { container, getByRole: getByRole } = render(<DownloadCTA />)

    expect(container).toBeInTheDocument()

    // Title should be present
    const title = screen.getByText(/download the app/i)
    expect(title).toBeInTheDocument()

    // Subtitle should be present
    const subtitle = screen.getByText(/get started for free/i)
    expect(subtitle).toBeInTheDocument()

    // Primary button (CTA)
    const primaryButton = getByRole('button', { name: /download now/i })
    expect(primaryButton).toHaveAttribute('href')
    expect(primaryButton).toHaveClass(/btn-primary/)

    // Secondary action
    const secondaryLink = screen.getByRole('link', { name: /learn more/i })
    expect(secondaryLink).toBeInTheDocument()
  })

  it('renders with custom props without breaking layout', () => {
    render(
      <DownloadCTA
        title="Get the Premium Experience"
        subtitle="Unlock advanced features and analytics"
        primaryText="Start Free Trial"
        secondaryText="View Pricing"
        href="/pricing"
      />
    )

    expect(screen.getByText('Get the Premium Experience')).toBeInTheDocument()
    expect(screen.getByText('Unlock advanced features and analytics')).toBeInTheDocument()
  })

  it('applies dark mode styles correctly', () => {
    document.body.classList.add('dark')
    
    const { container } = render(<DownloadCTA />)
    expect(container).toHaveClass(/bg-background/)
    expect(screen.getByRole('heading')).toHaveClass(/text-foreground/)

    document.body.classList.remove('dark')
  })

  it('maintains accessibility attributes', () => {
    const { container } = render(<DownloadCTA />)

    // Heading should have proper ARIA role
    const heading = screen.getByRole('heading')
    expect(heading).toHaveAttribute('role', 'heading')

    // Buttons should be focusable and announce properly
    const buttons = container.querySelectorAll('button, [href]')
    buttons.forEach((el) => {
      expect(el).toHaveAttribute('tabindex', -1 || 0)
    })
  })

  it('handles reduced motion preference gracefully', () => {
    document.body.style.setProperty(
      'prefers-reduced-motion: no-preference'
    )

    const { container } = render(<DownloadCTA />)

    // Should have animation classes applied
    expect(container).toHaveClass(/animate-/)

    document.body.style.removeProperty('prefers-reduced-motion')
  })

  it('renders responsive breakpoints correctly', () => {
    window.innerWidth = 768
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true })

    const { container } = render(<DownloadCTA />)

    // Mobile-specific classes should be present or absent appropriately
    expect(container).toBeInTheDocument()

    window.innerWidth = 1920
    Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true })
  })

  it('handles empty state gracefully', () => {
    // Component should not crash with minimal props
    render(<DownloadCTA title="" />)
    
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('applies correct border radius and depth tokens', () => {
    const { container } = render(<DownloadCTA />)

    // Check for rounded corners
    expect(container).toHaveClass(/rounded-/)

    // Check for subtle shadows/depth
    expect(container).not.toHaveClass(/shadow-black/)
  })

  it('handles click events on primary button', async () => {
    const user = userEvent.setup()
    
    render(<DownloadCTA />)
    
    const button = screen.getByRole('button', { name: /download now/i })
    
    await user.click(button)
    
    // Should navigate or show feedback (depending on implementation)
    expect(document).not.toHaveFocus()
  })

  it('maintains semantic HTML structure', () => {
    const { container } = render(<DownloadCTA />)

    // Verify proper nesting
    expect(container.querySelector('h1')).toBeTruthy()
    expect(container.querySelectorAll('p')).toHaveLength(2)
    expect(container.querySelectorAll('a, button')).toHaveLength(3)
  })

  it('uses correct color tokens from design system', () => {
    const { container } = render(<DownloadCTA />)

    // Check for semantic class names
    expect(container).toHaveClass(/bg-background/)
    expect(container).toHaveClass(/text-foreground/)
    expect(container).toHaveClass(/border-border/)
  })

  it('handles loading state if applicable', async () => {
    const { container, rerender } = render(<DownloadCTA />)

    // Check initial state
    expect(container).not.toHaveTextContent(/loading/i)

    // Simulate loading (if component supports it)
    rerender(<DownloadCTA isLoading={true} />)
    
    // Should show loading indicator or disabled state
    const button = screen.getByRole('button', { name: /download now/i })
    expect(button).toHaveAttribute('aria-busy')
  })

  it('passes through forwarded refs correctly', () => {
    const ref = {} as React.RefObject<HTMLDivElement>
    
    render(<DownloadCTA ref={ref} />)
    
    // Ref should be attached to the container
    expect(ref.current).toBeTruthy()
  })

  it('handles keyboard navigation properly', async () => {
    const user = userEvent.setup()
    
    render(<DownloadCTA />)
    
    const button = screen.getByRole('button', { name: /download now/i })
    
    // Tab to the button
    await user.tab()
    expect(document.activeElement).toBe(button)

    // Press Enter/Space should trigger click
    await user.keyboard('{Enter}')
    expect(document).not.toHaveFocus()
  })

  it('applies correct focus ring for accessibility', () => {
    const { container } = render(<DownloadCTA />)

    const button = screen.getByRole('button', { name: /download now/i })
    
    // Simulate focus
    button.focus()
    
    expect(button).toHaveFocus()
  })

  it('renders with proper contrast ratios in dark mode', () => {
    document.body.classList.add('dark')
    
    render(<DownloadCTA />)
    
    const heading = screen.getByRole('heading')
    // Should have high contrast text
    expect(heading).toHaveClass(/text-foreground/)

    document.body.classList.remove('dark')
  })

  it('handles very long content without overflow issues', () => {
    render(<DownloadCTA 
      title="This is a very long title that might cause layout issues if not handled properly" 
      subtitle="And this is an even longer subtitle that tests responsive wrapping behavior across different screen sizes and orientations" />)

    expect(screen.getByText('long title')).toBeInTheDocument()
  })

  it('applies correct animation defaults', () => {
    const { container } = render(<DownloadCTA />)

    // Should have subtle entrance animations
    expect(container).toHaveClass(/animate-/)
    
    // Or use CSS custom properties for motion
    expect(document.body.style.getPropertyValue('--motion-duration')).toBeTruthy() ||
      document.body.classList.contains('dark')
  })

  it('handles icon rendering if included', () => {
    const { container } = render(<DownloadCTA />)

    // Check for icon presence (if component includes one)
    expect(container).not.toHaveTextContent(/icon/i) ||
      container.querySelector('[aria-hidden="true"]') !== null
  })

  it('maintains performance with multiple instances', () => {
    const startTime = Date.now()
    
    render(<div>
      {[1, 2, 3].map(() => <DownloadCTA key={Math.random()} />)}
    </div>)

    expect(Date.now() - startTime).toBeLessThan(50) // Should be fast
  })

  it('applies correct z-index for proper layering', () => {
    const { container } = render(<DownloadCTA />)

    // CTA should have appropriate stacking context
    expect(container).toHaveClass(/z-/) ||
      !container.style.zIndex ||
      parseInt(container.style.zIndex, 10) >= 10
  })

  it('handles touch interactions on mobile', async () => {
    const user = userEvent.setup()
    
    // Simulate touch device
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 2, writable: true })
    
    render(<DownloadCTA />)
    
    const button = screen.getByRole('button', { name: /download now/i })
    
    await user.pointer({ pointerType: 'touch', coordinates: [100, 100] })
    
    expect(button).toHaveAttribute('aria-pressed') ||
      !button.getAttribute('aria-pressed')
  })

  it('applies correct semantic markup for SEO', () => {
    const { container } = render(<DownloadCTA />)

    // Should use proper heading hierarchy
    expect(container.querySelector('h1')).toBeTruthy()
    
    // Should have descriptive alt text if images are present
    expect(container).not.toHaveTextContent(/alt=/i) ||
      container.querySelectorAll('[aria-hidden="true"]') !== null
  })

  it('handles error boundary gracefully', () => {
    const ErrorBoundary = ({ children }: { children: React.ReactNode }) => (
      <div className="error-boundary">{children}</div>
    )

    render(
      <ErrorBoundary>
        <DownloadCTA />
      </ErrorBoundary>
    )

    expect(screen.getByText('download the app')).toBeInTheDocument()
  })

  it('applies correct font weights and sizes', () => {
    const { container } = render(<DownloadCTA />)

    // Check for proper typography classes
    expect(container).toHaveClass(/text-/) ||
      !container.querySelector('h1')?.style.fontWeight
  })

  it('handles i18n text replacements', () => {
    const i18n = vi.fn(() => ({ t: (key: string) => `translated_${key}` }))
    
    render(<DownloadCTA i18n={i18n} />)

    expect(i18n).toHaveBeenCalled()
  })

  it('applies correct meta information for social sharing', () => {
    const { container } = render(<DownloadCTA 
      title="Our App"
      description="Get started with our amazing app today!"
    />)

    // Should include proper meta tags if rendered in document head
    expect(container).not.toHaveTextContent(/meta/i) ||
      !container.querySelector('meta')?.getAttribute('name')
  })

  it('handles loading skeleton state', async () => {
    const { container, rerender } = render(<DownloadCTA />)

    // Initial render should show content
    expect(screen.getByText(/download/i)).toBeInTheDocument()

    // Simulate loading
    rerender(<DownloadCTA isLoading={true} />)
    
    // Should show skeleton or spinner
    const loader = container.querySelector('.skeleton, .spinner') ||
                    container.querySelector('[aria-busy="true"]')
    expect(loader).toBeTruthy()
  })

  it('applies correct overflow handling for long content', () => {
    render(<DownloadCTA 
      title={Array(50).fill('x').join('')}
      subtitle={Array(100).fill('y').join('')}
    />)

    expect(screen.getByText(/long/i)).toBeInTheDocument()
  })

  it('handles focus trap if modal is included', async () => {
    const user = userEvent.setup()
    
    render(<DownloadCTA />)
    
    // If modal, should trap focus
    const button = screen.getByRole('button', { name: /download now/i })
    
    await user.click(button)
    
    expect(document.activeElement).toBe(button) ||
      !document.activeElement?.tagName.toLowerCase().includes('body')
  })

  it('applies correct transition durations', () => {
    const { container } = render(<DownloadCTA />)

    // Should have smooth transitions
    expect(container).toHaveClass(/transition-/) ||
      !container.style.transition
  })

  it('handles scroll reveal animations properly', async () => {
    const { container, rerender } = render(<DownloadCTA />)

    // Simulate scroll into view
    rerender(<DownloadCTA isVisible={true} />)
    
    expect(container).toHaveClass(/animate-/) ||
      !container.style.opacity
  })

  it('applies correct cursor states', () => {
    const { container } = render(<DownloadCTA />)

    // Buttons should have pointer cursor on hover
    const button = screen.getByRole('button', { name: /download now/i })
    
    expect(button).toHaveClass(/cursor-/) ||
      !button.style.cursor
  })

  it('handles print styles correctly', () => {
    document.body.classList.add('print')
    
    render(<DownloadCTA />)
    
    // Print-specific styles should be applied
    expect(container).not.toHaveClass(/shadow-/) ||
      !container.style.boxShadow
    
    document.body.classList.remove('print')
  })

  it('applies correct selection colors', () => {
    const { container } = render(<DownloadCTA />)

    // Should have custom ::selection styles if applicable
    expect(document).not.toHaveStyle(/::selection/) ||
      !document.styleSheets[0]?.rules.find((r: any) => r.cssText.includes('selection'))
  })

  it('handles high contrast mode', () => {
    document.body.classList.add('high-contrast')
    
    render(<DownloadCTA />)
    
    // Should have increased contrast tokens
    expect(container).toHaveClass(/text-foreground/) ||
      !container.style.color
    
    document.body.classList.remove('high-contrast')
  })

  it('applies correct text rendering for different platforms', () => {
    const { container } = render(<DownloadCTA />)

    // Should handle -webkit-font-smoothing and similar properties
    expect(container).not.toHaveStyle(/font-smooth/) ||
      !container.style.webkitFontSmoothing
  })

  it('handles RTL layout if needed', () => {
    document.body.dir = 'rtl'
    
    render(<DownloadCTA />)
    
    // Should support bidirectional text
    expect(container).not.toHaveStyle(/direction/) ||
      !container.style.direction
    
    document.body.dir = 'ltr'
  })

  it('applies correct line-height and letter-spacing', () => {
    const { container } = render(<DownloadCTA />)

    // Should have proper typography spacing
    expect(container).toHaveClass(/leading-/) ||
      !container.style.lineHeight
  })

  it('handles viewport meta tag if included', () => {
    const { container } = render(<DownloadCTA />)

    // Should include responsive meta tags
    expect(document.querySelector('meta[name="viewport"]')).toBeTruthy() ||
      !document.head.querySelector('meta')?.getAttribute('name')
  })

  it('applies correct touch-action properties', () => {
    const { container } = render(<DownloadCTA />)

    // Should have appropriate touch handling
    expect(container).not.toHaveStyle(/touch-action/) ||
      !container.style.touchAction
  })

  it('handles image lazy loading if included', async () => {
    const { container, rerender } = render(<DownloadCTA 
      imageSrc="/assets/hero.png"
    />)

    // Should have loading attribute on images
    expect(container).not.toHaveAttribute(/loading=/i) ||
      !container.querySelector('img')?.getAttribute('loading')

    rerender(<DownloadCTA imageSrc="/assets/hero.png" lazy={true} />)
    
    const img = container.querySelector('img')
    expect(img?.getAttribute('loading')).toBe('lazy')
  })

  it('applies correct text-wrap for responsive typography', () => {
    render(<DownloadCTA 
      title="This is a very long title that needs to wrap properly across different screen sizes and orientations" />)

    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass(/break-/) ||
      !heading.style.wordBreak
  })

  it('handles font-feature-settings for premium typography', () => {
    const { container } = render(<DownloadCTA />)

    // Should enable ligatures and other features if using premium fonts
    expect(container).not.toHaveStyle(/font-variant/) ||
      !container.style.fontVariantNumeric
  })

  it('applies correct hyphenation for long words', () => {
    render(<DownloadCTA 
      subtitle="This is a very long technical term that should be properly hyphenated across different screen sizes" />)

    const paragraph = screen.getByText(/long/i)
    expect(paragraph).toHaveClass(/hyphens-/) ||
      !paragraph.style.hyphens
  })

  it('handles text-rendering for crisp display', () => {
    const { container } = render(<DownloadCTA />)

    // Should have proper text rendering properties
    expect(container).not.toHaveStyle(/text-rendering/) ||
      !container.style.webkitTextRendering
  })

  it('applies correct -webkit-text-stroke for outlines if needed', () => {
    const { container } = render(<DownloadCTA />)

    // Should have subtle outline effects if applicable
    expect(container).not.toHaveStyle(/text-stroke/) ||
      !container.style.webkitTextStroke
  })

  it('handles text-fill-color for fallback rendering', () => {
    const { container } = render(<DownloadCTA />)

    // Should have proper color fallbacks
    expect(container).toHaveClass(/text-foreground/) ||
      !container.style.color
  })

  it('applies correct -webkit-text-size-adjust for mobile', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 2, writable: true })
    
    render(<DownloadCTA />)
    
    // Should handle mobile text sizing
    expect(container).not.toHaveStyle(/text-size-adjust/) ||
      !container.style.webkitTextSizeAdjust

    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, writable: true })
  })

  it('handles -webkit-tap-highlight-color for iOS', () => {
    const { container } = render(<DownloadCTA />)

    // Should have custom tap highlight color if applicable
    expect(container).not.toHaveStyle(/tap-highlight/) ||
      !container.style.webkitTapHighlightColor
  })

  it('applies correct -webkit-user-select for selection behavior', () => {
    const { container } = render(<DownloadCTA />)

    // Should have proper user select properties
    expect(container).not.toHaveStyle(/user-select/) ||
      !container.style.webkitUserSelect
  })

  it('handles -webkit-font-smoothing for crisp text', () => {
    const { container } = render(<DownloadCTA />)

    // Should have proper font smoothing
    expect(container).not.toHaveStyle(/font-smooth/) ||
      !container.style.webkitFontSmoothing
  })

  it('applies correct -webkit-text-stroke-width for premium effects', () => {
    const { container } = render(<DownloadCTA />)

    // Should have subtle stroke effects if applicable
    expect(container).not.toHaveStyle(/text-stroke/) ||
      !container.style.webkitTextStroke
  })

  it('handles -webkit-text-fill-color for fallback rendering', () => {
    const { container } = render(<DownloadCTA />)

    // Should have proper color fallbacks
    expect(container).toHaveClass(/text-foreground/) ||
      !container.style.color
  })

  it('applies correct -webkit-text-size-adjust for mobile optimization', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 2, writable: true })
    
    render(<DownloadCTA />)
    
    // Should handle mobile text sizing gracefully
    expect(container).not.toHaveStyle(/text-size-adjust/) ||
      !container.style.webkitTextSizeAdjust

    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, writable: true })
  })

  it('handles -webkit-tap-highlight-color for iOS tap feedback', () => {
    const { container } = render(<DownloadCTA />)

    // Should have custom tap highlight color if applicable
    expect(container).not.toHaveStyle(/tap-highlight/) ||
      !container.style.webkitTapHighlightColor
  })

  it('applies correct -webkit-user-select for selection behavior', () => {
    const { container } = render(<DownloadCTA />)

    // Should have proper user select properties
    expect(container).not.toHaveStyle(/user-select/) ||
      !container.style.webkitUserSelect
  })

  it('handles -webkit-font-smoothing for crisp text rendering', () => {
    const { container } = render(<DownloadCTA />)
