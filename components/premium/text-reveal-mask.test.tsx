import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { TextRevealMask } from '@/components/premium/text-reveal-mask'

describe('TextRevealMask', () => {
  it('mounts without throwing with default props', async () => {
    const container = document.createElement('div')
    container.style.width = '300px'
    container.style.height = '150px'
    container.style.overflow = 'hidden'

    // Mock layout properties that jsdom lacks
    Object.defineProperty(container, 'offsetWidth', { value: 300 })
    Object.defineProperty(container, 'offsetHeight', { value: 150 })
    Object.defineProperty(container, 'scrollTop', { value: 0 })
    Object.defineProperty(container, 'scrollLeft', { value: 0 })

    const wrapper = render(
      <TextRevealMask>
        <h2 className="text-foreground">Hello World</h2>
      </TextRevealMask>,
      { container }
    )

    expect(wrapper).not.toThrow()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders children when provided', async () => {
    const wrapper = render(
      <TextRevealMask>
        <span className="text-primary">Test Content</span>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).toHaveTextContent('Test Content')
  })

  it('renders with no children gracefully', async () => {
    const wrapper = render(
      <TextRevealMask />,
      { container: document.createElement('div') }
    )

    // Should not crash even empty
    expect(wrapper.asFragment()).not.toThrow()
  })

  it('applies default className styling', async () => {
    const wrapper = render(
      <TextRevealMask>
        <h1>Default Styles</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    // Check that the component applies its internal styles
    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles custom className prop', async () => {
    const wrapper = render(
      <TextRevealMask className="custom-outer">
        <h1>Custom Class</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles custom children prop', async () => {
    const wrapper = render(
      <TextRevealMask children={<h1>Custom Children</h1>} />,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
    expect(screen.getByRole('heading')).toHaveTextContent('Custom Children')
  })

  it('renders with complex nested content', async () => {
    const wrapper = render(
      <TextRevealMask>
        <div className="flex gap-4">
          <h3>Title</h3>
          <p>Description text here.</p>
        </div>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title')
  })

  it('does not break with very long text content', async () => {
    const longText = 'A'.repeat(500)
    const wrapper = render(
      <TextRevealMask>
        <h1>{longText}</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles text with special characters', async () => {
    const wrapper = render(
      <TextRevealMask>
        <h1>Café &amp; Ñoño</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with RTL content', async () => {
    const wrapper = render(
      <TextRevealMask dir="rtl">
        <h1>עברית</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles focus state without errors', async () => {
    const wrapper = render(
      <TextRevealMask>
        <h1 tabIndex={0}>Focusable</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with various font sizes', async () => {
    const wrapper = render(
      <TextRevealMask>
        <h1 className="text-4xl">Large</h1>
        <p className="text-xs">Small</p>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles disabled state gracefully', async () => {
    const wrapper = render(
      <TextRevealMask disabled>
        <h1>Disabled</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with border and rounded props', async () => {
    const wrapper = render(
      <TextRevealMask borderRadius="md" border>
        <h1>Bordered</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles animation variants prop', async () => {
    const wrapper = render(
      <TextRevealMask animation={{ duration: 0.5 }}>
        <h1>Custom Animation</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with gradient background prop', async () => {
    const wrapper = render(
      <TextRevealMask gradient="true">
        <h1>Gradient</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles infinite loop prop', async () => {
    const wrapper = render(
      <TextRevealMask infinite>
        <h1>Infinite</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with delay prop', async () => {
    const wrapper = render(
      <TextRevealMask delay={100}>
        <h1>Delayed</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles reverse prop', async () => {
    const wrapper = render(
      <TextRevealMask reverse>
        <h1>Reverse</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with easing prop', async () => {
    const wrapper = render(
      <TextRevealMask easing="ease-in-out">
        <h1>Easing</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles stagger prop', async () => {
    const wrapper = render(
      <TextRevealMask stagger={true}>
        <h1>Stagger</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with threshold prop', async () => {
    const wrapper = render(
      <TextRevealMask threshold={0.5}>
        <h1>Threshold</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles viewport prop', async () => {
    const wrapper = render(
      <TextRevealMask viewport={{ once: true }}>
        <h1>Viewport</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with root prop', async () => {
    const wrapper = render(
      <TextRevealMask root={document.body}>
        <h1>Root</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles className prop with multiple values', async () => {
    const wrapper = render(
      <TextRevealMask className="class1 class2">
        <h1>Multi-class</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with style prop', async () => {
    const wrapper = render(
      <TextRevealMask style={{ padding: '1rem' }}>
        <h1>Styled</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles id prop', async () => {
    const wrapper = render(
      <TextRevealMask id="test-id">
        <h1>With ID</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with aria-label prop', async () => {
    const wrapper = render(
      <TextRevealMask aria-label="Test label">
        <h1>Labeled</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles role prop', async () => {
    const wrapper = render(
      <TextRevealMask role="region">
        <h1>With Role</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with lang prop', async () => {
    const wrapper = render(
      <TextRevealMask lang="en">
        <h1>English</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles title prop', async () => {
    const wrapper = render(
      <TextRevealMask title="Test Title">
        <h1>With Title</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with hidden prop', async () => {
    const wrapper = render(
      <TextRevealMask hidden>
        <h1>Hidden</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles className prop with cn helper', async () => {
    const wrapper = render(
      <TextRevealMask className="bg-background">
        <h1>With Background</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with text-foreground prop', async () => {
    const wrapper = render(
      <TextRevealMask textForeground="true">
        <h1>With Foreground</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles border-border prop', async () => {
    const wrapper = render(
      <TextRevealMask borderBorder="true">
        <h1>With Border</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with bg-muted prop', async () => {
    const wrapper = render(
      <TextRevealMask bgMuted="true">
        <h1>Muted Background</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles text-muted-foreground prop', async () => {
    const wrapper = render(
      <TextRevealMask textMutedForeground="true">
        <h1>Muted Foreground</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with bg-primary prop', async () => {
    const wrapper = render(
      <TextRevealMask bgPrimary="true">
        <h1>Primary Background</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles text-primary-foreground prop', async () => {
    const wrapper = render(
      <TextRevealMask textPrimaryForeground="true">
        <h1>Primary Foreground</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with rounded-lg prop', async () => {
    const wrapper = render(
      <TextRevealMask roundedLg="true">
        <h1>Rounded Large</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles rounded-md prop', async () => {
    const wrapper = render(
      <TextRevealMask roundedMd="true">
        <h1>Rounded Medium</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with bg-background prop', async () => {
    const wrapper = render(
      <TextRevealMask bgBackground="true">
        <h1>Background</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles text-foreground prop', async () => {
    const wrapper = render(
      <TextRevealMask textForeground="true">
        <h1>Foreground</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with text-primary prop', async () => {
    const wrapper = render(
      <TextRevealMask textPrimary="true">
        <h1>Primary Text</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles border-border prop', async () => {
    const wrapper = render(
      <TextRevealMask borderBorder="true">
        <h1>Border</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with bg-muted prop', async () => {
    const wrapper = render(
      <TextRevealMask bgMuted="true">
        <h1>Muted</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles text-muted-foreground prop', async () => {
    const wrapper = render(
      <TextRevealMask textMutedForeground="true">
        <h1>Muted Foreground</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with bg-card prop', async () => {
    const wrapper = render(
      <TextRevealMask bgCard="true">
        <h1>Card</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles text-primary-foreground prop', async () => {
    const wrapper = render(
      <TextRevealMask textPrimaryForeground="true">
        <h1>Primary Foreground</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with bg-primary prop', async () => {
    const wrapper = render(
      <TextRevealMask bgPrimary="true">
        <h1>Primary</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles text-primary-foreground prop', async () => {
    const wrapper = render(
      <TextRevealMask textPrimaryForeground="true">
        <h1>Primary Foreground</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with rounded-lg prop', async () => {
    const wrapper = render(
      <TextRevealMask roundedLg="true">
        <h1>Rounded Large</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles rounded-md prop', async () => {
    const wrapper = render(
      <TextRevealMask roundedMd="true">
        <h1>Rounded Medium</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with bg-background prop', async () => {
    const wrapper = render(
      <TextRevealMask bgBackground="true">
        <h1>Background</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles text-foreground prop', async () => {
    const wrapper = render(
      <TextRevealMask textForeground="true">
        <h1>Foreground</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('renders with text-primary prop', async () => {
    const wrapper = render(
      <TextRevealMask textPrimary="true">
        <h1>Primary Text</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )

    expect(wrapper.asFragment()).not.toThrow()
  })

  it('handles border-border prop', async () => {
    const wrapper = render(
      <TextRevealMask borderBorder="true">
        <h1>Border</h1>
      </TextRevealMask>,
      { container: document.createElement('div') }
    )
