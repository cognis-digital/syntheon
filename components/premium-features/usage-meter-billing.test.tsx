import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import UsageMeterBilling from '@/components/premium-features/usage-meter-billing'
import { cn } from '@/lib/utils'

describe('UsageMeterBilling', () => {
  const mockCn = vi.fn((...classes) => classes.filter(Boolean).join(' '))
  
  beforeEach(() => {
    vi.mock('@/lib/utils', async (importOriginal) => {
      const mod = await importOriginal()
      return { ...mod, cn: mockCn }
    })
  })

  it('renders with default props without crashing', () => {
    render(<UsageMeterBilling />)
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByText(/usage/i)).toBeInTheDocument()
  })

  it('displays current usage and limit correctly', () => {
    const props = {
      current: 450,
      limit: 1000,
      unit: 'API calls'
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('450 / 1,000')).toBeInTheDocument()
  })

  it('shows warning state when approaching threshold', () => {
    const props = {
      current: 900,
      limit: 1000,
      unit: 'API calls'
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('900 / 1,000')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'warning')
  })

  it('shows critical state when over limit', () => {
    const props = {
      current: 1200,
      limit: 1000,
      unit: 'API calls'
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('1,200 / 1,000')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'critical')
  })

  it('applies correct border radius classes via cn helper', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls',
      borderRadius: 'md' as const
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('rounded-md'),
      expect.any(String)
    )
  })

  it('handles zero usage gracefully', () => {
    const props = {
      current: 0,
      limit: 1000,
      unit: 'API calls'
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('0 / 1,000')).toBeInTheDocument()
  })

  it('renders with custom threshold configuration', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls',
      thresholds: [
        { value: 800, label: 'Warning' },
        { value: 950, label: 'Critical' }
      ]
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('applies dark mode styles correctly', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls',
      theme: 'dark' as const
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('img')).toHaveAttribute('data-theme', 'dark')
  })

  it('passes accessibility attributes to progress indicator', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls',
      ariaLabel: 'Monthly API usage'
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Monthly API usage')
  })

  it('renders tooltip with detailed stats on hover', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls',
      showTooltip: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByText('Reset on').toBeInTheDocument())
  })

  it('handles floating point precision in calculations', () => {
    const props = {
      current: 100.33,
      limit: 500.99,
      unit: 'Storage (GB)'
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('100.33 / 500.99')).toBeInTheDocument()
  })

  it('applies correct semantic color classes', () => {
    const props = {
      current: 800,
      limit: 1000,
      unit: 'API calls',
      colors: {
        warning: 'text-orange-500' as string,
        critical: 'text-red-600' as string
      }
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('text-orange-500'),
      expect.any(String)
    )
  })

  it('renders with responsive container', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls',
      containerSize: 'sm' as const
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('img')).toHaveAttribute('data-size', 'sm')
  })

  it('handles boolean prop defaults correctly', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('API calls')).toBeInTheDocument()
  })

  it('preserves unknown props without breaking', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls',
      customProp: 'test' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('API calls')).toBeInTheDocument()
  })

  it('renders with proper focus management for keyboard users', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      autoFocus: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('tabIndex', '-1')
  })

  it('handles very large numbers with proper formatting', () => {
    const props = {
      current: 999999,
      limit: 1000000,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('999,999 / 1,000,000')).toBeInTheDocument()
  })

  it('applies correct animation classes when enabled', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      animate: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('animate'),
      expect.any(String)
    )
  })

  it('renders with proper semantic HTML structure', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByText(/usage/i)).toBeInTheDocument()
  })

  it('handles null/undefined values gracefully', () => {
    const props = {
      current: null as number | undefined,
      limit: 1000,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('null / 1,000')).toBeInTheDocument()
  })

  it('applies correct border classes for visual hierarchy', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      border: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('border'),
      expect.any(String)
    )
  })

  it('renders with proper shadow depth for premium feel', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      shadow: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('shadow'),
      expect.any(String)
    )
  })

  it('handles very small numbers correctly', () => {
    const props = {
      current: 0.1,
      limit: 1000,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('0.1 / 1,000')).toBeInTheDocument()
  })

  it('applies correct gradient classes when configured', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      gradient: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('gradient'),
      expect.any(String)
    )
  })

  it('renders with proper loading state when data is fetching', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      loading: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'loading')
  })

  it('handles mixed data types in calculations', () => {
    const props = {
      current: 500,
      limit: 1000.5,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('500 / 1,000.5')).toBeInTheDocument()
  })

  it('applies correct semantic color for success state', () => {
    const props = {
      current: 200,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      colors: {
        success: 'text-green-500' as string
      }
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('text-green-500'),
      expect.any(String)
    )
  })

  it('renders with proper focus ring for accessibility', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      focusable: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('tabIndex', '-1')
  })

  it('handles extremely large numbers with scientific notation fallback', () => {
    const props = {
      current: 999999999,
      limit: 1000000000,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('999,999,999 / 1,000,000,000')).toBeInTheDocument()
  })

  it('applies correct border radius for premium aesthetic', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      borderRadius: 'lg' as const
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('rounded-lg'),
      expect.any(String)
    )
  })

  it('renders with proper animation duration when configured', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      animateDuration: 300
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('duration-300'),
      expect.any(String)
    )
  })

  it('handles empty string unit gracefully', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: '' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('500 / 1,000')).toBeInTheDocument()
  })

  it('applies correct semantic color for neutral state', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      colors: {
        neutral: 'text-slate-500' as string
      }
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('text-slate-500'),
      expect.any(String)
    )
  })

  it('renders with proper transition timing for smooth interactions', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      animate: true,
      animateDuration: 200
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('duration-200'),
      expect.any(String)
    )
  })

  it('handles very small decimal numbers correctly', () => {
    const props = {
      current: 0.01,
      limit: 1000,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('0.01 / 1,000')).toBeInTheDocument()
  })

  it('applies correct semantic color for error state', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      colors: {
        error: 'text-red-600' as string
      }
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('text-red-600'),
      expect.any(String)
    )
  })

  it('renders with proper semantic HTML for screen readers', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      ariaLabel: 'Monthly usage tracking'
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Monthly usage tracking')
  })

  it('handles mixed numeric types in calculations', () => {
    const props = {
      current: 500,
      limit: 1000.25,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('500 / 1,000.25')).toBeInTheDocument()
  })

  it('applies correct border classes for visual hierarchy', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      border: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('border'),
      expect.any(String)
    )
  })

  it('renders with proper shadow depth for premium feel', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      shadow: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('shadow'),
      expect.any(String)
    )
  })

  it('handles very small numbers correctly', () => {
    const props = {
      current: 0.1,
      limit: 1000,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('0.1 / 1,000')).toBeInTheDocument()
  })

  it('applies correct gradient classes when configured', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      gradient: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('gradient'),
      expect.any(String)
    )
  })

  it('renders with proper loading state when data is fetching', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      loading: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'loading')
  })

  it('handles mixed data types in calculations', () => {
    const props = {
      current: 500,
      limit: 1000.5,
      unit: 'API calls' as string | undefined
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByText('500 / 1,000.5')).toBeInTheDocument()
  })

  it('applies correct semantic color for success state', () => {
    const props = {
      current: 200,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      colors: {
        success: 'text-green-500' as string
      }
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(mockCn).toHaveBeenCalledWith(
      expect.stringContaining('text-green-500'),
      expect.any(String)
    )
  })

  it('renders with proper focus ring for accessibility', () => {
    const props = {
      current: 500,
      limit: 1000,
      unit: 'API calls' as string | undefined,
      focusable: true
    }
    
    render(<UsageMeterBilling {...props} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('tabIndex', '-1')
  })
