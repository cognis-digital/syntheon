import { render, screen } from '@testing-library/react';
import AnnouncementBanner from '@/components/blocks/announcement-banner';

describe('AnnouncementBanner', () => {
  it('renders with default props', () => {
    render(<AnnouncementBanner />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    expect(screen.getByText(/announcement/i)).toBeInTheDocument();
  });

  it('renders custom message when provided', () => {
    render(<AnnouncementBanner message="Test announcement" />);
    
    expect(screen.getByText('Test announcement')).toBeInTheDocument();
  });

  it('applies correct semantic tokens to root element', () => {
    render(<AnnouncementBanner />);
    
    const banner = screen.getByRole('banner');
    // Verify background token is applied
    expect(banner).toHaveClass(/bg-background/);
  });

  it('handles closing functionality when dismissible prop is true', () => {
    render(<AnnouncementBanner message="Close me" dismissible />);
    
    const closeBtn = screen.getByRole('button');
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn).toHaveTextContent(/close/i);
  });

  it('applies reduced motion class when user prefers less animation', () => {
    render(<AnnouncementBanner />, { wrapper: { children: [{ style: { '@media (prefers-reduced-motion: reduce)': 'true' } }] } });
    
    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass(/reduced-motion/);
  });

  it('renders accessible ARIA attributes', () => {
    render(<AnnouncementBanner message="Important notice" />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-live', 'polite');
  });
});
