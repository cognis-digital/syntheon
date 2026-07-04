import { cn } from '@/lib/utils'

interface WelcomeEmailProps {
  name?: string
  companyName: string
  ctaText: string
  ctaUrl: string
  logoUrl?: string
  primaryColor?: string
}

export default function WelcomeEmail({
  name = 'Valued Customer',
  companyName,
  ctaText,
  ctaUrl,
  logoUrl,
  primaryColor = '#7c3aed'
}: WelcomeEmailProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f8fafc'
  }

  const headerStyle: React.CSSProperties = {
    padding: '40px 24px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderBottom: `1px solid ${primaryColor}33`
  }

  const logoStyle: React.CSSProperties = {
    maxWidth: '180px',
    height: 'auto'
  }

  const welcomeTextStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: 1.4
  }

  const bodyStyle: React.CSSProperties = {
    padding: '48px 24px',
    backgroundColor: '#ffffff'
  }

  const welcomeMessageStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#374151',
    lineHeight: 1.7,
    marginBottom: '32px'
  }

  const ctaButtonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '16px 32px',
    backgroundColor: primaryColor,
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center'
  }

  const footerStyle: React.CSSProperties = {
    padding: '32px 24px',
    backgroundColor: '#f1f5f9',
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b'
  }

  const linkStyle: React.CSSProperties = {
    color: primaryColor,
    textDecoration: 'none'
  }

  return (
    <div style={containerStyle}>
      <table cellPadding="0" cellSpacing="0" role="presentation">
        <tbody>
          <tr>
            <td style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
              <img src={logoUrl} alt={`${companyName} Logo`} style={logoStyle} />
            </td>
          </tr>
          <tr>
            <td style={headerStyle}>
              <h1 style={welcomeTextStyle}>Welcome to {companyName}</h1>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={bodyStyle}>
        <p style={welcomeMessageStyle}>
          Hello {name},
        </p>
        <p style={{ ...welcomeMessageStyle, marginBottom: '24px' }}>
          Thank you for joining us. We're excited to have you on board and can't wait to help you get started with your new account.
        </p>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href={ctaUrl} style={ctaButtonStyle}>
            {ctaText}
          </a>
        </div>

        <p style={{ ...welcomeMessageStyle, marginTop: '48px', fontSize: '14px', color: '#64748b' }}>
          If you have any questions, our support team is here to help.
        </p>
      </div>

      <table cellPadding="0" cellSpacing="0" role="presentation">
        <tbody>
          <tr>
            <td style={footerStyle}>
              <p>{companyName} — {new Date().getFullYear()}</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>
                <a href="#" style={linkStyle}>Unsubscribe</a> | 
                <a href="#" style={linkStyle}> Preferences</a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
