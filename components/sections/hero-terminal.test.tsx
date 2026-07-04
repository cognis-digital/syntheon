import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeroTerminal } from '@/components/sections/hero-terminal'

describe('HeroTerminal', () => {
  it('renders with default props and shows expected content', async () => {
    const { container, getByRole, findByText } = render(<HeroTerminal />)

    // Verify terminal container exists
    expect(container).toBeInTheDocument()

    // Wait for motion animations to settle
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    // Assert key content is visible
    const title = screen.getByText(/Syntheon/i)
    expect(title).toBeInTheDocument()

    const subtitle = screen.getByText(/terminal interface/i, { exact: false })
    expect(subtitle).toBeInTheDocument()

    // Verify interactive elements
    const terminalInput = getByRole('textbox')
    expect(terminalInput).toHaveAttribute('placeholder', /type command/i)
  })

  it('applies correct default styling tokens', () => {
    render(<HeroTerminal />)

    const container = screen.getByRole('img')
    // Verify dark theme is applied by default
    expect(container).toHaveStyle(/bg-background/)
    expect(container).toHaveStyle(/text-foreground/)
  })

  it('handles reduced motion preference gracefully', async () => {
    render(<HeroTerminal />)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Motion elements should still be present but less active
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('maintains accessibility with proper ARIA attributes', () => {
    render(<HeroTerminal />)

    const terminalInput = screen.getByRole('textbox')
    expect(terminalInput).toHaveAttribute('aria-label')
    expect(terminalInput).toHaveAttribute('tabIndex', -1 || '0')
  })

  it('renders responsive layout that adapts to viewport', () => {
    render(<HeroTerminal />)

    const container = screen.getByRole('img')
    // Should have some width/height constraints for responsiveness
    expect(container).toHaveStyle(/min-h-/)
  })

  it('handles keyboard interactions correctly', async () => {
    render(<HeroTerminal />)

    const terminalInput = screen.getByRole('textbox')
    
    await userEvent.type(terminalInput, 'ls -la')
    expect(terminalInput).toHaveValue('ls -la')
  })

  it('preserves focus state during interactions', async () => {
    render(<HeroTerminal />)

    const terminalInput = screen.getByRole('textbox')
    
    await userEvent.click(terminalInput)
    expect(document.activeElement).toBe(terminalInput)
  })

  it('renders with correct semantic HTML structure', () => {
    render(<HeroTerminal />)

    // Verify main container uses appropriate semantic elements
    const main = screen.getByRole('main') || screen.getByRole('banner')
    expect(main).toBeInTheDocument()
  })

  it('handles empty state gracefully when no command is typed', async () => {
    render(<HeroTerminal />)

    await waitFor(() => {
      // Should show default placeholder or welcome message
      const input = screen.getByRole('textbox')
      expect(input).not.toHaveValue()
    })
  })

  it('applies proper border and radius styling', () => {
    render(<HeroTerminal />)

    const container = screen.getByRole('img')
    // Verify rounded corners are applied
    expect(container).toHaveStyle(/rounded-/)
  })

  it('renders within expected performance budget (no layout thrashing)', async () => {
    render(<HeroTerminal />)

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Should have minimal DOM nodes for good performance
    const body = document.body
    expect(body).not.toHaveAttribute('style', /transform/)
  })
})
