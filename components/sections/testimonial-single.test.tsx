import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TestimonialSingle from '@/components/sections/testimonial-single';

describe('TestimonialSingle', () => {
  const defaultProps = {
    name: 'Jane Doe',
    role: 'Senior Engineer',
    avatar: '/avatars/jane.png',
    quote: 'This is an amazing testimonial.',
    rating: 5,
  };

  it('renders with default props without errors', () => {
    render(<TestimonialSingle {...defaultProps} />);
    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.role)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.quote)).toBeInTheDocument();
  });

  it('applies correct base styling classes', () => {
    render(<TestimonialSingle {...defaultProps} />);
    const container = screen.getByRole('article');
    // Verify background and text colors are applied
    expect(container).toHaveClass(/bg-|text-/);
  });

  it('renders star rating correctly', () => {
    render(<TestimonialSingle {...defaultProps} />);
    const stars = screen.getAllByRole('img', { name: /star/i }) || [];
    // Should have 5 stars for max rating
    expect(stars.length).toBe(5);
  });

  it('handles missing avatar gracefully', () => {
    render(<TestimonialSingle {...defaultProps} avatar={undefined} />);
    // Should still render without crashing
    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
  });

  it('applies rounded corners', () => {
    render(<TestimonialSingle {...defaultProps} />);
    const container = screen.getByRole('article');
    expect(container).toHaveClass(/rounded/);
  });

  it('handles custom props correctly', () => {
    const customProps = {
      ...defaultProps,
      name: 'Custom Name',
      quote: 'Custom Quote',
    };
    render(<TestimonialSingle {...customProps} />);
    expect(screen.getByText(customProps.name)).toBeInTheDocument();
    expect(screen.getByText(customProps.quote)).toBeInTheDocument();
  });

  it('renders accessible structure', () => {
    render(<TestimonialSingle {...defaultProps} />);
    // Verify semantic HTML is used
    const container = screen.getByRole('article');
    expect(container).toHaveAttribute('aria-label');
  });

  it('handles empty quote gracefully', () => {
    render(
      <TestimonialSingle
        name="Empty Test"
        role=""
        quote=""
        avatar="/avatars/empty.png"
        rating={0}
      />
    );
    expect(screen.getByText('Empty Test')).toBeInTheDocument();
  });

  it('applies border styling', () => {
    render(<TestimonialSingle {...defaultProps} />);
    const container = screen.getByRole('article');
    // Verify border classes are present
    expect(container).toHaveClass(/border/);
  });
});
