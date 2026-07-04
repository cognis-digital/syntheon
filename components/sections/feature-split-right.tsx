'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureSplitRightProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
  iconPath?: React.ReactNode;
  imageGradient?: boolean;
}

export interface FeatureSplitRightProps extends FeatureSplitRightProps {}

const DEFAULTS: Partial<FeatureSplitRightProps> = {
  title: '',
  subtitle: 'Build faster with Syntheon',
  description: '',
  ctaText: 'Get Started',
  ctaUrl: '#',
  iconPath: null,
  imageGradient: true,
};

export default function FeatureSplitRight({
  title = DEFAULTS.title,
  subtitle = DEFAULTS.subtitle,
  description = DEFAULTS.description,
  ctaText = DEFAULTS.ctaText,
  ctaUrl = DEFAULTS.ctaUrl,
  iconPath = DEFAULTS.iconPath,
  imageGradient = DEFAULTS.imageGradient,
}: FeatureSplitRightProps) {

  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-violet-50 dark:from-violet-950/20 dark:via-slate-950 dark:to-violet-950/10"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-400/10 to-transparent"
        style={{ y: y1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            {iconPath && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  {iconPath}
                </svg>
              </motion.div>
            )}

            <div className="space-y-6">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200 border border-violet-200/50">
                New Feature
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                {title}
              </h1>

              {subtitle && (
                <p className="text-xl text-violet-700 dark:text-violet-300 font-medium">
                  {subtitle}
                </p>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
              >
                {description}
              </motion.p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="min-h-[48px] px-6 text-base shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 group">
                  <a href={ctaUrl} className="flex items-center gap-2">
                    {ctaText}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14"/>
                      <path d="m19 12-5-5"/>
                      <path d="m19 12-5 5"/>
                    </svg>
                  </a>
                </Button>

                {ctaUrl && (
                  <Button variant="outline" asChild size="lg">
                    <a href={ctaUrl} className="gap-2">
                      Learn More
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/>
                        <path d="m19 12-5-5"/>
                        <path d="m19 12-5 5"/>
                      </svg>
                    </a>
                  </Button>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-6 pt-8"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden"
                    >
                      <div className={`w-full h-full bg-gradient-to-br from-violet-${400 + i * 50} to-purple-${500 + i * 50}`} />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Trusted by 2,000+ teams worldwide
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden relative">
              {imageGradient ? (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-violet-400/30 via-purple-500/20 to-fuchsia-600/20"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/40 to-transparent dark:from-slate-950/40" />
                </>
              ) : (
                <motion.div
                  className="w-full h-full rounded-3xl overflow-hidden relative"
                  style={{ y }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-purple-600/10" />
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, type: 'spring' }}
                      className="w-48 h-48 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              <motion.div
                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-violet-200/30 shadow-lg"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-2 py-1 text-xs font-medium bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-700">
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
                    </span>
                    Live Preview
                  </Badge>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">v2.4.0 — Production Ready</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 blur-3xl opacity-30"
            />

            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-600 blur-3xl opacity-20"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-24 grid grid-cols-3 gap-8 border-t border-violet-200/30 dark:border-violet-800/30 pt-12"
        >
          {[
            { label: 'Downloads', value: '50K+', icon: <DownloadIcon /> },
            { label: 'Active Users', value: '12K+', icon: <UsersIcon /> },
            { label: 'Uptime', value: '99.9%', icon: <ShieldCheckIcon /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300">
                  {stat.icon}
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="text-3xl font-bold text-slate-900 dark:text-white"
              >
                {stat.value}
              </motion.div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// Icons as inline SVG components to avoid external deps
function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-7-3-7 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
