'use client';

import { cn } from '@/lib/utils';

interface ResetPasswordEmailProps {
  resetLink: string;
  companyName?: string;
  logoUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
  brandColor?: string;
}

export function ResetPasswordEmail({
  resetLink,
  companyName = 'Syntheon',
  logoUrl,
  supportEmail = 'support@syntheon.com',
  supportPhone,
  brandColor = '#7c3aed',
}: ResetPasswordEmailProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    lineHeight: '1.5',
    color: '#374151',
  };

  const headerStyle: React.CSSProperties = {
    padding: '24px 20px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderBottom: `1px solid #e5e7eb`,
  };

  const bodyStyle: React.CSSProperties = {
    padding: '32px 20px',
    backgroundColor: '#f9fafb',
    borderTop: `1px solid #e5e7eb`,
    borderBottom: `1px solid #e5e7eb`,
  };

  const footerStyle: React.CSSProperties = {
    padding: '24px 20px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderTop: `1px solid #e5e7eb`,
    fontSize: '13px',
    color: '#6b7280',
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '14px 28px',
    backgroundColor: brandColor,
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 500,
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(124, 58, 237, 0.3)',
  };

  const linkStyle: React.CSSProperties = {
    color: brandColor,
    textDecoration: 'none',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${companyName} logo`}
            style={{
              maxWidth: '120px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
            }}
          />
        ) : (
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: brandColor }}>
            {companyName}
          </h1>
        )}
      </header>

      {/* Body */}
      <main style={bodyStyle}>
        <p style={{ margin: '0 0 16px', fontSize: '18px' }}>
          Hello,
        </p>

        <p style={{ margin: '0 0 24px' }}>
          We received a request to reset your password. If you initiated this, click the button below to create a new one. Otherwise, ignore this email and your current password will remain secure.
        </p>

        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <a href={resetLink} style={buttonStyle}>
            Reset Password
          </a>
        </div>

        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
          Or copy and paste this link into your browser:{' '}
          <span style={linkStyle}>{resetLink}</span>
        </p>

        <div style={{ margin: '32px 0', padding: '16px', backgroundColor: '#fff', border: `1px solid ${brandColor}`, borderRadius: '8px' }}>
          <strong style={{ color: brandColor, display: 'block', marginBottom: '4px' }}>Security Tip:</strong>
          <p style={{ margin: 0, fontSize: '13px' }}>
            For your protection, always verify the sender's email address and check that the link matches our domain. Never share this password with anyone.
          </p>
        </div>

        <p style={{ marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
          If you have any questions, contact us at{' '}
          <a href={`mailto:${supportEmail}`} style={linkStyle}>
            {supportEmail}
          </a>
          {supportPhone && ` or call ${supportPhone}`}.
        </p>
      </main>

      {/* Footer */}
      <footer style={footerStyle}>
        <p style={{ margin: '0 0 8px' }}>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
          This email was sent to the registered email address for your account. If you believe this was sent in error, please{' '}
          <a href={`mailto:${supportEmail}`} style={linkStyle}>
            contact us
          </a>.
        </p>
      </footer>
    </div>
  );
}

export default ResetPasswordEmail;
