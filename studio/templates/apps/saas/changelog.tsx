'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight, Calendar, GitCommit, Bug, Star, Zap, ShieldCheck, ArrowUpRight, X } from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'release' | 'feature' | 'bugfix' | 'security' | 'maintenance';
  title: string;
  description: string;
  changes?: string[];
}

const entries: ChangelogEntry[] = [
  {
    version: '2.4.0',
    date: 'December 15, 2024',
    type: 'release',
    title: 'Major Platform Update',
    description: 'A comprehensive overhaul bringing new features and improved performance.',
    changes: [
      'Redesigned dashboard with enhanced analytics',
      'New API endpoints for enterprise integrations',
      'Improved mobile responsiveness across all views',
      'Enhanced security protocols and authentication flow'
    ]
  },
  {
    version: '2.3.1',
    date: 'December 8, 2024',
    type: 'bugfix',
    title: 'Critical Bug Fixes',
    description: 'Resolved several high-priority issues reported by enterprise customers.',
    changes: [
      'Fixed data sync issue in offline mode',
      'Corrected timezone handling for scheduled tasks',
      'Improved error messages for invalid API keys'
    ]
  },
  {
    version: '2.3.0',
    date: 'November 28, 2024',
    type: 'feature',
    title: 'New Feature Release',
    description: 'Introducing powerful new capabilities for power users.',
    changes: [
      'Advanced filtering and search across all data',
      'Custom dashboard widgets with drag-and-drop',
      'Bulk operations support for admin workflows'
    ]
  },
  {
    version: '2.2.0',
    date: 'November 15, 2024',
    type: 'release',
    title: 'Stability & Performance Update',
    description: 'Under the hood improvements for faster, more reliable performance.',
    changes: [
      'Reduced initial load time by 35%',
      'Optimized database queries and caching layer',
      'Improved WebSocket connection stability'
    ]
  },
  {
    version: '2.1.0',
    date: 'November 1, 2024',
    type: 'feature',
    title: 'Collaboration Features',
    description: 'Bring your team together with new collaborative tools.',
    changes: [
      'Real-time co-editing support',
      'Team activity feeds and notifications',
      'Shared workspace templates'
    ]
  },
  {
    version: '2.0.0',
    date: 'October 18, 2024',
    type: 'release',
    title: 'Version 2.0 Launch',
    description: 'A major milestone bringing a completely new architecture and design system.',
    changes: [
      'Complete UI/UX redesign with accessibility focus',
      'Migrated to Next.js 15 App Router',
      'TypeScript strict mode across entire codebase',
      'New component library with consistent theming'
    ]
  }
];

const typeConfig = {
  release: { color: 'bg-primary text-primary-foreground', icon: Star, label: 'Release' },
  feature: { color: 'bg-accent text-accent-foreground', icon: Zap, label: 'Feature' },
  bugfix: { color: 'bg-destructive/10 text-destructive', icon: Bug, label: 'Bug Fix' },
  security: { color: 'bg-warning text-warning-foreground', icon: ShieldCheck, label: 'Security' },
  maintenance: { color: 'bg-muted text-muted-foreground', icon: GitCommit, label: 'Maintenance' }
};

function formatDate(dateStr: string): Date {
  return new Date(dateStr);
}

export interface ChangelogProps {
  className?: string;
  showSearch?: boolean;
  showVersions?: boolean;
  compact?: boolean;
}

export default function Changelog({ 
  className, 
  showSearch = true,
  showVersions = true,
  compact = false 
}: ChangelogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ChangelogEntry['type'] | 'all'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const config = typeConfig[selectedType];

  return (
    <motion.div 
      ref={containerRef}
      className={cn(
        "relative min-h-screen bg-background text-foreground",
        compact ? "py-12" : "py-24",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-16 text-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-8"
          >
            <GitCommit className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Release Notes
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest improvements, features, and fixes. 
            We're committed to delivering the best experience for every user.
          </p>
        </motion.div>

        {/* Filters */}
        <AnimatePresence mode="wait">
          {(showSearch || selectedType !== 'all') && (
            <motion.div
              key={selectedType + searchTerm}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              {showSearch && (
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search releases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-border bg-background focus-visible:ring-primary/20"
                  />
                </div>
              )}

              <div className="flex gap-2 overflow-x-auto pb-2">
                {(['all', 'release', 'feature', 'bugfix'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "h-10 px-4 capitalize",
                      selectedType === type && 
                        (type === 'release' || type === 'feature') && "bg-primary text-white border-transparent"
                    )}
                  >
                    {type === 'all' ? 'All' : type.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Changelog Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid gap-6 md:gap-8"
        >
          {filteredEntries.map((entry, index) => (
            <ChangelogEntryCard 
              key={entry.version}
              entry={entry}
              isFirst={index === 0}
              isLast={index === filteredEntries.length - 1}
              config={config}
            />
          ))}

          {filteredEntries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No releases found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Button variant="outline" size="sm">
            Subscribe to release updates
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        {/* Scroll progress indicator */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-primary/20 origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </motion.div>
  );
}

function ChangelogEntryCard({ 
  entry, 
  isFirst, 
  isLast, 
  config 
}: { 
  entry: ChangelogEntry; 
  isFirst: boolean; 
  isLast: boolean; 
  config: typeof typeConfig[typeof entry.type];
}) {
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: isFirst ? 0.6 : 0.7 + entry.version.split('.').length * 0.1,
        duration: 0.5,
        ease: [0.2, 0.8, 0.2, 1]
      }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "relative",
        isFirst && !isLast ? "rounded-t-3xl border-b-0" : "",
        isLast ? "rounded-b-3xl" : ""
      )}
    >
      <Card 
        className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-colors duration-300 overflow-hidden group"
      >
        <CardContent className="p-6 md:p-8">
          {/* Version Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className={cn(
                  "px-3 py-1 text-sm font-medium",
                  config.color
                )}>
                  {entry.version}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(entry.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              <h2 className="text-xl font-semibold tracking-tight mb-1">
                {entry.title}
              </h2>

              <p className="text-muted-foreground text-sm max-w-2xl">
                {entry.description}
              </p>
            </div>

            <div 
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                config.color.replace('bg-', 'bg-').replace('-foreground', '') || 'bg-muted'
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>

          {/* Changes List */}
          {entry.changes && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-6 pt-6 border-t border-border/50"
            >
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">What's new:</h3>
              <ul className="space-y-2">
                {entry.changes.map((change, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    <span className="text-muted-foreground">{change}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Hover Action */}
          <div 
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              isLast ? "rounded-b-3xl" : ""
            )}
          >
            <Button variant="ghost" size="sm" className="absolute bottom-4 right-4">
              View full release notes
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// State and refs need to be hoisted for the component above
let searchState: string = '';
let selectedTypeState: ChangelogEntry['type'] | 'all' = 'all';

function useChangelogState() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ChangelogEntry['type'] | 'all'>('all');

  return { searchTerm, setSearchTerm, selectedType, setSelectedType };
}

// Re-export for use elsewhere if needed
export { useChangelogState, type ChangelogProps, type ChangelogEntry };
