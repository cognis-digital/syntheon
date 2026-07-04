'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface ChangelogEntry {
  version: string;
  date: string;
  type: 'release' | 'feature' | 'fix' | 'breaking' | 'deprecate';
  title: string;
  description?: string;
  links?: Array<{ label: string; href: string }>;
}

export interface ChangelogProps {
  entries: ChangelogEntry[];
  defaultTab?: 'all' | 'features' | 'fixes' | 'breaking';
  showFilters?: boolean;
  className?: string;
}

const typeColors: Record<ChangelogEntry['type'], string> = {
  release: 'bg-primary/10 text-primary border-border',
  feature: 'bg-success/10 text-success border-border',
  fix: 'bg-muted/50 text-foreground border-border',
  breaking: 'bg-destructive/10 text-destructive border-destructive/20',
  deprecate: 'bg-warning/10 text-warning border-border',
};

const typeLabels: Record<ChangelogEntry['type'], string> = {
  release: 'Release',
  feature: 'Feature',
  fix: 'Fix',
  breaking: 'Breaking Change',
  deprecate: 'Deprecation',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'none',
    transition: {
      duration: 0.4,
      ease: [0.2, 0.8, 0.2, 1],
    },
  },
};

const headerVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function Changelog({ entries = [], defaultTab = 'all', showFilters = true, className }: ChangelogProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const filteredEntries = React.useMemo(() => {
    switch (activeTab) {
      case 'features': return entries.filter(e => e.type === 'feature');
      case 'fixes': return entries.filter(e => e.type === 'fix');
      case 'breaking': return entries.filter(e => e.type === 'breaking');
      default: return entries;
    }
  }, [entries, activeTab]);

  const groupedEntries = React.useMemo(() => {
    const groups: Record<string, ChangelogEntry[]> = {};
    filteredEntries.forEach(entry => {
      if (!groups[entry.date]) groups[entry.date] = [];
      groups[entry.date].push(entry);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filteredEntries]);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 1], [-50, 0]);

  return (
    <motion.div
      className={cn('relative min-h-screen bg-background text-foreground', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[15%] -left-[10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-[15%] -right-[10%] w-[25%] h-[25%] rounded-full bg-primary/3 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div style={{ y: headerY }} variants={headerVariants}>
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Changelog
          </h1>

          {showFilters && (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-12">
              <TabsList className="bg-muted/50 backdrop-blur-sm border border-border rounded-xl p-1.5 shadow-sm">
                {['all', 'features', 'fixes', 'breaking'].map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 rounded-lg px-4 py-2.5 text-sm font-medium">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          <div className="space-y-8">
            {groupedEntries.map(([date, entries]) => (
              <motion.div key={date} variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <span className="text-primary/70">{formatDate(date)}</span>
                  <div className="flex-1" />
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs bg-muted/50 border-border">
                    {entries.length} entries
                  </Badge>
                </h2>

                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 + 0.2 }}
                    >
                      <Card className="bg-background/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
                        <CardContent className="p-5 md:p-6">
                          <div className="flex items-start gap-4">
                            <motion.div
                              className={cn(
                                'w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0',
                                entry.type === 'breaking' ? 'bg-destructive' :
                                  entry.type === 'feature' ? 'bg-success' :
                                    entry.type === 'fix' ? 'bg-muted/50' : 'bg-primary'
                              )}
                              whileHover={{ scale: 1.2 }}
                              transition={{ duration: 0.2 }}
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <h3 className={cn('font-medium text-lg leading-tight group-hover:text-primary transition-colors duration-200', entry.type === 'breaking' ? 'text-destructive/90' : '')}>
                                  {entry.title}
                                </h3>

                                {entry.type !== 'release' && (
                                  <Badge variant="outline" className={cn(
                                    'rounded-full px-2.5 py-0.5 text-xs border',
                                    typeColors[entry.type]
                                  )}>
                                    {typeLabels[entry.type]}
                                  </Badge>
                                )}

                                <span className="text-muted-foreground/60 text-sm ml-auto">
                                  v{entry.version}
                                </span>
                              </div>

                              {entry.description && (
                                <p className={cn('text-sm leading-relaxed', entry.type === 'breaking' ? 'text-destructive/80' : '')}>
                                  {entry.description}
                                </p>
                              )}

                              {entry.links && entry.links.length > 0 && (
                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                                  {entry.links.map((link, i) => (
                                    <a
                                      key={i}
                                      href={link.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group/link"
                                    >
                                      <span className="inline-block w-1 h-1 rounded-full bg-current opacity-50 group-hover/link:opacity-100 transition-opacity" />
                                      {link.label}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Hover action */}
                            <motion.div
                              className="hidden md:flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              whileHover={{ scale: 1.05 }}
                            >
                              {entry.type === 'breaking' && (
                                <Button size="sm" variant="destructive" className="rounded-full h-9 px-4 text-xs">
                                  Review
                                </Button>
                              )}
                              {entry.type === 'feature' && (
                                <Button size="sm" variant="outline" className="rounded-full h-9 px-4 text-xs bg-muted/30 border-border">
                                  View Demo
                                </Button>
                              )}
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {entries.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8 text-muted-foreground/60"
                    >
                      No {activeTab} entries found.
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {groupedEntries.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No changelog entries</h3>
                <p className="text-sm max-w-md mx-auto">
                  The team hasn't published any releases yet. Check back later for updates!
                </p>
              </motion.div>
            )}

            {/* Footer CTA */}
            {groupedEntries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupedEntries[groupedEntries.length - 1].length * 0.03 + 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-muted/30 to-background border border-border"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%238b5cf6\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M30 60c14.7-14.7 14.7-38.7 0-53.4S15.3-7.7 0 6.9s-14.7 38.7 0 53.4z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%2E')] opacity-50" />
                <div className="relative px-8 py-12 md:px-16 md:py-16 text-center">
                  <h3 className="text-xl font-semibold mb-3">Stay in the loop</h3>
                  <p className="text-muted-foreground/70 max-w-lg mx-auto mb-6">
                    Subscribe to our newsletter for early access, release notes, and exclusive content.
                  </p>
                  <form className="max-w-md mx-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <Input placeholder="Enter your email" type="email" className="flex-1 bg-background border-border focus-visible:ring-primary/50" />
                    <Button className="bg-primary hover:bg-primary/90 rounded-xl px-6 py-2.5 font-medium">
                      Subscribe
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>

          {/* Smooth scroll indicator */}
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 px-4 py-2.5 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupedEntries.length * 0.03 + 0.6, duration: 0.5 }}
          >
            <div className="w-2 h-2 rounded-full bg-primary/70" />
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Parallax accent */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none"
        style={{ backgroundPositionY: useTransform(scrollYProgress, [0, 1], ['0%', '50%']) }}
      />
    </motion.div>
  );
}

export default Changelog;
