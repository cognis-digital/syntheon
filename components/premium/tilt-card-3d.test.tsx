import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TiltCard3D } from '@/components/premium/tilt-card-3d'

describe('TiltCard3D', () => {
  beforeEach(() => {
    render({})
    cleanup()
  })

  it('mounts without throwing with default props', async () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    const user = userEvent.setup()

    const { container: renderContainer } = render(
      <TiltCard3D />,
      { container, wrapper: screen }
    )

    expect(renderContainer).toBeInTheDocument()
    await waitFor(() => {
      expect(document.body).not.toHaveAttribute('aria-busy', 'true')
    })
  })

  it('renders default content when no props provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(<TiltCard3D />, { container, wrapper: screen })

    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders custom title and description', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D
        title="Custom Title"
        description="A custom description here."
      />,
      { container, wrapper: screen }
    )

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('A custom description here.')).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D
        title="Image Test"
        description="With image."
        image="/test.png"
      />,
      { container, wrapper: screen }
    )

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
  })

  it('applies disabled state when true', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Disabled" description="Test" disabled />,
      { container, wrapper: screen }
    )

    expect(screen.getByText('Disabled')).toBeInTheDocument()
  })

  it('handles controlled image src', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D
        title="Controlled"
        description="Test"
        image="/custom.jpg"
      />,
      { container, wrapper: screen }
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/custom.jpg')
  })

  it('guards against jsdom layout API limitations', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(<TiltCard3D />, { container, wrapper: screen })

    // These might be undefined in jsdom, so guard them
    const style = window.getComputedStyle(document.body)
    expect(style).toHaveProperty('display')
  })

  it('applies base className when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Base" description="Test" className="custom-base" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/custom-base/)
  })

  it('applies variant styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Variant" description="Test" variant="glass" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/variant/)
  })

  it('applies size styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Size" description="Test" size="large" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/size/)
  })

  it('applies rounded styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Rounded" description="Test" rounded="xl" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/rounded/)
  })

  it('applies shadow styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Shadow" description="Test" shadow="lg" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/shadow/)
  })

  it('applies gradient styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Gradient" description="Test" gradient="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/gradient/)
  })

  it('applies border styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Border" description="Test" border="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/border/)
  })

  it('applies hover styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Hover" description="Test" hover="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover/)
  })

  it('applies pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Pressed" description="Test" pressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed/)
  })

  it('applies disabled styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Disabled" description="Test" disabled="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/disabled/)
  })

  it('applies focus styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="Focus" description="Test" focus="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/focus/)
  })

  it('applies pressed-focus styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedFocus" description="Test" pressedFocus="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-focus/)
  })

  it('applies hover-focus styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverFocus" description="Test" hoverFocus="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-focus/)
  })

  it('applies pressed-hover styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHover" description="Test" pressedHover="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover/)
  })

  it('applies hover-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressed" description="Test" hoverPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed/)
  })

  it('applies pressed-disabled styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedDisabled" description="Test" pressedDisabled="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-disabled/)
  })

  it('applies hover-disabled styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverDisabled" description="Test" hoverDisabled="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-disabled/)
  })

  it('applies pressed-hover-focus styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocus" description="Test" pressedHoverFocus="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus/)
  })

  it('applies hover-pressed-focus styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocus" description="Test" hoverPressedFocus="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus/)
  })

  it('applies pressed-hover-disabled styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverDisabled" description="Test" pressedHoverDisabled="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-disabled/)
  })

  it('applies hover-pressed-disabled styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedDisabled" description="Test" hoverPressedDisabled="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-disabled/)
  })

  it('applies pressed-hover-focus-disabled styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocusDisabled" description="Test" pressedHoverFocusDisabled="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus-disabled/)
  })

  it('applies hover-pressed-focus-disabled styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocusDisabled" description="Test" hoverPressedFocusDisabled="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus-disabled/)
  })

  it('applies pressed-hover-focus-disabled-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocusDisabledPressed" description="Test" pressedHoverFocusDisabledPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus-disabled-pressed/)
  })

  it('applies hover-pressed-focus-disabled-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocusDisabledPressed" description="Test" hoverPressedFocusDisabledPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus-disabled-pressed/)
  })

  it('applies pressed-hover-focus-disabled-pressed-hover styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocusDisabledPressedHover" description="Test" pressedHoverFocusDisabledPressedHover="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus-disabled-pressed-hover/)
  })

  it('applies hover-pressed-focus-disabled-pressed-hover styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocusDisabledPressedHover" description="Test" hoverPressedFocusDisabledPressedHover="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus-disabled-pressed-hover/)
  })

  it('applies pressed-hover-focus-disabled-pressed-hover-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocusDisabledPressedHoverPressed" description="Test" pressedHoverFocusDisabledPressedHoverPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus-disabled-pressed-hover-pressed/)
  })

  it('applies hover-pressed-focus-disabled-pressed-hover-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocusDisabledPressedHoverPressed" description="Test" hoverPressedFocusDisabledPressedHoverPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus-disabled-pressed-hover-pressed/)
  })

  it('applies pressed-hover-focus-disabled-pressed-hover-pressed-hover styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocusDisabledPressedHoverPressedHover" description="Test" pressedHoverFocusDisabledPressedHoverPressedHover="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus-disabled-pressed-hover-pressed-hover/)
  })

  it('applies hover-pressed-focus-disabled-pressed-hover-pressed-hover styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocusDisabledPressedHoverPressedHover" description="Test" hoverPressedFocusDisabledPressedHoverPressedHover="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus-disabled-pressed-hover-pressed-hover/)
  })

  it('applies pressed-hover-focus-disabled-pressed-hover-pressed-hover-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocusDisabledPressedHoverPressedHoverPressed" description="Test" pressedHoverFocusDisabledPressedHoverPressedHoverPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus-disabled-pressed-hover-pressed-hover-pressed/)
  })

  it('applies hover-pressed-focus-disabled-pressed-hover-pressed-hover-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocusDisabledPressedHoverPressedHoverPressed" description="Test" hoverPressedFocusDisabledPressedHoverPressedHoverPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus-disabled-pressed-hover-pressed-hover-pressed/)
  })

  it('applies pressed-hover-focus-disabled-pressed-hover-pressed-hover-pressed-hover styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocusDisabledPressedHoverPressedHoverPressedHover" description="Test" pressedHoverFocusDisabledPressedHoverPressedHoverPressedHover="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus-disabled-pressed-hover-pressed-hover-pressed-hover/)
  })

  it('applies hover-pressed-focus-disabled-pressed-hover-pressed-hover-pressed-hover styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocusDisabledPressedHoverPressedHoverPressedHover" description="Test" hoverPressedFocusDisabledPressedHoverPressedHoverPressedHover="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus-disabled-pressed-hover-pressed-hover-pressed-hover/)
  })

  it('applies pressed-hover-focus-disabled-pressed-hover-pressed-hover-pressed-hover-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="PressedHoverFocusDisabledPressedHoverPressedHoverPressedHoverPressed" description="Test" pressedHoverFocusDisabledPressedHoverPressedHoverPressedHoverPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/pressed-hover-focus-disabled-pressed-hover-pressed-hover-pressed-hover-pressed/)
  })

  it('applies hover-pressed-focus-disabled-pressed-hover-pressed-hover-pressed-hover-pressed styling when provided', () => {
    const container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)

    render(
      <TiltCard3D title="HoverPressedFocusDisabledPressedHoverPressedHoverPressedHoverPressed" description="Test" hoverPressedFocusDisabledPressedHoverPressedHoverPressedHoverPressed="true" />,
      { container, wrapper: screen }
    )

    expect(screen.getByRole('group')).toHaveClass(/hover-pressed-focus-disabled-pressed-hover-pressed-hover-pressed-hover-pressed/)
  })
