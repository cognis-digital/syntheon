'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export interface CategoryItemProps {
  id: string;
  name: string;
  description?: string;
  image: string;
  tags: string[];
  featured?: boolean;
}

interface CategoriesPageProps {
  categories: CategoryItemProps[];
  onSearch?: (query: string) => void;
  onCategoryClick?: (id: string, name: string) => void;
}

export interface CategoryFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  onApplyFilter?: () => void;
}

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({ value, prefix = '', suffix = '' }: AnimatedCounterProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);

  useInView(containerRef, { once: true }).then((inView) => {
    if (inView) {
      let target = value;
      const duration = Math.min(Math.max(value - count, 1), 3000) / 60;
      
      requestAnimationFrame(() => {
        setCount(target);
      });
    }
  });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center gap-2"
    >
      {prefix}
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {count.toLocaleString()}
      </motion.span>
      {suffix}
    </motion.div>
  );
}

function AnimatedMarquee({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState(0);

  useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
    scrollMargin: 1000,
  }).then((scroll) => {
    if (scroll.scrollY > 50) {
      setOffset(scroll.scrollY);
    } else {
      setOffset(0);
    }
  });

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ transform: `translateX(${-offset % 100}%)` }}
    >
      <div className="flex gap-8">
        {[...children, ...children].map((child, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex-shrink-0"
          >
            {child}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CategoryCard({ item }: { item: CategoryItemProps }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group relative overflow-hidden border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <motion.div
              layoutId={`image-${item.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {item.featured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute top-2 right-2"
                >
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    Featured
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {item.description || 'Explore this category'}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <motion.div
              layoutId={`image-${item.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {item.featured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute top-2 right-2"
                >
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    Featured
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-4 rounded-lg"
              >
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Add to Favorites
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FilterBar({ query, setQuery, selectedTags, setSelectedTags, onApplyFilter }: CategoryFiltersProps) {
  const filtered = React.useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.name.toLowerCase().includes(query.toLowerCase()) ||
                           (cat.description && cat.description.toLowerCase().includes(query.toLowerCase()));
      const matchesTags = selectedTags.length === 0 ||
                         cat.tags.some(tag => selectedTags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [query, selectedTags]);

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    categories.forEach(cat => cat.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="sticky top-0 z-50 border-b-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <Input
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2">
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTags(prev =>
                  prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                )}
              >
                {tag}
              </Button>
            ))}

            <Button variant="outline" size="sm" onClick={onApplyFilter}>
              Apply
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <AnimatedCounter value={filtered.length} prefix="Found " />
          <span>categories</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function CategoriesPage({ categories: initialCategories, onSearch, onCategoryClick }: CategoriesPageProps) {
  const [query, setQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<'all' | 'featured'>('all');

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const filteredCategories = React.useMemo(() => {
    let result = initialCategories;

    if (activeTab === 'featured') {
      result = result.filter(cat => cat.featured);
    } else if (query) {
      result = result.filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    return result;
  }, [initialCategories, query, activeTab]);

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    initialCategories.forEach(cat => cat.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  return (
    <motion.main
      ref={containerRef}
      style={{ opacity }}
      className="min-h-screen bg-background"
    >
      <FilterBar
        query={query}
        setQuery={(q) => {
          onSearch?.(q);
          setQuery(q);
        }}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onApplyFilter={() => setActiveTab('all')}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Browse Categories
          </h1>

          <div className="flex gap-2">
            <Button
              variant={activeTab === 'all' ? 'secondary' : 'outline'}
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
            <Button
              variant={activeTab === 'featured' ? 'secondary' : 'outline'}
              onClick={() => setActiveTab('featured')}
            >
              Featured
            </Button>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-muted-foreground"
          >
            <p className="text-lg">No categories found matching your criteria.</p>
            <Button variant="outline" onClick={() => { setQuery(''); setActiveTab('all'); }}>
              Clear filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCategories.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.4 }}
              >
                <CategoryCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredCategories.length > 0 && (
          <AnimatedMarquee className="mt-16">
            {[...initialCategories, ...initialCategories].map((cat, i) => (
              <Card key={i} className="flex-shrink-0 border-border bg-card hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onCategoryClick?.(cat.id, cat.name)}>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {cat.tags[0]}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </AnimatedMarquee>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filteredCategories.length * 0.05 + 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {filteredCategories.length} categories loaded • 
            <span className="font-medium text-foreground">
              {' '}
              {allTags.length} unique tags available
            </span>
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: filteredCategories.length * 0.05 + 0.7, duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"
      />
    </motion.main>
  );
}

// Sample data for preview/rendering
const categories: CategoryItemProps[] = [
  { id: '1', name: 'Design & UI', description: 'UI design tools, prototyping software, and visual assets', image: '/images/design-ui.jpg', tags: ['design', 'ui/ux', 'prototyping'], featured: true },
  { id: '2', name: 'Development Tools', description: 'IDEs, debuggers, build systems, and developer utilities', image: '/images/dev-tools.jpg', tags: ['development', 'ide', 'debugging'] },
  { id: '3', name: 'Cloud & DevOps', description: 'Cloud platforms, CI/CD pipelines, container orchestration', image: '/images/cloud-devops.jpg', tags: ['cloud', 'devops', 'containers'], featured: true },
  { id: '4', name: 'Data & Analytics', description: 'Databases, analytics platforms, data visualization tools', image: '/images/data-analytics.jpg', tags: ['data', 'analytics', 'visualization'] },
  { id: '5', name: 'Security', description: 'Encryption, authentication, security testing tools', image: '/images/security.jpg', tags: ['security', 'encryption', 'authentication'], featured: true },
  { id: '6', name: 'Mobile Development', description: 'Cross-platform frameworks, mobile SDKs, app builders', image: '/images/mobile-dev.jpg', tags: ['mobile', 'ios', 'android'] },
];

export interface CategoriesPageWithDefaultProps extends CategoriesPageProps {
  categories?: CategoryItemProps[];
}

export function CategoriesPageWithDefault({ categories: customCategories = categories }: CategoriesPageWithDefaultProps) {
  return <CategoriesPage categories={customCategories} />;
}
