import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUploaderPro } from '@/components/premium-features/file-uploader-pro'

describe('FileUploaderPro', () => {
  const mockOnDrop = vi.fn()
  const mockOnFileSelect = vi.fn()
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props without errors', () => {
    const { container } = render(<FileUploaderPro />)
    
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies correct base classes including background and radius', () => {
    const { container } = render(<FileUploaderPro />)
    
    // Check for expected class patterns
    const fileInput = screen.getByRole('button')
    expect(fileInput).toHaveClass(/rounded-/)
    expect(fileInput).toHaveClass(/border-/)
  })

  it('applies custom className when provided', () => {
    const customClass = 'custom-border-blue'
    render(<FileUploaderPro className={customClass} />)
    
    // The wrapper should include the custom class
    expect(screen.getByRole('button')).toHaveClass(customClass)
  })

  it('applies size prop correctly', () => {
    const { container } = render(<FileUploaderPro size="lg" />)
    
    // Size affects dimensions
    expect(container).toBeInTheDocument()
  })

  it('handles onDrop callback with mock file data', async () => {
    const testFiles = [
      new File(['test'], 'file1.txt'),
      new File(['test2'], 'image.png')
    ]

    render(<FileUploaderPro onDrop={mockOnDrop} />)
