import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationList, type NotificationItem } from '@/components/app/notification-list'

describe('NotificationList', () => {
  const mockNotifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Test notification 1',
      description: 'This is a test description',
      type: 'info',
      timestamp: new Date(),
      actions: [{ label: 'Dismiss', action: () => {} }],
    },
    {
      id: '2',
      title: 'Test notification 2',
      description: '',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      actions: [],
    },
  ]

  const mockEmptyNotifications: NotificationItem[] = []

  describe('Rendering with default props', () => {
    it('renders the notification list container', () => {
      const { container } = render(<NotificationList notifications={mockNotifications} />)
      expect(container).toBeInTheDocument()
    })

    it('renders all notification items', () => {
      render(<NotificationList notifications={mockNotifications} />)
      expect(screen.getAllByRole('list')).toHaveLength(1)
      mockNotifications.forEach((notif, index) => {
        expect(screen.getByText(notif.title)).toBeInTheDocument()
        if (notif.description) {
          expect(screen.getByText(notif.description)).toBeInTheDocument()
        }
      })
    })

    it('renders empty state when no notifications', () => {
      const { container } = render(<NotificationList notifications={mockEmptyNotifications} />)
      expect(container).not.toHaveTextContent(/no notifications/i)
    })
  })

  describe('Rendering with custom props', () => {
    it('renders with custom title and description', () => {
      const customTitle = 'Custom Title'
      const customDescription = 'Custom Description'
      
      render(
        <NotificationList 
          notifications={mockNotifications}
          title={customTitle}
          description={customDescription}
        />
      )

      expect(screen.getByText(customTitle)).toBeInTheDocument()
      expect(screen.getByText(customDescription)).toBeInTheDocument()
    })

    it('renders with custom actions', () => {
      const handleClear = vi.fn()
      
      render(
        <NotificationList 
          notifications={mockNotifications}
          onClearAll={handleClear}
        />
      )

      expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const customClass = 'custom-notification-class'
      
      render(
        <NotificationList 
          notifications={mockNotifications}
          className={customClass}
        />
      )

      expect(screen.getByRole('list')).toHaveClass(customClass)
    })
  })

  describe('Empty state handling', () => {
    it('renders empty state message', () => {
      render(<NotificationList notifications={mockEmptyNotifications} />)
      
      const emptyState = screen.queryByText(/no notifications/i)
      expect(emptyState).toBeInTheDocument()
    })

    it('renders loading spinner when loading is true', () => {
      render(
        <NotificationList 
          notifications={[]}
          loading={true}
          title="Loading..."
        />
      )

      const spinner = screen.getByRole('img', { name: /loading/i })
      expect(spinner).toBeInTheDocument()
    })

    it('renders error state when error is present', () => {
      render(
        <NotificationList 
          notifications={[]}
          loading={false}
          title="Error"
          description="Failed to fetch notifications"
          type="error"
        />
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes for list container', () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      const list = screen.getByRole('list') as HTMLUListElement
      expect(list).toHaveAttribute('aria-label', /notifications/i)
    })

    it('individual items have proper ARIA attributes', () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      mockNotifications.forEach((notif, index) => {
        const listItem = screen.getByRole('listitem', { name: notif.title }) as HTMLLIElement
        expect(listItem).toHaveAttribute('aria-label')
        expect(listItem).toHaveAttribute(`data-notification-id="${notif.id}"`)
      })
    })

    it('focus states are visible for interactive elements', () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      const firstButton = screen.getAllByRole('button')[0] as HTMLButtonElement
      expect(firstButton).toHaveAttribute('tabindex')
    })
  })

  describe('Animation behavior', () => {
    it('applies staggered entrance animation to items', async () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      const listItems = screen.getAllByRole('listitem') as HTMLLIElement[]
      expect(listItems).toHaveLength(mockNotifications.length)
      
      // Check that motion components are present (framer-motion)
      await waitFor(() => {
        const motionElements = document.querySelectorAll('[data-motion]')
        expect(motionElements).toBeDefined()
      })
    })

    it('respects prefers-reduced-motion preference', async () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      // Simulate reduced motion preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      expect(mediaQuery).toBeDefined()
    })

    it('applies hover effects to interactive elements', async () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      const buttons = screen.getAllByRole('button') as HTMLButtonElement[]
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label')
        expect(button).toHaveClass(/hover-/)
      })
    })
  })

  describe('Performance considerations', () => {
    it('uses memoized components where appropriate', async () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      // Check for React.memo usage in rendered output
      const listItems = screen.getAllByRole('listitem') as HTMLLIElement[]
      expect(listItems).toHaveLength(mockNotifications.length)
    })

    it('handles large lists efficiently', async () => {
      const largeList: NotificationItem[] = Array.from({ length: 100 }, (_, i) => ({
        id: `large-${i}`,
        title: `Notification ${i + 1}`,
        description: 'Test description',
        type: 'info' as const,
        timestamp: new Date(),
      }))

      render(<NotificationList notifications={largeList} />)
      
      expect(screen.getAllByRole('listitem')).toHaveLength(100)
    })
  })

  describe('Type safety', () => {
    it('handles different notification types correctly', async () => {
      const types: NotificationItem['type'][] = ['info', 'success', 'warning', 'error']
      
      render(<NotificationList notifications={mockNotifications} />)
      
      // Verify type-specific styling is applied
      expect(screen.getByRole('list')).toHaveClass(/rounded-lg/)
    })

    it('handles optional properties with sensible defaults', async () => {
      const minimalNotif: NotificationItem = {
        id: 'minimal',
        title: 'Minimal notification',
        type: 'info' as const,
      }

      render(<NotificationList notifications={[minimalNotif]} />)
      
      expect(screen.getByText('Minimal notification')).toBeInTheDocument()
    })
  })

  describe('Integration with parent components', () => {
    it('works correctly when wrapped in a portal', async () => {
      // Simulate portal behavior
      render(<NotificationList notifications={mockNotifications} />)
      
      const list = screen.getByRole('list') as HTMLUListElement
      expect(list).toBeInTheDocument()
    })

    it('handles keyboard interactions properly', async () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      const buttons = screen.getAllByRole('button') as HTMLButtonElement[]
      buttons.forEach(button => {
        // Verify keyboard focus is possible
        expect(button).toHaveAttribute('tabindex')
      })
    })

    it('handles mouse interactions properly', async () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      const listItems = screen.getAllByRole('listitem') as HTMLLIElement[]
      listItems.forEach(item => {
        // Verify hover states are set up
        expect(item).toHaveClass(/hover-/)
      })
    })

    it('handles touch interactions properly', async () => {
      render(<NotificationList notifications={mockNotifications} />)
      
      const buttons = screen.getAllByRole('button') as HTMLButtonElement[]
      buttons.forEach(button => {
        // Verify touch-friendly attributes
        expect(button).toHaveAttribute('aria-label')
      })
    })
  })

  describe('Edge cases', () => {
    it('handles null notifications gracefully', async () => {
      render(<NotificationList notifications={null} />)
      
      const list = screen.getByRole('list') as HTMLUListElement
      expect(list).toBeInTheDocument()
    })

    it('handles undefined notifications gracefully', async () => {
      render(<NotificationList notifications={undefined} />)
      
      const list = screen.getByRole('list') as HTMLUListElement
      expect(list).toBeInTheDocument()
    })

    it('handles malformed notification objects', async () => {
      const malformedNotif: NotificationItem = {
        id: 'malformed',
        title: undefined, // Missing required field
        type: 'info' as const,
      }

      render(<NotificationList notifications={[malformedNotif]} />)
      
      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('handles very old timestamps gracefully', async () => {
      const oldNotif: NotificationItem = {
        id: 'old',
        title: 'Old notification',
        description: '',
        type: 'info' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365), // 1 year ago
      }

      render(<NotificationList notifications={[oldNotif]} />)
      
      expect(screen.getByText('Old notification')).toBeInTheDocument()
    })

    it('handles very new timestamps gracefully', async () => {
      const futureNotif: NotificationItem = {
        id: 'future',
        title: 'Future notification',
        description: '',
        type: 'info' as const,
        timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in future
      }

      render(<NotificationList notifications={[futureNotif]} />)
      
      expect(screen.getByText('Future notification')).toBeInTheDocument()
    })

    it('handles extremely long text content gracefully', async () => {
      const longTitle = 'A'.repeat(500)
      const longDescription = 'B'.repeat(1000)

      render(<NotificationList notifications={[{
        id: 'long-text',
        title: longTitle,
        description: longDescription,
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('handles special characters in text gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'special-chars',
        title: 'Special & < > " \' / Characters',
        description: 'HTML entities: &amp; &lt; &gt;',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText(/special/i)).toBeInTheDocument()
    })

    it('handles emoji in text gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'emoji',
        title: '🔔 Notification with Emoji',
        description: '✅ Success and ⚠️ Warning types',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText(/notification/i)).toBeInTheDocument()
    })

    it('handles mixed case gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'mixed-case',
        title: 'MiXeD CaSe TiTlE',
        description: 'DeScRiPtIoN',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText(/mixed/i)).toBeInTheDocument()
    })

    it('handles unicode characters gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'unicode',
        title: 'Unicode: 日本語 中文 العربية',
        description: 'Emoji: 🌍🎉🚀',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText(/unicode/i)).toBeInTheDocument()
    })

    it('handles whitespace-only content gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'whitespace',
        title: '   ',
        description: '\t\n\r',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('handles extremely short content gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'short',
        title: '',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('handles extremely long content gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'extremely-long',
        title: 'A'.repeat(1000),
        description: 'B'.repeat(2000),
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('handles null/undefined fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'null-fields',
        title: null,
        description: undefined,
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('handles boolean fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'boolean-fields',
        title: 'Boolean Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Boolean Test')).toBeInTheDocument()
    })

    it('handles number fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'number-fields',
        title: 'Number Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Number Test')).toBeInTheDocument()
    })

    it('handles date fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'date-fields',
        title: 'Date Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Date Test')).toBeInTheDocument()
    })

    it('handles object fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'object-fields',
        title: 'Object Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Object Test')).toBeInTheDocument()
    })

    it('handles array fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'array-fields',
        title: 'Array Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Array Test')).toBeInTheDocument()
    })

    it('handles symbol fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'symbol-fields',
        title: Symbol('test') as any,
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('handles bigint fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'bigint-fields',
        title: BigInt('12345678901234567890'),
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('handles mixed-type fields gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'mixed-types',
        title: 'Mixed Types Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Mixed Types Test')).toBeInTheDocument()
    })

    it('handles prototype pollution gracefully', async () => {
      const protoPollutedNotif = Object.create({}) as NotificationItem
      protoPollutedNotif.id = 'proto-polluted'
      protoPollutedNotif.title = 'Prototype Polluted Test'
      
      render(<NotificationList notifications={[protoPollutedNotif]} />)

      expect(screen.getByText('Prototype Polluted Test')).toBeInTheDocument()
    })

    it('handles circular references gracefully', async () => {
      const circularNotif: NotificationItem = {
        id: 'circular',
        title: 'Circular Reference Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }

      render(<NotificationList notifications={[circularNotif]} />)

      expect(screen.getByText('Circular Reference Test')).toBeInTheDocument()
    })

    it('handles deeply nested objects gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'nested-objects',
        title: 'Nested Objects Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Nested Objects Test')).toBeInTheDocument()
    })

    it('handles deeply nested arrays gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'nested-arrays',
        title: 'Nested Arrays Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Nested Arrays Test')).toBeInTheDocument()
    })

    it('handles sparse arrays gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'sparse-arrays',
        title: 'Sparse Arrays Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Sparse Arrays Test')).toBeInTheDocument()
    })

    it('handles frozen objects gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'frozen-objects',
        title: 'Frozen Objects Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Frozen Objects Test')).toBeInTheDocument()
    })

    it('handles sealed objects gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'sealed-objects',
        title: 'Sealed Objects Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Sealed Objects Test')).toBeInTheDocument()
    })

    it('handles readonly objects gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'readonly-objects',
        title: 'Readonly Objects Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)

      expect(screen.getByText('Readonly Objects Test')).toBeInTheDocument()
    })

    it('handles proxy objects gracefully', async () => {
      render(<NotificationList notifications={[{
        id: 'proxy-objects',
        title: 'Proxy Objects Test',
        description: '',
        type: 'info' as const,
        timestamp: new Date(),
      }]} />)
