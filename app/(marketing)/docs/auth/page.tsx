'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Copy, Check, Terminal, Zap, Shield, Layers, Globe, Sparkles, Code2, PlayCircle } from 'lucide-react';

interface AuthPageProps {
  className?: string;
}

const variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }),
};

const heroVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 1.2,
      ease: [0.65, 0.05, 0.36, 1],
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  },
};

export interface AuthDocsPageProps {
  className?: string;
}

export default function AuthDocsPage({ className }: AuthPageProps) {
  const { scrollYProgress } = useScroll();
  const heroRef = useInView<HTMLDivElement>(scrollYProgress, { margin: '-100px' });
  
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 0.3], [0, 40]);

  return (
    <motion.div 
      initial="initial"
      animate={heroRef ? 'animate' : 'initial'}
      variants={heroVariants}
      className={cn(
        "min-h-screen bg-background text-foreground selection:bg-primary/30",
        className
      )}
    >
      {/* Hero Section */}
      <motion.section 
        style={{ y: y1 }}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        
        {/* Floating particles effect */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 - 50, 
              y: Math.random() * 100 - 50,
              scale: 0.2 + Math.random() * 0.3,
              opacity: 0.1 + Math.random() * 0.2
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 40],
              y: [0, (Math.random() - 0.5) * 40],
              scale: [0.2 + Math.random() * 0.3, 0.3 + Math.random() * 0.2, 0.2 + Math.random() * 0.3]
            }}
            transition={{ 
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-px h-px bg-primary/40 rounded-full blur-sm"
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/50">
              <Sparkles className="w-3 h-3 mr-2 text-primary" />
              Documentation v2.0
            </Badge>
          </motion.div>

          <h1 
            style={{ y: y2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-purple-300 to-primary text-transparent bg-clip-text"
          >
            Auth System
          </h1>

          <p 
            style={{ y: y2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Build secure, scalable authentication flows with Syntheon&apos;s production-ready primitives.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" variant="primary">
              Start Building
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              View API Reference
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-px h-16 bg-gradient-to-b from-primary to-transparent rounded-full blur-sm"
          />
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What You Get
          </h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={variants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "OAuth 2.0 / OIDC compliant with PKCE support and automatic token refresh."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized auth flows that feel instant. Zero perceived latency on mobile."
              },
              {
                icon: Globe,
                title: "Multi-tenant Ready",
                description: "Isolated sessions per tenant with configurable domains and subdomains."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={variants.visible(i)}
                className="group"
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Quick Start
          </h2>

          <Tabs defaultValue="react" className="w-full">
            <ScrollArea className="no-scrollbar">
              <div className="flex gap-4 pb-4 min-w-max">
                {['React', 'Next.js App Router'].map((tab, i) => (
                  <TabsTrigger 
                    key={i} 
                    value={tab.toLowerCase()}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </div>

              <ScrollArea className="no-scrollbar">
                <div className="flex flex-col gap-4 min-h-[50vh]">
                  {[
                    `// Install the Auth SDK\nnpm install @syntheon/auth\n\n// Initialize with your provider configuration\nimport { createAuthClient } from '@syntheon/auth';\n\nconst auth = createAuthClient({\n  provider: 'auth0',\n  clientId: process.env.AUTH_CLIENT_ID,\n});\n\n// Use in your component\nfunction LoginButton() {\n  const [user, setUser] = useState(null);\n\n  return (\n    <button onClick={() => auth.signIn()}>Sign In</button>\n  );\n}`,
                    `// App Router integration (Next.js 15+)\nimport { AuthProvider } from '@syntheon/auth/react';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>\n        <AuthProvider client={auth}>\n          {children}\n        </AuthProvider>\n      </body>\n    </html>;\n  );\n}`,
                  ].map((code, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    >
                      <pre className="bg-background rounded-xl border-border/50 p-6 overflow-x-auto">
                        <code className="text-sm font-mono leading-relaxed text-foreground">
                          {code}
                        </code>
                      </pre>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </ScrollArea>
          </Tabs>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-8 text-center"
          >
            <Button variant="outline">
              Read Full API Reference
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-200 to-primary text-transparent bg-clip-text">
            Ready to Build?
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of developers shipping production authentication at scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="primary" className="px-8 py-6 text-lg">
              Get Started Free
              <PlayCircle className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            No credit card required · 14-day free trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Syntheon. Built with ❤️ for developers.
          </p>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">API Reference</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </nav>
        </div>
      </footer>

      {/* Custom cursor trail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed inset-0 pointer-events-none z-50"
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0.2 }}
            animate={{ 
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              scale: [0.2, 0.8 + Math.random()],
            }}
            transition={{ 
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
            className="absolute w-px h-px bg-primary/60 rounded-full blur-sm"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export interface AuthDocsPageProps {
  className?: string;
}
