'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Copy, Search, Moon, Sun, ChevronRight, ExternalLink } from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authRequired?: boolean;
  rateLimited?: boolean;
}

interface ApiCategory {
  id: string;
  name: string;
  endpoints: ApiEndpoint[];
}

interface ApiReferenceProps {
  categories: ApiCategory[];
  title?: string;
  description?: string;
  darkMode?: boolean;
  onCopy?: (text: string) => void;
}

const defaultCategories: ApiCategory[] = [
  {
    id: 'users',
    name: 'Users API',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/users/{id}',
        description: 'Retrieve a single user by ID.',
        authRequired: true,
        rateLimited: false,
      },
      {
        method: 'POST',
        path: '/api/v1/users',
        description: 'Create a new user account.',
        authRequired: true,
        rateLimited: true,
      },
    ],
  },
  {
    id: 'auth',
    name: 'Authentication',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/login',
        description: 'Authenticate and obtain session token.',
        authRequired: false,
        rateLimited: true,
      },
      {
        method: 'GET',
        path: '/api/v1/auth/me',
        description: 'Get current authenticated user info.',
        authRequired: true,
        rateLimited: false,
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 50,
      delayChildren: 100,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

const hoverVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.02,
    rotate: -1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const copyVariants = {
  initial: { backgroundColor: 'transparent', borderColor: 'hsl(var(--border))' },
  hover: { scale: 1.05, rotate: -2 },
  active: { scale: 0.98, rotate: 0, backgroundColor: 'hsl(262, 78%, 43%)', borderColor: 'hsl(var(--primary))' },
};

export interface ApiReferenceComponentProps extends ApiReferenceProps {}

export default function ApiReference({
  categories = defaultCategories,
  title = 'API Reference',
  description = 'Complete API documentation for Syntheon services.',
  darkMode = true,
  onCopy,
}: ApiReferenceProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll-based reveal effects
  const { scrollYProgress } = useScroll({
    target: scrollRef.current,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return [...categories];
    
    const query = searchQuery.toLowerCase();
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      cat.endpoints.some(ep => 
        ep.path.toLowerCase().includes(query) ||
        ep.description.toLowerCase().includes(query)
      )
    );
  }, [categories, searchQuery]);

  // Get active category endpoints
  const activeEndpoints = useMemo(() => {
    if (activeCategory === 'all') return filteredCategories.flatMap(cat => cat.endpoints);
    const found = categories.find(c => c.id === activeCategory)?.endpoints;
    return found || [];
  }, [activeCategory, filteredCategories, categories]);

  // Methods for filtering
  const methods = ['all', ...Array.from(new Set(categories.flatMap(c => c.endpoints.map(e => e.method))) as string[])];

  // Animation variants based on scroll position
  const getScrollVariants = () => ({
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  });

  return (
    <motion.div
      ref={scrollRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-background text-foreground dark:bg-zinc-950 dark:text-zinc-100"
    >
      {/* Hero Section */}
      <motion.section
        variants={{ hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative overflow-hidden"
      >
        {/* Background gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-primary/5 dark:from-zinc-950 dark:to-violet-950/20"
          style={{ transform: `translateY(${-y}px)` }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 sm:py-32">
          <motion.div 
            variants={getScrollVariants()}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div 
            variants={getScrollVariants()}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="mt-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <motion.div 
                variants={getScrollVariants()}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search endpoints, methods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-background border-border focus:border-primary/50 dark:bg-zinc-900"
                  />
                </div>
              </motion.div>

              {/* Category Tabs */}
              <motion.div 
                variants={getScrollVariants()}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
              >
                <Tabs defaultValue="all" value={activeCategory} onValueChange={(v) => setActiveCategory(v)}>
                  <TabsList className="bg-background border-border h-12 dark:bg-zinc-900">
                    {methods.map((method, index) => (
                      <TabsTrigger 
                        key={method}
                        value={method}
                        className={cn(
                          'h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-violet-950/30',
                          method === 'all' ? 'rounded-l-lg rounded-r-none' : '',
                          method !== 'all' && methods.length > 2 ? 'rounded-l-none rounded-r-lg' : ''
                        )}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </motion.div>
            </div>
          </motion.div>

          {/* Endpoints Grid */}
          <motion.div 
            variants={getScrollVariants()}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {activeEndpoints.map((endpoint, index) => (
                <motion.div
                  key={endpoint.path}
                  variants={getScrollVariants()}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    'relative overflow-hidden rounded-xl border bg-card dark:bg-zinc-900/50',
                    index % 3 === 0 ? 'rounded-l-none' : '',
                    index > 0 && index % 3 !== 0 ? 'rounded-r-none' : ''
                  )}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0"
                    whileHover={{ opacity: 1, transition: { duration: 0.3 } }}
                  />

                  {/* Content */}
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'secondary' : endpoint.method === 'POST' ? 'default' : 'destructive'}
                        className="h-8 px-3 text-sm font-medium"
                      >
                        {endpoint.method}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        {endpoint.authRequired && (
                          <Badge variant="outline" className="h-6 px-2 text-xs">
                            <Lock className="h-3 w-3 mr-1" /> Auth
                          </Badge>
                        )}
                        
                        {endpoint.rateLimited && (
                          <Badge variant="outline" className="h-6 px-2 text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" /> Rate Limited
                          </Badge>
                        )}

                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 rounded-full hover:bg-primary/20 dark:hover:bg-violet-950/40"
                        >
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {endpoint.path}
                    </p>

                    <p className="text-sm leading-relaxed">
                      {endpoint.description}
                    </p>

                    {/* Hover action */}
                    <motion.div 
                      className="absolute bottom-4 right-4 opacity-0"
                      whileHover={{ opacity: 1, transition: { duration: 0.2 } }}
                    >
                      <Button size="sm" variant="secondary">
                        View Details
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </motion.div>
              ))}

              {/* Empty state */}
              {activeEndpoints.length === 0 && (
                <motion.div 
                  variants={getScrollVariants()}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
                  className="col-span-full py-24 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium mb-2">No endpoints found</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Try adjusting your search query or filters to find what you're looking for.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div 
            variants={getScrollVariants()}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-transparent dark:from-violet-950/20 dark:via-zinc-950 dark:to-transparent"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Ready to build?</h3>
                <p className="text-muted-foreground max-w-md">
                  Start integrating with our APIs today. Full examples and SDKs available in the developer portal.
                </p>
              </div>

              <Button size="lg" variant="secondary" className="group">
                Open Developer Portal
                <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent dark:from-zinc-950"
          style={{ transform: `translateY(${-y * 0.6}px)` }}
        />
      </motion.section>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-40 right-[10%] w-96 h-96 rounded-full bg-violet-500/5 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

// Helper components with proper types and defaults
function Lock({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-2" />
    </svg>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-7.854" />
      <path d="M12 12v7.856" />
      <path d="m21 12-5.364-5.364" />
    </svg>
  );
}
