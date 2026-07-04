'use client';

import { cn } from '@/lib/utils';
import { type ReactNode, type ButtonProps, type HTMLAttributes } from 'react';

export interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string | ReactNode;
  date?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
}

export interface TimelineProps {
  items: TimelineItemProps[];
  reverse?: boolean;
  className?: string;
}

const defaultItems: TimelineItemProps[] = [
  {
    title: 'AI Model Training',
    description: 'Fine-tuning transformer architecture on domain-specific datasets with distributed computing.',
    date: 'Week 1-2',
    icon: <span className="text-violet-400">🧠</span>,
    badge: <span className="bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full text-xs">Phase 1</span>,
    isActive: false,
    isCompleted: true,
  },
  {
    title: 'Interface Design',
    description: 'Building responsive UI with Next.js 15 App Router and Tailwind CSS semantic tokens.',
    date: 'Week 3-4',
    icon: <span className="text-violet-400">🎨</span>,
    badge: <span className="bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full text-xs">Phase 1</span>,
    isActive: true,
    isCompleted: false,
  },
  {
    title: 'Integration & Testing',
    description: 'End-to-end testing with Playwright and performance optimization for production.',
    date: 'Week 5-6',
    icon: <span className="text-violet-400">🚀</span>,
    badge: <span className="bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full text-xs">Phase 2</span>,
    isActive: false,
    isCompleted: false,
  },
];

export default function Timeline({ items = defaultItems, reverse = false, className }: TimelineProps) {
  const reversedItems = reverse ? [...items].reverse() : items;

  return (
    <div className={cn('relative space-y-4', className)}>
      {/* Connecting line */}
      <div 
        aria-hidden="true"
        className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"
      />

      {reversedItems.map((item, index) => (
        <TimelineItem key={index} item={item} index={index} isLast={index === reversedItems.length - 1} />
      ))}
    </div>
  );
}

function TimelineItem({ 
  item, 
  index, 
  isLast,
}: { 
  item: TimelineItemProps; 
  index: number; 
  isLast: boolean; 
}) {
  const isActive = item.isActive || (item.isCompleted && !isLast);
  
  return (
    <div className="relative pl-16 group">
      {/* Connector dot */}
      <span 
        aria-hidden="true"
        className={cn(
          'absolute left-3 top-0 w-4 h-4 rounded-full border-2 bg-background transition-colors duration-300',
          isActive ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-border',
        )}
      />

      {/* Content card */}
      <div 
        role="listitem"
        aria-label={item.title}
        tabIndex={isActive ? 0 : -1}
        className={cn(
          'relative rounded-lg border p-4 transition-all duration-300 hover:border-violet-500/50 focus-within:border-violet-500',
          isActive 
            ? 'bg-background border-violet-500/20 shadow-sm' 
            : 'bg-muted/30 border-border',
        )}
      >
        <div className="flex items-start gap-4">
          {/* Icon container */}
          {item.icon && (
            <span 
              aria-hidden="true"
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-lg',
                isActive ? 'bg-violet-500/10' : 'bg-muted/50',
              )}
            >
              {item.icon}
            </span>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 
                className={cn(
                  'font-semibold text-foreground',
                  isActive ? 'text-violet-400' : '',
                )}
              >
                {item.title}
              </h3>

              {/* Active indicator */}
              {isActive && (
                <span 
                  aria-hidden="true"
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20"
                >
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Active
                </span>
              )}

              {/* Completion indicator */}
              {item.isCompleted && !isActive && (
                <span 
                  aria-hidden="true"
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"
                >
                  ✓ Complete
                </span>
              )}

              {/* Custom badge */}
              {item.badge && <div className="ml-auto">{item.badge}</div>}
            </div>

            {/* Description */}
            {item.description && (
              <p 
                className={cn(
                  'mt-1.5 text-sm',
                  isActive ? 'text-muted-foreground' : 'text-muted/60',
                )}
              >
                {item.description}
              </p>
            )}

            {/* Date */}
            {item.date && (
              <span 
                className={cn(
                  'inline-block mt-2 text-xs',
                  isActive ? 'text-muted/40' : 'text-muted/30',
                )}
              >
                • {item.date}
              </span>
            )}
          </div>

          {/* Focus ring for accessibility */}
          <span 
            className="absolute inset-0 rounded-lg border-2 border-violet-500 opacity-0 pointer-events-none transition-opacity"
            style={{ transform: 'translateZ(0)' }}
          />
        </div>
      </div>

      {/* Progress line to next item */}
      {!isLast && (
        <span 
          aria-hidden="true"
          className={cn(
            'absolute left-6 top-full w-0.5 h-8 bg-border transition-colors duration-300',
            isActive ? 'bg-violet-500/20' : '',
          )}
        />
      )}
    </div>
  );
}
