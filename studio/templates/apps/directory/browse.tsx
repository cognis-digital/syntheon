'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Heart,
  Share2,
  ExternalLink,
  Star,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  rating?: number;
  views: number;
  featured?: boolean;
  trending?: boolean;
}

interface BrowseProps {
  items: DirectoryItem[];
  categories: Category[];
  onSearch?: (query: string) => void;
  onFilter?: (category: string | null) => void;
  onSort?: (direction: 'asc' | 'desc') => void;
}

const DEFAULT_ITEMS: DirectoryItem[] = [
  {
    id: '1',
    title: 'Figma',
    description: 'The collaborative interface design tool.',
    image: '/images/figma.png',
    category: 'Design Tools',
    tags: ['UI/UX', 'Prototyping', 'Collaborative'],
    rating: 4.8,
    views: 125000,
    featured: true,
    trending: true,
  },
  {
    id: '2',
    title: 'Vercel',
    description: 'Frontend cloud platform for developers.',
    image: '/images/vercel.png',
    category: 'Dev Tools',
    tags: ['Hosting', 'Deployment', 'CDN'],
    rating: 4.9,
    views: 200000,
    featured: true,
  },
  {
    id: '3',
    title: 'Tailwind CSS',
    description: 'A utility-first CSS framework.',
    image: '/images/tailwind.png',
    category: 'CSS Frameworks',
    tags: ['Utility Classes', 'Responsive'],
    rating: 4.7,
    views: 180000,
  },
  {
    id: '4',
    title: 'Linear',
    description: 'A better way to build products.',
    image: '/images/linear.png',
    category: 'Project Management',
    tags: ['Productivity', 'Issue Tracking'],
    rating: 4.6,
    views: 95000,
    trending: true,
  },
  {
    id: '5',
    title: 'Notion',
    description: 'All-in-one workspace for notes and docs.',
    image: '/images/notion.png',
    category: 'Productivity',
    tags: ['Notes', 'Database'],
    rating: 4.5,
    views: 300000,
  },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All', count: 1247 },
  { id: 'design-tools', name: 'Design Tools', count: 342 },
  { id: 'dev-tools', name: 'Dev Tools', count: 568 },
  { id: 'productivity', name: 'Productivity', count: 198 },
  { id: 'cms', name: 'CMS & Headless', count: 139 },
];

function cnClassName(...classes: (string | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface BrowsePropsInterface extends BrowseProps {}

export function Browse({
  items = DEFAULT_ITEMS,
  categories = DEFAULT_CATEGORIES,
  onSearch,
  onFilter,
  onSort,
}: BrowseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return [...result].sort((a, b) => {
      if (b.trending && !a.trending) return -1;
      if (!b.trending && a.trending) return 1;
      if (a.rating !== b.rating) return sortDirection === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      return 0;
    });
  }, [items, selectedCategory, searchQuery, sortDirection]);

  const variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
    hover: {
      scale: 1.02,
      y: -4,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  const featuredItems = items.filter(item => item.featured).slice(0, 3);

  function handleScroll() {
    const progress = scrollYProgress.get();
    const y = useTransform(progress, [0, 1], [0, -50]);
    return y;
  }

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen bg-background"
      style={{ scrollYProgress }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Discover 1,247+ curated tools</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-purple-300 to-primary bg-clip-text text-transparent">
                Find Your Next Favorite Tool
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A carefully curated directory of developer tools, design resources, and productivity apps.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search tools, categories, or tags..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  className="w-full pl-14 pr-6 py-4 rounded-xl bg-background border border-border shadow-lg shadow-primary/5 focus:shadow-primary/20 focus:border-primary/50 transition-all outline-none text-lg"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <Search className="w-4 h-4 rotate-180 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Filter Pills */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2 mt-8"
            >
              {sortedCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cnClassName(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-background border border-border hover:bg-muted'
                  )}
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-48 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -left-48 bottom-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Star className="w-5 h-5 text-primary fill-primary" />
            Featured Picks
          </h2>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            View all featured →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item, index) => (
            <FeaturedCard key={item.id} item={item} delay={index * 0.15} />
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-xl font-semibold">
              {selectedCategory === 'all' ? 'All Tools' : selectedCategory}
            </h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {items.length} results
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors">
                <SortAsc className="w-4 h-4" />
                <span className="text-sm font-medium">Sort</span>
              </button>
              
              <AnimatePresence>
                {(searchQuery || selectedCategory !== 'all') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg p-2 z-50"
                  >
                    <button
                      onClick={() => setSortDirection('asc')}
                      className={cnClassName(
                        'w-full text-left px-3 py-2 rounded-md text-sm',
                        sortDirection === 'asc' && 'bg-muted font-medium'
                      )}
                    >
                      Sort by Rating (Low to High)
                    </button>
                    <button
                      onClick={() => setSortDirection('desc')}
                      className={cnClassName(
                        'w-full text-left px-3 py-2 rounded-md text-sm',
                        sortDirection === 'desc' && 'bg-muted font-medium'
                      )}
                    >
                      Sort by Rating (High to Low)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
              <button
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="List view"
              >
                <List className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {filteredItems.length} results
            </div>
          </div>
        </motion.div>

        {/* Grid Content */}
        <AnimatePresence mode='popLayout'>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => (
              <Card key={item.id} item={item} index={index} />
            ))}

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-24 text-center"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No tools found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {filteredItems.length > 0 && (
          <Pagination items={filteredItems} />
        )}
      </main>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-950/30 to-primary/10 border border-border"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%238b5cf6\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          
          <div className="relative z-10 px-8 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Submit Your Tool</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Have a tool you think deserves to be featured? Submit your application and get reviewed by our community.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-primary/30 transition-shadow"
            >
              <ExternalLink className="w-5 h-5" />
              Submit Application
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
