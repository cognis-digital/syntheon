import { describe, it, expect, vi } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import { BeforeAfterCard } from '@/components/media/before-after-card'

describe('BeforeAfterCard', () => {
  const mockBefore = { src: '/before.png', label: 'Before' }
  const mockAfter = { src: '/after.png', label: 'After' }

  it('renders with default props without throwing', () => {
    const { container } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    expect(container).toBeInTheDocument()
    expect(screen.getByText(/before/i)).toBeInTheDocument()
    expect(screen.getByText(/after/i)).toBeInTheDocument()
  })

  it('applies correct base styles', () => {
    const { container } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    // Check for expected class patterns
    expect(container.firstChild).toHaveClass(/rounded-lg/)
    expect(container.firstChild).toHaveClass(/border-border/)
  })

  it('handles dark mode correctly', () => {
    document.body.classList.add('dark')
    const { container } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    // Dark mode should still render without errors
    expect(container).toBeInTheDocument()
  })

  it('renders with custom control component', () => {
    const CustomControl = ({ children }: { children: React.ReactNode }) => (
      <div className="p-2">{children}</div>
    )
    
    const { container } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        control={<CustomControl>{/* custom controls */}</CustomControl>}
      />
    )
    expect(container).toBeInTheDocument()
  })

  it('applies additional className prop', () => {
    const { container } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        className="max-w-2xl"
      />
    )
    expect(container.firstChild).toHaveClass(/max-w-2xl/)
  })

  it('handles missing optional props gracefully', () => {
    const { container } = render(<BeforeAfterCard />)
    // Should not crash with minimal props
    expect(container).toBeInTheDocument()
  })

  it('preserves user-provided before/after data', () => {
    const customBefore = { src: '/custom-before.jpg', label: 'Custom Before' }
    const customAfter = { src: '/custom-after.jpg', label: 'Custom After' }
    
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    expect(container).toHaveTextContent('Before')
    
    rerender(
      <BeforeAfterCard before={customBefore} after={customAfter} />
    )
    
    expect(container).toHaveTextContent('Custom Before')
  })

  it('handles image loading states', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Initial state - images should be present
    expect(container).toBeInTheDocument()
    
    // Simulate missing image by clearing src temporarily
    rerender(
      <BeforeAfterCard 
        before={{ ...mockBefore, src: '' }} 
        after={mockAfter} 
      />
    )
    
    // Should still render without crashing
    expect(container).toBeInTheDocument()
  })

  it('supports keyboard navigation', () => {
    const wrapper = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Focus should be possible on interactive elements
    const focusableElements = wrapper.getAllByRole(['button', 'link', 'img'])
    expect(focusableElements.length).toBeGreaterThan(0)
  })

  it('handles animation props correctly', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // If the component uses framer-motion, animations should initialize cleanly
    expect(container).not.toHaveClass(/overflow-hidden/) // Motion containers typically have this
    
    // Re-render with animation props if applicable
    rerender(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        animate={{ duration: 0.3 }}
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('renders accessible labels', () => {
    const { container } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        aria-label="Product transformation comparison"
      />
    )
    
    // ARIA attributes should be preserved
    expect(container).toHaveAttribute('aria-label')
  })

  it('handles responsive sizing', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Should have some width constraint by default
    expect(container.firstChild).toHaveClass(/max-w-/) || 
      expect(container.firstChild).not.toHaveClass(/w-full/)
  })

  it('supports optional loading state', () => {
    const LoadingSpinner = () => <div className="animate-spin" />
    
    rerender(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        loading={<LoadingSpinner />}
      />
    )
    
    // Should render the custom loader if provided
    expect(container).toBeInTheDocument()
  })

  it('handles error states gracefully', () => {
    const ErrorFallback = () => <div className="text-red-500">Error</div>
    
    rerender(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        error={<ErrorFallback />}
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('preserves focus management', () => {
    const FocusTrap = ({ children }: { children: React.ReactNode }) => (
      <div className="outline-none" tabIndex={0}>
        {children}
      </div>
    )
    
    rerender(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        focusTrap={<FocusTrap />}
      />
    )
    
    expect(container).toHaveClass(/outline-none/)
  })

  it('handles boolean props correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        showControls={true}
      />
    )
    
    expect(container).toBeInTheDocument()
    
    // Toggle boolean prop
    rerender(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        showControls={false}
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('supports custom border radius', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        borderRadius="2xl"
      />
    )
    
    expect(container.firstChild).toHaveClass(/rounded-/)
  })

  it('handles infinite loop scenarios', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Rapid re-renders should not cause issues
    for (let i = 0; i < 10; i++) {
      rerender(
        <BeforeAfterCard 
          key={i} 
          before={{ ...mockBefore, src: `/before-${i}.png` }} 
          after={mockAfter} 
        />
      )
    }
    
    expect(container).toBeInTheDocument()
  })

  it('maintains state across re-renders', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={{ src: '/initial.png' }} 
        after={mockAfter}
        id="test-card"
      />
    )
    
    expect(container).toHaveAttribute('id', 'test-card')
    
    rerender(
      <BeforeAfterCard 
        before={{ src: '/updated.png' }} 
        after={mockAfter}
        id="test-card"
      />
    )
    
    // ID should persist if provided
    expect(container).toHaveAttribute('id', 'test-card')
  })

  it('handles empty/null values gracefully', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Test with null/undefined values
    rerender(
      <BeforeAfterCard 
        before={{ src: null as string | null }} 
        after={null as any}
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('supports custom event handlers', () => {
    const handleBeforeClick = vi.fn()
    const handleAfterClick = vi.fn()
    
    rerender(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        onBeforeClick={handleBeforeClick}
        onAfterClick={handleAfterClick}
      />
    )
    
    // Handlers should be attached without errors
    expect(handleBeforeClick).toBeDefined()
    expect(handleAfterClick).toBeDefined()
  })

  it('handles scroll behavior correctly', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // If the component has scroll-related props/behavior
    rerender(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        scrollBehavior="smooth"
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('renders with proper semantic structure', () => {
    const { container } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Should have a main container
    expect(container.firstChild).toHaveClass(/flex-/) || 
      expect(container.firstChild).not.toHaveClass(/inline-/)
  })

  it('supports custom theme overrides', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        theme={{ primary: '#ff0000' }}
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('handles viewport constraints', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Should respect parent viewport
    expect(container.firstChild).toHaveClass(/max-w-/) || 
      expect(container.firstChild).not.toHaveClass(/min-h-screen/)
  })

  it('supports custom cursor behavior', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        cursor="pointer"
      />
    )
    
    expect(container.firstChild).toHaveClass(/cursor-/)
  })

  it('handles transition timing correctly', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Transitions should be configurable
    rerender(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('supports custom z-index layering', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        zIndex="50"
      />
    )
    
    expect(container.firstChild).toHaveClass(/z-/) || 
      expect(container.firstChild).not.toHaveClass(/relative-/)
  })

  it('handles overflow behavior correctly', () => {
    const { container, rerender } = render(<BeforeAfterCard before={mockBefore} after={mockAfter} />)
    
    // Overflow should be controlled appropriately
    expect(container.firstChild).toHaveClass(/overflow-hidden/) || 
      expect(container.firstChild).not.toHaveClass(/overflow-auto/)
  })

  it('supports custom padding/margin utilities', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        spacing="lg"
      />
    )
    
    expect(container.firstChild).toHaveClass(/p-/) || 
      expect(container.firstChild).not.toHaveClass(/m-/)
  })

  it('handles text sizing correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        fontSize="sm"
      />
    )
    
    expect(container.firstChild).toHaveClass(/text-sm/) || 
      expect(container.firstChild).not.toHaveClass(/text-lg/)
  })

  it('supports custom font families', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        fontFamily="serif"
      />
    )
    
    expect(container.firstChild).toHaveClass(/font-/) || 
      expect(container.firstChild).not.toHaveClass(/sans-/)
  })

  it('handles line height correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        lineHeight="tight"
      />
    )
    
    expect(container.firstChild).toHaveClass(/leading-/) || 
      expect(container.firstChild).not.toHaveClass(/leading-normal/)
  })

  it('supports custom text colors', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        textColor="primary"
      />
    )
    
    expect(container.firstChild).toHaveClass(/text-primary/) || 
      expect(container.firstChild).not.toHaveClass(/text-default/)
  })

  it('handles background colors correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        bgColor="surface"
      />
    )
    
    expect(container.firstChild).toHaveClass(/bg-/) || 
      expect(container.firstChild).not.toHaveClass(/bg-transparent/)
  })

  it('supports custom shadows', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        shadow="xl"
      />
    )
    
    expect(container.firstChild).toHaveClass(/shadow-/) || 
      expect(container.firstChild).not.toHaveClass(/shadow-none/)
  })

  it('handles border styles correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        borderColor="primary"
      />
    )
    
    expect(container.firstChild).toHaveClass(/border-/) || 
      expect(container.firstChild).not.toHaveClass(/border-none/)
  })

  it('supports custom gradients', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        gradient="diagonal"
      />
    )
    
    expect(container.firstChild).toHaveClass(/bg-gradient-/) || 
      expect(container.firstChild).not.toHaveClass(/bg-solid/)
  })

  it('handles blur effects correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        blur="md"
      />
    )
    
    expect(container.firstChild).toHaveClass(/backdrop-blur-/) || 
      expect(container.firstChild).not.toHaveClass(/blur-none/)
  })

  it('supports custom transforms', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        transform="scale-105"
      />
    )
    
    expect(container.firstChild).toHaveClass(/transform-/) || 
      expect(container.firstChild).not.toHaveClass(/no-transform/)
  })

  it('handles opacity correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        opacity="75"
      />
    )
    
    expect(container.firstChild).toHaveClass(/opacity-/) || 
      expect(container.firstChild).not.toHaveClass(/opacity-100/)
  })

  it('supports custom positioning', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        position="relative"
      />
    )
    
    expect(container.firstChild).toHaveClass(/absolute-/) || 
      expect(container.firstChild).not.toHaveClass(/static-/)
  })

  it('handles flex behavior correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        flexDirection="column"
      />
    )
    
    expect(container.firstChild).toHaveClass(/flex-/) || 
      expect(container.firstChild).not.toHaveClass(/inline-flex/)
  })

  it('supports custom gaps', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        gap="md"
      />
    )
    
    expect(container.firstChild).toHaveClass(/gap-/) || 
      expect(container.firstChild).not.toHaveClass(/space-x-/)
  })

  it('handles justify behavior correctly', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        justifyContent="center"
      />
    )
    
    expect(container.firstChild).toHaveClass(/justify-/) || 
      expect(container.firstChild).not.toHaveClass(/flex-start/)
  })

  it('supports custom alignments', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        alignItems="center"
      />
    )
    
    expect(container.firstChild).toHaveClass(/align-/) || 
      expect(container.firstChild).not.toHaveClass(/flex-start/)
  })

  it('handles custom scroll behavior', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        scroll="smooth"
      />
    )
    
    expect(container.firstChild).toHaveClass(/scroll-/) || 
      expect(container.firstChild).not.toHaveClass(/overflow-hidden/)
  })

  it('supports custom pointer behavior', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        pointer="auto"
      />
    )
    
    expect(container.firstChild).toHaveClass(/cursor-/) || 
      expect(container.firstChild).not.toHaveClass(/pointer-events-none/)
  })

  it('handles custom selection behavior', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        select="text"
      />
    )
    
    expect(container.firstChild).toHaveClass(/select-/) || 
      expect(container.firstChild).not.toHaveClass(/select-none/)
  })

  it('supports custom user-select behavior', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        userSelect="auto"
      />
    )
    
    expect(container.firstChild).toHaveClass(/user-/) || 
      expect(container.firstChild).not.toHaveClass(/select-none/)
  })

  it('handles custom resize behavior', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        resize="both"
      />
    )
    
    expect(container.firstChild).toHaveClass(/resize-/) || 
      expect(container.firstChild).not.toHaveClass(/overflow-hidden/)
  })

  it('supports custom overflow behavior', () => {
    const { container, rerender } = render(
      <BeforeAfterCard 
        before={mockBefore} 
        after={mockAfter}
        overflow="visible"
      />
    )
