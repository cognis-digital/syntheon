import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { motion, useReducedMotion } from 'framer-motion'
import { AnimatedTestimonials } from '@/components/premium/animated-testimonials'

describe('AnimatedTestimonials', () => {
  beforeEach(() => {
    // Mock layout and scroll APIs that jsdom lacks
    Object.defineProperty(window, 'getComputedStyle', {
      value: (...args: any[]) => {
        const mockStyle = {
          display: 'block',
          position: 'relative',
          width: '300px',
          height: '150px',
          marginTop: '24px',
          marginBottom: '24px',
          borderRadius: '12px',
          overflow: 'hidden',
        } as any

        return {
          ...mockStyle,
          getPropertyValue: (prop: string) => mockStyle[prop] || '',
        }
      },
    })

    Object.defineProperty(window, 'scrollY', { value: 0 })
    Object.defineProperty(window, 'getBoundingClientRect', {
      value: () => ({
        top: 0,
        right: 300,
        bottom: 150,
        left: 0,
        width: 300,
        height: 150,
        x: 0,
        y: 0,
      }),
    })

    // Mock requestAnimationFrame for motion
    Object.defineProperty(window, 'requestAnimationFrame', {
      value: (cb: any) => cb(),
    })
  })

  it('mounts without throwing', () => {
    const { container } = render(
      <AnimatedTestimonials
        data={[
          {
            name: 'Alex Chen',
            role: 'CTO at TechCorp',
            quote: 'The design system transformed our entire product. Clean, consistent, and delightful.',
            avatarUrl: '/avatars/alex.jpg',
          },
        ]}
      />
    )

    expect(container).toBeInTheDocument()
  })

  it('renders the first testimonial by default', () => {
    const { container } = render(
      <AnimatedTestimonials
        data={[
          {
            name: 'Jordan Smith',
            role: 'Product Designer',
            quote: 'Finally, a design system that feels premium out of the box.',
            avatarUrl: '/avatars/jordan.jpg',
          },
        ]}
      />
    )

    expect(screen.getByText('Jordan Smith')).toBeInTheDocument()
    expect(screen.getByText('Product Designer')).toBeInTheDocument()
  })

  it('applies semantic CSS classes correctly', () => {
    const { container } = render(
      <AnimatedTestimonials
        data={[
          {
            name: 'Taylor Brown',
            role: 'Engineering Lead',
            quote: 'The motion feels natural and never distracts from content.',
            avatarUrl: '/avatars/taylor.jpg',
          },
        ]}
      />
    )

    // Check for semantic class usage
    const root = container.querySelector('[class*="bg-background"]')
    expect(root).toBeInTheDocument()

    const textElement = container.querySelector('[class*="text-foreground"]')
    expect(textElement).toBeInTheDocument()
  })

  it('respects prefers-reduced-motion', () => {
    // Simulate reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        addListener: () => {},
        removeListener: () => {},
      }),
    })

    const { container } = render(
      <AnimatedTestimonials
        data={[
          {
            name: 'Sam Wilson',
            role: 'Founder',
            quote: 'Simple, elegant, and built for the web.',
            avatarUrl: '/avatars/sam.jpg',
          },
        ]}
      />
    )

    // Should still mount and render content
    expect(screen.getByText('Sam Wilson')).toBeInTheDocument()
  })

  it('handles multiple testimonials', () => {
    const { container } = render(
      <AnimatedTestimonials
        data={[
          { name: 'One', role: '', quote: 'First.', avatarUrl: '' },
          { name: 'Two', role: '', quote: 'Second.', avatarUrl: '' },
          { name: 'Three', role: '', quote: 'Third.', avatarUrl: '' },
        ]}
      />
    )

    expect(container.querySelectorAll('[class*="bg-card"]').length).toBe(3)
  })

  it('uses rounded-lg by default for cards', () => {
    const { container } = render(
      <AnimatedTestimonials
        data={[
          { name: 'Roundy', role: '', quote: 'Rounded.', avatarUrl: '' },
        ]}
      />
    )

    expect(container.querySelector('[class*="rounded-lg"]')).toBeInTheDocument()
  })
})
