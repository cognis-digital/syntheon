'use client'

import { cn } from '@/lib/utils'

interface Props {
  name?: string | null
  logoUrl?: string | null
  primaryColor: string = '#7c3aed'
  secondaryColor: string = '#6d28d9'
  textColorPrimary: string = '#1f2937'
  textColorSecondary: string = '#4b5563'
  bgColor: string = '#ffffff'
  borderRadius?: 'none' | 'sm' | 'md' | 'lg'
}

const radiusMap: Record<string, string> = {
  none: '',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
}

export default function WaitlistApproved({
  name = 'Valued Member',
  logoUrl,
  primaryColor,
  secondaryColor,
  textColorPrimary,
  textColorSecondary,
  bgColor,
  borderRadius = 'lg',
}: Props) {
  const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: bgColor,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    lineHeight: 1.5,
    color: textColorPrimary,
    borderRadius: radiusMap[borderRadius],
    overflow: 'hidden',
  }

  const headerStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    padding: '24px 32px',
    textAlign: 'center' as const,
    borderBottom: `1px solid ${textColorSecondary}`,
  }

  const logoContainerStyle: React.CSSProperties = {
    maxWidth: '180px',
    margin: '0 auto',
  }

  const bodyStyle: React.CSSProperties = {
    padding: '32px 40px',
    textAlign: 'center' as const,
  }

  const contentStyle: React.CSSProperties = {
    maxWidth: '480px',
    margin: '0 auto',
  }

  const greetingStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: textColorPrimary,
    marginBottom: '16px',
    lineHeight: 1.3,
  }

  const messageStyle: React.CSSProperties = {
    fontSize: '16px',
    color: textColorSecondary,
    lineHeight: 1.6,
    marginBottom: '24px',
  }

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '14px 32px',
    backgroundColor: primaryColor,
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 600,
    textDecoration: 'none' as const,
    borderRadius: radiusMap[borderRadius],
    textAlign: 'center' as const,
    boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
    transition: 'background-color 0.2s ease',
  }

  const footerStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    padding: '32px 40px',
    borderTop: `1px solid ${textColorSecondary}`,
    textAlign: 'center' as const,
  }

  const linkStyle: React.CSSProperties = {
    color: primaryColor,
    textDecoration: 'none' as const,
    fontSize: '14px',
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={logoContainerStyle}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              width="180"
              height="auto"
              style={{ maxWidth: '180px', maxHeight: '60px' }}
            />
          ) : null}
        </div>
      </header>

      {/* Body */}
      <main style={bodyStyle}>
        <div style={contentStyle}>
          <h1 style={greetingStyle}>
            {name ? `Hello, ${name}` : 'Hello'}!
          </h1>

          <p style={messageStyle}>
            Great news — your spot on the waitlist has been approved. We're excited to have you join us as we prepare for launch.
          </p>

          <a href="#" style={buttonStyle} target="_blank" rel="noopener noreferrer">
            Get Early Access
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer style={footerStyle}>
        <p style={{ fontSize: '14px', color: textColorSecondary, marginBottom: '8px' }}>
          Questions? Reply to this email or visit our support portal.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" style={linkStyle}>Privacy Policy</a>
          <a href="#" style={linkStyle}>Terms of Service</a>
          <a href="#" style={linkStyle}>Contact Us</a>
        </div>
      </footer>
    </div>
  )
}
