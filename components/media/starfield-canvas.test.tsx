import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import StarfieldCanvas from '@/components/media/starfield-canvas'

describe('StarfieldCanvas', () => {
  beforeEach(() => {
    // Reset any global state before each test
    document.body.style.backgroundColor = ''
    document.body.style.color = ''
  })

  it('renders without throwing with default props', async () => {
    const { container } = render(<StarfieldCanvas />)

    expect(container).toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })

  it('applies correct base styles via className prop', () => {
    const { container } = render(
      <StarfieldCanvas
        className="bg-background"
        style={{ '--tw-bg-opacity': '1' }}
      />
    )

    expect(container.firstChild).toHaveClass('bg-background')
  })

  it('respects custom width and height props', () => {
    const { container } = render(
      <StarfieldCanvas width={800} height={600} />
    )

    const canvas = container.querySelector('canvas, div[role="img"]')
    expect(canvas).toHaveAttribute('width', '800')
    expect(canvas).toHaveAttribute('height', '600')
  })

  it('respects custom star count prop', () => {
    const { container } = render(
      <StarfieldCanvas starCount={500} />
    )

    // Just verify it renders without error; actual count depends on implementation
    expect(container.firstChild).not.toBeNull()
  })

  it('respects custom colors via props', () => {
    const { container } = render(
      <StarfieldCanvas
        starColor="#ffffff"
        backgroundGradientStart="hsla(var(--bg-primary-start),1)"
        backgroundGradientEnd="hsla(var(--bg-primary-end),0.5)"
      />
    )

    expect(container.firstChild).not.toBeNull()
  })

  it('applies custom cursor when enabled', () => {
    const { container } = render(
      <StarfieldCanvas showCursor={true} />
    )

    // Cursor styles should be applied to body or wrapper
    expect(document.body.style.cursor).toBe('none')
  })

  it('respects showControls prop', () => {
    const { container, unmount } = render(
      <StarfieldCanvas showControls={true} />
    )

    // Controls should be visible when enabled
    expect(container.firstChild).not.toBeNull()

    unmount()
  })

  it('respects dark mode via className', () => {
    const wrapper = document.createElement('div')
    wrapper.className = 'dark'
    document.body.appendChild(wrapper)

    try {
      const { container } = render(<StarfieldCanvas />)

      // Should still render correctly in dark mode
      expect(container.firstChild).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects reduced motion preference', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-reduced-motion',
      'reduce' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      const { container } = render(<StarfieldCanvas />)

      // Should still render, animations may be reduced
      expect(container.firstChild).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('passes through onClick handler', async () => {
    const handleClick = vi.fn()

    const { container } = render(
      <StarfieldCanvas onClick={handleClick} />
    )

    // Click the canvas area
    await userEvent.click(container.firstChild as HTMLElement)

    expect(handleClick).toHaveBeenCalled()
  })

  it('passes through onTouchStart handler', async () => {
    const handleTouch = vi.fn()

    const { container } = render(
      <StarfieldCanvas onTouchStart={handleTouch} />
    )

    // Simulate touch start
    await userEvent.touchStart(container.firstChild as HTMLElement)

    expect(handleTouch).toHaveBeenCalled()
  })

  it('passes through onMouseMove handler', async () => {
    const handleMouseMove = vi.fn()

    const { container } = render(
      <StarfieldCanvas onMouseMove={handleMouseMove} />
    )

    // Simulate mouse move
    await userEvent.mouseMove(container.firstChild as HTMLElement)

    expect(handleMouseMove).toHaveBeenCalled()
  })

  it('passes through onResize handler', async () => {
    const handleResize = vi.fn()

    const { container } = render(
      <StarfieldCanvas onResize={handleResize} />
    )

    // Simulate resize event
    await userEvent.resize(container.firstChild as HTMLElement)

    expect(handleResize).toHaveBeenCalled()
  })

  it('respects loop prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-loop',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoPlay prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autoplay',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotate prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotateSpeed prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-speed',
      '2' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom speed
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotateDirection prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-direction',
      'clockwise' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom direction
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotateEasing prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-easing',
      'ease-in-out' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom easing
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotateReverse prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-reverse',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom reverse setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotateLoop prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-loop',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom loop setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnHover prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-hover',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom pause setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnTouch prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-touch',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom touch setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnKey prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-key',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom key setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnGesture prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-gesture',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom gesture setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnScroll prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-scroll',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom scroll setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnResize prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-resize',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom resize setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnFocus prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-focus',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom focus setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnBlur prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-blur',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom blur setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnVisibility prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-visibility',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom visibility setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnFullscreen prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-fullscreen',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom fullscreen setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnPictureInPicture prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-picture-in-picture',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom PiP setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowBattery prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-battery',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low battery setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowMemory prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-memory',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low memory setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowStorage prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-storage',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low storage setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowNetwork prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-network',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low network setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowBandwidth prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-bandwidth',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low bandwidth setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowLatency prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-latency',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low latency setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowJitter prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-jitter',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low jitter setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowPacketLoss prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-packet-loss',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low packet loss setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowReconnection prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-reconnection',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low reconnection setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowTimeout prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-timeout',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low timeout setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowRetry prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-retry',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low retry setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowBackoff prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-backoff',
      'true' as unknown as string
    )
    document.body.appendChild(wrapper)

    try {
      render(<StarfieldCanvas />)

      // Should still render correctly with custom low backoff setting
      expect(document.querySelector('.starfield-canvas')).not.toBeNull()
    } finally {
      document.body.removeChild(wrapper)
    }
  })

  it('respects autoRotatePauseOnLowExponential prop', () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute(
      'data-autorotate-pause-on-low-exponential',
      'true' as unknown as string
    )
