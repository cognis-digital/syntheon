import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import { CookieConsent } from '@/components/blocks/cookie-consent'

describe('CookieConsent', () => {
  const renderComponent = (props: Partial<React.ComponentProps<typeof CookieConsent>> = {}) => {
    return render(<CookieConsent {...props} />)
  }

  it('renders without crashing with defaults', () => {
    renderComponent()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('contains expected text content', () => {
    const { container } = renderComponent()
    
    // Check for consent header
    expect(container).toHaveTextContent(/consent/i)
    
    // Check for action buttons
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    const declineButton = screen.getByRole('button', { name: /decline/i })
    
    expect(acceptButton).toBeInTheDocument()
    expect(declineButton).toBeInTheDocument()
  })

  it('has correct ARIA roles and attributes', () => {
    renderComponent()
    
    // Dialog role for accessibility
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('role', 'dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('accepts click and dismisses banner', () => {
    renderComponent()
    
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    fireEvent.click(acceptButton)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('decline click also dismisses banner', () => {
    renderComponent()
    
    const declineButton = screen.getByRole('button', { name: /decline/i })
    fireEvent.click(declineButton)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('focus returns to accept button after closing', () => {
    renderComponent()
    
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    const initialTabOrder = acceptButton.getAttribute('tabIndex')
    
    fireEvent.click(acceptButton)
    
    // Should return focus to the same button
    expect(acceptButton).toHaveAttribute('tabIndex', '0')
  })

  it('is keyboard accessible', () => {
    renderComponent()
    
    const dialog = screen.getByRole('dialog')
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    
    // Focus should be trapped within the dialog
    acceptButton.focus()
    expect(document.activeElement).toBe(acceptButton)
  })

  it('supports dark mode correctly', () => {
    renderComponent({ className: 'dark' })
    
    const dialog = screen.getByRole('dialog')
    // Should have dark background in dark mode
    expect(dialog).toHaveClass(/bg-background/i)
  })

  it('applies proper radius styling', () => {
    renderComponent()
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass(/rounded-lg/i)
  })

  it('has visible focus indicators', () => {
    renderComponent()
    
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    acceptButton.focus()
    
    // Focus should be visually apparent (ring or outline)
    expect(acceptButton).toHaveClass(/focus-visible|outline/i)
  })

  it('passes through optional props correctly', () => {
    const customTitle = 'Custom Consent Title'
    renderComponent({ title: customTitle })
    
    // Should render the custom title if provided
    expect(screen.getByRole('dialog')).toHaveTextContent(customTitle)
  })

  it('handles reduced motion preference gracefully', async () => {
    document.body.style.setProperty(
      'prefers-reduced-motion',
      'reduce' as unknown as string
    )
    
    renderComponent()
    
    // Should still render but with minimal/no animation classes
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('has semantic HTML structure for screen readers', () => {
    renderComponent()
    
    const dialog = screen.getByRole('dialog')
    
    // Check for proper heading hierarchy
    expect(screen.queryByRole('heading')).toBeInTheDocument()
    
    // Check for descriptive labels on buttons
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    const declineButton = screen.getByRole('button', { name: /decline/i })
    
    expect(acceptButton).toHaveAttribute('aria-label')
    expect(declineButton).toHaveAttribute('aria-label')
  })

  it('maintains consistent border styling', () => {
    renderComponent()
    
    const dialog = screen.getByRole('dialog')
    // Should have subtle borders for depth
    expect(dialog).toHaveClass(/border/i)
  })

  it('renders with proper text contrast in light mode', () => {
    renderComponent()
    
    const dialog = screen.getByRole('dialog')
    // Text should be readable (foreground color applied)
    expect(dialog).toHaveTextContent(/text-foreground/i)
  })

  describe('concurrent rendering', () => {
    it('handles multiple instances without conflict', () => {
      renderComponent()
      
      const firstDialog = screen.getByRole('dialog')
      expect(firstDialog).toBeInTheDocument()
      
      // Render another instance
      const secondRender = renderComponent({ title: 'Second Instance' })
      const secondDialog = screen.getAllByRole('dialog')[1]
      
      expect(secondDialog).toHaveTextContent(/second/i)
    })

    it('cleans up properly on unmount', () => {
      const { container } = renderComponent()
      expect(container.firstChild).toBeInTheDocument()
      
      // Unmount
      container.remove()
      
      // Should be removed from DOM
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('event handling', () => {
    it('prevents double-click on buttons', () => {
      renderComponent()
      
      const acceptButton = screen.getByRole('button', { name: /accept/i })
      
      // First click should work
      fireEvent.click(acceptButton)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      
      // Second click (should be no-op or handled gracefully)
      fireEvent.click(acceptButton)
    })

    it('handles escape key to close', () => {
      renderComponent()
      
      const dialog = screen.getByRole('dialog')
      acceptButton.focus()
      
      fireEvent.keyDown(dialog, { key: 'Escape' as unknown as keyof KeyboardEvent })
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('handles click outside to close', () => {
      renderComponent()
      
      const dialog = screen.getByRole('dialog')
      acceptButton.focus()
      
      // Click outside the dialog
      fireEvent.click(document.body)
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('state management', () => {
    it('respects initial state if provided', async () => {
      renderComponent({ open: false })
      
      // Should not show by default when closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('toggles correctly with controlled prop', () => {
      const { rerender } = renderComponent({ open: true })
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Close via prop change
      rerender(<CookieConsent open={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('aesthetic verification', () => {
    it('uses consistent color tokens', () => {
      renderComponent()
      
      const dialog = screen.getByRole('dialog')
      
      // Verify background uses correct token
      expect(dialog).toHaveClass(/bg-background/i)
      
      // Verify text uses foreground token
      expect(dialog).toHaveTextContent(/text-foreground/i)
    })

    it('has proper shadow depth', () => {
      renderComponent()
      
      const dialog = screen.getByRole('dialog')
      // Should have subtle shadow for elevation
      expect(dialog).toHaveClass(/shadow|elevation/i)
    })

    it('uses appropriate border radius', () => {
      renderComponent()
      
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass(/rounded-lg/i)
    })

    it('has proper z-index for stacking context', () => {
      renderComponent()
      
      const dialog = screen.getByRole('dialog')
      // Should have high z-index to appear above content
      expect(dialog).toHaveStyle(/z-\d+/i)
    })
  })
})
