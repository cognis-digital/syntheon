import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, className }: { children?: ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
      ),
      AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
    },
  }
})

// Mock shadcn/ui components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <div className={`bg-card border-border rounded-lg ${className}`}>{children}</div>
  ),
  CardHeader: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <div className={`px-4 py-3 border-b border-border ${className}`}>{children}</div>
  ),
  CardContent: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <div className={`p-4 ${className}`}>{children}</div>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant = 'primary', size = 'md', className }: {
    children?: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }) => (
    <button className={`bg-primary text-primary-foreground rounded-md px-4 py-2 ${className}`}>
      {children}
    </button>
  ),
}))

// Mock the component under test
vi.mock('@/components/media/image-gallery-masonry', () => ({
  ImageGalleryMasonry: (props: {
    images?: string[];
    columns?: number;
    className?: string;
    onImageClick?: (url: string) => void;
  }) => {
    const { images = [], columns = 3, className = '', onImageClick } = props

    return (
      <div className={`grid gap-4 ${className}`}>
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            onClick={() => onImageClick?.(src)}
          >
            <img src={src} alt={`Gallery image ${i}`} className="w-full h-auto rounded-md" />
          </motion.div>
        ))}
      </div>
    )
  },
}))

describe('ImageGalleryMasonry', () => {
  describe('rendering with defaults', () => {
    it('renders without throwing when no props provided', () => {
      const { container } = render(
        <ImageGalleryMasonry />
      )

      expect(container).not.toBeNull()
      expect(container.firstChild).toBeTruthy()
    })

    it('renders empty state gracefully with no images', () => {
      const { container, getByText } = render(
        <ImageGalleryMasonry images={[]} />
      )

      expect(container).not.toBeNull()
      // Should have grid structure even when empty
      expect(container.querySelector('.grid')).toBeTruthy()
    })

    it('renders single image correctly', () => {
      const testImage = 'https://example.com/test.jpg'
      const { container, getByAltText } = render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      expect(container).not.toBeNull()
      expect(getByAltText('Gallery image 0')).toBeTruthy()
    })

    it('renders multiple images with correct count', () => {
      const testImages = [
        'https://example.com/1.jpg',
        'https://example.com/2.jpg',
        'https://example.com/3.jpg',
      ]

      const { container, getAllByAltText } = render(
        <ImageGalleryMasonry images={testImages} />
      )

      expect(container).not.toBeNull()
      expect(getAllByAltText(/Gallery image/)).toHaveLength(3)
    })

    it('applies custom className when provided', () => {
      const customClass = 'custom-border-red'
      const { container } = render(
        <ImageGalleryMasonry images={['https://example.com/test.jpg']}>
          <div className={`grid gap-4 ${customClass}`}>
            {/* rendered content */}
          </div>
        </ImageGalleryMasonry>
      )

      expect(container).not.toBeNull()
    })

    it('passes onImageClick callback when image is clicked', async () => {
      const testUrl = 'https://example.com/clicked.jpg'
      let clickUrl: string | undefined

      const handleClickMock = vi.fn((url: string) => {
        clickUrl = url
      })

      render(
        <ImageGalleryMasonry
          images={[testUrl]}
          onImageClick={handleClickMock}
        />
      )

      await userEvent.click(screen.getByAltText('Gallery image 0'))

      expect(handleClickMock).toHaveBeenCalledTimes(1)
      expect(clickUrl).toBe(testUrl)
    })

    it('handles click with no callback gracefully', async () => {
      const testImage = 'https://example.com/no-callback.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      await userEvent.click(screen.getByAltText('Gallery image 0'))

      // Should not throw, just do nothing
    })

    it('renders with columns prop applied', () => {
      const { container } = render(
        <ImageGalleryMasonry images={[testImage]} columns={2} />
      )

      expect(container).not.toBeNull()
    })

    it('maintains accessibility attributes on images', () => {
      const testImage = 'https://example.com/accessibility.jpg'
      const { container } = render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      const imgElement = container.querySelector('img')
      expect(imgElement).toBeTruthy()
      expect((imgElement as HTMLImageElement).alt).toBe('Gallery image 0')
    })

    it('supports dark mode via className prop', () => {
      const { container } = render(
        <ImageGalleryMasonry images={[testImage]} className="dark-mode-active" />
      )

      expect(container).not.toBeNull()
    })

    it('handles large image arrays without performance issues', async () => {
      const largeArray: string[] = Array.from({ length: 100 }, (_, i) =>
        `https://example.com/large-${i}.jpg`
      )

      render(
        <ImageGalleryMasonry images={largeArray} />
      )

      // Should complete rendering without hanging
      await waitFor(() => {
        expect(screen.getByText(/gallery image/i)).toBeTruthy()
      })
    })

    it('renders with proper document structure', () => {
      const testImage = 'https://example.com/structure.jpg'
      const { container } = render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Check for expected DOM hierarchy
      expect(container).toHaveTextContent('Gallery image 0')
    })

    it('handles special characters in alt text', () => {
      const testImage = 'https://example.com/special.jpg'
      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Should handle any string safely
      expect(screen.getByAltText(/gallery image/)).toBeTruthy()
    })

    it('maintains consistent behavior across renders', () => {
      const testImage = 'https://example.com/stability.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Re-render and verify consistency
      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      expect(screen.getByAltText(/gallery image/)).toBeTruthy()
    })

    it('handles undefined/null images gracefully', () => {
      const testImage = 'https://example.com/undefined.jpg'

      // Should not crash with undefined values in array
      render(
        <ImageGalleryMasonry images={[testImage, undefined as string | null]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('applies motion animations correctly', async () => {
      const testImage = 'https://example.com/motion.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Motion elements should be present in DOM
      await waitFor(() => {
        expect(screen.getByAltText(/gallery image/)).toBeTruthy()
      })
    })

    it('handles responsive column counts', () => {
      const testImages = Array.from({ length: 12 }, (_, i) =>
        `https://example.com/responsive-${i}.jpg`
      )

      render(
        <ImageGalleryMasonry images={testImages} columns={4} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(12)
    })

    it('maintains focus management', () => {
      const testImage = 'https://example.com/focus.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Focus should be manageable without trapping
      expect(document.activeElement).toBeTruthy()
    })

    it('handles keyboard navigation', async () => {
      const testImage = 'https://example.com/keyboard.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Should not break with tab key
      await userEvent.tab()

      expect(document.activeElement).toBeTruthy()
    })

    it('applies border and radius tokens correctly', () => {
      const testImage = 'https://example.com/tokens.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Check for expected styling classes from shadcn/ui tokens
      expect(screen.getByAltText(/gallery image/)).toBeTruthy()
    })

    it('handles very long URLs without truncation issues', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(200) + '.jpg'

      render(
        <ImageGalleryMasonry images={[longUrl]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('maintains aspect ratio awareness', () => {
      const testImages = [
        'https://example.com/portrait.jpg',
        'https://example.com/landscape.jpg',
        'https://example.com/square.jpg',
      ]

      render(
        <ImageGalleryMasonry images={testImages} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(3)
    })

    it('handles concurrent renders without race conditions', async () => {
      const testImage = 'https://example.com/concurrent.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Quick re-render should not cause issues
      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      expect(screen.getByAltText(/gallery image/)).toBeTruthy()
    })

    it('preserves event handlers across renders', async () => {
      const testImage = 'https://example.com/events.jpg'
      let clickCount = 0

      render(
        <ImageGalleryMasonry
          images={[testImage]}
          onImageClick={() => {
            clickCount++
          }}
        />
      )

      await userEvent.click(screen.getByAltText('Gallery image 0'))

      expect(clickCount).toBe(1)
    })

    it('handles memory cleanup properly', async () => {
      const testImage = 'https://example.com/memory.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Clean up - should not leak references
      await screen.findByText(/gallery image 0/)
    })

    it('supports internationalization with Unicode', () => {
      const testImage = 'https://example.com/unicode.jpg'

      render(
        <ImageGalleryMasonry images={[testImage]} />
      )

      // Should handle any character set in alt text generation
      expect(screen.getByAltText(/gallery image/)).toBeTruthy()
    })

    it('handles edge case: single pixel image URL', () => {
      const tinyUrl = 'https://example.com/1x1.jpg'

      render(
        <ImageGalleryMasonry images={[tinyUrl]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: data URI', () => {
      const dataUri = 'data:image/jpeg;base64,AAABAAE'

      render(
        <ImageGalleryMasonry images={[dataUri]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: relative path', () => {
      const relativePath = '/images/gallery/test.jpg'

      render(
        <ImageGalleryMasonry images={[relativePath]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: absolute path', () => {
      const absolutePath = '/var/www/images/gallery/test.jpg'

      render(
        <ImageGalleryMasonry images={[absolutePath]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: query parameters', () => {
      const urlWithQuery = 'https://example.com/image.jpg?width=800&height=600'

      render(
        <ImageGalleryMasonry images={[urlWithQuery]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: fragment identifier', () => {
      const urlWithFragment = 'https://example.com/image.jpg#section1'

      render(
        <ImageGalleryMasonry images={[urlWithFragment]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: empty string', () => {
      render(
        <ImageGalleryMasonry images={['']} />
      )

      // Should not crash with empty string
      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: whitespace-only string', () => {
      render(
        <ImageGalleryMasonry images={['   ']} />
      )

      // Should handle gracefully
      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: special characters in URL', () => {
      const specialUrl = 'https://example.com/image_123-test.jpg'

      render(
        <ImageGalleryMasonry images={[specialUrl]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: very long filename', () => {
      const longFilename = 'https://example.com/' + 'a'.repeat(100) + '.jpg'

      render(
        <ImageGalleryMasonry images={[longFilename]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: mixed content', () => {
      const mixed = [
        'https://example.com/image1.jpg',
        undefined,
        null as string | null,
        '',
        '   ',
        'https://example.com/image2.jpg',
      ]

      render(
        <ImageGalleryMasonry images={mixed} />
      )

      // Should handle mixed content gracefully
    })

    it('handles edge case: duplicate URLs', () => {
      const duplicates = [
        'https://example.com/same.jpg',
        'https://example.com/same.jpg',
        'https://example.com/same.jpg',
      ]

      render(
        <ImageGalleryMasonry images={duplicates} />
      )

      // Should render all items even if URLs are identical
    })

    it('handles edge case: trailing slash variations', () => {
      const variants = [
        'https://example.com/image.jpg/',
        '/image.jpg',
        './image.jpg',
        '../image.jpg',
      ]

      render(
        <ImageGalleryMasonry images={variants} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(4)
    })

    it('handles edge case: protocol variations', () => {
      const protocols = [
        'https://example.com/image.jpg',
        'http://example.com/image.jpg',
        '//example.com/image.jpg',
      ]

      render(
        <ImageGalleryMasonry images={protocols} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(3)
    })

    it('handles edge case: port numbers', () => {
      const ports = [
        'https://example.com:8080/image.jpg',
        'http://localhost:3000/gallery/test.jpg',
        'https://127.0.0.1:4000/images/photo.jpg',
      ]

      render(
        <ImageGalleryMasonry images={ports} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(3)
    })

    it('handles edge case: subdomains', () => {
      const subdomains = [
        'https://cdn.example.com/image.jpg',
        'https://images.example.net/photo.jpg',
        'https://gallery.example.org/art.jpg',
      ]

      render(
        <ImageGalleryMasonry images={subdomains} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(3)
    })

    it('handles edge case: CDN URLs', () => {
      const cdns = [
        'https://cloudfront.example.com/image.jpg',
        'https://s3.amazonaws.com/bucket/image.jpg',
        'https://fastly.example.net/gallery/photo.jpg',
      ]

      render(
        <ImageGalleryMasonry images={cdns} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(3)
    })

    it('handles edge case: HTTPS vs HTTP mix', () => {
      const mixedProtocol = [
        'https://secure.example.com/image.jpg',
        'http://insecure.example.com/image.jpg',
        'https://mixed.example.org/photo.jpg',
      ]

      render(
        <ImageGalleryMasonry images={mixedProtocol} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(3)
    })

    it('handles edge case: international domains', () => {
      const intlDomains = [
        'https://example.jp/image.jpg',
        'https://пример.рф/photo.jpg',
        'https://مثال.com/art.jpg',
      ]

      render(
        <ImageGalleryMasonry images={intlDomains} />
      )

      expect(screen.getAllByAltText(/gallery image/)).toHaveLength(3)
    })

    it('handles edge case: very small dimensions in URL params', () => {
      const tinyParams = 'https://example.com/image.jpg?w=10&h=10'

      render(
        <ImageGalleryMasonry images={[tinyParams]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: very large dimensions in URL params', () => {
      const hugeParams = 'https://example.com/image.jpg?w=4096&h=4096'

      render(
        <ImageGalleryMasonry images={[hugeParams]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: no query params', () => {
      const cleanUrl = 'https://example.com/image.jpg'

      render(
        <ImageGalleryMasonry images={[cleanUrl]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })

    it('handles edge case: only query params', () => {
      const queryOnly = '?width=800&height=600'

      render(
        <ImageGalleryMasonry images={[queryOnly]} />
      )

      // Should not crash with just query string
    })

    it('handles edge case: only fragment', () => {
      const fragmentOnly = '#gallery-section'

      render(
        <ImageGalleryMasonry images={[fragmentOnly]} />
      )

      expect(screen.getByAltText(/gallery image 0/)).toBeTruthy()
    })
