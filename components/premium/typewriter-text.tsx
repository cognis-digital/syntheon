'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, useCallback } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  startDelay?: number
  loop?: boolean
  cursor?: boolean
  cursorBlinkSpeed?: number
  className?: string
  styleType?: 'full' | 'word' | 'char' | 'fade'
}

export interface TypewriterTextProps extends TypewriterTextProps {
  text: string
  speed?: number
  startDelay?: number
  loop?: boolean
  cursor?: boolean
  cursorBlinkSpeed?: number
  className?: string
  styleType?: 'full' | 'word' | 'char' | 'fade'
}

export default function TypewriterText({
  text = '',
  speed = 50,
  startDelay = 0,
  loop = false,
  cursor = true,
  cursorBlinkSpeed = 1000,
  className,
  styleType = 'full',
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const blinkInterval = cursorBlinkSpeed / 2

  useEffect(() => {
    if (!text || !loop && currentIndex >= text.length) {
      setIsTyping(false)
      return
    }

    let interval: NodeJS.Timeout

    const typeCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      } else if (loop) {
        setIsTyping(false)
      }
    }

    interval = setInterval(typeCharacter, speed)

    return () => clearInterval(interval)
  }, [text, currentIndex, loop, speed])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, blinkInterval)

    return () => clearInterval(cursorInterval)
  }, [blinkInterval])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !text) return

    const scrollY = scrollRef.current.scrollTop
    const height = scrollRef.current.scrollHeight - scrollRef.current.clientHeight
    const progress = Math.min(Math.max(scrollY / height, 0), 1)

    setDisplayedText((prev) => {
      if (loop && currentIndex >= text.length) {
        return ''
      }
      
      const visibleLength = Math.floor(progress * text.length)
      return prev.slice(0, visibleLength)
    })
  }, [text, loop, currentIndex])

  useEffect(() => {
    if (!scrollRef.current || !text) return

    scrollRef.current.addEventListener('scroll', handleScroll)
    return () => scrollRef.current?.removeEventListener('scroll', handleScroll)
  }, [handleScroll, text])

  const getStyleType = (current: string): React.ReactNode[] => {
    if (!current) return []

    switch (styleType) {
      case 'word':
        return current.split(' ').map((word, i) => 
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentIndex * speed + (i * 50), duration: 0.3 }}
            className="inline"
          >
            {word}{' '}
          </motion.span>
        )

      case 'char':
        return current.split('').map((char, i) => 
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: currentIndex * speed + (i * 30), duration: 0.2 }}
            className="inline"
          >
            {char}
          </motion.span>
        )

      case 'fade':
        return current.split('').map((_, i) => 
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: currentIndex * speed + (i * 40), duration: 0.5 }}
            className="inline"
          />
        )

      default:
        return current.split('').map((_, i) => 
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentIndex * speed + (i * 25), duration: 0.3 }}
            className="inline"
          />
        )
    }
  }

  return (
    <div 
      ref={scrollRef}
      className={cn(
        'relative inline-block',
        cursor && !isTyping ? 'overflow-hidden' : '',
        className
      )}
      style={{
        cursor: cursor && isTyping ? 'text' : undefined,
      }}
    >
      <AnimatePresence>
        {displayedText && (
          <>
            {cursor && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: cursorVisible ? 1 : 0 }}
                transition={{ duration: blinkInterval / 2, ease: 'easeInOut' }}
                className="inline-block w-[2px] h-5 bg-primary ml-[-2px]"
              />
            )}
            
            {getStyleType(displayedText)}
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes smooth-fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .inline {
          animation: smooth-fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
