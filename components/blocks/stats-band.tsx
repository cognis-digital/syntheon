'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type React from 'react';

export interface StatsBandProps {
  title?: string;
  subtitle?: string;
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
  }>;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

const DEFAULT_TITLE = 'Build AI Apps Faster';
const DEFAULT_SUBTITLE = 'Join thousands of developers shipping production-ready AI applications.';
const DEFAULT_CTA_TEXT = 'Start Building Free';
const DEFAULT_CTA_URL = '#get-started';

export default function StatsBand({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  stats: customStats,
  ctaText = DEFAULT_CTA_TEXT,
  ctaUrl = DEFAULT_CTA_URL,
  className,
}: StatsBandProps) {
  const defaultStats = [
    {
      label: 'Active Developers',
      value: '50K+',
      change: '+23%',
      trend: 'up',
    },
    {
      label: 'AI Models Integrated',
      value: '120+',
      change: '+45 models this month',
      trend: 'neutral',
    },
    {
      label: 'Production Deployments',
      value: '8.2M',
      change: '+31%',
      trend: 'up',
    },
  ];

  const displayStats = customStats.length > 0 ? customStats : defaultStats;

  return (
    <section className={cn('relative overflow-hidden py-16 md:py-24 bg-background', className)}>
      {/* Decorative gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-violet-50/30 via-transparent to-transparent" />
        <div className="absolute left-0 top-0 h-full w-96 bg-gradient-to-r from-violet-200/10 to-transparent blur-3xl opacity-40" />
        <div className="absolute right-0 bottom-0 h-96 w-96 bg-gradient-to-tl from-violet-200/15 to-transparent blur-3xl opacity-30" />
      </div>

      {/* Content container */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          {title && (
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid gap-6 md:gap-8 mb-12 md:mb-16">
          {displayStats.map((stat, index) => (
            <Card key={index} className={cn('bg-card border-border hover:border-violet-500/30 transition-colors duration-300', 'shadow-sm')}>
              <CardContent className="p-6 md:p-8 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  {stat.icon && (
                    <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center', 'bg-violet-50 dark:bg-violet-950/30')}>
                      <span className="text-violet-600 dark:text-violet-400">
                        {stat.icon}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={cn('font-semibold text-foreground', 'truncate')}>
                      {stat.label}
                    </p>
                    <p className={cn('text-sm text-muted-foreground mt-1', 'truncate')}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : String(stat.value)}
                    </p>
                  </div>
                </div>

                {/* Change indicator */}
                {stat.change && (
                  <Badge variant="outline" className={cn('gap-1', 'border-violet-500/20')}>
                    <span className={cn('text-xs font-medium', stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : stat.trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-violet-600 dark:text-violet-400')}>
                      {stat.change}
                    </span>
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-4">
          <Button asChild size="lg" variant="default" className={cn('h-12 px-8', 'bg-violet-600 hover:bg-violet-700 text-white')}>
            <a href={ctaUrl} className="flex items-center gap-2">
              {ctaText}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </Button>

          <p className={cn('text-sm text-muted-foreground', 'mt-2')}>
            No credit card required · Free forever for individuals
          </p>
        </div>
      </div>
    </section>
  );
}
