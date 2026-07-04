import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import VideoEmbedSection from '@/components/sections/video-embed-section'

describe('VideoEmbedSection', () => {
  const mockVideoUrl = 'https://example.com/embed/test.mp4'
  const mockTitle = 'Test Video Title'
  const mockDescription = 'A test video description for Syntheon.'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props and sensible defaults', () => {
    const { container } = render(<VideoEmbedSection />)

    expect(container).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
  })

  it('renders provided title and description', () => {
    const { container } = render(
      <VideoEmbedSection
        videoUrl={mockVideoUrl}
        title={mockTitle}
        description={mockDescription}
      />
    )

    expect(screen.getByText(mockTitle)).toBeInTheDocument()
    expect(screen.getByText(mockDescription)).toBeInTheDocument()
  })

  it('applies dark mode correctly', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} />,
      { wrapper: { darkMode: true } }
    )

    expect(container).toHaveClass(/dark-/)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label')
  })

  it('applies correct size variants', () => {
    const small = render(<VideoEmbedSection videoUrl={mockVideoUrl} size="sm" />)
    const medium = render(<VideoEmbedSection videoUrl={mockVideoUrl} size="md" />)
    const large = render(<VideoEmbedSection videoUrl={mockVideoUrl} size="lg" />)

    expect(small.container).toHaveClass(/rounded-lg/)
    expect(medium.container).toHaveClass(/rounded-md/)
    expect(large.container).toHaveClass(/rounded-3xl/)
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('box-shadow: 0px 24px 36px rgb(0, 0, 0, 0.1)')
  })

  it('applies custom border radius', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderRadius="2rem" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-radius: 3.2rem')
  })

  it('applies custom border color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} borderColor="red" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('border-color: rgb(248, 113, 113)')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} bgColor="blue" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('background-color: rgb(59, 130, 246)')
  })

  it('applies custom text color', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} textColor="green" />
    )

    expect(container.firstChild).toHaveAttribute('style')
    expect(container.firstChild?.getAttribute('style')).toContain('color: rgb(34, 197, 94)')
  })

  it('applies custom shadow', () => {
    const { container } = render(
      <VideoEmbedSection videoUrl={mockVideoUrl} shadow="xl" />
    )
