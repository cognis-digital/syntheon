'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
  featured: boolean;
  tags: string[];
}

interface ListingProps {
  categories: Category[];
  items: DirectoryItem[];
  onSearch?: (query: string) => void;
  onSelectCategory?: (id: string | null) => void;
  selectedCategory: string | null;
  searchQuery: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'design', name: 'Design & Creative' },
  { id: 'development', name: 'Development' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'consulting', name: 'Consulting' },
];

const DEFAULT_ITEMS: DirectoryItem[] = [
  {
    id: '1',
    title: 'Violet Studio',
    description: 'Premium design agency specializing in brand identity and digital experiences.',
    category: 'design',
    rating: 4.9,
    reviews: 287,
    image: '/images/studio-1.jpg',
    verified: true,
    featured: true,
    tags: ['Branding', 'UI/UX', 'Motion'],
  },
  {
    id: '2',
    title: 'CodeCraft Labs',
    description: 'Full-stack development team with expertise in Next.js and TypeScript.',
    category: 'development',
    rating: 4.8,
    reviews: 156,
    image: '/images/studio-2.jpg',
    verified: true,
    featured: false,
    tags: ['Next.js', 'TypeScript', 'Cloud'],
  },
  {
    id: '3',
    title: 'Growth Engine',
    description: 'Data-driven marketing agency focused on ROI and measurable results.',
    category: 'marketing',
    rating: 4.7,
    reviews: 98,
    image: '/images/studio-3.jpg',
    verified: true,
    featured: false,
    tags: ['SEO', 'PPC', 'Analytics'],
  },
];

export interface ListingProps {
  categories?: Category[];
  items?: DirectoryItem[];
  onSearch?: (query: string) => void;
  onSelectCategory?: (id: string | null) => void;
  selectedCategory: string | null;
  searchQuery: string;
}

export function Listing({
  categories = DEFAULT_CATEGORIES,
  items = DEFAULT_ITEMS,
  onSearch,
  onSelectCategory,
  selectedCategory,
  searchQuery,
}: ListingProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0], [0, -50]);

  return (
    <motion.div
      className="min-h-screen bg-background"
      style={{ background: 'linear-gradient(180deg, var(--bg-background) 0%, var(--bg-muted/50%) 100%)' }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: y1, opacity: 0.6 }}
        >
          <div className="h-[50vh] bg-gradient-to-b from-primary/20 via-background to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-primary via-violet-200 to-primary bg-[length:200%_auto] animate-shimmer">
                Find Your Perfect Partner
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Browse our curated directory of verified professionals and agencies. 
              Search by category, rating, or specialty to discover the right fit for your project.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by name, skill, or keyword..."
                  value={searchQuery}
                  onChange={(e) => onSearch?.(e.target.value)}
                  className="h-16 pl-12 pr-4 text-lg rounded-full shadow-xl border-0 focus:ring-2 focus:ring-primary/50"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  🔍
                </div>
              </div>
            </motion.div>

            {/* Quick Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              {['Verified', 'Featured', 'High Rating'].map((filter) => (
                <Button
                  key={filter}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border hover:bg-primary/10 transition-colors"
                >
                  {filter}
                </Button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-24 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Tabs value={selectedCategory} onValueChange={onSelectCategory}>
            <TabsList className="h-12 bg-muted/50 rounded-full p-1 border-border">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-5 rounded-full text-sm font-medium transition-all"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Results Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-semibold">
              {selectedCategory === 'all' ? 'All Results' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-muted-foreground">{items.length} professionals found</p>
          </div>

          <Button variant="ghost" size="sm">
            View All
          </Button>
        </motion.div>

        {/* Results Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item, index) => (
            <ListingCard
              key={item.id}
              item={item}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-muted-foreground">No results found for your search.</p>
          </motion.div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="bg-primary/5 border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of professionals who have found their perfect match through Syntheon.
          </p>
          <Button size="lg" variant="primary" className="rounded-full h-12 px-8 text-lg">
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button size="icon" variant="primary" className="h-14 w-14 rounded-full shadow-2xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Button>
      </motion.div>
    </motion.div>
  );
}

interface ListingCardProps {
  item: DirectoryItem;
  delay: number;
}

function ListingCard({ item, delay }: ListingCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full bg-card border-border hover:border-primary/30 transition-colors group overflow-hidden">
        {/* Card Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Featured Badge */}
          {item.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold"
            >
              Featured
            </motion.div>
          )}

          {/* Verified Badge */}
          {item.verified && (
            <div className="absolute top-3 right-3">
              <svg className="w-5 h-5 text-primary drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{item.rating}</span>
              <svg className="w-4 h-4 fill-yellow-500" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" size="sm" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              View Profile
            </Button>
            <Button size="sm" variant="primary" className="rounded-full h-9 px-3 text-sm">
              Contact Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default Listing;
