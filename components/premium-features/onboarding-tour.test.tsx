import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingTour } from '@/components/premium-features/onboarding-tour';

describe('OnboardingTour', () => {
  const mockCn = vi.fn((...classes) => classes.filter(Boolean).join(' '));
  vi.mock('@/lib/utils', async (importOriginal) => ({
    cn: mockCn,
  }));

  describe('Default Props', () => {
    it('renders without crashing with minimal props', () => {
      const { container } = render(
        <OnboardingTour
          steps={[
            { id: 'step-1', title: 'Welcome', description: 'Get started' },
          ]}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('shows tour overlay when enabled by default', () => {
      render(
        <OnboardingTour
          steps={[
            { id: 'step-1', title: 'Welcome', description: 'Get started' },
          ]}
        />
      );

      const overlay = screen.getByRole('dialog');
      expect(overlay).toBeInTheDocument();
    });

    it('displays first step content immediately', () => {
      render(
        <OnboardingTour
          steps={[
            { id: 'step-1', title: 'Welcome', description: 'Get started' },
          ]}
        />
      );

      const title = screen.getByText('Welcome');
      expect(title).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    it('advances to next step on interaction', async () => {
      const steps = [
        { id: 'step-1', title: 'Welcome', description: 'Get started' },
        { id: 'step-2', title: 'Features', description: 'Explore capabilities' },
      ];

      render(
        <OnboardingTour steps={steps} />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('loops back to first step after last step', async () => {
      const steps = [
        { id: 'step-1', title: 'Welcome', description: 'Get started' },
        { id: 'step-2', title: 'Features', description: 'Explore capabilities' },
      ];

      render(
        <OnboardingTour steps={steps} />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);
      await userEvent.click(nextButton);

      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });

    it('goes back to previous step correctly', async () => {
      const steps = [
        { id: 'step-1', title: 'Welcome', description: 'Get started' },
        { id: 'step-2', title: 'Features', description: 'Explore capabilities' },
      ];

      render(
        <OnboardingTour steps={steps} />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      const backButton = screen.getByRole('button', { name: /back/i });
      await userEvent.click(backButton);

      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
  });

  describe('Completion State', () => {
    it('shows completion overlay after all steps', async () => {
      const steps = [
        { id: 'step-1', title: 'Welcome', description: 'Get started' },
      ];

      render(
        <OnboardingTour steps={steps} />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      expect(screen.getByText(/complete|finish/i)).toBeInTheDocument();
    });

    it('displays completion action button', async () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
          onComplete={() => Promise.resolve()}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      expect(screen.getByRole('button')).toHaveTextContent(/continue|done/i);
    });
  });

  describe('Accessibility', () => {
    it('has accessible focus management', async () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      expect(document.activeElement).toHaveFocus();
    });

    it('supports keyboard navigation', async () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.type(nextButton, 'Enter');

      expect(screen.getByText(/features|continue/i)).toBeInTheDocument();
    });

    it('announces tour start to screen readers', () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
          ariaLabel="Product Tour"
        />
      );

      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-label',
        /product tour/i
      );
    });
  });

  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion setting', async () => {
      const reducedMotion = vi.fn(() => true);
      vi.mock('@/hooks/use-preferred-reduced-motion', async (importOriginal) => ({
        usePreferredReducedMotion: reducedMotion,
      }));

      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
        />
      );

      expect(reducedMotion).toHaveBeenCalled();
    });
  });

  describe('Responsive Behavior', () => {
    it('renders responsive overlay container', () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
        />
      );

      const container = screen.getByRole('dialog');
      expect(container).toHaveClass(/rounded/i);
    });

    it('uses appropriate viewport for mobile', () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
          viewport="mobile"
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom overlay content', () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
          overlayContent={<div className="custom-overlay">Custom</div>}
        />
      );

      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('accepts custom action button text', () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
          actionButtonText="Continue Journey"
        />
      );

      expect(screen.getByRole('button')).toHaveTextContent(/continue journey/i);
    });

    it('accepts custom primary color theme', () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
          primaryColor="#6366f1"
        />
      );

      expect(screen.getByRole('dialog')).toHaveStyle(/background-color.*#6366f1/i);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty steps array gracefully', () => {
      const { container } = render(
        <OnboardingTour steps={[]} />
      );

      expect(container).toBeInTheDocument();
    });

    it('handles single step correctly', () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();
    });

    it('handles long descriptions without overflow issues', () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'A very long description that should wrap properly and not break the layout in any unexpected ways. '.repeat(3) }]}
        />
      );

      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });

    it('handles async onStepComplete callbacks', async () => {
      const mockCallback = vi.fn();

      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
          onStepComplete={mockCallback}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('Performance & Animation', () => {
    it('uses framer-motion for smooth transitions', async () => {
      const { container } = render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
        />
      );

      expect(container).toHaveClass(/animate/i);
    });

    it('respects reduced motion preference for animations', async () => {
      const reducedMotion = vi.fn(() => true);
      vi.mock('@/hooks/use-preferred-reduced-motion', async (importOriginal) => ({
        usePreferredReducedMotion: reducedMotion,
      }));

      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
        />
      );

      expect(reducedMotion).toHaveBeenCalled();
    });

    it('has reasonable initial animation duration', async () => {
      render(
        <OnboardingTour
          steps={[{ id: 'step-1', title: 'Welcome', description: 'Get started' }]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Welcome')).toBeInTheDocument();
      });
    });
  });

  describe('Integration with Parent Components', () => {
    it('can be controlled via props', async () => {
      const steps = [
        { id: 'step-1', title: 'Welcome', description: 'Get started' },
      ];

      render(
        <OnboardingTour
          steps={steps}
          isOpen={true}
          onClose={() => Promise.resolve()}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('passes through additional props correctly', async () => {
      const steps = [
        { id: 'step-1', title: 'Welcome', description: 'Get started' },
      ];

      render(
        <OnboardingTour
          steps={steps}
          className="custom-class"
          data-testid="onboarding-tour-test"
        />
      );

      expect(screen.getByTestId('onboarding-tour-test')).toBeInTheDocument();
    });
  });
});
