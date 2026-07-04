'use client';

import { motion, useScroll, useInView, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  imageSrc: string;
  featured?: boolean;
  linkUrl?: string;
}

export interface ProjectCardProps extends ProjectProps {}

export function ProjectCard({
  title,
  description,
  tags,
  imageSrc,
  featured = false,
  linkUrl = '#',
}: ProjectCardProps) {
  const ref = useInView({ threshold: 0.1 });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={ref ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className={cn(
        'overflow-hidden border-border bg-card shadow-sm hover:shadow-lg transition-shadow',
        featured ? 'ring-1 ring-primary/30' : '',
        'rounded-xl'
      )}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={imageSrc}
            alt={title}
            layout
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-full w-full object-cover"
          />
          {featured && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-4 left-4"
            >
              <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                Featured
              </Badge>
            </motion.div>
          )}
        </div>

        <CardContent className="p-6 space-y-4">
          <h3 className={cn(
            'text-xl font-semibold tracking-tight',
            featured ? 'text-primary' : 'text-foreground'
          )}>
            {title}
          </h3>

          <p className="text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs border-border bg-muted/50">
                {tag}
              </Badge>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between pt-4"
          >
            <Button variant="ghost" size="sm" asChild>
              <a href={linkUrl} aria-label={`View ${title}`}>
                View Project
              </a>
            </Button>

            {linkUrl && (
              <motion.a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium hover:underline',
                  featured ? 'text-primary' : 'text-foreground'
                )}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M17 17l5-5m-5-5l5 5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Live Demo
              </motion.a>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ProjectCard;
