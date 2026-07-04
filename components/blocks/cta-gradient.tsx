'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface CtaGradientProps {
  title: string;
  description?: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  secondaryCtaVariant?: 'ghost' | 'outline';
  badgeText?: string;
  showBadge: boolean;
  icon?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function CtaGradient({
  title,
  description,
  primaryCtaLabel,
  secondaryCtaLabel,
  secondaryCtaUrl = '#',
  secondaryCtaVariant = 'ghost',
  badgeText,
  showBadge = false,
  icon,
  imageSrc,
  imageAlt = '',
  loading = false,
  disabled = false,
  className,
}: CtaGradientProps) {
  return (
    <Card className={cn('overflow-hidden bg-gradient-to-br from-violet-500/10 via-background to-violet-950/10', className)}>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          {/* Left content */}
          <div className="flex-1 space-y-4">
            {icon && (
              <div className="inline-flex items-center justify-center rounded-full bg-violet-500/20 p-2 text-violet-300">
                {icon}
              </div>
            )}

            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {title}
            </h2>

            {description && (
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                variant="default"
                disabled={loading || disabled}
                loading={loading}
                className="h-12 px-6 text-base font-medium bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all duration-200 hover:shadow-violet-500/30"
              >
                {primaryCtaLabel}
              </Button>

              {secondaryCtaLabel && (
                <Button
                  asChild
                  variant={secondaryCtaVariant}
                  size="lg"
                  disabled={loading || disabled}
                  className="h-12 px-6 text-base font-medium transition-all duration-200 hover:bg-violet-500/10 border-border"
                >
                  <a href={secondaryCtaUrl}>{secondaryCtaLabel}</a>
                </Button>
              )}
            </div>

            {showBadge && badgeText && (
              <Badge variant="secondary" className="mt-2">
                {badgeText}
              </Badge>
            )}
          </div>

          {/* Right image - responsive */}
          <div className="hidden lg:block w-1/3 shrink-0">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt || 'Illustration'}
                className="h-full w-full object-cover rounded-lg"
                loading="eager"
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg bg-violet-500/10">
                {icon ? (
                  icon
                ) : (
                  <span className="text-muted-foreground text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 3h5v5"/>
                      <path d="m8 9-4 7 6 3V9"/>
                      <path d="M21 15l-4-1.5L10 21 7 14.5 3 15"/>
                    </svg>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile image fallback */}
        <div className="lg:hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt || 'Illustration'}
              className="mx-auto h-48 w-full object-cover rounded-lg"
              loading="eager"
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
