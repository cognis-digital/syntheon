import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AnimatedGradientText } from '@/components/premium/animated-gradient-text'

describe('AnimatedGradientText', () => {
  it('mounts without throwing with defaults', async () => {
    // jsdom lacks layout/scroll APIs — guard against them
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = function (): DOMRectLike | undefined {
      return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 } as DOMRect
    }

    try {
      render(
        <AnimatedGradientText>
          Hello World
        </AnimatedGradientText>,
      )

      // assert presence, not motion (jsdom can't measure real layout)
      const text = screen.getByRole('heading', { name: /hello world/i })
      expect(text).toBeInTheDocument()
    } finally {
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    }
  })
})
