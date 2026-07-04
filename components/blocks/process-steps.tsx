'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface ProcessStepProps {
  steps: Array<{
    title: string
    description: string
    icon?: React.ReactNode
    highlight?: boolean
    duration?: number
  }>
  variant?: 'horizontal' | 'vertical'
  showProgress?: boolean
}

const defaultSteps = [
  {
    title: 'Design',
    description: 'AI-powered wireframes and prototypes generated in minutes.',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
  {
    title: 'Build',
    description: 'Smart scaffolding and boilerplate generation with best practices.',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>
  },
  {
    title: 'Deploy',
    description: 'One-click production deployment with auto-scaling and monitoring.',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
  },
]

const variantConfig: Record<string, { container: boolean; item: boolean }> = {
  horizontal: { container: true, item: false },
  vertical: { container: false, item: true },
}

export default function ProcessSteps({ steps = defaultSteps, variant = 'horizontal', showProgress = true }: ProcessStepProps) {
  const config = variantConfig[variant]
  
  return (
    <div className="w-full">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative"
        >
          {showProgress && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className={cn(
                  "h-full w-1 bg-gradient-to-b from-violet-400/30 via-violet-500/50 to-transparent",
                  variant === 'horizontal' ? "left-0" : "top-0"
                )}
              />
            </div>
          )}

          <motion.div
            initial={config.container ? { opacity: 0, y: 20 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div
              className={cn(
                "grid gap-6",
                variant === 'horizontal' ? "md:grid-cols-3 grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.15,
                    ease: 'easeOut',
                    ...(config.item ? { x: -20 } : {})
                  }}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "relative",
                    variant === 'horizontal' ? "" : "md:-ml-4 lg:-ml-6"
                  )}
                >
                  <Card
                    className={cn(
                      "h-full border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-300",
                      variant === 'horizontal' ? "" : "md:mt-4 lg:mt-6"
                    )}
                  >
                    <CardHeader className="pb-4">
                      <div className={cn(
                        "flex items-center gap-3 mb-2",
                        variant === 'horizontal' ? "justify-between" : ""
                      )}>
                        {step.icon && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.15 + 0.2 }}
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              step.highlight ? "bg-violet-500/20 text-violet-400" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {step.icon}
                          </motion.div>
                        )}

                        <div className={cn(
                          "flex items-center gap-3 flex-1",
                          variant === 'horizontal' ? "" : "justify-between"
                        )}>
                          <CardTitle className="text-lg font-medium text-primary">
                            {step.title}
                          </CardTitle>

                          <AnimatePresence>
                            {(variant === 'horizontal' && step.duration) && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(index + 1) / steps.length * 100}%` }}
                                transition={{ duration: 2, ease: 'easeInOut', delay: index * 0.15 + 0.3 }}
                              >
                                <div className="h-0.5 bg-violet-400/50 rounded-full" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <CardDescription className={cn(
                        "text-sm leading-relaxed",
                        variant === 'horizontal' ? "" : "md:text-base"
                      )}>
                        {step.description}
                      </CardDescription>
                    </CardHeader>

                    {(variant === 'horizontal' && step.duration) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.15 + 0.4, duration: 0.3 }}
                        className="flex items-center justify-between px-2 py-1"
                      >
                        <span className="text-xs text-muted-foreground">
                          {step.duration}m
                        </span>

                        <Badge
                          variant={step.highlight ? "default" : "secondary"}
                          className={cn(
                            "h-5 px-2 text-[10px] uppercase tracking-wider",
                            step.highlight ? "bg-violet-500/20 text-violet-300 border-violet-400/30" : ""
                          )}
                        >
                          {step.highlight ? 'Featured' : ''}
                        </Badge>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.45, duration: 0.3 }}
                      className={cn(
                        "mt-4 pt-4 border-t border-border/20",
                        variant === 'horizontal' ? "" : "md:pt-6"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <motion.div
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.15 + 0.5, duration: 0.3 }}
                          className="w-2 h-2 rounded-full bg-violet-400/60"
                        />
                        <span className={cn(
                          "text-xs text-muted-foreground",
                          variant === 'horizontal' ? "" : "md:text-sm"
                        )}>
                          {variant === 'horizontal' 
                            ? `Step ${index + 1} of ${steps.length}`
                            : `${index + 1}. ${step.title.toLowerCase()}`
                          }
                        </span>
                      </div>
                    </motion.div>
                  </Card>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.6, duration: 0.3 }}
                    className={cn(
                      "absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-violet-400/40 rounded-full",
                      variant === 'horizontal' ? "" : "md:-left-6 lg:-left-9"
                    )}
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.7, duration: 0.3 }}
                    className={cn(
                      "absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-violet-400/40 rounded-full",
                      variant === 'horizontal' ? "" : "md:-top-6 lg:-top-9"
                    )}
                  />
                </motion.div>
              ))}

              {variant === 'horizontal' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: steps.length * 0.15 + 0.3, duration: 0.4 }}
                  className="col-span-full flex items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: steps.length * 0.15 + 0.3, type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17l-2 3m6-3l2 3m-8-3h10a2 2 0 002-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: steps.length * 0.15 + 0.4, duration: 0.4 }}
              className={cn(
                "mt-8 text-center",
                variant === 'horizontal' ? "" : "md:mt-12"
              )}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: steps.length * 0.15 + 0.4, duration: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                Ready to start your project?{' '}
                <motion.a
                  href="#"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: steps.length * 0.15 + 0.45, duration: 0.3 }}
                  className="text-violet-400 hover:text-violet-300 underline decoration-violet-400/30 underline-offset-2"
                >
                  Get started free
                </motion.a>
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: steps.length * 0.15 + 0.6, duration: 0.4 }}
            className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background/80"
          />
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .process-steps-animate {
            animation-duration: 0.2s !important;
            transition-duration: 0.15s !important;
          }
        }
      `}</style>
    </div>
  )
}
