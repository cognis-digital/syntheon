'use client';

import { motion, useScroll, useInView, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Github, Linkedin, Twitter, Mail, Sparkles, Users, Globe, Zap, Heart } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image?: string | null;
  bio: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const teamMembers: TeamMemberProps[] = [
  {
    name: 'Elena Vasquez',
    role: 'Chief Product Officer',
    image: null,
    bio: 'Former VP at Stripe. Obsessed with product-market fit and shipping things that matter.',
    socials: { linkedin: '#', twitter: '#', email: '#' },
  },
  {
    name: 'Marcus Chen',
    role: 'Head of Engineering',
    image: null,
    bio: 'Built distributed systems at scale. Loves clean code and elegant abstractions.',
    socials: { github: '#', linkedin: '#', twitter: '#' },
  },
  {
    name: 'Sofia Rodriguez',
    role: 'Design Director',
    image: null,
    bio: 'Pixel perfectionist. Design systems architect with a passion for motion.',
    socials: { linkedin: '#', twitter: '#', email: '#' },
  },
  {
    name: 'James Okoro',
    role: 'Growth Lead',
    image: null,
    bio: 'Data-driven marketer. Ex-Google Ads team. Loves experiments and storytelling.',
    socials: { linkedin: '#', twitter: '#', email: '#' },
  },
];

function AnimatedCounter({ target, prefix = '' }: { target: number; prefix?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => setIsInView(entry.isIntersecting),
        { threshold: 0.5 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, []);

  if (!isInView) return <div ref={ref} className="h-8" />;

  const value = Math.min(Math.max(target * scrollY, 0), target);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2"
    >
      {prefix && <span className="text-muted-foreground">{prefix}</span>}
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="font-bold text-foreground"
      >
        {Math.round(value)}
      </motion.span>
    </motion.div>
  );
}

export interface TeamPageProps {}

export default function TeamPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
              Meet the Team
            </Badge>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            The minds behind Syntheon
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A team of builders, dreamers, and problem-solvers crafting the future of enterprise software.
          </p>
        </motion.div>

        {/* Animated Stats */}
        <div className="relative z-10 mt-16 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Team Members', value: 12 },
              { icon: Globe, label: 'Countries Served', value: 25 },
              { icon: Zap, label: 'Years Building', value: 8 },
              { icon: Heart, label: 'Coffee Consumed', value: 9999 },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <AnimatedCounter target={stat.value} />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Get to know the crew
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <TeamCard
                key={member.name}
                member={member}
                index={i}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 text-center"
          >
            <Button size="lg" variant="primary" asChild>
              <a href="/contact">
                Work with us <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Syntheon. Built with care.</p>
          <div className="flex items-center gap-6">
            <a href="#" aria-label="GitHub" className="hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

function TeamCard({
  member,
  index,
  hoveredCard,
  setHoveredCard,
}: {
  member: TeamMemberProps;
  index: number;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <motion.div
      layoutId={`team-${member.name.toLowerCase().replace(/\s/g, '-')}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={(e) => {
        if (hoveredCard !== member.name.toLowerCase().replace(/\s/g, '-')) {
          setHoveredCard(member.name.toLowerCase().replace(/\s/g, '-'));
        }
      }}
      animate={{
        y: isHovering ? -10 : 0,
        scale: hoveredCard === member.name.toLowerCase().replace(/\s/g, '-') ? 1.02 : 1,
      }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'relative group cursor-pointer',
        'rounded-xl border bg-card/50 backdrop-blur-sm',
        'border-border/40 hover:border-primary/50 transition-colors duration-300',
        hoveredCard === member.name.toLowerCase().replace(/\s/g, '-') ? 'ring-2 ring-primary/20' : ''
      )}
    >
      <CardContent className="p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center text-center mb-4">
          <motion.div
            layoutId={`avatar-${member.name.toLowerCase().replace(/\s/g, '-')}`}
            className="relative"
          >
            {member.image ? (
              <Avatar className="h-20 w-20 rounded-full overflow-hidden">
                <AvatarImage src={member.image} alt={member.name} />
              </Avatar>
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
            
            {/* Hover glow effect */}
            <motion.div
              layoutId={`glow-${member.name.toLowerCase().replace(/\s/g, '-')}`}
              className="absolute -inset-4 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
            />
          </motion.div>

          <h3 className="mt-4 font-semibold text-lg">{member.name}</h3>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>

        {/* Bio */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {member.socials?.github && (
            <a href={member.socials.github} aria-label={`GitHub - ${member.name}`} className="p-2 rounded-full bg-background/50 hover:bg-primary/10 transition-colors">
              <Github className="h-4 w-4" />
            </a>
          )}
          {member.socials?.linkedin && (
            <a href={member.socials.linkedin} aria-label={`LinkedIn - ${member.name}`} className="p-2 rounded-full bg-background/50 hover:bg-primary/10 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {member.socials?.twitter && (
            <a href={member.socials.twitter} aria-label={`Twitter - ${member.name}`} className="p-2 rounded-full bg-background/50 hover:bg-primary/10 transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {member.socials?.email && (
            <a href={`mailto:${member.socials.email}`} aria-label={`Email - ${member.name}`} className="p-2 rounded-full bg-background/50 hover:bg-primary/10 transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Decorative gradient border */}
        <motion.div
          layoutId={`border-${member.name.toLowerCase().replace(/\s/g, '-')}`}
          className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'linear-gradient(45deg, transparent 60%, rgba(139, 92, 246, 0.1) 100%)' }}
        />
      </CardContent>
    </motion.div>
  );
}

// CSS variables for violet theme (can be injected via global styles)
declare module 'react' {
  interface CSSVariables {
    --primary-hue: 270;
    --primary-saturation: 85%;
    --primary-lightness: 60%;
  }
}
