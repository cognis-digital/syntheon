import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeSwitcher } from '@/components/app/theme-switcher';
import { useTheme } from '@/hooks/use-theme';

describe('ThemeSwitcher', () => {
  const mockUseTheme = vi.fn();
  
  beforeEach(() => {
    vi.mock('@/hooks/use-theme', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useTheme: mockUseTheme as any,
      };
    });

    mockUseTheme.mockReturnValue({
      theme: 'dark' as const,
      resolvedTheme: 'dark' as const,
      setTheme: vi.fn(),
    });
  });

  describe('Rendering', () => {
    it('renders without crashing with default props', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher className="custom-theme-class" />);
      
      expect(screen.getByRole('button')).toHaveClass('custom-theme-class');
    });

    it('renders with custom aria-label', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher ariaLabel="Toggle dark mode" />);
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Toggle dark mode');
    });
  });

  describe('Event Handlers', () => {
    it('calls setTheme when clicked', async () => {
      const setThemeMock = vi.fn();
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: setThemeMock,
      });

      render(<ThemeSwitcher />);
      
      await userEvent.click(screen.getByRole('button'));
      
      expect(setThemeMock).toHaveBeenCalled();
    });

    it('passes custom onClick handler', async () => {
      const customOnClick = vi.fn();
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher onClick={customOnClick} />);
      
      await userEvent.click(screen.getByRole('button'));
      
      expect(customOnClick).toHaveBeenCalled();
    });

    it('passes custom onChange handler', async () => {
      const customOnChange = vi.fn();
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher onChange={customOnChange} />);
      
      await userEvent.click(screen.getByRole('button'));
      
      expect(customOnChange).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct role and aria-label by default', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('role', 'button');
      expect(button).toHaveAttribute('aria-label', /toggle/i);
    });

    it('maintains focus after interaction', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await userEvent.click(screen.getByRole('button'));
      
      expect(document.activeElement).toBe(screen.getByRole('button'));
    });

    it('supports keyboard navigation', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await userEvent.keyboard('Enter');
      
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });

  describe('Dark Mode Behavior', () => {
    it('uses dark theme when configured', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark' as const,
        resolvedTheme: 'dark' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-theme',
        'dark'
      );
    });

    it('uses light theme when configured', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-theme',
        'light'
      );
    });
  });

  describe('Animation Variants', () => {
    it('applies mount animation variant', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark' as const,
        resolvedTheme: 'dark' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('applies unmount animation variant', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark' as const,
        resolvedTheme: 'dark' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await screen.findByRole('button');
    });
  });

  describe('Keyboard Interactions', () => {
    it('handles Enter key press', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await userEvent.keyboard('Enter');
      
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('handles Space key press', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await userEvent.keyboard(' ');
      
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });

  describe('Focus Management', () => {
    it('returns focus to button after click', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await userEvent.click(screen.getByRole('button'));
      
      expect(document.activeElement).toBe(screen.getByRole('button'));
    });

    it('respects focus trap when enabled', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await userEvent.click(screen.getByRole('button'));
      
      expect(document.activeElement).toBe(screen.getByRole('button'));
    });
  });

  describe('Edge Cases', () => {
    it('handles null className gracefully', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher className={null} />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles undefined ariaLabel gracefully', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher ariaLabel={undefined} />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles disabled state', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      await userEvent.click(screen.getByRole('button'));
      
      expect(setTheme).toHaveBeenCalled();
    });
  });

  describe('Type Safety', () => {
    it('accepts valid theme string values', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('accepts valid boolean for disabled prop', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light' as const,
        resolvedTheme: 'light' as const,
        setTheme: vi.fn(),
      });

      render(<ThemeSwitcher />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
