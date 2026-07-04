'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TeamInviteFormProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface TeamInviteFormData {
  emails: string[];
  role: 'member' | 'admin' | 'viewer';
}

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  index: number;
  onRemove?: (index: number) => void;
}

function EmailInput({ index, className, onRemove, ...props }: EmailInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 50, duration: 0.3 }}
      className={cn('relative flex items-center gap-2', className)}
    >
      <Input
        placeholder="name@example.com"
        type="email"
        autoComplete="off"
        {...props}
      />
      {onRemove && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => onRemove(index)}
          className="absolute right-1 p-1 text-muted-foreground hover:text-destructive transition-colors"
          aria-label={`Remove email ${index + 1}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 19L18 5M6 5L18 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
}

export interface RoleBadgeProps extends React.ComponentProps<typeof Badge> {
  role: TeamInviteFormData['role'];
}

function RoleBadge({ role, className }: RoleBadgeProps) {
  const colors = {
    member: 'bg-primary/10 text-primary border-border',
    admin: 'bg-destructive/15 text-destructive border-destructive/20',
    viewer: 'bg-muted-foreground/10 text-muted-foreground border-border',
  } as const;

  return (
    <Badge variant="outline" className={cn('capitalize font-medium', colors[role], className)}>
      {role}
    </Badge>
  );
}

function createEmailInput(initialIndex: number, onRemove?: (index: number) => void): React.ReactNode[] {
  const inputs = [];
  for (let i = initialIndex; i < initialIndex + 3; i++) {
    inputs.push(
      <EmailInput key={i} index={i} onRemove={onRemove} />
    );
  }
  return inputs;
}

export default function TeamInviteForm({ className, onSuccess, onError }: TeamInviteFormProps) {
  const [formData, setFormData] = useState<TeamInviteFormData>({ emails: [], role: 'member' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => (i === index ? value : email)).filter(Boolean),
    }));
  }, []);

  const handleRemoveEmail = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.emails.some(email => email.trim())) {
      setError('Please enter at least one email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (Math.random() > 0.2) {
      onSuccess?.();
    } else {
      onError?.('Failed to send invitations.');
    }

    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.05 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn('w-full max-w-md', className)}
    >
      <Card className="border-border/60 shadow-lg shadow-primary/5 backdrop-blur-sm bg-background/95">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                  Invite Team Members
                </CardTitle>
                <CardDescription className="mt-1 text-muted-foreground/80">
                  Add new collaborators to your workspace.
                </CardDescription>
              </div>
              {formData.emails.length > 0 && (
                <Badge variant="secondary" className="ml-2 shrink-0 animate-in fade-in slide-in-from-right-4 duration-300">
                  {formData.emails.length} added
                </Badge>
              )}
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <AnimatePresence initial={false}>
            {error && (
              <motion.div
                key="error"
                variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
                initial="hidden"
                animate="visible"
                className="p-3 rounded-md bg-destructive/15 border border-destructive/20 text-sm text-destructive flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="emails" className="text-sm font-medium text-muted-foreground/80">
                Email Addresses
              </Label>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
                className="space-y-2"
              >
                {createEmailInput(0, handleRemoveEmail)}
              </motion.div>
            </div>

            <Separator className="border-border/40"/>

            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-medium text-muted-foreground/80">
                Default Role
              </Label>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.2 }}
                className="flex gap-3"
              >
                {(['member', 'admin', 'viewer'] as const).map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={formData.role === role ? 'default' : 'outline'}
                    className={cn(
                      'flex-1 py-2.5 text-sm font-medium transition-all',
                      formData.role === role && 'bg-primary/10 ring-1 ring-inset ring-primary/40 shadow-inner',
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, role }))}
                  >
                    <span className="capitalize">{role}</span>
                  </Button>
                ))}
              </motion.div>
            </div>

            <Separator className="border-border/40"/>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.2 }}
            >
              <Button
                type="submit"
                size="lg"
                className={cn(
                  'w-full py-6 text-lg font-semibold tracking-wide',
                  isSubmitting && 'animate-pulse bg-primary/80',
                )}
                disabled={isSubmitting || !formData.emails.some(e => e.trim())}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%' }}
                    />
                    Sending Invitations...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12h18M3 6l9 7 9-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    Send Invitations
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.2 }}
            className="text-xs text-center text-muted-foreground/60"
          >
            Recipients will receive an email with a secure invitation link.
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export type { TeamInviteFormData, TeamInviteFormProps };
