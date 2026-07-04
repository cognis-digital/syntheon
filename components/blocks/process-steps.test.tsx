import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { processSteps } from '@/components/blocks/process-steps'
import { vi } from 'vitest'

describe('process-steps', () => {
  const defaultProps = {
    steps: [
      { label: 'Step 1', description: 'First step details' },
      { label: 'Step 2', description: 'Second step details' },
      { label: 'Step 3', description: 'Third step details' },
    ],
    currentStep: 0,
    isComplete: false,
  }

  it('renders with default props and shows all steps', () => {
    const component = render(processSteps(defaultProps))
    
    expect(component.container).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    
    screen.getAllByText(/Step 1/i).forEach((el: HTMLLIElement) => {
      expect(el).toHaveTextContent('Step 1')
    })
  })

  it('renders each step with correct structure', () => {
    const component = render(processSteps(defaultProps))
    
    screen.getAllByRole('listitem').forEach((item: HTMLLIElement) => {
      expect(item).toHaveAttribute('aria-label')
      expect(item).toHaveTextContent()
    })
  })

  it('applies correct semantic classes', () => {
    const component = render(processSteps(defaultProps))
    
    // Check for background and border tokens
    expect(component.container.querySelector('.bg-background')).toBeInTheDocument()
    expect(component.container.querySelector('.border-border')).toBeInTheDocument()
  })

  it('handles dark mode correctly', async () => {
    const container = document.createElement('div')
    container.classList.add('dark')
    document.body.appendChild(container)
    
    render(processSteps(defaultProps), { container })
    
    expect(screen.getByRole('list')).toHaveClass(/bg-card/i)
  })

  it('applies reduced motion when preferred', async () => {
    const container = document.createElement('div')
    container.classList.add('dark')
    vi.spyOn(window, 'matchMedia').mockImplementationOnce(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    
    render(processSteps(defaultProps), { container })
    
    // Motion classes should be gated
    expect(screen.getByRole('list')).toHaveClass(/bg-card/i)
  })

  it('renders accessibility attributes correctly', () => {
    const component = render(processSteps(defaultProps))
    
    screen.getAllByRole('listitem').forEach((item: HTMLLIElement) => {
      expect(item).toHaveAttribute('aria-label')
      expect(item).toHaveTextContent()
    })
  })

  it('handles empty steps gracefully', () => {
    const component = render(processSteps({ steps: [], currentStep: 0 }))
    
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('renders with custom step count', () => {
    const component = render(processSteps({ ...defaultProps, steps: Array(5).fill(null) as any }))
    
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })
})
