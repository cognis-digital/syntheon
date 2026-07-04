'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Clock, Calendar, ArrowUpRight, Heart, Share2, Bookmark, Menu, X, ChevronLeft, ChevronRight, Filter, SlidersHorizontal, Moon, Sun, Sparkles, TrendingUp, Star } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: Date;
  readTime: number;
  category: string;
  tags: string[];
  imageUrl: string;
  featured?: boolean;
  trending?: boolean;
}

interface BlogPageProps {
  posts: BlogPost[];
  categories: string[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string | null) => void;
}

const DEFAULT_CATEGORIES = ['All', 'Product', 'Design', 'Engineering', 'Company', 'Culture'];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function formatReadTime(minutes: number): string {
  if (minutes < 1) return '<1 min';
  if (minutes === 1) return '1 min read';
  return `${Math.round(minutes)} min read`;
}

export interface BlogPageProps extends BlogPageProps {}

const heroVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const cardStaggerDelay = (index: number) => index * 0.05;

export default function BlogPage({
  posts,
  categories = DEFAULT_CATEGORIES,
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'All',
  onSelectCategory,
}: BlogPageProps) {
  const [localSearch, setLocalSearch] = React.useState(searchQuery);
  const [activeTab, setActiveTab] = React.useState('featured');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scrollY = useScroll();
  const heroHeight = useTransform(
    scrollY.scrollY,
    [0, 500],
    ['12rem', '6rem']
  );

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = !localSearch || 
      post.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(localSearch.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
      (selectedCategory !== 'Featured' && selectedCategory !== 'Trending' && post.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(p => p.featured).slice(0, 3);
  const regularPosts = filteredPosts.filter(p => !p.featured || !p.featured);

  React.useEffect(() => {
    if (onSearchChange) onSearchChange(localSearch);
  }, [localSearch, onSearchChange]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div 
        style={{ height: heroHeight }}
        className="relative h-[60vh] min-h-[48rem] flex items-center justify-center overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-indigo-900/40"
          />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: Math.sin(i * 1.5) * 20,
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${10 + (i % 4) * 15}%`,
            }}
          />
        ))}

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge 
              variant="secondary" 
              className="mb-4 px-4 py-1.5 text-sm font-medium bg-violet-500/20 border-violet-400/30 hover:bg-violet-500/30 transition-colors"
            >
              <Sparkles className="w-3 h-3 mr-2 inline-block" />
              Stories & Insights
            </Badge>
          </motion.div>

          <h1 
            ref={containerRef}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.2 }}
            className="text-foreground font-bold tracking-tight mb-6"
          >
            The Syntheon Journal
          </h1>

          <p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            Deep dives into product design, engineering craft, and the art of building things that matter.
          </p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles, topics..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-12 h-14 rounded-full border-border bg-background/80 backdrop-blur-sm shadow-lg shadow-violet-900/10 focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </motion.div>

          {/* Quick category pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mt-8"
          >
            {['Product', 'Design', 'Engineering'].map((cat) => (
              <Button
                key={cat}
                variant="outline"
                size="sm"
                onClick={() => onSelectCategory?.(cat)}
                className="rounded-full border-border bg-background/80 backdrop-blur-sm hover:bg-violet-500/20 hover:border-violet-400 transition-all text-xs font-medium"
              >
                {cat}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-muted-foreground/60"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-0.5 h-8 bg-gradient-to-b from-violet-400 to-transparent rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <main className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        {/* Filter tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="w-full justify-start bg-background/50 backdrop-blur-sm border-b border-border p-2">
            <TabsTrigger value="featured" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-md px-4 py-3 text-sm font-medium transition-all">
              Featured Stories
            </TabsTrigger>
            <TabsTrigger value="latest" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-md px-4 py-3 text-sm font-medium transition-all">
              Latest Posts
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-md px-4 py-3 text-sm font-medium transition-all">
              Trending Now
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === 'featured' && (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {featuredPosts.length === 0 ? (
                  <div className="text-center py-24">
                    <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No featured stories yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredPosts.map((post, index) => (
                      <FeaturedPostCard key={post.id} post={post} delay={index * 0.1} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'latest' && (
              <motion.div
                key="latest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {regularPosts.length === 0 ? (
                  <div className="text-center py-24">
                    <Clock className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No recent posts found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post, index) => (
                      <BlogCard key={post.id} post={post} delay={cardStaggerDelay(index)} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'trending' && (
              <motion.div
                key="trending"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {posts.filter(p => p.trending).length === 0 ? (
                  <div className="text-center py-24">
                    <Star className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No trending posts yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.filter(p => p.trending).map((post, index) => (
                      <BlogCard key={post.id} post={post} delay={cardStaggerDelay(index)} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>

        {/* Category filter */}
        {activeTab === 'latest' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.filter(c => c !== 'Featured' && c !== 'Trending').map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectCategory?.(cat)}
                className={cn(
                  "rounded-full text-xs font-medium transition-all",
                  selectedCategory === cat 
                    ? "bg-violet-600 hover:bg-violet-700 text-white border-transparent" 
                    : "border-border bg-background/50 backdrop-blur-sm hover:bg-violet-500/20 hover:border-violet-400"
                )}
              >
                {cat}
              </Button>
            ))}
          </motion.div>
        )}

        {/* Load more */}
        <div className="flex justify-center pt-8">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full px-8 py-3 border-border bg-background/50 backdrop-blur-sm hover:bg-violet-600 hover:text-white hover:border-transparent transition-all min-w-[240px]"
          >
            Load More Articles
          </Button>
        </div>
      </main>

      {/* Newsletter CTA */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
            className="text-foreground font-bold mb-4 tracking-tight"
          >
            Stay in the loop
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Get our latest stories, design insights, and engineering deep dives delivered to your inbox weekly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-12 rounded-full border-border bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
            <Button size="lg" className="rounded-full px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium h-12">
              Subscribe
            </Button>
          </div>

          <p className="text-muted-foreground/50 text-sm mt-4">
            Join 10,000+ readers. Unsubscribe anytime.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-12 px-6 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Syntheon. All rights reserved.</p>
          
          <nav className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">RSS</a>
          </nav>

          <div className="flex items-center gap-2 text-muted-foreground/70">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs">Live: 14 articles published</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Featured post card with larger layout and prominent visual hierarchy
function FeaturedPostCard({ post, delay }: { post: BlogPost; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-violet-400/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-violet-900/10"
    >
      {/* Image container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Featured badge */}
        {post.featured && (
          <div className="absolute top-4 left-4">
            <Badge 
              variant="secondary" 
              className="bg-violet-600/90 backdrop-blur-sm text-white border-transparent px-3 py-1.5 text-xs font-medium shadow-lg"
            >
              Featured Story
            </Badge>
          </div>
        )}

        {/* Trending badge */}
        {post.trending && (
          <div className="absolute top-4 right-4">
            <Badge 
              variant="secondary" 
              className="bg-orange-500/90 backdrop-blur-sm text-white border-transparent px-3 py-1.5 text-xs font-medium shadow-lg"
            >
              Trending
            </Badge>
          </div>
        )}

        {/* Hover overlay */}
