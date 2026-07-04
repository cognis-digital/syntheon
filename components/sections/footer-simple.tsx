'use client'

import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FooterSimpleProps {
  className?: string
}

const footerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'none',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const FooterSimple = ({ className }: FooterSimpleProps) => {
  const ref = useInView({ threshold: 0.1 })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className={cn(
        'relative bg-background border-t border-border',
        'py-12 md:py-16 lg:py-20 px-4 md:px-8',
        'text-muted-foreground',
        className,
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          variants={childVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {/* Column 1: Brand + CTA */}
          <motion.div
            variants={childVariants}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div
                className="relative w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-6 h-6 text-primary"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-foreground">
                Syntheon
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-[280px]">
              Building premium digital experiences with motion, design, and engineering excellence.
            </p>

            <Button variant="primary" size="sm" className="group">
              <span className="relative z-10 flex items-center gap-2">
                Start your project
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </span>
            </Button>
          </motion.div>

          {/* Column 2: Product Links */}
          <motion.nav variants={childVariants} className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2.5">
              {['Features', 'Pricing', 'Changelog', 'Documentation'].map((item, i) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm hover:text-primary transition-colors duration-200"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {i % 2 === 0 && (
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-primary/30"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      />
                    )}
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Column 3: Company Links */}
          <motion.nav variants={childVariants} className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2.5">
              {['About', 'Careers', 'Press', 'Contact'].map((item, i) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm hover:text-primary transition-colors duration-200"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {i % 2 === 1 && (
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-primary/30"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.05 + 0.2 }}
                      />
                    )}
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-2"
            >
              <Badge variant="secondary" className="text-xs">
                v2.0.0 — Released today
              </Badge>
            </motion.div>
          </motion.nav>

          {/* Column 4: Newsletter */}
          <motion.form variants={childVariants} className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-xs leading-relaxed">
              Weekly updates on new features, case studies, and design insights.
            </p>

            <div className="flex gap-2 mt-1">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-9 px-3 text-sm bg-background/50 border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                aria-label="Email address for newsletter signup"
              />
              <Button size="sm" className="h-9 px-3 shrink-0">
                Subscribe
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/60 mt-1">
              Unsubscribe at any time. No spam, promise.
            </p>
          </motion.form>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={childVariants}
          className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-muted-foreground">
            © 2024 Syntheon. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {['Twitter', 'GitHub', 'Discord'].map((social, i) => (
              <a
                key={social}
                href="#"
                aria-label={`Follow us on ${social}`}
                className="text-xs hover:text-primary transition-colors duration-200"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-primary/30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                />
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative gradient accent */}
      <motion.div
        className="absolute left-0 bottom-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </motion.section>
  )
}

export type FooterSimpleProps = Parameters<typeof FooterSimple>[0]
