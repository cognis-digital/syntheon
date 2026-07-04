'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Verified, Search, Filter, ChevronLeft, ChevronRight, Heart, Share2, MessageSquare, MoreHorizontal, ArrowUpRight, Calendar, User, MapPin, TrendingUp, Award, ShieldCheck, Sparkles } from 'lucide-react';

interface Review {
  id: string;
  user: string;
  avatarUrl?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  images?: string[];
  tags: string[];
}

interface ReviewsPageProps {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  categories: string[];
  featuredReviewId?: string | null;
}

const reviewVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const starColors = ['text-amber-400', 'text-orange-300', 'text-yellow-300', 'text-amber-200', 'text-yellow-100'];

function RatingStars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes: Record<string, string> = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size === 'lg' ? 16 : 12}
          className={cn(
            sizes[size],
            i <= rating ? starColors[0] : 'text-slate-300 dark:text-slate-600',
            'fill-current'
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      variants={reviewVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="relative group"
    >
      <Card className="h-full bg-background/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {review.avatarUrl ? (
                <img
                  src={review.avatarUrl}
                  alt={review.user}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{review.user}</span>
                  {review.verified && (
                    <Badge variant="secondary" className="h-5 px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                      <Verified size={10} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <RatingStars rating={review.rating} />
                  <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal size={16} />
            </Button>
          </div>

          {review.title && (
            <h3 className="font-semibold text-foreground">{review.title}</h3>
          )}

          <p className="text-muted-foreground leading-relaxed">
            {review.content}
          </p>

          {review.images?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {review.images.map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  alt={`Review image ${i + 1}`}
                  className="h-20 w-28 rounded-lg object-cover ring-1 ring-border"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                <MessageSquare size={14} />
                {review.helpfulCount} helpful
              </span>
              <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                <Share2 size={14} />
                Share
              </span>
            </div>
            <Button variant="outline" size="sm" className="gap-2 border-border/50 hover:border-primary/30 hover:bg-primary/5">
              <Heart size={14} />
              Helpful
            </Button>
          </div>

          {review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 cursor-pointer transition-colors">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnimatedCounter({ value, label }: { value: number; label?: string }) {
  const ref = useInView({ once: true });
  
  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        key={value}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary via-purple-300 to-pink-300 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {value.toLocaleString()}
      </motion.div>
      <span className="text-sm text-muted-foreground mt-2 block">{label}</span>
    </motion.div>
  );
}

function MarqueeReviews({ reviews }: { reviews: Review[] }) {
  const containerRef = useInView({ once: false });
  
  return (
    <div className="relative overflow-hidden py-16 bg-gradient-to-b from-background to-primary/5">
      <motion.div
        ref={containerRef}
        className="flex gap-8 animate-marquee"
        initial={{ x: 0 }}
        animate={{ x: [-20, 20] }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear",
          delay: 10
        }}
      >
        {[...reviews.slice(3), ...reviews.slice(3)].map((review, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-[280px] p-4 rounded-xl bg-card/50 border border-border/30 backdrop-blur-sm"
            whileHover={{ scale: 1.02, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <RatingStars rating={review.rating} />
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              "{review.content}"
            </p>
            <span className="text-xs text-primary/70 mt-2 block">{review.user}</span>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}

function FilterBar({ 
  categories, 
  selectedCategory, 
  onSelect,
  searchQuery,
  onSearchChange 
}: { 
  categories: string[]; 
  selectedCategory: string | null; 
  onSelect: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-24 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Tabs value={selectedCategory} onValueChange={(v) => onSelect(v === 'all' ? null : v)} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-3 bg-background/50 border border-border/20 rounded-xl p-1 gap-1">
              {['all', ...categories].map((cat) => (
                <TabsTrigger 
                  key={cat}
                  value={cat}
                  className={cn(
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                    "rounded-lg text-sm font-medium transition-all duration-200"
                  )}
                >
                  {cat === 'all' ? 'All Reviews' : cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 bg-background/50 border-border/30 focus:border-primary/50 transition-colors"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border/30 hover:bg-primary/10">
              <Filter size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatsRow({ value, label, icon: Icon }: { value: number; label: string; icon: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex-1 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-200 bg-clip-text text-transparent">
        {value.toLocaleString()}
      </div>
      <span className="text-sm text-muted-foreground mt-1 block">{label}</span>
    </motion.div>
  );
}

function FeaturedReview({ review }: { review: Review }) {
  if (!review) return null;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-border/30"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a855f7\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-32v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm-16 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-32v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2h-4zm0-32v-4H4v4H0v2h4v4h2v-4h4v-2h-4zM6 8v-4H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 text-sm font-medium mb-3">
              <Sparkles size={12} className="mr-1" />
              Featured Review
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{review.title}</h2>
          </div>
          <RatingStars rating={review.rating} size="lg" />
        </div>

        <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl">
          {review.content}
        </p>

        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{review.user}</span>
              {review.verified && (
                <Badge variant="secondary" className="h-6 px-2 py-0.5 bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                  <Verified size={10} /> Verified Buyer
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
          </div>
        </div>

        {review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {review.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 cursor-pointer transition-colors">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
          <Button variant="outline" size="sm" className="gap-2 border-border/30 hover:bg-primary/10">
            <MessageSquare size={14} />
            Reply to Review
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Heart size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Share2 size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Animated corner accents */}
      <motion.div 
        className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </motion.section>
  );
}

export interface ReviewsPageProps {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  categories: string[];
  featuredReviewId?: string | null;
}

export default function ReviewsPage({ 
  reviews = [], 
  totalReviews = 0, 
  averageRating = 4.5, 
  categories = ['All', 'Electronics', 'Fashion', 'Home & Garden'], 
  featuredReviewId = null 
}: ReviewsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter reviews
  let filteredReviews = reviews;
  
  if (selectedCategory && selectedCategory !== 'all') {
    filteredReviews = filteredReviews.filter(r => 
      r.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      r.title.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredReviews = filteredReviews.filter(r => 
      r.content.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.user.toLowerCase().includes(query)
    );
  }

  // Get featured review
  const featuredReview = reviews.find(r => r.id === featuredReviewId) || reviews[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-primary/5 via-background to-background"
      >
        <div className="absolute inset-0 pointer-events-none">
