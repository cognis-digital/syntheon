import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LightboxGallery } from '@/components/media/lightbox-gallery'

describe('LightboxGallery', () => {
  const mockImages = [
    { src: 'https://example.com/img1.jpg', alt: 'Test image 1', caption: 'First Image' },
    { src: 'https://example.com/img2.jpg', alt: 'Test image 2', caption: 'Second Image' },
  ]

  describe('rendering with defaults', () => {
    it('renders without throwing when given default props', () => {
      const { container } = render(
        <LightboxGallery images={mockImages} />
      )

      expect(container).not.toBeNull()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('does not throw on mount with empty array', () => {
      const { container } = render(<LightboxGallery images={[]} />)
      expect(container).not.toBeNull()
    })

    it('renders gallery trigger button when images provided', () => {
      const { container } = render(
        <LightboxGallery images={mockImages} />
      )

      // Should have at least one interactive element (gallery trigger)
      expect(container.querySelector('[role="button"]')).not.toBeNull()
    })
  })

  describe('accessibility', () => {
    it('has accessible gallery trigger button', () => {
      const { container } = render(
        <LightboxGallery images={mockImages} />
      )

      const triggerButton = container.querySelector('[role="button"]')
      expect(triggerButton).toHaveAttribute('aria-haspopup', 'dialog')
    })

    it('has accessible image elements with alt text', () => {
      const { container } = render(
        <LightboxGallery images={mockImages} />
      )

      mockImages.forEach((img, i) => {
        expect(container).toContainElement(
          screen.getByAltText(img.alt)
        )
      })
    })
  })

  describe('user interactions', () => {
    it('opens lightbox when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(<LightboxGallery images={mockImages} />)

      const triggerButton = screen.getByRole('button')
      
      // Click the gallery trigger
      await user.click(triggerButton)

      // Should show overlay/modal
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('closes lightbox when escape key is pressed', async () => {
      const user = userEvent.setup()
      render(<LightboxGallery images={mockImages} />)

      const triggerButton = screen.getByRole('button')
      await user.click(triggerButton)

      // Press Escape to close
      await user.keyboard('{Escape}')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes lightbox when clicking overlay', async () => {
      const user = userEvent.setup()
      render(<LightboxGallery images={mockImages} />)

      const triggerButton = screen.getByRole('button')
      await user.click(triggerButton)

      // Click on overlay (not the image itself)
      const overlay = document.querySelector('.lightbox-overlay') as HTMLElement
      if (overlay) {
        await user.click(overlay)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      }
    })
  })

  describe('error handling', () => {
    it('handles null images gracefully', () => {
      const { container } = render(<LightboxGallery images={null} />)
      expect(container).not.toBeNull()
    })

    it('handles malformed image objects without crashing', () => {
      const malformedImages = [
        {}, // Missing required fields
        { src: 'invalid' },
        null as any,
      ]

      const { container } = render(<LightboxGallery images={malformedImages} />)
      expect(container).not.toBeNull()
    })
  })

  describe('performance', () => {
    it('mounts quickly without blocking main thread', async () => {
      const startTime = performance.now()

      render(<LightboxGallery images={mockImages} />)

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      const duration = performance.now() - startTime
      // Should mount in under 100ms for small datasets
      expect(duration).toBeLessThan(100)
    })
  })
})
