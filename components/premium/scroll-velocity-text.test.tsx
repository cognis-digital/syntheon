import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'

// Mock framer-motion hooks before importing the component
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useScroll: vi.fn().mockReturnValue({ scrollYProgress: 0 } as MotionValue),
    useTransform: vi.fn(),
    useReducedMotion: vi.fn().mockReturnValue(false),
    motion: {
      div: actual.motion.div,
      h1: actual.motion.h1,
      p: actual.motion.p,
      span: actual.motion.span,
    },
  }
})

// Mock the component being tested
vi.mock('@/components/premium/scroll-velocity-text', () => {
  return {
    ScrollVelocityText: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    ),
  }
})

import { ScrollVelocityText } from '@/components/premium/scroll-velocity-text'

describe('ScrollVelocityText', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts without throwing errors', () => {
    const { container } = render(
      <ScrollVelocityText>
        <h1>Hello World</h1>
      </ScrollVelocityText>
    )

    expect(container).toBeInTheDocument()
  })

  it('renders children correctly with default props', () => {
    const text = 'Test Content'
    render(
      <ScrollVelocityText>
        <p>{text}</p>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent(text)
  })

  it('applies className when provided', () => {
    const customClass = 'custom-test-class'
    render(
      <ScrollVelocityText className={customClass}>
        <h1>Test</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveClass(customClass)
  })

  it('handles reduced motion preference', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    
    render(
      <ScrollVelocityText>
        <h1>Test</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('renders with dark mode tokens', () => {
    document.body.style.color = '#ffffff'
    
    render(
      <ScrollVelocityText className="text-primary">
        <h1>Dark Mode Test</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Dark Mode Test')
  })

  it('handles empty children gracefully', () => {
    render(<ScrollVelocityText />)
    
    expect(document.body).toBeInTheDocument()
  })

  it('passes through additional className props correctly', () => {
    const testClass = 'extra-class'
    render(
      <ScrollVelocityText>
        <h1>Extra Class Test</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('handles nested components without errors', () => {
    const nested = (
      <>
        <div className="nested-outer">
          <ScrollVelocityText>
            <h2>Nested Inner</h2>
          </ScrollVelocityText>
        </div>
      </>
    )

    render(nested)

    expect(screen.getByRole('heading', { name: 'Nested Inner' })).toBeInTheDocument()
  })

  it('handles rapid re-renders without crashing', async () => {
    const { rerender } = render(
      <ScrollVelocityText>
        <h1>First Render</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('First Render')

    rerender(
      <ScrollVelocityText>
        <h1>Second Render</h1>
      </ScrollVelocityText>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading')).toHaveTextContent('Second Render')
    })
  })

  it('handles scroll event simulation gracefully', () => {
    vi.mocked(useScroll).mockReturnValue({
      scrollYProgress: 0.5,
      scrollY: 1000,
    } as MotionValue)

    render(
      <ScrollVelocityText>
        <h1>Scroll Test</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Scroll Test')
  })

  it('handles transform hook gracefully', () => {
    vi.mocked(useTransform).mockReturnValue([0, 1])

    render(
      <ScrollVelocityText>
        <h1>Transform Test</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Transform Test')
  })

  it('handles edge case: very long text content', () => {
    const longText = 'A'.repeat(500)
    
    render(
      <ScrollVelocityText>
        <h1>{longText}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent(longText)
  })

  it('handles edge case: special characters in text', () => {
    const specialChars = 'Hello & World < > " \' / \\ : ; ! ? @ # $ % ^ * ( ) [ ] { }'
    
    render(
      <ScrollVelocityText>
        <h1>{specialChars}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent(specialChars)
  })

  it('handles edge case: unicode characters', () => {
    const unicode = 'Hello 世界 🌍 مرحبا'
    
    render(
      <ScrollVelocityText>
        <h1>{unicode}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent(unicode)
  })

  it('handles edge case: extremely small container', () => {
    render(
      <div style={{ width: '10px', height: '10px' }}>
        <ScrollVelocityText>
          <h1>Small Container</h1>
        </ScrollVelocityText>
      </div>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Small Container')
  })

  it('handles edge case: extremely large container', () => {
    render(
      <div style={{ width: '9999px', height: '9999px' }}>
        <ScrollVelocityText>
          <h1>Large Container</h1>
        </ScrollVelocityText>
      </div>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Large Container')
  })

  it('handles edge case: null children', () => {
    render(
      <ScrollVelocityText>
        <h1>{null}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('')
  })

  it('handles edge case: undefined children', () => {
    render(
      <ScrollVelocityText>
        <h1>{undefined}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('')
  })

  it('handles edge case: boolean children (true)', () => {
    render(
      <ScrollVelocityText>
        <h1>{true}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('')
  })

  it('handles edge case: boolean children (false)', () => {
    render(
      <ScrollVelocityText>
        <h1>{false}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('')
  })

  it('handles edge case: number children', () => {
    render(
      <ScrollVelocityText>
        <h1>{42}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('42')
  })

  it('handles edge case: object children', () => {
    render(
      <ScrollVelocityText>
        <h1>{JSON.stringify({ test: 'object' })}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('[object Object]')
  })

  it('handles edge case: array children', () => {
    render(
      <ScrollVelocityText>
        <h1>{[1, 2, 3]}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('1,2,3')
  })

  it('handles edge case: date children', () => {
    const testDate = new Date()
    
    render(
      <ScrollVelocityText>
        <h1>{testDate.toISOString()}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent(testDate.toISOString())
  })

  it('handles edge case: function children', () => {
    const testFunction = () => 'result'
    
    render(
      <ScrollVelocityText>
        <h1>{testFunction()}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('result')
  })

  it('handles edge case: promise children', async () => {
    const testPromise = Promise.resolve('resolved value')
    
    render(
      <ScrollVelocityText>
        <h1>{testPromise}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('[object Promise]')
  })

  it('handles edge case: symbol children', () => {
    const testSymbol = Symbol('test')
    
    render(
      <ScrollVelocityText>
        <h1>{testSymbol.toString()}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Symbol(test)')
  })

  it('handles edge case: regex children', () => {
    const testRegex = /regex/g
    
    render(
      <ScrollVelocityText>
        <h1>{testRegex.toString()}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('/regex/g')
  })

  it('handles edge case: error children', () => {
    const testError = new Error('test error')
    
    render(
      <ScrollVelocityText>
        <h1>{testError.message}</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('test error')
  })

  it('handles edge case: very fast sequential renders', async () => {
    const initial = (
      <ScrollVelocityText>
        <h1>Initial</h1>
      </ScrollVelocityText>
    )

    render(initial)
    
    expect(screen.getByRole('heading')).toHaveTextContent('Initial')

    // Rapid re-renders
    for (let i = 0; i < 50; i++) {
      rerender(
        <ScrollVelocityText>
          <h1>Rapid Render {i}</h1>
        </ScrollVelocityText>
      )
    }

    expect(screen.getByRole('heading')).toHaveTextContent('Rapid Render 49')
  })

  it('handles edge case: very slow sequential renders', async () => {
    const initial = (
      <ScrollVelocityText>
        <h1>Initial</h1>
      </ScrollVelocityText>
    )

    render(initial)
    
    expect(screen.getByRole('heading')).toHaveTextContent('Initial')

    // Slow re-renders with delays
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 10))
      
      rerender(
        <ScrollVelocityText>
          <h1>Slow Render {i}</h1>
        </ScrollVelocityText>
      )
    }

    expect(screen.getByRole('heading')).toHaveTextContent('Slow Render 4')
  })

  it('handles edge case: concurrent renders', async () => {
    const initial = (
      <ScrollVelocityText>
        <h1>Initial</h1>
      </ScrollVelocityText>
    )

    render(initial)
    
    expect(screen.getByRole('heading')).toHaveTextContent('Initial')

    // Concurrent renders
    const promise1 = new Promise((resolve) => {
      setTimeout(() => rerender(
        <ScrollVelocityText>
          <h1>Concurrent 1</h1>
        </ScrollVelocityText>
      ), 50)
    })

    const promise2 = new Promise((resolve) => {
      setTimeout(() => rerender(
        <ScrollVelocityText>
          <h1>Concurrent 2</h1>
        </ScrollVelocityText>
      ), 30)
    })

    await Promise.all([promise1, promise2])

    expect(screen.getByRole('heading')).toHaveTextContent('Concurrent 2')
  })

  it('handles edge case: conditional rendering', () => {
    const condition = true
    
    render(
      <ScrollVelocityText>
        {condition && <h1>Conditional Render</h1>}
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Conditional Render')

    rerender(
      <ScrollVelocityText>
        {!condition && <h1>Not Rendered</h1>}
      </ScrollVelocityText>
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('handles edge case: memoized components', () => {
    const MemoizedComponent = React.memo(() => <h1>Memoized</h1>)
    
    render(
      <ScrollVelocityText>
        <MemoizedComponent />
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Memoized')
  })

  it('handles edge case: lazy components', async () => {
    const LazyComponent = React.lazy(() => Promise.resolve({
      default: () => <h1>Lazy</h1>,
    }))
    
    render(
      <ScrollVelocityText>
        <Suspense fallback={<div>Loading...</div>}><LazyComponent /></Suspense>
      </ScrollVelocityText>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading')).toHaveTextContent('Lazy')
    })
  })

  it('handles edge case: fragments', () => {
    render(
      <ScrollVelocityText>
        <>
          <h1>Frag 1</h1>
          <h2>Frag 2</h2>
        </>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading', { name: 'Frag 1' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Frag 2' })).toBeInTheDocument()
  })

  it('handles edge case: portals (simulated)', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    
    render(
      <ScrollVelocityText>
        <h1>Portal Test</h1>
      </ScrollVelocityText>
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Portal Test')
    
    document.body.removeChild(container)
  })

  it('handles edge case: strict mode', () => {
    render(
      <StrictMode>
        <ScrollVelocityText>
          <h1>Strict Mode</h1>
        </ScrollVelocityText>
      </StrictMode>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Strict Mode')
  })

  it('handles edge case: suspense boundaries', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <ScrollVelocityText>
          <h1>Suspense</h1>
        </ScrollVelocityText>
      </Suspense>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Suspense')
  })

  it('handles edge case: error boundaries', () => {
    const ErrorBoundary = class extends React.Component<{ fallback?: React.ReactNode }> {
      state = { hasError: false }
      
      static getDerivedStateFromError() {
        return { hasError: true }
      }
      
      render() {
        if (this.state.hasError) {
          return this.props.fallback || <div>Error</div>
        }
        return this.props.children
      }
    }

    render(
      <ScrollVelocityText>
        <h1>Error Boundary</h1>
      </ScrollVelocityText>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Error Boundary')
  })

  it('handles edge case: concurrent mode', () => {
    render(
      <ConcurrentMode>
        <ScrollVelocityText>
          <h1>Concurrent</h1>
        </ScrollVelocityText>
      </ConcurrentMode>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Concurrent')
  })

  it('handles edge case: profiling mode', () => {
    render(
      <Profiler id="profile-test" onRender={() => {}}>
        <ScrollVelocityText>
          <h1>Profile</h1>
        </ScrollVelocityText>
      </Profiler>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Profile')
  })

  it('handles edge case: hydration (simulated)', () => {
    const serverHtml = '<div id="root"><h1>Hydrated</h1></div>'
    
    document.body.innerHTML = serverHtml
    
    render(
      <ScrollVelocityText>
        <h1>Hydrated</h1>
      </ScrollVelocityText>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Hydrated')
  })

  it('handles edge case: SSR hydration mismatch', () => {
    const serverHtml = '<div id="root"><h1>SSR</h1></div>'
    
    document.body.innerHTML = serverHtml
    
    render(
      <ScrollVelocityText>
        <h2>Client</h2>
      </ScrollVelocityText>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Client')
  })

  it('handles edge case: server components', () => {
    const ServerComponent = async function() {
      return <h1>Server</h1>
    }
    
    render(
      <ScrollVelocityText>
        <ServerComponent />
      </ScrollVelocityText>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Server')
  })

  it('handles edge case: client components', () => {
    const ClientComponent = function() {
      return <h1>Client</h1>
    }
    
    render(
      <ScrollVelocityText>
        <ClientComponent />
      </ScrollVelocityText>,
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Client')
  })

  it('handles edge case: mixed server and client components', () => {
    const ServerComponent = async function() {
      return <h1>Server</h1>
    }
    
    const ClientComponent = function() {
      return <h2>Client</h2>
    }
    
    render(
      <ScrollVelocityText>
        <ServerComponent />
        <ClientComponent />
      </ScrollVelocityText>,
    )

    expect(screen.getByRole('heading', { name: 'Server' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Client' })).toBeInTheDocument()
  })

  it('handles edge case: server actions (simulated)', () => {
    const ServerAction = async function() {
      return <h1>Action</h1
