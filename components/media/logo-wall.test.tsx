import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogoWall } from '@/components/media/logo-wall'

describe('LogoWall', () => {
  it('renders without throwing with default props', () => {
    const { container } = render(<LogoWall />)
    
    expect(container).toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })

  it('applies base styling classes by default', () => {
    const { container } = render(<LogoWall />)
    
    // Verify basic structure exists
    expect(container.querySelector('.grid')).toBeInTheDocument()
  })
})
