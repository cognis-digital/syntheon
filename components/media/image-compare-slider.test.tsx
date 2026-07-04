import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImageCompareSlider from '@/components/media/image-compare-slider'

describe('ImageCompareSlider', () => {
  it('renders without throwing with defaults', () => {
    const { container } = render(<ImageCompareSlider />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('accepts custom images as props', async () => {
    const beforeSrc = 'https://example.com/before.png'
    const afterSrc = 'https://example.com/after.png'
    
    render(<ImageCompareSlider before={beforeSrc} after={afterSrc} />)
    
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('accepts custom labels as props', () => {
    render(
      <ImageCompareSlider
        beforeLabel="Original"
        afterLabel="Enhanced"
      />
    )
    
    expect(screen.getByText(/original/i)).toBeInTheDocument()
    expect(screen.getByText(/enhanced/i)).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ImageCompareSlider className="custom-class" />)
    
    const sliderContainer = screen.getByRole('slider')
    expect(sliderContainer).toHaveClass('custom-class')
  })

  it('respects disabled prop', async () => {
    render(<ImageCompareSlider disabled />)
    
    const slider = screen.getByRole('slider') as HTMLInputElement
    expect(slider.disabled).toBe(true)
  })

  it('applies custom width via style prop', () => {
    render(<ImageCompareSlider style={{ width: '500px' }} />)
    
    const sliderContainer = screen.getByRole('slider')
    expect(sliderContainer).toHaveStyle({ width: '500px' })
  })

  it('handles image loading state gracefully', async () => {
    render(<ImageCompareSlider before="" after="" />)
    
    // Should not throw even with empty images
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })
})
