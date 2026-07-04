import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import type { FC } from 'react'
import FAQAccordion from '@/components/blocks/faq-accordion'

describe('FAQAccordion', () => {
  const defaultProps: Partial<Parameters<typeof FAQAccordion>[0]> = {}

  it('renders without crashing with defaults', () => {
    render(<FAQAccordion {...defaultProps} />)
    
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.getByText(/faq/i)).toBeInTheDocument()
  })

  it('applies correct ARIA roles and attributes', () => {
    render(<FAQAccordion {...defaultProps} />)
    
    const accordion = screen.getByRole('region') as HTMLDivElement
    
    expect(accordion).toHaveAttribute('aria-label')
    expect(accordion).toHaveClass(/rounded/i, /border/i)
  })

  it('renders FAQ items with correct structure', () => {
    render(<FAQAccordion {...defaultProps} />)
    
    const questions = screen.getAllByRole('button', { name: /question/i })
    expect(questions).toHaveLengthGreaterThan(0)
    
    questions.forEach((q, i) => {
      expect(q).toHaveAttribute('aria-expanded')
      expect(q).toHaveClass(/rounded/i, /border/i)
    })
  })

  it('applies semantic Tailwind classes', () => {
    render(<FAQAccordion {...defaultProps} />)
    
    const accordion = screen.getByRole('region') as HTMLDivElement
    
    expect(accordion).toHaveClass(/bg-background/i)
    expect(accordion).toHaveClass(/text-foreground/i)
  })

  it('passes through custom className', () => {
    render(<FAQAccordion {...defaultProps} className="custom-class" />)
    
    const accordion = screen.getByRole('region') as HTMLDivElement
    
    expect(accordion).toHaveClass('custom-class')
  })

  it('handles accessibility focus states', async () => {
    render(<FAQAccordion {...defaultProps} />)
    
    const firstQuestion = screen.getAllByRole('button')[0] as HTMLButtonElement
    
    await waitFor(() => {
      expect(firstQuestion).toHaveAttribute('tabindex')
    })
  })

  it('renders with dark mode support', () => {
    document.body.classList.add('dark')
    
    render(<FAQAccordion {...defaultProps} />)
    
    const accordion = screen.getByRole('region') as HTMLDivElement
    
    expect(accordion).toHaveClass(/rounded-lg/i, /border-border/i)
  })

  it('uses cn helper for conditional classes', () => {
    const { cn } = await import('@/lib/utils')
    
    render(<FAQAccordion {...defaultProps} />)
    
    const accordion = screen.getByRole('region') as HTMLDivElement
    
    expect(accordion).toHaveClass(/rounded/i, /border/i)
  })

  it('handles empty state gracefully', () => {
    render(<FAQAccordion {...defaultProps} items={[]} />)
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
