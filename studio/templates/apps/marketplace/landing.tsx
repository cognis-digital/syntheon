'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface LandingProps {
  className?: string;
}

const cursorTrail = () => {
  const [trail, setTrail] = React.useState<{ x: number; y: number; opacity: number; scale: number }[]>([]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!trail.length || trail[trail.length - 1].opacity < 0.2) return;
      
      const newTrail = [...trail, { 
        x: e.clientX, 
        y: e.clientY, 
        opacity: 1, 
        scale: 1 
      }];
      
      requestAnimationFrame(() => {
        setTrail(prev => prev.slice(0, -1).map((t, i) => ({
          ...t,
          x: t.x + (Math.random() - 0.5) * 2,
          y: t.y + (Math.random() - 0.5) * 2,
          opacity: Math.max(0, t.opacity - 0.1),
          scale: 1 + i * 0.1
        })));
      });
    };

    document.addEventListener('mousemove', handleMove);
    return () => document.removeEventListener('mousemove', handleMove);
  }, [trail]);

  return trail;
};

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, -200]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-b from-violet-50/20 via-transparent to-transparent dark:from-violet-950/30"
      />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <span className="animate-pulse mr-2">●</span> Now in Beta
          </Badge>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-violet-600 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Syntheon
          </span>
          <br />
          Marketplace
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
        >
          Premium digital assets for creators, developers, and designers who demand excellence.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" className="h-14 px-8 text-lg">
            Start Exploring
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
            View Documentation
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 flex justify-center gap-8 text-muted-foreground"
        >
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <div className="text-4xl font-bold text-violet-600 dark:text-violet-400">
                {i === 1 ? '50K+' : i === 2 ? '98%' : '2M+'}
              </div>
              <div className="text-sm uppercase tracking-wider mt-1">
                {i === 1 ? 'Active Creators' : i === 2 ? 'Positive Reviews' : 'Downloads'}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div 
        style={{ y: useTransform(scrollY, [0, 1000], [0, 300]) }}
        className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background/80 to-transparent dark:from-background"
      />
    </section>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 + delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Card 
        className={cn(
          "h-full bg-card/50 backdrop-blur-sm border-border hover:border-violet-400/50 transition-colors duration-300",
          "hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-950/20"
        )}
      >
        <CardContent className="p-6 md:p-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400"
          >
            {icon}
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex items-center text-sm font-medium text-violet-600 dark:text-violet-400"
          >
            <span>Learn more</span>
            <motion.span 
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="ml-2"
            >
              →
            </motion.span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Curated Collections",
      description: "Browse carefully selected categories featuring the finest digital assets from top creators worldwide."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Verified Quality",
      description: "Every asset undergoes rigorous quality checks to ensure premium standards before publication."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      ),
      title: "Smart Licensing",
      description: "Flexible licensing options tailored to your project needs with transparent pricing."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m-9.708 3.536l3.536-3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Global Community",
      description: "Connect with thousands of creators and buyers in a vibrant, professional marketplace."
    }
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/10 to-transparent dark:via-violet-950/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm">Features</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover, create, and sell premium digital assets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Marquee = () => {
  const logos = [
    "Acme Corp", "Globex", "Soylent", "Initech", "Umbrella", 
    "Massive Dynamic", "Stark Ind", "Wayne Ent"
  ];

  return (
    <section className="py-12 border-y border-border/50 bg-muted/30 dark:bg-muted/20">
      <div className="container mx-auto px-4 overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 items-center"
        >
          {[...logos, ...logos].map((logo, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="text-2xl font-bold text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer"
            >
              {logo}
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-8">
          <Badge variant="outline" className="text-xs px-3 py-1">
            Trusted by 50,000+ creators worldwide
          </Badge>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-500/10 to-pink-500/20 dark:from-violet-900/40 dark:via-purple-800/30 dark:to-pink-900/20"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            Ready to Get Started?
          </Badge>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Start Your Journey Today
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of creators and businesses already building with Syntheon.
          </p>

          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 h-12 px-4 bg-background/80 backdrop-blur-sm border-border focus:border-violet-500 dark:bg-background/90"
            />
            <Button size="lg" className="h-12 px-6 text-lg">
              Get Started Free
            </Button>
          </motion.form>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. 7-day free trial. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50 bg-background dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-violet-600 dark:text-violet-400">Syntheon</h3>
            <p className="text-sm text-muted-foreground">
              Premium digital marketplace for creators and professionals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Features", "Pricing", "Documentation", "Changelog"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-violet-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["About", "Careers", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-violet-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
