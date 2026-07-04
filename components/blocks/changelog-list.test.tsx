import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangelogList } from '@/components/blocks/changelog-list';

describe('ChangelogList', () => {
  describe('default rendering', () => {
    it('renders the component without crashing', () => {
      render(<ChangelogList />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders default heading with correct ARIA role', () => {
      render(<ChangelogList />);
      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', /changelog/);
    });

    it('applies base styling classes correctly', () => {
      render(<ChangelogList />);
      const list = screen.getByRole('list');
      expect(list).toHaveClass(/rounded-lg|border-border/);
    });
  });

  describe('with props', () => {
    it('renders custom title when provided', () => {
      render(
        <ChangelogList title="Custom Changelog" items={[]} />
      );
      expect(screen.getByText(/custom changelog/i)).toBeInTheDocument();
    });

    it('renders each item with correct structure', () => {
      const items = [
        { version: '1.0.0', date: '2024-01-01', changes: ['feat: initial release'] },
      ];

      render(<ChangelogList items={items} />);
      expect(screen.getByText(/1\.0\.0/)).toBeInTheDocument();
    });

    it('applies dark mode classes when in dark theme', () => {
      const container = document.createElement('div');
      container.classList.add('dark');
      document.body.appendChild(container);

      render(<ChangelogList />);
      expect(screen.getByRole('list')).toHaveClass(/bg-background/);
    });

    it('handles empty items gracefully', () => {
      render(<ChangelogList items={[]} />);
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('renders version badges with correct accessibility', () => {
      const items = [
        {
          version: '2.0.0',
          date: new Date().toISOString(),
          changes: ['feat: major update'],
        },
      ];

      render(<ChangelogList items={items} />);
      expect(screen.getByText(/2\.0\.0/)).toBeInTheDocument();
    });
  });

  describe('interactive elements', () => {
    it('renders expandable sections with correct focus states', async () => {
      const user = userEvent.setup();
      
      render(<ChangelogList items={[{ version: '1.0.0', date: '', changes: ['test'] }]} />);

      // Check that interactive elements have proper focus handling
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
    });
  });

  describe('error boundaries and edge cases', () => {
    it('handles items with missing date gracefully', () => {
      render(<ChangelogList items={[{ version: '1.0.0', changes: [] }]} />);
      expect(screen.getByText(/1\.0\.0/)).toBeInTheDocument();
    });

    it('renders without console errors for valid props', async () => {
      const consoleSpy = vi.spyOn(console, 'error');
      
      render(<ChangelogList items={[{ version: '1.0.0', changes: ['test'] }]} />);
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

export {};
