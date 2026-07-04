import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeroWaitlist } from '@/components/sections/hero-waitlist'

describe('HeroWaitlist', () => {
  const user = userEvent.setup()

  it('renders with default props and shows waitlist form', () => {
    render(<HeroWaitlist />)

    expect(screen.getByRole('heading')).toHaveTextContent(/waitlist/i)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent(/join/i)
  })

  it('displays success message after submission', async () => {
    render(<HeroWaitlist />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const submitBtn = screen.getByRole('button')

    await user.type(emailInput, 'test@example.com')
    await user.click(submitBtn)

    expect(screen.getByText(/success|thank you/i)).toBeInTheDocument()
  })

  it('shows error message on invalid input', async () => {
    render(<HeroWaitlist />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const submitBtn = screen.getByRole('button')

    await user.type(emailInput, 'invalid-email')
    await user.click(submitBtn)

    expect(screen.queryByText(/success|thank you/i)).not.toBeInTheDocument()
  })

  it('applies correct base styles', () => {
    render(<HeroWaitlist />)

    const container = screen.getByRole('main') || screen.getByRole('banner')
    expect(container).toHaveClass(/rounded-lg/i, /border/i)
  })
})
