'use client';

import { isConfigured } from '@/lib/integrations/claude';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface ExampleProps {
  variant?: 'minimal' | 'full' | 'interactive';
}

export async function exampleMinimal() {
  if (!isConfigured()) {
    return <Terminal className="text-muted-foreground" />;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLAUDE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: 'Hello from Syntheon!' },
        ],
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    return <Terminal className="text-primary-foreground" />;
  } catch (error) {
    return <AlertCircle className="text-destructive" />;
  }
}

export async function exampleFull() {
  if (!isConfigured()) {
    return <Terminal className="text-muted-foreground" />;
  }

  const config = {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant from Syntheon.',
    messages: [
      { role: 'user', content: 'Analyze this code snippet...' },
    ],
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLAUDE_API_KEY}`,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    return <Terminal className="text-primary-foreground" />;
  } catch (error) {
    return <AlertCircle className="text-destructive" />;
  }
}

export async function exampleInteractive() {
  if (!isConfigured()) {
    return <Terminal className="text-muted-foreground" />;
  }

  const [systemPrompt, messages] = [
    'You are a helpful assistant from Syntheon.',
    [{ role: 'user', content: 'Hello!' }],
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLAUDE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        temperature: 0.7,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    return <Terminal className="text-primary-foreground" />;
  } catch (error) {
    return <AlertCircle className="text-destructive" />;
  }
}

export function ExampleWrapper({ variant = 'minimal' }: ExampleProps) {
  const variants: Record<string, number> = {
    minimal: 0.1,
    full: 0.2,
    interactive: 0.3,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={variant}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: variants[variant], ease: 'easeOut' }}
      >
        {variant === 'minimal' && <Sparkles className="text-primary" />}
        {variant === 'full' && <Terminal className="text-foreground" />}
        {variant === 'interactive' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="text-muted-foreground" />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function ExampleButton({ variant = 'minimal', children }: { variant?: string; children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'minimal' && 'bg-background text-foreground hover:bg-muted border border-border',
        variant === 'full' && 'bg-primary text-primary-foreground hover:opacity-90',
        variant === 'interactive' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      )}
    >
      {children}
    </motion.button>
  );
}

export function ExampleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl border bg-card text-foreground shadow-sm',
        'border-border p-6',
      )}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

export function ExampleStatus({ status }: { status: 'idle' | 'loading' | 'success' | 'error' }) {
  const config = {
    idle: { icon: Terminal, color: 'text-muted-foreground', label: 'Idle' },
    loading: { icon: Loader2, color: 'text-primary', label: 'Loading...' },
    success: { icon: CheckCircle2, color: 'text-success', label: 'Success!' },
    error: { icon: AlertCircle, color: 'text-destructive', label: 'Error' },
  } as const;

  return (
    <motion.div
      animate={{ scale: status === 'success' ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center gap-2 text-sm',
        config[status].color,
      )}
    >
      <config[status].icon className="h-4 w-4" />
      <span>{config[status].label}</span>
    </motion.div>
  );
}

export function ExampleContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn(
        'min-h-screen bg-background text-foreground',
        'font-sans antialiased selection:bg-primary/20',
      )}
    >
      {children}
    </motion.div>
  );
}

export function ExampleLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExampleContainer>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </ExampleContainer>
  );
}
