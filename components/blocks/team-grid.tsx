import React, { useReducer, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TeamMemberProps {
  name: string;
  role: string;
  image?: string | null;
  socials?: Array<{ platform: 'twitter' | 'linkedin' | 'github' | 'website'; url: string; label: string }>;
  bio?: string;
}

export interface TeamGridProps {
  members: TeamMemberProps[];
  title?: string;
  subtitle?: string;
  showBios?: boolean;
  maxBioLength?: number;
  className?: string;
}

const DEFAULT_MEMBERS: TeamMemberProps[] = [
  {
    name: 'Alex Chen',
    role: 'Lead AI Architect',
    image: '/placeholder-1.jpg',
    socials: [{ platform: 'twitter', url: '#', label: '@alexchen' }],
    bio: 'Building the future of intelligent interfaces. Previously at Stripe and OpenAI.',
  },
  {
    name: 'Jordan Smith',
    role: 'Senior Motion Designer',
    image: '/placeholder-2.jpg',
    socials: [{ platform: 'linkedin', url: '#', label: 'jordan-smith' }],
    bio: 'Crafting premium motion experiences for web and mobile. Avid tinkerer.',
  },
  {
    name: 'Taylor Kim',
    role: 'Product Designer',
    image: '/placeholder-3.jpg',
    socials: [{ platform: 'twitter', url: '#', label: '@tkim' }],
    bio: 'Design systems enthusiast. Loves clean code and even cleaner type.',
  },
];

const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  hover: { scale: 1.025, y: -4, transition: { duration: 0.3 } },
};

const truncateBio = (bio?: string | null, maxLength: number = 120): string => {
  if (!bio) return '';
  const truncated = bio.length > maxLength ? bio.slice(0, maxLength).trim() + '...' : bio;
  return truncated;
};

export const TeamCard: React.FC<{ member: TeamMemberProps; index: number }> = ({ member, index }) => {
  const isInView = useInView(member.image ? null : undefined, { margin: '0px 0px 48px 0px', amount: 0.5 });

  return (
    <motion.div
      className={cn('relative group cursor-pointer', member.socials?.length > 0 && 'has-[:hover]:outline-none')}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={{
        initial: { ...ANIMATION_CONFIG.initial, transition: { delay: index * 0.1 } },
        animate: ANIMATION_CONFIG.animate,
        hover: ANIMATION_CONFIG.hover,
      }}
    >
      <Card className={cn('h-full overflow-hidden border-border bg-background/50 backdrop-blur-xl', member.socials?.length > 0 && 'group-hover:border-primary/40')}>
        <CardHeader className="p-6 pb-2">
          <div className="relative aspect-square rounded-lg overflow-hidden mb-3 group-hover:scale-[1.02] transition-transform duration-500 ease-out">
            {member.image ? (
              <motion.img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.6 }}
              />
            ) : (
              <div className={cn('w-full h-full rounded-lg flex items-center justify-center bg-muted/50', 'group-hover:bg-primary/10')}>
                <span className="text-foreground/30 text-sm font-medium">{member.name.charAt(0)}</span>
              </div>
            )}
          </div>

          <h3 className={cn('font-semibold text-lg tracking-tight', 'group-hover:text-primary transition-colors')}>
            {member.name}
          </h3>

          <p className="text-foreground/50 font-medium">{member.role}</p>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          {member.bio && (
            <AnimatePresence initial={false}>
              <motion.p
                key={isInView ? 'visible' : 'hidden'}
                className="text-muted-foreground/70 leading-relaxed"
                initial={{ opacity: 0, y: -8 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {truncateBio(member.bio)}
              </motion.p>
            </AnimatePresence>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {member.socials?.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${social.label} on ${social.platform}`}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  'border border-border/60 bg-background/40 hover:bg-primary/10 hover:border-primary/50 hover:scale-[1.02]',
                  'group-hover:opacity-100 opacity-70'
                )}
              >
                <span className="capitalize">{social.platform}</span>
                <span className={cn('ml-0.5', social.platform === 'twitter' && 'text-primary')}>
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </CardContent>

        {/* Subtle gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.15, backdropFilter: 'blur(8px)' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </Card>
    </motion.div>
  );
};

export const TeamGrid: React.FC<TeamGridProps> = ({
  members = DEFAULT_MEMBERS,
  title = 'Meet the team',
  subtitle = 'The minds behind Syntheon',
  showBios = true,
  maxBioLength = 120,
  className,
}) => {
  const [scrollY] = useScroll();
  const yValue = useTransform(scrollY, (y) => y / 30);

  return (
    <section className={cn('relative py-24 lg:py-32 overflow-hidden', className)}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: yValue }}
        animate={{
          backgroundPositionX: ['10%', '50%'],
          opacity: [0.3, 0.4],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              {showBios ? 'Full bios' : 'Short intros'}
            </Badge>
          </motion.div>

          <h2 className={cn('text-3xl md:text-5xl font-bold tracking-tight mb-4', 'bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent')}>
            {title}
          </h2>

          <p className="text-muted-foreground/70 max-w-2xl mx-auto text-lg">
            {subtitle}
          </p>
        </motion.header>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {members.map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground/60 mb-4">Want to join the team?</p>
          <Button variant="outline" size="lg" className="gap-2 border-border hover:border-primary/50">
            View all positions
          </Button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[120px]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </section>
  );
};

export default TeamGrid;
