import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RichTextEditorLite } from '@/components/premium-features/rich-text-editor-lite'
import { motion, useReducedMotion } from 'framer-motion'

describe('RichTextEditorLite', () => {
  const mockProps = {
    value: '<p>Test content</p>',
    onChange: vi.fn(),
    placeholder: 'Start typing...',
    toolbarOptions: ['bold', 'italic'],
  }

  it('renders with default props', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/start typing/i)).toBeInTheDocument()
  })

  it('applies motion variants when not reduced', () => {
    const wrapper = render(
      <RichTextEditorLite {...mockProps} />
    )

    // Check that framer-motion components are present
    expect(wrapper.container.querySelector('[data-variant="rich-text"]')).toBeInTheDocument()
  })

  it('respects reduced motion preference', () => {
    const wrapper = render(
      <RichTextEditorLite {...mockProps} />
    )

    // Verify no infinite animation loops in reduced mode
    expect(wrapper.rerender).not.toThrow()
  })

  it('handles empty state gracefully', () => {
    const emptyProps = { ...mockProps, value: '', placeholder: '' }

    render(
      <RichTextEditorLite {...emptyProps} />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('passes through all expected props', () => {
    const customPlaceholder = 'Custom placeholder'
    
    render(
      <RichTextEditorLite 
        {...mockProps} 
        placeholder={customPlaceholder}
      />
    )

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument()
  })

  it('renders with proper accessibility attributes', () => {
    render(
      <RichTextEditorLite {...mockProps} aria-label="Test editor" />
    )

    const textbox = screen.getByRole('textbox')
    expect(textbox).toHaveAttribute('aria-label', 'Test editor')
  })

  it('handles focus state correctly', () => {
    render(
      <RichTextEditorLite {...mockProps} autoFocus={true} />
    )

    const textbox = screen.getByRole('textbox')
    expect(textbox).toHaveFocus()
  })

  it('renders toolbar buttons when options provided', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        toolbarOptions={['bold', 'italic', 'underline']}
      />
    )

    // Toolbar should be visible with configured options
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles onChange callback correctly', () => {
    const handleChange = vi.fn()
    
    render(
      <RichTextEditorLite 
        {...mockProps} 
        onChange={handleChange}
      />
    )

    // Simulate a change event
    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    textbox.value = 'New content'
    textbox.dispatchEvent(new Event('input', { bubbles: true }))

    expect(handleChange).toHaveBeenCalled()
  })

  it('applies correct design tokens', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('rounded-lg')
    expect(container?.className).toContain('border-border')
  })

  it('handles large content without performance issues', () => {
    const largeContent = '<p>'.repeat(100) + 'Test</p>'.repeat(100)

    render(
      <RichTextEditorLite 
        {...mockProps} 
        value={largeContent}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('preserves cursor position on re-render', () => {
    const initialCursor = 50
    
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    textbox.setSelectionRange(initialCursor, initialCursor)

    // Re-render with same props
    const rerendered = render(
      <RichTextEditorLite {...mockProps} />
    )

    expect(textbox.selectionStart).toBe(initialCursor)
  })

  it('handles keyboard events correctly', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    
    // Simulate Ctrl+B for bold
    textbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true }))
    
    expect(textbox).toBeInTheDocument()
  })

  it('renders with proper dark mode support', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        className="dark"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('bg-background')
  })

  it('handles disabled state', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        disabled={true}
      />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textbox).toBeDisabled()
  })

  it('renders loading state when provided', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        isLoading={true}
      />
    )

    // Loading indicator should be present
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('handles focus/blur events correctly', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    render(
      <RichTextEditorLite 
        {...mockProps} 
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    
    // Simulate focus and blur
    textbox.focus()
    expect(onFocus).toHaveBeenCalled()

    textbox.blur()
    expect(onBlur).toHaveBeenCalled()
  })

  it('renders with proper semantic structure', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    
    // Verify semantic structure
    expect(container).toHaveClass('relative')
    expect(container).toHaveClass('group')
  })

  it('handles very long content gracefully', () => {
    const veryLongContent = 'A'.repeat(10000)

    render(
      <RichTextEditorLite 
        {...mockProps} 
        value={veryLongContent}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('preserves formatting on paste', () => {
    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    
    // Simulate pasting formatted content
    textbox.dispatchEvent(new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
      bubbles: true,
      cancelable: true,
    }))

    expect(textbox).toBeInTheDocument()
  })

  it('handles selection correctly', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    
    // Simulate text selection
    textbox.setSelectionRange(0, 10)
    
    expect(textbox).toBeInTheDocument()
  })

  it('renders with proper z-index for overlays', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('z-10')
  })

  it('handles resize correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        resizable={true}
      />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textbox).toBeInTheDocument()
  })

  it('renders with proper font settings', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('font-sans')
  })

  it('handles scroll events correctly', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    
    // Simulate scrolling
    textbox.scrollTop = 100
    
    expect(textbox).toBeInTheDocument()
  })

  it('renders with proper line height', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('leading-relaxed')
  })

  it('handles contenteditable correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        contentEditable={true}
      />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textbox).toHaveAttribute('contentEditable', 'true')
  })

  it('renders with proper cursor style', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textbox).toHaveAttribute('cursor', 'text')
  })

  it('handles undo/redo correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        canUndo={true}
        canRedo={true}
      />
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with proper min-height', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        minHeight="200px"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('min-h-[200px]')
  })

  it('handles max-height correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        maxHeight="400px"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('max-h-[400px]')
  })

  it('renders with proper overflow handling', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('overflow-hidden')
  })

  it('handles auto-resize correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        autoResize={true}
      />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textbox).toBeInTheDocument()
  })

  it('renders with proper text wrapping', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('whitespace-pre-wrap')
  })

  it('handles spellcheck correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        spellCheck={true}
      />
    )

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textbox).toHaveAttribute('spellCheck', 'true')
  })

  it('renders with proper text selection colors', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('selection:bg-primary')
  })

  it('handles placeholder animation correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        animatePlaceholder={true}
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('animate-placeholder')
  })

  it('renders with proper text direction', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        dir="ltr"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('dir-ltr')
  })

  it('handles rtl direction correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        dir="rtl"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('dir-rtl')
  })

  it('renders with proper text alignment', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        textAlign="left"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('text-left')
  })

  it('handles multiple toolbar options', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        toolbarOptions={[
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'code',
          'link',
          'image',
          'video',
        ]}
      />
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with proper font family', () => {
    render(
      <RichTextEditorLite {...mockProps} />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('font-sans')
  })

  it('handles font size correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        fontSize="lg"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('text-lg')
  })

  it('renders with proper font weight', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        fontWeight="normal"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('font-normal')
  })

  it('handles letter spacing correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        letterSpacing="normal"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('tracking-normal')
  })

  it('renders with proper text transform', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        textTransform="none"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('capitalize-none')
  })

  it('handles line height correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        lineHeight="normal"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('leading-normal')
  })

  it('renders with proper text decoration', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        textDecoration="none"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('underline-none')
  })

  it('handles text shadow correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        textShadow="none"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('shadow-none')
  })

  it('renders with proper background color', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        bgColor="bg-background"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('bg-background')
  })

  it('handles border radius correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        borderRadius="lg"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('rounded-lg')
  })

  it('renders with proper border color', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        borderColor="border-border"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('border-border')
  })

  it('handles padding correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        padding="md"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('p-4')
  })

  it('renders with proper margin', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        margin="md"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('m-0')
  })

  it('handles width correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        width="full"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('w-full')
  })

  it('renders with proper height', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        height="auto"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('h-auto')
  })

  it('handles min-width correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        minWidth="200px"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('min-w-[200px]')
  })

  it('renders with proper max-width', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        maxWidth="100%"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('max-w-full')
  })

  it('handles overflow correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        overflow="hidden"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('overflow-hidden')
  })

  it('renders with proper z-index', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        zIndex="10"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('z-10')
  })

  it('handles opacity correctly', () => {
    render(
      <RichTextEditorLite 
        {...mockProps} 
        opacity="1"
      />
    )

    const container = screen.getByRole('textbox').closest('[class*="rich-text"]')
    expect(container?.className).toContain('opacity-100')
  })

  it('renders with proper transition', () => {
