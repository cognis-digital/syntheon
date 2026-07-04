import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookieConsentPro } from '@/components/premium-features/cookie-consent-pro';

describe('CookieConsentPro', () => {
  beforeEach(() => {
    vi.mocked(document.documentElement).setAttribute = vi.fn();
    cleanup();
  });

  it('renders without crashing with default props', () => {
    render(<CookieConsentPro />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cookie consent/i })).toBeInTheDocument();
  });

  it('displays accept and decline buttons', () => {
    render(<CookieConsentPro />);
    
    const acceptBtn = screen.getByRole('button', { name: /accept/i });
    const declineBtn = screen.getByRole('button', { name: /decline/i });
    
    expect(acceptBtn).toBeInTheDocument();
    expect(declineBtn).toBeInTheDocument();
  });

  it('closes dialog on accept click', async () => {
    render(<CookieConsentPro />);
    
    const acceptBtn = screen.getByRole('button', { name: /accept/i });
    await userEvent.click(acceptBtn);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes dialog on decline click', async () => {
    render(<CookieConsentPro />);
    
    const declineBtn = screen.getByRole('button', { name: /decline/i });
    await userEvent.click(declineBtn);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes dialog on backdrop click', async () => {
    render(<CookieConsentPro />);
    
    const backdrop = screen.getByRole('presentation');
    await userEvent.click(backdrop);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('sets dark mode when enabled via props', async () => {
    render(<CookieConsentPro dark />);
    
    const dialog = screen.getByRole('dialog');
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
  });

  it('remembers user choice on subsequent visits (mocked)', async () => {
    // Simulate localStorage already has a decision
    const mockLocalStorage = { getItem: vi.fn().mockReturnValue('accepted') };
    
    render(<CookieConsentPro storage={mockLocalStorage} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('announces to screen readers when opened', async () => {
    const announceSpy = vi.spyOn(window, 'alert');
    
    render(<CookieConsentPro />);
    
    await waitFor(() => {
      expect(announceSpy).toHaveBeenCalledWith(/cookie consent/i);
    });
  });

  it('traps focus within dialog', async () => {
    render(<CookieConsentPro />);
    
    const acceptBtn = screen.getByRole('button', { name: /accept/i });
    await userEvent.click(acceptBtn);
    
    // Focus should remain in dialog after clicking outside
    expect(document.activeElement).not.toHaveFocusOutsideDialog();
  });

  it('supports keyboard navigation (Escape closes)', async () => {
    render(<CookieConsentPro />);
    
    const acceptBtn = screen.getByRole('button', { name: /accept/i });
    await userEvent.click(acceptBtn);
    
    // Simulate Escape key press
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies rounded styling by default', () => {
    render(<CookieConsentPro />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(/rounded/i);
  });

  it('uses correct border color from design tokens', () => {
    render(<CookieConsentPro />);
    
    const dialog = screen.getByRole('dialog');
    // Should use bg-muted or similar token for borders
    expect(dialog).toHaveStyle(/border/);
  });
});
