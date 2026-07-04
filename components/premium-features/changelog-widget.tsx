'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown, ArrowUpRight, Calendar, Tag, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ChangelogEntry {
  version: string;
  date: string;
  description: string;
  changes?: Array<{ type: 'feature' | 'bugfix' | 'improvement' | 'breaking'; message: string }>;
  links?: Array<{ label: string; url: string; icon?: React.ReactNode }>;
}

export interface ChangelogWidgetProps {
  entries: ChangelogEntry[];
  defaultOpenVersionIndex?: number;
  showAllChanges?: boolean;
  onDownload?: (version: string) => void;
  onLinkClick?: (url: string, label: string) => void;
}

const versionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function ChangelogWidget({
  entries,
  defaultOpenVersionIndex = 0,
  showAllChanges = true,
  onDownload,
  onLinkClick,
}: ChangelogWidgetProps) {
  const [openVersionIndex, setOpenVersionIndex] = React.useState(defaultOpenVersionIndex);

  const toggleVersion = (index: number) => {
    setOpenVersionIndex(openVersionIndex === index ? -1 : index);
  };

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-primary flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary/70" />
              Release Notes
            </CardTitle>
            <CardDescription className="text-muted-foreground max-w-md">
              Stay updated with our latest improvements, features, and fixes.
            </CardDescription>
          </div>
          {entries.length > 5 && (
            <Button variant="outline" size="sm" asChild>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              View All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.version}
            variants={versionVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className="overflow-hidden"
          >
            <div
              onClick={() => toggleVersion(index)}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200',
                openVersionIndex === index
                  ? 'bg-primary/5 border-border hover:bg-primary/10'
                  : 'hover:bg-muted/50 border-transparent hover:border-border/30'
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm',
                  openVersionIndex === index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {entry.version}
                </span>
                <div className="space-y-1">
                  <p className={cn(
                    'font-medium',
                    openVersionIndex === index ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    Release Notes for v{entry.version}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={openVersionIndex === index ? 'expanded' : 'collapsed'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </AnimatePresence>
            </div>

            {openVersionIndex === index && (
              <motion.div
                initial={contentVariants.hidden}
                animate={contentVariants.visible}
                className="pl-16 pr-4 py-4 border-t border-border/50"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  {entry.description}
                </p>

                {showAllChanges && entry.changes?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      What's New
                    </h4>
                    <ul className="space-y-1">
                      {entry.changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Badge variant="outline" className="shrink-0 mt-0.5">
                            {change.type}
                          </Badge>
                          <span className="text-muted-foreground">{change.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {entry.links?.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.links.map((link, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          size="sm"
                          onClick={() => onLinkClick?.(link.url, link.label)}
                          className="gap-1.5 hover:bg-primary/10 hover:text-primary"
                        >
                          {link.icon ? (
                            <span className="h-3 w-3">{link.icon}</span>
                          ) : null}
                          {link.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {onDownload && (
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <Button variant="outline" size="sm" onClick={() => onDownload(entry.version)}>
                      <Download className="h-3.5 w-3.5 mr-2" />
                      Download Release {entry.version}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}

        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            No release notes available yet.
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

const mockEntries: ChangelogEntry[] = [
  {
    version: '2.4.0',
    date: new Date().toISOString(),
    description: 'A major release introducing our new design system and performance improvements.',
    changes: [
      { type: 'feature', message: 'New violet design tokens with full dark mode support' },
      { type: 'improvement', message: '30% faster initial page loads' },
      { type: 'bugfix', message: 'Fixed z-index stacking issues in modals' },
    ],
    links: [
      { label: 'GitHub Release Notes', url: '#', icon: <ExternalLink className="h-3.5 w-3.5" /> },
      { label: 'Changelog.md', url: '/docs/changelog', icon: <Tag className="h-3.5 w-3.5" /> },
    ],
  },
  {
    version: '2.3.1',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    description: 'A quick bugfix release addressing critical stability issues.',
    changes: [
      { type: 'bugfix', message: 'Resolved memory leak in long-running sessions' },
      { type: 'improvement', message: 'Improved error handling for network requests' },
    ],
  },
  {
    version: '2.3.0',
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    description: 'Introducing real-time collaboration features and enhanced accessibility.',
    changes: [
      { type: 'feature', message: 'Real-time cursor presence for team members' },
      { type: 'improvement', message: 'WCAG 2.2 AA compliance improvements' },
      { type: 'breaking', message: 'Migrated to Next.js 15 App Router' },
    ],
  },
];

ChangelogWidget.displayName = 'ChangelogWidget';
