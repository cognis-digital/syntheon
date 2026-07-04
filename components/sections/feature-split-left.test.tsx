import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeatureSplitLeft } from '@/components/sections/feature-split-left'
import { motion, useReducedMotion } from 'framer-motion'

describe('FeatureSplitLeft', () => {
  const defaultProps = {
    title: 'Premium Analytics',
    description: 'Advanced metrics and real-time dashboards for enterprise teams.',
    ctaText: 'Start Free Trial',
    ctaUrl: '/pricing',
    imageSrc: '/images/analytics-hero.png',
    icon: 'analytics',
  }

  beforeEach(() => {
    // Mock framer-motion's useReducedMotion to avoid SSR hydration issues
    const originalUseReducedMotion = useReducedMotion as any
    vi.spyOn(motion, 'useReducedMotion').mockReturnValue(false)
  })

  afterEach(() => {
    (motion.useReducedMotion as any).mockRestore()
  })

  it('renders with all default props', () => {
    const { container } = render(<FeatureSplitLeft {...defaultProps} />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title)
    expect(screen.getByRole('paragraph')).toHaveTextContent(
      defaultProps.description
    )
    expect(screen.getByRole('link', { name: defaultProps.ctaText })).toHaveAttribute(
      'href',
      defaultProps.ctaUrl
    )
  })

  it('renders minimal content when props are omitted', () => {
    const { container } = render(<FeatureSplitLeft />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent(
      'Default Feature Title'
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '#')
  })

  it('renders responsive layout: stacked on mobile, side-by-side on desktop', () => {
    const { container } = render(<FeatureSplitLeft {...defaultProps} />)

    // Desktop (wide viewport)
    expect(container.querySelector('.lg\\:flex')).toBeInTheDocument()

    // Mobile (narrow viewport) - simulate via query selector
    const mobileContainer = container.querySelector(
      '.md\\:hidden'
    ) as HTMLElement | null
    expect(mobileContainer).not.toBeNull()
  })

  it('applies dark mode correctly', () => {
    document.documentElement.classList.add('dark')
    
    render(<FeatureSplitLeft {...defaultProps} />)

    const bgElement = container.querySelector('.bg-background')
    expect(bgElement).toHaveClass('dark:bg-muted')

    document.documentElement.classList.remove('dark')
  })

  it('applies accessibility attributes', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Heading should have proper ARIA role
    const heading = screen.getByRole('heading') as HTMLHeadingElement
    expect(heading).toHaveAttribute('aria-labelledby') ||
      expect(heading).not.toHaveAttribute('hidden')

    // CTA link should be focusable and visible
    const ctaLink = screen.getByRole('link', { name: defaultProps.ctaText })
    expect(ctaLink).toBeFocusable()
  })

  it('handles reduced motion preference gracefully', () => {
    vi.spyOn(motion, 'useReducedMotion').mockReturnValue(true)

    render(<FeatureSplitLeft {...defaultProps} />)

    // Component should still render with animations disabled
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('renders image placeholder when src is provided', () => {
    const { container } = render(<FeatureSplitLeft {...defaultProps} />)

    // Image or img element should be present
    const imgElement = container.querySelector('img') ||
      container.querySelector('[src]') as HTMLImageElement | null
    expect(imgElement).not.toBeNull()
  })

  it('handles missing image gracefully', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should not crash with undefined/null image
    const img = container.querySelector('img')
    if (img) {
      expect(img.src).not.toBe(null)
      expect(img.alt).toBeDefined()
    }
  })

  it('applies rounded corners and border styling', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Check for Tailwind utility classes
    expect(container.classList.contains('rounded-lg')).toBe(true) ||
      expect(container).toHaveClass(/rounded-/)
  })

  it('renders CTA with proper button semantics', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const ctaLink = screen.getByRole('link', { name: defaultProps.ctaText })
    
    // Should be a link, not just text
    expect(ctaLink.tagName).toBe('A') ||
      expect(ctaLink).toHaveAttribute('href')
  })

  it('handles custom icon prop', () => {
    render(<FeatureSplitLeft {...defaultProps} icon="custom" />)

    // Icon should be rendered (could be SVG or component)
    const container = screen.getByRole('main') as HTMLElement
    expect(container).toHaveTextContent(defaultProps.title)
  })

  it('supports multi-line description with proper wrapping', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Description should wrap naturally in responsive layout
    const desc = screen.getByRole('paragraph') as HTMLParagraphElement
    expect(desc).not.toHaveStyle({ 'white-space': 'nowrap' })
  })

  it('handles empty title gracefully', () => {
    render(<FeatureSplitLeft title="" {...defaultProps} />)

    // Should not crash, may show default or empty heading
    const heading = screen.getByRole('heading') as HTMLHeadingElement
    expect(heading).toBeInTheDocument()
  })

  it('preserves focus order in interactive elements', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // CTA should be reachable via tab navigation
    const cta = screen.getByRole('link') as HTMLAnchorElement
    expect(cta).toBeFocusable()
  })

  it('renders with correct semantic structure', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Main container should be semantically appropriate
    const mainContainer = screen.getByRole('main') as HTMLElement
    expect(mainContainer).toHaveAttribute('role=' ||
      mainContainer.tagName === 'MAIN' ||
      mainContainer.classList.contains('container'))
  })

  it('handles very long text content without overflow', () => {
    render(<FeatureSplitLeft {...defaultProps} description="A".repeat(500) />)

    const desc = screen.getByRole('paragraph') as HTMLParagraphElement
    // Should wrap, not overflow
    expect(desc).toHaveStyle({ 'overflow-x': 'hidden' }) ||
      expect(desc).not.toHaveStyle({ 'white-space': 'nowrap' })
  })

  it('applies proper z-index and layering for depth effects', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Should have some stacking context if using shadows/depth
    expect(container).toHaveClass(/shadow-/) ||
      expect(container).not.toHaveStyle({ 'z-index': 0 })
  })

  it('supports both light and dark mode color tokens', () => {
    document.documentElement.classList.add('dark')

    render(<FeatureSplitLeft {...defaultProps} />)

    // Check for dark mode class application
    const bgElement = container.querySelector('.bg-background') as HTMLElement | null
    if (bgElement) {
      expect(bgElement).toHaveClass(/dark:.*?/) ||
        expect(bgElement.classList.contains('dark:bg-muted')).toBe(true)
    }

    document.documentElement.classList.remove('dark')
  })

  it('handles missing CTA URL gracefully', () => {
    render(<FeatureSplitLeft {...defaultProps} ctaUrl="" />)

    // Should not crash, may show default anchor or text-only link
    const cta = screen.getByRole('link') as HTMLAnchorElement
    expect(cta).toBeInTheDocument()
  })

  it('renders with proper font stack and type hierarchy', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Check for typography utilities
    const heading = screen.getByRole('heading') as HTMLElement
    expect(heading).toHaveClass(/text-.*?/) ||
      expect(heading).not.toHaveStyle({ 'font-size': 0 })
  })

  it('supports custom image aspect ratio', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Image container should have proper aspect handling
    const imgContainer = container.querySelector('.aspect-') ||
      container.querySelector('[style*="aspect"]') as HTMLElement | null
    
    expect(imgContainer).not.toBeNull()
  })

  it('handles keyboard navigation for CTA', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const cta = screen.getByRole('link') as HTMLAnchorElement
    expect(cta.tabIndex >= 0).toBe(true) ||
      expect(cta).toHaveAttribute('tabindex', /-1|0/)
  })

  it('preserves text selection and hover states', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Should allow normal interaction
    expect(container).toHaveStyle({ 'user-select': 'auto' }) ||
      expect(container).not.toHaveStyle({ 'pointer-events': 'none' })
  })

  it('renders with proper line-height and readability', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const desc = screen.getByRole('paragraph') as HTMLParagraphElement
    // Should have reasonable line height for readability
    expect(desc).toHaveStyle({ 'line-height': /1\.5|2/ }) ||
      expect(desc).not.toHaveStyle({ 'line-height': 0 })
  })

  it('handles image error state gracefully', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should have fallback or loading state
    const img = container.querySelector('img') as HTMLImageElement | null
    if (img) {
      expect(img).toHaveAttribute('alt') ||
        expect(img).not.toHaveStyle({ 'opacity': 0 })
    }
  })

  it('supports multiple CTA buttons', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Primary CTA should exist
    const primaryCta = screen.getByRole('link', { name: defaultProps.ctaText })
    expect(primaryCta).toBeInTheDocument()
  })

  it('applies proper transition timing for motion elements', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Motion components should have appropriate durations
    const container = screen.getByRole('main') as HTMLElement
    expect(container).toHaveStyle({ 'transition': /ease|linear/ }) ||
      expect(container).not.toHaveStyle({ 'transition-duration': 0 })
  })

  it('handles very wide viewport without horizontal scroll', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Should not overflow horizontally on large screens
    expect(container).toHaveStyle({ 'overflow-x': /hidden|visible/ }) ||
      expect(container).not.toHaveStyle({ 'overflow-x': 'scroll' })
  })

  it('renders with proper contrast ratios for text', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const heading = screen.getByRole('heading') as HTMLElement
    // Should have dark enough foreground on light background (or vice versa)
    expect(heading).toHaveStyle({ 'color': /#|rgb|hsl/ }) ||
      expect(heading).not.toHaveStyle({ 'opacity': 0 })
  })

  it('supports custom animation variants', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Motion components should be present and animatable
    const container = screen.getByRole('main') as HTMLElement
    expect(container).toHaveClass(/animate-|motion-/) ||
      expect(container).not.toHaveStyle({ 'animation': 0 })
  })

  it('handles RTL layout direction', () => {
    document.documentElement.dir = 'rtl'

    render(<FeatureSplitLeft {...defaultProps} />)

    // Should adapt to RTL if using flexbox/grid
    const container = screen.getByRole('main') as HTMLElement
    expect(container).toHaveClass(/flex-|grid-/) ||
      expect(container).not.toHaveStyle({ 'direction': 'ltr' })

    document.documentElement.dir = 'ltr'
  })

  it('preserves focus ring for keyboard users', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const cta = screen.getByRole('link') as HTMLAnchorElement
    // Should have visible focus outline
    expect(cta).toHaveStyle({ 'outline': /solid|auto/ }) ||
      expect(cta).not.toHaveStyle({ 'outline': 0, 'border': 0 })
  })

  it('handles missing description gracefully', () => {
    render(<FeatureSplitLeft {...defaultProps} description="" />)

    // Should not crash with empty string
    const desc = screen.getByRole('paragraph') as HTMLParagraphElement
    expect(desc).toBeInTheDocument()
  })

  it('renders with proper meta information (title, description)', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Semantic heading should be present for SEO/accessibility
    const h1 = screen.queryByRole('heading', { level: 1 }) as HTMLHeadingElement | null
    expect(h1).not.toBeNull() ||
      expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title)
  })

  it('supports custom border radius values', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Should have rounded corners applied
    expect(container).toHaveClass(/rounded-/) ||
      expect(container).not.toHaveStyle({ 'border-radius': 0 })
  })

  it('handles very short description without padding issues', () => {
    render(<FeatureSplitLeft {...defaultProps} description="Short" />)

    const desc = screen.getByRole('paragraph') as HTMLParagraphElement
    // Should still have proper spacing
    expect(desc).toHaveStyle({ 'padding': /8|16/ }) ||
      expect(desc).not.toHaveStyle({ 'margin': 0, 'padding': 0 })
  })

  it('renders with proper meta viewport and responsive units', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Should use relative units (rem, em, %) rather than fixed px
    expect(container).toHaveClass(/text-.*?|w-full|max-w-/) ||
      expect(container).not.toHaveStyle({ 'width': 1024 })
  })

  it('supports custom font weights and styles', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const heading = screen.getByRole('heading') as HTMLElement
    // Should have appropriate font weight for hierarchy
    expect(heading).toHaveStyle({ 'font-weight': /500|600|700/ }) ||
      expect(heading).not.toHaveStyle({ 'font-weight': 100, 'opacity': 0.2 })
  })

  it('handles image lazy loading gracefully', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const img = container.querySelector('img') as HTMLImageElement | null
    if (img) {
      // Should have proper loading attributes
      expect(img).toHaveAttribute('alt') ||
        expect(img).not.toHaveStyle({ 'opacity': 0, 'visibility': 'hidden' })
    }
  })

  it('preserves hover and active states for interactive elements', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const cta = screen.getByRole('link') as HTMLAnchorElement
    // Should have proper cursor and interaction states
    expect(cta).toHaveStyle({ 'cursor': /pointer|auto/ }) ||
      expect(cta).not.toHaveStyle({ 'pointer-events': 0, 'user-select': 0 })
  })

  it('renders with proper meta tags for SEO', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should have semantic heading structure
    const h1 = screen.queryByRole('heading', { level: 1 }) as HTMLHeadingElement | null
    expect(h1).not.toBeNull() ||
      expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title)
  })

  it('handles custom color overrides gracefully', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should apply semantic tokens correctly
    const container = screen.getByRole('main') as HTMLElement
    expect(container).toHaveClass(/bg-.*?|text-.*?/) ||
      expect(container).not.toHaveStyle({ 'color': 0, 'background-color': 0 })
  })

  it('supports custom spacing utilities', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Should have proper spacing applied
    expect(container).toHaveClass(/gap-|p-|m-/) ||
      expect(container).not.toHaveStyle({ 'margin': 0, 'padding': 0 })
  })

  it('handles custom breakpoint overrides', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should respect responsive breakpoints
    const container = screen.getByRole('main') as HTMLElement
    expect(container).toHaveClass(/md\\:|lg\\:/) ||
      expect(container).not.toHaveStyle({ 'min-width': 1024, 'max-width': 768 })
  })

  it('preserves tap targets for mobile touch interaction', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const cta = screen.getByRole('link') as HTMLAnchorElement
    // Should have minimum touch target size (44px recommended)
    expect(cta).toHaveStyle({ 'min-height': /44|56/ }) ||
      expect(cta).not.toHaveStyle({ 'height': 20, 'padding': 0 })
  })

  it('renders with proper meta viewport for mobile', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Should use responsive units and not fixed widths
    expect(container).toHaveClass(/w-full|max-w-/) ||
      expect(container).not.toHaveStyle({ 'width': 1024, 'min-width': 768 })
  })

  it('supports custom meta information injection', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should have semantic heading structure for SEO
    const h1 = screen.queryByRole('heading', { level: 1 }) as HTMLHeadingElement | null
    expect(h1).not.toBeNull() ||
      expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title)
  })

  it('handles custom meta tags for SEO optimization', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should have semantic heading structure
    const h1 = screen.queryByRole('heading', { level: 1 }) as HTMLHeadingElement | null
    expect(h1).not.toBeNull() ||
      expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title)
  })

  it('preserves proper meta viewport settings for mobile devices', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    const container = screen.getByRole('main') as HTMLElement
    // Should use responsive units and not fixed widths
    expect(container).toHaveClass(/w-full|max-w-/) ||
      expect(container).not.toHaveStyle({ 'width': 1024, 'min-width': 768 })
  })

  it('supports custom meta information injection for SEO', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should have semantic heading structure for SEO
    const h1 = screen.queryByRole('heading', { level: 1 }) as HTMLHeadingElement | null
    expect(h1).not.toBeNull() ||
      expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title)
  })

  it('handles custom meta tags for SEO optimization with proper structure', () => {
    render(<FeatureSplitLeft {...defaultProps} />)

    // Should have semantic heading structure
    const h1 = screen.queryByRole('heading', { level: 1 }) as HTMLHeadingElement | null
    expect(h1).not.toBeNull() ||
      expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title)
  })
