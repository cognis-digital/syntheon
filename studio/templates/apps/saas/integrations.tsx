import React from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IntegrationLogoProps {
  name: string;
  url?: string;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
}

const INTEGRATIONS = [
  { name: 'Stripe', url: 'https://stripe.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'AWS', url: 'https://aws.amazon.com' },
  { name: 'Vercel', url: 'https://vercel.com' },
  { name: 'PostgreSQL', url: 'https://www.postgresql.org' },
  { name: 'Docker', url: 'https://www.docker.com' },
  { name: 'Turbopack', url: 'https://turbo.build' },
  { name: 'Prisma', url: 'https://www.prisma.io' },
];

const SIZE_CONFIG = {
  sm: { w: 64, h: 32, scale: 0.95 },
  md: { w: 80, h: 40, scale: 1 },
  lg: { w: 96, h: 48, scale: 1.05 },
};

export interface IntegrationsProps {
  className?: string;
  title?: string;
}

const IntegrationLogo = ({ name, url, size = 'md', delay }: IntegrationLogoProps) => {
  const config = SIZE_CONFIG[size];
  
  return (
    <motion.a
      href={url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group flex items-center justify-center overflow-hidden rounded-lg border border-border bg-background/50 dark:bg-muted/40 transition-all duration-300 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/10 dark:hover:shadow-primary/20"
      style={{ width: config.w, height: config.h }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        transition: { duration: 0.5, delay: delay * 0.1 }
      }}
      whileInView={{ 
        scale: [config.scale, 1.1, config.scale],
        transition: { duration: 0.6 }
      }}
      viewport={{ once: true }}
      className="flex items-center justify-center"
    >
      <span 
        className={cn(
          "text-xs font-medium tracking-wide text-foreground/70 dark:text-muted-foreground group-hover:text-primary transition-colors",
          size === 'sm' && "text-[10px]",
          size === 'lg' && "text-sm"
        )}
      >
        {name}
      </span>
    </motion.a>
  );
};

export interface IntegrationsGridProps {
  items: IntegrationLogoProps[];
  columns?: number | 'auto';
  className?: string;
}

const IntegrationsGrid = ({ 
  items, 
  columns = 'auto', 
  className 
}: IntegrationsGridProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getColumns = () => {
    if (columns === 'auto') {
      return isScrolled ? 4 : 2;
    }
    return columns;
  };

  const colCount = getColumns();

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "grid gap-6",
        isScrolled 
          ? `grid-cols-${colCount} sm:grid-cols-${Math.min(colCount * 2, 4)}` 
          : `grid-cols-1 sm:grid-cols-${Math.min(colCount, 2)}`,
        className
      )}
    >
      {items.map((item, index) => (
        <IntegrationLogo key={index} {...item} delay={index} />
      ))}
    </motion.div>
  );
};

const IntegrationsSection = ({ className }: IntegrationsProps) => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold: 0.1 }
      );
      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 48 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren"
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.5, 
        delay: i * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden py-24 sm:py-32",
        inView ? "" : "animate-in fade-in duration-700"
      )}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-transparent dark:via-muted/10 pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground dark:text-foreground"
          >
            Trusted by the best
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We integrate seamlessly with the tools you already love and trust.
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-6"
        >
          {INTEGRATIONS.map((integration, i) => (
            <IntegrationLogo 
              key={integration.name}
              {...integration}
              size="lg"
              delay={i}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <a 
            href="/integrations/all"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 hover:bg-primary/7 transition-colors border border-border dark:border-muted-foreground/40 dark:hover:border-muted-foreground/60 text-sm font-medium text-foreground dark:text-foreground"
          >
            View all integrations
            <svg 
              className="w-4 h-4 ml-1 opacity-50 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] dark:bg-primary/10 pointer-events-none"
      />
    </section>
  );
};

export interface IntegrationsWithHeaderProps {
  className?: string;
}

const IntegrationsWithHeader = ({ className }: IntegrationsWithHeaderProps) => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    let observer: IntersectionObserver | null = null;

    if (headerRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => setIsScrolled(entry.isIntersecting),
        { threshold: 0.5 }
      );
      observer.observe(headerRef.current);
    }

    return () => observer?.disconnect();
  }, []);

  const headerVariants = {
    initial: { opacity: 1, y: 0 },
    scrolled: { 
      opacity: 0.85, 
      y: -24,
      transition: { duration: 0.3 }
    },
  };

  return (
    <div className={cn("relative", className)}>
      <motion.div
        ref={headerRef}
        variants={headerVariants}
        initial="initial"
        animate={isScrolled ? "scrolled" : "initial"}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 dark:bg-muted/30 border-b border-border/50 dark:border-muted-foreground/20 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground dark:text-foreground">
            Integrations
          </h1>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary/5 hover:bg-primary/7 transition-colors border border-border dark:border-muted-foreground/40 dark:hover:border-muted-foreground/60 text-foreground dark:text-foreground"
            >
              Get started
            </motion.button>

            <a 
              href="/integrations/docs"
              className="p-2 rounded-md hover:bg-primary/5 transition-colors border border-border dark:border-muted-foreground/40 dark:hover:border-muted-foreground/60 text-foreground dark:text-foreground"
              aria-label="Documentation"
            >
              <svg 
                className="w-4 h-4 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>

      <IntegrationsSection />
    </div>
  );
};

export interface IntegrationsFullProps {
  className?: string;
}

const IntegrationsFull = ({ className }: IntegrationsFullProps) => {
  return (
    <main 
      className={cn(
        "min-h-screen bg-background dark:bg-muted",
        className
      )}
    >
      <IntegrationsWithHeader />
      
      <section className="py-24 border-t border-border/50 dark:border-muted-foreground/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-semibold text-foreground dark:text-foreground">
                Seamless integrations for your workflow
              </h2>

              <ul 
                role="list"
                className="space-y-4 text-muted-foreground"
              >
                {[
                  "One-click OAuth setup with 50+ providers",
                  "Real-time webhook sync and event streaming",
                  "Secure API keys encrypted at rest",
                  "Detailed audit logs for compliance",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <svg 
                      className="w-5 h-5 text-primary inline-block mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </ul>

              <a 
                href="/integrations/docs/setup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 transition-colors text-sm font-medium text-primary-foreground"
              >
                Read the documentation
                <svg 
                  className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl blur-3xl",
                  "dark:from-primary/10 pointer-events-none"
                )}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative z-10 bg-card dark:bg-muted border border-border rounded-3xl p-8 shadow-xl shadow-primary/5 dark:shadow-primary/10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center",
                      "dark:bg-primary/20"
                    )}
                  >
                    <svg 
                      className="w-6 h-6 text-primary dark:text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
                      Live Status
                    </h3>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 dark:bg-muted/40 border border-border dark:border-muted-foreground/20">
                    <span className="text-sm text-muted-foreground">API Uptime</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <span 
                        className={cn(
                          "w-2 h-2 rounded-full bg-green-500 animate-pulse",
                          "dark:bg-green-400"
                        )}
                      />
                      99.98% (30 days)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 dark:bg-muted/40 border border-border dark:border-muted-foreground/20">
                    <span className="text-sm text-muted-foreground">Webhooks</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <svg 
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 dark:bg-muted/40 border border-border dark:border-muted-foreground/20">
                    <span className="text-sm text-muted-foreground">Event Queue</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
