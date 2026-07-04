'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, GitCommit, Bug, Zap, Sparkles } from 'lucide-react';

export interface ChangelogItemProps {
  version: string;
  date: Date | string;
  type: 'release' | 'feature' | 'bugfix' | 'improvement';
  title: string;
  description?: string;
  highlights?: string[];
  downloadUrl?: string;
}

export interface ChangelogListProps {
  items: ChangelogItemProps[];
  showDownloadLinks?: boolean;
  compact?: boolean;
  className?: string;
  onVersionClick?: (version: string) => void;
}

const typeConfig = {
  release: { label: 'Release', icon: GitCommit, color: 'bg-primary' },
  feature: { label: 'Feature', icon: Zap, color: 'bg-accent' },
  bugfix: { label: 'Bug Fix', icon: Bug, color: 'bg-destructive/10' },
  improvement: { label: 'Improvement', icon: Sparkles, color: 'bg-muted' },
};

const typeOrder = ['release', 'feature', 'improvement', 'bugfix'] as const;

function formatDate(date: Date | string): string {
  if (typeof date === 'string') return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getTypeConfig(type: ChangelogItemProps['type']): { label: string; icon: React.ComponentType<any>; color: string } {
  const config = typeConfig[type];
  return config || typeConfig.improvement;
}

export default function ChangelogList({ items, showDownloadLinks = false, compact = false, className, onVersionClick }: ChangelogListProps) {
  const groupedItems: Record<string, ChangelogItemProps[]> = {};

  items.forEach((item) => {
    if (!groupedItems[item.version]) {
      groupedItems[item.version] = [];
    }
    groupedItems[item.version].push(item);
  });

  return (
    <div className={cn('space-y-6', compact ? 'py-4' : 'py-8', className)}>
      {Object.entries(groupedItems)
        .sort(([a], [b]) => typeOrder.indexOf(a as any) - typeOrder.indexOf(b as any))
        .map(([version, versionItems]) => (
          <Card key={version} className="overflow-hidden border-border/50 bg-background">
            <CardHeader className="bg-muted/30 py-4 px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                    {version}
                    <Badge variant="secondary" className="ml-2 h-5 px-2.5 text-xs">
                      {formatDate(versionItems[0].date)}
                    </Badge>
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onVersionClick?.(version)}
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                  aria-label={`View details for version ${version}`}
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-3">
              {compact ? (
                versionItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 py-2 border-b last:border-0 border-border/50">
                    <span className="mt-1.5 h-4 w-4 flex-shrink-0" aria-hidden>
                      <getTypeConfig(item.type).icon className={`h-4 w-4 ${typeConfig[item.type].color}`} />
                    </span>
                    <div className="flex-1">
                      <p className={cn('text-sm', compact ? 'leading-tight' : '')}>
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {versionItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 py-3 border-b last:border-0 border-border/50">
                      <span className="mt-1 h-6 w-6 flex-shrink-0 rounded-full bg-primary/10" aria-hidden>
                        <getTypeConfig(item.type).icon className={`h-3.5 w-3.5 ${typeConfig[item.type].color.replace('/10', '')}`} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-medium text-sm leading-tight', compact ? 'text-muted-foreground' : 'text-primary')}>
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {!compact && versionItems.length > 3 && (
                    <Button variant="ghost" size="sm" className="mt-4 h-8 px-4 text-sm">
                      View all {versionItems.length} updates
                      <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  )}
                </>
              )}

              {showDownloadLinks && !compact && (
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">{versionItems[0].title}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={versionItems[0].downloadUrl || '#'} className="flex items-center gap-2">
                      Download {version}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

      {Object.keys(groupedItems).length === 0 && (
        <Card className="bg-muted/20">
          <CardContent className="p-8 text-center text-muted-foreground">
            No changelog entries found.
          </CardContent>
        </Card>
      )}

      {items.length > 0 && !compact && (
        <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-t border-border/50">
          <p className="text-sm text-muted-foreground">Showing {items.length} update{items.length !== 1 ? 's' : ''}</p>
          <Button variant="ghost" size="sm">
            View all changelog
            <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

ChangelogList.displayName = 'ChangelogList';
