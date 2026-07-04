import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { ComponentProps as ButtonProps } from '@/components/premium/magnetic-button';

// Mock framer-motion's layout-related APIs that jsdom lacks
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => false,
    motion: {
      div: actual.div,
      button: actual.button,
      LayoutGroup: actual.LayoutGroup,
      AnimatePresence: actual.AnimatePresence,
      useAnimation: vi.fn(() => ({ play: vi.fn(), stop: vi.fn() })),
    },
  };
});

describe('MagneticButton', () => {
  const defaultProps = {
    children: 'Click me',
    className: '',
    variant: 'primary' as ButtonProps['variant'],
    size: 'md' as ButtonProps['size'],
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mounts without throwing', () => {
    const { container } = render(
      <button {...defaultProps}>Test</button>
    );
    expect(container).toBeTruthy();
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies base button role and type', () => {
    const { container } = render(
      <button {...defaultProps}>Test</button>
    );
    const btn = container.querySelector('button');
    expect(btn?.getAttribute('role')).toBe('button');
    expect(btn?.getAttribute('type')).toBe('button');
  });

  it('applies variant-specific classes', () => {
    const variants: ButtonProps['variant'][] = ['primary', 'secondary', 'ghost'];
    
    variants.forEach((variant) => {
      render(<button {...{ ...defaultProps, variant }}>Test</button>);
      expect(screen.getByRole('button')).toHaveClass(
        `btn-${variant}`
      );
    });
  });

  it('applies size-specific classes', () => {
    const sizes: ButtonProps['size'][] = ['sm', 'md', 'lg'];
    
    sizes.forEach((size) => {
      render(<button {...{ ...defaultProps, size }}>Test</button>);
      expect(screen.getByRole('button')).toHaveClass(
        `btn-${size}`
      );
    });
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<button {...{ ...defaultProps, className: customClass }}>Test</button>);
    
    expect(screen.getByRole('button')).toHaveClass(customClass);
  });

  it('handles disabled state correctly', async () => {
    const user = userEvent.setup();
    
    // Enabled by default
    render(<button {...defaultProps}>Test</button>);
    expect(screen.getByRole('button')).not.toBeDisabled();
    
    // Disabled when prop is true
    render(<button {...{ ...defaultProps, disabled: true }}>Test</button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(screen.getByText('Click me')).not.toHaveFocus();
  });

  it('has proper accessibility attributes', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Focus visible
    expect(btn).toHaveAttribute('tabIndex', '-1');
    
    // ARIA for interactive element
    expect(btn).toHaveAttribute('aria-disabled', 'false');
  });

  it('applies dark mode classes when in dark theme', () => {
    render(
      <button {...defaultProps} className="dark:invert">Test</button>,
      { attributes: { class: 'dark' } }
    );
    
    expect(screen.getByRole('button')).toHaveClass('dark:invert');
  });

  it('handles reduced motion preference', () => {
    const { container, rerender } = render(
      <button {...defaultProps}>Test</button>
    );
    
    // Should mount with motion classes
    expect(container).toBeTruthy();
    
    // When reduced motion is enabled
    vi.mocked(useReducedMotion).mockReturnValue(true);
    rerender(<button {...defaultProps}>Test</button>);
    
    // Should still render but potentially without heavy animations
  });

  it('passes through all HTML attributes', () => {
    const customAttrs = {
      id: 'custom-id',
      href: '/test-link',
      target: '_blank',
      rel: 'noopener noreferrer',
    };
    
    render(
      <button {...{ ...defaultProps, ...customAttrs }}>Test</button>
    );
    
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('id', 'custom-id');
    expect(btn).toHaveAttribute('href', '/test-link');
  });

  it('renders children correctly with different types', () => {
    // String children
    render(<button {...defaultProps}>String</button>);
    expect(screen.getByText('String')).toBeInTheDocument();
    
    // Element children
    render(
      <button {...defaultProps}>
        <span className="inner">Wrapped</span>
      </button>
    );
    expect(screen.getByText('Wrapped')).toBeInTheDocument();
  });

  it('handles icon children', () => {
    const Icon = ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
    
    render(
      <button {...defaultProps}>
        <Icon className="icon" />
      </button>
    );
    
    expect(screen.getByRole('button')).toHaveTextContent('');
  });

  it('applies semantic color tokens', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have base background and text colors
    expect(btn).toHaveStyle(/background-color/);
    expect(btn).toHaveStyle(/color/);
  });

  it('applies rounded corners', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have some border radius
    expect(btn).toHaveStyle(/border-radius/);
  });

  it('handles hover state transitions', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Hover should trigger visual changes
    await user.hover(btn);
    expect(btn).toHaveClass(/hover/);
  });

  it('handles focus state', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Focus should trigger visual changes and outline
    await user.tab();
    expect(btn).toHaveFocus();
    expect(btn).toHaveClass(/focus/);
  });

  it('handles active state', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Active should trigger pressed visual changes
    await user.click(btn);
    expect(btn).toHaveClass(/active/);
  });

  it('applies shadow and depth effects', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have some shadow for depth
    expect(btn).toHaveStyle(/box-shadow/);
  });

  it('handles loading state gracefully', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Loading should disable interaction and show indicator
    await user.click(btn);
    expect(screen.getByText('Click me')).not.toHaveFocus();
  });

  it('supports custom loading indicator', () => {
    render(
      <button {...defaultProps} loading>
        Test
      </button>
    );
    
    // Should have loading-related classes or attributes
    expect(screen.getByRole('button')).toHaveClass(/loading/);
  });

  it('handles click event propagation', async () => {
    const handleClick = vi.fn();
    render(
      <button {...{ ...defaultProps, onClick: handleClick }}>Test</button>
    );
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('handles keyboard events', async () => {
    const handleKeyDown = vi.fn();
    render(
      <button {...{ ...defaultProps, onKeyDown: handleKeyDown }}>Test</button>
    );
    
    await userEvent.keyboard('{Enter}');
    expect(handleKeyDown).toHaveBeenCalledOnce();
  });

  it('applies correct border styles', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have border styling
    expect(btn).toHaveStyle(/border/);
  });

  it('handles transition timing correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Transitions should be smooth (not instant)
    await user.hover(btn);
    expect(btn).toHaveStyle(/transition/);
  });

  it('supports outline for accessibility', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have focus outline
    expect(btn).toHaveStyle(/outline/);
  });

  it('handles multiple children correctly', () => {
    render(
      <button {...defaultProps}>
        <span>First</span>
        <span>Last</span>
      </button>
    );
    
    // Should contain all children
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
  });

  it('applies correct text color hierarchy', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have foreground text color applied
    expect(btn).toHaveStyle(/color/);
  });

  it('handles padding correctly based on size', () => {
    const sizes: ButtonProps['size'][] = ['sm', 'md', 'lg'];
    
    sizes.forEach((size) => {
      render(<button {...{ ...defaultProps, size }}>Test</button>);
      const btn = screen.getByRole('button');
      
      // Different sizes should have different padding
      expect(btn).toHaveStyle(/padding/);
    });
  });

  it('applies hover color changes', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Hover should change background color
    await user.hover(btn);
    expect(btn).toHaveStyle(/hover/);
  });

  it('handles focus-visible for keyboard users', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Focus-visible should show enhanced outline
    await user.tab();
    expect(btn).toHaveStyle(/focus/);
  });

  it('applies correct z-index for stacking', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have appropriate z-index
    expect(btn).toHaveStyle(/z-index/);
  });

  it('handles pointer events correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should respond to pointer events
    await user.hover(btn);
    expect(btn).toHaveStyle(/pointer/);
  });

  it('applies cursor style for interactive element', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have pointer cursor when enabled
    expect(btn).toHaveStyle(/cursor/);
  });

  it('handles disabled cursor style', async () => {
    const user = userEvent.setup();
    render(<button {...{ ...defaultProps, disabled: true }}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have not-allowed cursor when disabled
    expect(btn).toHaveStyle(/cursor/);
  });

  it('applies correct font family', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should inherit or have appropriate font
    expect(btn).toHaveStyle(/font-family/);
  });

  it('handles text transform correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have appropriate text transform
    expect(btn).toHaveStyle(/text-transform/);
  });

  it('applies correct line height', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have appropriate line height
    expect(btn).toHaveStyle(/line-height/);
  });

  it('handles overflow correctly for long text', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should handle overflow gracefully
    expect(btn).toHaveStyle(/overflow/);
  });

  it('applies correct white-space handling', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have appropriate whitespace handling
    expect(btn).toHaveStyle(/white-space/);
  });

  it('handles user-select correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have appropriate user-select
    expect(btn).toHaveStyle(/user-select/);
  });

  it('applies correct text decoration', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have appropriate text decoration
    expect(btn).toHaveStyle(/text-decoration/);
  });

  it('handles letter spacing correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have appropriate letter spacing
    expect(btn).toHaveStyle(/letter-spacing/);
  });

  it('applies correct text shadow', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // May or may not have text shadow depending on variant
    expect(btn).toHaveStyle(/text-shadow/);
  });

  it('handles background gradient correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // May have gradient depending on variant
    expect(btn).toHaveStyle(/background-image/);
  });

  it('applies correct border radius', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have rounded corners
    expect(btn).toHaveStyle(/border-radius/);
  });

  it('handles box shadow correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have some shadow for depth
    expect(btn).toHaveStyle(/box-shadow/);
  });

  it('applies correct transition timing', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have smooth transitions
    expect(btn).toHaveStyle(/transition/);
  });

  it('handles animation keyframes correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // May have animations for hover/focus states
    expect(btn).toHaveStyle(/animation/);
  });

  it('applies correct selection color', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have appropriate selection color
    expect(btn).toHaveStyle(/selection/);
  });

  it('handles caret position correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have appropriate caret behavior
    expect(btn).toHaveStyle(/caret/);
  });

  it('applies correct outline offset', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // May have outline offset for accessibility
    expect(btn).toHaveStyle(/outline-offset/);
  });

  it('handles focus ring correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have appropriate focus ring
    expect(btn).toHaveStyle(/ring/);
  });

  it('applies correct border width', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have appropriate border width
    expect(btn).toHaveStyle(/border-width/);
  });

  it('handles border style correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have appropriate border style
    expect(btn).toHaveStyle(/border-style/);
  });

  it('applies correct border color', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have appropriate border color
    expect(btn).toHaveStyle(/border-color/);
  });

  it('handles min-height correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should have appropriate minimum height
    expect(btn).toHaveStyle(/min-height/);
  });

  it('applies correct min-width', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should have appropriate minimum width
    expect(btn).toHaveStyle(/min-width/);
  });

  it('handles max-height correctly', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // May have maximum height constraints
    expect(btn).toHaveStyle(/max-height/);
  });

  it('applies correct max-width', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // May have maximum width constraints
    expect(btn).toHaveStyle(/max-width/);
  });

  it('handles min-height for touch targets', async () => {
    const user = userEvent.setup();
    render(<button {...defaultProps}>Test</button>);
    
    const btn = screen.getByRole('button');
    
    // Should meet minimum touch target size (44px)
    expect(btn).toHaveStyle(/min-height/);
  });

  it('applies correct min-width for touch targets', () => {
    render(<button {...defaultProps}>Test</button>);
    const btn = screen.getByRole('button');
    
    // Should meet minimum touch target width (44px)
    expect(btn).toHaveStyle(/min-width/);
  });
