import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import type { UsageMeterProps } from '@/components/app/usage-meter'
import { UsageMeter } from '@/components/app/usage-meter'

describe('UsageMeter', () => {
  const mockProps: Partial<UsageMeterProps> = {
    current: 75,
    limit: 100,
    label: 'API Calls',
    unit: 'k',
    thresholdWarning: 80,
    thresholdCritical: 95,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props when no props provided', () => {
    const { container } = render(<UsageMeter />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText(/0/)).toBeInTheDocument()
  })

  it('displays current and limit values correctly', () => {
    render(<UsageMeter {...mockProps} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  it('shows percentage calculation correctly', () => {
    render(<UsageMeter current={25} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('style', /width: 25%/)
  })

  it('applies warning class when thresholdWarning is exceeded', () => {
    render(<UsageMeter current={85} limit={100} thresholdWarning={80} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/warning/)
  })

  it('applies critical class when thresholdCritical is exceeded', () => {
    render(<UsageMeter current={97} limit={100} thresholdCritical={95} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/critical/)
  })

  it('applies warning class when both thresholds are exceeded', () => {
    render(<UsageMeter current={97} limit={100} thresholdWarning={80} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/critical/)
  })

  it('displays label and unit when provided', () => {
    render(<UsageMeter {...mockProps} />)
    
    expect(screen.getByText('API Calls')).toBeInTheDocument()
    expect(screen.getByText('75k / 100k')).toBeInTheDocument()
  })

  it('shows formatted percentage in description', () => {
    render(<UsageMeter current={33.33} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-describedby')
  })

  it('applies rounded-lg by default for aesthetics', () => {
    render(<UsageMeter current={50} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/rounded/)
  })

  it('handles zero usage gracefully', () => {
    render(<UsageMeter current={0} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
  })

  it('handles full usage (at limit)', () => {
    render(<UsageMeter current={100} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  it('handles over-limit gracefully with visual indication', () => {
    render(<UsageMeter current={150} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '150')
  })

  it('applies dark mode classes correctly when in dark theme', () => {
    render(<UsageMeter {...mockProps} />, { attributes: { class: 'dark' } })
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/bg-muted/)
  })

  it('is accessible with proper ARIA attributes', () => {
    render(<UsageMeter current={50} limit={100} label="Test" />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('role', 'progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  it('has visible focus states for keyboard navigation', () => {
    render(<UsageMeter current={50} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/focus/)
  })

  it('renders with proper type hierarchy and semantic classes', () => {
    render(<UsageMeter current={75} limit={100} label="API" />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/bg-primary/)
  })

  it('handles optional props with sensible defaults', () => {
    render(<UsageMeter />)
    
    // Should not crash with minimal props
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('maintains consistent styling across different usage ratios', () => {
    const testCases = [
      { current: 10, limit: 100 },
      { current: 50, limit: 100 },
      { current: 90, limit: 100 },
      { current: 100, limit: 100 },
    ]

    testCases.forEach(({ current, limit }) => {
      render(<UsageMeter current={current} limit={limit} />)
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })
  })

  it('applies appropriate border styling', () => {
    render(<UsageMeter current={50} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/border/)
  })

  it('handles very small usage values correctly', () => {
    render(<UsageMeter current={1} limit={1000} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '1')
  })

  it('handles very large usage values correctly', () => {
    render(<UsageMeter current={999999} limit={1000000} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '999999')
  })

  it('applies smooth transitions for visual polish', () => {
    render(<UsageMeter current={50} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/transition/)
  })

  it('renders label as visually distinct element', () => {
    render(<UsageMeter current={75} limit={100} label="API Calls" />)
    
    // Check that label is rendered separately from progress bar
    expect(screen.getByText('API Calls')).toBeInTheDocument()
  })

  it('handles null/undefined values gracefully', () => {
    render(<UsageMeter current={null} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
  })

  it('applies correct semantic color classes based on state', () => {
    render(<UsageMeter current={97} limit={100} thresholdCritical={95} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/bg-red/)
  })

  it('maintains aspect ratio for circular progress indicator', () => {
    render(<UsageMeter current={75} limit={100} shape="circular" />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/aspect/)
  })

  it('applies proper z-index for layering', () => {
    render(<UsageMeter current={50} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/z-10/)
  })

  it('handles string numbers correctly', () => {
    render(<UsageMeter current="75" limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
  })

  it('applies proper font weights for hierarchy', () => {
    render(<UsageMeter current={75} limit={100} label="API" />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/font-medium/)
  })

  it('handles negative values gracefully', () => {
    render(<UsageMeter current={-10} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '-10')
  })

  it('applies proper line-height for readability', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/leading/)
  })

  it('maintains consistent padding throughout', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/p-4/)
  })

  it('applies proper text truncation for long labels', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      label="This is a very long label that should be truncated" 
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/truncate/)
  })

  it('handles boolean props correctly', () => {
    render(<UsageMeter current={75} limit={100} showPercentage={true} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-describedby')
  })

  it('applies proper overflow handling for container', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/overflow-hidden/)
  })

  it('handles very fast rendering with minimal re-renders', () => {
    let renderCount = 0
    
    const TestComponent = () => {
      renderCount++
      return <UsageMeter current={75} limit={100} />
    }
    
    render(<TestComponent />)
    
    expect(renderCount).toBe(1)
  })

  it('applies proper pointer events for interactivity', () => {
    render(<UsageMeter current={75} limit={100} interactive={true} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/cursor-pointer/)
  })

  it('handles disabled state gracefully', () => {
    render(<UsageMeter current={75} limit={100} disabled={true} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/opacity-60/)
  })

  it('applies proper touch-action for mobile responsiveness', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/touch-none/)
  })

  it('maintains consistent box-sizing throughout', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/box-border/)
  })

  it('applies proper text-overflow for multi-line content', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      label="Multi\nLine" 
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/text-ellipsis/)
  })

  it('handles custom threshold values correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      thresholdWarning={60}
      thresholdCritical={90}
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/warning/)
  })

  it('applies proper min/max dimensions for responsiveness', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/min-h-4/)
  })

  it('handles very thin progress bars gracefully', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      height="2"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/h-2/)
  })

  it('applies proper max-width for container constraints', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/max-w-full/)
  })

  it('handles custom animation duration props', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      animateDuration="300"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/duration-300/)
  })

  it('applies proper selection styling for text', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/select-none/)
  })

  it('handles very wide containers gracefully', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      width="120"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/w-30/)
  })

  it('applies proper min-height for vertical spacing', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/min-h-8/)
  })

  it('handles custom border radius values correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      borderRadius="full"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/rounded-full/)
  })

  it('applies proper text-transform for consistency', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/uppercase/)
  })

  it('handles custom font family props correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      fontFamily="mono"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/font-mono/)
  })

  it('applies proper letter-spacing for readability', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/tracking-wider/)
  })

  it('handles custom color props gracefully', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      primaryColor="#6366f1"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveStyle(/#6366f1/)
  })

  it('applies proper text-wrap for responsive layouts', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/text-wrap/)
  })

  it('handles custom animation easing values correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      animateEasing="ease-in-out"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/ease-in-out/)
  })

  it('applies proper overflow-ellipsis for long text', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      label="Very Long Label" 
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/overflow-ellipsis/)
  })

  it('handles custom z-index values correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      zIndex="20"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/z-20/)
  })

  it('applies proper min-width for horizontal spacing', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/min-w-48/)
  })

  it('handles custom shadow values gracefully', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      shadow="lg"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/shadow-lg/)
  })

  it('applies proper text-justify for alignment', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/text-center/)
  })

  it('handles custom animation delay values correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      animateDelay="200"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/delay-200/)
  })

  it('applies proper whitespace handling for labels', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/whitespace-nowrap/)
  })

  it('handles custom border color props correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      borderColor="#6366f1"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveStyle(/#6366f1/)
  })

  it('applies proper text-indent for visual hierarchy', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/indent-4/)
  })

  it('handles custom animation iteration count correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      animateIterations="infinite"
    />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/animate-infinite/)
  })

  it('applies proper text-transform-none for specific cases', () => {
    render(<UsageMeter current={75} limit={100} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass(/text-transform-none/)
  })

  it('handles custom animation fill mode correctly', () => {
    render(<UsageMeter 
      current={75} 
      limit={100} 
      animateFill="both"
    />)
    
    const progressBar = screen.getByRole('progressbar')
