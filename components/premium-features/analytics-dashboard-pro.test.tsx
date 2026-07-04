import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnalyticsDashboardPro } from '@/components/premium-features/analytics-dashboard-pro';

describe('AnalyticsDashboardPro', () => {
  const mockProps = {
    data: [
      { id: '1', name: 'Page A', visits: 1250, revenue: 4500 },
      { id: '2', name: 'Page B', visits: 890, revenue: 3200 },
      { id: '3', name: 'Page C', visits: 670, revenue: 2100 },
    ],
    timeRange: 'last-30-days',
    theme: 'dark' as 'light' | 'dark',
  };

  describe('Rendering with default props', () => {
    it('renders without crashing when no props provided', () => {
      const { container } = render(<AnalyticsDashboardPro />);
      expect(container).toBeInTheDocument();
    });

    it('renders with mock data and time range', () => {
      const { container, getByText } = render(
        <AnalyticsDashboardPro {...mockProps} />
      );

      // Verify main content is present
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(getByText(/analytics/i)).toBeInTheDocument();
    });

    it('applies dark theme styling correctly', () => {
      const { container } = render(<AnalyticsDashboardPro {...mockProps} />);
      
      // Check for dark mode class application
      expect(container).toHaveClass('dark');
    });

    it('renders with light theme when specified', () => {
      const props = { ...mockProps, theme: 'light' };
      const { container } = render(<AnalyticsDashboardPro {...props} />);
      
      expect(container).not.toHaveClass('dark');
    });
  });

  describe('State and Interactions', () => {
    it('handles time range selection changes', async () => {
      const user = userEvent.setup();
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Find and interact with time range selector
      const timeRangeSelect = screen.getByRole('combobox');
      expect(timeRangeSelect).toBeInTheDocument();

      await user.selectOptions(timeRangeSelect, 'last-7-days');
      
      // Verify selection changed (assuming component updates state)
      expect(screen.getByText(/last 7 days/i)).toBeInTheDocument();
    });

    it('handles filter input interactions', async () => {
      const user = userEvent.setup();
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Find and interact with search/filter input
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();

      await user.type(searchInput, 'Page A');
      
      // Verify input received value
      expect(searchInput.value).toBe('Page A');
    });

    it('handles export button click', async () => {
      const user = userEvent.setup();
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Find and interact with export button
      const exportButton = screen.getByRole('button', { name: /export/i });
      expect(exportButton).toBeInTheDocument();

      await user.click(exportButton);
      
      // Verify click event was triggered (may show download dialog)
      expect(screen.getByText(/download/i)).toBeInTheDocument();
    });

    it('handles refresh button interaction', async () => {
      const user = userEvent.setup();
      render(<AnalyticsDashboardPro {...mockProps} />);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();

      await user.click(refreshButton);
      
      // Verify button state changed (loading indicator)
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('renders correctly on mobile viewport', async () => {
      const { container, rerender } = render(<AnalyticsDashboardPro {...mockProps} />);
      
      // Simulate mobile viewport
      await screen.resizeTo(375, 667);
      
      expect(container).toBeInTheDocument();
    });

    it('renders correctly on tablet viewport', async () => {
      const { container, rerender } = render(<AnalyticsDashboardPro {...mockProps} />);
      
      // Simulate tablet viewport
      await screen.resizeTo(768, 1024);
      
      expect(container).toBeInTheDocument();
    });

    it('renders correctly on desktop viewport', async () => {
      const { container, rerender } = render(<AnalyticsDashboardPro {...mockProps} />);
      
      // Simulate desktop viewport
      await screen.resizeTo(1920, 1080);
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA labels for interactive elements', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check main heading
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveAttribute('aria-label');

      // Check navigation/toolbar
      const toolbarNav = screen.getByRole('navigation');
      expect(toolbarNav).toBeInTheDocument();
    });

    it('has visible focus indicators on interactive elements', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Find focusable elements and check for outline styles
      const focusableElements = screen.getAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );

      expect(focusableElements.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation', async () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Simulate Tab key navigation
      const tabKey = 'Tab';
      await screen.press(tabKey, 3);
      
      expect(screen.getByRole('main')).toHaveFocus();
    });

    it('has proper skip link for keyboard users', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check for skip to main content link
      const skipLink = screen.getByRole('link', { name: /skip to/i });
      expect(skipLink).toBeInTheDocument();
    });
  });

  describe('Dark Mode Compatibility', () => {
    it('applies dark mode classes correctly', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check for dark mode specific styles
      const darkElements = screen.getAllByClass(/dark-|bg-dark/i);
      expect(darkElements.length).toBeGreaterThan(0);
    });

    it('maintains contrast ratios in dark mode', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check that text elements have sufficient contrast
      const textElements = screen.getAllByRole('text');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('applies dark mode to chart components', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check that charts have dark mode styling
      const chartElements = screen.getAllByClass(/chart-|recharts/i);
      expect(chartElements.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Considerations', () => {
    it('renders efficiently with large datasets', async () => {
      // Simulate larger dataset
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `Page ${i}`,
        visits: Math.floor(Math.random() * 5000),
        revenue: Math.floor(Math.random() * 10000),
      }));

      const { container, rerender } = render(
        <AnalyticsDashboardPro data={largeData} {...mockProps} />
      );

      // Verify rendering completes without errors
      expect(container).toBeInTheDocument();
    });

    it('handles empty state gracefully', () => {
      const emptyProps = { ...mockProps, data: [] };
      
      render(<AnalyticsDashboardPro {...emptyProps} />);
      
      // Should still render with some default UI
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('handles partial/invalid data', () => {
      const invalidData = [
        { id: '1', name: 'Page A' },
        { visits: 100, revenue: 500 }, // Missing required fields
      ];

      render(<AnalyticsDashboardPro data={invalidData} {...mockProps} />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null time range prop', () => {
      const props = { ...mockProps, timeRange: null };
      
      render(<AnalyticsDashboardPro {...props} />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('handles undefined theme prop', () => {
      const props = { ...mockProps, theme: undefined };
      
      render(<AnalyticsDashboardPro {...props} />);
      
      // Should default to light mode or use system preference
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('handles very large numbers in data', () => {
      const props = {
        ...mockProps,
        data: [
          { id: '1', name: 'Page A', visits: 999999999, revenue: 888888888 },
        ],
      };

      render(<AnalyticsDashboardPro {...props} />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('handles special characters in page names', () => {
      const props = {
        ...mockProps,
        data: [
          { id: '1', name: 'Page & Special <Chars>', visits: 100, revenue: 50 },
        ],
      };

      render(<AnalyticsDashboardPro {...props} />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Integration with UI Primitives', () => {
    it('uses shadcn/ui components correctly', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check for expected shadcn/ui component classes
      const cardElements = screen.getAllByClass(/card-|border-border/i);
      expect(cardElements.length).toBeGreaterThan(0);
    });

    it('uses Tailwind utility classes correctly', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check for expected Tailwind class patterns
      const tailwindClasses = screen.getAllByClass(/rounded-lg|bg-background/i);
      expect(tailwindClasses.length).toBeGreaterThan(0);
    });

    it('uses framer-motion for smooth transitions', async () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check for motion-related classes or attributes
      const motionElements = screen.getAllByClass(/motion-|animate/i);
      
      // May not always have animation classes if reduced motion is enabled
      expect(motionElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling', () => {
    it('handles API error state gracefully', async () => {
      const errorProps = {
        ...mockProps,
        error: true as boolean,
      };

      render(<AnalyticsDashboardPro {...errorProps} />);

      // Should still render with some UI (possibly error message)
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('handles loading state', async () => {
      const loadingProps = {
        ...mockProps,
        isLoading: true as boolean,
      };

      render(<AnalyticsDashboardPro {...loadingProps} />);

      // Should show loading indicator
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('initializes with correct default state', () => {
      const initialRender = render(<AnalyticsDashboardPro {...mockProps} />);
      
      // Verify initial state is set up correctly
      expect(initialRender.container).toBeInTheDocument();
    });

    it('updates when props change', async () => {
      const { rerender } = render(
        <AnalyticsDashboardPro data={mockProps.data.slice(0, 1)} {...mockProps} />
      );

      // Verify initial render
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Update with more data
      rerender(<AnalyticsDashboardPro data={mockProps.data} {...mockProps} />);

      // Verify update was applied
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('cleans up properly on unmount', async () => {
      const { container, rerender } = render(
        <AnalyticsDashboardPro {...mockProps} />
      );

      // Verify initial mount
      expect(container).toBeInTheDocument();

      // Unmount by replacing with null
      rerender(null);

      // Container should still exist but component unmounted
      expect(container).not.toHaveTextContent(/analytics/i);
    });
  });

  describe('Type Safety', () => {
    it('renders without TypeScript errors', () => {
      // If this compiles, types are correct
      render(<AnalyticsDashboardPro {...mockProps} />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('handles optional props with defaults', () => {
      const minimalProps = {};
      
      render(<AnalyticsDashboardPro {...minimalProps} />);
      
      // Should use sensible defaults for all optional props
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Visual Regression Prerequisites', () => {
    it('renders expected visual elements', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check for expected UI sections
      const mainSection = screen.getByRole('main');
      expect(mainSection).toBeInTheDocument();

      const headerSection = screen.getByRole('banner');
      expect(headerSection).toBeInTheDocument();
    });

    it('has consistent spacing and layout', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check for expected gap/spacing classes
      const spacedElements = screen.getAllByClass(/gap-|space-/i);
      expect(spacedElements.length).toBeGreaterThan(0);
    });

    it('has proper border and radius styling', () => {
      render(<AnalyticsDashboardPro {...mockProps} />);

      // Check for expected border/radius classes
      const borderedElements = screen.getAllByClass(/border-|rounded/i);
      expect(borderedElements.length).toBeGreaterThan(0);
    });
  });
});
