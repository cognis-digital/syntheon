'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, CheckCircle2, ChevronDown, Globe, ShieldCheck, Zap, 
  BarChart3, Lock, Users, TrendingUp, CreditCard, Smartphone,
  Menu, X, Star, Sparkles, Layers, Activity, Wallet
} from 'lucide-react';

const { cn: c } = { cn };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
    }
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      setReduced(mediaQuery.matches);
    });
  }, []);

  return reduced;
}

function useScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
}

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1500 + delay * 300;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < duration) {
        setDisplay(Math.floor(start + (value - start) * (elapsed / duration)));
        requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, delay]);

  return <span>{display.toLocaleString()}</span>;
}

function SectionHeading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ 
        opacity: inView ? 1 : 0, 
        y: inView ? 0 : 40 
      }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
        {children}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

function FeatureCard({ icon: Icon, title, description, delay }: { 
  icon: any; 
  title: string; 
  description: string; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="group p-6 rounded-xl bg-card border-border hover:border-primary/50 transition-colors"
    >
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
        <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function PricingCard({ 
  name, 
  price, 
  description, 
  features, 
  highlighted = false,
  delay 
}: { 
  name: string; 
  price: string; 
  description: string; 
  features: string[]; 
  highlighted?: boolean; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        "relative p-6 rounded-xl border bg-card",
        highlighted 
          ? "border-primary shadow-lg shadow-primary/10 scale-105" 
          : "border-border hover:border-muted transition-colors"
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-medium bg-primary text-primary-foreground rounded-full">
          Most Popular
        </span>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className={cn(
        "w-full py-3 px-4 rounded-lg font-medium transition-all",
        highlighted 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "bg-background border-border hover:border-muted"
      )}>
        Get Started
      </button>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, company }: { 
  quote: string; 
  author: string; 
  role: string; 
  company: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 rounded-xl bg-card border-border"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-lg italic mb-4">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="font-semibold text-primary">{author.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollY = useScrollProgress();
  const scrolled = scrollY > 50;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ 
        y: 0,
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none'
      }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
    >
      <nav className={cn(
        "max-w-7xl mx-auto flex items-center justify-between",
        scrolled ? "h-16 rounded-lg bg-background/80 backdrop-blur-sm border-border" : "h-20"
      )}>
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold hidden sm:block">Syntheon</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'Testimonials', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Sign In
          </button>
          <button className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Get Started
          </button>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg border-border hover:border-muted transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-border bg-background"
            >
                <div className="p-4 space-y-4">
                    {['Features', 'Pricing', 'Testimonials', 'About'].map((item) => (
                        <a 
                            key={item} 
                            href={`#${item.toLowerCase()}`} 
                            className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                    <div className="pt-4 border-t border-border space-y-3">
                        <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium">
                            Get Started
                        </button>
                        <button className="w-full py-2.5 rounded-lg border border-border hover:border-muted transition-colors">
                            Sign In
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        ref={ref}
        className="absolute inset-0 z-0"
      >
        {/* Animated gradient background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent)',
              'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(139, 92, 246, 0.1), transparent)',
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent)'
            ]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-0 bg-background"
        />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 120 - 60,
              y: Math.random() * 80 - 40,
              scale: 0.3 + Math.random() * 0.7
            }}
            animate={{
              y: [null, null],
              x: [null, null]
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 20
            }}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
          />
        ))}

        {/* Scroll progress bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollYProgress }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 to-transparent origin-left"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border-border mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Introducing the future of fintech</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Financial Freedom,
          </span>
          <br />
          <span className="text-primary">Reimagined.</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform for modern financial management. 
          Secure, intelligent, and designed for the future of money.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            Start Free Trial
          </motion.button>

          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-background border-border text-primary font-semibold text-lg hover:border-muted transition-colors flex items-center gap-2"
          >
            <Globe className="w-5 h-5" />
            Watch Demo
          </motion.a>
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Trusted by 10,000+ users</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Fully encrypted & secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Real-time analytics</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      description: "AES-256 encryption with zero-knowledge architecture. Your data is yours alone."
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "AI-powered insights that help you understand your spending patterns and optimize."
    },
    {
      icon: Globe,
      title: "Global Payments",
      description: "Send money to 150+ countries with real exchange rates and minimal fees."
    },
    {
      icon: Lock,
      title: "Biometric Access",
      description: "Face ID and Touch ID integration for seamless secure authentication."
    },
    {
      icon: Activity,
      title: "Live Notifications",
      description: "Instant alerts for every transaction with customizable categories."
    },
    {
      icon: Layers,
      title: "Multi-Device Sync",
      description: "Seamlessly sync across phone, tablet, and desktop in real-time."
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>
          Powerful Features
          <span className="block mt-6 text-muted-foreground">
            Everything you need to manage your finances with confidence.
          </span>
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard 
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for individuals getting started.",
      features: ["Up to 5 accounts", "Basic analytics", "Email support", "Mobile app access"],
      highlighted: false,
      delay: 0
    },
    {
      name: "Pro",
      price: "$19",
      description: "For those who want more power.",
      features: ["Unlimited accounts", "Advanced analytics", "Priority support", "API access"],
      highlighted: true,
      delay: 0.2
    },
    {
      name: "Business",
      price: "$49",
      description: "For teams and organizations.",
      features: ["Everything in Pro", "Team collaboration", "Custom integrations", "Dedicated support"],
      highlighted: false,
      delay: 0.4
    }
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 bg-muted/50">
