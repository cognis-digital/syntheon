'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, ArrowRight, CheckCircle2, Star, Zap,
  ShieldCheck, Globe, Layers, Smartphone, BarChart3, Rocket,
  Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook, Dribbble
} from 'lucide-react';

// --- Types & Interfaces ---

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

interface PricingTierProps {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
  cta: string;
  delay?: number;
}

// --- Design Tokens (Violet Theme) ---

const tokens = {
  colors: {
    background: 'hsl(260, 85%, 9%)',
    foreground: 'hsl(260, 100%, 95%)',
    primary: 'hsl(260, 70%, 60%)',
    primaryForeground: 'hsl(260, 30%, 10%)',
    secondary: 'hsl(260, 60%, 40%)',
    secondaryForeground: 'hsl(260, 20%, 95%)',
    muted: 'hsl(260, 80%, 20%)',
    mutedForeground: 'hsl(260, 100%, 85%)',
    accent: 'hsl(260, 90%, 70%)',
    border: 'hsl(260, 40%, 30%)',
    card: 'hsl(260, 70%, 15%)',
    cardForeground: 'hsl(260, 80%, 90%)',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
};

// --- Utility Components ---

const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg cursor-pointer',
    variant === 'primary' && 'bg-primary text-primaryForeground hover:bg-primary/90',
    variant === 'secondary' && 'bg-secondary text-secondaryForeground hover:bg-secondary/90',
    variant === 'outline' && 'border border-border bg-card text-foreground hover:bg-card/80',
    variant === 'ghost' && 'hover:bg-muted text-foreground',
    size === 'sm' && 'px-3 py-1.5 text-sm',
    size === 'md' && 'px-4 py-2.5 text-base',
    size === 'lg' && 'px-6 py-3.5 text-lg',
    className,
  );

  return (
    <button className={baseStyles} {...props}>
      {children}
    </button>
  );
};

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

const Section = ({ children, id, className }: SectionProps) => (
  <section
    id={id}
    className={cn('relative overflow-hidden', className)}
  >
    {children}
  </section>
);

// --- Premium Components ---

interface FeatureCardProps extends FeatureProps {}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 + delay * 0.1 }}
        className="mb-4 p-3 bg-primary/20 rounded-lg text-primary group-hover:bg-primary group-hover:text-primaryForeground transition-colors duration-300"
      >
        {icon}
      </motion.div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
};

interface PricingCardProps extends PricingTierProps {}

const PricingCard = ({ name, price, features, recommended, cta, delay = 0 }: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        'relative p-6 bg-card/30 backdrop-blur-sm border rounded-xl flex flex-col h-full',
        recommended ? 'border-primary ring-2 ring-primary/50' : 'border-border',
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primaryForeground text-sm font-medium rounded-full">
          Most Popular
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Custom' && <span className="text-muted-foreground ml-1">/month</span>}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        variant={recommended ? 'primary' : 'outline'} 
        className="mt-auto w-full justify-center"
      >
        {cta}
      </Button>
    </motion.div>
  );
};

// --- Layout Components ---

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

const NavItem = ({ href, children }: NavItemProps) => (
  <a 
    href={href} 
    className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
  </a>
);

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        />
        <nav className="fixed top-24 left-0 right-0 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            {['Home', 'Services', 'Pricing', 'About'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={onClose}
                className="text-xl font-medium text-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </motion.div>
        </nav>
      </>
    )}
  </AnimatePresence>
);

// --- Page Sections ---

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const isScrolled = useTransform(scrollY, [0, 50], [0, 1]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.div
        style={{ backgroundColor: 'rgba(9, 7, 14, 0.6)', backdropFilter: 'blur(12px)' }}
        className="border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <motion.div
                initial={{ rotate: -15 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold">Syntheon</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Home', 'Services', 'Pricing', 'About'].map((item) => (
                <NavItem key={item} href={`#${item.toLowerCase()}`}>
                  {item}
                </NavItem>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Menu />
            </button>
          </nav>
        </div>
      </motion.div>

      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </motion.header>
  );
};

const Hero = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effect for hero image
  const y = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <Section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Background Gradient */}
      <motion.div
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.4, 0.6]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5"
      />

      {/* Floating Elements */}
      <motion.div
        style={{ y, opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 top-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: -y * 0.5, opacity: [0.2, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-20 bottom-1/4 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary">
              ✨ Now accepting new projects
            </span>
            <a href="#about" className="flex items-center gap-1.5 px-4 py-1.5 bg-card border border-border rounded-full hover:border-primary transition-colors group">
              <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Global presence</span>
            </a>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.9]">
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Digital
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            >
              Alchemy
            </motion.span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8 leading-relaxed">
            We transform visionary brands into digital masterpieces. 
            Award-winning creative agency crafting experiences that captivate, convert, and create lasting legacies.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Button size="lg" className="group">
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button variant="outline" size="lg">
              View Our Work
            </Button>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-8"
          >
            <div>
              <div className="text-4xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-4xl font-bold">$100M+</div>
              <div className="text-sm text-muted-foreground">Revenue Generated</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-4xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">Client Retention</div>
            </div>
          </motion.div>

          {/* Trusted By */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by industry leaders</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['Acme Corp', 'GlobalTech', 'Nebula Inc', 'Pinnacle', 'Vertex'].map((company) => (
                <span key={company} className="text-xl font-bold">{company}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Image/Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-16 md:mt-24 relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
            <img 
              src="/api/placeholder/1920x800?text=Creative+Agency+Showcase" 
              alt="Agency showcase"
              className="w-full h-auto object-cover"
            />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
