import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GradientOrbBg } from '@/components/media/gradient-orb-bg'

describe('GradientOrbBg', () => {
  it('renders with defaults without throwing', () => {
    const { container } = render(<GradientOrbBg />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
