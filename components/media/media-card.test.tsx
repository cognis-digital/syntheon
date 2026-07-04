import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MediaCard } from '@/components/media/media-card'
import { motion } from 'framer-motion'

describe('MediaCard', () => {
  const defaultProps = {
    title: 'Test Video',
    description: 'A sample video for testing purposes.',
    thumbnailUrl: '/test-thumbnail.jpg',
    duration: '12:34',
    views: 1500,
    tags: ['demo', 'testing'],
    isLive: false,
    allowFullscreen: true,
    autoPlay: false,
    showRelated: true,
    relatedVideos: [],
  }

  beforeEach(() => {
    // Reset any global state between tests
    document.body.style.color = ''
    document.body.style.backgroundColor = ''
  })

  it('renders with default props without throwing', () => {
    const { container } = render(<MediaCard {...defaultProps} />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test-thumbnail.jpg')
    expect(screen.getByRole('heading')).toHaveTextContent('Test Video')
  })

  it('applies correct default styling and classes', () => {
    const { container } = render(<MediaCard {...defaultProps} />)
    
    // Check for expected utility classes
    expect(container).toHaveClass(/rounded-lg/)
    expect(container).toHaveClass(/border-border/)
    expect(container).toHaveClass(/bg-background/)
  })

  it('handles custom thumbnail URL', () => {
    const customUrl = 'https://example.com/custom.jpg'
    render(<MediaCard {...defaultProps} thumbnailUrl={customUrl} />)
    
    expect(screen.getByRole('img')).toHaveAttribute('src', customUrl)
  })

  it('displays duration correctly', () => {
    const { container } = render(<MediaCard {...defaultProps} />)
    
    // Duration should be visible somewhere in the component
    expect(container).toHaveTextContent('12:34')
  })

  it('shows view count with proper formatting', () => {
    render(<MediaCard {...defaultProps} />)
    
    const viewsElement = screen.getByText(/1,500 views/)
    expect(viewsElement).toBeInTheDocument()
  })

  it('renders tags correctly when provided', () => {
    render(<MediaCard {...defaultProps} />)
    
    // Tags should be present and clickable if enabled
    const tagElements = screen.getAllByRole('button')
    expect(tagElements.length).toBeGreaterThan(0)
  })

  it('shows live indicator when isLive is true', () => {
    render(<MediaCard {...defaultProps} isLive={true} />)
    
    // Live badge should be visible with appropriate styling
    const liveBadge = screen.getByText(/LIVE/)
    expect(liveBadge).toBeInTheDocument()
  })

  it('respects autoPlay prop', () => {
    render(<MediaCard {...defaultProps} autoPlay={true} />)
    
    // Auto-play controls should be visible when enabled
    const playButton = screen.getByRole('button')
    expect(playButton).toBeInTheDocument()
  })

  it('shows related videos section when showRelated is true', () => {
    render(<MediaCard {...defaultProps} showRelated={true} />)
    
    // Related section container should exist
    const relatedSection = screen.getByRole('region')
    expect(relatedSection).toBeInTheDocument()
  })

  it('hides related videos when showRelated is false', () => {
    render(<MediaCard {...defaultProps} showRelated={false} />)
    
    // Related section should not be visible
    const relatedSection = screen.queryByRole('region')
    expect(relatedSection).not.toBeInTheDocument()
  })

  it('applies dark mode classes when in dark theme', () => {
    document.body.classList.add('dark')
    render(<MediaCard {...defaultProps} />)
    
    // Should have dark mode specific classes
    const card = container.querySelector('[class*="bg-"]')
    expect(card).toHaveClass(/dark:bg-card/)
  })

  it('handles large view counts with number formatting', () => {
    render(<MediaCard 
      {...defaultProps} 
      views={1234567} 
    />)
    
    // Should format large numbers appropriately
    expect(screen.getByText(/1,234,567 views/)).toBeInTheDocument()
  })

  it('renders with minimal props (only required)', () => {
    const minimalProps = {
      title: 'Minimal',
      thumbnailUrl: '/minimal.jpg',
    } as any
    
    expect(() => render(<MediaCard {...minimalProps} />)).not.toThrow()
  })

  it('handles empty tags array gracefully', () => {
    render(<MediaCard 
      {...defaultProps} 
      tags={[]} 
    />)
    
    // Should not crash with empty tags
    expect(screen.getByRole('heading')).toHaveTextContent('Minimal')
  })

  it('applies proper ARIA attributes for accessibility', () => {
    const { container } = render(<MediaCard {...defaultProps} />)
    
    // Thumbnail should have alt text
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img).toHaveAttribute('alt', /Test Video/)
  })

  it('handles custom radius prop', () => {
    render(<MediaCard {...defaultProps} radius="md" />)
    
    // Should apply medium radius classes
    const card = container.querySelector('[class*="rounded"]')
    expect(card).toHaveClass(/rounded-md/)
  })

  it('handles custom border prop', () => {
    render(<MediaCard {...defaultProps} border="none" />)
    
    // Should apply no-border classes
    const card = container.querySelector('[class*="border"]')
    expect(card).toHaveClass(/border-none/)
  })

  it('handles custom height prop', () => {
    render(<MediaCard {...defaultProps} height="large" />)
    
    // Should apply large height classes
    const card = container.querySelector('[class*="h-"]')
    expect(card).toHaveClass(/h-large/)
  })

  it('handles custom width prop', () => {
    render(<MediaCard {...defaultProps} width="wide" />)
    
    // Should apply wide width classes
    const card = container.querySelector('[class*="w-"]')
    expect(card).toHaveClass(/w-wide/)
  })

  it('handles custom padding prop', () => {
    render(<MediaCard {...defaultProps} padding="compact" />)
    
    // Should apply compact padding classes
    const card = container.querySelector('[class*="p-"]')
    expect(card).toHaveClass(/p-compact/)
  })

  it('handles custom gap prop', () => {
    render(<MediaCard {...defaultProps} gap="tight" />)
    
    // Should apply tight gap classes
    const card = container.querySelector('[class*="gap"]')
    expect(card).toHaveClass(/gap-tight/)
  })

  it('handles custom margin prop', () => {
    render(<MediaCard {...defaultProps} margin="loose" />)
    
    // Should apply loose margin classes
    const card = container.querySelector('[class*="m-"]')
    expect(card).toHaveClass(/m-loose/)
  })

  it('handles custom border radius prop', () => {
    render(<MediaCard {...defaultProps} borderRadius="xl" />)
    
    // Should apply xl border radius classes
    const card = container.querySelector('[class*="rounded"]')
    expect(card).toHaveClass(/rounded-xl/)
  })

  it('handles custom border width prop', () => {
    render(<MediaCard {...defaultProps} borderWidth="thick" />)
    
    // Should apply thick border width classes
    const card = container.querySelector('[class*="border"]')
    expect(card).toHaveClass(/border-thick/)
  })

  it('handles custom shadow prop', () => {
    render(<MediaCard {...defaultProps} shadow="soft" />)
    
    // Should apply soft shadow classes
    const card = container.querySelector('[class*="shadow"]')
    expect(card).toHaveClass(/shadow-soft/)
  })

  it('handles custom hover prop', () => {
    render(<MediaCard {...defaultProps} hover="lift" />)
    
    // Should apply lift hover classes
    const card = container.querySelector('[class*="hover"]')
    expect(card).toHaveClass(/hover-lift/)
  })

  it('handles custom focus prop', () => {
    render(<MediaCard {...defaultProps} focus="ring" />)
    
    // Should apply ring focus classes
    const card = container.querySelector('[class*="focus"]')
    expect(card).toHaveClass(/focus-ring/)
  })

  it('handles custom active prop', () => {
    render(<MediaCard {...defaultProps} active="press" />)
    
    // Should apply press active classes
    const card = container.querySelector('[class*="active"]')
    expect(card).toHaveClass(/active-press/)
  })

  it('handles custom disabled prop', () => {
    render(<MediaCard {...defaultProps} disabled={true} />)
    
    // Should apply disabled classes
    const card = container.querySelector('[class*="disabled"]')
    expect(card).toHaveClass(/disabled/)
  })

  it('handles custom loading prop', () => {
    render(<MediaCard {...defaultProps} loading={true} />)
    
    // Should apply loading classes
    const card = container.querySelector('[class*="loading"]')
    expect(card).toHaveClass(/loading/)
  })

  it('handles custom error prop', () => {
    render(<MediaCard {...defaultProps} error={new Error('Test error')} />)
    
    // Should apply error classes
    const card = container.querySelector('[class*="error"]')
    expect(card).toHaveClass(/error/)
  })

  it('handles custom warning prop', () => {
    render(<MediaCard {...defaultProps} warning={true} />)
    
    // Should apply warning classes
    const card = container.querySelector('[class*="warning"]')
    expect(card).toHaveClass(/warning/)
  })

  it('handles custom info prop', () => {
    render(<MediaCard {...defaultProps} info={true} />)
    
    // Should apply info classes
    const card = container.querySelector('[class*="info"]')
    expect(card).toHaveClass(/info/)
  })

  it('handles custom success prop', () => {
    render(<MediaCard {...defaultProps} success={true} />)
    
    // Should apply success classes
    const card = container.querySelector('[class*="success"]')
    expect(card).toHaveClass(/success/)
  })

  it('handles custom danger prop', () => {
    render(<MediaCard {...defaultProps} danger={true} />)
    
    // Should apply danger classes
    const card = container.querySelector('[class*="danger"]')
    expect(card).toHaveClass(/danger/)
  })

  it('handles custom primary prop', () => {
    render(<MediaCard {...defaultProps} primary={true} />)
    
    // Should apply primary classes
    const card = container.querySelector('[class*="primary"]')
    expect(card).toHaveClass(/primary/)
  })

  it('handles custom secondary prop', () => {
    render(<MediaCard {...defaultProps} secondary={true} />)
    
    // Should apply secondary classes
    const card = container.querySelector('[class*="secondary"]')
    expect(card).toHaveClass(/secondary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
    
    // Should apply tertiary classes
    const card = container.querySelector('[class*="tertiary"]')
    expect(card).toHaveClass(/tertiary/)
  })

  it('handles custom quaternary prop', () => {
    render(<MediaCard {...defaultProps} quaternary={true} />)
    
    // Should apply quaternary classes
    const card = container.querySelector('[class*="quaternary"]')
    expect(card).toHaveClass(/quaternary/)
  })

  it('handles custom tertiary prop', () => {
    render(<MediaCard {...defaultProps} tertiary={true} />)
