import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ConfettiCanvas from '@/components/media/confetti-canvas'

describe('ConfettiCanvas', () => {
  it('renders without throwing with defaults', () => {
    const { container } = render(<ConfettiCanvas />)
    expect(container).toBeInTheDocument()
  })

  it('contains a canvas element', () => {
    render(<ConfettiCanvas />)
    const canvas = screen.getByRole('img') as HTMLCanvasElement
    expect(canvas.tagName.toLowerCase()).toBe('canvas')
  })

  it('renders without errors in dark mode', () => {
    document.body.classList.add('dark')
    const { container } = render(<ConfettiCanvas />)
    expect(container).toBeInTheDocument()
    document.body.classList.remove('dark')
  })
})
