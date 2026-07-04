'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, X, Sparkles, Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export interface AiChatWidgetProps {
  isOpen?: boolean
  onToggle?: () => void
  placeholder?: string
  title?: string
  subtitle?: string
  status?: 'online' | 'typing' | 'away' | 'busy'
  autoResize?: boolean
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isTyping?: boolean
}

const DEFAULT_PLACEHOLDER = "Ask anything about your project..."
const DEFAULT_TITLE = "Syntheon AI"
const DEFAULT_SUBTITLE = "Your intelligent assistant"

export function AiChatWidget({
  isOpen = true,
  onToggle,
  placeholder = DEFAULT_PLACEHOLDER,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  status = 'online',
  autoResize = false,
}: AiChatWidgetProps) {
  const [isOpenState, setIsOpenState] = useState(isOpen)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello! I'm ${title}. How can I help you today?`,
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleOpen = useCallback(() => {
    if (onToggle) onToggle()
    else setIsOpenState((prev) => !prev)
  }, [onToggle])

  useEffect(() => {
    if (isOpen !== isOpenState && onToggle) {
      onToggle()
    }
  }, [isOpen, isOpenState, onToggle])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(scrollToBottom, [messages, isTyping, scrollToBottom])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response with staggered typing effect
    setTimeout(() => {
      const responses = [
        `That's an interesting question about "${userMessage.content}". Let me think about that...`,
        "Based on your project context, I'd suggest considering...",
        "Here are a few approaches to consider:",
        "Let me break this down for you:",
      ]

      const responseText = responses[Math.floor(Math.random() * responses.length)] + " ..."

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: responseText,
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1500)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AnimatePresence>
      {isOpenState && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={toggleOpen}
          />

          {/* Widget container */}
          <motion.div
            initial={{ 
              x: '100%',
              opacity: 0,
              scale: 0.95,
            }}
            animate={{ 
              x: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{ 
              x: '100%',
              opacity: 0,
              scale: 0.95,
            }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 24,
              duration: 0.3,
            }}
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
          >
            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex-none p-4 border-b border-border bg-background/95 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-primary">{title}</h2>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                  )}
                </div>

                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleOpen}
                  aria-label="Close chat"
                  className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-foreground" />
                </Button>
              </div>

              {/* Status indicator */}
              {status !== 'online' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-3 flex items-center gap-2 text-xs"
                >
                  <div 
                    className={cn(
                      "h-2 w-2 rounded-full",
                      status === 'online' ? 'bg-green-500' :
                      status === 'typing' ? 'bg-yellow-500 animate-pulse' :
                      status === 'busy' ? 'bg-orange-500' : 'bg-gray-400',
                    )}
                  />
                  <span className="text-muted-foreground">
                    {status === 'online' && 'Online'}
                    {status === 'typing' && ' — Thinking...'}
                    {status === 'away' && 'Away for a moment'}
                    {status === 'busy' && 'Processing request'}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: 'easeOut',
                    }}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      message.role === 'user' ? 'self-end' : 'self-start',
                    )}
                  >
                    <div 
                      className={cn(
                        "rounded-lg px-4 py-2.5",
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-br-none' 
                          : 'bg-muted text-foreground rounded-bl-none',
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    <span 
                      className={cn(
                        "text-xs mt-1 px-2 py-0.5 rounded-full",
                        message.role === 'user' ? 'bg-muted text-muted-foreground ml-auto' : '',
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3 self-start"
                  >
                    <div className="rounded-lg bg-muted px-4 py-2.5 rounded-bl-none">
                      <p className="text-sm text-muted-foreground">
                        {messages[messages.length - 1].content}
                      </p>
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ 
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="mt-1 ml-auto"
                    >
                      <div className="flex gap-1">
                        <span className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Welcome message */}
                {messages.length === 1 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div 
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center mb-4",
                        status === 'online' ? 'bg-primary/10' : 'bg-muted',
                      )}
                    >
                      <Sparkles 
                        className="h-6 w-6" 
                        style={{ color: status === 'online' ? 'var(--primary)' : 'inherit' }} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Start a conversation to get help with your project.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex-none p-4 border-t border-border bg-background/95 backdrop-blur"
            >
              <div 
                className={cn(
                  "flex items-end gap-2",
                  autoResize ? 'min-h-[60px] min-w-[280px]' : '',
                )}
              >
                {/* Auto-expand button */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const input = document.activeElement as HTMLInputElement
                    if (input) {
                      input.style.height = 'auto'
                      input.style.minHeight = ''
                    }
                  }}
                  className="h-10 w-10 rounded-full hover:bg-muted flex-none"
                >
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      autoResize ? 'rotate-90' : '',
                    )}
                  />
                </Button>

                {/* Input field */}
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "flex-1 min-h-[48px] max-h-[200px]",
                    autoResize ? 'resize-none' : '',
                  )}
                  style={{ 
                    minHeight: autoResize ? 60 : undefined,
                    maxHeight: 200,
                  }}
                />

                {/* Send button */}
                <Button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex-none"
                  aria-label="Send message"
                >
                  <Send 
                    className={cn(
                      "h-4 w-4",
                      !inputValue.trim() || isTyping ? 'opacity-50' : '',
                    )}
                  />
                </Button>
              </div>

              {/* Auto-resize hint */}
              {autoResize && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-xs text-muted-foreground mt-2"
                >
                  Press Enter to send • Shift + Enter for new line
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
