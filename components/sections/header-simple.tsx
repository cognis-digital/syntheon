'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Menu, X, ArrowRight, Search, Moon, Sun, Globe } from 'lucide-react'
import { useState, useEffect, useReducedMotion } from 'react'

export interface HeaderSimpleProps {
  variant?: 'default' | 'minimal' | 'hero'
  logoText?: string
  showSearch?: boolean
  showLanguageSelector?: boolean
  sticky?: boolean
}

const headerVariants = {
  hidden: { opacity: 0, y: -120 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -24, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'none',
    transition: {
      duration: 0.6,
      delay: i * 0.05,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export function HeaderSimple({
  variant = 'default',
  logoText = 'Syntheon',
  showSearch = true,
  showLanguageSelector = false,
  sticky = true,
}: HeaderSimpleProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!sticky) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sticky])

  const containerVariants = reducedMotion ? {} : headerVariants

  if (variant === 'minimal') {
    return (
      <motion.header
        initial="hidden"
        animate={isScrolled || !reducedMotion ? 'visible' : 'hidden'}
        variants={containerVariants}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled && !reducedMotion
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/20 py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow"
            >
              <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <span className="font-semibold text-foreground tracking-tight">
              {logoText}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {showSearch && (
              <form action="#" className="relative group">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-64 h-10 pl-10 pr-4 bg-background/50 border-border/30 rounded-full text-sm focus:bg-background transition-all shadow-sm group-hover:shadow-md focus:shadow-lg"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search className="w-4 h-4" />
                </div>
              </form>
            )}

            {showLanguageSelector && (
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-background/50">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </Button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-4"
          >
            <Button variant="ghost">Sign In</Button>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
              Get Started
            </Button>
          </motion.div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/20 hover:bg-background transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && !reducedMotion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl"
            >
              <div className="p-6 space-y-4">
                {showSearch && (
                  <form action="#" className="relative">
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-3 bg-background/50 border-border/30 rounded-xl text-sm focus:bg-background transition-all shadow-sm"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Search className="w-4 h-4" />
                    </div>
                  </form>
                )}

                {showLanguageSelector && (
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>English</span>
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  </Button>
                )}

                <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
                  <Button variant="ghost" className="justify-start w-full">
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    )
  }

  return (
    <motion.header
      initial="hidden"
      animate={isScrolled || !reducedMotion ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled && !reducedMotion
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/20 py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow"
          >
            <span className="text-white font-bold text-xl">S</span>
          </motion.div>
          <span className="font-semibold text-foreground tracking-tight">
            {logoText}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {[
            'Products',
            'Solutions',
            'Resources',
            'Pricing',
            'Company',
          ].map((item, i) => (
            <motion.a
              key={item}
              href="#"
              variants={{ hidden: itemVariants.hidden(0), visible: itemVariants.visible(i) }}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              {item}
              <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-500 rounded-full group-hover:w-8 transition-all duration-300 ease-out" />
            </motion.a>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex items-center gap-4"
        >
          {showSearch && (
            <form action="#" className="relative group">
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 h-10 pl-10 pr-4 bg-background/50 border-border/30 rounded-full text-sm focus:bg-background transition-all shadow-sm group-hover:shadow-md focus:shadow-lg"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
            </form>
          )}

          {showLanguageSelector && (
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-background/50">
              <Globe className="w-5 h-5 text-muted-foreground" />
            </Button>
          )}

          <div className="h-6 w-px bg-border hidden lg:block" />

          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <Button variant="ghost">Sign In</Button>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
              Get Started
            </Button>
          </motion.div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/20 hover:bg-background transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {mobileMenuOpen && !reducedMotion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl"
            >
              <div className="p-6 space-y-4">
                {showSearch && (
                  <form action="#" className="relative">
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-3 bg-background/50 border-border/30 rounded-xl text-sm focus:bg-background transition-all shadow-sm"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Search className="w-4 h-4" />
                    </div>
                  </form>
                )}

                {showLanguageSelector && (
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>English</span>
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  </Button>
                )}

                <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
                  <Button variant="ghost" className="justify-start w-full">
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
