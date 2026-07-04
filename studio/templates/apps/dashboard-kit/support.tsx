'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Mail, Phone, MessageSquare, Users, CheckCircle2, Zap, 
  ShieldCheck, ChevronDown, ChevronUp, Send, ArrowRight,
  Globe, Clock, Headphones, FileText, Menu, X, Search
} from 'lucide-react';

interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status?: 'active' | 'beta' | 'maintenance';
  delay?: number;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SupportPageProps {
  className?: string;
  darkMode?: boolean;
}

const HeroSection = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute inset-0 bg-gradient-to-b from-violet-50/30 via-background to-background dark:from-violet-950/20 dark:via-background dark:to-background"
      />

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-4xl px-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <div className="h-3 w-3 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">Always here for you</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-violet-600 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Support Center
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Our dedicated team is ready to help you get the most out of Syntheon. 
          Choose your preferred channel below or browse our knowledge base.
        </p>

        {/* Animated stats */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          {[
            { label: 'Active Agents', value: '24/7' },
            { label: 'Avg Response Time', value: '< 2h' },
            { label: 'Satisfaction Rate', value: '98%' },
            { label: 'Knowledge Articles', value: '1,500+' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="h-5 w-5 rotate-90" />
          </motion.div>
          <span className="text-sm">Scroll to explore</span>
        </div>
      </motion.div>
    </section>
  );
};

const SupportCard = ({ icon, title, description, status = 'active', delay = 0 }: SupportCardProps) => {
  const statusColors: Record<string, string> = {
    active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    beta: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    maintenance: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative bg-background border border-border rounded-2xl p-6 md:p-8 hover:border-violet-400/30 transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -3 }}
            transition={{ duration: 0.2 }}
            className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:bg-violet-500/20 transition-colors"
          >
            {icon}
          </motion.div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>

        {status !== 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs"
          >
            <span className={`h-2 w-2 rounded-full ${status === 'active' ? 'bg-green-500' : status === 'beta' ? 'bg-yellow-500' : 'bg-orange-500'}`} />
            <span className={cn("text-sm", statusColors[status].split(' ')[1])}>
              {status === 'active' ? 'Currently active' : status === 'beta' ? 'In beta testing' : 'Maintenance scheduled'}
            </span>
          </motion.div>
        )}

        <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline group-hover:gap-3 transition-all"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </a>

          <motion.div
            whileHover={{ scale: 1.2 }}
            className="flex items-center gap-1 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs">Verified channel</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const FAQItem = ({ question, answer, isOpen, onClick, index }: FAQItemProps) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: isOpen ? 'auto' : 0, 
        opacity: 1,
        transition: { duration: 0.3, delay: index * 0.05 }
      }}
      className="overflow-hidden"
    >
      <motion.button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-6 rounded-xl text-left group ${
          isOpen 
            ? 'bg-violet-500/10 border-violet-500/20' 
            : 'hover:bg-muted/50 border-transparent'
        } transition-all duration-300`}
      >
        <span className="font-medium">{question}</span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={`ml-auto h-6 w-6 flex items-center justify-center rounded-full ${
            isOpen 
              ? 'bg-violet-500 text-white' 
              : 'bg-muted text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400'
          }`}
        >
          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>{isOpen && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{answer}</motion.p>}</AnimatePresence>
    </motion.div>
  );
};

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset after showing success state
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl p-8 md:p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </motion.div>

        <h3 className="text-2xl font-semibold mb-4">Message Sent!</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Thank you for reaching out. Our team will respond to your inquiry within 2 business hours.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSubmitted(false)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
        >
          <Send className="h-4 w-4" />
          Send another message
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Doe"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Select a topic...</option>
          <option value="billing">Billing & Invoices</option>
          <option value="technical">Technical Support</option>
          <option value="account">Account Management</option>
          <option value="feedback">Product Feedback</option>
        </select>
      </div>

      <div className="space-y-4">
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Describe your inquiry in detail..."
          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all resize-none"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
        type="submit"
        className={`w-full py-4 px-6 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
            </motion.div>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span>Send Message</span>
          </>
        )}
      </motion.button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to our Privacy Policy. We typically respond within 24 hours during business days.
      </p>
    </form>
  );
};

const QuickLinks = () => {
  const links = [
    { icon: FileText, label: 'Documentation', href: '#' },
    { icon: Globe, label: 'Status Page', href: '#' },
    { icon: Clock, label: 'Scheduled Maintenance', href: '#' },
    { icon: Headphones, label: 'Live Chat', href: '#' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {links.map((link, i) => (
        <motion.a
          key={i}
          href={link.href}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="flex flex-col items-center justify-center p-6 bg-background border border-border rounded-2xl hover:border-violet-400/30 transition-all group"
        >
          <motion.div
            whileHover={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 0.3 }}
            className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-violet-500/10 transition-colors"
          >
            <link.icon className="h-6 w-6 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400" />
          </motion.div>

          <span className="text-sm font-medium text-center">{link.label}</span>
        </motion.a>
      ))}
    </div>
  );
};

const FeaturesGrid = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: '24/7 Expert Support',
      description: 'Our team of specialists is available around the clock to assist with any questions or issues.',
    },
    {
      icon: Zap,
      title: 'Fast Response Times',
      description: 'Get answers quickly through our optimized support channels and automated triage system.',
    },
    {
      icon: Users,
      title: 'Dedicated Account Managers',
      description: 'Enterprise customers receive personalized support from their dedicated account team.',
    },
    {
      icon: CheckCircle2,
      title: 'Verified Solutions',
      description: 'Access our library of verified solutions and step-by-step troubleshooting guides.',
    },
  ];
