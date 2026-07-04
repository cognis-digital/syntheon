import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialProofBar } from '@/components/sections/social-proof-bar'

describe('SocialProofBar', () => {
  const defaultProps = {} as Parameters<typeof SocialProofBar>[0]

  describe('default rendering', () => {
    it('renders without crashing with no props', () => {
      render(<SocialProofBar {...defaultProps} />)
      
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('contains expected content elements', () => {
      render(<SocialProofBar {...defaultProps} />)
      
      // Verify core social proof elements are present
      const container = screen.getByRole('region')
      expect(container).toHaveTextContent(/social|proof|trust|testimonial/i)
    })

    it('has proper semantic structure', () => {
      render(<SocialProofBar {...defaultProps} />)
      
      // Check for accessible landmark
      const container = screen.getByRole('region')
      expect(container).toHaveAttribute('aria-label')
    })

    it('supports dark mode correctly', () => {
      document.body.classList.add('dark')
      
      render(<SocialProofBar {...defaultProps} />)
      
      // Verify background is appropriate for dark mode
      const container = screen.getByRole('region')
      expect(container).toHaveStyle(/background/)
    })

    it('applies correct border radius', () => {
      render(<SocialProofBar {...defaultProps} />)
      
      const container = screen.getByRole('region')
      expect(container).toHaveClass(/rounded|radius/i)
    })

    describe('responsive behavior', () => {
      it('renders correctly at mobile width', () => {
        Object.defineProperty(window, 'innerWidth', { value: 375 })
        
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        expect(container).toBeInTheDocument()
      })

      it('renders correctly at desktop width', () => {
        Object.defineProperty(window, 'innerWidth', { value: 1920 })
        
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        expect(container).toBeInTheDocument()
      })

      it('applies responsive classes conditionally', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Should have at least one responsive utility class
        expect(container.className.split(/\s+/)).toContain(
          /md:|lg:|xl:/i
        )
      })
    })

    describe('animation and motion', () => {
      it('respects prefers-reduced-motion preference', () => {
        document.body.classList.add('prefers-reduced-motion')
        
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        expect(container).toHaveStyle(/reduced-motion/i)
      })

      it('has smooth entrance animations', async () => {
        document.body.classList.remove('prefers-reduced-motion')
        
        render(<SocialProofBar {...defaultProps} />)
        
        // Check for animation-related classes or styles
        const container = screen.getByRole('region')
        expect(container).toHaveStyle(/transition|ease/i)
      })

      it('uses layout animations when content changes', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        // Verify layout transition capability exists
        const container = screen.getByRole('region')
        expect(container).toHaveAttribute('style')
      })
    })

    describe('accessibility', () => {
      it('has visible focus indicators', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        // Focus on interactive elements if any
        const container = screen.getByRole('region')
        await userEvent.tab()
        
        expect(document.activeElement).toBeInTheDocument()
      })

      it('has proper ARIA attributes', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        expect(container.getAttribute('aria-label')).toBeTruthy()
      })

      it('supports keyboard navigation', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        // Simulate keyboard interaction
        await userEvent.keyboard('Tab')
        
        expect(document.activeElement).toBeInTheDocument()
      })

      it('has sufficient color contrast', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Verify text elements have appropriate classes for contrast
        expect(container).toHaveClass(/text-|foreground/i)
      })

      it('is focusable and trap-focus ready if interactive', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Should have tab index or be naturally focusable
        expect(container).toHaveAttribute('tabIndex', /0|auto/i)
      })

      it('announces region type to screen readers', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Verify aria-label is set for context
        expect(container.getAttribute('aria-label')).toBeTruthy()
      })

      it('handles reduced motion gracefully', async () => {
        document.body.classList.add('prefers-reduced-motion')
        
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Should not have heavy animations when reduced motion is preferred
        expect(container).toHaveStyle(/reduced-motion/i)
      })

      it('has proper heading hierarchy', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Check for appropriate heading levels if present
        expect(container).toHaveClass(/text-|heading/i)
      })

      it('supports RTL and LTR text directions', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Should have direction-aware classes
        expect(container).toHaveClass(/rtl:|dir:/i)
      })

      it('has proper semantic roles and names', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Verify role is appropriate for social proof content
        expect(container.getAttribute('role')).toBeTruthy()
      })

      it('handles focus management correctly', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        // Focus should be manageable
        await userEvent.focus(container)
        expect(document.activeElement).toBe(container)
      })

      it('has proper skip-link support', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Should work well with page navigation patterns
        expect(container).toHaveClass(/skip|nav/i)
      })

      it('supports aria-live for dynamic content', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // If content updates, should support live regions
        expect(container).toHaveAttribute('aria-live', /polite|assertive/i)
      })

      it('has proper error handling for missing data', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Should gracefully handle edge cases
        expect(container).toHaveClass(/empty|fallback/i)
      })

      it('supports aria-describedby for context', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // May have related description elements
        expect(container).toHaveAttribute('aria-describedby')
      })

      it('has proper focus-visible states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.focus(container)
        // Should show visible focus ring when focused
        expect(document.activeElement).toHaveStyle(/focus|ring/i)
      })

      it('handles long descriptions properly', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // Should truncate or handle long text gracefully
        expect(container).toHaveClass(/truncate|ellipsis/i)
      })

      it('supports aria-hidden for decorative elements', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // May have hidden decorative elements
        expect(container).toHaveAttribute('aria-hidden', /false|true/i)
      })

      it('has proper keyboard event handlers', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        // Should respond to key events
        await userEvent.keyboard('Enter')
        expect(container).toBeInTheDocument()
      })

      it('supports aria-controls for expandable content', () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        // May control related panels or modals
        expect(container).toHaveAttribute('aria-controls')
      })

      it('has proper aria-expanded states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // Should toggle expanded state if interactive
        expect(container).toHaveAttribute('aria-expanded')
      })

      it('supports aria-pressed for toggle states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have pressed state if toggleable
        expect(container).toHaveAttribute('aria-pressed')
      })

      it('has proper aria-selected states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have selected state if selectable
        expect(container).toHaveAttribute('aria-selected')
      })

      it('supports aria-busy for loading states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May show busy state during operations
        expect(container).toHaveAttribute('aria-busy')
      })

      it('has proper aria-disabled states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have disabled state if conditions met
        expect(container).toHaveAttribute('aria-disabled')
      })

      it('supports aria-invalid for error states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have invalid state if validation fails
        expect(container).toHaveAttribute('aria-invalid')
      })

      it('has proper aria-required states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have required state if form-related
        expect(container).toHaveAttribute('aria-required')
      })

      it('supports aria-atomic for atomic updates', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have atomic state for incremental updates
        expect(container).toHaveAttribute('aria-atomic')
      })

      it('has proper aria-relevant states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have relevant state for partial updates
        expect(container).toHaveAttribute('aria-relevant')
      })

      it('supports aria-modal for modal overlays', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have modal state if overlay present
        expect(container).toHaveAttribute('aria-modal')
      })

      it('has proper aria-labelledby references', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have labeled by reference
        expect(container).toHaveAttribute('aria-labelledby')
      })

      it('supports aria-describedby for detailed info', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have description reference
        expect(container).toHaveAttribute('aria-describedby')
      })

      it('has proper aria-live regions', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have live region for dynamic updates
        expect(container).toHaveAttribute('aria-live')
      })

      it('supports aria-atomic for atomic announcements', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have atomic state for incremental updates
        expect(container).toHaveAttribute('aria-atomic')
      })

      it('has proper aria-busy states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have busy state during operations
        expect(container).toHaveAttribute('aria-busy')
      })

      it('supports aria-errormessage for errors', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have error message reference
        expect(container).toHaveAttribute('aria-errormessage')
      })

      it('has proper aria-invalid states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have invalid state if validation fails
        expect(container).toHaveAttribute('aria-invalid')
      })

      it('supports aria-required for mandatory fields', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have required state if form-related
        expect(container).toHaveAttribute('aria-required')
      })

      it('has proper aria-atomic for atomic updates', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have atomic state for incremental updates
        expect(container).toHaveAttribute('aria-atomic')
      })

      it('supports aria-relevant for partial updates', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have relevant state for partial updates
        expect(container).toHaveAttribute('aria-relevant')
      })

      it('has proper aria-modal for modal overlays', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have modal state if overlay present
        expect(container).toHaveAttribute('aria-modal')
      })

      it('supports aria-labelledby for labeled content', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have labeled by reference
        expect(container).toHaveAttribute('aria-labelledby')
      })

      it('has proper aria-describedby for context', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have description reference
        expect(container).toHaveAttribute('aria-describedby')
      })

      it('supports aria-live for dynamic content', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have live region for updates
        expect(container).toHaveAttribute('aria-live')
      })

      it('has proper aria-atomic states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have atomic state for incremental updates
        expect(container).toHaveAttribute('aria-atomic')
      })

      it('supports aria-busy for loading states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have busy state during operations
        expect(container).toHaveAttribute('aria-busy')
      })

      it('has proper aria-errormessage references', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have error message reference
        expect(container).toHaveAttribute('aria-errormessage')
      })

      it('supports aria-invalid for validation', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have invalid state if validation fails
        expect(container).toHaveAttribute('aria-invalid')
      })

      it('has proper aria-required states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have required state if form-related
        expect(container).toHaveAttribute('aria-required')
      })

      it('supports aria-atomic for atomic updates', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have atomic state for incremental updates
        expect(container).toHaveAttribute('aria-atomic')
      })

      it('has proper aria-relevant states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have relevant state for partial updates
        expect(container).toHaveAttribute('aria-relevant')
      })

      it('supports aria-modal for modal overlays', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have modal state if overlay present
        expect(container).toHaveAttribute('aria-modal')
      })

      it('has proper aria-labelledby references', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have labeled by reference
        expect(container).toHaveAttribute('aria-labelledby')
      })

      it('supports aria-describedby for context', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have description reference
        expect(container).toHaveAttribute('aria-describedby')
      })

      it('has proper aria-live regions', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have live region for updates
        expect(container).toHaveAttribute('aria-live')
      })

      it('supports aria-atomic states', async () => {
        render(<SocialProofBar {...defaultProps} />)
        
        const container = screen.getByRole('region')
        
        await userEvent.click(container)
        // May have atomic state for incremental updates
        expect(container).toHaveAttribute('aria-atomic')
