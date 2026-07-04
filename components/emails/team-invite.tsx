'use client';

import { cn } from '@/lib/utils';

interface EmailProps {
  recipientName: string;
  senderName?: string;
  teamName: string;
  inviteLink: string;
  expiresAt?: Date;
  logoUrl?: string;
}

export default function TeamInviteEmail({
  recipientName,
  senderName = 'Syntheon',
  teamName,
  inviteLink,
  expiresAt,
  logoUrl,
}: EmailProps) {
  const violetPrimary: React.CSSProperties = {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
  };

  const violetHover: React.CSSProperties = {
    backgroundColor: '#6d2ade',
    color: '#ffffff',
  };

  const baseFontFamily: React.CSSProperties = {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  };

  const containerStyle: React.CSSProperties = {
    ...baseFontFamily,
    backgroundColor: '#f8fafc',
    margin: 0,
    padding: 0,
    width: '100%',
    minHeight: '100vh',
    lineHeight: '1.6',
  };

  const wrapperStyle: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    margin: 0,
    padding: 24,
    maxWidth: '600px',
    margin: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: 32,
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const logoStyle: React.CSSProperties = {
    maxWidth: '120px',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
  };

  const headerBgStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)`,
    padding: 40 24,
    textAlign: 'center',
  };

  const headerTextWhiteStyle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 600,
    margin: 0,
  };

  const bodyStyle: React.CSSProperties = {
    padding: 40 32,
  };

  const greetingStyle: React.CSSProperties = {
    color: '#1e293b',
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 8,
  };

  const messageStyle: React.CSSProperties = {
    color: '#475569',
    fontSize: 16,
    lineHeight: '1.8',
    margin: 0,
  };

  const teamNameStyle: React.CSSProperties = {
    fontWeight: 600,
    color: '#1e293b',
  };

  const expiresTextStyle: React.CSSProperties = {
    color: '#7c3aed',
    fontSize: 14,
    marginTop: 8,
  };

  const buttonContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: 24 0,
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: 16 32,
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: 12,
    boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.3)',
    transition: 'all 0.2s ease',
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#6d2ade',
    boxShadow: '0 6px 20px 0 rgba(124, 58, 237, 0.4)',
    transform: 'translateY(-2px)',
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: '#f1f5f9',
    padding: 24,
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
  };

  const footerTextGrayStyle: React.CSSProperties = {
    color: '#64748b',
    fontSize: 13,
    margin: 0,
  };

  const logoContainerFooterStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
  };

  const logoFooterStyle: React.CSSProperties = {
    maxWidth: '80px',
    maxHeight: '80px',
    width: 'auto',
    height: 'auto',
  };

  return (
    <html lang="en" style={containerStyle}>
      <body>
        <div style={wrapperStyle}>
          {/* Header */}
          <div style={headerStyle}>
            {logoUrl ? (
              <a href="#" style={{ textDecoration: 'none' }}>
                <img
                  src={logoUrl}
                  alt={`${senderName} logo`}
                  style={logoStyle}
                />
              </a>
            ) : (
              <div style={logoContainerStyle}>
                <span
                  style={{
                    ...logoStyle,
                    color: '#7c3aed',
                    fontWeight: 800,
                    fontSize: 24,
                  }}
                >
                  {senderName[0]}
                </span>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div style={contentStyle}>
            {/* Header Banner */}
            <div style={headerBgStyle}>
              <h1 style={headerTextWhiteStyle}>Welcome to {teamName}</h1>
            </div>

            {/* Body */}
            <div style={bodyStyle}>
              <p style={greetingStyle}>Hi {recipientName},</p>

              <p style={messageStyle}>
                You have been invited to join the team. Click the button below to
                get started.
              </p>

              {expiresAt && (
                <p style={messageStyle}>
                  This invite will expire on{' '}
                  <span style={teamNameStyle}>
                    {new Date(expiresAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
              )}

              <div style={buttonContainerStyle}>
                <a href={inviteLink} style={{ ...buttonStyle, ...violetPrimary }}>
                  Join the Team
                </a>
              </div>

              <p style={messageStyle}>
                If you have any questions or need help getting started, feel free
                to reach out.
              </p>
            </div>

            {/* Footer */}
            <div style={footerStyle}>
              {logoUrl ? (
                <a href="#" style={{ textDecoration: 'none' }}>
                  <img
                    src={logoUrl}
                    alt={`${senderName} logo`}
                    style={logoFooterStyle}
                  />
                </a>
              ) : (
                <div style={logoContainerFooterStyle}>
                  <span
                    style={{
                      ...logoFooterStyle,
                      color: '#7c3aed',
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    {senderName[0]}
                  </span>
                </div>
              )}

              <p style={footerTextGrayStyle}>
                © {new Date().getFullYear()} {senderName}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
