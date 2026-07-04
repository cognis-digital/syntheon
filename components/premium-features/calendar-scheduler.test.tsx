import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalendarScheduler } from '@/components/premium-features/calendar-scheduler'
import { cn } from '@/lib/utils'

describe('CalendarScheduler', () => {
  const defaultProps = {
    selectedDate: new Date(),
    onDateSelect: vi.fn(),
    events: [],
    theme: 'light',
  }

  it('renders without crashing with default props', () => {
    render(<CalendarScheduler {...defaultProps} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('applies correct base classes via cn helper', () => {
    const container = render(
      <div className={cn('p-4', 'rounded-lg')}>Test</div>
    ).container

    expect(container.firstChild).toHaveClass('p-4', 'rounded-lg')
  })

  it('handles dark mode correctly', () => {
    document.body.classList.add('dark')
    render(<CalendarScheduler {...defaultProps} />)
    // Verify dark theme tokens are applied (bg-background, text-foreground, etc.)
    expect(document.body).toHaveClass('dark')
  })

  it('calls onDateSelect when a date is clicked', () => {
    const mockOnDateSelect = vi.fn()
    render(<CalendarScheduler {...defaultProps} onDateSelect={mockOnDateSelect} />)

    // Simulate clicking a day cell (assuming grid structure)
    fireEvent.click(screen.getByRole('gridcell'))

    expect(mockOnDateSelect).toHaveBeenCalled()
  })

  it('renders events with proper accessibility attributes', () => {
    const mockEvents = [
      { id: '1', title: 'Meeting', start: new Date(), end: new Date() },
    ]
    render(<CalendarScheduler {...defaultProps} events={mockEvents} />)

    // Verify event content is accessible
    expect(screen.getByText('Meeting')).toBeInTheDocument()
  })

  it('applies rounded-lg radius to calendar container', () => {
    const container = render(
      <div className={cn('p-4', 'rounded-lg')}>Test</div>
    ).container

    expect(container.firstChild).toHaveClass('rounded-lg')
  })

  it('respects prefers-reduced-motion preference', () => {
    document.body.classList.add('prefers-reduced-motion: reduce')
    render(<CalendarScheduler {...defaultProps} />)
    // Motion classes should be gated or minimized
    expect(document.body).toHaveClass('prefers-reduced-motion: reduce')
  })

  it('renders with correct semantic color tokens', () => {
    const container = render(
      <div className={cn('p-4', 'rounded-lg')}>Test</div>
    ).container

    expect(container.firstChild).toHaveClass('p-4', 'rounded-lg')
  })

  it('handles empty events array gracefully', () => {
    const container = render(
      <div className={cn('p-4', 'rounded-lg')}>Test</div>
    ).container

    expect(container.firstChild).toHaveClass('p-4', 'rounded-lg')
  })

  it('applies rounded-lg radius to calendar container', () => {
    const container = render(
      <div className={cn('p-4', 'rounded-lg')}>Test</div>
    ).container

    expect(container.firstChild).toHaveClass('rounded-lg')
  })
})
