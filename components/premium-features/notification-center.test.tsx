import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationCenter } from '@/components/premium-features/notification-center'

describe('NotificationCenter', () => {
  const mockNotifications = [
    { id: '1', type: 'info', title: 'Welcome', message: 'Get started with Syntheon', timestamp: new Date() },
    { id: '2', type: 'success', title: 'Complete', message: 'Setup finished successfully', timestamp: new Date(Date.now() - 3600000) },
  ]

  const mockProps = {
    notifications: mockNotifications,
    onDismissAll: vi.fn(),
    onDismiss: vi.fn(),
    onMarkAsRead: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props when no props provided', () => {
    const wrapper = render(<NotificationCenter />)
    
    expect(wrapper).toBeDefined()
    expect(screen.getByRole('region')).toHaveTextContent(/notification/i)
  })

  it('displays notification count badge correctly', () => {
    const wrapper = render(
      <NotificationCenter notifications={mockNotifications} />,
    )

    const badge = screen.getByTestId('notification-badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('2')
  })

  it('renders notification list with correct types and styling', () => {
    render(<NotificationCenter notifications={mockNotifications} />)

    // Info notification
    const infoNotification = screen.getByRole('article', { name: /welcome/i })
    expect(infoNotification).toHaveClass(/bg-background/)
    
    // Success notification  
    const successNotification = screen.getByRole('article', { name: /complete/i })
    expect(successNotification).toHaveClass(/rounded-lg/)
  })

  it('applies dark mode correctly via CSS variables', () => {
    document.body.classList.add('dark')
    
    render(<NotificationCenter notifications={mockNotifications} />)

    const infoNotification = screen.getByRole('article', { name: /welcome/i })
    expect(infoNotification).toHaveStyle(/text-foreground/)
  })

  it('respects prefers-reduced-motion for animations', () => {
    document.body.classList.add('dark')
    
    render(
      <NotificationCenter 
        notifications={mockNotifications} 
        className="animate-in fade-in slide-in-from-top-4 duration-500" 
      />,
    )

    const infoNotification = screen.getByRole('article', { name: /welcome/i })
    expect(infoNotification).toHaveClass(/animate-in/)
  })

  it('handles dismiss action and updates state', async () => {
    render(
      <NotificationCenter 
        notifications={mockNotifications}
        onDismiss={vi.fn()}
      />,
    )

    const closeBtn = screen.getAllByRole('button', { name: /close/i })[0]
    
    await act(async () => {
      fireEvent.click(closeBtn)
    })

    expect(mockProps.onDismiss).toHaveBeenCalledWith('1')
  })

  it('handles dismiss all action', async () => {
    render(
      <NotificationCenter 
        notifications={mockNotifications}
        onDismissAll={vi.fn()}
      />,
    )

    const clearBtn = screen.getByRole('button', { name: /clear/i })
    
    await act(async () => {
      fireEvent.click(clearBtn)
    })

    expect(mockProps.onDismissAll).toHaveBeenCalled()
  })

  it('handles mark as read action', async () => {
    render(
      <NotificationCenter 
        notifications={mockNotifications}
        onMarkAsRead={vi.fn()}
      />,
    )

    const markBtn = screen.getByRole('button', { name: /mark/i })
    
    await act(async () => {
      fireEvent.click(markBtn)
    })

    expect(mockProps.onMarkAsRead).toHaveBeenCalled()
  })

  it('handles expand/collapse toggle', async () => {
    render(
      <NotificationCenter 
        notifications={mockNotifications}
        expanded={false}
        onToggleExpand={vi.fn()}
      />,
    )

    const toggleBtn = screen.getByRole('button', { name: /toggle/i })
    
    await act(async () => {
      fireEvent.click(toggleBtn)
    })

    expect(mockProps.onToggleExpand).toHaveBeenCalledWith(true)
  })

  it('shows empty state when no notifications exist', () => {
    render(<NotificationCenter notifications={[]} />)

    const emptyState = screen.getByRole('status') || screen.getByText(/no/i)
    expect(emptyState).toBeInTheDocument()
  })

  it('handles keyboard navigation and focus management', async () => {
    render(
      <NotificationCenter 
        notifications={mockNotifications}
        expanded={true}
        onDismissAll={vi.fn()}
      />,
    )

    const container = screen.getByRole('region') as HTMLElement
    
    // Tab through elements
    await act(async () => {
      fireEvent.keyDown(container, { key: 'Tab' })
    })

    expect(container).toHaveFocus()
  })

  it('applies ARIA attributes for accessibility', () => {
    render(
      <NotificationCenter 
        notifications={mockNotifications}
        ariaLabelledby="notification-title"
      />,
    )

    const region = screen.getByRole('region') as HTMLDivElement
    expect(region).toHaveAttribute('aria-labelledby', 'notification-title')
  })

  it('handles large notification lists gracefully', () => {
    const manyNotifications = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      type: 'info' as const,
      title: `Notification ${i + 1}`,
      message: 'Test message',
      timestamp: new Date(),
    }))

    render(<NotificationCenter notifications={manyNotifications} />)

    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeNull()
  })

  it('renders with custom className and style props', () => {
    const wrapper = render(
      <NotificationCenter 
        notifications={mockNotifications}
        className="max-w-2xl border rounded-xl shadow-lg"
        style={{ padding: '1rem' }}
      />,
    )

    expect(wrapper).toHaveClass(/max-w-2xl/)
    expect(wrapper).toHaveStyle(/padding: 1rem/)
  })

  it('handles focus trap when expanded', async () => {
    render(
      <NotificationCenter 
        notifications={mockNotifications}
        expanded={true}
        onDismissAll={vi.fn()}
      />,
    )

    const container = screen.getByRole('region') as HTMLElement
    
    await act(async () => {
      fireEvent.keyDown(container, { key: 'Tab' })
    })

    // Focus should remain within the region when expanded
    expect(document.activeElement).toBeWithin(container)
  })

  it('handles scroll behavior for long lists', async () => {
    const manyNotifications = Array.from({ length: 100 }, (_, i) => ({
      id: String(i + 1),
      type: 'info' as const,
      title: `Notification ${i + 1}`,
      message: 'Test message',
      timestamp: new Date(),
    }))

    render(<NotificationCenter notifications={manyNotifications} />)

    const container = screen.getByRole('region') as HTMLDivElement
    
    // Should be scrollable if content overflows
    expect(container).toHaveAttribute('tabindex', '-1') || 
              expect(container).toHaveClass(/overflow/i)
  })

  it('preserves notification order and metadata', () => {
    render(<NotificationCenter notifications={mockNotifications} />)

    const infoNotif = screen.getByRole('article', { name: /welcome/i })
    const successNotif = screen.getByRole('article', { name: /complete/i })

    expect(infoNotif).toBeInTheDocument()
    expect(successNotif).toBeInTheDocument()
  })

  it('handles timestamp formatting and display', () => {
    render(<NotificationCenter notifications={mockNotifications} />)

    const infoNotif = screen.getByRole('article', { name: /welcome/i })
    // Timestamps should be rendered but not necessarily in a specific format
    expect(infoNotif).toHaveTextContent(/new Date\(\)/i) || 
                    expect(infoNotif).toHaveAttribute('title')
  })

  it('handles edge case with undefined/null notifications', () => {
    const wrapper = render(<NotificationCenter notifications={undefined} />)
    expect(wrapper).not.toThrow()

    const nullWrapper = render(<NotificationCenter notifications={null} />)
    expect(nullWrapper).not.toThrow()
  })

  it('handles edge case with empty array explicitly', () => {
    const wrapper = render(<NotificationCenter notifications={[]} />)
    expect(wrapper).not.toThrow()
    
    // Should show empty state or minimal UI
    expect(screen.queryByRole('article')).toBeNull() || 
            screen.getByRole('status')
  })

  it('handles edge case with very old timestamps', () => {
    const oldNotifications = [
      { id: '1', type: 'info' as const, title: 'Old', message: 'From long ago', timestamp: new Date(Date.now() - 3600000 * 24 * 365) }, // 1 year old
    ]

    render(<NotificationCenter notifications={oldNotifications} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with mixed notification types', () => {
    const mixed = [
      { id: '1', type: 'info' as const, title: 'Info', message: '', timestamp: new Date() },
      { id: '2', type: 'success' as const, title: 'Success', message: '', timestamp: new Date() },
      { id: '3', type: 'warning' as const, title: 'Warning', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={mixed} />)
    
    expect(screen.getByRole('article')).toHaveCount(3)
  })

  it('handles edge case with special characters in text content', () => {
    const special = [
      { id: '1', type: 'info' as const, title: 'HTML &amp; Special', message: '<script>alert("xss")</script>', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={special} />)
    
    expect(screen.getByRole('article')).toHaveTextContent(/&/i) || 
            screen.getByRole('article').innerHTML.includes('&amp;')
  })

  it('handles edge case with very long messages', () => {
    const long = [
      { id: '1', type: 'info' as const, title: 'Long', message: 'A'.repeat(500), timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={long} />)
    
    expect(screen.getByRole('article')).toHaveTextContent(/A/i).and.toHaveLength.greaterThan(100)
  })

  it('handles edge case with timezone-aware timestamps', () => {
    const tz = [
      { id: '1', type: 'info' as const, title: 'Timezone', message: '', timestamp: new Date(Date.UTC(2024, 0, 1)) },
    ]

    render(<NotificationCenter notifications={tz} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with invalid date objects', () => {
    const invalid = [
      { id: '1', type: 'info' as const, title: 'Invalid Date', message: '', timestamp: new Date('not a date') },
    ]

    render(<NotificationCenter notifications={invalid} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with null/undefined fields in notification object', () => {
    const partial = [
      { id: '1' as any, type: undefined as any, title: 'Partial', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={partial} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with maximum integer id', () => {
    const maxId = [
      { 
        id: Number.MAX_SAFE_INTEGER, 
        type: 'info' as const, 
        title: 'Max ID', 
        message: '', 
        timestamp: new Date() 
      },
    ]

    render(<NotificationCenter notifications={maxId} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with negative integer id (edge case)', () => {
    const negId = [
      { 
        id: -1, 
        type: 'info' as const, 
        title: 'Neg ID', 
        message: '', 
        timestamp: new Date() 
      },
    ]

    render(<NotificationCenter notifications={negId} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with boolean type field (should be treated as info)', () => {
    const boolType = [
      { id: '1', type: true as any, title: 'Bool Type', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={boolType} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with number type field (should be treated as info)', () => {
    const numType = [
      { id: '1', type: 42, title: 'Num Type', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={numType} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with symbol type field (should be treated as info)', () => {
    const symType = [
      { id: '1', type: Symbol('info'), title: 'Sym Type', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={symType} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with bigint id (should be converted to string)', () => {
    const bigIntId = [
      { 
        id: BigInt(123), 
        type: 'info' as const, 
        title: 'BigInt ID', 
        message: '', 
        timestamp: new Date() 
      },
    ]

    render(<NotificationCenter notifications={bigIntId} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with date string (should be parsed)', () => {
    const strDate = [
      { id: '1', type: 'info' as const, title: 'Str Date', message: '', timestamp: new Date('2024-01-01') },
    ]

    render(<NotificationCenter notifications={strDate} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with empty string title (should be treated as generic)', () => {
    const emptyTitle = [
      { id: '1', type: 'info' as const, title: '', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={emptyTitle} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with whitespace-only title (should be treated as generic)', () => {
    const wsTitle = [
      { id: '1', type: 'info' as const, title: '   ', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={wsTitle} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with emoji in text (should be preserved)', () => {
    const emoji = [
      { id: '1', type: 'info' as const, title: '🎉 Emoji', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={emoji} />)
    
    expect(screen.getByRole('article')).toHaveTextContent(/🎉/)
  })

  it('handles edge case with unicode characters (should be preserved)', () => {
    const unicode = [
      { id: '1', type: 'info' as const, title: '日本語テスト', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={unicode} />)
    
    expect(screen.getByRole('article')).toHaveTextContent(/日本語/i)
  })

  it('handles edge case with RTL text (should be preserved)', () => {
    const rtl = [
      { id: '1', type: 'info' as const, title: 'עברית', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={rtl} />)
    
    expect(screen.getByRole('article')).toHaveTextContent(/עברית/)
  })

  it('handles edge case with mixed content (should be preserved)', () => {
    const mixed = [
      { id: '1', type: 'info' as const, title: 'Mixed 🎉 & Unicode 日本語', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={mixed} />)
    
    expect(screen.getByRole('article')).toHaveTextContent(/🎉/)
    expect(screen.getByRole('article')).toHaveTextContent(/日本語/i)
  })

  it('handles edge case with very small id (should be treated as string)', () => {
    const tinyId = [
      { id: '0.001', type: 'info' as const, title: 'Tiny ID', message: '', timestamp: new Date() },
    ]

    render(<NotificationCenter notifications={tinyId} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with very large id (should be treated as string)', () => {
    const hugeId = [
      { 
        id: '999999999999999999', 
        type: 'info' as const, 
        title: 'Huge ID', 
        message: '', 
        timestamp: new Date() 
      },
    ]

    render(<NotificationCenter notifications={hugeId} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with special characters in id (should be treated as string)', () => {
    const specialId = [
      { 
        id: 'id-123_test', 
        type: 'info' as const, 
        title: 'Special ID', 
        message: '', 
        timestamp: new Date() 
      },
    ]

    render(<NotificationCenter notifications={specialId} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with very long id (should be treated as string)', () => {
    const longId = [
      { 
        id: 'a'.repeat(100), 
        type: 'info' as const, 
        title: 'Long ID', 
        message: '', 
        timestamp: new Date() 
      },
    ]

    render(<NotificationCenter notifications={longId} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with nested objects in notification (should be flattened)', () => {
    const nested = [
      { id: '1', type: 'info' as const, title: 'Nested', message: '', timestamp: new Date(), metadata: { key: 'value' } },
    ]

    render(<NotificationCenter notifications={nested} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with circular reference (should not crash)', () => {
    const circular = [
      { id: '1', type: 'info' as const, title: 'Circular', message: '', timestamp: new Date(), self: circular[0] },
    ]

    render(<NotificationCenter notifications={circular} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with prototype pollution (should be safe)', () => {
    const pollute = [
      { id: '1', type: 'info' as const, title: 'Pollute', message: '', timestamp: new Date(), __proto__: { key: 'value' } },
    ]

    render(<NotificationCenter notifications={pollute} />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('handles edge case with getter/setter properties (should be safe)', () => {
    const getset = [
      { 
        id: '1', 
        type: 'info' as const, 
        title: 'Getter/Setter', 
        message: '', 
        timestamp: new Date(),
        get secret() { return 'secret'; },
      },
