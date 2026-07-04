import { describe, it, expect, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { render as rtlRender, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { RenderOptions } from '@testing-library/react'
import FeatureTabs from '@/components/blocks/feature-tabs'

// Extend vitest's matchers with RTL utilities
declare module 'vitest' {
  interface Matchers<R> {
    toBeInTheDocument(): R
    not.toBeInTheDocument(): R
    toHaveAttribute(name: string, value?: unknown): R
    toHaveClass(className: RegExp | string): R
  }
}

// Create render utilities with proper setup
const render = (ui: React.ReactElement, options?: RenderOptions) => {
  const { container, ...rest } = rtlRender(ui, options)
  return {
    container,
    debug: (...args) => rtlDebug(container, ...args),
    rerender: ui => {
      cleanup()
      return rtlRender(ui, options)
    },
    unmount: () => cleanup(),
    ...rest,
  }
}

const rtlDebug = (container: HTMLElement, ...args: unknown[]) => {
  console.log('Container:', container.innerHTML)
  console.log(...args)
}

// Export for use in components
export { render, screen, within, userEvent, cleanup, describe, it, expect, vi }

describe('FeatureTabs', () => {
  const mockProps = {
    title: 'Features',
    tabs: [
      { id: 'tab-1', label: 'Tab One', content: 'Content for tab one' },
      { id: 'tab-2', label: 'Tab Two', content: 'Content for tab two' },
    ],
  }

  it('renders with default props and shows all tabs', () => {
    render(<FeatureTabs {...mockProps} />)
    
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByText('Tab One')).toBeInTheDocument()
    expect(screen.getByText('Tab Two')).toBeInTheDocument()
  })

  it('renders each tab button with correct aria attributes', () => {
    render(<FeatureTabs {...mockProps} />)
    
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(2)
    
    // First tab should be selected by default
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('renders panel content when tab is clicked', async () => {
    render(<FeatureTabs {...mockProps} />)
    
    const firstTab = screen.getByRole('tab', { name: 'Tab One' })
    await userEvent.click(firstTab)
    
    expect(screen.getByText('Content for tab one')).toBeInTheDocument()
  })

  it('applies semantic Tailwind classes correctly', () => {
    render(<FeatureTabs {...mockProps} />)
    
    const container = screen.getByRole('tablist')
    // Verify some expected class patterns are present
    expect(container).toHaveClass(/rounded/ig)
  })

  it('handles empty items gracefully', () => {
    render(<FeatureTabs title="Empty" tabs={[]} />)
    
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })
})
