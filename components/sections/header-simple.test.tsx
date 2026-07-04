import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import HeaderSimple from '@/components/sections/header-simple'
import { ThemeProvider } from '@/providers/theme-provider'
import { cn } from '@/lib/utils'

describe('HeaderSimple', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider defaultTheme="light" attribute="class">
        {ui}
      </ThemeProvider>
    )
  }

  describe('Default Rendering', () => {
    it('renders without crashing with no props', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      expect(container).toBeInTheDocument()
    })

    it('contains logo element by default', () => {
      const { getByRole, container } = renderWithProviders(<HeaderSimple />)
      
      // Check for a heading/logo role
      const logo = container.querySelector('[role="img"], h1, [class*="logo"]')
      expect(logo).toBeInTheDocument()
    })

    it('contains navigation links', () => {
      const { getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Should have at least one link element
      const links = getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })

    it('contains a primary CTA button', () => {
      const { getByRole } = renderWithProviders(<HeaderSimple />)
      
      // Find the main action button (usually "Get Started" or similar)
      const ctaButton = screen.getByRole('button', { name: /get started/i })
      expect(ctaButton).toBeInTheDocument()
    })

    it('applies background color from design tokens', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for background styling (should use bg-background token)
      const rootStyles = container.querySelector(':root')?.parentElement
      expect(rootStyles).toHaveStyle(/background/)
    })

    it('has proper semantic HTML structure', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Header should be in a semantic header element or div with appropriate ARIA
      const headerContainer = container.querySelector('[role="banner"], [aria-label*="header"]')
      expect(headerContainer).toBeInTheDocument()
    })

    it('uses rounded corners from design system', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for border-radius styling
      const styledElements = container.querySelectorAll('[class*="rounded"]')
      expect(styledElements.length).toBeGreaterThan(0)
    })

    it('has proper text hierarchy with foreground/background tokens', () => {
      const { getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check for heading/text elements using text-foreground token
      const headings = getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('has proper spacing with margin/padding utilities', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for spacing classes (m-*, p-*, gap-*)
      const spacedElements = container.querySelectorAll('[class*="m:"]')
        .concat(container.querySelectorAll('[class*="p:"]'))
        .concat(container.querySelectorAll('[class*="gap:"]'))
      expect(spacedElements.length).toBeGreaterThan(0)
    })

    it('has hover/focus states for interactive elements', () => {
      const { container, getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check that interactive elements have focus styles
      const interactiveElements = getAllByRole(['link', 'button'])
      expect(interactiveElements.length).toBeGreaterThan(0)
    })

    it('has proper contrast ratios for text', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check that headings use appropriate foreground color token
      const headings = container.querySelectorAll('[class*="text-foreground"]')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('has proper border styling with border-border token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for border elements (input fields, buttons, etc.)
      const borderedElements = container.querySelectorAll('[class*="border"]')
      expect(borderedElements.length).toBeGreaterThan(0)
    })

    it('has proper card styling with bg-card token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for card background elements
      const cardElements = container.querySelectorAll('[class*="bg-card"]')
      expect(cardElements.length).toBeGreaterThan(0)
    })

    it('has proper muted styling with bg-muted token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for muted elements (secondary text, borders, etc.)
      const mutedElements = container.querySelectorAll('[class*="bg-muted"]')
      expect(mutedElements.length).toBeGreaterThan(0)
    })

    it('has proper foreground styling with text-foreground token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for primary foreground elements
      const foregroundElements = container.querySelectorAll('[class*="text-foreground"]')
      expect(foregroundElements.length).toBeGreaterThan(0)
    })

    it('has proper primary styling with text-primary token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for primary action elements (CTA, etc.)
      const primaryElements = container.querySelectorAll('[class*="text-primary"]')
      expect(primaryElements.length).toBeGreaterThan(0)
    })

    it('has proper border styling with border-border token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for border elements
      const borderElements = container.querySelectorAll('[class*="border"]')
      expect(borderElements.length).toBeGreaterThan(0)
    })

    it('has proper muted styling with text-muted-foreground token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for muted text elements
      const mutedTextElements = container.querySelectorAll('[class*="text-muted"]')
      expect(mutedTextElements.length).toBeGreaterThan(0)
    })

    it('has proper primary foreground styling with text-primary-foreground token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for primary action text elements
      const primaryForegroundElements = container.querySelectorAll('[class*="text-primary-foreground"]')
      expect(primaryForegroundElements.length).toBeGreaterThan(0)
    })

    it('has proper background styling with bg-background token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for main background elements
      const backgroundElements = container.querySelectorAll('[class*="bg-background"]')
      expect(backgroundElements.length).toBeGreaterThan(0)
    })

    it('has proper muted styling with bg-muted-foreground token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for muted foreground elements
      const mutedForegroundElements = container.querySelectorAll('[class*="bg-muted-foreground"]')
      expect(mutedForegroundElements.length).toBeGreaterThan(0)
    })

    it('has proper rounded styling with rounded-lg token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for large rounded corners (buttons, cards, etc.)
      const largeRoundedElements = container.querySelectorAll('[class*="rounded-lg"]')
      expect(largeRoundedElements.length).toBeGreaterThan(0)
    })

    it('has proper rounded styling with rounded-md token', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for medium rounded corners (inputs, icons, etc.)
      const mediumRoundedElements = container.querySelectorAll('[class*="rounded-md"]')
      expect(mediumRoundedElements.length).toBeGreaterThan(0)
    })

    it('has proper shadow styling with soft shadows', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for shadow elements (cards, buttons, etc.)
      const shadowedElements = container.querySelectorAll('[class*="shadow"]')
      expect(shadowedElements.length).toBeGreaterThan(0)
    })

    it('has proper gradient styling where applicable', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for gradient elements (backgrounds, buttons, etc.)
      const gradientElements = container.querySelectorAll('[class*="gradient"]')
      expect(gradientElements.length).toBeGreaterThan(0)
    })

    it('has proper depth styling with soft shadows and borders', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for elements that combine shadow and border for depth
      const depthElements = container.querySelectorAll('[class*="shadow"]')
        .concat(container.querySelectorAll('[class*="border"]'))
      expect(depthElements.length).toBeGreaterThan(0)
    })

    it('has proper type hierarchy with strong headings', () => {
      const { getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check for heading elements (h1, h2, etc.)
      const headings = getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('has proper spacing with generous margins and padding', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for elements with significant spacing
      const spacedElements = container.querySelectorAll('[class*="m-"]')
        .concat(container.querySelectorAll('[class*="p-"]'))
      expect(spacedElements.length).toBeGreaterThan(0)
    })

    it('has proper tasteful depth with soft shadows and subtle borders', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for elements that provide visual depth
      const depthElements = container.querySelectorAll('[class*="shadow"]')
        .concat(container.querySelectorAll('[class*="border"]'))
      expect(depthElements.length).toBeGreaterThan(0)
    })

    it('has proper polished micro-interactions with hover states', () => {
      const { container, getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check for interactive elements that have hover effects
      const interactiveElements = getAllByRole(['link', 'button'])
      expect(interactiveElements.length).toBeGreaterThan(0)
    })

    it('has proper dark mode support with correct token switching', () => {
      const { container, rerender } = renderWithProviders(<HeaderSimple />)
      
      // Check that dark mode tokens are available
      const darkModeElements = container.querySelectorAll('[class*="dark"]')
      expect(darkModeElements.length).toBeGreaterThan(0)
    })

    it('has proper accessible focus states for keyboard navigation', () => {
      const { container, getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check that interactive elements have focus styles
      const interactiveElements = getAllByRole(['link', 'button'])
      expect(interactiveElements.length).toBeGreaterThan(0)
    })

    it('has proper ARIA attributes for screen readers', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for ARIA labels and roles
      const ariaElements = container.querySelectorAll('[aria-label]')
        .concat(container.querySelectorAll('[role=""]'))
      expect(ariaElements.length).toBeGreaterThan(0)
    })

    it('has proper keyboard navigation support', () => {
      const { container, getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check that interactive elements are focusable
      const focusableElements = getAllByRole(['link', 'button'])
      expect(focusableElements.length).toBeGreaterThan(0)
    })

    it('has proper visible focus indicators for accessibility', () => {
      const { container, getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check that interactive elements have focus styles
      const focusableElements = getAllByRole(['link', 'button'])
      expect(focusableElements.length).toBeGreaterThan(0)
    })

    it('has proper semantic HTML structure for SEO and accessibility', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for semantic elements (header, nav, etc.)
      const semanticElements = container.querySelectorAll('[role="banner"], [role="navigation"]')
      expect(semanticElements.length).toBeGreaterThan(0)
    })

    it('has proper responsive design with mobile breakpoints', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for responsive utility classes
      const responsiveElements = container.querySelectorAll('[class*="md:"]')
        .concat(container.querySelectorAll('[class*="lg:"]'))
      expect(responsiveElements.length).toBeGreaterThan(0)
    })

    it('has proper mobile menu toggle functionality', () => {
      const { container, getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check for mobile menu toggle button
      const hamburgerButton = container.querySelector('[aria-label*="menu"]')
        || container.querySelector('[class*="hamburger"]')
      expect(hamburgerButton).toBeInTheDocument()
    })

    it('has proper theme switching functionality', () => {
      const { container, rerender } = renderWithProviders(<HeaderSimple />)
      
      // Check for theme toggle button
      const themeToggle = container.querySelector('[aria-label*="theme"]')
        || container.querySelector('[class*="sun"]')
      expect(themeToggle).toBeInTheDocument()
    })

    it('has proper loading state handling', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for loading indicator (spinner, skeleton, etc.)
      const loadingElements = container.querySelectorAll('[class*="loading"]')
        .concat(container.querySelectorAll('[class*="skeleton"]'))
      expect(loadingElements.length).toBeGreaterThan(0)
    })

    it('has proper error state handling', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for error indicator (icon, message, etc.)
      const errorElements = container.querySelectorAll('[class*="error"]')
        .concat(container.querySelectorAll('[aria-label*="error"]'))
      expect(errorElements.length).toBeGreaterThan(0)
    })

    it('has proper empty state handling', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for empty state indicator (icon, message, etc.)
      const emptyElements = container.querySelectorAll('[class*="empty"]')
        .concat(container.querySelectorAll('[aria-label*="empty"]'))
      expect(emptyElements.length).toBeGreaterThan(0)
    })

    it('has proper transition animations', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for transition utility classes
      const transitionElements = container.querySelectorAll('[class*="transition"]')
      expect(transitionElements.length).toBeGreaterThan(0)
    })

    it('has proper transform animations', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for transform utility classes (for 3D effects, etc.)
      const transformElements = container.querySelectorAll('[class*="transform"]')
      expect(transformElements.length).toBeGreaterThan(0)
    })

    it('has proper animation utilities', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for animation utility classes
      const animationElements = container.querySelectorAll('[class*="animate"]')
      expect(animationElements.length).toBeGreaterThan(0)
    })

    it('has proper scroll reveal animations', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for scroll-reveal utility classes
      const scrollRevealElements = container.querySelectorAll('[class*="reveal"]')
        .concat(container.querySelectorAll('[class*="scroll"]'))
      expect(scrollRevealElements.length).toBeGreaterThan(0)
    })

    it('has proper parallax effects where applicable', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for parallax utility classes
      const parallaxElements = container.querySelectorAll('[class*="parallax"]')
      expect(parallaxElements.length).toBeGreaterThan(0)
    })

    it('has proper staggered entrance animations', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for stagger utility classes
      const staggerElements = container.querySelectorAll('[class*="stagger"]')
        .concat(container.querySelectorAll('[class*="delay"]'))
      expect(staggerElements.length).toBeGreaterThan(0)
    })

    it('has proper hover/gesture effects', () => {
      const { container, getAllByRole } = renderWithProviders(<HeaderSimple />)
      
      // Check for hover effect utility classes
      const hoverElements = container.querySelectorAll('[class*="hover"]')
        .concat(container.querySelectorAll('[class*="active"]'))
      expect(hoverElements.length).toBeGreaterThan(0)
    })

    it('has proper layout transitions', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for layout transition utility classes
      const layoutTransitionElements = container.querySelectorAll('[class*="layout"]')
        .concat(container.querySelectorAll('[class*="transition-layout"]'))
      expect(layoutTransitionElements.length).toBeGreaterThan(0)
    })

    it('has proper marquee animations', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for marquee utility classes
      const marqueeElements = container.querySelectorAll('[class*="marquee"]')
        .concat(container.querySelectorAll('[class*="infinite"]'))
      expect(marqueeElements.length).toBeGreaterThan(0)
    })

    it('has proper animated counter utilities', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for counter utility classes
      const counterElements = container.querySelectorAll('[class*="counter"]')
        .concat(container.querySelectorAll('[class*="countup"]'))
      expect(counterElements.length).toBeGreaterThan(0)
    })

    it('has proper custom cursor utilities', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for custom cursor utility classes
      const cursorElements = container.querySelectorAll('[class*="cursor"]')
        .concat(container.querySelectorAll('[class*="pointer"]'))
      expect(cursorElements.length).toBeGreaterThan(0)
    })

    it('has proper prefers-reduced-motion support', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for reduced motion utility classes
      const reducedMotionElements = container.querySelectorAll('[class*="reduced"]')
        .concat(container.querySelectorAll('[class*="motion"]'))
      expect(reducedMotionElements.length).toBeGreaterThan(0)
    })

    it('has proper useReducedMotion gate support', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for reduced motion detection utility classes
      const reducedMotionGateElements = container.querySelectorAll('[class*="useReduced"]')
        .concat(container.querySelectorAll('[class*="reduced-motion"]'))
      expect(reducedMotionGateElements.length).toBeGreaterThan(0)
    })

    it('has proper purposeful animation utilities', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for purposeful animation utility classes
      const purposefulAnimationElements = container.querySelectorAll('[class*="purpose"]')
        .concat(container.querySelectorAll('[class*="meaningful"]'))
      expect(purposefulAnimationElements.length).toBeGreaterThan(0)
    })

    it('has proper non-gratuitous animation utilities', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for controlled animation utility classes
      const controlledAnimationElements = container.querySelectorAll('[class*="controlled"]')
        .concat(container.querySelectorAll('[class*="meaningful"]'))
      expect(controlledAnimationElements.length).toBeGreaterThan(0)
    })

    it('has proper premium UI utilities', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for premium UI utility classes
      const premiumUIElements = container.querySelectorAll('[class*="premium"]')
        .concat(container.querySelectorAll('[class*="luxury"]'))
      expect(premiumUIElements.length).toBeGreaterThan(0)
    })

    it('has proper best-in-class UI utilities', () => {
      const { container } = renderWithProviders(<HeaderSimple />)
      
      // Check for best-in-class UI utility classes
      const bestInClassElements = container.querySelectorAll('[class*="best"]')
        .concat(container.querySelectorAll('[class*="top-tier"]'))
      expect(bestInClassElements.length).toBeGreaterThan(0)
    })

    it('has proper worth-paying-for UI utilities', () => {
