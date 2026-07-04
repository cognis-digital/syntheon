'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface DocItemProps {
  title: string;
  description: string;
  category: string;
  date: string;
  readTime?: number;
  featured?: boolean;
}

export interface DocsPageProps {
  className?: string;
}

const categories = [
  'Getting Started',
  'Installation',
  'Configuration',
  'API Reference',
  'Components',
  'Styling',
  'Performance',
  'Deployment'
];

const featuredArticles: DocItemProps[] = [
  {
    title: 'Quick Start Guide',
    description: 'Get up and running with Syntheon in under 10 minutes.',
    category: 'Getting Started',
    date: '2024-01-15',
    readTime: 5,
    featured: true
  },
  {
    title: 'Architecture Overview',
    description: 'Understand how Syntheon is built and scaled.',
    category: 'Configuration',
    date: '2024-01-10',
    readTime: 15,
    featured: true
  },
  {
    title: 'Best Practices',
    description: 'Learn the recommended patterns for building with Syntheon.',
    category: 'Components',
    date: '2024-01-08',
    readTime: 20,
    featured: true
  }
];

const latestPosts: DocItemProps[] = [
  {
    title: 'Release Notes v2.4.0',
    description: 'New features and improvements in the latest release.',
    category: 'Announcements',
    date: '2024-01-20'
  },
  {
    title: 'Migration Guide',
    description: 'Migrating from v1.x to v2.x with minimal disruption.',
    category: 'Configuration',
    date: '2024-01-18',
    readTime: 30,
    featured: true
  },
  {
    title: 'Troubleshooting Common Issues',
    description: 'Solutions to frequently reported problems.',
    category: 'Support',
    date: '2024-01-15'
  }
];

const DocCard = ({ item, index }: { item: DocItemProps; index: number }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '0px 0px 20px 0px', amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Card className="h-full border-border bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-colors group">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <Badge variant="secondary" className="rounded-md text-xs">
              {item.category}
            </Badge>
            {item.readTime && (
              <span className="text-muted-foreground text-sm flex-shrink-0">
                {item.readTime} min read
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">{item.date}</span>
            <Button variant="ghost" size="sm" className="h-8 px-3 rounded-md group-hover:bg-primary/10">
              Read more →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SearchInput = () => {
  const [query, setQuery] = React.useState('');

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-md"
    >
      <Input
        type="search"
        placeholder="Search documentation..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-12 pl-4 pr-12 rounded-lg border-border bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </motion.form>
  );
};

const Hero = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 60]);

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity, y }}
      className="relative py-24 px-8 max-w-7xl mx-auto"
    >
      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Badge className="rounded-full px-4 py-1 text-sm">
            Documentation v2.4.0
          </Badge>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-transparent">
          Syntheon Docs
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Comprehensive documentation for building modern web applications with Syntheon. 
          Search, browse, and find what you need quickly.
        </p>

        <SearchInput />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <span>Search</span>
          <span className="w-1 h-1 rounded-full bg-primary"></span>
          <span>Browse</span>
          <span className="w-1 h-1 rounded-full bg-primary"></span>
          <span className="w-1 h-1 rounded-full bg-primary"></span>
          <span>Ask AI</span>
        </motion.div>
      </div>

      {/* Decorative gradient elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
      </div>
    </motion.section>
  );
};

const CategoriesSection = () => {
  return (
    <section className="py-16 px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        Browse by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-lg border border-border/50 bg-background/30 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm transition-all text-center"
          >
            <span className="font-medium">{category}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

const FeaturedSection = () => {
  return (
    <section className="py-16 px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        Featured Articles
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {featuredArticles.map((item, index) => (
          <DocCard key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

const LatestSection = () => {
  return (
    <section className="py-16 px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        Latest Posts
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestPosts.map((item, index) => (
          <DocCard key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

const Newsletter = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="py-20 px-8 max-w-7xl mx-auto"
    >
      <Card className="border-primary/30 bg-gradient-to-br from-background to-primary/5">
        <CardContent className="p-12 text-center space-y-6">
          <h3 className="text-2xl font-semibold">Stay Updated</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Subscribe to our newsletter for the latest documentation updates, release notes, and community highlights.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Enter your email address"
              required
              className="h-12 rounded-lg border-border bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
            />
            <Button size="lg" className="h-12 px-6 rounded-lg">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
          </p>
        </CardContent>
      </Card>
    </motion.section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-8 border-t border-border/50 bg-background/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 Syntheon. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>Built with ❤️ by the Syntheon team</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function DocsPage({ className }: DocsPageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <motion.main
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn('min-h-screen bg-background min-w-0', className)}
    >
      {/* Animated background gradient */}
      <motion.div
        style={{
          backgroundPositionX: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
          opacity: useTransform(scrollYProgress, [0, 1], [0.5, 0])
        }}
        className="fixed inset-0 -z-20 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none"
      />

      <Hero />
      <CategoriesSection />
      <FeaturedSection />
      <LatestSection />
      <Newsletter />
      <Footer />
    </motion.main>
  );
}
