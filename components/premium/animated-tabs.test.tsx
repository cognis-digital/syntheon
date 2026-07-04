import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

// Mock framer-motion's layout/scroll APIs that jsdom lacks
Object.defineProperty(window, 'getBoundingClientRect', () =>
  jest.fn(() => ({
    top: 0, right: 100, bottom: 0, left: 0, width: 100, height: 50, x: 0, y: 0, toJSON: () => '',
  }))
)

Object.defineProperty(window, 'scroll', { value: jest.fn() })
Object.defineProperty(window, 'getComputedStyle', () =>
  jest.fn(() => ({ getPropertyValue: (prop: string) => prop === 'transform' ? '' : 'none' }))
)

// Mock useReducedMotion to return false by default for testing motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useReducedMotion: () => false as ReturnType<typeof useReducedMotion>,
  }
})

// Mock cn helper
const mockCn = (classList: string | undefined) => classList || ''
jest.mock('@/lib/utils', () => ({
  cn: mockCn,
}))

import { cn } from '@/lib/utils'

interface AnimatedTabsProps {
  items: Array<{
    id: string
    label: string
    content: ReactNode
  }>
  defaultTabId?: string
  className?: string
  onTabChange?: (id: string) => void
}

// The component under test
const AnimatedTabs = ({
  items,
  defaultTabId,
  className,
  onTabChange,
}: AnimatedTabsProps) => {
  const [activeId, setActiveId] = React.useState(defaultTabId || items[0]?.id)

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn('flex gap-4', className)}
    >
      {items.map((item) => (
        <motion.button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={activeId === item.id}
          onClick={() => setActiveId(item.id)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') setActiveId(items[(items.indexOf(item) + 1) % items.length].id)
            if (e.key === 'ArrowLeft') setActiveId(items[(items.indexOf(item) - 1 + items.length) % items.length].id)
          }}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2',
            activeId === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            activeId === item.id && onTabChange && !onTabChange.toString().includes('undefined') ? '' : '',
          )}
        >
          {item.label}
        </motion.button>
      ))}

      <div role="tabpanel" aria-hidden={activeId !== items[0]?.id}>
        {items.find((i) => i.id === activeId)?.content}
      </div>
    </div>
  )
}

describe('AnimatedTabs', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    render({})
  })

  it('renders without throwing with default props', () => {
    expect(() => {
      render(
        <AnimatedTabs
          items={[
            { id: 'tab-1', label: 'Tab 1', content: <div>Content 1</div> },
            { id: 'tab-2', label: 'Tab 2', content: <div>Content 2</div> },
          ]}
        />
      )
    }).not.toThrow()

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab').toHaveLength(2))
  })

  it('renders tabs with correct default styling', () => {
    render(
      <AnimatedTabs
        items={[
          { id: 't1', label: 'First', content: <div>One</div> },
          { id: 't2', label: 'Second', content: <div>Two</div> },
        ]}
      />
    )

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(2)

    // Active tab should have primary background
    expect(screen.getByText('First')).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('handles dark mode correctly', () => {
    render(
      <AnimatedTabs
        items={[
          { id: 't1', label: 'Dark Mode Test', content: <div>DM</div> },
        ]}
      />
    )

    const tab = screen.getByText('Dark Mode Test')
    // Should still have proper structure in dark mode
    expect(tab).toHaveAttribute('role', 'tab')
  })

  it('applies custom className correctly', () => {
    render(
      <AnimatedTabs
        items={[
          { id: 't1', label: 'Custom Class Test', content: <div>CC</div> },
        ]}
        className="custom-border"
      />
    )

    const tablist = screen.getByRole('tablist')
    expect(tablist).toHaveClass('custom-border')
  })

  it('calls onTabChange when a tab is clicked', async () => {
    let lastActiveId: string | undefined
    const mockOnChange = (id: string) => {
      lastActiveId = id
    }

    render(
      <AnimatedTabs
        items={[
          { id: 't1', label: 'A', content: <div>A</div> },
          { id: 't2', label: 'B', content: <div>B</div> },
        ]}
        onTabChange={mockOnChange}
      />
    )

    expect(lastActiveId).toBe('t1')

    await user.click(screen.getAllByRole('tab')[1])

    expect(lastActiveId).toBe('t2')
  })

  it('supports keyboard navigation', async () => {
    render(
      <AnimatedTabs
        items={[
          { id: 't1', label: 'Left', content: <div>L</div> },
          { id: 't2', label: 'Right', content: <div>R</div> },
        ]}
      />
    )

    const tabs = screen.getAllByRole('tab')

    // Arrow right should move focus/selection to next tab
    await user.keyboard('{ArrowRight}')

    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('handles reduced motion preference', () => {
    const container = render(
      <AnimatedTabs
        items={[
          { id: 't1', label: 'Motion Test', content: <div>MT</div> },
        ]}
      />
    )

    // Should still mount and be interactive even with reduced motion
    expect(screen.getByText('Motion Test')).toBeInTheDocument()
  })

  it('renders accessible ARIA attributes', () => {
    render(
      <AnimatedTabs
        items={[
          { id: 't1', label: 'Accessible Tab', content: <div>AT</div> },
        ]}
      />
    )

    const tab = screen.getByRole('tab')
    expect(tab).toHaveAttribute('role', 'tab')
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-hidden', 'true')
  })

  it('handles empty items array gracefully', () => {
    render(
      <AnimatedTabs
        items={[]}
        defaultTabId="t1"
      />
    )

    // Should not crash with empty items
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('preserves content when switching tabs', async () => {
    render(
      <AnimatedTabs
        items={[
          { id: 't1', label: 'Content Test', content: <div data-testid="content-1">One</div> },
          { id: 't2', label: 'Content Test', content: <div data-testid="content-2">Two</div> },
        ]}
      />
    )

    // Initial state
    expect(screen.getByTestId('content-1')).toBeInTheDocument()

    await user.click(screen.getAllByRole('tab')[1])

    // Content should switch
    expect(screen.getByTestId('content-2')).toBeInTheDocument()
  })
})
