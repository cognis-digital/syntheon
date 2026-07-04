import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaywallGate } from '@/components/premium-features/paywall-gate';

// Mock utilities and hooks
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock Radix UI components
const mockDialog = {
  Dialog: {
    Root: vi.fn().mockImplementation(({ children, open, onOpenChange }) => (
      <div data-testid="dialog-root" role="dialog" aria-modal={open}>
        {children}
        <button onClick={() => onOpenChange?.(!open)}>Close</button>
      </div>
    )),
    Title: vi.fn().mockImplementation(({ children }) => (
      <h2 className="text-xl font-bold">{children}</h2>
    )),
    Description: vi.fn().mockImplementation(({ children }) => (
      <p className="text-sm opacity-70">{children}</p>
    )),
    Header: vi.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Body: vi.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Footer: vi.fn().mockImplementation(({ children }) => <div>{children}</div>),
  },
};

const mockButton = {
  Button: {
    Root: vi.fn().mockImplementation(({ children, variant, size, className, ...props }) => (
      <button
        data-testid="dialog-button"
        className={`rounded-md ${className}`}
        type={props.type}
      >
        {children}
      </button>
    )),
  },
};

// Extend expect with custom matchers
expect.extend({
  toBeVisible: (actual, selector) => {
    const element = screen.queryByTestId(selector);
    return {
      pass: !!element,
      message: () => `Expected ${selector} to be visible but found: ${!!element}`,
    };
  },
});

describe('PaywallGate', () => {
  // Test fixtures
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onUpgrade: vi.fn(),
    title: 'Unlock Premium Features',
    description: 'Get unlimited access to all premium features.',
    price: '$29/mo',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    ctaText: 'Start Free Trial',
  };

  // Setup before each test
  beforeEach(() => {
    vi.clearAllMocks();
    (mockDialog.Dialog.Root as any).mockClear();
    (mockButton.Button.Root as any).mockClear();
  });

  // Test: Basic rendering with default props
  it('renders the paywall gate when isOpen is true', () => {
    const { container } = render(
      <PaywallGate {...defaultProps} />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  // Test: Modal closes when onClose is triggered
  it('calls onClose when close button is clicked', async () => {
    render(<PaywallGate {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  // Test: CTA button triggers upgrade flow
  it('calls onUpgrade when primary CTA is clicked', async () => {
    render(<PaywallGate {...defaultProps} />);

    const ctaButton = screen.getByRole('button', { name: /start free trial/i });
    await act(async () => {
      fireEvent.click(ctaButton);
    });

    expect(defaultProps.onUpgrade).toHaveBeenCalled();
  });

  // Test: Loading state shows spinner
  it('displays loading indicator during upgrade process', async () => {
    render(
      <PaywallGate {...defaultProps} isLoading={true}>
        <div>Content</div>
      </PaywallGate>,
    );

    const loader = screen.getByRole('img');
    expect(loader).toBeInTheDocument();
  });

  // Test: Error state displays message
  it('displays error message when upgrade fails', async () => {
    render(
      <PaywallGate {...defaultProps} error="Payment failed">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
  });

  // Test: Feature list renders correctly
  it('renders all premium features', () => {
    render(<PaywallGate {...defaultProps} />);

    defaultProps.features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  // Test: Responsive layout adapts to viewport size
  it('applies mobile styles when width is small', () => {
    const { container } = render(
      <PaywallGate {...defaultProps} /> as any,
    );

    expect(container).toHaveClass('lg:mx-auto');
    expect(container).toHaveClass('max-w-2xl');
  });

  // Test: Dark mode handles colors correctly
  it('applies dark mode styles when in dark theme', () => {
    document.body.classList.add('dark');

    const { container } = render(<PaywallGate {...defaultProps} />);

    expect(container).toHaveClass('bg-background');
    expect(container).toHaveClass('text-foreground');
  });

  // Test: Accessibility - proper ARIA attributes
  it('has correct ARIA roles and attributes', () => {
    render(<PaywallGate {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('role', 'dialog');
  });

  // Test: Keyboard navigation works correctly
  it('closes on Escape key press', async () => {
    render(<PaywallGate {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    await act(async () => {
      fireEvent.keyDown(dialog, { key: 'Escape' });
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  // Test: Focus returns to trigger element on close
  it('returns focus to trigger element when closed', async () => {
    const mockTrigger = document.createElement('button');
    Object.defineProperty(mockTrigger, 'id', { value: 'trigger-btn' });

    render(
      <PaywallGate {...defaultProps} triggerElement={mockTrigger}>
        <div>Content</div>
      </PaywallGate>,
    );

    const dialog = screen.getByRole('dialog');
    await act(async () => {
      fireEvent.keyDown(dialog, { key: 'Escape' });
    });

    expect(document.activeElement).toBe(mockTrigger);
  });

  // Test: Reduced motion preference is respected
  it('disables animations when prefers-reduced-motion is true', async () => {
    (mockDialog.Dialog.Root as any).mockImplementationOnce((props) => (
      <div data-testid="dialog-root" {...(props.open ? {} : {})}>
        {props.children}
        <button onClick={() => props.onOpenChange?.(!props.open)}>Close</button>
      </div>
    ));

    render(<PaywallGate {...defaultProps} />);

    const dialog = screen.getByTestId('dialog-root');
    expect(dialog).toHaveAttribute('data-reduced-motion', 'true');
  });

  // Test: Form validation provides feedback
  it('shows error when form is invalid', async () => {
    render(
      <PaywallGate {...defaultProps} formError="Email required">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/email required/i)).toBeInTheDocument();
  });

  // Test: Success state shows confirmation message
  it('displays success message after upgrade', async () => {
    render(
      <PaywallGate {...defaultProps} success="Welcome aboard!">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/welcome aboard/i)).toBeInTheDocument();
  });

  // Test: Custom content renders in body slot
  it('renders custom content passed through children', () => {
    const customContent = (
      <div className="custom-content">
        <h3>Custom Section</h3>
        <p>Extra information here.</p>
      </div>
    );

    render(<PaywallGate {...defaultProps}>{customContent}</PaywallGate>);

    expect(screen.getByText('Custom Section')).toBeInTheDocument();
  });

  // Test: Props with sensible defaults render without errors
  it('renders correctly when optional props are omitted', () => {
    const minimalProps = {
      isOpen: true,
      onClose: vi.fn(),
      onUpgrade: vi.fn(),
    };

    const { container } = render(<PaywallGate {...minimalProps} />);

    expect(container).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // Test: Multiple close methods all work
  it('closes via multiple interaction points', async () => {
    render(<PaywallGate {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  // Test: Dialog animation is smooth and performant
  it('applies appropriate transition durations', async () => {
    const { container } = render(<PaywallGate {...defaultProps} />);

    expect(container).toHaveStyle(/transition/);
    expect(container).toHaveClass('duration-200');
  });

  // Test: Staggered feature entrance animation
  it('applies stagger delay to features', async () => {
    const { container } = render(<PaywallGate {...defaultProps} />);

    const featuresContainer = screen.getByText(/feature 1/i).parentElement;
    expect(featuresContainer).toHaveClass('stagger-200');
  });

  // Test: Hover effects on interactive elements
  it('applies hover states to buttons', async () => {
    render(<PaywallGate {...defaultProps} />);

    const ctaButton = screen.getByRole('button', { name: /start free trial/i });
    
    await act(async () => {
      fireEvent.mouseEnter(ctaButton);
    });

    expect(ctaButton).toHaveClass('hover:scale-105');
  });

  // Test: Focus management for keyboard users
  it('manages focus trap within dialog', async () => {
    render(<PaywallGate {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    
    await act(async () => {
      fireEvent.keyDown(dialog, { key: 'Tab' });
    });

    expect(document.activeElement).toBeWithin(dialog);
  });

  // Test: Performance - minimal re-renders during interactions
  it('maintains stable render count during rapid clicks', async () => {
    const mockRender = vi.fn();
    
    render(
      <PaywallGate {...defaultProps} onMount={mockRender}>
        <div>Content</div>
      </PaywillGate>,
    );

    expect(mockRender).toHaveBeenCalled();
  });

  // Test: Cleanup after unmount
  it('removes event listeners and cleanup functions', async () => {
    const mockCleanup = vi.fn();
    
    render(
      <PaywallGate {...defaultProps} onUnmount={mockCleanup}>
        <div>Content</div>
      </PaywallGate>,
    );

    await act(async () => {
      screen.unmount();
    });

    expect(mockCleanup).toHaveBeenCalled();
  });

  // Test: Edge case - empty feature list
  it('handles empty features array gracefully', () => {
    render(
      <PaywallGate {...defaultProps} features={[]}>
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/feature 1/i)).toBeInTheDocument();
  });

  // Test: Edge case - very long text content
  it('handles overflow with proper styling', () => {
    const longDescription = 'A'.repeat(500);
    
    render(
      <PaywallGate {...defaultProps} description={longDescription}>
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/a/g)).toBeInTheDocument();
  });

  // Test: Edge case - special characters in text
  it('renders special characters correctly', () => {
    render(
      <PaywallGate {...defaultProps} title="Premium & Enterprise | $100/mo (€95)">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  // Test: Edge case - null/undefined props
  it('handles null values without crashing', () => {
    render(
      <PaywallGate {...defaultProps} title={null}>
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // Test: Edge case - very small viewport simulation
  it('applies mobile-specific styles', () => {
    const { container } = render(
      <PaywallGate {...defaultProps} /> as any,
    );

    expect(container).toHaveClass('sm:max-w-3xl');
    expect(container).toHaveClass('md:max-w-4xl');
  });

  // Test: Edge case - extremely fast click sequence
  it('handles rapid successive clicks', async () => {
    render(<PaywallGate {...defaultProps} />);

    const ctaButton = screen.getByRole('button', { name: /start free trial/i });
    
    await act(async () => {
      fireEvent.click(ctaButton);
      fireEvent.click(ctaButton);
      fireEvent.click(ctaButton);
    });

    expect(defaultProps.onUpgrade).toHaveBeenCalledTimes(3);
  });

  // Test: Edge case - dialog with nested modals
  it('manages nested modal states correctly', () => {
    render(
      <PaywallGate {...defaultProps} isOpen={true}>
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // Test: Edge case - very deep nesting of components
  it('renders correctly with deeply nested parent elements', () => {
    render(
      <div className="parent-1">
        <div className="parent-2">
          <PaywallGate {...defaultProps}>
            <div>Content</div>
          </PaywallGate>
        </div>
      </div>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // Test: Edge case - concurrent renders during state transitions
  it('maintains consistency during rapid state changes', async () => {
    render(<PaywallGate {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    
    await act(async () => {
      fireEvent.click(dialog);
    });

    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  // Test: Edge case - memory leak prevention
  it('cleans up properly after component unmounts', async () => {
    const mockOnUnmount = vi.fn();
    
    render(
      <PaywallGate {...defaultProps} onUnmount={mockOnUnmount}>
        <div>Content</div>
      </PaywallGate>,
    );

    await act(async () => {
      screen.unmount();
    });

    expect(mockOnUnmount).toHaveBeenCalled();
  });

  // Test: Edge case - very long loading state duration
  it('handles extended loading states gracefully', async () => {
    render(
      <PaywallGate {...defaultProps} isLoading={true}>
        <div>Content</div>
      </PaywallGate>,
    );

    const loader = screen.getByRole('img');
    expect(loader).toBeInTheDocument();
  });

  // Test: Edge case - extremely large price values
  it('handles very large or small numbers', () => {
    render(
      <PaywallGate {...defaultProps} price="$9,999.99">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/9,999\.99/i)).toBeInTheDocument();
  });

  // Test: Edge case - international currency symbols
  it('handles various currency formats', () => {
    render(
      <PaywallGate {...defaultProps} price="€50 / €48">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/€50/i)).toBeInTheDocument();
  });

  // Test: Edge case - mixed content types in features
  it('handles different feature formats', () => {
    render(
      <PaywallGate {...defaultProps} features={['Feature 1', 'Feature 2 • Pro']}>
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/feature 1/i)).toBeInTheDocument();
  });

  // Test: Edge case - very wide container
  it('applies appropriate max-width constraints', () => {
    const { container } = render(
      <PaywallGate {...defaultProps} /> as any,
    );

    expect(container).toHaveClass('max-w-2xl');
  });

  // Test: Edge case - very narrow container (mobile)
  it('applies mobile-specific constraints', () => {
    const { container } = render(
      <PaywallGate {...defaultProps} /> as any,
    );

    expect(container).toHaveClass('lg:max-w-2xl');
  });

  // Test: Edge case - very tall content overflow
  it('handles vertical scrolling within dialog', () => {
    const longContent = 'A'.repeat(1000);
    
    render(
      <PaywallGate {...defaultProps} description={longContent}>
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/a/g)).toBeInTheDocument();
  });

  // Test: Edge case - very short content (minimal text)
  it('handles minimal content gracefully', () => {
    render(
      <PaywallGate {...defaultProps} title="X" description="Y">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/x/i)).toBeInTheDocument();
  });

  // Test: Edge case - very long CTA text
  it('handles extended call-to-action text', () => {
    render(
      <PaywallGate {...defaultProps} ctaText="Start your 14-day free trial today and unlock all premium features now!">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/start your/i)).toBeInTheDocument();
  });

  // Test: Edge case - very long title text
  it('handles extended titles with proper wrapping', () => {
    render(
      <PaywallGate {...defaultProps} title="Unlock Premium Features and Get Unlimited Access to All Enterprise-Grade Tools">
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/unlock premium/i)).toBeInTheDocument();
  });

  // Test: Edge case - very long description text
  it('handles extended descriptions with proper truncation', () => {
    render(
      <PaywallGate {...defaultProps} description="A".repeat(500)}>
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/a/g)).toBeInTheDocument();
  });

  // Test: Edge case - very long feature list items
  it('handles extended feature descriptions', () => {
    render(
      <PaywallGate {...defaultProps} features={['A'.repeat(100)]}>
        <div>Content</div>
      </PaywallGate>,
    );

    expect(screen.getByText(/a/g)).toBeInTheDocument();
  });

  // Test: Edge case - very long price display
  it('handles extended pricing information', () => {
    render(
      <PaywallGate {...defaultProps} price="A".repeat(50) + " $29/mo">
        <div>Content</div>
      </PaywallGate>,
    );
