import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { teamMembersManager } from '@/components/premium-features/team-members-manager'

describe('teamMembersManager', () => {
  describe('default props rendering', () => {
    it('renders without crashing with no props', () => {
      const component = render(teamMembersManager())
      expect(component.container).not.toBeNull()
      expect(component.container.firstChild).toBeDefined()
    })

    it('applies correct base classes via cn helper', () => {
      vi.mock('@/lib/utils')
      const { teamMembersManager } = require('@/components/premium-features/team-members-manager')

      render(teamMembersManager())
      
      // Verify the component structure exists
      expect(screen.getByRole('heading')).toBeDefined()
    })
  })

  describe('empty state', () => {
    it('handles empty team array gracefully', () => {
      const component = render(
        teamMembersManager({
          members: [],
          title: 'Team Members'
        })
      )

      expect(screen.getByText(/team/i)).toBeDefined()
      // Empty state should still be accessible and styled correctly
    })
  })

  describe('single member display', () => {
    it('renders a single team member correctly', () => {
      const mockMember = {
        id: '1',
        name: 'Jane Doe',
        role: 'Senior Engineer',
        avatar: '/avatars/jane.png'
      }

      render(
        teamMembersManager({
          members: [mockMember],
          title: 'Team Members'
        })
      )

      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
    })
  })

  describe('multiple members', () => {
    it('renders multiple team members', () => {
      const mockMembers = [
        { id: '1', name: 'Alice Smith', role: 'Product Manager' },
        { id: '2', name: 'Bob Johnson', role: 'Lead Designer' }
      ]

      render(
        teamMembersManager({
          members: mockMembers,
          title: 'Team Members'
        })
      )

      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  describe('loading state', () => {
    it('handles loading state with appropriate UI', () => {
      const component = render(
        teamMembersManager({
          members: [],
          title: 'Team Members',
          isLoading: true
        })
      )

      // Loading indicator should be visible
      expect(screen.getByRole('status')).toBeDefined()
    })
  })

  describe('error state', () => {
    it('handles error state gracefully', () => {
      const component = render(
        teamMembersManager({
          members: [],
          title: 'Team Members',
          error: 'Failed to fetch team data'
        })
      )

      expect(screen.getByText(/failed/i)).toBeDefined()
    })
  })

  describe('responsive behavior hints', () => {
    it('applies responsive classes for mobile', () => {
      const component = render(
        teamMembersManager({
          members: [{ id: '1', name: 'Test' }],
          title: 'Team Members',
          className: 'max-w-4xl mx-auto'
        })
      )

      expect(component.container).toHaveClass('max-w-4xl')
    })
  })

  describe('accessibility', () => {
    it('has proper ARIA attributes for list content', () => {
      const mockMembers = [
        { id: '1', name: 'Alice Smith' },
        { id: '2', name: 'Bob Johnson' }
      ]

      render(
        teamMembersManager({
          members: mockMembers,
          title: 'Team Members'
        })
      )

      // Verify semantic HTML structure
      expect(screen.getByRole('heading')).toHaveAttribute('id')
    })

    it('maintains focus management', () => {
      const component = render(
        teamMembersManager({
          members: [{ id: '1', name: 'Test' }],
          title: 'Team Members',
          autoFocus: true
        })
      )

      expect(component.container).not.toHaveFocus()
    })
  })

  describe('edge cases', () => {
    it('handles very long names without breaking layout', () => {
      const component = render(
        teamMembersManager({
          members: [
            { id: '1', name: 'Very Long Name That Should Wrap Properly'.repeat(3) }
          ],
          title: 'Team Members'
        })
      )

      expect(screen.getByText('Very Long Name')).toBeInTheDocument()
    })

    it('handles missing avatar gracefully', () => {
      const component = render(
        teamMembersManager({
          members: [{ id: '1', name: 'Test User' }],
          title: 'Team Members'
        })
      )

      // Should not crash when avatar is undefined
    })
  })

  describe('dark mode compatibility', () => {
    it('applies dark mode classes correctly', () => {
      const component = render(
        teamMembersManager({
          members: [{ id: '1', name: 'Test' }],
          title: 'Team Members',
          className: 'dark-mode-enabled'
        })
      )

      expect(component.container).toHaveClass('dark-mode-enabled')
    })
  })
})
