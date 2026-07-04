import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { featureSplitRight } from '@/components/sections/feature-split-right'
import { motion } from 'framer-motion'

describe('FeatureSplitRight', () => {
  const baseProps = {
    title: 'Advanced Analytics',
    description: 'Real-time insights with predictive modeling.',
    imageSrc: '/images/analytics.png',
    icon: 'chart',
    variant: 'default',
  }

  it('renders without crashing with defaults', () => {
    const { container } = render(
      <featureSplitRight {...baseProps} />
    )
    
    expect(container).toBeInTheDocument()
    expect(screen.getByText(baseProps.title)).toBeInTheDocument()
    expect(screen.getByText(baseProps.description)).toBeInTheDocument()
  })

  it('applies correct base styling', () => {
    render(<featureSplitRight {...baseProps} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('rounded-lg', 'overflow-hidden')
    expect(container).toHaveStyle('flex-direction: row-reverse')
  })

  it('renders image with proper aspect ratio', () => {
    render(<featureSplitRight {...baseProps} />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', baseProps.imageSrc)
    expect(img).toHaveClass('w-full', 'h-full', 'object-cover')
  })

  it('applies motion variants when enabled', () => {
    render(
      <featureSplitRight {...baseProps} animateImage={true} />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveClass('motion-safe:animate-fade-in-up')
  })

  it('respects responsive breakpoints', () => {
    render(
      <featureSplitRight {...baseProps} className="max-w-7xl" />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('max-w-7xl')
  })

  it('handles custom title and description', () => {
    render(
      <featureSplitRight 
        title="Custom Title Test" 
        description="Custom Description Text" 
      />
    )
    
    expect(screen.getByText('Custom Title Test')).toBeInTheDocument()
    expect(screen.getByText('Custom Description Text')).toBeInTheDocument()
  })

  it('applies dark mode variants', () => {
    render(
      <featureSplitRight {...baseProps} className="dark" />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('dark:border-border-dark')
  })

  it('respects reduced motion preference', () => {
    document.body.classList.add('prefers-reduced-motion:reduce')
    
    render(
      <featureSplitRight {...baseProps} animateImage={true} />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveClass('motion-safe:animate-fade-in-up')
  })

  it('handles optional icon prop', () => {
    render(
      <featureSplitRight {...baseProps} icon="chart" />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('bg-primary/10')
  })

  it('renders with minimal props (defaults work)', () => {
    render(<featureSplitRight />)
    
    expect(screen.getByText(/Advanced Analytics/i)).toBeInTheDocument()
  })

  it('applies hover effects when interactive', () => {
    render(
      <featureSplitRight {...baseProps} interactive={true} />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('hover:scale-[1.02]')
  })

  it('respects className prop merging', () => {
    render(
      <featureSplitRight {...baseProps} className="border-4 border-red" />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('border-4', 'border-red')
  })

  it('handles image loading states gracefully', async () => {
    render(
      <featureSplitRight {...baseProps} imageSrc="/slow-load.png" />
    )
    
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(<featureSplitRight {...baseProps} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveAttribute('aria-label')
    expect(container).toHaveClass('sr-only:opacity-0')
  })

  it('renders correctly with long text wrapping', () => {
    render(
      <featureSplitRight 
        title="Very Long Title That Should Wrap Properly"
        description="This is a very long description that should wrap properly within the container and respect the max-width constraints."
      />
    )
    
    expect(screen.getByText('Very Long Title')).toBeInTheDocument()
  })

  it('applies correct z-index layering', () => {
    render(<featureSplitRight {...baseProps} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('z-10')
  })

  it('handles empty string props without breaking', () => {
    render(
      <featureSplitRight 
        title="" 
        description="" 
        imageSrc="/empty.png"
      />
    )
    
    const container = screen.getByRole('region')
    expect(container).toBeInTheDocument()
  })

  it('respects border radius configuration', () => {
    render(
      <featureSplitRight {...baseProps} borderRadius="2xl" />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('rounded-2xl')
  })

  it('handles disabled state correctly', () => {
    render(
      <featureSplitRight {...baseProps} disabled={true} />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('opacity-60', 'cursor-not-allowed')
  })

  it('renders with custom background gradient', () => {
    render(
      <featureSplitRight {...baseProps} bgGradient="from-violet/20 to-indigo/10" />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('bg-gradient-to-br')
  })

  it('handles very small viewport gracefully', () => {
    render(<featureSplitRight {...baseProps} className="w-64" />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('w-64')
  })

  it('maintains consistent spacing with gap prop', () => {
    render(
      <featureSplitRight {...baseProps} gap="8" />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('gap-8')
  })

  it('respects max-height constraint', () => {
    render(
      <featureSplitRight {...baseProps} maxHeight="64" />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('max-h-64')
  })

  it('handles multiple instances without state conflicts', () => {
    render(
      <>
        <featureSplitRight title="Instance A" />
        <featureSplitRight title="Instance B" />
        <featureSplitRight title="Instance C" />
      </>
    )
    
    expect(screen.getAllByRole('region')).toHaveLength(3)
  })

  it('applies correct font weights and sizes', () => {
    render(<featureSplitRight {...baseProps} />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('text-2xl', 'font-semibold')
  })

  it('handles custom text colors via className', () => {
    render(
      <featureSplitRight 
        {...baseProps} 
        className="text-primary/90"
      />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('text-primary/90')
  })

  it('respects line-height for readability', () => {
    render(<featureSplitRight {...baseProps} lineHeight="relaxed" />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('leading-relaxed')
  })

  it('handles overflow text gracefully with truncation', () => {
    render(
      <featureSplitRight 
        {...baseProps} 
        truncateText={true}
      />
    )
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('truncate-overflow')
  })

  it('applies correct shadow depth levels', () => {
    render(<featureSplitRight {...baseProps} shadow="lg" />)
    
    const container = screen.getByRole('region')
    expect(container).toHaveClass('shadow-lg')
  })

  it('handles custom padding configuration', () =>
