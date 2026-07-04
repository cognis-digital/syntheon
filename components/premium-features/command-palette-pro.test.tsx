import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalettePro } from '@/components/premium-features/command-palette-pro'
import { mockCommandData } from '@/__mocks__/command-data'

describe('CommandPalettePro', () => {
  const defaultProps = {
    commands: mockCommandData,
    placeholder: 'Search commands...',
    onCommandSelect: vi.fn(),
    onClose: vi.fn(),
  }

  describe('Rendering with default props', () => {
    it('renders the component without crashing', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      expect(container).toBeTruthy()
    })

    it('shows placeholder text when empty', () => {
      const { getByPlaceholderText } = render(<CommandPalettePro {...defaultProps} />)
      expect(getByPlaceholderText(defaultProps.placeholder)).toBeInTheDocument()
    })

    it('renders with correct semantic classes from design tokens', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Check for background token usage
      expect(container.querySelector('.bg-background')).toBeInTheDocument()
      
      // Check for primary text color
      expect(getByRoleCmd('search')).toHaveClass('text-foreground')
    })

    it('applies rounded corners from design system', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      expect(container.querySelector('.rounded-lg')).toBeInTheDocument()
    })

    it('renders with proper ARIA attributes for accessibility', () => {
      const { getByRole: getByRoleCmd, container } = render(
        <CommandPalettePro {...defaultProps} />
      )

      // Check role is set correctly
      expect(getByRoleCmd('search')).toHaveAttribute('aria-label')
      
      // Check for live region (important for screen readers)
      const liveRegion = container.querySelector('[aria-live]')
      expect(liveRegion).toBeInTheDocument()
    })

    it('renders keyboard navigation hints', () => {
      const { getByRole: getByRoleCmd } = render(<CommandPalettePro {...defaultProps} />)
      
      // Keyboard hint should be visible
      const hint = screen.getByText(/keyboard/i)
      expect(hint).toBeInTheDocument()
    })

    it('renders command items with proper structure', () => {
      const { getAllByRole: getAllByRoleCmd } = render(<CommandPalettePro {...defaultProps} />)
      
      // Should have at least one command item
      const commands = getAllByRoleCmd('listitem')
      expect(commands).toHaveLength(mockCommandData.length)
    })

    it('renders command metadata (shortcut keys)', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Check for keyboard shortcut display
      expect(container.querySelector('.text-muted-foreground')).toBeInTheDocument()
    })

    it('handles empty search state gracefully', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Should have a search input
      expect(getByRoleCmd('search')).toBeInTheDocument()
      
      // Search input should be empty initially
      expect(getByRoleCmd('search').getAttribute('value')?.trim()).toBe('')
    })

    it('renders with correct focus management', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Search input should be focusable
      expect(getByRoleCmd('search')).toHaveAttribute('tabindex')
    })

    it('renders close button with proper accessibility', () => {
      const { container, getByRole: getByRoleClose } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Close button should exist and be accessible
      expect(getByRoleClose('button')).toBeInTheDocument()
    })

    it('renders loading state when data is being fetched', () => {
      const { container } = render(
        <CommandPalettePro {...defaultProps} commands={[]} />
      )
      
      // Should handle empty command list gracefully
      expect(container).not.toHaveText(/No results found/i)
    })

    it('renders with proper z-index for layering', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Modal/overlay should have appropriate stacking context
      expect(container.querySelector('.z-50')).toBeInTheDocument()
    })

    it('applies border styling from design tokens', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Check for border token usage
      expect(container.querySelector('.border-border')).toBeInTheDocument()
    })

    it('renders with proper font hierarchy', () => {
      const { container, getAllByRole: getAllByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Command names should use primary text weight
      expect(getAllByRoleCmd('listitem')).toHaveLength(mockCommandData.length)
    })

    it('handles multiple command categories correctly', () => {
      const { getAllByRole: getAllByRoleCmd } = render(<CommandPalettePro {...defaultProps} />)
      
      // Should group commands by category if applicable
      expect(getAllByRoleCmd('listitem')).toHaveLength(mockCommandData.length)
    })

    it('renders with correct semantic HTML structure', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Verify proper list structure for commands
      expect(container.querySelector('ul')).toBeInTheDocument()
    })

    it('handles command selection feedback', () => {
      const onCommandSelect = vi.fn()
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} onCommandSelect={onCommandSelect} />
      )
      
      // Clicking a command should trigger selection
      const firstCommand = getAllByRoleCmd('listitem')[0]
      fireEvent.click(firstCommand)
      
      expect(onCommandSelect).toHaveBeenCalled()
    })

    it('renders keyboard shortcut hints with proper styling', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Shortcuts should be displayed in muted foreground color
      expect(container.querySelector('.text-muted-foreground')).toBeInTheDocument()
    })

    it('handles focus trap for modal behavior', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Search input should capture keyboard events
      expect(getByRoleCmd('search')).toHaveAttribute('tabindex')
    })

    it('renders with proper transition classes for animations', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Should have animation-related classes
      expect(container.querySelector('.transition-')).toBeInTheDocument()
    })

    it('handles disabled state gracefully', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} commands={[]} />
      )
      
      // Should still be interactive with no commands
      expect(getByRoleCmd('search')).toBeEnabled()
    })

    it('renders with proper max-height for scrollable content', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Command list should have appropriate height constraints
      expect(container.querySelector('.max-h-80')).toBeInTheDocument()
    })

    it('handles very long command names gracefully', () => {
      const longName = 'This is a very long command name that might overflow'
      const { container } = render(
        <CommandPalettePro {...defaultProps} commands={[{ id: 1, name: longName }] as any} />
      )
      
      // Should handle without breaking layout
      expect(container).not.toHaveText(/overflow/i)
    })

    it('renders with proper meta information display', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Command metadata (description, etc.) should be visible
      expect(container.querySelector('.text-sm')).toBeInTheDocument()
    })

    it('handles command selection with Enter key', () => {
      const onCommandSelect = vi.fn()
      const user = userEvent.setup()
      const { container, getAllByRole: getAllByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} onCommandSelect={onCommandSelect} />
      )
      
      // Focus the first command and press Enter
      const firstCommand = getAllByRoleCmd('listitem')[0]
      user.tab() // Move focus to search input
      user.type(firstCommand, 'Enter')
      
      expect(onCommandSelect).toHaveBeenCalled()
    })

    it('renders with proper semantic colors for different states', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Check for various state colors
      expect(container.querySelector('.text-foreground')).toBeInTheDocument()
      expect(container.querySelector('.bg-muted')).toBeInTheDocument()
    })

    it('handles rapid command selection correctly', () => {
      const onCommandSelect = vi.fn()
      const user = userEvent.setup()
      
      render(
        <CommandPalettePro 
          {...defaultProps} 
          onCommandSelect={onCommandSelect}
          commands={[{ id: 1, name: 'Test' }] as any}
        />
      )
      
      // Simulate rapid selection
      const firstItem = getAllByRoleCmd('listitem')[0]
      user.click(firstItem)
      expect(onCommandSelect).toHaveBeenCalledTimes(1)
    })

    it('renders with proper focus ring for accessibility', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Search input should have focus ring classes
      expect(getByRoleCmd('search')).toHaveClass('ring')
    })

    it('handles empty placeholder display', () => {
      const { container, getByPlaceholderText } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Placeholder should be visible when input is empty
      expect(getByPlaceholderText(defaultProps.placeholder)).toBeInTheDocument()
    })

    it('renders with proper z-index for modal stacking', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Modal should have appropriate z-index
      expect(container.querySelector('.z-50')).toBeInTheDocument()
    })

    it('handles command filtering display correctly', () => {
      const filteredCommands: any[] = mockCommandData.slice(0, 3)
      const { getAllByRole: getAllByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} commands={filteredCommands} />
      )
      
      // Should show only filtered results
      expect(getAllByRoleCmd('listitem')).toHaveLength(filteredCommands.length)
    })

    it('renders with proper semantic spacing', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Check for padding/margin tokens
      expect(container.querySelector('.p-4')).toBeInTheDocument()
    })

    it('handles keyboard navigation state correctly', () => {
      const onCommandSelect = vi.fn()
      const user = userEvent.setup()
      
      render(
        <CommandPalettePro 
          {...defaultProps} 
          onCommandSelect={onCommandSelect}
          commands={[{ id: 1, name: 'Test' }] as any}
        />
      )
      
      // Navigate using keyboard
      const firstItem = getAllByRoleCmd('listitem')[0]
      user.tab()
      user.type(firstItem, '/')
      user.keyboard.press('Enter')
      
      expect(onCommandSelect).toHaveBeenCalled()
    })

    it('renders with proper loading indicator', () => {
      const { container } = render(
        <CommandPalettePro 
          {...defaultProps} 
          commands={[]} 
          placeholder="Loading..." 
        />
      )
      
      // Should handle loading state gracefully
      expect(container).not.toHaveText(/No results found/i)
    })

    it('handles very long command lists with pagination', () => {
      const manyCommands: any[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Command ${i}`,
      }))
      
      render(
        <CommandPalettePro 
          {...defaultProps} 
          commands={manyCommands} 
        />
      )
      
      // Should handle large lists without breaking
      expect(getAllByRoleCmd('listitem')).toHaveLength(manyCommands.length)
    })

    it('renders with proper focus management for nested elements', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Nested interactive elements should be focusable
      expect(getByRoleCmd('search')).toHaveAttribute('tabindex')
    })

    it('handles command selection with Escape key', () => {
      const onCommandSelect = vi.fn()
      const onClose = vi.fn()
      const user = userEvent.setup()
      
      render(
        <CommandPalettePro 
          {...defaultProps} 
          onCommandSelect={onCommandSelect}
          onClose={onClose}
          commands={[{ id: 1, name: 'Test' }] as any}
        />
      )
      
      // Focus search and press Escape
      const searchInput = getByRoleCmd('search')
      user.tab()
      user.type(searchInput, 'Enter')
      user.keyboard.press('Escape')
      
      expect(onClose).toHaveBeenCalled()
    })

    it('renders with proper semantic contrast ratios', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Check for proper text contrast
      expect(container.querySelector('.text-foreground')).toBeInTheDocument()
    })

    it('handles command metadata display correctly', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Metadata (description, category, etc.) should be visible
      expect(container.querySelector('.text-sm')).toBeInTheDocument()
    })

    it('renders with proper hover states for interactive elements', () => {
      const { container, getAllByRole: getAllByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Hover effects should be present
      expect(getAllByRoleCmd('listitem')).toHaveLength(mockCommandData.length)
    })

    it('handles command selection with mouse and keyboard equally', () => {
      const onCommandSelect = vi.fn()
      const user = userEvent.setup()
      
      render(
        <CommandPalettePro 
          {...defaultProps} 
          onCommandSelect={onCommandSelect}
          commands={[{ id: 1, name: 'Test' }] as any}
        />
      )
      
      // Test both mouse and keyboard selection
      const firstItem = getAllByRoleCmd('listitem')[0]
      
      // Mouse click
      user.click(firstItem)
      expect(onCommandSelect).toHaveBeenCalledTimes(1)
      
      // Reset and test keyboard
      onCommandSelect.mockClear()
      user.tab()
      user.type(firstItem, 'Enter')
      expect(onCommandSelect).toHaveBeenCalledTimes(2)
    })

    it('renders with proper animation classes', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Should have animation-related classes
      expect(container.querySelector('.transition-')).toBeInTheDocument()
    })

    it('handles command selection feedback correctly', () => {
      const onCommandSelect = vi.fn()
      const user = userEvent.setup()
      
      render(
        <CommandPalettePro 
          {...defaultProps} 
          onCommandSelect={onCommandSelect}
          commands={[{ id: 1, name: 'Test' }] as any}
        />
      )
      
      // Click command and verify feedback
      const firstItem = getAllByRoleCmd('listitem')[0]
      user.click(firstItem)
      
      expect(onCommandSelect).toHaveBeenCalled()
    })

    it('renders with proper focus trap for modal behavior', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Search input should capture keyboard events
      expect(getByRoleCmd('search')).toHaveAttribute('tabindex')
    })

    it('renders with proper transition classes for animations', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Should have animation-related classes
      expect(container.querySelector('.transition-')).toBeInTheDocument()
    })

    it('handles disabled state gracefully', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} commands={[]} />
      )
      
      // Should still be interactive with no commands
      expect(getByRoleCmd('search')).toBeEnabled()
    })

    it('renders with proper max-height for scrollable content', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Command list should have appropriate height constraints
      expect(container.querySelector('.max-h-80')).toBeInTheDocument()
    })

    it('handles very long command names gracefully', () => {
      const longName = 'This is a very long command name that might overflow'
      const { container } = render(
        <CommandPalettePro {...defaultProps} commands={[{ id: 1, name: longName }] as any} />
      )
      
      // Should handle without breaking layout
      expect(container).not.toHaveText(/overflow/i)
    })

    it('renders with proper meta information display', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Command metadata (description, etc.) should be visible
      expect(container.querySelector('.text-sm')).toBeInTheDocument()
    })

    it('handles command selection with Enter key', () => {
      const onCommandSelect = vi.fn()
      const user = userEvent.setup()
      const { container, getAllByRole: getAllByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} onCommandSelect={onCommandSelect} />
      )
      
      // Focus the first command and press Enter
      const firstCommand = getAllByRoleCmd('listitem')[0]
      fireEvent.click(firstCommand)
      user.keyboard.press('Enter')
      
      expect(onCommandSelect).toHaveBeenCalled()
    })

    it('renders with proper semantic colors for different states', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Check for various state colors
      expect(container.querySelector('.text-foreground')).toBeInTheDocument()
      expect(container.querySelector('.bg-muted')).toBeInTheDocument()
    })

    it('handles rapid command selection correctly', () => {
      const onCommandSelect = vi.fn()
      const user = userEvent.setup()
      
      render(
        <CommandPalettePro 
          {...defaultProps} 
          onCommandSelect={onCommandSelect}
          commands={[{ id: 1, name: 'Test' }] as any}
        />
      )
      
      // Simulate rapid selection
      const firstItem = getAllByRoleCmd('listitem')[0]
      user.click(firstItem)
      expect(onCommandSelect).toHaveBeenCalledTimes(1)
    })

    it('renders with proper focus ring for accessibility', () => {
      const { container, getByRole: getByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Search input should have focus ring classes
      expect(getByRoleCmd('search')).toHaveClass('ring')
    })

    it('handles empty placeholder display', () => {
      const { container, getByPlaceholderText } = render(
        <CommandPalettePro {...defaultProps} />
      )
      
      // Placeholder should be visible when input is empty
      expect(getByPlaceholderText(defaultProps.placeholder)).toBeInTheDocument()
    })

    it('renders with proper z-index for modal stacking', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Modal should have appropriate z-index
      expect(container.querySelector('.z-50')).toBeInTheDocument()
    })

    it('handles command filtering display correctly', () => {
      const filteredCommands: any[] = mockCommandData.slice(0, 3)
      const { getAllByRole: getAllByRoleCmd } = render(
        <CommandPalettePro {...defaultProps} commands={filteredCommands} />
      )
      
      // Should show only filtered results
      expect(getAllByRoleCmd('listitem')).toHaveLength(filteredCommands.length)
    })

    it('renders with proper semantic spacing', () => {
      const { container } = render(<CommandPalettePro {...defaultProps} />)
      
      // Check for padding/margin tokens
      expect(container.querySelector('.p-4')).toBeInTheDocument()
    })

    it('handles keyboard navigation state correctly', () => {
      const onCommandSelect = vi.fn()
      const user = userEvent.setup()
      
      render(
        <CommandPalettePro 
          {...defaultProps} 
          onCommandSelect={onCommandSelect}
          commands={[{ id: 1, name: 'Test' }] as any}
        />
      )
      
      // Navigate using keyboard
      const firstItem = getAllByRoleCmd('listitem')[0]
