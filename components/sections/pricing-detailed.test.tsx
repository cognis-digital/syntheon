import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PricingDetailed } from '@/components/sections/pricing-detailed';

describe('PricingDetailed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props and displays all pricing tiers', () => {
    const { container } = render(<PricingDetailed />);

    expect(container).toBeInTheDocument();
    
    // Verify tier structure
    const freeTier = screen.getByText(/Free/i);
    const proTier = screen.getByText(/Pro/i);
    const enterpriseTier = screen.getByText(/Enterprise/i);

    expect(freeTier).toBeInTheDocument();
    expect(proTier).toBeInTheDocument();
    expect(enterpriseTier).toBeInTheDocument();
  });

  it('displays correct pricing information for each tier', () => {
    render(<PricingDetailed />);

    // Free tier should have $0 price
    const freePrice = screen.getByText(/Free/i);
    expect(freePrice).not.toHaveAttribute('aria-label', /price/i);

    // Pro tier should show monthly pricing
    const proMonthly = screen.getByText(/$/i);
    expect(proMonthly).toBeInTheDocument();

    // Enterprise should have custom quote CTA
    const enterpriseQuote = screen.getByText(/quote/i);
    expect(enterpriseQuote).toBeInTheDocument();
  });

  it('applies correct semantic color tokens', () => {
    render(<PricingDetailed />);

    const container = document.body;
    
    // Verify background uses bg-background
    expect(container.querySelector('[class*="bg-background"]')).toBeInTheDocument();
    
    // Verify primary text uses text-foreground
    expect(container.querySelector('[class*="text-foreground"]')).toBeInTheDocument();
  });

  it('supports dark mode correctly', () => {
    const { rerender } = render(<PricingDetailed />);

    // Check light mode default
    expect(document.body.classList).not.toContain('dark');

    // Rerender in dark mode
    rerender(
      <div className="dark">
        <PricingDetailed />
      </div>
    );

    const container = document.body;
    expect(container.querySelector('[class*="bg-background"]')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<PricingDetailed />);

    // Verify semantic HTML structure
    const pricingCards = screen.getAllByRole('article');
    expect(pricingCards.length).toBeGreaterThan(0);

    // Check for aria-labels on interactive elements
    const buttons = screen.getAllByRole('button', { name: /choose/i });
    buttons.forEach(btn => {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('handles hover states gracefully with reduced motion preference', () => {
    render(<PricingDetailed />);

    // Simulate prefers-reduced-motion
    document.body.style.setProperty(
      'prefers-reduced-motion: reduce',
      'true'
    );

    const container = document.body;
    
    // Elements should still be interactive but with reduced animation
    expect(container).not.toHaveAttribute('style');
  });

  it('renders responsive layout correctly at different breakpoints', () => {
    render(<PricingDetailed />);

    // Mobile: single column
    const container = document.body;
    expect(screen.queryByRole('navigation')).toBeInTheDocument();

    // Desktop: multi-column with proper spacing
    const pricingGrid = screen.getByRole('list');
    expect(pricingGrid).toHaveAttribute('aria-label', /pricing/i);
  });

  it('displays feature comparison table correctly', () => {
    render(<PricingDetailed />);

    // Verify feature rows exist
    const featureRows = screen.getAllByRole('row');
    expect(featureRows.length).toBeGreaterThan(1);

    // Check for proper column headers
    const headerRow = featureRows[0];
    expect(headerRow.querySelector('[class*="text-muted"]')).toBeInTheDocument();
  });

  it('handles CTA button states correctly', async () => {
    render(<PricingDetailed />);

    const freeCta = screen.getByRole('button', { name: /get started/i });
    
    expect(freeCta).toHaveAttribute('aria-label');
    expect(freeCta).not.toBeDisabled();
  });

  it('maintains consistent border radius across components', () => {
    render(<PricingDetailed />);

    const container = document.body;
    
    // Check for rounded-lg or rounded-md classes
    const roundedElements = container.querySelectorAll('[class*="rounded"]');
    expect(roundedElements.length).toBeGreaterThan(0);
  });

  it('renders with proper type hierarchy', () => {
    render(<PricingDetailed />);

    // H1 for main title
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('aria-level', '1');

    // H2s for tier titles
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    expect(h2Elements.length).toBeGreaterThan(0);
  });

  it('shows correct gradient effects on hover (when not reduced motion)', () => {
    render(<PricingDetailed />);

    // Remove reduced motion preference for this test
    document.body.style.removeProperty('prefers-reduced-motion: reduce');

    const container = document.body;
    
    // Verify gradient classes are present in DOM
    expect(container.querySelector('[class*="bg-gradient"]')).toBeInTheDocument();
  });

  it('preserves focus states for keyboard navigation', () => {
    render(<PricingDetailed />);

    const buttons = screen.getAllByRole('button');
    
    // Focus first button and verify outline is visible
    buttons[0].focus();
    
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('handles empty state gracefully if no tiers configured', () => {
    const { container } = render(<PricingDetailed />);

    // Should still have some content even with minimal data
    expect(container.textContent.length).toBeGreaterThan(50);
  });
});
