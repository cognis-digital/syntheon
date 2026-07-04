import { cn } from '@/lib/utils'
import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

export interface AboutPageProps {
  className?: string
  showTimeline: boolean
  showSkills: boolean
  showContact: boolean
}

const DEFAULT_PROPS: Required<AboutPageProps> = {
  className: '',
  showTimeline: true,
  showSkills: true,
  showContact: true,
}

export interface TimelineItem {
  year: string
  role: string
  company: string
  description: string
}

interface SkillCategory {
  name: string
  skills: string[]
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    year: '2024 - Present',
    role: 'Senior Product Engineer',
    company: 'Syntheon',
    description: 'Leading frontend architecture and design systems for enterprise SaaS platforms.',
  },
  {
    year: '2021 - 2024',
    role: 'Staff Frontend Engineer',
    company: 'TechCorp',
    description: 'Scaled Next.js applications to millions of daily active users.',
  },
  {
    year: '2018 - 2021',
    role: 'Senior UI Engineer',
    company: 'DesignStudio',
    description: 'Built accessible component libraries and motion design systems.',
  },
]

const SKILLS_DATA: SkillCategory[] = [
  {
    name: 'Frontend Architecture',
    skills: ['Next.js 15 (App Router)', 'TypeScript', 'React Server Components', 'RSC Patterns'],
  },
  {
    name: 'UI/UX Engineering',
    skills: ['Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'Design Tokens'],
  },
  {
    name: 'Performance & Quality',
    skills: ['Bundle Optimization', 'Core Web Vitals', 'Accessibility (WCAG)', 'Testing Strategies'],
  },
]

export default function AboutPage({ className, showTimeline, showSkills, showContact }: AboutPageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, [0, 1000], [0, 1])

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.setProperty('--scroll-progress', String(progress))
    }
  }, [progress])

  return (
    <motion.section
      ref={sectionRef}
      className={cn(
        'relative min-h-screen bg-background text-foreground overflow-hidden',
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-primary/30"
        style={{ width: 'var(--scroll-progress)' }}
      />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mb-8 inline-flex items-center justify-center rounded-full px-4 py-2 bg-primary/10 border border-border"
          >
            <span className="text-sm text-muted-foreground font-medium">
              Building digital experiences that matter
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-br from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent">
            The Engineer Behind the Code
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A product engineer and motion designer crafting premium interfaces with purposeful animation, 
            accessible patterns, and thoughtful detail.
          </p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/5 blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-8 top-1/3 w-24 h-24 rounded-full bg-accent/5 blur-[80px]"
          animate={{ scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Timeline Section */}
      {showTimeline && (
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative py-32 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-16 text-center"
            >
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Experience
              </span>
            </motion.h2>

            <div className="relative space-y-8">
              {TIMELINE_DATA.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8 md:pl-24 py-6 border-l-2 border-border/30 hover:border-primary/50 transition-colors"
                >
                  <div className="absolute left-[-9px] top-6 w-4 h-4 rounded-full bg-background border-2 border-primary shadow-lg" />

                  <time className="text-sm text-muted-foreground font-medium mb-1 block">
                    {item.year}
                  </time>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">{item.role}</h3>
                  <p className="text-lg text-primary/80 font-medium mb-3">{item.company}</p>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Skills Section */}
      {showSkills && (
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative py-32 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-16 text-center"
            >
              <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                Technical Focus
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SKILLS_DATA.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                  className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-card-hover transition-all"
                >
                  <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                  <ul className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.li
                        key={skillIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: skillIndex * 0.05 + 0.4 }}
                      >
                        <span className="inline-flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          {skill}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Contact CTA Section */}
      {showContact && (
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative py-32 px-6"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Let's Build Something Meaningful
            </motion.h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Currently open to select opportunities in product engineering and design systems.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-background text-foreground border border-border font-medium hover:bg-muted transition-colors"
              >
                View Projects
              </motion.a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, delay: 0.6 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-12 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ✉️
                </motion.span>
                hello@syntheon.example | <span className="font-mono">+1 (555) 123-4567</span>
              </span>
            </motion.p>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, delay: 0.2 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative py-12 px-6 border-t border-border/30"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Syntheon. Built with purpose and precision.
          </p>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ⚡️
            </motion.span>
            <span>Next.js 15 • TypeScript • Tailwind</span>
          </motion.div>
        </div>
      </motion.footer>

      {/* Floating decorative elements */}
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary/10 border border-border"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="fixed top-8 left-8 w-12 h-12 rounded-full bg-accent/10 border border-border"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.section>
  )
}
