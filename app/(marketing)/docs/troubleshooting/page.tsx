'use client';

import { useInView, motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Database, 
  FileCode, 
  Globe, 
  Layers, 
  Loader2, 
  ServerCrash, 
  Zap 
} from 'lucide-react';

export interface TroubleshootingProps {
  className?: string;
}

interface SectionData {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  solutions: string[];
  relatedDocs?: string[];
}

const sections: SectionData[] = [
  {
    id: 'build-failures',
    icon: ServerCrash,
    title: 'Build Failures & Cache Issues',
    description: 'When your Next.js build hangs, fails with cryptic errors, or produces stale output.',
    solutions: [
      'Clear .next cache: `rm -rf .next` then rebuild',
      'Check for circular dependencies in imports',
      'Verify Node version matches requirements (.nvmrc)',
      'Run with verbose flag: `npm run build -- --verbose`'
    ],
    relatedDocs: ['/docs/build-reference']
  },
  {
    id: 'component-rendering',
    icon: FileCode,
    title: 'Component Not Rendering',
    description: 'Your components appear blank or throw hydration errors in production.',
    solutions: [
      'Ensure `use client` directive is present for interactive components',
      'Check for mismatched HTML attributes between server and client',
      'Verify all required props have defaults or are typed correctly',
      'Inspect browser console for hydration mismatches'
    ],
    relatedDocs: ['/docs/rendering-reference']
  },
  {
    id: 'styling-themes',
    icon: Layers,
    title: 'Styling & Theme Not Applying',
    description: 'CSS variables not updating, Tailwind classes ignored, or dark mode stuck.',
    solutions: [
      'Ensure `next.config.js` has proper class name extraction enabled',
      'Check that CSS modules are correctly configured for shadcn/ui components',
      'Verify `html.darkMode` context is properly set in root layout',
      'Clear browser cache and reload with hard refresh'
    ],
    relatedDocs: ['/docs/styling-reference']
  },
  {
    id: 'api-routes',
    icon: Globe,
    title: 'API Route Errors',
    description: 'Your API routes return 500 errors or hang indefinitely.',
    solutions: [
      'Check `app/api/` directory for syntax errors in route handlers',
      'Verify request body parsing middleware is configured',
      'Inspect server logs for stack traces and error messages',
      'Test with curl to isolate network vs. code issues'
    ],
    relatedDocs: ['/docs/api-reference']
  },
  {
    id: 'database-connections',
    icon: Database,
    title: 'Database Connection Problems',
    description: 'Queries timeout, return empty results, or throw connection errors.',
    solutions: [
      'Verify database credentials in environment variables',
      'Check connection pool settings and max connections',
      'Inspect query execution time for slow queries',
      'Review migration status with `prisma migrate status`'
    ],
    relatedDocs: ['/docs/data-layer-reference']
  },
  {
    id: 'migrations',
    icon: Clock,
    title: 'Migration Errors',
    description: 'Database migrations fail or produce schema drift.',
    solutions: [
      'Run `prisma migrate resolve --applied` to inspect applied migrations',
      'Check for conflicting migration files in the same directory',
      'Verify database version matches Prisma client requirements',
      'Consider resetting with `prisma migrate reset` if stuck'
    ],
    relatedDocs: ['/docs/data-layer-reference']
  }
];

function SectionCard({ 
  section, 
  index, 
  scrollProgress 
}: { 
  section: SectionData; 
  index: number; 
  scrollProgress: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '0px 0px 60px 0px', amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        y: 48,
        filter: 'blur(12px)' 
      }}
      animate={{ 
        opacity: isInView ? 1 : 0.7,
        y: 0,
        filter: 'blur(0px)'
      }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
        delay: index * 0.08,
        staggerChildren: true
      }}
      className={cn(
        'group relative rounded-xl border bg-background p-6 transition-all duration-500',
        'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10',
        'dark:bg-muted dark:border-border'
      )}
    >
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ 
            scale: isInView ? 1 : 0.9,
            rotate: isInView ? 0 : -5
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-primary-foreground"
        >
          <section.icon className="h-6 w-6" />
        </motion.div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {section.title}
          </h3>
          
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {section.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {section.solutions.map((solution, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"
              >
                <CheckCircle2 className="h-3 w-3 text-primary" />
                {solution}
              </motion.span>
            ))}
          </div>

          {section.relatedDocs && (
            <div className="mt-4 flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Related:</span>
              {section.relatedDocs.map((doc, i) => (
                <a 
                  key={i} 
                  href={doc}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  {doc.replace('/docs/', '')}
                </a>
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/5 text-muted-foreground group-hover:bg-primary/10"
        >
          <AlertCircle className="h-6 w-6 opacity-40 transition-opacity group-hover:opacity-70" />
        </motion.div>
      </div>

      {/* Decorative gradient accent */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: index * 0.08 + 0.4,
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
        className="absolute -right-12 top-6 h-16 w-16 rounded-full bg-primary/5 blur-3xl"
      />
    </motion.div>
  );
}

export interface TroubleshootingPageProps {
  className?: string;
}

export default function TroubleshootingPage({ 
  className 
}: TroubleshootingPageProps) {
  const [scrollY, setScrollY] = React.useState(0);
  
  const { scrollYProgress } = useScroll();
  const scrolled = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        'min-h-screen bg-background text-foreground',
        'dark:bg-muted dark:text-foreground',
        className
      )}
    >
      {/* Hero section */}
      <motion.section
        initial={{ opacity: 0, y: -48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative overflow-hidden border-b bg-background py-24 dark:bg-muted"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />

        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <Zap className="h-8 w-8" />
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Troubleshooting Guide
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto">
            Quick reference for common issues and their solutions. 
            Search below or browse by category to find what you need.
          </p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-px bg-border"
            />
            <span className="text-xs">Scroll to explore</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Search section */}
      <section className="border-b py-12 dark:border-border">
        <div className="mx-auto max-w-3xl px-6">
          <label 
            htmlFor="search" 
            className="sr-only"
          >
            Search troubleshooting topics
          </label>

          <motion.input
            id="search"
            type="text"
            placeholder="Search issues (e.g., 'build', 'theme')..."
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className={cn(
              'w-full rounded-xl border bg-background px-4 py-3 shadow-sm',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              'dark:bg-muted dark:border-border'
            )}
          />

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Found {sections.length} topics</span>
            <button 
              onClick={() => document.getElementById('search')?.focus()}
              className="text-primary underline"
            >
              Clear search
            </button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid gap-6"
        >
          {sections.map((section, index) => (
            <SectionCard 
              key={section.id}
              section={section}
              index={index}
              scrollProgress={scrolled}
            />
          ))}
        </motion.div>

        {/* Quick tips */}
        <motion.section
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 rounded-xl border bg-background p-6 dark:bg-muted"
        >
          <h2 className="text-lg font-semibold">Quick Tips</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Zap, title: 'Clear Browser Cache', desc: 'Hard refresh (Ctrl+Shift+R) can resolve rendering issues.' },
              { icon: Clock, title: 'Check Console Logs', desc: 'Browser DevTools console often reveals the root cause.' },
              { icon: ServerCrash, title: 'Restart Development Server', desc: 'Sometimes a fresh build clears stale state.' },
              { icon: Database, title: 'Verify Environment Variables', desc: 'Missing env vars can cause silent failures.' }
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.95 + i * 0.08 }}
                className="flex gap-3"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <tip.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-16 flex items-center justify-between border-t pt-8 dark:border-border"
        >
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="flex items-center gap-4">
            <a href="/docs/reference" className="text-sm text-primary hover:underline">
              Full Reference
            </a>
            <a href="/docs/feedback" className="text-sm text-primary hover:underline">
              Report an Issue
            </a>
          </div>
        </motion.footer>
      </main>

      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="fixed inset-0 -z-10 pointer-events-none"
      >
        <div 
          className="absolute left-1/2 top-1/4 h-[50vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[128px]" 
        />
        <div 
          className="absolute right-1/4 bottom-1/3 h-[40vh] w-[40vw] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/3 blur-[96px]" 
        />
      </motion.div>
    </motion.div>
  );
}
