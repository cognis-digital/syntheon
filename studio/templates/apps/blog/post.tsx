'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface PostProps {
  title: string;
  excerpt?: string;
  content: React.ReactNode;
  author: {
    name: string;
    avatarUrl?: string;
    role: string;
  };
  date: Date;
  readTime: number;
  tags: string[];
  featuredImage?: string;
  relatedPosts?: Array<{
    title: string;
    excerpt: string;
    image: string;
    url: string;
  }>;
}

export interface PostPropsInterface {
  title: string;
  excerpt?: string;
  content: React.ReactNode;
  author: {
    name: string;
    avatarUrl?: string;
    role: string;
  };
  date: Date;
  readTime: number;
  tags: string[];
  featuredImage?: string;
  relatedPosts?: Array<{
    title: string;
    excerpt: string;
    image: string;
    url: string;
  }>;
}

export default function Post({
  title,
  excerpt = '',
  content,
  author,
  date,
  readTime,
  tags,
  featuredImage,
  relatedPosts = [],
}: PostPropsInterface) {
  const ref = React.useRef<HTMLElement>(null);

  const isInView = useInView(ref, {
    margin: '0px 0px 120px 0px',
    amount: 0.3,
    once: true,
  });

  const scrollYProgress = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [50, -50]
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 60,
      }}
      transition={{
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <Card className="overflow-hidden border-border bg-background/50 backdrop-blur-sm">
        {featuredImage && (
          <motion.div
            style={{ y }}
            className="relative aspect-video overflow-hidden"
          >
            <img
              src={featuredImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
          </motion.div>
        )}

        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            {author.avatarUrl && (
              <img
                src={author.avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full border-border object-cover"
              />
            )}
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">
                {author.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {author.role} •{' '}
                <time dateTime={date.toISOString()}>
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                #{tag}
              </Badge>
            ))}
            <span className="text-sm text-muted-foreground ml-auto flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              {readTime} min read
            </span>
          </div>
        </CardHeader>

        {(excerpt || relatedPosts.length > 0) && (
          <CardContent className="space-y-8">
            {excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed border-b border-border/50 pb-6">
                {excerpt}
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="prose prose-violet max-w-none text-foreground">
                {content}
              </div>
            </motion.div>

            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold mb-4">Related Reading</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((post, index) => (
                    <motion.a
                      key={index}
                      href={post.url}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      className="group block"
                    >
                      <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                          <img
                            src={post.image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg line-clamp-2 tracking-tight group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Enjoyed this article?{' '}
                  <span className="font-medium text-primary cursor-pointer hover:underline">
                    Subscribe for more
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    Bookmark
                  </Button>
                </div>
              </div>
            </motion.div>
          </CardContent>
        )}

        {!excerpt && !relatedPosts.length > 0 && (
          <CardContent className="pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9H5.5a2.5 2.5 0 0 1 0-5H6a1.34 1.34 0 0 1 0 2.68Z" />
                <path d="M8.75 17h-.5a2.5 2.5 0 0 1 0-5h.5a1.34 1.34 0 0 1 0 2.68Z" />
                <path d="M10.5 9H10a2.5 2.5 0 0 1 0-5h.5a1.34 1.34 0 0 1 0 2.68Z" />
                <path d="M13.75 17h-.5a2.5 2.5 0 0 1 0-5h.5a1.34 1.34 0 0 1 0 2.68Z" />
                <path d="M15.5 9H15a2.5 2.5 0 0 1 0-5h.5a1.34 1.34 0 0 1 0 2.68Z" />
                <path d="M18.75 17h-.5a2.5 2.5 0 0 1 0-5h.5a1.34 1.34 0 0 1 0 2.68Z" />
                <path d="M20.5 9H20a2.5 2.5 0 0 1 0-5h.5a1.34 1.34 0 0 1 0 2.68Z" />
              </svg>
              {readTime} min read
            </p>
          </CardContent>
        )}
      </Card>
    </motion.article>
  );
}
