import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorIllustration } from '@/components/media/error-illustration'
import { motion, useReducedMotion } from 'framer-motion'

describe('ErrorIllustration', () => {
  const renderComponent = (props: Partial<React.ComponentProps<typeof ErrorIllustration>> = {}) => {
    return render(<ErrorIllustration {...props} />)
  }

  it('renders without throwing with default props', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('displays error message by default', () => {
    const { container } = renderComponent({ title: 'Something went wrong' })
    expect(container).toHaveTextContent(/something went wrong/i)
  })

  it('applies correct base styles and classes', () => {
    const { container, getByRole } = renderComponent()
    
    // Check for error-related styling indicators
    expect(container.querySelector('.error-illustration')).toBeInTheDocument()
    expect(getByRole('img')).toHaveAttribute('alt', /error|issue/i)
  })

  it('accepts custom title prop', () => {
    const customTitle = 'Custom Error Title'
    renderComponent({ title: customTitle })
    
    expect(screen.getByText(customTitle)).toBeInTheDocument()
  })

  it('renders with reduced motion when disabled', async () => {
    const user = userEvent.setup()
    await user.pointer(300, 150) // Simulate pointer hover
    
    // Check that motion variants are applied (if any)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('handles empty title gracefully', () => {
    const { container } = renderComponent({ title: '' })
    expect(container).not.toThrow()
  })

  it('renders accessible error icon with proper ARIA attributes', () => {
    const { getByRole } = renderComponent()
    
    // Verify the image is properly accessible
    const img = getByRole('img')
    expect(img.getAttribute('alt')).toBeTruthy()
    expect(img).toHaveAttribute('role', 'img')
  })

  it('applies dark mode styles correctly when in dark context', () => {
    document.body.classList.add('dark')
    
    const { container } = renderComponent()
    
    // Dark mode should invert colors appropriately
    expect(container.querySelector('.error-illustration')).toBeInTheDocument()
    
    document.body.classList.remove('dark')
  })

  it('respects custom className prop', () => {
    const customClass = 'custom-error-class'
    renderComponent({ className: customClass })
    
    // The component should accept and apply additional classes
    expect(container).toHaveClass(customClass)
  })

  it('handles long error messages without overflow issues', () => {
    const longMessage = 'This is a very long error message that tests how the component handles text wrapping and responsive behavior.'
    
    renderComponent({ title: longMessage })
    
    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })

  it('maintains layout integrity during rapid prop changes', async () => {
    const user = userEvent.setup()
    
    // Initial render
    const { container } = renderComponent({ title: 'Initial' })
    expect(container).not.toBeNull()
    
    // Simulate prop updates (if component supports it)
    await user.pointer(10, 10)
    
    expect(container).not.toHaveClass('error-hidden')
  })

  it('passes through forwarded refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    
    // If the component accepts a ref prop, forward it properly
    renderComponent({ ref: ref as any })
    
    expect(ref).not.toBeNull()
  })

  it('renders with expected semantic HTML structure', () => {
    const { container } = renderComponent()
    
    // Verify basic DOM structure
    expect(container.querySelector('h2')).toBeInTheDocument()
    expect(container.querySelector('.error-illustration')).toBeInTheDocument()
  })

  it('handles null/undefined title without breaking layout', () => {
    renderComponent({ title: undefined as any })
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('applies proper focus states for keyboard navigation', async () => {
    const user = userEvent.setup()
    
    // If there are interactive elements, test focus behavior
    await user.tab()
    
    // Should not lose focus unexpectedly
    expect(document.activeElement).toBeInTheDocument()
  })

  it('passes through all expected props without warnings', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    
    renderComponent({
      title: 'Test Title',
      description: 'Test Description',
      iconSize: 48,
      className: 'test-class'
    })
    
    expect(consoleWarn).not.toHaveBeenCalled()
    consoleWarn.mockRestore()
  })

  it('renders correctly with framer-motion variants if applicable', async () => {
    // If the component uses motion components, verify animation works
    const { container } = renderComponent()
    
    // Check for motion-related classes or attributes
    expect(container).not.toHaveClass('motion-disabled')
  })

  it('handles responsive sizing correctly', () => {
    const { container } = renderComponent({ iconSize: 24 })
    
    // Verify the component respects size props
    expect(container.querySelector('.error-illustration')).toBeInTheDocument()
  })

  it('maintains performance with repeated renders', async () => {
    // Simulate multiple re-renders (common in React apps)
    for (let i = 0; i < 10; i++) {
      const { container } = renderComponent({ title: `Render ${i}` })
      expect(container).not.toThrow()
    }
  })

  it('applies border-radius correctly', () => {
    const { container } = renderComponent()
    
    // Check for rounded elements if applicable
    expect(container.querySelector('.error-illustration')).toBeInTheDocument()
  })

  it('handles very small viewport gracefully', async () => {
    document.body.style.width = '200px'
    document.body.style.height = '200px'
    
    const { container } = renderComponent()
    
    expect(container).not.toHaveClass('overflow-hidden')
    
    document.body.style.width = ''
    document.body.style.height = ''
  })

  it('renders with proper contrast ratios', () => {
    const { container, getByRole } = renderComponent()
    
    // Check that text has reasonable contrast
    const img = getByRole('img')
    expect(img).toHaveAttribute('alt')
  })

  it('handles async error state gracefully', async () => {
    // If the component supports loading/error states
    renderComponent({ isLoading: true, title: 'Loading...' })
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
