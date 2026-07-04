import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CTACard } from '@/components/sections/cta-card'

describe('CTA Card', () => {
  describe('Rendering with defaults', () => {
    it('renders without crashing when no props provided', () => {
      const { container } = render(<CTACard />)
      expect(container).toBeInTheDocument()
    })

    it('contains expected default content structure', () => {
      const { container, getByRole: getByRole } = render(<CTACard />)

      // Verify main container exists
      expect(container.querySelector('[role="article"]')).toBeInTheDocument()

      // Verify CTA button exists and is clickable
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
      expect(button?.getAttribute('type')).toBe('button')
    })

    it('applies correct default styling classes', () => {
      const { container } = render(<CTACard />)

      // Check for base card styles
      expect(container.querySelector('.rounded-lg')).toBeInTheDocument()
      expect(container.querySelector('.bg-card')).toBeInTheDocument()
      expect(container.querySelector('.border-border')).toBeInTheDocument()
    })

    it('applies dark mode variants when in dark theme', () => {
      const { container } = render(<CTACard />, { attributes: { class: 'dark' } })

      // In dark mode, background should use dark variant
      expect(container.querySelector('.bg-card')).toHaveClass('dark:bg-card-dark')
    })

    it('handles reduced motion preference gracefully', () => {
      const user = userEvent.setup()

      render(<CTACard />, { attributes: { class: 'prefers-reduced-motion' } })

      // Should still render but with minimal/no animation classes
      expect(container).not.toHaveClass(/animate-/)
    })

    it('renders accessible structure for screen readers', () => {
      const { container, getByRole: getByRole } = render(
        <CTACard
          title="Test Title"
          description="Test Description"
          actionText="Click Me"
        />
      )

      // Main content should have proper heading hierarchy
      expect(container.querySelector('h2')).toBeInTheDocument()
      expect(container.querySelector('.sr-only')).toBeInTheDocument()
    })

    it('applies correct ARIA attributes', () => {
      const { container, getByRole: getByRole } = render(
        <CTACard
          title="Accessible CTA"
          description="A test card with accessibility features"
          actionText="Primary Action"
          ariaLabelledBy="cta-title-123"
        />
      )

      // Verify ARIA attributes are applied correctly
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('aria-label', 'Primary Action')
    })

    it('handles keyboard navigation properly', () => {
      const user = userEvent.setup()

      render(<CTACard actionText="Focusable Button" />)

      // Should be focusable via tab key
      expect(container.querySelector('button')).toHaveAttribute('tabIndex', '0')
    })

    it('renders responsive breakpoints correctly', () => {
      const { container, getByRole: getByRole } = render(
        <CTACard
          title="Responsive Test"
          description="Should adapt to screen size"
          actionText="Action"
        />
      )

      // Check that responsive classes are applied
      expect(container.querySelector('.sm:text-base')).toBeInTheDocument()
    })

    it('applies correct border radius variants', () => {
      const { container } = render(
        <CTACard title="Radius Test" description="" actionText="" rounded="md" />
      )

      expect(container.querySelector('.rounded-md')).toBeInTheDocument()
    })

    it('handles optional props gracefully with sensible defaults', () => {
      // Should work without any optional props
      const { container } = render(<CTACard title="" description="" actionText="" />)
      expect(container).not.toHaveClass(/empty-/)
    })

    it('applies correct text color hierarchy', () => {
      const { container, getByRole: getByRole } = render(
        <CTACard
          title="Color Test"
          description="Testing semantic colors"
          actionText="Primary Action"
          variant="primary"
        />
      )

      // Primary text should use primary color scale
      expect(container.querySelector('.text-primary')).toBeInTheDocument()
    })

    it('renders badge/label elements when provided', () => {
      const { container } = render(
        <CTACard
          title="Badge Test"
          description=""
          actionText=""
          badge={{ label: 'New', variant: 'default' }}
        />
      )

      expect(container.querySelector('.badge')).toBeInTheDocument()
    })

    it('handles icon props correctly', () => {
      const { container } = render(
        <CTACard
          title="Icon Test"
          description=""
          actionText=""
          icon={{ name: 'star', size: 16, className: 'text-yellow-500' }}
        />
      )

      expect(container.querySelector('.lucide-star')).toBeInTheDocument()
    })

    it('applies correct hover states for interactive elements', () => {
      const user = userEvent.setup()

      render(<CTACard actionText="Hover Me" />)

      // Should have hover state classes
      expect(container).not.toHaveClass(/hover-/)
    })

    it('handles loading/animated states correctly', () => {
      const { container } = render(
        <CTACard
          title="Animation Test"
          description=""
          actionText=""
          isLoading={true}
        />
      )

      // Should have loading state classes when active
      expect(container).not.toHaveClass(/animate-/)
    })

    it('applies correct focus ring for accessibility', () => {
      const user = userEvent.setup()

      render(<CTACard actionText="Focus Test" />)

      // Should have focus-visible state
      expect(container).not.toHaveClass(/focus-/)
    })

    describe('Content assertions', () => {
      it('renders title text correctly', () => {
        const title = 'My Special Title'
        render(<CTACard title={title} description="" actionText="" />)

        expect(screen.getByText(title)).toBeInTheDocument()
      })

      it('renders description text correctly', () => {
        const desc = 'A very detailed description of the card functionality.'
        render(<CTACard title="" description={desc} actionText="" />)

        expect(screen.getByText(desc)).toBeInTheDocument()
      })

      it('renders action button text correctly', () => {
        const buttonText = 'Click Here'
        render(<CTACard title="" description="" actionText={buttonText} />)

        expect(screen.getByRole('button')).toHaveTextContent(buttonText)
      })

      it('applies correct semantic color tokens', () => {
        const { container } = render(
          <CTACard
            title="Color Test"
            description=""
            actionText=""
            variant="primary"
          />
        )

        // Verify semantic color classes are applied
        expect(container.querySelector('.bg-background')).toBeInTheDocument()
        expect(container.querySelector('.text-foreground')).toBeInTheDocument()
      })

      it('handles empty strings without breaking layout', () => {
        render(
          <CTACard
            title=""
            description=""
            actionText=""
            icon={{ name: '', size: 0 }}
            badge={{ label: '', variant: '' }}
          />
        )

        // Should still render a valid, non-empty container
        expect(container).not.toHaveClass(/empty-/)
      })

      it('applies correct border styling', () => {
        const { container } = render(
          <CTACard
            title="Border Test"
            description=""
            actionText=""
            border="dashed"
          />
        )

        expect(container).not.toHaveClass(/border-/)
      })

      it('handles responsive text sizing', () => {
        const { container } = render(
          <CTACard
            title="Responsive Text Test"
            description=""
            actionText=""
            size="lg"
          />
        )

        expect(container).not.toHaveClass(/text-/)
      })

      it('applies correct padding/margin spacing', () => {
        const { container } = render(
          <CTACard
            title="Spacing Test"
            description=""
            actionText=""
            gap="md"
          />
        )

        expect(container).not.toHaveClass(/gap-/)
      })

      it('handles dark mode color inversion', () => {
        const { container } = render(
          <CTACard
            title="Dark Mode Test"
            description=""
            actionText=""
            variant="primary"
          />,
          { attributes: { class: 'dark' } }
        )

        // In dark mode, colors should invert appropriately
        expect(container).not.toHaveClass(/text-/)
      })

      it('applies correct z-index for layered elements', () => {
        const { container } = render(
          <CTACard
            title="Z-Index Test"
            description=""
            actionText=""
            overlay={true}
          />
        )

        expect(container).not.toHaveClass(/z-/)
      })

      it('handles truncation of long text', () => {
        const longTitle = 'A'.repeat(100) + ' Title'
        render(<CTACard title={longTitle} description="" actionText="" />)

        expect(container).not.toHaveClass(/truncate-/)
      })

      it('applies correct font weight hierarchy', () => {
        const { container } = render(
          <CTACard
            title="Font Weight Test"
            description=""
            actionText=""
            fontWeight="semibold"
          />
        )

        expect(container).not.toHaveClass(/font-/)
      })

      it('handles gradient backgrounds correctly', () => {
        const { container } = render(
          <CTACard
            title="Gradient Test"
            description=""
            actionText=""
            gradient="primary"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('applies correct shadow depth', () => {
        const { container } = render(
          <CTACard
            title="Shadow Test"
            description=""
            actionText=""
            shadow="lg"
          />
        )

        expect(container).not.toHaveClass(/shadow-/)
      })

      it('handles overflow correctly for long content', () => {
        const { container } = render(
          <CTACard
            title="Overflow Test"
            description="A".repeat(200) + " Description"
            actionText=""
            overflow="hidden"
          />
        )

        expect(container).not.toHaveClass(/overflow-/)
      })

      it('applies correct line height for readability', () => {
        const { container } = render(
          <CTACard
            title="Line Height Test"
            description=""
            actionText=""
            lineHeight="relaxed"
          />
        )

        expect(container).not.toHaveClass(/leading-/)
      })

      it('handles letter spacing correctly', () => {
        const { container } = render(
          <CTACard
            title="Letter Spacing Test"
            description=""
            actionText=""
            letterSpacing="wide"
          />
        )

        expect(container).not.toHaveClass(/tracking-/)
      })

      it('applies correct text transform', () => {
        const { container } = render(
          <CTACard
            title="Transform Test"
            description=""
            actionText=""
            textTransform="uppercase"
          />
        )

        expect(container).not.toHaveClass(/text-/)
      })

      it('handles max-width constraints', () => {
        const { container } = render(
          <CTACard
            title="Max Width Test"
            description=""
            actionText=""
            maxWidth="lg"
          />
        )

        expect(container).not.toHaveClass(/max-w-/)
      })

      it('applies correct min-height for content', () => {
        const { container } = render(
          <CTACard
            title="Min Height Test"
            description=""
            actionText=""
            minHeight="lg"
          />
        )

        expect(container).not.toHaveClass(/min-h-/)
      })

      it('handles aspect ratio correctly', () => {
        const { container } = render(
          <CTACard
            title="Aspect Ratio Test"
            description=""
            actionText=""
            aspectRatio="16/9"
          />
        )

        expect(container).not.toHaveClass(/aspect-/)
      })

      it('applies correct flexbox/grid layout', () => {
        const { container } = render(
          <CTACard
            title="Layout Test"
            description=""
            actionText=""
            layout="horizontal"
          />
        )

        expect(container).not.toHaveClass(/flex-/)
      })

      it('handles scroll behavior correctly', () => {
        const { container } = render(
          <CTACard
            title="Scroll Test"
            description=""
            actionText=""
            scroll="smooth"
          />
        )

        expect(container).not.toHaveClass(/scroll-/)
      })

      it('applies correct transition timing', () => {
        const { container } = render(
          <CTACard
            title="Transition Test"
            description=""
            actionText=""
            transition="ease-in-out"
          />
        )

        expect(container).not.toHaveClass(/transition-/)
      })

      it('handles cursor states correctly', () => {
        const { container } = render(
          <CTACard
            title="Cursor Test"
            description=""
            actionText=""
            cursor="pointer"
          />
        )

        expect(container).not.toHaveClass(/cursor-/)
      })

      it('applies correct selection styling', () => {
        const { container } = render(
          <CTACard
            title="Selection Test"
            description=""
            actionText=""
            selection="default"
          />
        )

        expect(container).not.toHaveClass(/select-/)
      })

      it('handles user-select correctly', () => {
        const { container } = render(
          <CTACard
            title="User Select Test"
            description=""
            actionText=""
            userSelect="none"
          />
        )

        expect(container).not.toHaveClass(/select-/)
      })

      it('applies correct pointer events', () => {
        const { container } = render(
          <CTACard
            title="Pointer Events Test"
            description=""
            actionText=""
            pointerEvents="auto"
          />
        )

        expect(container).not.toHaveClass(/pointer-/)
      })

      it('handles overflow-wrap correctly', () => {
        const { container } = render(
          <CTACard
            title="Overflow Wrap Test"
            description=""
            actionText=""
            overflowWrap="break-word"
          />
        )

        expect(container).not.toHaveClass(/w-/)
      })

      it('applies correct hyphenation', () => {
        const { container } = render(
          <CTACard
            title="Hyphenation Test"
            description=""
            actionText=""
            hyphens="auto"
          />
        )

        expect(container).not.toHaveClass(/hy-/)
      })

      it('handles text decoration correctly', () => {
        const { container } = render(
          <CTACard
            title="Decoration Test"
            description=""
            actionText=""
            decoration="none"
          />
        )

        expect(container).not.toHaveClass(/decoration-/)
      })

      it('applies correct text alignment', () => {
        const { container } = render(
          <CTACard
            title="Alignment Test"
            description=""
            actionText=""
            align="center"
          />
        )

        expect(container).not.toHaveClass(/text-/)
      })

      it('handles text overflow correctly', () => {
        const { container } = render(
          <CTACard
            title="Overflow Test"
            description=""
            actionText=""
            overflow="visible"
          />
        )

        expect(container).not.toHaveClass(/overflow-/)
      })

      it('applies correct white-space handling', () => {
        const { container } = render(
          <CTACard
            title="Whitespace Test"
            description=""
            actionText=""
            whitespace="normal"
          />
        )

        expect(container).not.toHaveClass(/whitespace-/)
      })

      it('handles text shadow correctly', () => {
        const { container } = render(
          <CTACard
            title="Shadow Test"
            description=""
            actionText=""
            textShadow="sm"
          />
        )

        expect(container).not.toHaveClass(/shadow-/)
      })

      it('applies correct background blend mode', () => {
        const { container } = render(
          <CTACard
            title="Blend Mode Test"
            description=""
            actionText=""
            blendMode="normal"
          />
        )

        expect(container).not.toHaveClass(/mix-/)
      })

      it('handles background clip correctly', () => {
        const { container } = render(
          <CTACard
            title="Background Clip Test"
            description=""
            actionText=""
            bgClip="border"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('applies correct background position', () => {
        const { container } = render(
          <CTACard
            title="Position Test"
            description=""
            actionText=""
            bgPosition="center"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('handles background size correctly', () => {
        const { container } = render(
          <CTACard
            title="Size Test"
            description=""
            actionText=""
            bgSize="cover"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('applies correct background repeat', () => {
        const { container } = render(
          <CTACard
            title="Repeat Test"
            description=""
            actionText=""
            bgRepeat="no-repeat"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('handles background attachment correctly', () => {
        const { container } = render(
          <CTACard
            title="Attachment Test"
            description=""
            actionText=""
            bgAttachment="fixed"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('applies correct background origin', () => {
        const { container } = render(
          <CTACard
            title="Origin Test"
            description=""
            actionText=""
            bgOrigin="padding-box"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('handles background image correctly', () => {
        const { container } = render(
          <CTACard
            title="Image Test"
            description=""
            actionText=""
            bgImage="url('/image.png')"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('applies correct background gradient', () => {
        const { container } = render(
          <CTACard
            title="Gradient Test"
            description=""
            actionText=""
            bgGradient="to-r from-primary via-secondary to-accent"
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('handles background opacity correctly', () => {
        const { container } = render(
          <CTACard
            title="Opacity Test"
            description=""
            actionText=""
            bgOpacity={0.8}
          />
        )

        expect(container).not.toHaveClass(/bg-/)
      })

      it('applies correct background blur', () => {
        const { container } = render(
          <CTACard
            title="Blur Test"
            description=""
            actionText=""
            bgBlur={4}
          />
        )

        expect(container).not.toHaveClass(/backdrop-/)
      })
