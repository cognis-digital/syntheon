'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export interface FooterMegaProps {
  brandName: string;
  tagline?: string;
  socialLinks: Array<{ name: string; url: string; icon: React.ReactNode }>;
  productLinks: Array<{ label: string; href: string; subItems?: Array<{ label: string; href: string }> }>;
  companyLinks: Array<{ label: string; href: string }>;
  legalLinks: Array<{ label: string; href: string }>;
  newsletterEmail: string;
  copyrightText?: string;
  className?: string;
}

export interface FooterMegaLinkProps {
  href: string;
  children: React.ReactNode;
  subItems?: Array<{ label: string; href: string }>;
  variant?: 'default' | 'ghost';
  className?: string;
}

const footerVariants = {
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

const hoverVariants = {
  default: { scale: 1, rotate: 0 },
  hover: (i: number) => ({
    scale: 1.05 + i * 0.01,
    rotate: [0, -2, 2, 0],
    transition: { duration: 0.3, ease: 'easeOut' },
  }),
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: 'easeOut' },
  }),
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const newsletterVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -180 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

const staggerChildren = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const footerMega = ({
  brandName = 'Syntheon',
  tagline = 'Build your AI app in minutes.',
  socialLinks = [
    { name: 'Twitter', url: '#', icon: <span className="text-xl">𝕏</span> },
    { name: 'GitHub', url: '#', icon: <span className="text-xl">G</span> },
    { name: 'Discord', url: '#', icon: <span className="text-xl">#</span> },
  ],
  productLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'API Docs', href: '/docs/api' },
  ],
  companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  newsletterEmail = '',
  copyrightText = `© ${new Date().getFullYear()} Syntheon. All rights reserved.`,
  className,
}: FooterMegaProps) {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { margin: '0px 0px 100px 0px', amount: 0.5 });

  return (
    <footer
      className={cn(
        'relative bg-background/80 backdrop-blur-xl border-t border-border/20 pt-16 pb-8 overflow-hidden',
        'dark:bg-background dark:border-border/30',
        className,
      )}
      ref={ref}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0.3 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16"
          initial="hidden"
          animate={isInView ? 'visible' : ''}
          variants={{ visible: { transition: staggerChildren } }}
        >
          {/* Brand Column */}
          <motion.div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-start gap-3 mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={isInView ? { scale: 1, rotate: 0 } : ''}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-border/30"
              >
                <span className="text-2xl font-bold text-primary">S</span>
              </motion.div>
              <div>
                <h3 className={cn('text-xl font-semibold tracking-tight', 'dark:text-foreground')}>
                  {brandName}
                </h3>
                <p className="text-muted-foreground/70 text-sm mt-1">{tagline}</p>
              </div>
            </div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : ''}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-muted/50 rounded-2xl p-5 border border-border/20 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="h-8 px-3 text-xs bg-primary/10 text-primary border-primary/20">
                  Early Access
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">Join the waitlist</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle submission
                }}
                className="flex gap-2"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => console.log(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-background border-border/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button type="submit" size="sm" className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary hover:text-white shadow-sm">
                  Notify Me
                </Button>
              </form>

              <p className="text-xs text-muted-foreground/60 mt-3">
                By joining, you agree to our{' '}
                <a href="/privacy" className="underline hover:text-primary transition-colors">
                  Privacy Policy
                </a>.
              </p>
            </motion.div>
          </motion.div>

          {/* Product Links */}
          <motion.nav initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : ''}>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link, i) => (
                <motion.li key={link.href} variants={linkVariants}>
                  <FooterMegaLink href={link.href}>{link.label}</FooterMegaLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          {/* Company Links */}
          <motion.nav initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : ''}>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, i) => (
                <motion.li key={link.href} variants={linkVariants}>
                  <FooterMegaLink href={link.href}>{link.label}</FooterMegaLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          {/* Legal Links */}
          <motion.nav initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : ''}>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link, i) => (
                <motion.li key={link.href} variants={linkVariants}>
                  <FooterMegaLink href={link.href}>{link.label}</FooterMegaLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          {/* Social Links - spans 2 columns on mobile, 1 on desktop */}
          <motion.nav initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : ''}>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : ''}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all duration-300',
                    'bg-background border border-border/40 hover:border-primary/50 hover:bg-primary/10',
                    'dark:bg-background dark:border-border/30 dark:hover:bg-primary/20',
                  )}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.nav>

          {/* Copyright - spans remaining columns */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : ''}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-2 md:col-span-4 lg:col-span-1"
          >
            <p className={cn('text-sm text-muted-foreground/70', 'dark:text-muted-foreground/60')}>
              {copyrightText}
            </p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : ''}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-2 mt-4"
            >
              <span className="text-xs text-muted-foreground/50">Scroll to top</span>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/70 hover:text-primary transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 5 6-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </footer>
  );
};

export default footerMega;
