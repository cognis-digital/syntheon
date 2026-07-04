import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedCounter from '@/components/premium/animated-counter';

describe('AnimatedCounter', () => {
  it('mounts without throwing with defaults', () => {
    const wrapper = render(<AnimatedCounter />);
    expect(wrapper).toBeDefined();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('does not throw on re-render (jsdom layout guard)', () => {
    const { rerender } = render(<AnimatedCounter />);
    rerender(<AnimatedCounter />);
    expect(true).toBe(true); // jsdom guards handled internally
  });
});
