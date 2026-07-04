'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  FileText, 
  GitBranch, 
  Zap, 
  TrendingUp,
  Users,
  CalendarDays,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// --- Context: Motion Safety ---
const ReducedMotionContext = createContext<{ reduced: boolean }>({ reduced: false });

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
    }
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      setReduced(mediaQuery.matches);
    });
  }, []);

  return reduced;
}

// --- Components: Animated Card with Stagger ---
interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function AnimatedCard({ 
  children, 
  delay = 0.1, 
  className 
}: AnimatedCardProps) {
  const reduced = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay,
        ease: [0.2, 0.6, 0.3, 1],
        ...(reduced ? { duration: 0 } : {})
      }}
      className={cn('rounded-xl border bg-card text-foreground shadow-sm', className)}
    >
      {children}
    </motion.div>
  );
}

// --- Components: Stat Widget ---
interface StatWidgetProps {
  title: string;
  value: string | number;
  change?: { value: number; label: string };
  icon: React.ComponentType<{ className?: string }>;
  trendUp?: boolean;
  delay?: number;
}

function StatWidget({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trendUp = true,
  delay = 0.15,
}: StatWidgetProps) {
  return (
    <AnimatedCard delay={delay}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          
          {change && (
            <Badge 
              variant={trendUp ? 'default' : 'destructive'}
              className="h-6 px-2.5 text-xs"
            >
              {trendUp ? '+' : ''}{change.value}%
            </Badge>
          )}
        </div>
        
        <div className="text-3xl font-bold tracking-tight">
          {value}
        </div>
      </CardContent>
    </AnimatedCard>
  );
}

// --- Components: Activity Item ---
interface ActivityItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  time: string;
  status?: 'active' | 'pending' | 'completed';
  delay?: number;
}

function ActivityItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  time, 
  status = 'active',
  delay = 0.2,
}: ActivityItemProps) {
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.4,
        delay: i * 0.1 + delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border transition-colors',
        status === 'active' && 'bg-primary/5 border-primary/20 hover:bg-primary/10',
        status === 'pending' && 'bg-muted/50 border-border',
        status === 'completed' && 'opacity-60 bg-muted/30 border-border/50'
      )}
    >
      <div className={cn(
        'h-10 w-10 rounded-full flex items-center justify-center',
        status === 'active' ? 'bg-primary text-primary-foreground' : 
        status === 'pending' ? 'bg-muted text-muted-foreground' : 
        'bg-green-500/20 text-green-400'
      )}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium truncate',
          status === 'active' ? 'text-primary' : ''
        )}>
          {title}
        </p>
        <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
      </div>
      
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {time}
      </span>
    </motion.div>
  );
}

// --- Main Overview Component ---
interface OverviewProps {
  className?: string;
}

export interface OverviewProps extends OverviewProps {}

export default function Overview({ className }: OverviewProps) {
  const reduced = useReducedMotion();
  
  // Scroll tracking for parallax effects
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);

  return (
    <ReducedMotionContext.Provider value={{ reduced }}>
      <motion.div 
        style={{ y: y1, opacity: opacity1 }}
        className={cn(
          'min-h-screen bg-background text-foreground',
          'font-sans antialiased selection:bg-primary/30',
          className
        )}
      >
        {/* --- Header --- */}
        <header 
          className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(24, 24, 27, 0.7)' }}
        >
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
                className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
              >
                <Zap className="h-5 w-5" />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="font-bold tracking-tight">Syntheon</span>
                <span className="text-xs text-muted-foreground">Overview Dashboard</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="relative group">
                <Search 
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                />
                <Input 
                  placeholder="Search anything..." 
                  className="pl-9 rounded-full bg-background border-border focus-visible:ring-primary/50"
                />
              </div>

              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </Button>

              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        {/* --- Main Content --- */}
        <main 
          className="px-6 py-8 md:py-12 max-w-[1600px] mx-auto"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {/* --- Welcome Section with Parallax --- */}
          <motion.section 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 md:mb-12"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-background to-background p-8 md:p-12">
              {/* Background decoration */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-8 top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
              />
              
              <div className="relative z-10">
                <h1 
                  style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-violet-300 to-purple-400 bg-clip-text"
                >
                  Welcome back, Designer.
                </h1>
                
                <p 
                  style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }}
                  className="mt-2 text-lg text-muted-foreground max-w-xl"
                >
                  You have 3 active projects and 14 pending reviews. Your team is online and ready to collaborate.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <Button 
                    size="lg" 
                    className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 transition-colors"
                  >
                    New Project
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="lg" className="rounded-full h-12 px-6">
                    View Calendar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* --- Stats Grid --- */}
          <section 
            style={{ y: y1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
          >
            <StatWidget 
              title="Active Projects"
              value={3}
              change={{ value: 12, label: 'vs last week' }}
              icon={GitBranch}
              delay={0.1}
            />

            <StatWidget 
              title="Pending Reviews"
              value={14}
              change={{ value: -5, label: 'vs yesterday' }}
              icon={CheckCircle2}
              trendUp={false}
              delay={0.2}
            />

            <StatWidget 
              title="Hours This Week"
              value={38.5}
              change={{ value: 8, label: 'on track' }}
              icon={Clock}
              delay={0.3}
            />

            <StatWidget 
              title="Team Velocity"
              value="92%"
              change={{ value: 4, label: 'sprint goal' }}
              icon={TrendingUp}
              delay={0.4}
            />
          </section>

          {/* --- Tabs: Projects & Activity --- */}
          <Tabs 
            defaultValue="projects" 
            className="w-full rounded-2xl bg-card border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <TabsList>
                <TabsTrigger value="projects" className="rounded-lg data-[state=active]:bg-primary/10">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-primary/10">
                  Activity
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Last 7 days</span>
              </div>
            </div>

            {/* Projects Tab */}
            <TabsContent value="projects" className="m-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    title: 'Neon Interface Redesign', 
                    status: 'In Progress', 
                    progress: 75,
                    due: 'Oct 28',
                    team: 4,
                    icon: FileText,
                    color: 'from-violet-500 to-purple-600'
                  },
                  { 
                    title: 'Mobile App Migration', 
                    status: 'Review', 
                    progress: 92,
                    due: 'Nov 1',
                    team: 8,
                    icon: GitBranch,
                    color: 'from-blue-500 to-cyan-600'
                  },
                  { 
                    title: 'Analytics Dashboard', 
                    status: 'Planning', 
                    progress: 25,
                    due: 'Nov 15',
                    team: 3,
                    icon: Activity,
                    color: 'from-emerald-400 to-teal-600'
                  },
                ].map((project, index) => (
                  <AnimatedCard 
                    key={index} 
                    delay={0.1 + index * 0.05}
                    className="group hover:border-primary/30 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <span 
                            style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }}
                            className="mt-1 text-sm bg-gradient-to-r from-muted to-muted/50 bg-clip-text"
                          >
                            {project.status}
                          </span>
                        </div>

                        <Badge 
                          variant={project.progress === 100 ? 'default' : 'secondary'}
                          className="h-8 px-3 text-xs"
                        >
                          {project.progress}%
                        </Badge>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{project.due}</span>
                          <span>Due: {project.due}</span>
                        </div>
                        <div 
                          className="h-1.5 rounded-full bg-muted overflow-hidden"
                          style={{ WebkitBackgroundClip: 'padding' }}
                        >
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.05 }}
                            className="h-full rounded-full bg-gradient-to-r"
                            style={{ background: `linear-gradient(90deg, var(--primary), var(--secondary))` }}
                          />
                        </div>
                      </div>

                      <div 
                        className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary/70 transition-colors"
                      >
                        <span>{project.team} team members</span>
                        
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}

                {/* Add new project card */}
                <AnimatedCard delay={0.6}>
                  <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[180px]">
                    <div 
                      style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }}
                      className="text-4xl bg-gradient-to-r from-muted to-muted/50 bg-clip-text mb-3"
                    >
                      +
                    </div>
                    
                    <h3 className="font-medium">Create New Project</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
                      Start a fresh project with your team.
                    </p>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 rounded-full h-9 px-5 border-border hover:bg-primary/5"
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </AnimatedCard>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="m-0 p-6">
              <div 
                style={{ y: y1 }}
                className="space-y-2"
              >
                {[
                  { icon: Zap, title: 'Project Launched', subtitle: 'Neon Interface Redesign went live', time: '2h ago', status: 'active' },
                  { icon: CheckCircle2, title: 'Review Approved', subtitle: 'Mobile App Migration milestone 3', time: '5h ago', status: 'completed' },
                  { icon: Activity, title: 'Team Sync', subtitle: 'Daily standup with design team', time: '8h ago', status: 'pending' },
                ].map((item, index) => (
                  <ActivityItem 
                    key={index}
                    {...item}
                    delay={0.1 + index * 0.05}
                  />
                ))}

                {/* More activity placeholder */}
                <div className="flex items-center justify-between p-4 text-sm text-muted-foreground">
                  <span>Showing 3 of 28 activities</span>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full">
                    View All
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* --- Quick Actions / Footer --- */}
          <section 
            style={{ y: y1 }}
            className="mt-8 md:mt-12"
          >
            <AnimatedCard delay={0.5}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Zap, label: 'New Sprint', href: '#' },
                    { icon: GitBranch, label: 'Project Template', href: '#' },
                    { icon: Users, label: 'Invite Team', href: '#' },
