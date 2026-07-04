import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { CountUpStats } from '@/components/premium/count-up-stats'

describe('CountUpStats', () => {
  it('mounts without throwing with default props', async () => {
    // Mock hooks that rely on layout/scroll APIs (jsdom limitations)
    vi.spyOn(motion, 'useScroll').mockReturnValue({ scrollY: 0 })
    vi.spyOn(motion, 'useTransform').mockReturnValue([0, 1])
    vi.spyOn(motion, 'useReducedMotion').mockReturnValue(false)

    const { container } = render(
      <CountUpStats
        values={[123456789]}
        labels={['Users', 'Sales']}
        duration={2000}
        easing="easeOut"
      />
    )

    // Just ensure it renders something (presence test)
    expect(container).toBeInTheDocument()
  })

  it('renders the expected label text when provided', async () => {
    const { container } = render(
      <CountUpStats values={[42]} labels={['Test Label']} />
    )

    await waitFor(() => {
      expect(screen.getByText(/test label/i)).toBeInTheDocument()
    })
  })

  it('applies the correct base className when provided', async () => {
    const { container } = render(
      <CountUpStats values={[1]} labels={['X']} className="bg-red-500" />
    )

    expect(container.firstChild).toHaveClass('bg-red-500')
  })

  it('handles an empty values array gracefully', async () => {
    const { container } = render(<CountUpStats values={[]} labels={[]}>
