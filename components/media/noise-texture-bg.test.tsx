import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NoiseTextureBg } from '@/components/media/noise-texture-bg'

describe('NoiseTextureBg', () => {
  it('renders without throwing with default props', () => {
    const { container } = render(<NoiseTextureBg />)
    
    expect(container).toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })
})
