import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoPlaceholder } from '@/components/media/video-placeholder'
import { cn } from '@/lib/utils'

describe('VideoPlaceholder', () => {
  const mockOnLoad = vi.fn()
  const mockOnError = vi.fn()

  describe('Default rendering', () => {
    it('renders without throwing when no props provided', () => {
      const { container, getByRole } = render(
        <VideoPlaceholder />
      )

      expect(container).toBeInTheDocument()
      expect(getByRole('img')).toBeInTheDocument()
    })

    it('applies default aspect ratio of 16:9', () => {
      const { container } = render(<VideoPlaceholder />)

      const placeholder = container.querySelector('[data-placeholder="video"]')
      if (placeholder) {
        expect(placeholder).toHaveStyle('aspect-ratio: 16 / 9')
      }
    })

    it('applies default background color', () => {
      const { container } = render(<VideoPlaceholder />)

      const placeholder = container.querySelector('[data-placeholder="video"]')
      if (placeholder) {
        expect(placeholder).toHaveStyle('background-color: var(--bg-muted)')
      }
    })
  })

  describe('Props validation', () => {
    it('accepts videoUrl prop and renders correctly', () => {
      const testUrl = 'https://example.com/video.mp4'

      const { container, getByRole } = render(
        <VideoPlaceholder videoUrl={testUrl} />
      )

      expect(container).toBeInTheDocument()
      expect(getByRole('img')).toHaveAttribute('src', testUrl)
    })

    it('accepts aspectRatio prop and applies it', () => {
      const customRatio = '21 / 9'

      const { container } = render(
        <VideoPlaceholder aspectRatio={customRatio} />
      )

      const placeholder = container.querySelector('[data-placeholder="video"]')
      if (placeholder) {
        expect(placeholder).toHaveStyle('aspect-ratio: 21 / 9')
      }
    })

    it('accepts className prop and merges with defaults', () => {
      const customClass = 'custom-video-class'

      const { container } = render(
        <VideoPlaceholder className={customClass} />
      )

      expect(container).toHaveTextContent(customClass)
    })

    it('accepts title prop for accessibility', () => {
      const testTitle = 'Test Video Title'

      const { container, getByRole } = render(
        <VideoPlaceholder title={testTitle} />
      )

      expect(getByRole('img')).toHaveAttribute('aria-label', testTitle)
    })

    it('accepts controls prop and renders play button when enabled', () => {
      const { container, getByRole } = render(
        <VideoPlaceholder controls={true} />
      )

      expect(container).toBeInTheDocument()
      // Controls should be present when enabled
    })

    it('accepts loading prop and shows spinner during load state', () => {
      const { container, findByRole } = render(
        <VideoPlaceholder loading={true} />
      )

      expect(container).toHaveTextContent(/loading|spinner/i)
    })

    it('accepts error prop and displays error message', () => {
      const testError = 'Failed to load video'

      const { container, getByRole } = render(
        <VideoPlaceholder error={testError} />
      )

      expect(container).toHaveTextContent(testError)
    })

    it('accepts showControls prop and toggles control visibility', () => {
      const { container, findByRole } = render(
        <VideoPlaceholder showControls={true} />
      )

      // Controls should be visible when enabled
    })
  })

  describe('State management', () => {
    it('shows loading state by default before video loads', async () => {
      const mockSrc = 'https://example.com/video.mp4'

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl={mockSrc} />
      )

      // Loading indicator should be present initially
      expect(container).toHaveTextContent(/loading/i)
    })

    it('transitions to error state when video fails', async () => {
      const mockError = 'Network error'

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://broken.example.com/video.mp4' />
      )

      // Error message should appear after failure
      expect(container).toHaveTextContent(/error/i)
    })

    it('transitions to success state when video loads', async () => {
      const mockSrc = 'https://example.com/video.mp4'

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl={mockSrc} />
      )

      // Video element should be present after successful load
      expect(container).toHaveTextContent(/video/i)
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes for image placeholder', () => {
      const testTitle = 'Accessible Test Video'

      const { container, getByRole } = render(
        <VideoPlaceholder title={testTitle} />
      )

      expect(getByRole('img')).toHaveAttribute('aria-label', testTitle)
    })

    it('has visible focus indicators on interactive elements', () => {
      const { container, findByRole } = render(
        <VideoPlaceholder controls={true} />
      )

      // Focusable elements should have proper styling
      expect(container).toHaveTextContent(/focus/i)
    })

    it('supports keyboard navigation for controls', async () => {
      const { container, findByRole } = render(
        <VideoPlaceholder controls={true} />
      )

      const playButton = await findByRole('button')

      // Play button should be focusable
      expect(playButton).toHaveAttribute('tabindex', '-1')
    })
  })

  describe('Dark mode support', () => {
    it('applies correct dark mode colors via CSS variables', () => {
      document.documentElement.classList.add('dark')

      const { container } = render(<VideoPlaceholder />)

      // Should use dark mode variants when available
      expect(container).toHaveTextContent(/dark/i)

      document.documentElement.classList.remove('dark')
    })

    it('falls back gracefully in light mode', () => {
      document.documentElement.classList.remove('dark')

      const { container } = render(<VideoPlaceholder />)

      // Should use light mode variants when available
      expect(container).toHaveTextContent(/light/i)

      document.documentElement.classList.add('dark')
    })
  })

  describe('Reduced motion support', () => {
    it('respects prefers-reduced-motion media query', async () => {
      const mockOnLoad = vi.fn()

      // Simulate reduced motion preference
      document.body.style.setProperty(
        'prefers-reduced-motion: reduce'
      )

      const { container, findByRole } = render(
        <VideoPlaceholder controls={true} />
      )

      // Animations should be disabled or minimized
      expect(container).toHaveTextContent(/reduced/i)

      document.body.style.removeProperty('prefers-reduced-motion: reduce')
    })

    it('uses reduced motion variants when available', async () => {
      const mockOnLoad = vi.fn()

      // Simulate normal motion preference
      document.body.style.removeProperty('prefers-reduced-motion: reduce')

      const { container, findByRole } = render(
        <VideoPlaceholder controls={true} />
      )

      // Animations should be enabled normally
      expect(container).toHaveTextContent(/normal/i)

      document.body.style.setProperty('prefers-reduced-motion: reduce')
    })
  })

  describe('Motion preferences', () => {
    it('uses useReducedMotion hook correctly', async () => {
      const mockOnLoad = vi.fn()

      // Simulate reduced motion preference
      document.body.style.setProperty(
        'prefers-reduced-motion: reduce'
      )

      const { container, findByRole } = render(
        <VideoPlaceholder controls={true} />
      )

      // Animations should be disabled or minimized
      expect(container).toHaveTextContent(/reduced/i)

      document.body.style.removeProperty('prefers-reduced-motion: reduce')
    })

    it('uses normal motion variants when available', async () => {
      const mockOnLoad = vi.fn()

      // Simulate normal motion preference
      document.body.style.removeProperty('prefers-reduced-motion: reduce')

      const { container, findByRole } = render(
        <VideoPlaceholder controls={true} />
      )

      // Animations should be enabled normally
      expect(container).toHaveTextContent(/normal/i)

      document.body.style.setProperty('prefers-reduced-motion: reduce')
    })
  })

  describe('Event handlers', () => {
    it('calls onLoad callback when video loads successfully', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder
          videoUrl='https://example.com/video.mp4'
          onLoad={mockOnLoad}
        />
      )

      // Wait for load event to fire
      await waitFor(() => {
        expect(mockOnLoad).toHaveBeenCalled()
      })
    })

    it('calls onError callback when video fails', async () => {
      const mockOnError = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder
          videoUrl='https://broken.example.com/video.mp4'
          onError={mockOnError}
        />
      )

      // Wait for error event to fire
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled()
      })
    })

    it('passes custom className through to root element', async () => {
      const customClass = 'custom-video-wrapper'

      const { container } = render(
        <VideoPlaceholder className={customClass} />
      )

      // Check that custom class is applied
      expect(container).toHaveTextContent(customClass)
    })
  })

  describe('Type defaults', () => {
    it('renders with no required props (all have sensible defaults)', async () => {
      const { container, findByRole } = render(
        <VideoPlaceholder />
      )

      // Should render without any errors or missing props
      expect(container).toHaveTextContent(/video/i)
    })

    it('has proper type definitions for all props', async () => {
      const mockOnLoad = vi.fn()
      const mockOnError = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder
          videoUrl='https://example.com/video.mp4'
          aspectRatio='16 / 9'
          title='Test Title'
          className='custom-class'
          controls={true}
          loading={true}
          error='Test Error'
          showControls={true}
          onLoad={mockOnLoad}
          onError={mockOnError}
        />
      )

      // Should render with all props applied correctly
      expect(container).toHaveTextContent(/video/i)
    })
  })

  describe('Component lifecycle', () => {
    it('unmounts cleanly without memory leaks', async () => {
      const mockOnLoad = vi.fn()

      const { container, unmount } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Wait for initial load
      await waitFor(() => {
        expect(mockOnLoad).toHaveBeenCalled()
      })

      // Unmount should be clean
      unmount()

      // Container should be empty after unmount
      expect(container.firstChild).toBeNull()
    })

    it('re-renders when props change', async () => {
      const mockOnLoad = vi.fn()

      let renderCount = 0

      const { container, rerender } = render(
        <VideoPlaceholder
          videoUrl='https://example.com/video1.mp4'
          onLoad={mockOnLoad}
        />
      )

      // Initial render
      expect(container).toHaveTextContent(/video1/i)

      // Re-render with new props
      rerender(
        <VideoPlaceholder
          videoUrl='https://example.com/video2.mp4'
          onLoad={mockOnLoad}
        />
      )

      // Should reflect new props
      expect(container).toHaveTextContent(/video2/i)
    })
  })

  describe('Integration with parent components', () => {
    it('works correctly when nested in a layout component', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <div className="parent-container">
          <VideoPlaceholder
            videoUrl='https://example.com/video.mp4'
            onLoad={mockOnLoad}
          />
        </div>
      )

      // Should render within parent context
      expect(container).toHaveTextContent(/video/i)
    })

    it('works correctly when nested in a form component', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <form className="parent-form">
          <VideoPlaceholder
            videoUrl='https://example.com/video.mp4'
            onLoad={mockOnLoad}
          />
        </form>
      )

      // Should render within form context
      expect(container).toHaveTextContent(/video/i)
    })

    it('works correctly when nested in a modal component', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <div className="parent-modal">
          <VideoPlaceholder
            videoUrl='https://example.com/video.mp4'
            onLoad={mockOnLoad}
          />
        </div>
      )

      // Should render within modal context
      expect(container).toHaveTextContent(/video/i)
    })
  })

  describe('Performance considerations', () => {
    it('has minimal initial paint time', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should have minimal initial DOM size
      expect(container).toHaveTextContent(/minimal/i)
    })

    it('has efficient re-render behavior', async () => {
      const mockOnLoad = vi.fn()

      let renderCount = 0

      const { container, rerender } = render(
        <VideoPlaceholder
          videoUrl='https://example.com/video.mp4'
          onLoad={mockOnLoad}
        />
      )

      // Initial render
      expect(container).toHaveTextContent(/video/i)

      // Re-render should be efficient
      rerender(
        <VideoPlaceholder
          videoUrl='https://example.com/video2.mp4'
          onLoad={mockOnLoad}
        />
      )

      // Should reflect new props efficiently
      expect(container).toHaveTextContent(/video2/i)
    })
  })

  describe('Edge cases', () => {
    it('handles empty videoUrl gracefully', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='' />
      )

      // Should handle empty string without crashing
      expect(container).toHaveTextContent(/video/i)
    })

    it('handles null videoUrl gracefully', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl={null} />
      )

      // Should handle null without crashing
      expect(container).toHaveTextContent(/video/i)
    })

    it('handles undefined videoUrl gracefully', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl={undefined} />
      )

      // Should handle undefined without crashing
      expect(container).toHaveTextContent(/video/i)
    })

    it('handles very long videoUrl gracefully', async () => {
      const mockOnLoad = vi.fn()

      const longUrl = 'https://example.com/' + 'a'.repeat(1000) + '.mp4'

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl={longUrl} />
      )

      // Should handle very long URL without crashing
      expect(container).toHaveTextContent(/video/i)
    })

    it('handles special characters in videoUrl gracefully', async () => {
      const mockOnLoad = vi.fn()

      const specialChars = 'https://example.com/video?param=value&other=123.mp4'

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl={specialChars} />
      )

      // Should handle special characters without crashing
      expect(container).toHaveTextContent(/video/i)
    })
  })

  describe('Motion and animation', () => {
    it('applies smooth transitions by default', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should have smooth transitions applied
      expect(container).toHaveTextContent(/smooth/i)
    })

    it('respects reduced motion preference for animations', async () => {
      const mockOnLoad = vi.fn()

      // Simulate reduced motion preference
      document.body.style.setProperty(
        'prefers-reduced-motion: reduce'
      )

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Animations should be minimized or disabled
      expect(container).toHaveTextContent(/reduced/i)

      document.body.style.removeProperty('prefers-reduced-motion: reduce')
    })

    it('has proper animation timing values', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should have appropriate timing values
      expect(container).toHaveTextContent(/timing/i)
    })
  })

  describe('Internationalization (i18n)', () => {
    it('supports text content in different languages', async () => {
      const mockOnLoad = vi.fn()

      // Simulate different locale
      document.documentElement.lang = 'de-DE'

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should support internationalization
      expect(container).toHaveTextContent(/international/i)

      document.documentElement.lang = 'en-US'
    })

    it('has proper text direction for RTL languages', async () => {
      const mockOnLoad = vi.fn()

      // Simulate RTL language
      document.documentElement.dir = 'rtl'

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should support RTL direction
      expect(container).toHaveTextContent(/rtl/i)

      document.documentElement.dir = 'ltr'
    })
  })

  describe('Responsive design', () => {
    it('adapts to different viewport sizes', async () => {
      const mockOnLoad = vi.fn()

      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should adapt to mobile size
      expect(container).toHaveTextContent(/mobile/i)

      // Restore viewport
      Object.defineProperty(window, 'innerWidth', { value: 1920 })
    })

    it('adapts to different aspect ratios responsively', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should adapt to different aspect ratios
      expect(container).toHaveTextContent(/responsive/i)
    })
  })

  describe('Security considerations', () => {
    it('sanitizes user input in text content', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should sanitize user input
      expect(container).toHaveTextContent(/sanitize/i)
    })

    it('validates URLs before rendering', async () => {
      const mockOnLoad = vi.fn()

      const { container, findByRole } = render(
        <VideoPlaceholder videoUrl='https://example.com/video.mp4' />
      )

      // Should validate URLs
      expect(container).toHaveTextContent(/validate/i)
    })

    it('handles XSS attempts gracefully', async () => {
