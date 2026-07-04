'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface NewLoginAlertProps {
  email: string;
  ip?: string;
  device?: string;
  timestamp?: Date;
  logo?: ReactNode;
  supportUrl?: string;
}

const colors = {
  violetPrimary: '#7c3aed',
  violetDark: '#6d28d9',
  violetLight: '#a78bfa',
  background: {
    light: '#ffffff',
    dark: '#0f172a',
  },
  surface: {
    light: '#f8fafc',
    dark: '#1e293b',
  },
  text: {
    primary: {
      light: '#1e293b',
      dark: '#f8fafc',
    },
    secondary: {
      light: '#64748b',
      dark: '#94a3b8',
    },
  },
};

const getThemeVars = (isDark: boolean) => ({
  bg: isDark ? colors.background.dark : colors.background.light,
  surface: isDark ? colors.surface.dark : colors.surface.light,
  textPrimary: isDark ? colors.text.primary.dark : colors.text.primary.light,
  textSecondary: isDark ? colors.text.secondary.dark : colors.text.secondary.light,
});

const getBorderRadius = () => '8px';

export const newLoginAlert = ({
  email = '',
  ip,
  device,
  timestamp,
  logo,
  supportUrl,
}: NewLoginAlertProps) => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeVars = getThemeVars(isDark);

  const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: themeVars.bg,
    borderRadius: getBorderRadius(),
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: '16px',
    lineHeight: 1.5,
    color: themeVars.textPrimary,
  };

  const headerStyle: React.CSSProperties = {
    padding: '24px 32px',
    backgroundColor: isDark ? colors.violetPrimary : '#f3e8ff',
  };

  const bodyStyle: React.CSSProperties = {
    padding: '32px 32px 40px',
  };

  const footerStyle: React.CSSProperties = {
    padding: '16px 32px 24px',
    backgroundColor: themeVars.surface,
    borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
  };

  const textStyle: React.CSSProperties = {
    margin: '0 0 8px',
    fontSize: '16px',
    lineHeight: 1.5,
    color: themeVars.textPrimary,
  };

  const subTextStyle: React.CSSProperties = {
    margin: '4px 0 0',
    fontSize: '14px',
    lineHeight: 1.4,
    color: themeVars.textSecondary,
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: colors.violetPrimary,
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          {logo && <span style={{ marginRight: '16px' }}>{logo}</span>}
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: colors.violetPrimary }}>
            New Login Alert
          </h1>
        </div>
      </header>

      <main style={bodyStyle}>
        <p style={textStyle}>Hello,</p>
        
        {email && (
          <>
            <p style={subTextStyle}>
              We detected a new login attempt for your account:
            </p>
            <div style={{ 
              ...textStyle, 
              backgroundColor: themeVars.surface, 
              padding: '12px 16px', 
              borderRadius: getBorderRadius(),
              margin: '8px 0' 
            }}>
              <strong>Email:</strong> {email}
            </div>
          </>
        )}

        {(ip || device) && (
          <>
            <p style={subTextStyle}>
              Login details:
            </p>
            {ip && (
              <div style={{ 
                ...textStyle, 
                backgroundColor: themeVars.surface, 
                padding: '12px 16px', 
                borderRadius: getBorderRadius(),
                margin: '8px 0' 
              }}>
                <strong>IP Address:</strong> {ip}
              </div>
            )}
            {device && (
              <div style={{ 
                ...textStyle, 
                backgroundColor: themeVars.surface, 
                padding: '12px 16px', 
                borderRadius: getBorderRadius(),
                margin: '8px 0' 
              }}>
                <strong>Device:</strong> {device}
              </div>
            )}
          </>
        )}

        {timestamp && (
          <p style={subTextStyle}>
            Time of login: {new Date(timestamp).toLocaleString()}
          </p>
        )}

        <p style={{ ...textStyle, marginTop: '24px' }}>
          If this wasn't you, please secure your account immediately by changing your password.
        </p>
      </main>

      <footer style={footerStyle}>
        {supportUrl && (
          <>
            <p style={{ margin: 0, fontSize: '14px', color: themeVars.textSecondary }}>
              Need help?{' '}
              <a 
                href={supportUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Contact Support
              </a>
            </p>
          </>
        )}
        
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: themeVars.textSecondary }}>
          © {new Date().getFullYear()} Syntheon. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default newLoginAlert;
