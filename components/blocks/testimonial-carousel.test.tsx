import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TestimonialCarousel from '@/components/blocks/testimonial-carousel';
import { cn } from '@/lib/utils';

describe('TestimonialCarousel', () => {
  const defaultProps = {
    testimonials: [
      { id: '1', name: 'Jane Doe', role: 'CTO', content: 'Amazing product!' },
      { id: '2', name: 'John Smith', role: 'CEO', content: 'Highly recommended.' },
    ],
  };

  it('renders without crashing with default props', () => {
    render(<TestimonialCarousel {...defaultProps} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('renders testimonial text content', () => {
    render(<TestimonialCarousel {...defaultProps} />);
    expect(screen.getByText(/Amazing product!/i)).toBeInTheDocument();
    expect(screen.getByText(/Highly recommended./i)).toBeInTheDocument();
  });

  it('renders testimonial names and roles', () => {
    render(<TestimonialCarousel {...defaultProps} />);
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/CTO/i)).toBeInTheDocument();
    expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
  });

  it('applies correct ARIA roles for accessibility', () => {
    render(<TestimonialCarousel {...defaultProps} />);
    const carousel = screen.getByRole('region');
    expect(carousel).toHaveAttribute('aria-label');
  });

  it('uses cn utility with Tailwind class names', () => {
    const TestimonialCarouselWithDebug = (props: any) => (
      <TestimonialCarousel {...defaultProps} {...props}>
        <div className={cn('bg-background rounded-lg p-4')}>Debug</div>
      </TestimonialCarousel>
    );

    render(<TestimonialCarouselWithDebug />);
    expect(screen.getByText(/Debug/i)).toBeInTheDocument();
  });

  it('handles empty testimonials gracefully', () => {
    const EmptyProps = {
      testimonials: [],
    };

    render(<TestimonialCarousel {...EmptyProps} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('renders with dark mode class support', () => {
    render(
      <div className="dark">
        <TestimonialCarousel {...defaultProps} />
      </div>
    );
    expect(document.body).toHaveClass('dark');
  });
});
