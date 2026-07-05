import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlowDivider } from '@/components/media/glow-divider'

describe('GlowDivider', () => {
  it('renders with defaults without throwing', () => {
    const { container } = render(<GlowDivider />)
    
    expect(container).toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })
})
