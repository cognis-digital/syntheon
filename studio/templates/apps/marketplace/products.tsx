'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Heart, ShoppingCart, Star, ArrowRight, Filter, SlidersHorizontal, X, Plus, Minus, Zap, ShieldCheck, Truck, Crown } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviews: number;
  priceMin: number;
  priceMax: number;
  category: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
}

interface ProductsPageProps {
  products: ProductData[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onProductClick?: (product: ProductData) => void;
}

const variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export interface ProductsPageProps {
  products: ProductData[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onProductClick?: (product: ProductData) => void;
}

const defaultProducts: ProductData[] = [
  {
    id: '1',
    name: 'Violet Crown Pro',
    description: 'Premium wireless audio with spatial computing integration.',
    images: ['/api/placeholder/400/500'],
    variants: [
      { id: 'v1', name: 'Titanium Black', price: 299 },
      { id: 'v2', name: 'Violet Obsidian', price: 329 },
    ],
    rating: 4.8,
    reviews: 1247,
    priceMin: 299,
    priceMax: 329,
    category: 'Audio',
    tags: ['Wireless', 'Spatial Audio'],
    isFeatured: true,
    inStock: true,
  },
  {
    id: '2',
    name: 'Neon Pulse Watch',
    description: 'Smartwatch with haptic feedback and health monitoring.',
    images: ['/api/placeholder/400/500'],
    variants: [
      { id: 'v1', name: 'Silver', price: 199 },
      { id: 'v2', name: 'Rose Gold', price: 229 },
    ],
    rating: 4.6,
    reviews: 856,
    priceMin: 199,
    priceMax: 229,
    category: 'Wearables',
    tags: ['Health', 'Smart'],
    isNew: true,
    inStock: true,
  },
];

export interface ProductsPageProps {
  products: ProductData[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onProductClick?: (product: ProductData) => void;
}

const defaultProducts: ProductData[] = [
  {
    id: '1',
    name: 'Violet Crown Pro',
    description: 'Premium wireless audio with spatial computing integration.',
    images: ['/api/placeholder/400/500'],
    variants: [
      { id: 'v1', name: 'Titanium Black', price: 299 },
      { id: 'v2', name: 'Violet Obsidian', price: 329 },
    ],
    rating: 4.8,
    reviews: 1247,
    priceMin: 299,
    priceMax: 329,
    category: 'Audio',
    tags: ['Wireless', 'Spatial Audio'],
    isFeatured: true,
    inStock: true,
  },
  {
    id: '2',
    name: 'Neon Pulse Watch',
    description: 'Smartwatch with haptic feedback and health monitoring.',
    images: ['/api/placeholder/400/500'],
    variants: [
      { id: 'v1', name: 'Silver', price: 199 },
      { id: 'v2', name: 'Rose Gold', price: 229 },
    ],
    rating: 4.6,
    reviews: 856,
    priceMin: 199,
    priceMax: 229,
    category: 'Wearables',
    tags: ['Health', 'Smart'],
    isNew: true,
    inStock: true,
  },
];

const ProductCard = ({ product, index }: { product: ProductData; index: number }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [showQuickView, setShowQuickView] = React.useState(false);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: index * 0.1 }}
      variants={variants}
      className="group relative"
    >
      <Card className="overflow-hidden border-border bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300">
        {/* Image Container */}
        <div 
          className="relative aspect-square overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />

          {/* Image Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
              >
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary' : 'border-transparent opacity-0 group-hover:opacity-100 hover:scale-110'}`}
                  >
                    <img src={product.images[i]} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isNew && (
              <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-md">
                New
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="outline" className="border-primary/50 text-primary">
                Featured
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Heart className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          {/* Quick View Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQuickView(true)}
            className="absolute bottom-3 left-3 right-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Quick View
          </motion.button>
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
            <span className="text-primary font-bold">${product.priceMin}</span>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-border/50 bg-muted/50">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <SlidersHorizontal className="w-3 h-3" />
              <span>{product.variants[0].name}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          )}

          {/* Stock Status */}
          {product.inStock ? (
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-400/50 text-red-600">
              Out of Stock
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Quick View Modal */}
      {showQuickView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowQuickView(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-xl">{product.name}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowQuickView(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <img src={product.images[0]} alt={product.name} className="rounded-lg w-full h-48 object-cover" />
                <div className="flex flex-col justify-center space-y-3">
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating} ({product.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {product.variants.length > 1 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Select Variant</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <Button
                        key={variant.id}
                        variant={variant.price === product.priceMin ? 'default' : 'outline'}
                        size="sm"
                      >
                        {variant.name} — ${variant.price}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-2xl font-bold">${product.priceMin}</span>
                <Button size="lg" className="px-8">
                  Add to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

const ProductsPage = ({ products, searchQuery = '', onSearchChange }: ProductsPageProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  // Track scroll progress for parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  React.useEffect(() => {
    if (onSearchChange) onSearchChange(searchQuery);
  }, [searchQuery, onSearchChange]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div
        style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 0.95]) }}
        className="relative h-64 md:h-80 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center px-4">
            <h1 className="font-bold text-3xl md:text-5xl mb-2 bg-gradient-to-r from-primary to-purple-300 bg-clip-text text-transparent">
              Marketplace
            </h1>
            <p className="text-muted-foreground/80 max-w-lg mx-auto">
              Discover premium products crafted with precision and passion.
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 left-0 right-0 mx-auto max-w-xl"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 py-3 bg-background/80 backdrop-blur-md border-border focus:border-primary transition-colors"
            />
          </div>
        </motion.form>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky top-20 z-30 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          <Button variant="ghost" size="sm">
            Reset
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {['All', 'New Arrivals', 'Featured', 'On Sale'].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Product Grid */}
      <main className="px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}

          {/* Skeleton Loader */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="aspect-square rounded-xl bg-muted/40"
          >
            <div className="p-4 space-y-2">
              <div className="h-6 w-3/4 bg-muted/60 rounded animate-pulse" />
              <div className="h-4 w-full bg-muted/40 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted/40 rounded animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Load More */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 mt-6 border-2 border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          Load More Products
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-background/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2024 Syntheon Marketplace. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;
