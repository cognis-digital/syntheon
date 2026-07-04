'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Calendar, Clock, Tag, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  coverImage: string;
  author: string;
  date: Date;
  readTime: number;
  tags: string[];
  category: 'design' | 'engineering' | 'product' | 'lifestyle';
}

interface ArchiveProps {
  posts: BlogPost[];
  categories: BlogPost['category'][];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onCategoryFilter?: (category: BlogPost['category'] | null) => void;
}

const categoryConfig: Record<BlogPost['category'], { label: string; color: string }> = {
  design: { label: 'Design', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  engineering: { label: 'Engineering', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  product: { label: 'Product', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  lifestyle: { label: 'Lifestyle', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

const containerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export interface ArchivePageProps extends ArchiveProps {}

export default function Archive({ posts, categories, searchQuery = '', onSearchChange, onCategoryFilter }: ArchivePageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroView = useInView(containerRef, { once: true, margin: '100px' });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const activeCategory: BlogPost['category'] | null = categories.find(
    (cat) => cat !== 'lifestyle' // Default to lifestyle if none selected
  ) || 'lifestyle';

  const filteredByCategory = activeCategory 
    ? filteredPosts.filter((p) => p.category === activeCategory)
    : filteredPosts;

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={heroView ? 'visible' : 'hidden'}
      variants={heroVariants}
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: -60 }}
          animate={heroView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={heroView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-violet-300 to-primary/80 bg-clip-text text-transparent"
            >
              The Archive
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={heroView ? { opacity: 1 } : { opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-4 text-lg md:text-xl text-muted-foreground"
            >
              Stories from the last {posts.length} posts across all categories.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={heroView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8"
            >
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles, tags, or authors..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-12 h-14 rounded-full border-border bg-muted/50 focus:bg-background transition-colors shadow-sm"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={heroView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 flex justify-center gap-2 flex-wrap"
          >
            <Button
              variant={activeCategory === null ? 'default' : 'outline'}
              onClick={() => onCategoryFilter?.(null)}
              className="h-11 px-6 rounded-full border-border bg-background/80 backdrop-blur-sm transition-all hover:bg-primary/90"
            >
              <Filter className="mr-2 h-4 w-4" />
              All Categories
            </Button>

            {categories.filter((c) => c !== 'lifestyle').map((category) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + Number(category) * 0.05, duration: 0.3 }}
                onClick={() => onCategoryFilter?.(category)}
                className={cn(
                  'h-11 px-6 rounded-full border backdrop-blur-sm transition-all',
                  activeCategory === category
                    ? cn('bg-primary text-primary-foreground shadow-lg scale-105', categoryConfig[category].color)
                    : cn('border-border bg-muted/50 hover:bg-background', categoryConfig[category].color.replace(/text-/, 'text-').replace(/bg-/, 'bg-'))
                )}
              >
                <span className="capitalize">{category}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Decorative background elements */}
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" 
          style={{ transform: `translateY(${scrollY.get() * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]" 
          style={{ transform: `translateX(${scrollY.get() * 0.2}px)` }}
        />
      </section>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {filteredByCategory.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <>
            {/* Article Grid */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{
                animation: 'fadeIn 0.5s ease-out forwards',
              }}
            >
              {filteredByCategory.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Card className="h-full border-border bg-card/80 backdrop-blur-sm hover:bg-background/90 transition-colors group">
                    <div className="relative overflow-hidden aspect-[4/3] bg-muted">
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      
                      {/* Category Badge */}
                      <motion.div 
                        initial={{ y: 12, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md"
                      >
                        <span className={cn('capitalize', categoryConfig[post.category].color)}>
                          {categoryConfig[post.category].label}
                        </span>
                      </motion.div>

                      {/* Read Time Badge */}
                      <motion.div 
                        initial={{ y: 12, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-md border-border"
                      >
                        <Clock className="mr-1 h-3 w-3 inline-block" />
                        {post.readTime} min read
                      </motion.div>

                      {/* Date Badge */}
                      <motion.div 
                        initial={{ y: 12, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="absolute bottom-3 left-3 right-3 px-4 py-2 rounded-full text-xs font-medium bg-background/80 backdrop-blur-md border-border"
                      >
                        <Calendar className="mr-1 h-3 w-3 inline-block" />
                        {post.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </motion.div>
                    </div>

                    <CardContent className="p-5">
                      <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs px-2 py-1 rounded-md border-border bg-muted/50 hover:bg-background transition-colors cursor-pointer"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Author and CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          <span className="font-medium">{post.author}</span>
                        </span>

                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95, rotate: -5 }}
                          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-foreground transition-colors"
                        >
                          Read Article
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filteredByCategory.length * 0.12 + 0.5, duration: 0.4 }}
              className="flex justify-center items-center gap-2 mt-16"
            >
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {[1, 2, 3].map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 rounded-full border-border bg-background text-foreground hover:bg-primary/10 transition-colors"
                >
                  {page === 1 ? (
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  ) : page === 3 ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    page
                  )}
                </motion.button>
              ))}

              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </>
        )}
      </main>

      {/* Footer CTA */}
      <section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: filteredByCategory.length * 0.12 + 1, duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-24"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filteredByCategory.length * 0.12 + 1.5, duration: 0.6 }}
          className="bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-3xl p-8 md:p-12 border-border backdrop-blur-sm"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-violet-300 bg-clip-text text-transparent">
              Keep Exploring
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for weekly updates on design, engineering, and product insights.
            </p>

            <motion.form 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filteredByCategory.length * 0.12 + 2, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 h-12 rounded-full border-border bg-muted/50 focus:bg-background transition-colors"
              />
              <Button className="h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                Subscribe
              </Button>
            </motion.form>

            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Custom Cursor Effect */}
      {useReducedMotion() ? null : (
        <motion.div 
          className="fixed inset-0 pointer-events-none z-50 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CursorEffect />
        </motion.div>
      )}

      {/* Custom Cursor Effect */}
      <CursorEffect />
    </motion.div>
  );
}

// Custom cursor effect for desktop users
function CursorEffect() {
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      let hovering = false;

      interactiveElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          hovering = true;
        }
      });

      setIsHovering(hovering);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cursorScale = isHovering ? 1.2 : 1;
