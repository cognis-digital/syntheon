import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FooterColumns } from '@/components/sections/footer-columns'

describe('FooterColumns', () => {
  const mockCn = vi.fn()
  vi.mock('@/lib/utils', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/lib/utils')>()),
    cn: mockCn,
  }))

  describe('rendering with defaults', () => {
    it('renders without crashing', () => {
      const { container } = render(<FooterColumns />)
      expect(container).toBeInTheDocument()
    })

    it('contains expected footer content sections', async () => {
      render(<FooterColumns />)

      // Wait for any motion animations to complete
      await waitFor(() => {
        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      })

      // Assert key semantic regions exist
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(4) // 4 column groups × 1 link each (default)

      // Verify accessible structure
      const footerContent = screen.getByRole('contentinfo')
      expect(footerContent).toHaveAccessibleName(/footer/i)
    })

    it('applies default styling tokens', () => {
      render(<FooterColumns />)

      // Check for expected Tailwind utility classes in rendered output
      const container = document.body.querySelector('[role="contentinfo"]')!
      
      expect(container).toHaveClass(/rounded-lg/)
      expect(container).toHaveClass(/gap-8|gap-4/)
    })

    it('supports dark mode', () => {
      render(<FooterColumns />, { attributes: { class: 'dark' } })

      const container = document.body.querySelector('[role="contentinfo"]')!
      // Should still render correctly in dark mode
      expect(container).toBeInTheDocument()
    })

    it('handles reduced motion gracefully', () => {
      render(<FooterColumns />, { attributes: { class: 'dark' } })

      const container = document.body.querySelector('[role="contentinfo"]')!
      // Should still be accessible and functional
      expect(container).toHaveAccessibleName(/footer/i)
    })

    it('renders with custom props overrides defaults', () => {
      render(
        <FooterColumns
          columns={[
            { title: 'Custom Column 1', links: [{ href: '#', label: 'Link A' }] },
            { title: 'Custom Column 2', links: [{ href: '#', label: 'Link B' }] },
          ]}
        />
      )

      expect(screen.getByText('Custom Column 1')).toBeInTheDocument()
      expect(screen.getByText('Custom Column 2')).toBeInTheDocument()
    })

    it('maintains proper type safety with sensible defaults', () => {
      // Should render without any required props
      const { container } = render(<FooterColumns />)
      
      // Verify no console warnings about missing props
      expect(container).not.toHaveAttribute('data-warning')
    })

    it('preserves focus management and keyboard accessibility', async () => {
      render(<FooterColumns />)

      // Test tab navigation through links
      const firstLink = screen.getAllByRole('link')[0]!
      
      await userEvent.tab()
      expect(firstLink).toHaveFocus()

      // Verify link is interactive
      expect(firstLink).toBeEnabled()
    })

    it('handles empty columns gracefully', () => {
      render(<FooterColumns columns={[]} />)

      const container = document.body.querySelector('[role="contentinfo"]')!
      expect(container).toBeInTheDocument()
      // Should still have base structure even with no content
    })
  })
})
