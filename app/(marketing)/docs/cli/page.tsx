import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronRight, Copy, Terminal, Zap, Box, Layers, Globe, Command, ArrowRight, CheckCircle2, Clock, Star } from 'lucide-react';

interface DocSectionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' }
  })
};

const codeBlockVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

export const metadata = {
  title: 'CLI — Syntheon Docs',
  description: 'Command-line interface for the Syntheon app builder. Build faster with intelligent scaffolding and zero-config workflows.',
  keywords: ['cli', 'syntheon', 'app-builder', 'scaffolding'],
};

export type DocSectionProps = {
  title: string;
  children: React.ReactNode;
  id?: string;
};

const Section = ({ title, children, id }: DocSectionProps) => (
  <motion.section
    id={id}
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
    custom={0}
    className="py-16 scroll-mt-32 border-b border-border/50 last:border-0"
  >
    <h2 className="text-3xl font-semibold text-primary mb-8 tracking-tight">{title}</h2>
    {children}
  </motion.section>
);

const CodeBlock = ({ code, label }: { code: string; label?: string }) => (
  <div className="relative group">
    <pre className="bg-background/50 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-border/30">
      <code>{code}</code>
    </pre>
    {label && (
      <span className="absolute -top-2.5 right-3 bg-background px-2 py-1 text-xs rounded-full text-muted-foreground border border-border/30">
        {label}
      </span>
    )}
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    className="group p-6 rounded-xl bg-background/30 border border-border/20 hover:border-primary/40 hover:bg-background/50 transition-all duration-300"
  >
    <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  return (
    <motion.div style={{ backgroundPositionY: y1 }} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-transparent" />
      
      {/* Animated gradient orbs */}
      <motion.div
        style={{ backgroundPositionY: y2 }}
        className="absolute -left-48 top-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[128px]"
      />
      <motion.div
        style={{ backgroundPositionY: y2 }}
        className="absolute -right-48 bottom-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[128px]"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Syntheon CLI v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-background via-foreground to-foreground bg-clip-text text-transparent">
            Build apps at the speed of thought.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The command-line interface for rapid application development with intelligent scaffolding, zero-config workflows, and seamless integration into your existing stack.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background font-medium hover:bg-primary/90 transition-colors"
            >
              <Terminal className="w-4 h-4" />
              <span>Get started</span>
            </motion.button>

            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-muted-foreground border border-border/50 font-medium hover:bg-background/80 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>Read docs</span>
            </motion.a>
          </div>

          {/* Animated command preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 p-4 rounded-xl bg-background/50 border border-border/30 max-w-md mx-auto"
          >
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">$</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="font-mono text-sm"
              >
                npx syntheon create my-app --template=starter
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-8 rounded-full border-l-2 border-t-2 border-border/30"
          />
          <span className="text-xs">Scroll to explore</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const QuickStart = () => {
  const commands = [
    { desc: 'Create a new project', cmd: 'npx syntheon create my-app' },
    { desc: 'Add a feature scaffold', cmd: 'syntheon add feature --name=auth' },
    { desc: 'Generate API routes', cmd: 'syntheon generate api /users' },
  ];

  return (
    <Section title="Quick Start" id="quick-start">
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
        {commands.map((item, i) => (
          <motion.div
            key={i}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={i + 3}
            className="p-6 rounded-xl bg-background/30 border border-border/20 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="font-mono text-sm text-muted-foreground">{item.cmd}</span>
            </div>
            <p className="text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <CodeBlock
        code={`# Install CLI globally
npm install -g syntheon-cli

# Start a new project
npx syntheon create my-app --template=starter

# Add features as you build
syntheon add feature --name=dashboard
syntheon add component --name=UserProfile`}
        label="Installation"
      />
    </Section>
  );
};

const Features = () => {
  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Optimized scaffolding that generates production-ready code in milliseconds.' },
    { icon: Box, title: 'Smart Templates', description: 'Choose from curated starter templates or create your own.' },
    { icon: Layers, title: 'Modular Architecture', description: 'Build with a component-first mindset and automatic dependency management.' },
    { icon: Globe, title: 'Platform Agnostic', description: 'Works across frameworks, languages, and deployment targets.' },
  ];

  return (
    <Section title="Features" id="features">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} delay={i * 0.1} />
        ))}
      </div>

      {/* Feature highlight */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/30"
      >
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Production-ready by default</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every scaffold includes TypeScript configuration, proper error handling, and best practices baked in. Ship faster with confidence.
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

const Installation = () => {
  const [copied, setCopied] = useState(false);

  const installCommand = `npm install -g syntheon-cli`;

  return (
    <Section title="Installation" id="installation">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Install the CLI globally to use it from any terminal. The installer includes all dependencies and sets up your PATH automatically.
        </p>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative group"
        >
          <pre className="bg-background/50 rounded-xl p-6 font-mono text-sm overflow-x-auto border border-border/30">
            <code>{installCommand}</code>
          </pre>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigator.clipboard.writeText(installCommand);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute top-3 right-3 p-2 rounded-lg bg-background text-muted-foreground border border-border/30 hover:text-primary transition-colors"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-3 right-14 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-medium"
              >
                Copied to clipboard!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-8 p-4 rounded-lg bg-background/30 border border-border/20">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Pro tip
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Use the <code>--verbose</code> flag during installation to see detailed output and verify your PATH was updated correctly.
          </p>
        </div>
      </div>
    </Section>
  );
};

const FAQ = () => {
  const faqs = [
    { q: 'Is this free?', a: 'Yes, the CLI is open source and free to use. Commercial support plans are available.' },
    { q: 'What platforms does it support?', a: 'Works on macOS, Windows (WSL), and Linux. Cross-platform with native terminal integration.' },
    { q: 'Can I customize templates?' a: 'Absolutely. Create your own templates and share them with the community or use privately.' },
  ];

  return (
    <Section title="FAQ" id="faq">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <h4 className="font-medium mb-2">{faq.q}</h4>
            <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-border/30">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Command className="w-4 h-4" />
          Need help?
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Join our community on Discord or check the GitHub Discussions for common questions and troubleshooting tips.
        </p>
      </div>
    </Section>
  );
};

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">Syntheon CLI</span>
          </div>
        </motion.div>

        <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto">
          Built with ❤️ for developers who ship fast. Open source, community-driven, and always improving.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          <a href="#" className="hover:text-primary transition-colors">Discord</a>
          <a href="#" className="hover:text-primary transition-colors">Twitter</a>
        </motion.div>

        <div className="mt-8 pt-8 border-t border-border/30 text-xs text-muted-foreground">
          © 2024 Syntheon. Open source under MIT License.
        </div>
      </div>
    </footer>
  );
};

export default function CLIDocsPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <motion.main
      style={{ backgroundPositionY: y }}
      className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary"
    >
      {/* Navigation hint */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <Terminal className="w-4 h-4" />
            <span>Docs</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#quick-start" className="text-muted-foreground hover:text-primary transition-colors">Quick Start</a>
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
