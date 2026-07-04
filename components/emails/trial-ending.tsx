import { cn } from '@/lib/utils'

type Props = {
  companyName: string
  trialDaysLeft: number
  planName?: string
  ctaText: string
  ctaUrl: string
  supportEmail?: string
  darkMode: boolean
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  header: {
    padding: '32px 40px 24px',
    textAlign: 'center',
    borderBottom: '1px solid #e5e7eb',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#7c3aed',
    letterSpacing: '-0.02em',
  },
  body: {
    padding: '40px 40px 56px',
  },
  headline: {
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: '16px',
    color: '#1f2937',
  },
  subheadline: {
    fontSize: '18px',
    lineHeight: 1.5,
    color: '#4b5563',
    marginBottom: '24px',
  },
  highlight: {
    fontWeight: 600,
    color: '#7c3aed',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '16px 32px',
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 600,
    borderRadius: '8px',
    textDecoration: 'none',
    textAlign: 'center',
    marginBottom: '24px',
  },
  footer: {
    padding: '32px 40px 40px',
    borderTop: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
  },
  supportLink: {
    color: '#7c3aed',
    textDecoration: 'none',
  },
}

export default function TrialEnding({
  companyName,
  trialDaysLeft,
  planName = 'Pro',
  ctaText,
  ctaUrl,
  supportEmail,
  darkMode,
}: Props) {
  const primaryColor = darkMode ? '#7c3aed' : '#7c3aed'
  const textPrimary = darkMode ? '#ffffff' : '#1f2937'
  const textSecondary = darkMode ? '#d1d5db' : '#4b5563'

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ ...styles.logo, color: primaryColor }}>
          {companyName || 'Syntheon'}
        </div>
      </header>

      {/* Body */}
      <main style={styles.body}>
        <h1 style={styles.headline}>
          Your trial is ending in{' '}
          <span style={{ ...styles.highlight, fontWeight: 800 }}>
            {trialDaysLeft} days
          </span>
        </h1>

        <p style={styles.subheadline}>
          You've been using the free version of {planName}. To continue without interruption, 
          please upgrade your account before your trial expires.
        </p>

        <a href={ctaUrl} style={{ ...styles.ctaButton }}>
          {ctaText || 'Upgrade Now'} →
        </a>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ marginBottom: '8px' }}>
          Questions? Reach out to our team.
        </p>
        {supportEmail && (
          <a href={`mailto:${supportEmail}`} style={styles.supportLink}>
            {supportEmail}
          </a>
        )}
      </footer>
    </div>
  )
}
