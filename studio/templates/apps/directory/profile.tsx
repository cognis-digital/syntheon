'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ProfileProps {
  name: string;
  title?: string;
  bio: string;
  avatarUrl?: string;
  coverImage?: string;
  skills: string[];
  socialLinks: Array<{
    platform: 'github' | 'linkedin' | 'twitter' | 'website';
    url: string;
    icon: React.ReactNode;
  }>;
  contactEmail?: string;
}

export interface ProfilePropsInterface extends ProfileProps {}

export default function Profile({
  name = 'Alexandra Chen',
  title = 'Senior Product Engineer & Motion Designer',
  bio = 'Building digital experiences that feel alive. Obsessed with the intersection of engineering, design, and motion. Currently crafting interfaces for Syntheon.',
  avatarUrl = '/images/avatars/default-profile.png',
  coverImage = '/images/covers/profile-cover.jpg',
  skills: ['Next.js 15', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'React 18', 'Node.js'],
  socialLinks: [
    { platform: 'github', url: '#', icon: <GitHubIcon /> },
    { platform: 'linkedin', url: '#', icon: <LinkedinIcon /> },
    { platform: 'twitter', url: '#', icon: <TwitterIcon /> },
    { platform: 'website', url: '#', icon: <WebsiteIcon /> },
  ],
  contactEmail = 'alexandra@syntheon.dev',
}: ProfileProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const blur = useTransform(scrollYProgress, [0, 0.3], [0, 4]);

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-hidden"
      style={{ opacity }}
    >
      {/* Animated Cover */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ y: 0, scale: 1.05, rotate: -2 }}
        animate={{ 
          y: [0, -30, 0],
          scale: 1.05,
          rotate: [-2, -4, -2]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/30 via-transparent to-background" />
        {coverImage && (
          <motion.img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover"
            style={{ scale, blur }}
          />
        )}
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-4 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/10 blur-xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-background shadow-2xl object-cover"
                  />
                </div>
              </motion.div>

              <div className="flex-1 text-left">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-400 bg-clip-text text-transparent mb-2">
                  {name}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">{title}</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg text-foreground/80 leading-relaxed"
                >
                  {bio}
                </motion.p>

                {/* Skills Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-wrap gap-2 mt-4"
                >
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                    >
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "px-4 py-2 text-sm font-medium bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20 transition-colors",
                          index === 0 && "ring-2 ring-violet-500/30"
                        )}
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex gap-3"
              >
                {socialLinks.map((link, index) => (
                  <motion.div
                    key={link.platform}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Button 
                      variant="outline" 
                      className={cn(
                        "h-12 px-6 rounded-full border-border/50 hover:border-violet-400/50 transition-all duration-300",
                        link.platform === 'github' && "bg-background/50 hover:bg-violet-950/30"
                      )}
                      asChild
                    >
                      <a href={link.url} aria-label={`Visit ${link.platform}`}>
                        {React.cloneElement(link.icon, { className: "w-6 h-6", fill: "currentColor" })}
                      </a>
                    </Button>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button 
                    className="h-12 px-6 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 shadow-lg shadow-violet-500/25 transition-all duration-300"
                    asChild
                  >
                    <a href={`mailto:${contactEmail}`} aria-label="Contact via email">
                      <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 00-5 5v0c0 2.76 2.24 5 5 5h.1v2A8.001 8.001 0 0014.3 19l4.9-4.9V12H14a3.1 3.1 0 00-3.1 3.1v0c0 1.71 1.39 3.1 3.1 3.1h4V19h-4a5 5 0 01-5-5v0c0-2.76 2.24-5 5-5h.1V7H7.1A3.1 3.1 0 004 9.9v0c0 1.71 1.39 3.1 3.1 3.1h.1v2A8.001 8.001 0 006.5 19l-2.6-2.6V12z"/>
                      </svg>
                      Email Me
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Social Links Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 400, damping: 25 }}
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 180,
                    transition: { duration: 0.3 }
                  }}
                  className={cn(
                    "group flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 bg-background/40 backdrop-blur-sm hover:bg-violet-950/30 transition-all duration-300",
                    index === 0 && "ring-1 ring-violet-500/20"
                  )}
                >
                  <span className="text-muted-foreground group-hover:text-violet-400 transition-colors">
                    {React.cloneElement(link.icon, { 
                      className: "w-5 h-5", 
                      fill: "currentColor" 
                    })}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-violet-300 transition-colors">
                    @{link.platform === 'github' ? link.url.replace('#', '') : link.platform}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Floating Elements */}
        <motion.div
          className="fixed bottom-8 left-8 z-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg">
            <motion.div 
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-muted-foreground">
              {name} is online
            </span>
          </div>
        </motion.div>

        <motion.div
          className="fixed bottom-8 right-8 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-5.571-5.571m5.571 5.571L18.364 5.636" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Background Gradient Orbs */}
      <motion.div 
        className="fixed -top-20 -left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="fixed -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.3, 1], rotate: [0, -360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

// Icon Components
function GitHubIcon() {
  return (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.316 3.435 9.75 8.205 11.38-.307-.45-.53-1.01-.53-1.695 0-1.03.42-1.93 1.08-2.59C9.07 18.22 9.07 18.22 9.07 18.22c.5-.67 1.24-1.11 2.05-1.33-.2.62-.32 1.25-.32 1.935 0 2.49 2.03 4.52 4.52 4.52.78 0 1.49-.22 2.09-.6.61.39 1.32.6 2.1.6 2.49 0 4.52-2.03 4.52-4.52 0-.68-.12-1.32-.32-1.93.81.22 1.55.67 2.05 1.33 0 0 .07 0 .07 0 1.49 0 2.76-1.03 3.14-2.46C21.565 21.75 25 17.315 25 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.66 1.75h-1.96v14.5H5.64V5.25zM3.68 8.05c-.82 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.68-1.5-1.5-1.5zm13.24 0c-.82 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.68-1.5-1.5-1.5zm-4.96 0c-.82 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.68-1.5-1.5-1.5z"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.669c-.108.13-.161.303-.144.482a3.456 3.456 0 01-.834 2.528l-4.05 4.834c-.197.235-.497.237-.694 0L4.76 18.07a3.455 3.455 0 01-.834-2.528c.007-.179-.046-.352-.154-.482l-7.227-8.669h3.308c.632 0 1.132-.533 1.132-1.17V2.25z"/>
    </svg>
  );
}

function WebsiteIcon() {
