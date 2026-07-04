'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ShoppingCart, Heart, Share2, MessageSquare, ChevronLeft, ChevronRight, Minus, Plus, CheckCircle2, Zap, ShieldCheck, Truck, Clock } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  selectedVariantId: string;
  stock: number;
  category: string;
  tags: string[];
  reviews: Review[];
  specs: Record<string, string>;
}

interface ProductProps {
  data: ProductData;
  onAddToCart: (variantId: string) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted?: boolean;
  className?: string;
}

const variants = [
  { id: 'v1', name: 'Classic Black', price: 299.00, image: '/images/variant-black.jpg' },
  { id: 'v2', name: 'Midnight Blue', price: 319.00, image: '/images/variant-blue.jpg' },
  { id: 'v3', name: 'Royal Violet', price: 349.00, image: '/images/variant-violet.jpg' },
];

const reviews: Review[] = [
  {
    id: 'r1',
    user: 'Alexandra M.',
    rating: 5,
    date: '2 days ago',
    content: 'Absolutely stunning quality. The attention to detail is incredible. Worth every penny!',
    verified: true,
  },
  {
    id: 'r2',
    user: 'Marcus T.',
    rating: 4,
    date: '1 week ago',
    content: 'Great product, fast shipping. The violet variant is even more beautiful in person.',
    verified: true,
  },
];

const specs = {
  Material: 'Premium aerospace-grade aluminum alloy',
  Weight: '850g (2.09 lbs)',
  Dimensions: '34 x 18 x 6 cm',
  Warranty: '2 years comprehensive coverage',
  Origin: 'Designed in Tokyo, assembled in California',
};

export interface ProductVariantProps {
  variant: ProductVariant;
  isSelected: boolean;
  onSelect: (variantId: string) => void;
}

const ProductVariant = ({ variant, isSelected, onSelect }: ProductVariantProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(variant.id)}
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl border transition-all duration-300',
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border hover:border-muted-foreground'
      )}
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
        {variant.image && (
          <motion.img
            src={variant.image}
            alt={variant.name}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('font-medium truncate', isSelected ? 'text-primary' : '')}>
          {variant.name}
        </p>
        <p className="text-sm text-muted-foreground">${variant.price.toFixed(2)}</p>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="ml-auto"
        >
          <CheckCircle2 className="w-4 h-4 text-primary" />
        </motion.div>
      )}
    </motion.button>
  );
};

export interface ProductImageProps {
  src: string;
  alt: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ProductImage = ({ src, alt, index, isActive, onClick }: ProductImageProps) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0.4 }}
      animate={{ opacity: isActive ? 1 : 0.4 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />
      {isActive && (
        <motion.div
          layoutId={`active-thumb-${index}`}
          className="absolute inset-0 bg-primary/10 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export interface ProductGalleryProps {
  images: string[];
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

const ProductGallery = ({ images, selectedImageIndex, onImageSelect }: ProductGalleryProps) => {
  const [scrollProgress, setScrollProgress] = useTransform(
    useScroll(),
    { clamp: true }
  );

  return (
    <div className="space-y-4">
      {/* Main gallery */}
      <motion.div
        layoutId={`main-gallery-${selectedImageIndex}`}
        className="relative aspect-square rounded-xl overflow-hidden bg-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {images[selectedImageIndex] && (
          <motion.img
            src={images[selectedImageIndex]}
            alt="Product main view"
            layoutId={`main-${selectedImageIndex}`}
            className="w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}

        {/* Quick actions overlay */}
        <motion.div
          className="absolute top-4 left-4 right-4 flex gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="ghost" size="icon">
            <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5 text-muted-foreground hover:text-primary" />
          </Button>
        </motion.div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
          <span>{selectedImageIndex + 1} / {images.length}</span>
          <span className="flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Pro View Enabled
          </span>
        </div>
      </motion.div>

      {/* Thumbnail strip */}
      <ScrollArea className="hidden md:block">
        <div className="flex gap-3 pb-4">
          {images.map((src, index) => (
            <ProductImage
              key={index}
              src={src}
              alt={`View ${index + 1}`}
              index={index}
              isActive={selectedImageIndex === index}
              onClick={() => onImageSelect(index)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Mobile thumbnail strip */}
      <div className="flex md:hidden gap-2 overflow-x-auto pb-4">
        {images.map((src, index) => (
          <ProductImage
            key={index}
            src={src}
            alt={`View ${index + 1}`}
            index={index}
            isActive={selectedImageIndex === index}
            onClick={() => onImageSelect(index)}
          />
        ))}
      </div>
    </div>
  );
};

export interface ProductDetailsProps {
  specs: Record<string, string>;
  features?: string[];
}

const FeatureIcon = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border hover:border-primary transition-colors"
  >
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </motion.div>;
);

const ProductDetails = ({ specs, features }: ProductDetailsProps) => {
  const featureList: string[] = [
    'Premium materials and craftsmanship',
    '2-year comprehensive warranty included',
    'Free express shipping worldwide',
    '30-day money-back guarantee',
    '24/7 dedicated customer support',
    'Lifetime technical updates',
  ];

  return (
    <div className="space-y-6">
      {/* Quick specs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          Technical Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(specs).map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.random() * 0.2 }}
              className="flex justify-between p-3 rounded-lg bg-muted/40 border border-border"
            >
              <span className="font-medium text-muted-foreground">{key}</span>
              <span className="text-right">{value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      {features && (
        <>
          <Separator />
          <h3 className="text-lg font-semibold mb-4">Why You'll Love It</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {featureList.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <FeatureIcon icon={<ShieldCheck className="w-4 h-4" />} label={feature} />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Reviews preview */}
      {specs.rating && (
        <>
          <Separator />
          <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
          <div className="p-6 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="text-2xl font-bold">{specs.rating}</span>
                <span className="text-muted-foreground">/ 5.0</span>
              </div>
              <Button variant="ghost" size="sm">
                Read all reviews
              </Button>
            </div>

            <ScrollArea className="max-h-48">
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <motion.li
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: review.id.charCodeAt(0) * 0.05 }}
                    className="p-4 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">Verified Buyer</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.date}</p>
                    <p className="text-sm">{review.content}</p>
                  </motion.li>
                ))}
              </ul>
            </ScrollArea>

            {specs.reviewCount > 50 && (
              <Button variant="link" size="sm" className="mt-4">
                View all {specs.reviewCount} reviews →
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export interface ProductDescriptionProps {
  description: string;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="prose prose-sm max-w-none text-muted-foreground">
        {description.split('\n\n').map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="mb-4 last:mb-0"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      <AnimatePresence>
        {!isExpanded && description.length > 500 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Show less' : 'Read full description'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export interface ProductStickyActionsProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  onAddToCart: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const ProductStickyActions = ({
  price,
  originalPrice,
  discount,
  stock,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductStickyActionsProps) => {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="sticky bottom-4 left-4 right-4 md:left-auto md:right-auto md:w-[calc(100%-2rem)] bg-background/90 backdrop-blur-xl border border-border rounded-2xl shadow-lg p-6"
    >
      <div className="flex flex-col gap-5">
        {/* Price display */}
        <div>
          {originalPrice && discount ? (
            <>
              <span className="text-3xl font-bold text-primary">${(price * quantity).toFixed(2)}</span>
              <span className="ml-4 text-lg text-muted-foreground line-through">
                ${(originalPrice * quantity).toFixed(2)}
              </span>
              <Badge variant="secondary" className="ml-3 bg-red-500/10 text-red-500 border-red-500/20">
                {discount}% OFF
              </Badge>
            </>
          ) : (
            <span className="text-3xl font-bold">${(price * quantity).toFixed(2)}</span>
          )}

          {stock > 10 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="ml-3 flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Free express shipping</span>
            </motion.div>
          )}

          {stock <= 10 && stock > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="ml-3 flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Only {stock} left in stock</span>
            </motion.div>
          )}

          {stock === 0 && (
            <Badge variant="secondary" className="ml-3 bg-red-500/10 text-red-500 border-red-500/20">
              Out of stock
            </Badge>
          )}
        </div>

        {/* Quantity selector */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus className="w-4 h-4" />
          </Button>

          <Input
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="h-12 w-24 text-center font-medium border-border focus:border-primary"
          />

          <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(99, quantity + 1))}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddToCart}
            disabled={stock === 0}
            className={cn(
              'flex-1 h-14 rounded-xl font-semibold transition-all',
              stock > 0
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            {stock > 0 ? (
