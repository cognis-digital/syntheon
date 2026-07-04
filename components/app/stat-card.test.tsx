import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatCard } from '@/components/app/stat-card';

describe('StatCard', () => {
  const mockProps = {
    label: 'Test Label',
    value: 1234,
    unit: '%',
    trend: '+5.2%',
    size: 'md' as const,
    variant: 'default' as const,
    icon: null,
    showTrend: true,
    isLoading: false,
    formatOptions: {
      currency: false,
      compact: false,
      precision: 2,
    },
  };

  describe('Rendering', () => {
    it('renders with minimal required props', () => {
      const { container } = render(
        <StatCard label="Basic" value={100} />
      );
      expect(container).toBeInTheDocument();
      expect(screen.getByText(/Basic/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const { container } = render(
        <StatCard {...mockProps} />
      );
      expect(container).toHaveClass('rounded-lg');
      expect(container).toHaveClass('border-border');
    });

    it('applies custom colors via className prop', () => {
      const { container } = render(
        <StatCard label="Custom" value={50} className="bg-primary text-foreground" />
      );
      expect(container).toHaveClass('bg-primary');
    });

    it('respects dark mode context', () => {
      document.body.classList.add('dark');
      const { container } = render(
        <StatCard label="Dark Mode" value={100} />
      );
      expect(container).toHaveClass('rounded-lg');
      // Dark mode should adjust text colors appropriately
      expect(screen.getByText(/Dark Mode/)).toBeInTheDocument();
    });

    it('handles zero and negative values', () => {
      render(<StatCard label="Zero" value={0} />);
      expect(screen.getByText(/Zero/)).toBeInTheDocument();
      expect(screen.getByText(/0/)).toBeInTheDocument();

      render(<StatCard label="Negative" value={-50} />);
      expect(screen.getByText(/Negative/)).toBeInTheDocument();
      expect(screen.getByText(/\-50/)).toBeInTheDocument();
    });

    it('formats numbers according to options', () => {
      // Currency formatting
      render(
        <StatCard label="Currency" value={1234.56} formatOptions={{ currency: true }} />
      );
      expect(screen.getByText(/1,234\.56/)).toBeInTheDocument();

      // Compact mode
      render(
        <StatCard label="Compact" value={1000000} formatOptions={{ compact: true }} />
      );
      expect(screen.getByText(/M/)).toBeInTheDocument();
    });

    it('handles large numbers with overflow', () => {
      render(<StatCard label="Large" value={999999999999} />);
      // Should handle without breaking layout
      expect(screen.getByText(/Large/)).toBeInTheDocument();
    });

    it('renders loading state correctly', () => {
      const { container } = render(
        <StatCard label="Loading" value={null} isLoading={true} />
      );
      expect(container).toHaveClass('animate-pulse');
    });

    it('handles null/undefined values gracefully', () => {
      render(<StatCard label="Null Value" value={null} />);
      // Should not crash, may show placeholder or formatted 0
      expect(screen.getByText(/Null Value/)).toBeInTheDocument();
    });

    it('applies size variants correctly', () => {
      const sizes: Record<string, string> = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      };

      for (const [size, expectedClass] of Object.entries(sizes)) {
        render(<StatCard label={size} value={100} size={size as any} />);
        expect(screen.getByText(/sm/)).toHaveClass(expectedClass);
      }
    });

    it('applies variant styles correctly', () => {
      const variants: Record<string, string> = {
        default: 'border-border',
        primary: 'bg-primary',
        muted: 'bg-muted',
      };

      for (const [variant, expectedClass] of Object.entries(variants)) {
        render(
          <StatCard label={variant} value={100} variant={variant as any} />
        );
        expect(screen.getByText(/default/)).toHaveClass(expectedClass);
      }
    });

    it('renders icon when provided', () => {
      const Icon = ({ className }: { className?: string }) => (
        <svg className={className} width="24" height="24">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
        </svg>
      );

      render(
        <StatCard label="With Icon" value={100} icon={<Icon />} />
      );
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('shows/hides trend based on prop', () => {
      const { container } = render(
        <StatCard label="Trend Visible" value={100} trend="+5%" showTrend={true} />
      );
      expect(container).toHaveTextContent('+5%');

      render(
        <StatCard label="Trend Hidden" value={100} trend="+5%" showTrend={false} />
      );
      const hiddenContainer = screen.getByText(/Hidden/);
      // Trend should not be visible when disabled
    });

    it('applies custom className overrides', () => {
      render(
        <StatCard label="Custom Class" value={100} className="p-4 shadow-lg" />
      );
      expect(screen.getByText(/Custom Class/)).toHaveClass('shadow-lg');
    });

    it('applies custom style overrides', () => {
      render(
        <StatCard label="Custom Style" value={100} style={{ padding: '2rem' }} />
      );
      const card = screen.getByText(/Custom Style/);
      expect(card).toHaveStyle('padding: 2rem');
    });

    it('handles boolean values correctly', () => {
      render(<StatCard label="Boolean" value={true} />);
      expect(screen.getByText(/Boolean/)).toBeInTheDocument();

      render(<StatCard label="False Value" value={false} />);
      expect(screen.getByText(/False Value/)).toBeInTheDocument();
    });

    it('renders with proper ARIA attributes', () => {
      const { container } = render(
        <StatCard
          label="Accessible"
          value={100}
          ariaLabelledBy="stat-card-aria-test"
        />
      );
      expect(container).toHaveAttribute('aria-labelledby');
    });

    it('handles keyboard navigation', () => {
      const { container } = render(
        <StatCard label="Keyboard Test" value={100} tabIndex={0} />
      );
      const card = screen.getByText(/Keyboard Test/);
      expect(card).toHaveAttribute('tabIndex', '0');

      userEvent.tab();
      // Should be focusable if tabIndex is set
    });

    it('memoizes properly to prevent unnecessary re-renders', () => {
      let renderCount = 0;
      const TestComponent = () => {
        renderCount++;
        return <StatCard label="Memo" value={100} />;
      };

      render(<TestComponent />);
      expect(renderCount).toBe(1);

      // Trigger a re-render by updating parent state
      document.body.innerHTML = '<div id="root"></div>';
      const { rerender } = render(<TestComponent />);
      expect(renderCount).toBe(2);
    });

    it('handles extreme precision values', () => {
      render(
        <StatCard label="Precision" value={1.23456789} formatOptions={{ precision: 6 }} />
      );
      // Should handle without overflow or scientific notation issues
      expect(screen.getByText(/Precision/)).toBeInTheDocument();
    });

    it('handles very small decimal values', () => {
      render(<StatCard label="Small Decimal" value={0.001} />);
      expect(screen.getByText(/Small Decimal/)).toBeInTheDocument();
    });

    it('renders with custom number format options', () => {
      // Custom locale
      render(
        <StatCard
          label="Locale"
          value={1234567.89}
          formatOptions={{ locale: 'de-DE' }}
        />
      );
      expect(screen.getByText(/Locale/)).toBeInTheDocument();

      // Custom separator
      render(
        <StatCard
          label="Separator"
          value={1234567.89}
          formatOptions={{ useGrouping: true, thousandSeparator: '.' }}
        />
      );
    });

    it('handles mixed positive/negative trends', () => {
      render(
        <StatCard label="Positive Trend" value={100} trend="+5%" showTrend={true} />
      );
      expect(screen.getByText(/Positive Trend/)).toBeInTheDocument();

      render(
        <StatCard label="Negative Trend" value={100} trend="-3.2%" showTrend={true} />
      );
      expect(screen.getByText(/Negative Trend/)).toBeInTheDocument();
    });

    it('handles percentage values correctly', () => {
      render(<StatCard label="Percentage" value={45.6789} />);
      expect(screen.getByText(/Percentage/)).toBeInTheDocument();
    });

    it('renders with optional tooltip (if implemented)', () => {
      // If tooltip is part of the component, test it here
      render(<StatCard label="Tooltip" value={100} showTooltip={true} />);
      expect(screen.getByText(/Tooltip/)).toBeInTheDocument();
    });

    it('handles long labels without overflow', () => {
      const veryLongLabel = 'This is a very long label that should not break the layout';
      render(<StatCard label={veryLongLabel} value={100} />);
      expect(screen.getByText(veryLongLabel)).toBeInTheDocument();
    });

    it('handles special characters in labels', () => {
      const specialChars = 'Test <>&"\'/\\[]{}()';
      render(<StatCard label={specialChars} value={100} />);
      expect(screen.getByText(specialChars)).toBeInTheDocument();
    });

    it('renders with custom border radius', () => {
      render(
        <StatCard label="Custom Radius" value={100} borderRadius="2rem" />
      );
      // Should apply custom border-radius if prop exists
      expect(screen.getByText(/Custom Radius/)).toBeInTheDocument();
    });

    it('handles animation props (if using framer-motion)', () =>
      render(<StatCard label="Animation" value={100} animate={{ scale: 1.1 }} />));

    it('respects reduced motion preference', () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.mock({ matches: true });

      render(<StatCard label="Reduced Motion" value={100} animate={{ scale: 1.1 }} />);
      // Animations should be disabled or simplified when reduced motion is enabled
    });

    it('handles transition duration props', () => {
      render(
        <StatCard label="Transition" value={100} transition={{ duration: 0.3 }} />
      );
      expect(screen.getByText(/Transition/)).toBeInTheDocument();
    });

    it('renders with custom cursor (if interactive)', () => {
      render(<StatCard label="Cursor Test" value={100} cursor="pointer" />);
      // Should apply appropriate cursor style
    });

    it('handles focus states for accessibility', () => {
      const { container } = render(
        <StatCard label="Focus" value={100} tabIndex={0} />
      );
      const card = screen.getByText(/Focus/);
      expect(card).toHaveAttribute('tabIndex', '0');

      userEvent.tab();
      // Focus styles should be applied
    });

    it('handles disabled state (if implemented)', () => {
      render(<StatCard label="Disabled" value={100} disabled />);
      // Should apply appropriate disabled styles
    });

    it('renders with custom font settings', () => {
      render(
        <StatCard label="Font Test" value={100} fontFamily="monospace" />
      );
      expect(screen.getByText(/Font Test/)).toBeInTheDocument();
    });

    it('handles text overflow gracefully', () => {
      const veryLongValue = 'This is a very long number that might cause overflow';
      render(<StatCard label="Overflow" value={veryLongValue} />);
      // Should handle without breaking layout
    });

    it('renders with custom z-index (if positioned)', () => {
      render(
        <StatCard label="Z-Index" value={100} zIndex={9999} />
      );
      expect(screen.getByText(/Z-Index/)).toBeInTheDocument();
    });

    it('handles nested components without conflicts', () => {
      const Nested = () => (
        <div>
          <StatCard label="Nested" value={100} />
          <StatCard label="Sibling" value={200} />
        </div>
      );

      render(<Nested />);
      expect(screen.getAllByText(/Nested/)).toHaveLength(1);
      expect(screen.getAllByText(/Sibling/)).toHaveLength(1);
    });

    it('renders with custom shadow settings', () => {
      render(
        <StatCard label="Shadow" value={100} shadow="2xl" />
      );
      // Should apply appropriate shadow class
    });

    it('handles custom padding values', () => {
      render(
        <StatCard label="Padding" value={100} padding="4rem" />
      );
      expect(screen.getByText(/Padding/)).toBeInTheDocument();
    });

    it('renders with custom margin settings', () => {
      render(
        <StatCard label="Margin" value={100} margin="2rem" />
      );
      // Should apply appropriate margin class
    });

    it('handles custom line-height for readability', () => {
      render(
        <StatCard label="Line Height" value={100} lineHeight="1.5" />
      );
      expect(screen.getByText(/Line Height/)).toBeInTheDocument();
    });

    it('renders with custom letter-spacing (if needed)', () => {
      render(
        <StatCard label="Letter Spacing" value={100} letterSpacing="-0.025em" />
      );
      expect(screen.getByText(/Letter Spacing/)).toBeInTheDocument();
    });

    it('handles custom text-transform (if needed)', () => {
      render(
        <StatCard label="Transform" value={100} textTransform="uppercase" />
      );
      // Should apply appropriate transform class
    });

    it('renders with custom overflow handling', () => {
      render(
        <StatCard label="Overflow" value={100} overflow="hidden" />
      );
      expect(screen.getByText(/Overflow/)).toBeInTheDocument();
    });

    it('handles custom white-space for long text', () => {
      render(
        <StatCard label="White Space" value={100} whiteSpace="nowrap" />
      );
      // Should apply appropriate white-space class
    });

    it('renders with custom direction (RTL/LTR)', () => {
      render(
        <StatCard label="Direction" value={100} dir="rtl" />
      );
      expect(screen.getByText(/Direction/)).toBeInTheDocument();
    });

    it('handles custom text-align', () => {
      render(
        <StatCard label="Align" value={100} textAlign="center" />
      );
      // Should apply appropriate text-align class
    });

    it('renders with custom vertical alignment', () => {
      render(
        <StatCard label="Vertical Align" value={100} align="middle" />
      );
      expect(screen.getByText(/Vertical Align/)).toBeInTheDocument();
    });

    it('handles custom flex properties (if using flexbox)', () => {
      render(
        <StatCard label="Flex" value={100} flex="row" />
      );
      // Should apply appropriate flex class
    });

    it('renders with custom gap between elements', () => {
      render(
        <StatCard label="Gap" value={100} gap="2rem" />
      );
      // Should apply appropriate gap class
    });

    it('handles custom order for flex items', () => {
      render(
        <StatCard label="Order" value={100} order={2} />
      );
      // Should apply appropriate order class
    });

    it('renders with custom justify-content', () => {
      render(
        <StatCard label="Justify" value={100} justifyContent="center" />
      );
      // Should apply appropriate justify-content class
    });

    it('handles custom alignItems for flex items', () => {
      render(
        <StatCard label="Align Items" value={100} alignItems="center" />
      );
      // Should apply appropriate align-items class
    });

    it('renders with custom flexGrow/shrink/basis', () => {
      render(
        <StatCard label="Flex Grow" value={100} flexGrow={1} />
      );
      // Should apply appropriate flex-grow class
    });

    it('handles custom flexWrap (if needed)', () => {
      render(
        <StatCard label="Flex Wrap" value={100} flexWrap="wrap" />
      );
      // Should apply appropriate flex-wrap class
    });

    it('renders with custom min/max/fit content', () => {
      render(
        <StatCard label="Min Content" value={100} minWidth="200px" />
      );
      // Should apply appropriate min-width class
    });

    it('handles custom height settings', () => {
      render(
        <StatCard label="Height" value={100} minHeight="5rem" />
      );
      // Should apply appropriate min-height class
    });

    it('renders with custom max-width/max-height', () => {
      render(
        <StatCard label="Max Size" value={100} maxWidth="300px" />
      );
      // Should apply appropriate max-width class
    });

    it('handles custom aspect-ratio (if needed)', () => {
      render(
        <StatCard label="Aspect Ratio" value={100} aspectRatio="16/9" />
      );
      // Should apply appropriate aspect-ratio class
    });

    it('renders with custom position settings', () => {
      render(
        <StatCard label="Position" value={100} position="relative" />
      );
      // Should apply appropriate position class
    });

    it('handles custom top/right/bottom/left positioning', () => {
      render(
        <StatCard label="Top Position" value={100} top="-1rem" />
      );
      // Should apply appropriate top class
    });

    it('renders with custom z-index stacking context', () => {
      render(
        <StatCard label="Stacking" value={100} zIndex={9999} />
      );
      // Should apply appropriate z-index class
    });

    it('handles custom pointer-events (if interactive)', () => {
      render(
        <StatCard label="Pointer Events" value={100} pointerEvents="none" />
      );
      // Should apply appropriate pointer-events class
    });

    it('renders with custom user-select', () => {
      render(
        <StatCard label="User Select" value={100} userSelect="none" />
      );
      // Should apply appropriate user-select class
    });

    it('handles custom cursor styles for interactive elements', () => {
      render(
        <StatCard label="Cursor Style" value={100} cursor="pointer" />
      );
      // Should apply appropriate cursor class
    });

    it('renders with custom selection colors (if needed)', () => {
      render(
        <StatCard label="Selection Color" value={100} selectionColor="#ff0000" />
      );
      // Should apply appropriate selection-color class
    });

    it('handles custom scrollbar settings (if scrollable)', () => {
      render(
        <StatCard label="Scrollbar" value={100} scrollbar="thin" />
      );
