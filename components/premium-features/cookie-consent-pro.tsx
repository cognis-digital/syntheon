'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { X, ShieldCheck, Settings2, AlertCircle, Info } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CookieConsentProps {
  onAccept: () => void
  onReject: () => void
  onCustomize?: () => void
  open?: boolean
  autoOpen?: boolean
}

interface ButtonVariant extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onReject,
  onCustomize,
  open: controlledOpen,
  autoOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [userChoice, setUserChoice] = useState<'accepted' | 'rejected' | null>(null)

  useEffect(() => {
    if (controlledOpen !== undefined) {
      return
    }
    
    if (autoOpen && !isOpen && !userChoice) {
      setIsOpen(true)
      
      // Auto-dismiss after 5 seconds if user does nothing
      const timer = setTimeout(() => {
        onAccept()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, userChoice, controlledOpen, autoOpen])

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen)
      return
    }
  }, [controlledOpen])

  const handleAccept = useCallback(() => {
    setUserChoice('accepted')
    onAccept()
    setIsOpen(false)
  }, [onAccept])

  const handleReject = useCallback(() => {
    setUserChoice('rejected')
    onReject()
    setIsOpen(false)
  }, [onReject])

  const handleClose = useCallback(() => {
    if (userChoice === null && !controlledOpen) {
      // If no choice made, default to accept
      handleAccept()
    } else {
      setIsOpen(false)
    }
  }, [userChoice, controlledOpen, handleAccept])

  const containerVariants = {
    hidden: { opacity: 0, y: -24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, y: -24, transition: { duration: 0.15 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, rotateX: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateX: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  }

  const headerVariants = {
    hidden: { y: -8, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.2 } }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-[10000] px-4 sm:px-6 lg:px-8"
          >
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header with gradient accent */}
              <motion.div 
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative px-6 py-5 bg-gradient-to-br from-violet-50/50 to-transparent border-b border-border"
              >
                <div className="flex items-start justify-between">
                  <motion.div 
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <motion.h2 
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-xl font-semibold text-foreground"
                    >
                      Privacy & Cookies
                    </motion.h2>
                  </motion.div>

                  <button
                    onClick={handleClose}
                    aria-label="Close dialog"
                    className="ml-auto p-2 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  We use cookies to enhance your experience and provide personalized features.
                </motion.p>
              </motion.div>

              {/* Body */}
              <div className="px-6 py-4">
                <motion.div 
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-3 mb-5"
                >
                  {/* Info item */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                    <Info className="h-4 w-4 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">
                      By continuing to use our site, you agree to our Privacy Policy and Cookie Policy. You can customize your preferences at any time in your account settings.
                    </p>
                  </div>

                  {/* Warning for strict mode */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-500/20"
                  >
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">
                      Strict mode cookies are required for certain features to function properly. These include analytics, personalization, and social sharing.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Action buttons */}
                <motion.div 
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <button
                    onClick={handleReject}
                    variant="outline"
                    size="lg"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 active:scale-[0.98] group"
                  >
                    <span className="text-sm font-medium text-foreground">Minimize</span>
                    <span className="h-4 w-px bg-border mx-1 hidden sm:block" />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      Accept essentials only
                    </span>
                  </button>

                  <button
                    onClick={handleAccept}
                    variant="primary"
                    size="lg"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400/50 active:scale-[0.98] group"
                  >
                    <motion.span 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </motion.span>
                    <span className="text-sm font-medium">Accept All</span>
                  </button>

                  {onCustomize && (
                    <button
                      onClick={onCustomize}
                      variant="outline"
                      size="lg"
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 active:scale-[0.98] group"
                    >
                      <Settings2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-sm font-medium">Customize</span>
                    </button>
                  )}
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground"
              >
                <span>Last updated: {new Date().toLocaleDateString()}</span>

                <div className="flex items-center gap-2">
                  <a 
                    href="/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors underline decoration-dotted hover:decoration-solid"
                  >
                    Privacy Policy
                  </a>
                  <span className="hidden sm:inline">•</span>
                  <a 
                    href="/cookie-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors underline decoration-dotted hover:decoration-solid"
                  >
                    Cookie Policy
                  </a>
                </div>
              </motion.div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/10 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
