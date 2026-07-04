'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface RichTextEditorLiteProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  toolbarPosition?: 'top' | 'bottom';
}

export interface RichTextEditorLitePropsInterface extends RichTextEditorLiteProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  toolbarPosition?: 'top' | 'bottom';
}

const formatButtons = [
  { name: 'bold', icon: <strong>B</strong>, shortcut: 'Ctrl+B' },
  { name: 'italic', icon: <em>I</em>, shortcut: 'Ctrl+I' },
  { name: 'underline', icon: <u>U</u>, shortcut: 'Ctrl+U' },
  { name: 'strike', icon: <s>S</s>, shortcut: '' },
];

const listButtons = [
  { name: 'orderedList', icon: <ol><li>1</li></ol>, shortcut: '' },
  { name: 'unorderedList', icon: <ul><li>-</li></ul>, shortcut: '' },
];

export default function RichTextEditorLite({
  value = '',
  onChange,
  placeholder = 'Start typing your story...',
  disabled = false,
  className,
  toolbarPosition = 'top',
}: RichTextEditorLiteProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div
      className={cn(
        'relative rounded-xl border bg-background shadow-sm transition-all duration-300 ease-out',
        isFocused ? 'ring-2 ring-primary/50' : 'border-border hover:border-border/80',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <div className="flex flex-col h-full min-h-[240px]">
        {toolbarPosition === 'top' ? (
          <Toolbar
            buttons={formatButtons.concat(listButtons)}
            disabled={disabled || !isFocused}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        ) : null}

        <div
          contentEditable
          suppressContentEditableWarning
          aria-multiline="true"
          role="textbox"
          aria-label={placeholder || 'Rich text editor'}
          className={cn(
            'flex-1 outline-none px-4 py-3 min-h-[200px]',
            isFocused ? 'text-foreground' : 'text-muted-foreground',
            placeholder && !value && !isFocused ? 'text-muted-foreground/60 italic' : ''
          )}
          style={{ minHeight: '180px', maxHeight: 'none' }}
          onFocus={(e) => {
            setIsFocused(true);
            if (onChange) onChange(e.currentTarget.innerText || '');
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onChange) onChange(e.currentTarget.innerText || '');
          }}
          onInput={(e) => {
            const text = e.currentTarget.innerText;
            if (onChange) onChange(text);
          }}
          placeholder={placeholder}
        />

        {toolbarPosition === 'bottom' ? (
          <Toolbar
            buttons={formatButtons.concat(listButtons)}
            disabled={disabled || !isFocused}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        ) : null}
      </div>
    </div>
  );
}

function Toolbar({
  buttons,
  disabled,
  onFocus,
  onBlur,
}: {
  buttons: Array<{ name: string; icon: React.ReactNode; shortcut?: string }>;
  disabled: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border/50',
        toolbarPosition === 'bottom' && 'border-t border-border/50 border-b-0'
      )}
    >
      {buttons.map((btn) => (
        <ToolbarButton
          key={btn.name}
          name={btn.name}
          icon={btn.icon}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ))}
    </motion.div>
  );
}

function ToolbarButton({
  name,
  icon,
  disabled,
  onFocus,
  onBlur,
}: {
  name: string;
  icon: React.ReactNode;
  disabled: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: name.charCodeAt(0) * 0.02, duration: 0.3, ease: 'easeOut' }}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        disabled && 'opacity-40 cursor-not-allowed',
        name === 'bold' ? 'font-bold' : ''
      )}
      aria-label={`Format ${name}`}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <span className="text-sm">{icon}</span>
      {name !== 'bold' && (
        <span className="ml-1 text-xs text-muted-foreground hidden sm:inline">
          {name.replace(/([A-Z])/g, ' $1').trim()}
        </span>
      )}
    </motion.button>
  );
}

RichTextEditorLite.displayName = 'RichTextEditorLite';
