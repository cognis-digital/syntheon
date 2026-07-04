'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BentoItemProps {
  type: 'text' | 'image' | 'button' | 'input' | 'badge' | 'divider';
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
}

interface BentoGridProps {
  columns?: number;
  gap?: string;
  padding?: string;
  darkMode?: boolean;
  className?: string;
  items: BentoItemProps[];
}

type BentoItemType = 'text' | 'image' | 'button' | 'input' | 'badge' | 'divider';

export interface BentoGridItemProps {
  type: BentoItemType;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
}

export interface BentoGridProps {
  columns?: number;
  gap?: string;
  padding?: string;
  darkMode?: boolean;
  className?: string;
  items: BentoGridItemProps[];
}

const DEFAULT_ITEMS: BentoGridItemProps[] = [
  { type: 'text', variant: 'default', size: 'md', children: <h3 className="text-xl font-bold">AI App Builder</h3> },
  { type: 'text', variant: 'secondary', size: 'sm', children: <p className="text-muted-foreground">Build production-ready AI applications in minutes, not months.</p> },
  { type: 'button', variant: 'primary', size: 'md', children: <Button>Get Started</Button> },
  { type: 'image', variant: 'default', size: 'lg', children: <div className="aspect-square bg-muted rounded-lg" /> },
  { type: 'badge', variant: 'secondary', size: 'sm', children: <Badge>AI-Powered</Badge> },
  { type: 'divider', variant: 'default', size: 'md', children: <div className="h-px w-full bg-border" /> },
];

const ItemRenderer = ({ item }: { item: BentoGridItemProps }) => {
  const baseClasses = cn(
    'flex flex-col justify-center items-center p-6 transition-all duration-300 hover:scale-[1.02]',
    {
      'rounded-lg': true,
      'bg-background': true,
      'border border-border': true,
      'shadow-sm': item.variant === 'default',
      'shadow-md': item.variant === 'primary',
      'ring-2 ring-primary/50 shadow-lg': item.variant === 'secondary',
      'rounded-xl': item.size === 'lg' || item.size === 'xl',
      'rounded-full': item.size === 'sm',
    }
  );

  const renderContent = () => {
    switch (item.type) {
      case 'text':
        return <div className={cn('text-center', item.variant === 'secondary' ? 'text-muted-foreground' : '')}>{item.children}</div>;
      case 'image':
        return <div className="w-full h-full flex items-center justify-center">{item.children}</div>;
      case 'button':
        return <Button variant={item.variant} size={item.size}>{item.children}</Button>;
      case 'input':
        return <Input placeholder="Enter your email" className={cn('max-w-xs w-full', item.size === 'lg' ? 'text-lg' : '')} />;
      case 'badge':
        return <Badge variant={item.variant} size={item.size}>{item.children}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={cn(baseClasses, item.className)}>
      {renderContent()}
    </div>
  );
};

const BentoGrid = ({ columns = 2, gap = '1.5rem', padding = '2rem', darkMode = false, className, items }: BentoGridProps) => {
  const gridClass = cn(
    'grid gap-6',
    {
      '[&>div]:min-h-[300px]': true,
      '[&>div]:aspect-square': columns === 1,
      '[&>div]:rounded-xl': true,
      '[&>div]:border-border': true,
      '[&>div]:shadow-sm': darkMode,
    },
    {
      'grid-cols-1': columns === 1,
      'md:grid-cols-2': columns === 2,
      'lg:grid-cols-3': columns === 3,
      'xl:grid-cols-4': columns === 4,
    }
  );

  return (
    <div className={cn('w-full', gridClass, padding, className)}>
      {items.map((item, index) => (
        <ItemRenderer key={`${index}-${item.type}`} item={{ ...item }} />
      ))}
    </div>
  );
};

const defaultItems: BentoGridItemProps[] = [
  { type: 'text', variant: 'default', size: 'md', children: <h3 className="text-xl font-bold">AI App Builder</h3> },
  { type: 'text', variant: 'secondary', size: 'sm', children: <p className="text-muted-foreground">Build production-ready AI applications in minutes, not months.</p> },
  { type: 'button', variant: 'primary', size: 'md', children: <Button>Get Started</Button> },
  { type: 'image', variant: 'default', size: 'lg', children: <div className="aspect-square bg-muted rounded-lg" /> },
  { type: 'badge', variant: 'secondary', size: 'sm', children: <Badge>AI-Powered</Badge> },
  { type: 'divider', variant: 'default', size: 'md', children: <div className="h-px w-full bg-border" /> },
];

export default BentoGrid;

BentoGrid.defaultProps = {
  columns: 2,
  gap: '1.5rem',
  padding: '2rem',
  darkMode: false,
};

BentoGridItemProps.defaultProps = {
  variant: 'default',
  size: 'md',
};
