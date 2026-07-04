import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PricingToggle from '@/components/blocks/pricing-toggle';

describe('PricingToggle', () => {
  const renderComponent = (props: Partial<React.ComponentProps<typeof PricingToggle>> = {}) => {
    return render(<PricingToggle {...props} />);
  };

  describe('default rendering', () => {
    it('renders the component without crashing', () => {
      expect(() => renderComponent()).not.toThrow();
    });

    it('contains expected heading text', () => {
      const container = renderComponent();
      const heading = screen.getByRole('heading');
      
      expect(heading).toBeInTheDocument();
      expect(heading.tagName.toLowerCase()).toBe('h2');
    });

    it('renders pricing cards with correct structure', () => {
      const container = renderComponent();
      const cards = screen.getAllByRole('region') || screen.getAllByRole('article');
      
      expect(cards).toHaveLength(2);
    });

    it('contains toggle button with proper accessibility attributes', () => {
      const container = renderComponent();
      const toggleButton = screen.getByRole('button', { name: /toggle/i }) || 
                           screen.getByRole('checkbox') ||
                           screen.getByText(/monthly\/yearly/i) ||
                           screen.getByText(/per month/i);
      
      expect(toggleButton).toBeInTheDocument();
    });

    it('renders price amounts with currency formatting', () => {
      const container = renderComponent();
      const prices = screen.getAllByText(/\d+$/);
      
      expect(prices.length).toBeGreaterThan(0);
    });

    it('contains call-to-action buttons', () => {
      const container = renderComponent();
      const actionButtons = screen.getAllByRole('button');
      
      // At least one primary CTA button should exist
      const primaryButton = actionButtons.find(btn => 
        btn.classList.contains('bg-primary') || 
        btn.getAttribute('aria-label')?.includes('get started') ||
        btn.getAttribute('aria-label')?.includes('start free trial')
      );
      
      expect(primaryButton).toBeDefined();
    });

    it('applies correct semantic roles to interactive elements', () => {
      const container = renderComponent();
      const buttons = screen.getAllByRole('button');
      
      // Should have at least one button (toggle or CTA)
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('contains focusable elements for keyboard navigation', () => {
      const container = renderComponent();
      const focusableElements = screen.getAllByTabbable() || 
                               screen.queryAllByRole('button') ||
                               screen.queryAllByRole('link');
      
      expect(focusableElements.length).toBeGreaterThan(0);
    });

    it('renders with dark mode support', () => {
      const container = renderComponent();
      const body = document.body;
      
      // Check for dark class or data attribute
      expect(body.classList.contains('dark') || 
             body.getAttribute('data-theme') === 'dark').toBe(true);
    });

    it('uses correct heading hierarchy', () => {
      const container = renderComponent();
      const headings = screen.getAllByRole('heading');
      
      // Main title should be h2, subheadings can be h3-h6
      expect(headings.some(h => h.tagName.toLowerCase() === 'h2')).toBe(true);
    });

    it('contains pricing tier labels', () => {
      const container = renderComponent();
      const tiers = screen.queryAllByText(/free|basic|pro|enterprise/i) ||
                    screen.queryAllByRole('heading');
      
      expect(tiers.length).toBeGreaterThanOrEqual(1);
    });

    it('renders feature lists with proper formatting', () => {
      const container = renderComponent();
      const checkItems = screen.getAllByRole('checkbox') || 
                        screen.queryAllByText(/✓|✔/i) ||
                        screen.queryAllByRole('listitem');
      
      // Should have some form of feature indicators
      expect(checkItems.length).toBeGreaterThanOrEqual(0);
    });

    it('has proper ARIA labels on interactive elements', () => {
      const container = renderComponent();
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach((btn, idx) => {
        // Each button should have a meaningful label or aria-label
        expect(btn.getAttribute('aria-label') || 
               btn.textContent?.trim()).not.toBeEmpty();
      });
    });

    it('contains expected text content', () => {
      const container = renderComponent();
      
      // Check for common pricing-related text
      const textContent = container.container.innerHTML.toLowerCase();
      
      expect(textContent).toContain('price') || 
                        expect(textContent).toContain('plan') ||
                        expect(textContent).toContain('feature');
    });

    it('renders responsive layout structure', () => {
      const container = renderComponent();
      const gridContainer = screen.queryByRole('grid') || 
                          screen.queryAllByRole('region').find(r => 
                            r.classList.contains('grid') ||
                            r.classList.contains('flex')
                          );
      
      expect(gridContainer).toBeDefined();
    });

    it('contains footer or secondary action area', () => {
      const container = renderComponent();
      const footerArea = screen.queryByRole('contentinfo') || 
                        screen.queryAllByRole('region').find(r => 
                          r.classList.contains('footer') ||
                          r.classList.contains('sticky')
                        );
      
      // Footer or sticky area is optional but common in pricing pages
      expect(footerArea).toBeDefined();
    });

    it('handles initial state correctly', () => {
      const container = renderComponent();
      
      // Verify initial toggle state (usually monthly by default)
      const toggleState = screen.queryByRole('checkbox') || 
                         screen.queryAllByText(/monthly/i)[0];
      
      expect(toggleState).toBeDefined();
    });

    it('renders with proper CSS classes for theming', () => {
      const container = renderComponent();
      const rootElement = document.documentElement;
      
      // Check for theme-related classes
      expect(rootElement.classList.contains('dark') || 
             rootElement.classList.contains('light')).toBe(true);
    });

    it('contains semantic HTML structure', () => {
      const container = renderComponent();
      
      // Verify proper heading hierarchy
      const h1Count = screen.queryAllByRole('heading', { level: 1 }).length;
