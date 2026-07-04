import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { darkModeToggle } from '@/components/premium-features/dark-mode-toggle'

describe('darkModeToggle', () => {
  beforeEach(() => {
    document.body.className = ''
  })

  it('renders with default props and correct structure', () => {
    const wrapper = render(darkModeToggle())
    
    expect(wrapper.container).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button').className).toContain('bg-background')
    expect(screen.getByRole('button').className).toContain('rounded-lg')
  })

  it('applies correct default CSS classes', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.className).toMatch(/bg-background/)
    expect(button.className).toMatch(/rounded-lg/)
    expect(button.className).toMatch(/border-border/)
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
    expect(button.style.cssText).toContain('--transition: all 0.2s ease-in-out')
  })

  it('applies correct default CSS variables', () => {
    const wrapper = render(darkModeToggle())
    
    const button = screen.getByRole('button')
    expect(button.style.cssText).toContain('--radius: 0.5rem')
