'use client';

import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  featured?: boolean;
  year: number;
}

const projects: ProjectData[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    description: 'A real-time generative art platform with WebGL shaders and collaborative editing.',
    tags: ['React', 'WebGL', 'Three.js'],
    image: '/placeholder-1.jpg',
    featured: true,
    year: 2024,
  },
  {
    id: '2',
    title: 'Violet Vault',
    description: 'Secure digital asset management with biometric authentication and blockchain verification.',
    tags: ['TypeScript', 'Web3', 'Security'],
    image: '/placeholder-2.jpg',
    featured: true,
    year: 2024,
  },
  {
    id: '3',
    title: 'Echo Studio',
    description: 'AI-powered audio production suite with real-time collaboration and cloud rendering.',
    tags: ['Audio API', 'WebRTC', 'ML'],
    image: '/placeholder-3.jpg',
    featured: true,
    year: 2024,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export interface ProjectsProps {
  className?: string;
}

export default function Projects({ className }: ProjectsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y1 = useTransform(scrollYProgress, [0, 0.2], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)' }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-200, 200]) }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            initial={{ x: Math.random() * window.innerWidth, y: -500, scale: 0 }}
            animate={{ 
              y: window.innerHeight + 200, 
              scale: [0.8, 1.2, 0.9] 
            }}
            transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, delay: i * 3 }}
            style={{
              width: 400 + i * 50,
              height: 400 + i * 50,
              background: `radial-gradient(circle, hsla(270, ${60 + i * 5}%, 50%, 0.1) 0%, transparent 70%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Hero section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 lg:px-24">
        <div 
          className="text-center max-w-4xl mx-auto"
          style={{ y: useTransform(scrollYProgress, [0, 0.3], [-100, 50]) }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-2 text-sm bg-primary/25 border-primary/30 backdrop-blur-md"
            >
              Selected Works
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A curated collection of digital experiences, interactive systems, and creative applications. 
              Each piece pushes the boundaries of what's possible in modern web development.
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-12">
            <Button size="lg" variant="default" className="px-8 py-6 text-lg rounded-full shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow duration-300">
              View All Projects
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm uppercase tracking-widest">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 13L12 18L17 13V7H7V13Z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Projects grid */}
      <section className="px-6 lg:px-24 py-16">
        <AnimatePresence initial={false}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              className="group cursor-pointer"
            >
              <Card 
                className={cn(
                  'relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border-border hover:border-primary/40 transition-all duration-300',
                  project.featured && 'ring-1 ring-primary/20 shadow-xl shadow-violet-500/10'
                )}
              >
                {/* Image with zoom effect */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Featured badge */}
                  {project.featured && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute top-4 left-4"
                    >
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/90 backdrop-blur-md px-3 py-1 text-sm font-medium"
                      >
                        Featured
                      </Badge>
                    </motion.div>
                  )}

                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{project.year}</p>
                    </div>

                    {/* Quick stats */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex gap-3"
                    >
                      {project.tags.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="border-primary/40 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Smooth zoom on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ scale: 1.1 }}
                  >
                    <img 
                      src={project.image} 
                      alt="" 
                      className="w-full h-full object-cover blur-sm"
                    />
                  </motion.div>
                </div>

                {/* Content below image */}
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group/btn gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <span className="text-sm font-medium">View Case Study</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover/btn:translate-x-1">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Load more indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="flex justify-center py-16"
        >
          <Button variant="outline" size="lg" className="gap-3">
            Load More Projects
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13L12 18L17 13V7H7V13Z"/>
            </svg>
          </Button>
        </motion.div>
      </section>

      {/* Stats section */}
      <section className="relative py-24 px-6 lg:px-24 bg-gradient-to-b from-background via-violet-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Years Experience', value: '10+' },
              { label: 'Projects Delivered', value: '50+' },
              { label: 'Happy Clients', value: '35+' },
              { label: 'Awards Won', value: '12' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-4"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-24 px-6 lg:px-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-t from-violet-950/30 to-transparent"
          style={{ y: useTransform(scrollYProgress, [1], [-100, 0]) }}
        />

        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to start your next project?
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-muted-foreground mb-8 max-w-xl mx-auto"
          >
            Let's create something extraordinary together. Reach out to discuss your vision and how we can bring it to life.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" variant="default" className="px-8 py-6 rounded-full">
              Get in Touch
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 rounded-full">
              View Portfolio
            </Button>
          </motion.div>
        </div>

        {/* Animated footer elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px]"
        >
          <div 
            className="w-full h-full rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)' }}
          />
        </motion.div>
      </section>

      {/* Custom cursor hint (subtle) */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-violet-500 blur-[100px]" />
      </motion.div>
    </motion.div>
  );
}
