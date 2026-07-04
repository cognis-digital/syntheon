'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: 'Design' | 'Engineering' | 'Product' | 'Culture';
  image: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of Motion Design in Web Interfaces',
    excerpt: 'Exploring how subtle animations can elevate user experience without overwhelming the senses.',
    author: 'Elena Vance',
    date: '2024-03-15',
    category: 'Design',
    image: '/images/hero-mockup.jpg'
  },
  {
    id: '2',
    title: 'Building Accessible Framer Motion Components',
    excerpt: 'A comprehensive guide to making motion accessible for users with reduced-motion preferences.',
    author: 'Marcus Chen',
    date: '2024-03-12',
    category: 'Engineering',
    image: '/images/accessibility.jpg'
  },
  {
    id: '3',
    title: 'Design Tokens: A Systematic Approach to Consistency',
    excerpt: 'How we built a token-based design system that scales across platforms and teams.',
    author: 'Sarah Kim',
    date: '2024-03-10',
    category: 'Product',
    image: '/images/tokens.jpg'
  }
];

const categories = [
  { name: 'All', count: articles.length },
  { name: 'Design', count: articles.filter(a => a.category === 'Design').length },
  { name: 'Engineering', count: articles.filter(a => a.category === 'Engineering').length },
  { name: 'Product', count: articles.filter(a => a.category === 'Product').length }
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(mediaQuery.matches);
      
      const handler = () => setReduced(mediaQuery.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);
  
  return reduced;
}

function AnimatedText({ 
  children, 
  className,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6 + delay * 0.2,
        ease: [0.16, 1, 0.3, 1],
        delay: reducedMotion() ? 0 : delay
      }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  );
}

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <section 
      ref={ref}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-background to-violet-950/20"
      />
      
      {/* Floating particles */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[500px] h-[500px] border border-violet-500/20 rounded-full"
      />
      
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[300px] h-[300px] border border-violet-400/20 rounded-full"
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge 
            variant="outline" 
            className={cn(
              'mb-6 px-4 py-2 text-sm font-medium',
              'bg-violet-500/10 border-violet-500/30'
            )}
          >
            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-violet-400 animate-pulse" />
            Now in Beta
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <AnimatedText>Thoughts</AnimatedText>{' '}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            & Ideas
          </span>
          {' '}<AnimatedText delay={0.1}>at Scale</AnimatedText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          A curated collection of technical writing, design thinking, and product philosophy from the Syntheon team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button 
            size="lg"
            variant="default"
            className={cn(
              'h-12 px-8 text-lg',
              'bg-gradient-to-r from-violet-600 to-purple-600',
              'hover:from-violet-500 hover:to-purple-500'
            )}
          >
            Start Reading
          </Button>

          <Button 
            size="lg"
            variant="outline"
            className={cn(
              'h-12 px-8 text-lg',
              'border-violet-400/30 hover:bg-violet-500/10'
            )}
          >
            Subscribe to Newsletter
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-muted-foreground/60"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="currentColor">
              <path d="M8 0L0 9h16L8 0zm0 15l-8 9h16l-8-9z"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Parallax layers */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[-20%] top-[20%] w-[400px] h-[400px] opacity-10"
      >
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-violet-400"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" className="text-purple-400"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-fuchsia-400"/>
        </svg>
      </motion.div>
    </section>
  );
}

function CategoryFilter() {
  const [active, setActive] = useState('All');
  
  return (
    <div className="sticky top-24 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: active === cat.name ? 1 : 0.7,
                y: 0,
                scale: active === cat.name ? 1.02 : 1
              }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setActive(cat.name)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                active === cat.name 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' 
                  : 'hover:bg-violet-500/10 hover:text-violet-400'
              )}
            >
              {cat.name}
              <span className={cn(
                'ml-2 px-1.5 py-0.5 rounded-full text-xs',
                active === cat.name ? 'bg-white/20' : 'bg-violet-400/20'
              )}>
                {cat.count}
              </span>
            </motion.button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.2, 0.8, 0.2, 1]
      }}
    >
      <Card className={cn(
        'overflow-hidden group hover:border-violet-400/30 transition-colors',
        'hover:shadow-xl hover:shadow-violet-950/20'
      )}>
        {/* Image with overlay */}
        <div 
          className="relative h-64 overflow-hidden"
          role="img"
          aria-label={article.title}
        >
          <motion.img
            src={article.image}
            alt=""
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full h-full object-cover"
          />
          
          <div 
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent',
              'transition-opacity group-hover:opacity-100 opacity-75'
            )}
          />

          <Badge 
            variant="secondary" 
            className={cn(
              'absolute top-3 left-3 px-3 py-1.5 text-sm font-medium',
              article.category === 'Design' && 'bg-violet-600/80 text-white',
              article.category === 'Engineering' && 'bg-blue-600/80 text-white',
              article.category === 'Product' && 'bg-emerald-600/80 text-white',
              'backdrop-blur-sm'
            )}
          >
            {article.category}
          </Badge>

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'absolute bottom-3 left-3 right-3 p-4',
                'bg-background/95 backdrop-blur-md border border-border/50',
                'group-hover:bg-background group-hover:border-violet-400/30'
              )}
            >
              <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Hover overlay with CTA */}
          <div 
            className={cn(
              'absolute inset-0 flex items-center justify-center gap-3 opacity-0',
              'group-hover:opacity-100 transition-opacity duration-500'
            )}
          >
            <Button 
              size="sm"
              variant="default"
              className={cn(
                'h-9 px-4 text-sm',
                'bg-violet-600 hover:bg-violet-700'
              )}
            >
              Read Article
            </Button>
          </div>
        </div>

        {/* Meta info */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span>{article.author}</span>
            <Separator orientation="vertical" className="h-4 bg-border/50" />
            <span>{new Date(article.date).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}</span>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              'h-8 px-3 text-xs border rounded-full',
              'border-border/50 hover:bg-violet-500/10 hover:text-violet-400'
            )}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="mr-1">
              <path d="M5.5 3l4.5 4.5L6 12H6v-2h-.5l-4.5-4.5L5.5 3z"/>
            </svg>
            Share
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute right-[-15%] top-[10%] w-[800px] h-[800px]"
      >
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-violet-400/30"/>
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400/20"/>
        </svg>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Stay in the Loop
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground mb-8 max-w-xl mx-auto"
        >
          Join 12,000+ readers who get our latest articles, design insights, and engineering deep dives delivered to their inbox weekly.
        </motion.p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) return;
            
            setStatus('loading');
            setTimeout(() => {
              setStatus(email.includes('@') ? 'success' : 'error');
              setEmail('');
            }, 1500);
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className={cn(
              'h-12 px-4 text-base',
              status === 'error' && 'border-red-500 focus-visible:ring-red-500/50'
            )}
          />

          <Button 
            type="submit"
            size="lg"
            className={cn(
              'h-12 px-8 text-base font-medium',
              status === 'loading' && 'opacity-75 cursor-not-allowed'
            )}
            disabled={!email.trim() || status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
