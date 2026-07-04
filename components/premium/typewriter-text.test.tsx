import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Framer Motion (jsdom lacks scroll/layout APIs)
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, className, style }) => (
        <div className={className} style={{ ...style }}>
          {children}
        </div>
      ),
      useReducedMotion: () => false,
    },
  }
})

import { render as framerRender, motion, useReducedMotion } from 'framer-motion'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Framer Motion (jsdom lacks scroll/layout APIs)
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, className, style }) => (
        <div className={className} style={{ ...style }}>
          {children}
        </div>
      ),
      useReducedMotion: () => false,
    },
  }
})

import { render as framerRender, motion, useReducedMotion } from 'framer-motion'
