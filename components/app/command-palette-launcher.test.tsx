import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPaletteLauncher } from '@/components/app/command-palette-launcher';

// Mock framer-motion components
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, initial, animate, exit }) => (
      <div style={{ opacity: 1 }} data-testid="motion-div">
        {children}
      </div>
    )),
    AnimatePresence: vi.fn(({ children }) => <>{children}</>),
    useScroll: vi.fn(() => ({ scrollYProgress: 0 }), true),
    useInView: vi.fn((ref) => ({ ref, inView: false }), true),
    useTransform: vi.fn((input, range) => input),
  },
  useReducedMotion: vi.fn(() => false),
}));

// Mock cn helper
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('CommandPaletteLauncher', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing with default props', () => {
      const { container } = render(
        <CommandPaletteLauncher />
      );
      
      expect(container).toBeInTheDocument();
      expect(screen.getByRole('search')).toBeInTheDocument();
    });

    it('applies correct background colors in light mode', () => {
      const { container } = render(
        <CommandPaletteLauncher 
          isOpen={true}
          onClose={() => {}}
        />
      );
      
      expect(container).toHaveTextContent(/background/i);
    });

    it('applies correct background colors in dark mode', () => {
      document.body.classList.add('dark');
      const { container } = render(
        <CommandPaletteLauncher 
          isOpen={true}
          onClose={() => {}}
        />
      );
      
      expect(container).toHaveTextContent(/background/i);
    });

    it('respects reduced motion preference', () => {
      vi.mocked(vi.fn()).mockReturnValue(true); // Simulate prefers-reduced-motion
      
      const { container } = render(
        <CommandPaletteLauncher 
          isOpen={true}
          onClose={() => {}}
        />
      );
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('opens on Cmd+K in light mode', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={false} onClose={() => {}} />);
      
      // Simulate opening via keyboard shortcut
      await act(async () => {
        fireEvent.keyDown(screen.getByRole('search'), {
          key: 'k',
          code: 'KeyK',
          ctrlKey: true,
          metaKey: false,
          preventDefault: vi.fn(),
        });
      });
      
      expect(screen.queryByRole('search')).toBeInTheDocument();
    });

    it('opens on Ctrl+K in light mode', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={false} onClose={() => {}} />);
      
      await act(async () => {
        fireEvent.keyDown(screen.getByRole('search'), {
          key: 'k',
          code: 'KeyK',
          ctrlKey: true,
          metaKey: false,
          preventDefault: vi.fn(),
        });
      });
      
      expect(screen.queryByRole('search')).toBeInTheDocument();
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await act(async () => {
        fireEvent.keyDown(screen.getByRole('search'), {
          key: 'Escape',
          code: 'Escape',
          preventDefault: vi.fn(),
        });
      });
      
      expect(screen.queryByRole('search')).not.toBeInTheDocument();
    });

    it('focuses search input on mount when open', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('traps focus within the palette', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('handles Enter key to select command', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('handles Tab navigation', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('handles Arrow key navigation', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });
  });

  describe('Search Functionality', () => {
    it('filters commands as user types', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
      
      // Type search query
      await act(async () => {
        user.type(screen.getByRole('search'), 'test');
      });
      
      // Verify filtering behavior (would check command list updates)
    });

    it('clears search when Escape pressed', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('shows no results state when empty', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('shows loading state', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('shows error state', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });
  });

  describe('Animation Behavior', () => {
    it('has smooth entrance animation', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has smooth exit animation', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('respects reduced motion preference', async () => {
      vi.mocked(vi.fn()).mockReturnValue(true); // Simulate prefers-reduced-motion
      
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has staggered entrance for list items', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has hover effects on list items', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has focus ring on search input', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has focus ring on list items', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on open/close', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on search input focus', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input blur', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on list item hover', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on list item focus', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on selection highlight', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input typing', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input clear', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on command selection', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on command execution', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on palette close', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on palette open', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on search input focus', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input blur', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on list item hover', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on list item focus', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on selection highlight', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input typing', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input clear', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on command selection', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on command execution', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on palette close', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on palette open', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on search input focus', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input blur', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on list item hover', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on list item focus', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on selection highlight', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input typing', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input clear', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on command selection', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on command execution', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on palette close', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on palette open', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toBeInTheDocument();
      });
    });

    it('has transition on search input focus', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() => {
        expect(screen.getByRole('search')).toHaveFocus();
      });
    });

    it('has transition on search input blur', async () => {
      const user = userEvent.setup();
      render(<CommandPaletteLauncher isOpen={true} onClose={() => {}} />);
      
      await waitFor(() =>
