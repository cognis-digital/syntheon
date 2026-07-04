import { cn } from '@/lib/utils'

type Props = {
  token: string
  expiresAt?: Date | number
  logoUrl?: string
  title?: string
  subtitle?: string
}

const baseStyles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  lineHeight: '1.5',
  color: '#374151',
  backgroundColor: '#f9fafb',
}

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: baseStyles.fontFamily,
  lineHeight: baseStyles.lineHeight,
  color: baseStyles.color,
  backgroundColor: '#f9fafb',
}

const headerStyle = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  padding: '40px 20px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
}

const logoStyle = {
  maxWidth: '180px',
  height: 'auto',
  marginBottom: '16px',
}

const titleStyle = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#ffffff',
  margin: '0 0 8px 0',
}

const subtitleStyle = {
  fontSize: '16px',
  color: '#d1d5db',
  margin: 0,
}

const contentStyle = {
  padding: '32px 40px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
}

const textStyle = {
  fontSize: '16px',
  lineHeight: '1.75',
  color: '#374151',
  margin: '0 0 24px 0',
}

const buttonStyle = {
  display: 'inline-block',
  padding: '14px 32px',
  backgroundColor: '#7c3aed',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 600,
  textDecoration: 'none',
  borderRadius: '8px',
  textAlign: 'center' as const,
  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
}

const footerStyle = {
  textAlign: 'center' as const,
  padding: '24px',
  fontSize: '12px',
  color: '#9ca3af',
  borderTop: '1px solid #e5e7eb',
}

export default function VerifyEmail({ token, expiresAt, logoUrl = '', title = 'Verify Your Email', subtitle = '' }: Props) {
  const buttonHref = `https://syntheon.app/verify?token=${encodeURIComponent(token)}`
  const expiryText = typeof expiresAt === 'number' ? new Date(expiresAt).toLocaleString() : expiresAt?.toLocaleString()

  return (
    <div style={containerStyle}>
      {/* Meta tags for email clients */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no, address=no, date=no" />

      <header style={headerStyle}>
        {logoUrl && <img src={logoUrl} alt="" style={logoStyle} />}
        <h1 style={titleStyle}>{title}</h1>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </header>

      <main style={contentStyle}>
        <p style={textStyle}>
          Hello,
        </p>
        <p style={textStyle}>
          Please verify your email address by clicking the button below. This link will expire in{' '}
          {expiryText || '24 hours'} if not used sooner.
        </p>

        <div
          style={{ textAlign: 'center' as const, marginTop: '32px', marginBottom: '32px' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              window.location.href = buttonHref
            }
          }}
        >
          <a href={buttonHref} style={buttonStyle}>
            Verify Email Address
          </a>
        </div>

        <p style={{ ...textStyle, textAlign: 'center' as const }}>
          If you have trouble clicking the button, copy and paste this URL into your browser:{' '}
          <strong>{buttonHref}</strong>
        </p>
      </main>

      <footer style={footerStyle}>
        <p>© 2024 Syntheon. All rights reserved.</p>
        <p style={{ margin: '8px 0 0 0' }}>
          If you did not request this email, you can safely ignore it.
        </p>
      </footer>
    </div>
  )
}
