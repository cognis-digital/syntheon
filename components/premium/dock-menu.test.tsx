import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useReducedMotion } from '@/components/premium/dock-menu';

describe('dock-menu', () => {
  const mockUseReducedMotion = vi.fn();
  
  // Wrap queries to handle jsdom layout/scroll gaps
  const safeQuery = (selector: string) => 
    screen.queryByRole('navigation') || screen.getByText(/dock/i);

  it('mounts without throwing', () => {
    render(<DockMenu />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('applies reduced-motion when requested', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<DockMenu useReducedMotion={true} />);
    
    await waitFor(() => {
      expect(mockUseReducedMotion).toHaveBeenCalled();
    });
  });

  it('renders dock items with proper accessibility', () => {
    const items = [
      { icon: 'home', label: 'Home' },
      { icon: 'settings', label: 'Settings' },
    ];

    render(<DockMenu items={items} />);

    expect(screen.getAllByRole('button')).toHaveLength(items.length);
  });
});
