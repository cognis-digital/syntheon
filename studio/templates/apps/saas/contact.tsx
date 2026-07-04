'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Mail, Phone, MapPin, ArrowRight, Send, Loader2, CheckCircle2, 
  AlertCircle, ChevronDown, ChevronUp, Globe, Linkedin, Twitter, 
  Instagram, Facebook, Sparkles, Zap, ShieldCheck, Users, Clock
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  }),
};

const faqData = [
  { q: 'How quickly do you respond?', a: 'We typically respond within 24 hours during business days.' },
  { q: 'Is there a cost for support?', a: 'Most inquiries are free. Enterprise plans include priority support.' },
  { q: 'Can I schedule a demo call?', a: 'Yes, click the calendar button above to book a personalized demo.' },
];

export interface ContactPageProps {
  className?: string;
}

export default function ContactPage({ className }: ContactPageProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], ['0%', '30%']);

  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => setSubmitStatus('idle'), 4000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    setIsSubmitting(false);
  };

  const inputProps = {
    className: cn(
      'w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2',
      errors[Object.keys(errors).find(k => k === 'name' || k === 'email') as keyof ContactFormData] 
        ? 'border-destructive/50 ring-1 ring-destructive/50' 
        : 'border-border focus:border-primary focus:ring-primary/20'
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn('min-h-screen bg-background text-foreground', className)}
    >
      {/* Hero with parallax */}
      <motion.section
        style={{ backgroundPositionY: y1 }}
        className="relative h-[50vh] flex items-center justify-center overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background pointer-events-none"
          style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Get in touch with our team</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-purple-200 to-primary bg-clip-text text-transparent">
            Let's build something amazing together.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our team is ready to answer your questions and help you get started with Syntheon.
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -left-32 top-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </motion.section>

      {/* Main content */}
      <main className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                Send us a message
              </h2>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50/50 border border-green-200 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800">Message sent successfully! We'll get back to you soon.</p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50/50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800">Something went wrong. Please try again.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    disabled={isSubmitting || submitStatus === 'success'}
                    {...inputProps}
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    disabled={isSubmitting || submitStatus === 'success'}
                    {...inputProps}
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={isSubmitting || submitStatus === 'success'}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border bg-background text-foreground transition-all duration-200 focus:outline-none focus:ring-2',
                      'border-border focus:border-primary focus:ring-primary/20'
                    )}
                  >
                    <option>General Inquiry</option>
                    <option>Sales Question</option>
                    <option>Technical Support</option>
                    <option>Partnership Opportunity</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    disabled={isSubmitting || submitStatus === 'success'}
                    {...inputProps}
                  />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'success'}
                  className={cn(
                    'w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3',
                    isSubmitting || submitStatus === 'success'
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {[
                { icon: Clock, label: '24h Response', value: 'Avg.' },
                { icon: ShieldCheck, label: '99% Uptime', value: 'SLA' },
                { icon: Users, label: '10k+ Clients', value: 'Happy' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Contact info & FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Contact cards */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, label: 'Email', value: 'hello@syntheon.com' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                { icon: Globe, label: 'Website', value: 'www.syntheon.com' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-muted-foreground">{item.value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-3"
              >
                {['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map((platform) => (
                  <motion.a
                    key={platform}
                    href="#"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + Math.random() * 0.2 }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                  >
                    <span className="text-sm font-medium">{platform[0]}</span>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* FAQ accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-2">
                {faqData.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="rounded-xl border border-border overflow-hidden"
                  >
                    <details>
                      <summary className="flex items-center justify-between p-4 cursor-pointer bg-card hover:bg-primary/5 transition-colors">
                        <span className="font-medium">{item.q}</span>
                        <motion.span
                          animate={{ rotate: 0 }}
                          whileOpen={{ rotate: 180 }}
                          transition={{ duration: 0.2 }}
                          className="w-6 h-6 flex items-center justify-center"
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.span>
                      </summary>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 pt-2 text-muted-foreground"
                      >
                        {item.a}
                      </motion.div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Horizontal scroll marquee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8"
            >
              <h3 className="text-xl font-semibold mb-4">Other ways to reach us</h3>
              
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                {[
                  { icon: Zap, label: 'Live Chat', time: '24/7' },
                  { icon: Mail, label: 'Support Portal', link: '#' },
                  { icon: Phone, label: 'Sales Team', time: '9AM - 6PM EST' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="min-w-[240px] p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    {item.time && (
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    )}
                    {item.link && (
                      <a href={item.link} className="inline-flex items-center gap-
