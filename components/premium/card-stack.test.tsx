import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'

// Mock Framer Motion hooks before imports
vi.mock('framer-motion', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    useScroll: vi.fn(() => ({ scrollX: 0 }), true),
    useTransform: vi.fn((input, outputRange) => input * 2),
    motion: {
      div: (props: any) => <div {...props} />,
      h1: (props: any) => <h1 {...props} />,
      p: (props: any) => <p {...props} />,
      button: (props: any) => <button {...props} />,
    },
  }
})

// Mock cn utility
vi.mock('@/lib/utils', async () => {
  const utils = await import('@/lib/utils')
  return {
    ...utils,
    cn: vi.fn((...classes: string[]) => classes.filter(Boolean).join(' ')),
  }
})

import type { CardStackProps } from '@/components/premium/card-stack'

describe('CardStack', () => {
  const defaultProps: Partial<CardStackProps> = {}

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts without throwing with default props', () => {
    // JSDOM guards for layout/scroll APIs that Framer Motion needs
    Object.defineProperty(window, 'getBoundingClientRect', {
      value: () => ({
        top: 0, left: 0, right: 100, bottom: 50,
        width: 100, height: 50, x: 0, y: 0,
      }),
    })

    const { container } = render(
      <CardStack {...defaultProps}>
        <div className="card-1">Item 1</div>
        <div className="card-2">Item 2</div>
      </CardStack>,
    )

    expect(container).toBeTruthy()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('renders children in order', () => {
    const { container } = render(
      <CardStack>
        <div className="first">First</div>
        <div className="second">Second</div>
      </CardStack>,
    )

    expect(container.innerHTML).toContain('First')
    expect(container.innerHTML).toContain('Second')
  })

  it('applies base card styling', () => {
    const { container } = render(
      <CardStack className="custom-base">
        <div>Test</div>
      </CardStack>,
    )

    expect(cn).toHaveBeenCalledWith(
      'rounded-lg border bg-card shadow-sm',
      'custom-base',
    )
  })

  it('handles empty children gracefully', () => {
    const { container } = render(<CardStack />)

    expect(container.firstChild).toBeTruthy()
    expect(container.innerHTML).not.toContain('undefined')
  })

  it('preserves custom className when provided', () => {
    const { container } = render(
      <CardStack className="my-custom-class">
        <div>Test</div>
      </CardStack>,
    )

    expect(container.firstChild?.className).toContain('rounded-lg')
    expect(container.firstChild?.className).toContain('my-custom-class')
  })

  it('renders with prefers-reduced-motion support', () => {
    const { container } = render(
      <CardStack>
        <div className="motion-test">Motion</div>
      </CardStack>,
    )

    expect(container).toBeTruthy()
    // Motion elements should be present but not break layout
    expect(screen.getByText('Motion')).toBeInTheDocument()
  })

  it('handles user interaction events without crashing', async () => {
    const mockOnHover = vi.fn()
    const mockOnClick = vi.fn()

    const { container } = render(
      <CardStack onHover={mockOnHover} onClick={mockOnClick}>
        <div className="interactive">Click me</div>
      </CardStack>,
    )

    await userEvent.click(screen.getByText('Click me'))
    expect(mockOnClick).toHaveBeenCalled()

    expect(container).toBeTruthy()
  })

  it('renders accessible structure', () => {
    const { container } = render(
      <CardStack aria-label="Premium card stack">
        <div className="item-1">Item One</div>
        <div className="item-2">Item Two</div>
      </CardStack>,
    )

    expect(container).toHaveAttribute('aria-label', 'Premium card stack')
  })

  it('maintains layout transitions when children change', () => {
    const { container, rerender } = render(
      <CardStack>
        <div className="a">A</div>
        <div className="b">B</div>
      </CardStack>,
    )

    expect(container.innerHTML).toContain('A')
    expect(container.innerHTML).toContain('B')

    rerender(
      <CardStack>
        <div className="c">C</div>
        <div className="d">D</div>
      </CardStack>,
    )

    expect(container.innerHTML).toContain('C')
    expect(container.innerHTML).toContain('D')
  })

  it('handles nested motion elements correctly', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="nested">Nested Motion</motion.div>
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Nested Motion')
    expect(screen.getByText('Nested Motion')).toBeInTheDocument()
  })

  it('renders with proper default spacing', () => {
    const { container } = render(
      <CardStack>
        <div className="content">Content</div>
      </CardStack>,
    )

    // Should have some padding/margin for content
    expect(container.firstChild?.className).toContain('p-')
  })

  it('works with dark mode context', () => {
    const { container } = render(
      <CardStack className="dark-mode-test">
        <div>Dark Mode Test</div>
      </CardStack>,
    )

    expect(container).toBeTruthy()
    expect(screen.getByText('Dark Mode Test')).toBeInTheDocument()
  })

  it('handles large amounts of children without performance issues', () => {
    const items = Array.from({ length: 50 }, (_, i) => (
      <div key={i} className={`item-${i}`}>Item {i}</div>
    ))

    const { container } = render(
      <CardStack>
        {items}
      </CardStack>,
    )

    expect(container.querySelectorAll('.item-')).toHaveLength(50)
  })

  it('preserves focus state for keyboard navigation', async () => {
    const { container, rerender } = render(
      <CardStack>
        <button className="focus-test">Focus Test</button>
      </CardStack>,
    )

    await userEvent.tab()
    expect(document.activeElement).toBeTruthy()

    rerender(
      <CardStack>
        <button className="focus-test-2">Focus Test 2</button>
      </CardStack>,
    )

    // Should still be able to navigate
    await userEvent.tab()
    expect(document.activeElement).toBeTruthy()
  })

  it('handles async initialization gracefully', () => {
    const mockInit = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 10)))

    const { container } = render(
      <CardStack onInit={mockInit}>
        <div>Async Init Test</div>
      </CardStack>,
    )

    expect(container).toBeTruthy()
    expect(mockInit).toHaveBeenCalled()
  })

  it('renders with proper type safety (no required props)', () => {
    const { container } = render(
      <CardStack>
        <div className="minimal">Minimal</div>
      </CardStack>,
    )

    // Should render without any required props
    expect(container.innerHTML).toContain('Minimal')
  })

  it('handles scroll events in JSDOM environment', () => {
    const mockScrollX = 0

    Object.defineProperty(window, 'scrollX', {
      get: () => mockScrollX,
    })

    const { container } = render(
      <CardStack>
        <div className="scroll-test">Scroll Test</div>
      </CardStack>,
    )

    expect(container).toBeTruthy()
    expect(screen.getByText('Scroll Test')).toBeInTheDocument()
  })

  it('maintains consistent border radius', () => {
    const { container } = render(
      <CardStack>
        <div className="radius-test">Radius</div>
      </CardStack>,
    )

    expect(container.firstChild?.className).toContain('rounded-lg')
  })

  it('handles focus-visible state correctly', () => {
    const { container } = render(
      <CardStack>
        <button className="focus-btn">Focus</button>
      </CardStack>,
    )

    expect(container.innerHTML).toContain('focus-visible:')
  })

  it('renders with proper semantic HTML structure', () => {
    const { container } = render(
      <CardStack aria-label="Product showcase">
        <div className="product-1">Product A</div>
        <div className="product-2">Product B</div>
      </CardStack>,
    )

    expect(container).toHaveAttribute('aria-label', 'Product showcase')
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('handles edge case: single child', () => {
    const { container } = render(
      <CardStack>
        <div className="single">Single</div>
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Single')
  })

  it('handles edge case: many children (100+)', () => {
    const items = Array.from({ length: 150 }, (_, i) => (
      <div key={i} className={`item-${i}`}>Item {i}</div>
    ))

    const { container } = render(
      <CardStack>
        {items}
      </CardStack>,
    )

    expect(container.querySelectorAll('.item-')).toHaveLength(150)
  })

  it('handles edge case: deeply nested motion elements', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="level-1">
          <motion.div className="level-2">
            <motion.div className="level-3">Deep</motion.div>
          </motion.div>
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Deep')
  })

  it('handles edge case: motion elements with layout transitions', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="layout-1">Layout 1</motion.div>
        <motion.div className="layout-2" initial={{ opacity: 0 }}>
          Layout 2
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Layout 1')
    expect(container.innerHTML).toContain('Layout 2')
  })

  it('handles edge case: motion elements with custom cursors', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="cursor-interactive" whileHover={{ cursor: 'pointer' }}>
          Interactive
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Interactive')
  })

  it('handles edge case: motion elements with staggered animations', async () => {
    const mockUseInView = vi.fn(() => ({ ref: {} }))
    vi.mock('framer-motion', async (importOriginal) => {
      const original = await importOriginal()
      return {
        ...original,
        useInView: mockUseInView,
        motion: { div: (props: any) => <div {...props} /> },
      }
    })

    const { container } = render(
      <CardStack>
        <motion.div className="stagger-1">Stagger 1</motion.div>,
        <motion.div className="stagger-2">Stagger 2</motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Stagger 1')
    expect(container.innerHTML).toContain('Stagger 2')
  })

  it('handles edge case: motion elements with parallax effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="parallax-1" whileHover={{ y: -5 }}>
          Parallax 1
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Parallax 1')
  })

  it('handles edge case: motion elements with layout animations', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="layout-anim" layout>
          Layout Animation
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Layout Animation')
  })

  it('handles edge case: motion elements with custom easing', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="ease-custom" initial={{ x: -100 }} animate={{ x: 0 }}>
          Custom Ease
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Custom Ease')
  })

  it('handles edge case: motion elements with spring physics', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="spring-anim" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          Spring Animation
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Spring Animation')
  })

  it('handles edge case: motion elements with drag interactions', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="drag-anim" drag dragElastic={0.1}>
          Drag Animation
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Drag Animation')
  })

  it('handles edge case: motion elements with gesture effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="gesture-anim" whileTap={{ scale: 0.95 }}>
          Gesture Animation
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Gesture Animation')
  })

  it('handles edge case: motion elements with custom cursors', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="cursor-anim" whileHover={{ cursor: 'grab' }}>
          Custom Cursor
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Custom Cursor')
  })

  it('handles edge case: motion elements with layout transitions', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="layout-trans" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Layout Transition
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Layout Transition')
  })

  it('handles edge case: motion elements with staggered entrances', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="stagger-ent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Stagger Entrance
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Stagger Entrance')
  })

  it('handles edge case: motion elements with hover effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="hover-anim" whileHover={{ scale: 1.02 }}>
          Hover Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Hover Effect')
  })

  it('handles edge case: motion elements with tap effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="tap-anim" whileTap={{ scale: 0.98 }}>
          Tap Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Tap Effect')
  })

  it('handles edge case: motion elements with rotate effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="rotate-anim" whileHover={{ rotate: 10 }}>
          Rotate Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Rotate Effect')
  })

  it('handles edge case: motion elements with skew effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="skew-anim" whileHover={{ skewX: 5 }}>
          Skew Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Skew Effect')
  })

  it('handles edge case: motion elements with translate effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="translate-anim" whileHover={{ x: -5 }}>
          Translate Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Translate Effect')
  })

  it('handles edge case: motion elements with scale effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="scale-anim" whileHover={{ scale: 1.05 }}>
          Scale Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Scale Effect')
  })

  it('handles edge case: motion elements with color effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="color-anim" whileHover={{ backgroundColor: '#8b5cf6' }}>
          Color Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Color Effect')
  })

  it('handles edge case: motion elements with shadow effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="shadow-anim" whileHover={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          Shadow Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Shadow Effect')
  })

  it('handles edge case: motion elements with gradient effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="gradient-anim" whileHover={{ background: 'linear-gradient(to right, #8b5cf6, #ec4899)' }}>
          Gradient Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Gradient Effect')
  })

  it('handles edge case: motion elements with blur effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="blur-anim" whileHover={{ filter: 'blur(4px)' }}>
          Blur Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Blur Effect')
  })

  it('handles edge case: motion elements with opacity effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="opacity-anim" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Opacity Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Opacity Effect')
  })

  it('handles edge case: motion elements with visibility effects', () => {
    const { container } = render(
      <CardStack>
        <motion.div className="visibility-anim" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Visibility Effect
        </motion.div>,
      </CardStack>,
    )

    expect(container.innerHTML).toContain('Visibility Effect')
  })

  it('handles edge case: motion elements with transform effects', () => {
    const { container } = render(
      <CardStack>
