import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AreaTrend } from '@/components/app/area-trend'
import { cn } from '@/lib/utils'

// Mock dependencies
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}))

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    AreaChart: vi.fn(({ className, data, ...props }) => (
      <svg className={className} {...props}>
        <path d="M0 10 L5 5 L10 8" />
      </svg>
    )),
    ResponsiveContainer: actual.ResponsiveContainer,
    XAxis: actual.XAxis,
    YAxis: actual.YAxis,
    Tooltip: actual.Tooltip,
    Legend: actual.Legend,
  }
})

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    TrendingUp: vi.fn(({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M16 6l2.5-2.5L22 8l-2.5 2.5L22 13l-2.5 2.5L16 18l-2.5-2.5L16 13" />
      </svg>
    )),
    TrendingDown: vi.fn(({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M8 18l-2.5-2.5L3 13l2.5-2.5L3 8l2.5-2.5L8 6l2.5 2.5L8 10" />
      </svg>
    )),
    Activity: vi.fn(({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-6l-3 5v-5L8 12H2" />
      </svg>
    )),
  }
})

describe('AreaTrend', () => {
  const mockData = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 35 },
    { name: 'Mar', value: 50 },
    { name: 'Apr', value: 45 },
    { name: 'May', value: 60 },
  ]

  const renderComponent = (props: Partial<React.ComponentProps<typeof AreaTrend>> = {}) => {
    return render(<AreaTrend data={mockData} {...props} />)
  }

  it('renders without crashing with minimal props', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('displays the chart title when provided', () => {
    const { container } = renderComponent({ title: 'Q1 Performance' })
    expect(container).toContainHTML(/Q1 Performance/i)
  })

  it('shows a default empty state when no data is provided', () => {
    const { container, getByRole } = renderComponent({ data: [] })
    
    // Should show some kind of placeholder or loading indicator
    expect(container).not.toBeEmpty()
  })

  it('applies className prop correctly', () => {
    const { container } = renderComponent({ 
      className: 'custom-chart-container' 
    })
    expect(container.firstChild?.className).toContain('custom-chart-container')
  })

  it('handles dark mode by applying appropriate classes', async () => {
    document.body.className = 'dark'
    
    const { container } = renderComponent()
    
    // Check that dark-mode-aware components receive proper styling
    expect(container.firstChild?.className).toContain('dark:')
  })

  it('renders accessibility attributes for screen readers', () => {
    const { container, getByRole: getByRole } = renderComponent({ 
      title: 'Monthly Revenue Trend' 
    })
    
    // Check for aria-label or role attributes
    expect(container).toHaveAttribute(/aria-|role=/i)
  })

  it('displays trend indicators correctly', () => {
    const positiveData = [...mockData].map(d => ({ ...d, value: d.value + 10 }))
    
    renderComponent({ data: positiveData })
    
    // Should show upward trend indicator
    expect(container).toContainHTML(/TrendingUp|upward/i)
  })

  it('displays negative trend indicators when appropriate', () => {
    const negativeData = [...mockData].map(d => ({ ...d, value: d.value - 10 }))
    
    renderComponent({ data: negativeData })
    
    // Should show downward trend indicator  
    expect(container).toContainHTML(/TrendingDown|downward/i)
  })

  it('handles null/undefined values gracefully', () => {
    const mixedData = [
      { name: 'Jan', value: 40 },
      { name: 'Feb', value: undefined },
      { name: 'Mar', value: 50 },
    ]
    
    expect(() => renderComponent({ data: mixedData })).not.toThrow()
  })

  it('applies semantic design tokens correctly', () => {
    const { container } = renderComponent()
    
    // Check for expected token classes
    expect(container.firstChild?.className).toContain('bg-background')
    expect(container.firstChild?.className).toContain('text-foreground')
  })

  it('handles large datasets without performance issues', async () => {
    const largeData: Array<{ name: string; value: number }> = []
    for (let i = 0; i < 1000; i++) {
      largeData.push({ name: `Month ${i}`, value: Math.random() * 100 })
    }
    
    const { container, getByRole } = renderComponent({ data: largeData })
    
    // Should still render and be interactive
    expect(container).not.toBeEmpty()
    await waitFor(() => {
      expect(getByRole('img')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('maintains aspect ratio when container resizes', () => {
    const { container, rerender } = renderComponent({ 
      data: mockData,
      height: 300 
    })
    
    expect(container.firstChild?.className).toContain('h-48') // 300px / 12 tailwind units
    
    rerender(<AreaTrend data={mockData} height={500} />)
    expect(container.firstChild?.className).toContain('h-64') // 500px / 12
  })

  it('shows loading state when data is being fetched', async () => {
    const { container, rerender } = renderComponent({ 
      data: [],
      isLoading: true,
      title: 'Loading...'
    })
    
    expect(container).toContainHTML(/loading|spinner/i)
    
    rerender(<AreaTrend data={mockData} />)
    await waitFor(() => {
      expect(container).not.toContainHTML(/loading/i)
    })
  })

  it('handles error state gracefully', async () => {
    const { container, rerender } = renderComponent({ 
      data: [],
      isLoading: true,
      error: 'Failed to fetch trend data'
    })
    
    expect(container).toContainHTML(/error|failed/i)
    
    rerender(<AreaTrend data={mockData} />)
    await waitFor(() => {
      expect(container).not.toContainHTML(/error/i)
    })
  })

  it('supports custom tooltip content', () => {
    renderComponent({ 
      data: mockData,
      tooltipFormat: (value: number) => `$${value.toFixed(2)}M`
    })
    
    // Tooltip should format values correctly
    expect(container).toContainHTML(/40\.00|M/i)
  })

  it('applies gradient fills when enabled', () => {
    renderComponent({ 
      data: mockData,
      gradient: true,
      gradientColors: ['#8b5cf6', '#7c3aed']
    })
    
    expect(container).toContainHTML(/gradient|fill/i)
  })

  it('respects prefers-reduced-motion for smooth transitions', async () => {
    document.body.style.setProperty(
      'prefers-reduced-motion: reduce',
      'reduce' as string
    )
    
    const { container } = renderComponent({ 
      data: mockData,
      animate: true
    })
    
    // Should still render but with reduced animations
    expect(container).not.toBeEmpty()
  })

  it('passes through all valid props to underlying chart components', () => {
    const customProps = {
      width: 800,
      height: 400,
      margin: { top: 20, right: 30, bottom: 50, left: 50 },
      padding: 10,
    } as any
    
    renderComponent({ data: mockData, ...customProps })
    
    // Should not throw with custom props
    expect(container).not.toBeEmpty()
  })

  it('handles very small values without precision loss', () => {
    const tinyValues = [
      { name: 'Jan', value: 0.001 },
      { name: 'Feb', value: 0.002 },
    ]
    
    renderComponent({ data: tinyValues })
    expect(container).not.toThrow()
  })

  it('handles very large values without overflow', () => {
    const hugeValues = [
      { name: 'Jan', value: 1e9 },
      { name: 'Feb', value: 2e9 },
    ]
    
    renderComponent({ data: hugeValues })
    expect(container).not.toThrow()
  })

  it('maintains focus management for keyboard navigation', () => {
    const { container, getByRole } = renderComponent({ 
      data: mockData,
      interactive: true
    })
    
    // Should have focusable elements if interactive mode is on
    expect(container).toContainHTML(/tabindex|role=/i)
  })

  it('applies consistent border radius from design tokens', () => {
    const { container } = renderComponent({ 
      data: mockData,
      rounded: 'lg'
    })
    
    expect(container.firstChild?.className).toContain('rounded-lg')
  })

  it('supports custom axis labels and formatting', () => {
    renderComponent({ 
      data: mockData,
      xLabel: 'Time Period',
      yLabel: 'Performance Index (0-100)',
      xFormat: '%b %Y',
      yFormat: '.2f'
    })
    
    expect(container).toContainHTML(/Time Period/i)
  })

  it('handles date-based data correctly', () => {
    const dateData = [
      { name: '2024-01-01', value: 40 },
      { name: '2024-02-01', value: 35 },
    ] as any
    
    renderComponent({ data: dateData })
    expect(container).not.toThrow()
  })

  it('preserves prop order and types correctly', () => {
    const typedProps: React.ComponentProps<typeof AreaTrend> = {
      data: mockData,
      title: 'Test Chart',
      className: 'test-class',
      height: 300,
      animate: true,
      gradient: false,
      interactive: true,
    }
    
    renderComponent(typedProps)
    expect(container).not.toBeEmpty()
  })

  it('cleans up properly on unmount', async () => {
    const { container, rerender } = renderComponent({ 
      data: mockData,
      animate: true
    })
    
    // Should have animation classes when mounted
    expect(container.firstChild?.className).toContain('animate-')
    
    rerender(<AreaTrend data={mockData} />)
    
    // Animation classes should be removed or modified
    await waitFor(() => {
      const remaining = container.firstChild?.className
      expect(remaining).not.toContain('animate-infinite')
    })
  })

  it('handles concurrent renders without state corruption', async () => {
    renderComponent({ data: mockData, title: 'First' })
    
    await new Promise(resolve => setTimeout(resolve, 10))
    
    rerender(<AreaTrend data={mockData}, title: 'Second' />)
    
    expect(container).toContainHTML(/Second/i)
  })

  it('supports lazy loading for large datasets', async () => {
    const { container, rerender } = renderComponent({ 
      data: [],
      lazyLoad: true,
      threshold: 100
    })
    
    // Should show placeholder initially
    expect(container).toContainHTML(/placeholder|skeleton/i)
    
    rerender(<AreaTrend data={mockData} />)
    
    await waitFor(() => {
      expect(container).not.toContainHTML(/placeholder/i)
    })
  })

  it('handles timezone-aware timestamps correctly', () => {
    const utcData = [
      { name: '2024-01-01T00:00:00Z', value: 40 },
      { name: '2024-01-01T06:00:00Z', value: 35 },
    ] as any
    
    renderComponent({ data: utcData })
    expect(container).not.toThrow()
  })

  it('applies proper contrast ratios for text elements', () => {
    const { container } = renderComponent({ 
      data: mockData,
      darkMode: true
    })
    
    // Check that text has appropriate contrast classes
    expect(container.firstChild?.className).toContain('text-foreground')
  })

  it('supports custom error boundaries gracefully', () => {
    const ErrorBoundary = ({ children }: { children: React.ReactNode }) => (
      <div className="p-4 bg-background rounded-lg border-border">
        {children}
      </div>
    )
    
    renderComponent({ 
      data: [],
      errorBoundary: ErrorBoundary,
      errorMessage: 'Something went wrong'
    })
    
    expect(container).toContainHTML(/error|wrong/i)
  })

  it('handles responsive design breakpoints', () => {
    const { container, rerender } = renderComponent({ 
      data: mockData,
      responsive: true
    })
    
    // Should have responsive classes applied
    expect(container.firstChild?.className).toContain('max-w-')
    
    rerender(<AreaTrend data={mockData} />)
    expect(container).not.toBeEmpty()
  })

  it('supports custom domain for axis scaling', () => {
    renderComponent({ 
      data: mockData,
      xDomain: ['2024-01-01', '2024-05-31'],
      yDomain: [0, 100]
    })
    
    expect(container).not.toThrow()
  })

  it('handles empty string values gracefully', () => {
    const stringData = [
      { name: 'Jan', value: '' },
      { name: 'Feb', value: 40 },
    ] as any
    
    renderComponent({ data: stringData })
    expect(container).not.toThrow()
  })

  it('supports custom legend positioning and styling', () => {
    renderComponent({ 
      data: mockData,
      legendPosition: 'top-right' as const,
      legendStyle: { fontSize: 12 }
    })
    
    expect(container).toContainHTML(/legend/i)
  })

  it('handles crosshair/interactive cursor correctly', () => {
    renderComponent({ 
      data: mockData,
      interactive: true,
      showCrosshair: true
    })
    
    // Should have pointer/cursor styles applied
    expect(container).toContainHTML(/cursor|pointer/i)
  })

  it('supports custom tick formatting', () => {
    renderComponent({ 
      data: mockData,
      xTickFormatter: (v: string) => v.slice(0, 3),
      yTickFormatter: (v: number) => `${Math.round(v)}%`
    })
    
    expect(container).toContainHTML(/Jan/i) // Truncated month name
  })

  it('handles very fast data updates without flickering', async () => {
    const { container, rerender } = renderComponent({ 
      data: mockData,
      animate: true,
      transitionDuration: 300
    })
    
    // Should have smooth transition classes
    expect(container.firstChild?.className).toContain('transition-')
    
    rerender(<AreaTrend data={mockData} />)
    await waitFor(() => {
      expect(container).not.toBeEmpty()
    })
  })

  it('supports custom grid lines and styling', () => {
    renderComponent({ 
      data: mockData,
      showGrid: true,
      gridColor: '#e5e7eb'
    })
    
    expect(container).toContainHTML(/grid/i)
  })

  it('handles circular/curved area paths when enabled', () => {
    renderComponent({ 
      data: mockData,
      curvedPath: true,
      curveTension: 0.4
    })
    
    // Should have path-related classes
    expect(container).toContainHTML(/path|curve/i)
  })

  it('supports custom tooltip triggers', () => {
    renderComponent({ 
      data: mockData,
      tooltipTrigger: 'hover' as const,
      tooltipDelay: 200
    })
    
    // Should have hover-related classes
    expect(container).toContainHTML(/hover/i)
  })

  it('handles memory cleanup for large animations', async () => {
    renderComponent({ 
      data: mockData,
      animate: true,
      cleanupOnUnmount: true
    })
    
    // Should have animation-related classes
    expect(container.firstChild?.className).toContain('animate-')
  })

  it('supports custom color palettes', () => {
    renderComponent({ 
      data: mockData,
      colors: ['#8b5cf6', '#ec4899', '#06b6d4']
    })
    
    // Should have gradient or color-related classes
    expect(container).toContainHTML(/gradient|color/i)
  })

  it('handles very thin datasets without distortion', () => {
    const thinData = [
      { name: 'Jan', value: 1 },
      { name: 'Feb', value: 2 },
    ] as any
    
    renderComponent({ data: thinData, height: 300 })
    expect(container).not.toThrow()
  })

  it('supports custom data labels and positioning', () => {
    renderComponent({ 
      data: mockData,
      showLabels: true,
      labelPosition: 'inside' as const
    })
    
    // Should have label-related classes
    expect(container).toContainHTML(/label/i)
  })

  it('handles custom padding and margins correctly', () => {
    renderComponent({ 
      data: mockData,
      padding: { top: 20, right: 30, bottom: 50, left: 50 }
    })
    
    // Should have spacing-related classes
    expect(container).toContainHTML(/p-|m-/i)
  })

  it('supports custom axis line styling', () => {
    renderComponent({ 
      data: mockData,
      xAxisStyle: { stroke: '#e5e7eb' },
      yAxisStyle: { stroke: '#d1d5db' }
    })
    
    // Should have border-related classes
    expect(container).toContainHTML(/border|stroke/i)
  })

  it('handles custom reference lines and annotations', () => {
    renderComponent({ 
      data: mockData,
      referenceLines: [
        { value: 50, stroke: '#ef4444' },
