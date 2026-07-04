   import { motion, useReducedMotion } from 'framer-motion'
   import { button as ButtonPrimitive, cn } from '@/components/ui/button'
   import { cn } from '@/lib/utils'
   
   interface ConfettiButtonProps {
     children?: React.ReactNode
     onClick?: (e: React.MouseEvent) => void
     className?: string
     variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
     size?: 'sm' | 'md' | 'lg' | 'xl'
     disabled?: boolean
   }
   
   export interface ConfettiButtonProps { ... }
