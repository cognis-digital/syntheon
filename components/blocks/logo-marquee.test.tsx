import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import LogoMarquee from '@/components/blocks/logo-marquee';

describe('LogoMarquee', () => {
  const defaultProps = {
    logos: [
      { src: '/logo1.png', alt: 'Brand One' },
      { src: '/logo2.png', alt: 'Brand Two' },
      { src: '/logo3.png', alt: 'Brand Three' },
    ],
  };

  it('renders with default props and correct structure', () => {
    render(<LogoMarquee {...defaultProps} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBe(3);
    expect(screen.getByAltText('Brand One')).toBeInTheDocument();
  });

  it('applies correct Tailwind utility classes for dark mode', () => {
    render(<LogoMarquee {...defaultProps} />);

    const list = screen.getByRole('list');
    expect(list).toHaveClass('rounded-lg', 'bg-background');
  });

  it('renders accessibility attributes correctly', () => {
    render(<LogoMarquee {...defaultProps} />);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
      expect(img).not.toHaveClass('sr-only');
    });
  });

  it('handles empty logos array gracefully', () => {
    render(<LogoMarquee logos={[]} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBe(0);
  });

  it('applies focus styles for keyboard navigation', () => {
    render(<LogoMarquee {...defaultProps} />);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('tabIndex', '-1');
    });
  });
});
