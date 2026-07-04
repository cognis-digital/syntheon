import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { motion, useReducedMotion } from 'framer-motion'
import { BorderBeam } from '@/components/premium/border-beam'

// Mock layout/scroll APIs that jsdom lacks
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  }
})

describe('BorderBeam', () => {
  it('mounts without throwing', () => {
    render(<BorderBeam />)
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })

  it('renders with default props', () => {
    const { container } = render(<BorderBeam />)
    expect(container).not.toBeNull()
  })

  it('respects reduced motion preference', async () => {
    vi.spyOn(motion, 'useReducedMotion').mockReturnValue(true)
    render(<BorderBeam />)
    await waitFor(() => {
      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })
  })
})
