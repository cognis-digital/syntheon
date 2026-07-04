'use client'

import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AuthorProps {
  name: string
  role: string
  bio: string
  imageUrl?: string
  socialLinks?: Array<{
    label: string
    url: string
    icon: 'github' | 'twitter' | 'linkedin' | 'website' | 'email'
  }>
}

export function Author({
  name,
  role,
  bio,
  imageUrl = '/placeholder-author.jpg',
  socialLinks = [],
}: AuthorProps) {
  const ref = useInView(null, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Card className="overflow-hidden border-border/60 bg-background">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Image with tasteful treatment */}
            <motion.div
              className="relative w-full md:w-48 aspect-square rounded-lg overflow-hidden border-border/50"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <img
                src={imageUrl}
                alt={`${name}'s photo`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:hidden" />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <motion.h2
                className="text-xl font-semibold text-primary mb-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {name}
              </motion.h2>

              <motion.div
                className="flex items-center gap-2 mb-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Badge variant="secondary" className="bg-muted/50 text-foreground">
                  {role}
                </Badge>
              </motion.div>

              <motion.p
                className="text-muted-foreground leading-relaxed mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {bio}
              </motion.p>

              {/* Social links with hover effects */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border transition-colors',
                      'border-border/60 bg-background hover:bg-muted/40 hover:border-primary/50',
                      'focus:outline-none focus:ring-2 focus:ring-ring/50'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="capitalize">{link.label}</span>
                  </motion.a>
                ))}

                {/* Email fallback */}
                {socialLinks.length === 0 && (
                  <motion.a
                    href={`mailto:${name.toLowerCase().replace(/\s/g, '')}@example.com`}
                    className={cn(
                      'inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border transition-colors',
                      'border-border/60 bg-background hover:bg-muted/40 hover:border-primary/50',
                      'focus:outline-none focus:ring-2 focus:ring-ring/50'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Get in touch</span>
                  </motion.a>
                )}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decorative gradient accent */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-8 bg-gradient-to-r from-primary/20 via-transparent to-primary/10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
    </motion.div>
  )
}

export interface AuthorPropsInterface extends AuthorProps {}
