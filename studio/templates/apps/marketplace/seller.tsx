'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface SellerProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isNew?: boolean;
}

interface SellerStats {
  sales: number;
  products: number;
  followers: number;
  responseRate: number;
}

export interface SellerPageProps {
  sellerName: string;
  sellerBio: string;
  stats: SellerStats;
  products: SellerProduct[];
  featuredProducts?: SellerProduct[];
  onContact: (e: React.FormEvent) => void;
}

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function SellerPage({
  sellerName,
  sellerBio,
  stats,
  products,
  featuredProducts = [],
  onContact,
}: SellerPageProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -60]);

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-background text-foreground dark:bg-zinc-950 dark:text-zinc-100"
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-transparent z-10" />
        
        <div className="z-20 text-center px-4 max-w-3xl mx-auto">
          <AnimatePresence>
            <motion.h1
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
            >
              <span className="bg-gradient-to-r from-violet-600 to-purple-400 bg-clip-text text-transparent">
                {sellerName}
              </span>
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {sellerBio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" variant="primary">
              Contact Seller
            </Button>
            <Button variant="secondary">
              View Portfolio
            </Button>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -left-32 top-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-32 bottom-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Total Sales', value: stats.sales.toLocaleString() },
            { label: 'Products Listed', value: stats.products.toString() },
            { label: 'Followers', value: stats.followers.toLocaleString() },
            { label: 'Response Rate', value: `${stats.responseRate}%` },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Featured Products
          </h2>

          {featuredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredProducts.map((product, i) => (
                <ProductCard key={i} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center text-muted-foreground py-12"
            >
              No featured products yet. Check back soon!
            </motion.p>
          )}
        </div>
      </section>

      {/* All Products */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            All Products
          </h2>

          {products.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <ProductCard key={i} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center text-muted-foreground py-12"
            >
              No products listed yet.
            </motion.p>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Get in Touch</h2>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={onContact}
            className="space-y-6"
          >
            <Input placeholder="Your Name" className="h-12 text-lg" />
            <Input placeholder="Email Address" type="email" className="h-12 text-lg" />
            <Input placeholder="Message" className="h-12 text-lg min-h-[80px]" />

            <Button size="lg" className="w-full h-14 text-lg">
              Send Message
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/50">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2024 {sellerName}. All rights reserved.
        </div>
      </footer>
    </motion.main>
  );
}

function ProductCard({ product, index }: { product: SellerProduct; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * (index % 6) + index / 6 }}
    >
      <Card className="group relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {product.isNew && (
          <Badge variant="secondary" className="absolute top-4 left-4 z-10">
            New Arrival
          </Badge>
        )}

        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={product.image || `/placeholder-${index}.png`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <Button variant="secondary" size="sm" className="w-full">
              Quick View
            </Button>
          </div>
        </div>

        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            {product.rating >= 4.5 && (
              <Badge variant="outline" className="text-xs">
                <span className="text-yellow-500 mr-1">★</span>
                {product.rating}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">{product.description || 'Premium quality product crafted with attention to detail.'}</p>

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="font-bold text-lg">${product.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">
              {product.reviews} reviews
            </span>
          </div>

          <Button variant="outline" size="sm" className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Add to Cart — ${(product.price * 0.95).toLocaleString()}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
