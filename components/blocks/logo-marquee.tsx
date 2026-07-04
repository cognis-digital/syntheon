'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';

export interface LogoMarqueeProps {
  items: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  autoPlay?: boolean;
  speed?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  size?: 'sm' | 'md' | 'lg';
  gap?: number;
}

export interface LogoMarqueeContent {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const DEFAULT_ITEMS: LogoMarqueeContent[] = [
  { src: '/images/partner-1.png', alt: 'Partner One' },
  { src: '/images/partner-2.png', alt: 'Partner Two' },
  { src: '/images/partner-3.png', alt: 'Partner Three' },
  { src: '/images/partner-4.png', alt: 'Partner Four' },
  { src: '/images/partner-5.png', alt: 'Partner Five' },
];

const DEFAULT_CONFIG = {
  autoPlay: true,
  speed: 20,
  pauseOnHover: false,
  loop: true,
  size: 'md',
  gap: 16,
};

export default function LogoMarquee({
  items = DEFAULT_ITEMS,
  autoPlay = DEFAULT_CONFIG.autoPlay,
  speed = DEFAULT_CONFIG.speed,
  pauseOnHover = DEFAULT_CONFIG.pauseOnHover,
  loop = DEFAULT_CONFIG.loop,
  size = DEFAULT_CONFIG.size,
  gap = DEFAULT_CONFIG.gap,
}: LogoMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || isPaused) return;

    let interval: NodeJS.Timeout | null = null;

    const runAnimation = () => {
      if (interval) clearInterval(interval);

      const container = document.getElementById('marquee-container');
      if (!container) return;

      const clone1 = container.cloneNode(true) as HTMLDivElement;
      const clone2 = container.cloneNode(true) as HTMLDivElement;

      clone1.style.position = 'absolute';
      clone1.style.left = '-50%';
      clone2.style.position = 'absolute';
      clone2.style.right = '-50%';

      container.appendChild(clone1);
      container.appendChild(clone2);

      const duration = 60; // seconds for full loop
      interval = setInterval(() => {
        if (!container) return;

        const width = container.offsetWidth + gap;
        clone1.style.transform = `translateX(-${width}px)`;
        clone2.style.transform = `translateX(${width}px)`;
      }, duration * 1000 / (speed * 3));
    };

    runAnimation();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, speed, gap]);

  const containerSize = size === 'sm' ? 240 : size === 'md' ? 360 : 520;
  const height = size === 'sm' ? 80 : size === 'md' ? 100 : 120;

  return (
    <div className="relative overflow-hidden bg-background rounded-lg border-border">
      <div
        id="marquee-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: containerSize,
          height,
          gap,
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => !pauseOnHover && setIsPaused(false)}
      >
        {items.map((item, index) => (
          <div key={`${item.src}-${index}`} className="flex-shrink-0">
            <img
              src={item.src}
              alt={item.alt}
              width={item.width || 120}
              height={item.height || 60}
              className="h-full object-contain"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        #marquee-container {
          animation: marquee ${speed}s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        #marquee-container:hover .clone-1,
        #marquee-container:hover .clone-2 {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
