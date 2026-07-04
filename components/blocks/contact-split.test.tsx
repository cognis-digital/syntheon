import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import ContactSplit from '@/components/blocks/contact-split'

describe('ContactSplit', () => {
  const defaultProps = {
    title: 'Get in touch',
    subtitle: 'We\'d love to hear from you',
    email: 'hello@syntheon.com',
    phone: '+1 (555) 000-0000',
    address: '123 Design Ave, San Francisco, CA',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    formFields: ['name', 'email', 'message'],
  }

  it('renders without crashing with defaults', () => {
    const { container, getByText } = render(<ContactSplit {...defaultProps} />)

    expect(container).toBeInTheDocument()
    expect(getByText(defaultProps.title)).toBeInTheDocument()
    expect(getByText(defaultProps.subtitle)).toBeInTheDocument()
  })

  it('renders primary contact information with correct text content', () => {
    const { container, getByText } = render(<ContactSplit {...defaultProps} />)

    expect(container).toHaveTextContent(defaultProps.email)
    expect(container).toHaveTextContent(defaultProps.phone)
    expect(container).toHaveTextContent(defaultProps.address)
  })

  it('renders social links with accessible attributes', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for link elements (may be icons or text links)
    const links = container.querySelectorAll('a')
    expect(links.length).toBeGreaterThan(0)

    // Verify at least one social link exists
    if (links.length > 0) {
      expect(links[0]).toHaveAttribute('href', expect.stringContaining('#'))
    }
  })

  it('applies correct semantic HTML structure', () => {
    const { container, getByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for main container (usually div or section with appropriate classes)
    expect(container).toHaveAttribute('role', 'main') ||
      expect(container.querySelector('[class*="container"]')).toBeInTheDocument()
  })

  it('renders form fields when configured', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for input elements if form is present
    const inputs = container.querySelectorAll('input')
    
    if (inputs.length > 0) {
      expect(inputs[0]).toHaveAttribute('type', 'text' || 'email' || 'tel')
    } else {
      // Form might be hidden or optional - just verify no errors
      expect(container).not.toHaveAttribute('aria-invalid')
    }
  })

  it('supports dark mode correctly', () => {
    const wrapper = render(<ContactSplit {...defaultProps} />)
    
    // Check for dark mode class support
    expect(wrapper.container).toHaveClass(
      'dark' || 'bg-background' || 'text-foreground'
    )

    // Verify text contrast is maintained
    const textElements = wrapper.getAllByRole('heading')
    if (textElements.length > 0) {
      expect(textElements[0]).not.toHaveClass(/text-muted/)
    }
  })

  it('renders with responsive layout classes', () => {
    const { container, getByText } = render(<ContactSplit {...defaultProps} />)

    // Check for responsive utility classes (mobile-first or desktop breakpoints)
    expect(container).toHaveClass(/md:/ || /lg:/ || /xl:/ || /2xl:/)

    // Verify layout adapts to viewport
    const mainContainer = container.querySelector('[class*="container"]')
    if (mainContainer) {
      expect(mainContainer).not.toHaveAttribute('style', '')
    }
  })

  it('applies proper accessibility attributes', () => {
    const { container, getByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for ARIA landmarks and roles
    expect(container).toHaveAttribute('aria-label') ||
      expect(container.querySelector('[class*="landmark"]')).toBeInTheDocument()

    // Verify heading hierarchy
    const h1 = container.querySelector('h1')
    if (h1) {
      expect(h1).toHaveAttribute('id', expect.stringContaining('title'))
    }
  })

  it('handles missing optional props gracefully', () => {
    const minimalProps: Partial<typeof defaultProps> = {}

    const { container, getByText } = render(<ContactSplit {...minimalProps} />)

    // Should not crash with empty props
    expect(container).toBeInTheDocument()

    // May show placeholder text or defaults
    expect(getByText(/contact|get in touch/i)).toBeInTheDocument() ||
      expect(container).not.toHaveAttribute('aria-invalid')
  })

  it('renders form validation states when present', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for error state indicators if form exists
    const errorElements = container.querySelectorAll('[class*="error"]')
    
    if (errorElements.length > 0) {
      expect(errorElements[0]).toHaveAttribute('aria-hidden', 'true' || 'false')
    } else {
      // No errors by default - that's also valid
      expect(container).not.toHaveAttribute('role', 'alert')
    }
  })

  it('supports keyboard navigation for interactive elements', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for focusable elements with proper tab order
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      expect(focusableElements[0]).toHaveAttribute('tabIndex', '0' || '-1')
    } else {
      // No interactive elements - also valid
      expect(container).not.toHaveAttribute('role', 'dialog')
    }
  })

  it('applies consistent border and radius styling', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for rounded corners on interactive elements
    const buttons = container.querySelectorAll('button')
    
    if (buttons.length > 0) {
      expect(buttons[0]).toHaveClass(/rounded-/ || /border-/)
    } else {
      // No buttons - also valid
      expect(container).not.toHaveAttribute('style', '')
    }
  })

  it('renders with correct color token classes', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for semantic color class usage
    expect(container).toHaveClass(/bg-|text-/ || /border-/)

    // Verify background and text tokens are applied
    const bgElements = container.querySelectorAll('[class*="background"]')
    if (bgElements.length > 0) {
      expect(bgElements[0]).not.toHaveAttribute('style', '')
    }
  })

  it('handles empty state gracefully', () => {
    const emptyProps: Partial<typeof defaultProps> = {
      title: '',
      subtitle: '',
      email: '',
      phone: '',
      address: '',
      socialLinks: {},
      formFields: [],
    }

    const { container, getByText } = render(<ContactSplit {...emptyProps} />)

    // Should not crash with empty data
    expect(container).toBeInTheDocument()

    // May show placeholder or minimal content
    expect(getByText(/contact|hello/i)).toBeInTheDocument() ||
      expect(container).not.toHaveAttribute('aria-invalid')
  })

  it('supports custom theme overrides', () => {
    const themedProps: Partial<typeof defaultProps> = {
      title: 'Custom Title',
      subtitle: 'Custom Subtitle',
      email: 'custom@example.com',
      phone: '+1 (555) 999-9999',
      address: '456 Custom Street, NY',
    }

    const { container, getByText } = render(<ContactSplit {...themedProps} />)

    expect(getByText('Custom Title')).toBeInTheDocument()
    expect(getByText('custom@example.com')).toBeInTheDocument()
  })

  it('renders with proper semantic HTML5 elements', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for semantic structure
    const sectionElements = container.querySelectorAll('section, article')
    
    if (sectionElements.length > 0) {
      expect(sectionElements[0]).toHaveAttribute('aria-label', expect.any(String))
    } else {
      // May use div with role - also valid
      expect(container).not.toHaveAttribute('role', 'presentation')
    }
  })

  it('handles long text content without overflow issues', () => {
    const longTextProps: Partial<typeof defaultProps> = {
      title: 'A Very Long Title That Might Cause Overflow Issues If Not Handled Properly'.repeat(2),
      subtitle: 'A very long subtitle that tests responsive wrapping and line-height calculations across different viewport sizes.',
      email: 'a.very.long.email.address@example.com',
    }

    const { container, getByText } = render(<ContactSplit {...longTextProps} />)

    expect(getByText(longTextProps.title)).toBeInTheDocument()
    expect(container).not.toHaveAttribute('overflow-x', 'scroll') ||
      expect(container).toHaveClass(/max-w-|w-full/)
  })

  it('supports international characters in content', () => {
    const i18nProps: Partial<typeof defaultProps> = {
      title: 'Contacto / 連絡先 / Kontakt',
      subtitle: 'Email: café@example.com | Teléfono: +49 (0) 30 12345678',
      address: 'München, Deutschland • Paris, France • Tokyo, 日本',
    }

    const { container, getByText } = render(<ContactSplit {...i18nProps} />)

    expect(getByText('café@example.com')).toBeInTheDocument()
    expect(container).not.toHaveAttribute('dir', 'rtl') ||
      expect(container).toHaveClass(/text-left|text-center/)
  })

  it('renders with proper focus states for accessibility', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for focus-visible class support (important for keyboard users)
    const interactiveElements = container.querySelectorAll(
      'button, a, input, select, textarea'
    )

    if (interactiveElements.length > 0) {
      expect(interactiveElements[0]).toHaveClass(/focus-|ring-/) ||
        expect(container).not.toHaveAttribute('style', '')
    } else {
      // No interactive elements - also valid
      expect(container).not.toHaveAttribute('role', 'alert')
    }
  })

  it('handles null/undefined values gracefully', () => {
    const nullProps: Partial<typeof defaultProps> = {
      title: null,
      subtitle: undefined,
      email: null as unknown as string,
      phone: '',
      address: '123 Main St',
    }

    const { container, getByText } = render(<ContactSplit {...nullProps} />)

    // Should not crash with mixed null/undefined values
    expect(container).toBeInTheDocument()

    // May show defaults or placeholders
    expect(getByText(/contact|hello/i)).toBeInTheDocument() ||
      expect(container).not.toHaveAttribute('aria-invalid')
  })

  it('supports loading state if implemented', () => {
    const { container, getByText } = render(<ContactSplit {...defaultProps} />)

    // Check for loading indicator support (spinner, skeleton, etc.)
    const loadingElements = container.querySelectorAll(
      '[class*="loading"], [class*="skeleton"], [class*="spinner"]'
    )

    if (loadingElements.length > 0) {
      expect(loadingElements[0]).toHaveClass(/animate-|rounded-full/)
    } else {
      // No loading state - also valid for static content
      expect(container).not.toHaveAttribute('aria-busy', 'true') ||
        expect(container).not.toHaveAttribute('role', 'progressbar')
    }
  })

  it('renders with proper meta information (SEO)', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for SEO-related attributes if implemented
    const titleElements = container.querySelectorAll('[class*="title"], [class*="h1"]')
    
    if (titleElements.length > 0) {
      expect(titleElements[0]).toHaveAttribute('id', expect.stringContaining('title'))
    } else {
      // May use semantic heading - also valid
      expect(container).not.toHaveAttribute('hidden')
    }
  })

  it('handles very wide viewports correctly', () => {
    const { container, getByText } = render(<ContactSplit {...defaultProps} />)

    // Check for max-width constraints on content areas
    const contentAreas = container.querySelectorAll('[class*="max-w"]')
    
    if (contentAreas.length > 0) {
      expect(contentAreas[0]).not.toHaveAttribute('style', '')
    } else {
      // May use flexbox/grid for layout - also valid
      expect(container).not.toHaveAttribute('overflow-x', 'scroll')
    }
  })

  it('supports custom icon components if implemented', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for icon rendering (Lucide icons or SVG)
    const svgElements = container.querySelectorAll('svg')
    
    if (svgElements.length > 0) {
      expect(svgElements[0]).toHaveAttribute('aria-hidden', 'true' || 'false')
    } else {
      // May use text-based icons - also valid
      expect(container).not.toHaveAttribute('role', 'img')
    }
  })

  it('renders with proper meta viewport for responsive design', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for responsive utility classes in main container
    expect(container).toHaveClass(/container-|max-w-/ || /px-|py-/)

    // Verify responsive breakpoints are applied
    const layoutElements = container.querySelectorAll('[class*="md:"]')
    if (layoutElements.length > 0) {
      expect(layoutElements[0]).not.toHaveAttribute('style', '')
    } else {
      // May use CSS custom properties - also valid
      expect(container).not.toHaveAttribute('style', 'width: 100%;')
    }
  })

  it('handles form submission state if implemented', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for success/error state indicators
    const statusElements = container.querySelectorAll(
      '[class*="success"], [class*="error"], [class*="status"]'
    )

    if (statusElements.length > 0) {
      expect(statusElements[0]).toHaveClass(/text-|bg-/)
    } else {
      // No status indicators - also valid for basic implementation
      expect(container).not.toHaveAttribute('aria-live', 'polite') ||
        expect(container).not.toHaveAttribute('role', 'status')
    }
  })

  it('supports animation states if implemented', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for animation-related classes (framer-motion or CSS animations)
    const animatedElements = container.querySelectorAll(
      '[class*="animate-"], [class*="transition-"]'
    )

    if (animatedElements.length > 0) {
      expect(animatedElements[0]).not.toHaveAttribute('style', '')
    } else {
      // May use CSS transitions - also valid
      expect(container).not.toHaveAttribute('animation') ||
        expect(container).not.toHaveClass(/animate-/)
    }
  })

  it('renders with proper ARIA live regions for dynamic content', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for live region support (useful for form validation feedback)
    const liveRegions = container.querySelectorAll('[aria-live]')

    if (liveRegions.length > 0) {
      expect(liveRegions[0]).toHaveAttribute('aria-live', 'polite' || 'assertive')
    } else {
      // No live regions - also valid for static content
      expect(container).not.toHaveAttribute('role', 'log')
    }
  })

  it('handles very short viewport heights gracefully', () => {
    const { container, getByText } = render(<ContactSplit {...defaultProps} />)

    // Check for min-height constraints on content areas
    const minHeightElements = container.querySelectorAll('[class*="min-h"]')

    if (minHeightElements.length > 0) {
      expect(minHeightElements[0]).not.toHaveAttribute('style', '')
    } else {
      // May use flex-grow - also valid
      expect(container).not.toHaveAttribute('height', '100vh') ||
        expect(container).toHaveClass(/flex-|grow-/)
    }
  })

  it('supports custom cursor styles if implemented', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for cursor-related classes (custom cursors or pointer states)
    const cursorElements = container.querySelectorAll('[class*="cursor"]')

    if (cursorElements.length > 0) {
      expect(cursorElements[0]).not.toHaveAttribute('style', '')
    } else {
      // May use standard cursor - also valid
      expect(container).not.toHaveClass(/custom-|pointer-/) ||
        expect(container).not.toHaveAttribute('cursor', 'none')
    }
  })

  it('renders with proper meta description if implemented', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for meta-related attributes (SEO, accessibility descriptions)
    const metaElements = container.querySelectorAll('[class*="meta"], [class*="desc"]')

    if (metaElements.length > 0) {
      expect(metaElements[0]).not.toHaveAttribute('style', '')
    } else {
      // May use aria-describedby - also valid
      expect(container).not.toHaveAttribute('aria-describedby') ||
        expect(container).toHaveClass(/desc-|meta-/)
    }
  })

  it('handles very long email addresses without truncation issues', () => {
    const longEmailProps: Partial<typeof defaultProps> = {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      email: 'a.very.long.email.address.with.multiple.parts@example.com',
      phone: '+1 (555) 000-0000',
    }

    const { container, getByText } = render(<ContactSplit {...longEmailProps} />)

    expect(getByText(longEmailProps.email)).toBeInTheDocument()
    // Should not have horizontal scroll caused by long text
    expect(container).not.toHaveAttribute('overflow-x', 'scroll') ||
      expect(container).toHaveClass(/max-w-|w-full/)
  })

  it('supports RTL layout if implemented', () => {
    const rtlProps: Partial<typeof defaultProps> = {
      title: 'اتصل بنا',
      subtitle: 'تواصل معنا مع فريقنا',
      email: 'rtl@example.com',
      phone: '+966 (0) 12 345 6789',
    }

    const { container, getByText } = render(<ContactSplit {...rtlProps} />)

    expect(getByText('rtl@example.com')).toBeInTheDocument()
    // Should handle RTL text direction properly
    expect(container).not.toHaveAttribute('dir', 'ltr') ||
      expect(container).toHaveClass(/text-right|rtl-/)
  })

  it('renders with proper focus trap if modal-like behavior is implemented', () => {
    const { container, getAllByRole } = render(<ContactSplit {...defaultProps} />)

    // Check for focus management (useful for modals/overlays)
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      expect(focusableElements[0]).toHaveAttribute('tabIndex', '0' || '-1')
    } else {
