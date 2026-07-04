'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ClerkAdapter } from './clerk'

export interface ClerkConfig {
  providerId: string
  clientId?: string
}

export interface UserResponse {
  id: string
  emailAddresses: Array<{ email_address: string }>
  imageUrl?: string | null
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  createdAt: Date
}

export type SessionStatus = 'active' | 'expired' | 'revoked' | 'pending'

export interface SessionResponse {
  id: string
  userId: string
  status: SessionStatus
  createdAt: Date
  expiresAt: Date
}

const DEFAULT_TIMEOUT_MS = 5000

function isClerkConfigured(): boolean {
  try {
    return !!ClerkAdapter?.isReady && ClerkAdapter.isReady()
  } catch {
    return false
  }
}

export async function getUserInfo(
  userId: string,
  options: { timeout?: number; includeMetadata?: boolean } = {}
): Promise<UserResponse | null> {
  const { timeout = DEFAULT_TIMEOUT_MS, includeMetadata = true } = options

  if (!isClerkConfigured()) {
    return null
  }

  try {
    const result = await ClerkAdapter.getUser(userId)

    if (result && result.success) {
      return {
        id: result.data.id,
        emailAddresses: result.data.emailAddresses.map(e => ({
          email_address: e.emailAddress,
        })),
        imageUrl: result.data.imageUrl || null,
        firstName: result.data.firstName || null,
        lastName: result.data.lastName || null,
        username: result.data.username || null,
        createdAt: new Date(result.data.createdAt),
      }
    }

    return null
  } catch (error) {
    console.error('[Clerk] getUser failed:', error)
    return null
  }
}

export async function createSession(
  options: { timeout?: number; withVerification?: boolean } = {}
): Promise<SessionResponse | null> {
  const { timeout = DEFAULT_TIMEOUT_MS, withVerification = true } = options

  if (!isClerkConfigured()) {
    return null
  }

  try {
    const result = await ClerkAdapter.createSession()

    if (result && result.success) {
      return {
        id: result.data.id,
        userId: result.data.userId,
        status: 'active',
        createdAt: new Date(result.data.createdAt),
        expiresAt: new Date(result.data.expiresAt),
      }
    }

    return null
  } catch (error) {
    console.error('[Clerk] createSession failed:', error)
    return null
  }
}

export async function verifyUser(
  userId: string,
  options: { timeout?: number; requireActive?: boolean } = {}
): Promise<boolean> {
  const { timeout = DEFAULT_TIMEOUT_MS, requireActive = true } = options

  if (!isClerkConfigured()) {
    return false
  }

  try {
    const user = await getUserInfo(userId)

    if (!user || !requireActive) {
      return !!user
    }

    // Check for active email verification
    const hasVerifiedEmail = user.emailAddresses.some(
      e => e.emailAddress && !e.isUnverified
    )

    return hasVerifiedEmail
  } catch (error) {
    console.error('[Clerk] verifyUser failed:', error)
    return false
  }
}

export async function refreshSession(sessionId: string): Promise<SessionResponse | null> {
  if (!isClerkConfigured()) {
    return null
  }

  try {
    const result = await ClerkAdapter.refreshSession(sessionId)

    if (result && result.success) {
      return {
        id: sessionId,
        userId: result.data.userId,
        status: 'active',
        createdAt: new Date(result.data.createdAt),
        expiresAt: new Date(result.data.expiresAt),
      }
    }

    return null
  } catch (error) {
    console.error('[Clerk] refreshSession failed:', error)
    return null
  }
}

export async function logoutUser(userId?: string): Promise<boolean> {
  if (!isClerkConfigured()) {
    return false
  }

  try {
    await ClerkAdapter.logout()
    return true
  } catch (error) {
    console.error('[Clerk] logout failed:', error)
    return false
  }
}

export async function getAuthStatus(): Promise<{
  isAuthenticated: boolean
  userId?: string | null
  needsVerification: boolean
}> {
  if (!isClerkConfigured()) {
    return { isAuthenticated: false, needsVerification: false }
  }

  try {
    const result = await ClerkAdapter.getAuthStatus()

    return {
      isAuthenticated: result?.success && !!result.data.userId,
      userId: result?.data?.userId || null,
      needsVerification: result?.data?.needsVerification || false,
    }
  } catch (error) {
    console.error('[Clerk] getAuthStatus failed:', error)
    return { isAuthenticated: false, needsVerification: false }
  }
}

export function createClerkComponent(
  name: string,
  options: {
    label?: string
    description?: string
    loadingText?: string
    errorText?: string
    icon?: ReactNode
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
  } = {}
): { Component: typeof createClerkComponent; props: Record<string, any> } {
  const {
    label,
    description,
    loadingText = 'Loading...',
    errorText = 'Failed to load',
    icon,
    variant = 'default',
    size = 'md',
  } = options

  const baseClasses = cn(
    'relative inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      'h-9 px-4 py-2 text-sm': size === 'sm',
      'h-10 px-6 py-3 text-base': size === 'md',
      'h-12 px-8 py-4 text-lg': size === 'lg',
      'border border-border bg-background shadow-sm hover:bg-accent/50': variant === 'default',
      'border border-border bg-transparent shadow-none hover:bg-accent/50': variant === 'outline',
      'bg-transparent shadow-none hover:bg-accent/50': variant === 'ghost',
    }
  )

  return {
    Component: function ClerkComponent({ children, className }: { children?: ReactNode; className?: string }) {
      const classes = cn(baseClasses, className)

      if (!isClerkConfigured()) {
        return (
          <div className={cn('flex items-center gap-2', classes)}>
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <span>{label || name}</span>
          </div>
        )
      }

      try {
        const status = getAuthStatus()

        if (status.needsVerification) {
          return (
            <div className={cn('flex items-center gap-2', classes)}>
              {icon && <span className="text-muted-foreground">{icon}</span>}
              <span>{label || name} (pending)</span>
            </div>
          )
        }

        if (!status.isAuthenticated) {
          return (
            <div className={cn('flex items-center gap-2', classes)}>
              {icon && <span className="text-muted-foreground">{icon}</span>}
              <span>{label || name} (guest)</span>
            </div>
          )
        }

        return (
          <div className={cn('flex items-center gap-2', classes)}>
            {icon && <span className="text-primary-foreground">{icon}</span>}
            <span>{label || name}</span>
          </div>
        )
      } catch (error) {
        return (
          <div className={cn('flex items-center gap-2', classes)}>
            {icon && <span className="text-destructive">{icon}</span>}
            <span>{label || name} ({errorText})</span>
          </div>
        )
      }
    },
    props: {},
  }
}

export async function initializeClerk(
  config?: ClerkConfig,
  options: { onReady?: () => void; onError?: (error: unknown) => void } = {}
): Promise<boolean> {
  const { onReady, onError } = options

  if (!isClerkConfigured()) {
    try {
      await ClerkAdapter.initialize(config)
      onReady?.()
      return true
    } catch (error) {
      console.error('[Clerk] initialize failed:', error)
      onError?.(error)
      return false
    }
  }

  onReady?.()
  return true
}

export const clerkExample = async () => {
  // Example: Initialize Clerk if not already configured
  await initializeClerk({ providerId: 'clerk' }, {
    onReady: () => console.log('Clerk ready'),
    onError: (error) => console.error('[Clerk] Error:', error),
  })

  // Example: Check auth status
  const status = await getAuthStatus()
  if (status.isAuthenticated) {
    console.log(`Authenticated user: ${status.userId}`)
  } else {
    console.log('Guest mode active')
  }

  // Example: Get current user info
  if (status.userId) {
    const userInfo = await getUserInfo(status.userId, { timeout: 10000 })
    if (userInfo) {
      console.log(`User ${userInfo.id}:`, {
        email: userInfo.emailAddresses[0]?.email_address,
        name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`,
        image: userInfo.imageUrl,
      })
    }
  }

  // Example: Create a session for the user
  if (status.userId) {
    const session = await createSession({ withVerification: true })
    if (session) {
      console.log(`New session created: ${session.id}`)
    }
  }

  // Example: Verify user identity
  if (status.userId) {
    const verified = await verifyUser(status.userId, { requireActive: true })
    console.log(`User verification status: ${verified ? 'Verified' : 'Pending/Revoked'}`)
  }

  return { status, userInfo: null, session: null }
}
