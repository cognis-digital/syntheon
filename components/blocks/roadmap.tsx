import { cn } from '@/lib/utils';
import { CheckCircle2, ArrowRight, Clock, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface RoadmapProps {
  title: string;
  subtitle?: string;
  phases: Array<{
    id: number;
    name: string;
    description: string;
    status: 'completed' | 'active' | 'upcoming';
    date: string;
    features: string[];
    highlight?: boolean;
  }>;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

export default function Roadmap({
  title = 'Product Roadmap',
  subtitle,
  phases,
  ctaText = 'View Full Timeline',
  ctaUrl = '#roadmap',
  className,
}: RoadmapProps) {
  const activePhaseIndex = phases.findIndex(p => p.status === 'active');

  return (
    <section
      className={cn(
        'relative py-24 overflow-hidden bg-background',
        className
      )}
      aria-labelledby="roadmap-title"
    >
      {/* Decorative background gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        style={{
          background: 'radial-gradient(120% 120% at 50% -20%, hsla(var(--primary), / 0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-16">
          <h2
            id="roadmap-title"
            className={cn(
              'text-3xl md:text-5xl font-bold tracking-tight',
              'text-foreground mb-4'
            )}
          >
            {title}
          </h2>

          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {phases.filter(p => p.status === 'completed').length}
              </span>
              <span className="text-sm text-muted-foreground">
                / {phases.length} phases completed
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex-1 max-w-md mx-auto h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{
                  width: `${((activePhaseIndex + 1) / phases.length) * 100}%`,
                }}
              />
            </div>

            <span className="text-sm text-muted-foreground">
              {phases[activePhaseIndex]?.status === 'upcoming'
                ? 'Up next: Coming soon'
                : `${(activePhaseIndex + 1)}/${phases.length} phases`}
            </span>
          </div>
        </header>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border"
            aria-hidden="true"
          />

          {phases.map((phase, index) => {
            const isLeft = index % 2 === 0;
            const isActive = phase.status === 'active';
            const isCompleted = phase.status === 'completed';
            const isUpcoming = phase.status === 'upcoming';

            return (
              <div
                key={phase.id}
                className="flex items-start md:items-center gap-8 mb-16"
              >
                {/* Left side - Content */}
                <div
                  className={cn(
                    'flex-1 min-w-0',
                    isLeft ? '' : 'md:flex-row-reverse'
                  )}
                >
                  <Card
                    className={cn(
                      'relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50',
                      isActive && 'ring-2 ring-primary/20 shadow-lg shadow-primary/10',
                      isCompleted && !isActive && 'opacity-75'
                    )}
                  >
                    {/* Status indicator */}
                    <div className="absolute -top-3 left-4">
                      {isCompleted ? (
                        <CheckCircle2
                          className="w-6 h-6 text-primary"
                          aria-hidden="true"
                        />
                      ) : isUpcoming ? (
                        <Clock
                          className="w-5 h-5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      ) : (
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            isActive ? 'bg-primary' : 'bg-border animate-pulse'
                          )}
                        >
                          {isActive && (
                            <ChevronUp
                              className="w-4 h-4 text-primary-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Phase content */}
                    <div className="pl-12">
                      <div className="flex items-center gap-3 mb-2">
                        {phase.highlight && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Highlight
                          </Badge>
                        )}

                        <h3
                          className={cn(
                            'text-xl font-semibold',
                            isActive ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {phase.name}
                        </h3>

                        <span
                          className={cn(
                            'px-2 py-1 text-xs rounded-full border',
                            isCompleted
                              ? 'bg-green-500/10 border-green-500/20 text-green-500'
                              : isActive
                              ? 'bg-primary/10 border-primary/30 text-primary'
                              : 'bg-muted border-border text-muted-foreground'
                          )}
                        >
                          {phase.status === 'completed'
                            ? 'Completed'
                            : phase.status === 'active'
                            ? 'In Progress'
                            : 'Upcoming'}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {phase.description}
                      </p>

                      {/* Features list */}
                      <ul className="space-y-1">
                        {phase.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2
                              className="w-3 h-3 text-primary"
                              aria-hidden="true"
                            />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Date */}
                      {phase.date && (
                        <div
                          className={cn(
                            'mt-4 pt-3 border-t',
                            isActive ? 'border-primary/20' : 'border-border'
                          )}
                        >
                          <span className="text-xs text-muted-foreground">
                            {phase.date}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Right side - Date/Status */}
                <div
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 min-w-[100px]',
                    isLeft ? '' : 'md:flex-row-reverse'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isActive || isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {phase.date || phase.status === 'upcoming' ? 'Coming soon' : 'In progress'}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'rounded-full',
                      isActive && 'bg-primary/10 text-primary hover:bg-primary/20',
                      isCompleted && !isActive && 'opacity-50'
                    )}
                  >
                    {isLeft ? (
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Bottom connector */}
          <div
            className="absolute left-8 md:left-1/2 top-full bottom-0 w-px bg-border"
            aria-hidden="true"
          />
        </div>

        {/* CTA */}
        {ctaText && (
          <div className="text-center mt-16">
            <Button asChild variant="primary">
              <a href={ctaUrl}>
                {ctaText}
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        )}

        {/* Calendar footer */}
        <footer
          className={cn(
            'mt-16 pt-8 border-t',
            isActive ? 'border-primary/20' : 'border-border'
          )}
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
              Last updated: {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>

            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Next update in
              </span>
              {isActive ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  2 weeks
                </Badge>
              ) : isUpcoming ? (
                <Badge variant="outline">Coming soon</Badge>
              ) : (
                <span className="text-muted-foreground">Completed</span>
              )}
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

export type { RoadmapProps };
