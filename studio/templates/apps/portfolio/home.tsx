'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, Github, Linkedin, Twitter, Mail, 
  Code2, Palette, Zap, Globe, Layers, Cpu,
  Menu, X, ChevronDown, Sparkles
} from 'lucide-react';

// --- Types & Interfaces ---

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
}

interface NavItem {
  label: string;
  href: string;
}

// --- Constants & Data ---

const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Fintech Dashboard',
    description: 'Real-time analytics platform for enterprise banking.',
    tags: ['React', 'TypeScript', 'D3.js'],
    image: '/images/project-1.jpg',
    link: '#',
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Headless Shopify storefront with custom CMS.',
    tags: ['Next.js', 'Shopify API', 'GraphQL'],
    image: '/images/project-2.jpg',
    link: '#',
  },
  {
    id: '3',
    title: 'Healthcare App',
    description: 'Patient portal with HIPAA-compliant features.',
    tags: ['React Native', 'Firebase', 'Node.js'],
    image: '/images/project-3.jpg',
    link: '#',
  },
];

const SKILLS = [
  { icon: Code2, label: 'Frontend Architecture' },
  { icon: Palette, label: 'UI/UX Design' },
  { icon: Zap, label: 'Performance Optimization' },
  { icon: Globe, label: 'Responsive Design' },
  { icon: Layers, label: 'State Management' },
  { icon: Cpu, label: 'Serverless Architecture' },
];

// --- Components ---

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.7]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-900/10 to-indigo-900/20"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 120 - 60, 
              y: Math.random() * 120 - 60,
              scale: 0.5 + Math.random() * 0.5,
              opacity: 0.3 + Math.random() * 0.4 
            }}
            animate={{ 
              x: [Math.random() * 120 - 60, Math.random() * 120 - 60],
              y: [Math.random() * 120 - 60, Math.random() * 120 - 60],
            }}
            transition={{ 
              duration: 8 + Math.random() * 4, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className="absolute w-3 h-3 rounded-full bg-violet-400/30 blur-sm"
          />
        ))}
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
            <Sparkles size={16} />
            Available for new projects
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent mb-6">
          Crafting Digital Experiences
        </h1>

        <p className="text-xl md:text-2xl text-violet-300/80 max-w-2xl mx-auto leading-relaxed">
          Senior Product Engineer & Motion Designer specializing in premium web applications with exceptional user experiences.
        </p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          <a href="#work" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-full font-semibold transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              View Work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>

          <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/10 text-white rounded-full font-medium transition-all duration-300">
            Get in Touch
          </a>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-violet-300/60"
          >
            <ChevronDown size={24} />
            <span className="text-sm">Scroll</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll progress bar */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${Math.min(scrollY.y, 1000) / 5}px` }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-600/30 to-transparent"
      />
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-violet-400/50 transition-colors duration-300"
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-violet-300/80 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <a 
          href={project.link}
          className="inline-flex items-center gap-1 mt-6 text-sm font-medium text-white hover:text-violet-300 transition-colors"
        >
          View Case Study <ArrowRight size={14} />
        </a>
      </div>

      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-violet-900/80 via-transparent to-transparent pointer-events-none"
      />
    </motion.div>
  );
}

function SkillsSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/30 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Expertise</h2>
          <p className="text-violet-300/80 max-w-xl mx-auto">
            A curated collection of technologies and methodologies I use to build exceptional digital products.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: 'easeOut' 
              }}
              className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-violet-500/10 hover:border-violet-400/50 transition-all duration-300 cursor-default"
            >
              <skill.icon 
                size={28} 
                className="mx-auto mb-4 text-violet-300 group-hover:text-white transition-colors"
              />
              <p className="text-center font-medium text-white/90 group-hover:text-white">
                {skill.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Animated counter section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { label: 'Years Experience', value: '10+' },
            { label: 'Projects Delivered', value: '50+' },
            { label: 'Happy Clients', value: '30+' },
            { label: 'Awards Won', value: '8' },
          ].map((stat, i) => (
            <div key={i}>
              <motion.div
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-300 to-white bg-clip-text text-transparent"
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-violet-400/70 mt-2 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: 'Product Development',
      description: 'End-to-end development from concept to launch with meticulous attention to detail.',
      icon: Code2,
    },
    {
      title: 'UI/UX Design',
      description: 'Creating intuitive interfaces that delight users and drive engagement.',
      icon: Palette,
    },
    {
      title: 'Performance Optimization',
      description: 'Ensuring lightning-fast load times and smooth interactions across all devices.',
      icon: Zap,
    },
    {
      title: 'Technical Consultation',
      description: 'Architecture reviews, code audits, and strategic technical guidance.',
      icon: Layers,
    },
  ];

  return (
    <section id="services" className="py-24 bg-violet-950/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What I Do</h2>
          <p className="text-violet-300/80 max-w-xl mx-auto">
            Comprehensive services for building and enhancing digital products.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-violet-500/10 hover:border-violet-400/50 transition-all duration-300"
            >
              <service.icon 
                size={24} 
                className="mb-4 text-violet-300 mx-auto"
              />
              <h3 className="text-lg font-semibold text-white mb-2 text-center">
                {service.title}
              </h3>
              <p className="text-sm text-violet-300/70 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-violet-950/10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Work Together</h2>
          
          <p className="text-xl text-violet-300/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Have a project in mind or want to discuss how we can elevate your digital presence? 
            I'm always open to new opportunities and exciting challenges.
          </p>

          <div className="flex flex-col items-center gap-4 mb-16">
            <a 
              href="mailto:hello@syntheon.dev"
              className="inline-flex items-center gap-2 px-8 py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              <Mail size={18} />
              hello@syntheon.dev
            </a>

            <div className="flex items-center gap-4 mt-6">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-violet-300 hover:bg-violet-500/20 hover:text-white transition-all duration-300"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, delay: 0.3 }}
            transition={{ duration: 1 }}
            className="text-sm text-violet-400/60"
          >
            Based in San Francisco • Remote Worldwide
          </motion.div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ 
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"
      />
    </section>
  );
}

function Footer() {
