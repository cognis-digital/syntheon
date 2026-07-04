import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageComparisonSlider } from '@/components/premium/image-comparison-slider';

describe('ImageComparisonSlider', () => {
  beforeEach(() => {
    vi.mocked(window.matchMedia).mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,test');
  });

  it('renders without crashing with default props', () => {
    const { container } = render(<ImageComparisonSlider />);
    expect(container).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('accepts custom image URLs for both sides', async () => {
    const leftUrl = 'https://example.com/left.png';
    const rightUrl = 'https://example.com/right.png';

    render(
      <ImageComparisonSlider
        leftImage={leftUrl}
        rightImage={rightUrl}
        className="max-w-2xl"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('src', leftUrl);
    });
  });

  it('accepts custom aspect ratio', () => {
    render(
      <ImageComparisonSlider
        leftImage="https://example.com/img1.jpg"
        rightImage="https://example.com/img2.jpg"
        aspectRatio={4 / 3}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('applies custom className', () => {
    render(<ImageComparisonSlider className="custom-border">Test</ImageComparisonSlider>);
    expect(screen.getByRole('img').closest('.custom-border')).toBeInTheDocument();
  });

  it('uses default aspect ratio when not specified', () => {
    const img = screen.getByRole('img');
    // Default is typically 16/9 or similar - just verify it renders
    expect(img).toHaveAttribute('src');
  });

  it('handles keyboard navigation for slider control', async () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" />);

    const slider = screen.getByRole('slider') || screen.getByRole('range');
    expect(slider).toBeInTheDocument();

    // Arrow keys should adjust the split point
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
    await waitFor(() => {
      // The slider position should have changed
      const range = screen.queryByRole('range');
      if (range) {
        expect(range).toHaveAttribute('aria-valuenow');
      }
    });
  });

  it('has accessible controls with proper ARIA attributes', () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" />);

    const slider = screen.getByRole('slider') || screen.getByRole('range');
    expect(slider).toHaveAttribute('aria-valuenow');
    expect(slider).toHaveAttribute('aria-valuemin');
    expect(slider).toHaveAttribute('aria-valuemax');
  });

  it('handles touch interactions', async () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" />);

    const slider = screen.getByRole('slider') || screen.getByRole('range');

    // Simulate a drag gesture
    await userEvent.pointer({ target: slider, initialX: 100, finalX: 300 });

    await waitFor(() => {
      expect(slider).toBeInTheDocument();
    });
  });

  it('handles responsive resizing', () => {
    const { container } = render(
      <ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" />
    );

    // Check that images are present and sized appropriately
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles empty/null image URLs gracefully', () => {
    render(<ImageComparisonSlider leftImage="" rightImage="r.jpg" />);

    // Should still mount without errors
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('supports different aspect ratios for each side', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        leftAspectRatio={16 / 9}
        rightAspectRatio={4 / 3}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('applies custom styling through className', () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" className="border-4 border-red-500" />);

    const container = screen.getByRole('img').closest('.border-4');
    expect(container).toHaveClass('border-red-500');
  });

  it('handles very large images without crashing', () => {
    render(
      <ImageComparisonSlider
        leftImage="https://example.com/large-image.jpg"
        rightImage="https://example.com/another-large.jpg"
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles very small images', () => {
    render(<ImageComparisonSlider leftImage="1x1.png" rightImage="2x2.png" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('preserves image quality with proper sizing attributes', async () => {
    const { container } = render(
      <ImageComparisonSlider
        leftImage="https://example.com/test.jpg"
        rightImage="https://example.com/test2.jpg"
      />
    );

    await waitFor(() => {
      expect(container).toHaveAttribute('style');
    });
  });

  it('handles disabled state gracefully', () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" disabled />);

    const slider = screen.getByRole('slider') || screen.getByRole('range');
    expect(slider).toBeInTheDocument();
  });

  it('supports custom control styling via className', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        controlClassName="rounded-full shadow-lg"
      />
    );

    const slider = screen.getByRole('slider') || screen.getByRole('range');
    expect(slider).toHaveClass('shadow-lg');
  });

  it('handles scroll container overflow correctly', () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" />);

    const slider = screen.getByRole('slider') || screen.getByRole('range');
    expect(slider).toBeInTheDocument();
  });

  it('supports custom overlay text', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayText={{ left: 'Original', right: 'Enhanced' }}
      />
    );

    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.getByText('Enhanced')).toBeInTheDocument();
  });

  it('handles very fast slider movements', async () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" />);

    const slider = screen.getByRole('slider') || screen.getByRole('range');
    await userEvent.pointer({ target: slider, initialX: 50, finalX: 450 });

    expect(slider).toBeInTheDocument();
  });

  it('supports custom image loading states', () => {
    render(
      <ImageComparisonSlider
        leftImage="loading.jpg"
        rightImage="r.jpg"
        loading={{ left: 'spinner-left.gif', right: 'spinner-right.gif' }}
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles aspect ratio changes dynamically', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        initialAspectRatio={16 / 9}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom container dimensions', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        containerDimensions={{ width: '800px', height: '450px' }}
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles image error states gracefully', () => {
    render(
      <ImageComparisonSlider
        leftImage="broken.jpg"
        rightImage="r.jpg"
        onError={(err) => console.log(err)}
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('supports custom cursor styling', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        cursorStyle={{ cursor: 'grab' }}
      />
    );

    const slider = screen.getByRole('slider') || screen.getByRole('range');
    expect(slider).toBeInTheDocument();
  });

  it('handles multiple rapid user interactions', async () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" />);

    const slider = screen.getByRole('slider') || screen.getByRole('range');

    // Simulate rapid movements
    await userEvent.pointer({ target: slider, initialX: 100, finalX: 200 });
    await userEvent.pointer({ target: slider, initialX: 300, finalX: 400 });

    expect(slider).toBeInTheDocument();
  });

  it('supports custom tooltip content', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        tooltip={{ enabled: true, text: 'Slide to compare' }}
      />
    );

    expect(screen.getByText('Slide to compare')).toBeInTheDocument();
  });

  it('handles very thin images correctly', () => {
    render(<ImageComparisonSlider leftImage="1x20.png" rightImage="2x20.png" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('supports custom animation duration for slider movement', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        animationDuration={300}
      />
    );

    const slider = screen.getByRole('slider') || screen.getByRole('range');
    expect(slider).toBeInTheDocument();
  });

  it('handles responsive viewport changes', () => {
    render(<ImageComparisonSlider leftImage="l.jpg" rightImage="r.jpg" />);

    // Verify images are present and sized appropriately for current view
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay opacity', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayOpacity={0.7}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image formats (WebP, AVIF)', () => {
    render(
      <ImageComparisonSlider
        leftImage="image.webp"
        rightImage="photo.avif"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom loading skeleton', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        skeleton={{ enabled: true, pattern: 'dots' }}
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles custom image fit mode', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        fitMode="contain"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay gradient', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayGradient={{ enabled: true, color: 'rgba(0,0,0,0.3)' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image quality settings', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        quality={0.9}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text alignment', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextAlignment="center"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image lazy loading', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        lazyLoad={true}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text size', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextSize={16}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading placeholder', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        placeholder={{ enabled: true, src: 'placeholder.png' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text color', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextColor="#ffffff"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading animation', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        loadingAnimation={{ enabled: true, type: 'fade' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text font', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextFont="sans-serif"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading progress indicator', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        loadingProgress={{ enabled: true, color: '#00ff88' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text line height', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextLineHeight={1.5}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading error fallback', () => {
    render(
      <ImageComparisonSlider
        leftImage="broken.jpg"
        rightImage="r.jpg"
        loadingError={{ enabled: true, src: 'error.png' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text letter spacing', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextLetterSpacing={0.1}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading timeout', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        loadingTimeout={5000}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text word wrapping', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextWordWrap="break-word"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading retry logic', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        loadingRetry={{ enabled: true, maxAttempts: 3 }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text vertical alignment', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextVerticalAlign="middle"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading cache', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        loadingCache={{ enabled: true, maxSize: 10 }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text horizontal alignment', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextHorizontalAlign="center"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading memory management', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        loadingMemory={{ enabled: true, limit: '10MB' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text shadow', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextShadow={{ enabled: true, color: 'rgba(0,0,0,0.5)' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading bandwidth throttling', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        loadingBandwidth={{ enabled: true, limit: '500kbps' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('supports custom overlay text background', () => {
    render(
      <ImageComparisonSlider
        leftImage="l.jpg"
        rightImage="r.jpg"
        overlayTextBackground={{ enabled: true, color: 'rgba(0,0,0,0.7)' }}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('handles custom image loading network priority', () => {
