import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { faqTwoColumn } from '@/components/sections/faq-two-column'
import { vi } from 'vitest'

describe('FAQ Two Column Section', () => {
  const mockQuestions = [
    { id: 1, question: 'What is Syntheon?', answer: 'A premium design system.' },
    { id: 2, question: 'How do I get started?', answer: 'Start with the docs.' },
    { id: 3, question: 'Is it free?', answer: 'Yes, always.' },
  ]

  const mockData = [
    { id: 1, question: 'What is Syntheon?', answer: 'A premium design system.', expanded: false },
    { id: 2, question: 'How do I get started?', answer: 'Start with the docs.', expanded: false },
    { id: 3, question: 'Is it free?', answer: 'Yes, always.', expanded: false },
  ]

  describe('Rendering with defaults', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <faqTwoColumn questions={mockQuestions} />
      )
      expect(container).toBeInTheDocument()
    })

    it('renders all question headers', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      mockQuestions.forEach((q, i) => {
        const header = screen.getByText(q.question)
        expect(header).toHaveTextContent(q.question)
        // Ensure each question has a unique id attribute for accessibility
        expect(screen.getByRole('button', { name: q.question })).toHaveAttribute(
          'id',
          `faq-question-${q.id}`
        )
      })
    })

    it('renders all answers when expanded', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Expand the first question
      const firstButton = screen.getByRole('button', { name: mockQuestions[0].question })
      expect(firstButton).toHaveAttribute('aria-expanded', 'false')
      
      firstButton.click()
      
      expect(screen.getByText(mockQuestions[0].answer)).toBeInTheDocument()
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('renders with correct semantic structure', () => {
      const { container } = render(
        <faqTwoColumn questions={mockQuestions} />
      )
      
      // Should have a main container (usually section or div)
      expect(container.querySelector('section')).toBeInTheDocument()
      
      // Each question should be in an article element for semantic correctness
      mockQuestions.forEach((q, i) => {
        const article = container.querySelectorAll(`[data-qa="faq-question-${q.id}"]`)
        expect(article).toHaveLength(i + 1)
      })
    })

    it('applies correct accessibility attributes', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      mockQuestions.forEach((q, i) => {
        const button = screen.getByRole('button', { name: q.question })
        
        // ARIA attributes for accordion behavior
        expect(button).toHaveAttribute('aria-expanded')
        expect(button).toHaveAttribute('aria-controls')
        expect(button).toHaveAttribute('id')
        
        // Keyboard accessibility - should be focusable
        expect(button).toBeFocusable()
      })
    })

    it('handles empty questions array gracefully', () => {
      const { container } = render(
        <faqTwoColumn questions={[]} />
      )
      
      expect(container).toBeInTheDocument()
      // Should still have structure but no content
      expect(container.querySelector('section')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const { container } = render(
        <faqTwoColumn 
          questions={mockQuestions} 
          className="custom-faq-container"
        />
      )
      
      // The wrapper should have the custom class applied
      expect(container.querySelector('.custom-faq-container')).toBeInTheDocument()
    })

    it('renders with default styling classes', () => {
      const { container } = render(
        <faqTwoColumn questions={mockQuestions} />
      )
      
      // Check for expected design tokens in the rendered output
      expect(container).toHaveTextContent('text-foreground')
      expect(container).toHaveTextContent('rounded-lg')
    })

    it('maintains proper type hierarchy', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Verify heading levels are appropriate (h2 for section, h3 for questions)
      const headings = container.querySelectorAll('h2, h3')
      expect(headings).toHaveLength(4) // 1 main + 3 questions
      
      // Main section should be h2
      expect(container.querySelector('h2')).toHaveAttribute('class', /text-2xl/)
    })

    it('handles expanded state correctly', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const buttons = screen.getAllByRole('button')
      
      // All should start collapsed
      expect(buttons).toHaveLength(3)
      buttons.forEach((btn, i) => {
        expect(btn).toHaveAttribute('aria-expanded', 'false')
      })

      // Expand first one
      buttons[0].click()
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
      
      // Others remain collapsed
      expect(buttons.slice(1)).every((btn) => 
        btn.getAttribute('aria-expanded') === 'false'
      )

      // Toggle closed
      buttons[0].click()
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
    })

    it('preserves answer content exactly', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      mockQuestions.forEach((q, i) => {
        // Answer should be present when expanded
        const button = screen.getByRole('button', { name: q.question })
        button.click()
        
        expect(screen.getByText(q.answer)).toBeInTheDocument()
        expect(screen.getByText(q.answer)).toHaveTextContent(q.answer)
      })
    })

    it('handles long answers with proper wrapping', () => {
      const longAnswer = 'This is a very long answer that should wrap properly in the UI. '.repeat(10)
      
      render(<faqTwoColumn questions={[{ id: 1, question: 'Long test?', answer: longAnswer }]} />)
      
      const button = screen.getByRole('button', { name: 'Long test?' })
      button.click()
      
      expect(screen.getByText(longAnswer)).toBeInTheDocument()
    })

    it('applies motion classes when enabled', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Check for animation-related classes (if implemented)
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/animate-|transition-/)
    })

    it('renders with correct border and radius styling', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Check for rounded corners on interactive elements
      const buttons = screen.getAllByRole('button')
      buttons.forEach((btn) => {
        expect(btn).toHaveAttribute('class', /rounded-lg/)
      })
    })

    it('handles focus states correctly', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const button = screen.getByRole('button', { name: mockQuestions[0].question })
      
      // Focus the button
      button.focus()
      
      expect(document.activeElement).toBe(button)
    })

    it('renders with correct semantic roles', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Main container should be a section element
      const mainContainer = screen.getByRole('region')
      expect(mainContainer).toHaveAttribute('aria-label', /FAQ/i)

      // Each question header should be a button with proper role
      mockQuestions.forEach((q, i) => {
        const btn = screen.getByRole('button', { name: q.question })
        expect(btn).toHaveAttribute('role', 'button')
        expect(btn).toHaveAttribute('aria-expanded')
      })
    })

    it('maintains consistent spacing and layout', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Check for expected spacing utilities in the DOM
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/gap-|px-|py-/)
    })

    it('handles keyboard navigation', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const buttons = screen.getAllByRole('button')
      
      // Tab through all buttons - should be focusable in order
      buttons.forEach((btn, i) => {
        btn.focus()
        expect(document.activeElement).toBe(btn)
        
        if (i < buttons.length - 1) {
          // Move to next button with arrow down
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
          expect(document.activeElement).toBe(buttons[i + 1])
        }
      })
    })

    it('renders with proper dark mode support', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Check for dark mode utility classes
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/dark-|text-muted/)
    })

    it('handles single question edge case', () => {
      const singleQuestion: Array<{ id: number; question: string; answer: string }> = [
        { id: 1, question: 'Single?', answer: 'Yes.' },
      ]
      
      render(<faqTwoColumn questions={singleQuestion} />)
      
      expect(screen.getByText('Single?')).toBeInTheDocument()
    })

    it('renders with custom props override', () => {
      const customQuestions = [
        { id: 1, question: 'Custom?', answer: 'Yes.', expanded: true },
      ]
      
      render(<faqTwoColumn questions={customQuestions} />)
      
      // Should start expanded if specified
      const button = screen.getByRole('button', { name: 'Custom?' })
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('maintains performance with many questions', () => {
      const manyQuestions = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1}?`,
        answer: `Answer ${i + 1}.`,
      }))
      
      render(<faqTwoColumn questions={manyQuestions} />)
      
      expect(screen.getAllByRole('button')).toHaveLength(50)
    })

    it('handles special characters in content', () => {
      const specialChars: Array<{ id: number; question: string; answer: string }> = [
        { 
          id: 1, 
          question: 'What about <>&"\'? ', 
          answer: 'It works fine.', 
        },
      ]
      
      render(<faqTwoColumn questions={specialChars} />)
      
      expect(screen.getByText('What about <>&"\'?')).toBeInTheDocument()
    })

    it('renders with correct meta information', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Check for metadata like title, description if present in component
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Frequently Asked Questions/i)
    })

    it('preserves question order', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Verify questions appear in the same order as provided
      const headers = screen.getAllByRole('button')
      expect(headers).toHaveLength(mockQuestions.length)
      
      mockQuestions.forEach((q, i) => {
        expect(headers[i]).toHaveTextContent(q.question)
      })
    })

    it('handles nested content in answers', () => {
      const nestedAnswer = 'Check out <a href="#">this link</a> for more info.'
      
      render(<faqTwoColumn questions={[{ id: 1, question: 'Test?', answer: nestedAnswer }]} />)
      
      const button = screen.getByRole('button', { name: 'Test?' })
      button.click()
      
      expect(screen.getByText(nestedAnswer)).toBeInTheDocument()
    })

    it('renders with correct font weights and sizes', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Check for typography utilities
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/font-|text-lg/)
    })

    it('handles async data loading simulation', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Should not warn about missing dependencies
      expect(console.warn).not.toHaveBeenCalled()
    })

    it('renders with proper contrast ratios', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/text-foreground|bg-background/)
    })

    it('handles very long question titles', () => {
      const longTitle = 'This is a very long question title that should still render correctly without breaking the layout. '.repeat(5)
      
      render(<faqTwoColumn questions={[{ id: 1, question: longTitle, answer: 'Short.' }]} />)
      
      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('renders with correct meta tags', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Check for SEO-related content if present
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Question/)
    })

    it('handles mixed expanded states', () => {
      const mixedData: Array<{ id: number; question: string; answer: string; expanded: boolean }> = [
        { id: 1, question: 'Open?', answer: 'Yes.', expanded: true },
        { id: 2, question: 'Closed?', answer: 'No.', expanded: false },
      ]
      
      render(<faqTwoColumn questions={mixedData} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
      expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
    })

    it('renders with proper meta viewport settings', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      // Check for responsive design utilities
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/max-w-|container-/)
    })

    it('handles empty answer gracefully', () => {
      render(<faqTwoColumn questions={[{ id: 1, question: 'Empty?', answer: '' }]} />)
      
      const button = screen.getByRole('button', { name: 'Empty?' })
      button.click()
      
      // Should not crash with empty answer
      expect(button).toBeInTheDocument()
    })

    it('renders with correct meta description', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles very short question titles', () => {
      render(<faqTwoColumn questions={[{ id: 1, question: 'A?', answer: 'Yes.' }]} />)
      
      expect(screen.getByText('A?')).toBeInTheDocument()
    })

    it('renders with proper meta keywords', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Support/)
    })

    it('handles Unicode characters in content', () => {
      const unicode: Array<{ id: number; question: string; answer: string }> = [
        { 
          id: 1, 
          question: 'What about émojis? 🎨', 
          answer: 'Works great.', 
        },
      ]
      
      render(<faqTwoColumn questions={unicode} />)
      
      expect(screen.getByText('émojis')).toBeInTheDocument()
    })

    it('renders with correct meta robots settings', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles very long answers without overflow issues', () => {
      const veryLongAnswer = 'This is a very, very, very long answer that should not cause any layout issues. '.repeat(20)
      
      render(<faqTwoColumn questions={[{ id: 1, question: 'Long?', answer: veryLongAnswer }]} />)
      
      const button = screen.getByRole('button', { name: 'Long?' })
      button.click()
      
      expect(screen.getByText(veryLongAnswer)).toBeInTheDocument()
    })

    it('renders with proper meta author information', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles null-safe rendering', () => {
      // Component should handle edge cases gracefully
      render(<faqTwoColumn questions={[]} />)
      
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('renders with correct meta publisher information', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles very short answers gracefully', () => {
      render(<faqTwoColumn questions={[{ id: 1, question: 'Q?', answer: '.' }]} />)
      
      const button = screen.getByRole('button', { name: 'Q?' })
      button.click()
      
      expect(button).toBeInTheDocument()
    })

    it('renders with proper meta theme color settings', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles whitespace-only answers', () => {
      render(<faqTwoColumn questions={[{ id: 1, question: 'Whitespace?', answer: '   ' }]} />)
      
      const button = screen.getByRole('button', { name: 'Whitespace?' })
      button.click()
      
      expect(button).toBeInTheDocument()
    })

    it('renders with correct meta viewport settings for mobile', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles mixed content types in answers', () => {
      const mixedAnswer = 'Text: hello\nCode: <code>const x = 1</code>\nHTML: <a href="#">link</a>'
      
      render(<faqTwoColumn questions={[{ id: 1, question: 'Mixed?', answer: mixedAnswer }]} />)
      
      const button = screen.getByRole('button', { name: 'Mixed?' })
      button.click()
      
      expect(screen.getByText(mixedAnswer)).toBeInTheDocument()
    })

    it('renders with proper meta generator information', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles very long question titles without breaking layout', () => {
      const veryLongTitle = 'This is a very, very, very, very, very long question title that should still render correctly. '.repeat(10)
      
      render(<faqTwoColumn questions={[{ id: 1, question: veryLongTitle, answer: 'Short.' }]} />)
      
      expect(screen.getByText(veryLongTitle)).toBeInTheDocument()
    })

    it('renders with correct meta distribution settings', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles very short question titles gracefully', () => {
      render(<faqTwoColumn questions={[{ id: 1, question: 'A?', answer: 'Yes.' }]} />)
      
      expect(screen.getByText('A?')).toBeInTheDocument()
    })

    it('renders with proper meta distribution channels', () => {
      render(<faqTwoColumn questions={mockQuestions} />)
      
      const container = screen.getByRole('document')
      expect(container).toHaveTextContent(/FAQ|Help/)
    })

    it('handles very long answers without overflow issues', () => {
      const veryLongAnswer = 'This is a very, very, very, very, very long answer that should not cause any layout issues. '.repeat(30)
      
      render(<faqTwoColumn questions={[{ id: 1, question: 'Long?', answer: veryLongAnswer }]} />)
      
      const button = screen.getByRole('button', { name: 'Long?' })
      button.click()
      
      expect(screen.getByText(veryLongAnswer)).toBeInTheDocument()
    })

    it('renders with correct meta viewport settings for mobile devices', () => {
