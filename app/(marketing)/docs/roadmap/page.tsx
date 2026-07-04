import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ChevronRight, CheckCircle2, Zap, Rocket, Globe, Layers, Code, Sparkles } from 'lucide-react'

interface RoadmapItemProps {
  phase: string
  year: number
  status: 'completed' | 'current' | 'upcoming'
  features: string[]
}

const roadmapItems: RoadmapItemProps[] = [
  {
    phase: 'Foundation',
    year: 2024,
    status: 'completed',
    features: ['Core App Builder Engine', 'Visual Component Library', 'Basic Motion System']
  },
  {
    phase: 'Growth',
    year: 2025,
    status: 'current',
    features: ['Advanced Animation API', 'Multi-Platform Export', 'Real-Time Collaboration']
  },
  {
    phase: 'Scale',
    year: 2026,
    status: 'upcoming',
    features: ['Enterprise Integrations', 'AI-Assisted Design', 'Global CDN Distribution']
  }
]

const Hero = () => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 via-background to-background pointer-events-none" />
    
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="text-center max-w-4xl px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8 flex justify-center"
      >
        <Badge 
          variant="secondary" 
          className="px-4 py-2 text-sm font-medium bg-violet-100/50 border-violet-200 hover:bg-violet-100 transition-colors duration-300"
        >
          <Sparkles className="w-4 h-4 mr-2 text-violet-600" />
          v2.0 Roadmap
        </Badge>
      </motion.div>

      <h1 
        className={cn(
          "text-5xl md:text-7xl font-bold tracking-tight mb-8",
          "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
        )}
      >
        Building the Future of App Development
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
      >
        A transparent look at where Syntheon is going and how we're getting there. 
        Every milestone brings us closer to redefining what's possible with motion-first design.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg" className="min-w-[160px] bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 group">
          Read Full Roadmap
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button size="lg" variant="outline" className="min-w-[160px] border-violet-300 hover:bg-violet-50">
          Subscribe to Updates
        </Button>
      </div>
    </motion.div>

    {/* Background decorative elements */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1 }}
      className="absolute -right-32 top-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
    />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
      className="absolute -left-32 bottom-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
    />
  </motion.section>
)

const TimelineItem = ({ item, index }: { item: RoadmapItemProps; index: number }) => {
  const isCompleted = item.status === 'completed'
  const isCurrent = item.status === 'current'

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-8 py-4"
    >
      {/* Connecting line */}
      <div 
        className={cn(
          "absolute left-[5px] top-2 w-0.5 h-full transition-colors duration-500",
          isCompleted ? "bg-violet-300/50" : 
          isCurrent ? "bg-gradient-to-b from-violet-600 to-purple-600" : 
          "bg-muted"
        )}
      />

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", duration: 0.5, delay: index * 0.1 + 0.2 }}
        className={cn(
          "absolute left-0 top-3 w-4 h-4 rounded-full border-2 z-10 transition-colors duration-500",
          isCompleted ? "bg-white border-violet-300" : 
          isCurrent ? "bg-white border-violet-600 shadow-lg shadow-violet-500/25" : 
          "bg-muted border-muted-foreground/40"
        )}
      />

      {/* Content card */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 group">
        {isCurrent && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"
          />
        )}

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={cn(
                "text-lg font-semibold mb-1",
                isCurrent ? "text-violet-700" : "text-foreground"
              )}>
                {item.phase}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isCompleted ? "bg-violet-400" : 
                  isCurrent ? "bg-violet-600 animate-pulse" : 
                  "bg-muted-foreground/40"
                )} />
                {item.year}
              </p>
            </div>

            <Badge 
              variant={isCompleted ? "secondary" : isCurrent ? "default" : "outline"}
              className="ml-2 shrink-0"
            >
              {isCompleted ? 'Done' : isCurrent ? 'Now' : 'Coming'}
            </Badge>
          </div>

          <ul className="space-y-2">
            {item.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <CheckCircle2 className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isCompleted ? "text-violet-500" : 
                  isCurrent ? "text-violet-600" : 
                  "text-muted-foreground/50"
                )} />
                <span className={isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}>
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Hover effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-violet-500/20 to-purple-500/20"
            aria-hidden="true"
          />
        </CardContent>
      </Card>

      {/* Staggered entrance for list items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 + 0.3, duration: 0.4 }}
      />
    </motion.div>
  )
}

const FeatureHighlights = () => {
  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "60fps animations across all devices" },
    { icon: Globe, title: "Global Scale", desc: "CDN-optimized for worldwide users" },
    { icon: Layers, title: "Modular Design", desc: "Composable components that work together" },
    { icon: Code, title: "Type-Safe", desc: "Full TypeScript coverage from top to bottom" }
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Developers Love Us</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built by motion designers, for motion designers. We've spent years perfecting the details that make a difference.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:border-violet-300/50 transition-colors duration-300 group">
                <CardContent className="p-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    "bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950/30 dark:to-purple-950/30",
                    "group-hover:scale-110 transition-transform duration-300"
                  )}>
                    <feature.icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTASection = () => (
  <section className="py-24 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-12 md:p-16"
      >
        {/* Animated background pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1.5 }}
          transition={{ delay: 0.3, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"
        />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-violet-100/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of developers who have already started their journey with Syntheon. 
            Start building your next project today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="min-w-[180px] bg-white text-violet-700 hover:bg-violet-50 shadow-xl shadow-black/20 transition-all duration-300 group">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="min-w-[180px] border-white/30 text-white hover:bg-white/10">
              View Documentation
            </Button>
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          />
        </div>
      </motion.div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="py-12 px-6 border-t border-border">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Syntheon. All rights reserved.
      </p>
      <nav className="flex gap-6 text-sm">
        <a href="#" className="hover:text-violet-600 transition-colors duration-200">Privacy</a>
        <a href="#" className="hover:text-violet-600 transition-colors duration-200">Terms</a>
        <a href="#" className="hover:text-violet-600 transition-colors duration-200">Contact</a>
      </nav>
    </div>
  </footer>
)

export interface RoadmapPageProps {
  params: Promise<{ slug: string }>
}

export const metadata = {
  title: 'Roadmap — Syntheon Docs',
  description: 'A transparent look at where Syntheon is going and how we\'re getting there. Every milestone brings us closer to redefining what\'s possible with motion-first design.',
  keywords: ['roadmap', 'docs', 'syntheon', 'app-builder', 'motion-design'],
}

export default async function RoadmapPage() {
  const scroll = useScroll()
  
  // Parallax effect for hero background
  const y1 = useTransform(scroll.scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scroll.scrollY, [0, 800], [0, -50])

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      {/* Parallax layers */}
      <motion.div style={{ y: y1, willChange: "transform" }} className="fixed inset-0 pointer-events-none z-0" />
      <motion.div style={{ y: y2, willChange: "transform" }} className="fixed inset-0 pointer-events-none z-0" />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Journey</h2>
              <p className="text-muted-foreground max-w-xl">
                From our earliest days to what's coming next, here's how we've grown and where we're headed.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical center line */}
              <div 
                className={cn(
                  "absolute left-4 md:left-1/2 top-0 h-full w-0.5",
                  "bg-gradient-to-b from-violet-300 via-violet-200 to-transparent"
                )}
              />

              {/* Timeline items */}
              <div className="flex flex-col">
                {roadmapItems.map((item, i) => (
                  <TimelineItem key={i} item={item} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Decorative gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="absolute -right-64 bottom-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"
          />
        </section>

        <FeatureHighlights />
        
        <CTASection />
      </main>

      <Footer />
    </motion.main>
