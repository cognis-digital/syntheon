'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, 
  Mail, 
  Globe, 
  Users, 
  Zap, 
  Shield, 
  Sparkles,
  ChevronDown,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AboutPageProps {
  className?: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.2, 0.8, 0.2, 1],
    },
  }),
};

const stagger = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
};

export interface AboutPage extends React.ComponentProps<'div'> {
  className?: string;
}

export default function AboutPage({ className }: AboutPageProps) {
  const containerRef = useInView({
    threshold: 0.1,
    amount: 'first' as const,
  });

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.1 },
        },
      }}
      className={cn(
        'min-h-screen bg-background text-foreground',
        'selection:bg-primary selection:text-primary-foreground',
        className,
      )}
    >
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <Badge variant="secondary" className="h-9 px-4 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Since 2024
            </Badge>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-r from-primary via-purple-400 to-pink-300 bg-clip-text text-transparent">
            Building Digital
            <br />
            Experiences That Matter.
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We craft premium interfaces, thoughtful interactions, and meaningful products for brands that refuse to compromise on quality.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-12"
          >
            <Button size="lg" className="h-12 px-8 text-lg">
              Start a Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button variant="outline" size="lg" className="h-12 px-6 text-lg group">
              <Github className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              View on GitHub
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex items-center justify-center gap-8 mt-12 text-muted-foreground"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span>Global</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <span>10k+ Clients</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              <span>Award-Winning Design</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Our Core Principles
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Reliability', desc: 'Built with robust architecture and rigorous testing protocols.', color: 'from-blue-500/20 to-purple-500/20' },
              { icon: Sparkles, title: 'Excellence', desc: 'Obsessive attention to detail in every pixel and interaction.', color: 'from-purple-500/20 to-pink-500/20' },
              { icon: Zap, title: 'Innovation', desc: 'Constantly pushing boundaries with cutting-edge technology.', color: 'from-orange-500/20 to-yellow-500/20' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={stagger}
                initial="hidden"
                animate="visible"
                custom={i}
                className="group"
              >
                <Card className="h-full bg-card/50 border-border hover:border-primary/50 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
                  <CardContent className="p-8">
                    <div className={cn(
                      'w-12 h-12 rounded-xl mb-6 bg-gradient-to-br',
                      item.color,
                      'group-hover:scale-110 transition-transform duration-300'
                    )}>
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-8">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Story of Craftsmanship
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            What started as a passion project in a small apartment has grown into a global design studio serving brands across every industry. We believe that great software is not just functional—it's an extension of human creativity and purpose. Every line of code, every animation frame, every pixel placement serves a deliberate intent.
          </motion.p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Years Active', value: '5+' },
              { label: 'Projects Delivered', value: '500+' },
              { label: 'Team Members', value: '30' },
              { label: 'Countries Served', value: '25' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-primary/10 via-purple-950/30 to-pink-950/10 border-border/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a855f7\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-32V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
            
            <div className="relative z-10 p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Something Extraordinary?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Let's discuss how we can bring your vision to life with our premium development and design services.
              </p>
              <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 transition-colors">
                Book a Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl translate-x-8 translate-y-8" />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">Syntheon</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            {['About', 'Services', 'Portfolio', 'Contact'].map((link) => (
              <a key={link} href="#" className="hover:text-primary transition-colors">
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-muted-foreground">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <Icon className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 Syntheon. Crafted with precision.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
